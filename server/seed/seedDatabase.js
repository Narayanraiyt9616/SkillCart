import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Question from '../models/Question.js';
import AssessmentAttempt from '../models/AssessmentAttempt.js';
import Certificate from '../models/Certificate.js';
import { generateCertificateId } from '../utils/certificateIdGenerator.js';
import { getAllSkillsList } from '../../client/src/data/ugCoursesData.js';

dotenv.config();

// Helper to generate 25 questions per skill spanning 4 difficulty levels
const generateQuestionBankForSkill = (skill, courseDoc) => {
  const questions = [];
  const cId = courseDoc._id;
  const sName = skill.name;
  const sSlug = skill.slug;
  const dTitle = skill.degreeTitle;
  const fName = skill.fieldName;

  // 1. Easy Questions (5)
  for (let i = 1; i <= 5; i++) {
    questions.push({
      courseId: cId,
      course: dTitle,
      field: fName,
      specialization: fName,
      skill: sName,
      slug: sSlug,
      module: `${sName} Fundamentals`,
      question: `[Easy Q${i}] What is the primary foundational concept of ${sName} in ${fName}?`,
      options: [
        `Core principles and standard conventions of ${sName}`,
        `Unrelated legacy hardware protocols`,
        `Outdated manual calculation procedures`,
        `Non-standard experimental techniques`
      ],
      correctAnswer: 0,
      type: 'single',
      difficulty: 'easy',
      marks: 2,
      explanation: `${sName} is built upon core principles and standard conventions within ${fName}.`
    });
  }

  // 2. Medium Questions (8)
  for (let i = 1; i <= 8; i++) {
    questions.push({
      courseId: cId,
      course: dTitle,
      field: fName,
      specialization: fName,
      skill: sName,
      slug: sSlug,
      module: `${sName} Applications`,
      question: `[Medium Q${i}] In practical ${sName} workflows, how is key requirement #${i} typically managed?`,
      options: [
        `By applying systematic modular design and verified industry patterns`,
        `By completely disabling security protocols and error handling`,
        `By ignoring standard validation and documentation`,
        `By forcing single-threaded synchronous blocking calls`
      ],
      correctAnswer: 0,
      type: 'single',
      difficulty: 'medium',
      marks: 2,
      explanation: `Systematic modular design ensures scalability, robustness, and maintainability in ${sName}.`
    });
  }

  // 3. Hard Questions (7)
  for (let i = 1; i <= 7; i++) {
    questions.push({
      courseId: cId,
      course: dTitle,
      field: fName,
      specialization: fName,
      skill: sName,
      slug: sSlug,
      module: `${sName} Advanced Systems`,
      question: `[Hard Q${i}] When optimizing ${sName} performance under heavy workload scenario #${i}, which strategy yields maximum throughput?`,
      options: [
        `Optimizing resource allocation, caching, and algorithmic complexity`,
        `Increasing arbitrary timeouts without measuring execution metrics`,
        `Bypassing memory safety and data validation layers`,
        `Executing unindexed linear scans over large datasets`
      ],
      correctAnswer: 0,
      type: 'single',
      difficulty: 'hard',
      marks: 2,
      explanation: `Optimizing resource allocation and algorithmic efficiency is essential for high performance in ${sName}.`
    });
  }

  // 4. Very Hard Questions (5)
  for (let i = 1; i <= 5; i++) {
    questions.push({
      courseId: cId,
      course: dTitle,
      field: fName,
      specialization: fName,
      skill: sName,
      slug: sSlug,
      module: `${sName} Architecture & Edge Cases`,
      question: `[Very Hard Q${i}] Consider a complex distributed/enterprise edge-case in ${sName}. What is the root cause of subtle failure pattern #${i}?`,
      options: [
        `Race conditions, subtle state mutations, or non-atomic concurrency bottlenecks`,
        `Standard default configuration settings`,
        `Excessive automated test coverage`,
        `Using static typing instead of dynamic typing`
      ],
      correctAnswer: 0,
      type: 'single',
      difficulty: 'very-hard',
      marks: 2,
      explanation: `Deep diagnostic issues in ${sName} stem from subtle concurrency bottlenecks, state mutations, or race conditions.`
    });
  }

  return questions;
};

const ATLAS_URI = 'mongodb://rainarayan709_db_user:Lw3q98VG20tjvwop@ac-oqmjv60-shard-00-00.vktecko.mongodb.net:27017,ac-oqmjv60-shard-00-01.vktecko.mongodb.net:27017,ac-oqmjv60-shard-00-02.vktecko.mongodb.net:27017/skillcert?ssl=true&replicaSet=atlas-gfed1v-shard-0&authSource=admin&retryWrites=true&w=majority';

const seedDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || ATLAS_URI;
    await mongoose.connect(connStr);
    console.log('[Seeder] Connected to MongoDB...');

    // Clear existing collections
    await User.deleteMany({});
    await Course.deleteMany({});
    await Question.deleteMany({});
    await AssessmentAttempt.deleteMany({});
    await Certificate.deleteMany({});

    // Create Admin user
    const adminUser = await User.create({
      name: 'SkillCert Admin',
      username: 'admin_official',
      email: 'admin@skillcert.com',
      password: 'Admin@123',
      role: 'admin',
      bio: 'Platform Administrator & Head of Certification Board.',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    });

    // Create Learner user
    const learnerUser = await User.create({
      name: 'Manish Kumar',
      username: 'manish_kumar',
      email: 'learner@skillcert.com',
      password: 'User@123',
      role: 'user',
      bio: 'Full Stack Software Engineer & Tech Certification Enthusiast.',
      profileImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300',
      skills: [
        { name: 'Web Development', level: 'Advanced', score: 90 },
        { name: 'JavaScript & Modern Web', level: 'Advanced', score: 88 },
        { name: 'Financial Accounting', level: 'Intermediate', score: 82 },
      ]
    });

    console.log('[Seeder] Users created: admin@skillcert.com / learner@skillcert.com');

    // Get complete list of all UG skills
    const allSkills = getAllSkillsList();
    console.log(`[Seeder] Registering ${allSkills.length} skill certifications across 12 UG degrees...`);

    const coursesToInsert = allSkills.map((sk) => ({
      title: sk.certificationTitle || `${sk.name} Certification`,
      slug: sk.slug,
      description: sk.desc,
      category: sk.fieldName || sk.degreeTitle,
      difficulty: 'Intermediate',
      duration: 45,
      questionCount: 25,
      passingPercentage: 70,
      icon: 'Award',
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
      status: 'published',
      enrolledCount: Math.floor(Math.random() * 800) + 120,
    }));

    const createdCourses = await Course.insertMany(coursesToInsert);
    console.log(`[Seeder] Successfully created ${createdCourses.length} Courses in MongoDB!`);

    const courseMap = {};
    createdCourses.forEach((c) => {
      courseMap[c.slug] = c;
    });

    // Generate 25 questions per skill
    const allQuestions = [];
    allSkills.forEach((sk) => {
      const cDoc = courseMap[sk.slug];
      if (cDoc) {
        const qList = generateQuestionBankForSkill(sk, cDoc);
        allQuestions.push(...qList);
      }
    });

    await Question.insertMany(allQuestions);
    console.log(`[Seeder] Successfully generated & inserted ${allQuestions.length} Questions (25 per skill)!`);

    // Create a demo passed assessment & certificate for learner
    const webDevCourse = courseMap['web-development'];
    if (webDevCourse) {
      const wdQuestions = await Question.find({ courseId: webDevCourse._id }).limit(25);

      const questionSnapshots = wdQuestions.map(q => ({
        questionId: q._id,
        module: q.module,
        question: q.question,
        options: q.options,
        type: q.type,
        difficulty: q.difficulty,
        marks: q.marks,
        explanation: q.explanation,
        correctAnswer: q.correctAnswer
      }));

      const userAnswers = wdQuestions.map(q => ({
        questionId: q._id,
        selectedAnswer: q.correctAnswer,
        isCorrect: true,
        marksAwarded: q.marks || 2
      }));

      const attempt = await AssessmentAttempt.create({
        userId: learnerUser._id,
        courseId: webDevCourse._id,
        difficultyMode: 'mixed',
        questions: questionSnapshots,
        userAnswers,
        score: 50,
        maxScore: 50,
        percentage: 100,
        grade: 'A+',
        status: 'PASSED',
        correct: 25,
        incorrect: 0,
        skipped: 0,
        timeTaken: 1120,
        skillBreakdown: [
          { module: 'Web Development Fundamentals', earned: 10, total: 10, percentage: 100 },
          { module: 'Web Development Applications', earned: 16, total: 16, percentage: 100 },
          { module: 'Web Development Advanced Systems', earned: 14, total: 14, percentage: 100 },
          { module: 'Web Development Architecture & Edge Cases', earned: 10, total: 10, percentage: 100 },
        ],
        difficultyBreakdown: {
          easy: { correct: 5, total: 5, percentage: 100 },
          medium: { correct: 8, total: 8, percentage: 100 },
          hard: { correct: 7, total: 7, percentage: 100 },
          veryHard: { correct: 5, total: 5, percentage: 100 },
        },
        completedAt: new Date(),
      });

      const certId = 'SC-BTECH-CSE-2026-X91';
      await Certificate.create({
        certificateId: certId,
        userId: learnerUser._id,
        courseId: webDevCourse._id,
        attemptId: attempt._id,
        score: 50,
        percentage: 100,
        grade: 'A+',
        issueDate: new Date('2026-09-09'),
        status: 'VALID',
        verificationUrl: `http://localhost:5173/verify/${certId}`
      });

      console.log(`[Seeder] Created demo passed attempt & certificate (${certId}) for Manish Kumar.`);
    }

    console.log('[Seeder] Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('[Seeder Error]', error);
    process.exit(1);
  }
};

seedDB();
