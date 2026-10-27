import Course from '../models/Course.js';
import Question from '../models/Question.js';
import AssessmentAttempt from '../models/AssessmentAttempt.js';
import Certificate from '../models/Certificate.js';
import User from '../models/User.js';
import Payment from '../models/Payment.js';
import { generateCertificateId } from '../utils/certificateIdGenerator.js';
import { MAX_QUESTIONS_PER_TEST, MIXED_DIFFICULTY_DISTRIBUTION, NORMALIZE_DIFFICULTY } from '../config/assessmentConfig.js';
import { findSkillBySlug } from '../../client/src/data/ugCoursesData.js';
import { generateQuestionBankForSkill } from '../utils/questionBankGenerator.js';

// Helper function to shuffle array
const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

// @desc Start Assessment (Generates balanced 25-question assessment attempt)
// @route POST /api/assessments/start
export const startAssessment = async (req, res) => {
  try {
    const { courseId, skill, course: courseName, field, difficultyMode = 'mixed' } = req.body;
    const userId = req.user._id;

    let courseObj = null;
    let matchedSkill = null;
    let queryConditions = [];

    const targetIdOrSlug = courseId || skill || courseName;

    if (targetIdOrSlug) {
      const cleanTarget = String(targetIdOrSlug).trim().toLowerCase();

      if (cleanTarget.match(/^[0-9a-fA-F]{24}$/)) {
        courseObj = await Course.findById(cleanTarget);
      } else {
        courseObj = await Course.findOne({ slug: cleanTarget });
      }

      matchedSkill = findSkillBySlug(cleanTarget);

      if (!courseObj && matchedSkill) {
        courseObj = await Course.findOne({ slug: matchedSkill.slug });
        if (!courseObj) {
          courseObj = await Course.create({
            title: matchedSkill.certificationTitle || `${matchedSkill.name} Certification`,
            slug: matchedSkill.slug,
            description: matchedSkill.desc || `Official certification track for ${matchedSkill.name}`,
            category: matchedSkill.fieldName || matchedSkill.degreeTitle || 'General',
            difficulty: 'Intermediate',
            duration: 45,
            questionCount: 25,
            passingPercentage: 70,
            thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
            status: 'published',
            enrolledCount: 150,
            syllabus: [
              { moduleTitle: `${matchedSkill.name} Core Fundamentals`, topics: ['Foundational Concepts', 'Standard Principles', 'Architecture'] },
              { moduleTitle: `${matchedSkill.name} Advanced Applications`, topics: ['Practical Workflows', 'Performance Optimization', 'Best Practices'] }
            ]
          });
        }
      }
    }

    if (courseObj) {
      queryConditions.push({ courseId: courseObj._id });
      queryConditions.push({ course: { $regex: courseObj.title, $options: 'i' } });
      queryConditions.push({ slug: courseObj.slug });
      if (courseObj.title) {
        const baseTitle = courseObj.title.replace(' Certification', '');
        queryConditions.push({ skill: { $regex: baseTitle, $options: 'i' } });
      }
    }

    if (skill) {
      queryConditions.push({ skill: { $regex: skill, $options: 'i' } });
      queryConditions.push({ module: { $regex: skill, $options: 'i' } });
      queryConditions.push({ topic: { $regex: skill, $options: 'i' } });
    }

    if (courseName) {
      queryConditions.push({ course: { $regex: courseName, $options: 'i' } });
    }

    if (field) {
      queryConditions.push({ field: { $regex: field, $options: 'i' } });
      queryConditions.push({ specialization: { $regex: field, $options: 'i' } });
    }

    let allQuestions = [];
    if (queryConditions.length > 0) {
      allQuestions = await Question.find({ $or: queryConditions });
    }

    // If no questions found in DB for this course/skill, auto-generate question bank
    if (allQuestions.length === 0 && (matchedSkill || courseObj)) {
      const skillMeta = matchedSkill || {
        name: courseObj.title.replace(' Certification', ''),
        slug: courseObj.slug,
        degreeTitle: courseObj.category,
        fieldName: courseObj.category
      };
      const generatedQs = generateQuestionBankForSkill(skillMeta, courseObj);
      await Question.insertMany(generatedQs);

      if (courseObj) {
        queryConditions.push({ courseId: courseObj._id });
      }
      queryConditions.push({ slug: skillMeta.slug });

      allQuestions = await Question.find({ $or: queryConditions });
    }

    // Fallback: If query still produced no questions, get all available questions from DB
    if (allQuestions.length === 0) {
      allQuestions = await Question.find({});
    }

    if (allQuestions.length === 0) {
      return res.status(400).json({ success: false, message: 'No questions available for this assessment track yet.' });
    }

    // Categorize questions by normalized difficulty
    const pools = {
      easy: [],
      medium: [],
      hard: [],
      'very-hard': [],
    };

    allQuestions.forEach((q) => {
      const normDiff = NORMALIZE_DIFFICULTY(q.difficulty);
      pools[normDiff].push(q);
    });

    let selectedQuestions = [];

    if (difficultyMode === 'mixed') {
      // Balanced distribution: 5 Easy, 8 Medium, 7 Hard, 5 Very Hard = 25
      const targets = MIXED_DIFFICULTY_DISTRIBUTION;

      const easyP = shuffleArray(pools.easy);
      const medP = shuffleArray(pools.medium);
      const hardP = shuffleArray(pools.hard);
      const vHardP = shuffleArray(pools['very-hard']);

      const pickedEasy = easyP.slice(0, targets.easy);
      const pickedMed = medP.slice(0, targets.medium);
      const pickedHard = hardP.slice(0, targets.hard);
      const pickedVHard = vHardP.slice(0, targets['very-hard']);

      selectedQuestions = [...pickedEasy, ...pickedMed, ...pickedHard, ...pickedVHard];

      // If we fall short of 25 due to low pool count in a specific tier, backfill from remaining unused questions
      if (selectedQuestions.length < MAX_QUESTIONS_PER_TEST && selectedQuestions.length < allQuestions.length) {
        const selectedIds = new Set(selectedQuestions.map((q) => String(q._id)));
        const remainingQuestions = shuffleArray(allQuestions.filter((q) => !selectedIds.has(String(q._id))));
        const needed = Math.min(MAX_QUESTIONS_PER_TEST - selectedQuestions.length, remainingQuestions.length);
        selectedQuestions.push(...remainingQuestions.slice(0, needed));
      }
    } else {
      // Custom Difficulty Mode (easy, medium, hard, very-hard)
      const targetDiff = NORMALIZE_DIFFICULTY(difficultyMode);
      const targetPool = shuffleArray(pools[targetDiff] || []);
      selectedQuestions = targetPool.slice(0, MAX_QUESTIONS_PER_TEST);

      // Backfill from other pools if target pool has fewer questions than 25
      if (selectedQuestions.length < MAX_QUESTIONS_PER_TEST && selectedQuestions.length < allQuestions.length) {
        const selectedIds = new Set(selectedQuestions.map((q) => String(q._id)));
        const remainingQuestions = shuffleArray(allQuestions.filter((q) => !selectedIds.has(String(q._id))));
        const needed = Math.min(MAX_QUESTIONS_PER_TEST - selectedQuestions.length, remainingQuestions.length);
        selectedQuestions.push(...remainingQuestions.slice(0, needed));
      }
    }

    // Enforce global maximum ceiling of 25 questions
    selectedQuestions = selectedQuestions.slice(0, MAX_QUESTIONS_PER_TEST);

    // Randomize question order after selection so difficulty pattern is unpredictable
    selectedQuestions = shuffleArray(selectedQuestions);

    // Snapshot full question data for attempt grading
    const questionSnapshots = selectedQuestions.map((q) => ({
      questionId: q._id,
      module: q.module || q.skill || 'General',
      question: q.question,
      options: q.options,
      type: q.type || 'single',
      difficulty: NORMALIZE_DIFFICULTY(q.difficulty),
      marks: q.marks || 2,
      explanation: q.explanation || '',
      correctAnswer: q.correctAnswer,
    }));

    const attemptData = {
      userId,
      difficultyMode,
      questions: questionSnapshots,
      status: 'IN_PROGRESS',
      startedAt: new Date(),
    };

    if (courseObj) {
      attemptData.courseId = courseObj._id;
    } else if (courseId && courseId.match(/^[0-9a-fA-F]{24}$/)) {
      attemptData.courseId = courseId;
    }

    const attempt = await AssessmentAttempt.create(attemptData);

    // Client question representation (REMOVE correctAnswer)
    const clientQuestions = questionSnapshots.map((q) => ({
      questionId: q.questionId,
      module: q.module,
      question: q.question,
      options: q.options,
      type: q.type,
      difficulty: q.difficulty,
      marks: q.marks,
    }));

    res.status(201).json({
      success: true,
      attemptId: attempt._id,
      course: {
        _id: courseObj?._id || courseId || 'custom',
        title: skill || courseObj?.title || courseName || 'Certification Assessment',
        duration: courseObj?.duration || 45,
        passingPercentage: courseObj?.passingPercentage || 70,
        totalQuestions: clientQuestions.length,
      },
      difficultyMode,
      questions: clientQuestions,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Submit Assessment & Calculate Score, Grade & Difficulty Breakdown
// @route POST /api/assessments/submit
export const submitAssessment = async (req, res) => {
  try {
    const { attemptId, userAnswers, timeTaken } = req.body;

    const attempt = await AssessmentAttempt.findById(attemptId).populate('courseId');
    if (!attempt) {
      return res.status(404).json({ success: false, message: 'Assessment attempt not found' });
    }

    if (attempt.status !== 'IN_PROGRESS') {
      return res.status(400).json({ success: false, message: 'Assessment already submitted' });
    }

    const courseObj = attempt.courseId;
    const questions = attempt.questions;

    let score = 0;
    let maxScore = 0;
    let correctCount = 0;
    let incorrectCount = 0;
    let skippedCount = 0;

    const answersMap = new Map();
    if (Array.isArray(userAnswers)) {
      userAnswers.forEach((ans) => {
        answersMap.set(String(ans.questionId), ans.selectedAnswer);
      });
    }

    const evaluatedAnswers = [];
    const moduleStats = {}; // { [moduleName]: { earned: 0, total: 0 } }
    const diffStats = {
      easy: { correct: 0, total: 0 },
      medium: { correct: 0, total: 0 },
      hard: { correct: 0, total: 0 },
      veryHard: { correct: 0, total: 0 },
    };

    questions.forEach((q) => {
      const qIdStr = String(q.questionId);
      const userSel = answersMap.get(qIdStr);
      const qMarks = q.marks || 2;
      const mod = q.module || 'General';
      const normDiff = NORMALIZE_DIFFICULTY(q.difficulty);

      let diffKey = 'medium';
      if (normDiff === 'easy') diffKey = 'easy';
      if (normDiff === 'medium') diffKey = 'medium';
      if (normDiff === 'hard') diffKey = 'hard';
      if (normDiff === 'very-hard') diffKey = 'veryHard';

      diffStats[diffKey].total += 1;

      if (!moduleStats[mod]) {
        moduleStats[mod] = { earned: 0, total: 0 };
      }
      moduleStats[mod].total += qMarks;
      maxScore += qMarks;

      if (userSel === undefined || userSel === null || userSel === '') {
        skippedCount++;
        evaluatedAnswers.push({
          questionId: q.questionId,
          selectedAnswer: null,
          isCorrect: false,
          marksAwarded: 0,
        });
      } else {
        let isCorrect = false;

        if (q.type === 'multiple' && Array.isArray(q.correctAnswer)) {
          const userArr = Array.isArray(userSel) ? userSel.sort() : [userSel].sort();
          const targetArr = [...q.correctAnswer].sort();
          isCorrect = JSON.stringify(userArr) === JSON.stringify(targetArr);
        } else {
          isCorrect = String(userSel) === String(q.correctAnswer);
        }

        if (isCorrect) {
          correctCount++;
          score += qMarks;
          moduleStats[mod].earned += qMarks;
          diffStats[diffKey].correct += 1;

          evaluatedAnswers.push({
            questionId: q.questionId,
            selectedAnswer: userSel,
            isCorrect: true,
            marksAwarded: qMarks,
          });
        } else {
          incorrectCount++;
          evaluatedAnswers.push({
            questionId: q.questionId,
            selectedAnswer: userSel,
            isCorrect: false,
            marksAwarded: 0,
          });
        }
      }
    });

    const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
    const passingPct = courseObj?.passingPercentage || 70;
    const isPassed = percentage >= passingPct;

    let grade = 'F';
    if (percentage >= 90) grade = 'A+';
    else if (percentage >= 80) grade = 'A';
    else if (percentage >= 70) grade = 'B';
    else if (percentage >= 60) grade = 'C';

    const skillBreakdown = Object.keys(moduleStats).map((mod) => {
      const { earned, total } = moduleStats[mod];
      const modPct = total > 0 ? Math.round((earned / total) * 100) : 0;
      return {
        module: mod,
        earned,
        total,
        percentage: modPct,
      };
    });

    const difficultyBreakdown = {
      easy: {
        correct: diffStats.easy.correct,
        total: diffStats.easy.total,
        percentage: diffStats.easy.total > 0 ? Math.round((diffStats.easy.correct / diffStats.easy.total) * 100) : 0,
      },
      medium: {
        correct: diffStats.medium.correct,
        total: diffStats.medium.total,
        percentage: diffStats.medium.total > 0 ? Math.round((diffStats.medium.correct / diffStats.medium.total) * 100) : 0,
      },
      hard: {
        correct: diffStats.hard.correct,
        total: diffStats.hard.total,
        percentage: diffStats.hard.total > 0 ? Math.round((diffStats.hard.correct / diffStats.hard.total) * 100) : 0,
      },
      veryHard: {
        correct: diffStats.veryHard.correct,
        total: diffStats.veryHard.total,
        percentage: diffStats.veryHard.total > 0 ? Math.round((diffStats.veryHard.correct / diffStats.veryHard.total) * 100) : 0,
      },
    };

    // Update attempt
    attempt.userAnswers = evaluatedAnswers;
    attempt.score = score;
    attempt.maxScore = maxScore;
    attempt.percentage = percentage;
    attempt.grade = grade;
    attempt.status = isPassed ? 'PASSED' : 'FAILED';
    attempt.correct = correctCount;
    attempt.incorrect = incorrectCount;
    attempt.skipped = skippedCount;
    attempt.timeTaken = timeTaken || 0;
    attempt.skillBreakdown = skillBreakdown;
    attempt.difficultyBreakdown = difficultyBreakdown;
    attempt.completedAt = new Date();

    await attempt.save();

    if (courseObj) {
      await Course.findByIdAndUpdate(courseObj._id, { $inc: { enrolledCount: 1 } });
    }

    let certificate = null;
    if (isPassed) {
      const existingCert = await Certificate.findOne({ attemptId: attempt._id });
      if (existingCert) {
        certificate = existingCert;
      } else {
        const certTitle = courseObj?.title || 'Skill Certification';
        const certId = generateCertificateId(certTitle);
        const verificationUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify/${certId}`;

        certificate = await Certificate.create({
          certificateId: certId,
          userId: attempt.userId,
          courseId: courseObj?._id || null,
          attemptId: attempt._id,
          score,
          percentage,
          grade,
          issueDate: new Date(),
          status: 'VALID',
          verificationUrl,
        });
      }

      const user = await User.findById(attempt.userId);
      if (user) {
        const titleName = courseObj?.title || 'Skill Certification';
        const skillIdx = user.skills.findIndex((s) => s.name.toLowerCase() === titleName.toLowerCase());
        if (skillIdx >= 0) {
          user.skills[skillIdx].score = Math.max(user.skills[skillIdx].score, percentage);
        } else {
          user.skills.push({ name: titleName, level: 'Advanced', score: percentage });
        }
        await user.save();
      }
    }

    res.json({
      success: true,
      result: {
        attemptId: attempt._id,
        status: attempt.status,
        score,
        maxScore,
        percentage,
        grade,
        correct: correctCount,
        incorrect: incorrectCount,
        skipped: skippedCount,
        totalQuestions: questions.length,
        timeTaken: attempt.timeTaken,
        passingPercentage: passingPct,
        skillBreakdown,
        difficultyBreakdown,
        difficultyMode: attempt.difficultyMode,
        courseTitle: courseObj?.title || 'Skill Certification',
        certificateId: certificate ? certificate.certificateId : null,
        certificate,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get Result of an Assessment Attempt
// @route GET /api/assessments/:attemptId/result
export const getAttemptResult = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const attempt = await AssessmentAttempt.findById(attemptId)
      .populate('courseId')
      .populate('userId', 'name email');

    if (!attempt) {
      return res.status(404).json({ success: false, message: 'Result not found' });
    }

    const certificate = await Certificate.findOne({ attemptId: attempt._id });

    res.json({
      success: true,
      result: {
        attemptId: attempt._id,
        course: attempt.courseId,
        user: attempt.userId,
        status: attempt.status,
        score: attempt.score,
        maxScore: attempt.maxScore,
        percentage: attempt.percentage,
        grade: attempt.grade,
        correct: attempt.correct,
        incorrect: attempt.incorrect,
        skipped: attempt.skipped,
        totalQuestions: attempt.questions.length,
        timeTaken: attempt.timeTaken,
        skillBreakdown: attempt.skillBreakdown,
        difficultyBreakdown: attempt.difficultyBreakdown,
        difficultyMode: attempt.difficultyMode,
        startedAt: attempt.startedAt,
        completedAt: attempt.completedAt,
        certificate,
        questions: attempt.questions.map((q) => {
          const userAns = attempt.userAnswers.find((a) => String(a.questionId) === String(q.questionId));
          return {
            _id: q.questionId,
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
            selectedAnswer: userAns ? userAns.selectedAnswer : null,
            isCorrect: userAns ? userAns.isCorrect : false,
            explanation: q.explanation,
            module: q.module,
            difficulty: q.difficulty,
            marks: q.marks,
          };
        }),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get Logged-in User's Assessment History
// @route GET /api/assessments/my-attempts
export const getMyAttempts = async (req, res) => {
  try {
    const attempts = await AssessmentAttempt.find({ userId: req.user._id })
      .populate('courseId', 'title category thumbnail difficulty')
      .sort({ startedAt: -1 });

    res.json({
      success: true,
      count: attempts.length,
      attempts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
