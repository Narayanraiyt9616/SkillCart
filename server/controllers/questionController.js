import Question from '../models/Question.js';
import Course from '../models/Course.js';

// @desc Get questions for a course (Admin view includes correctAnswer, user assessment view strips it)
// @route GET /api/questions/course/:courseId
export const getQuestionsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const isAdmin = req.user && req.user.role === 'admin';

    let questions = await Question.find({ courseId });

    if (!isAdmin) {
      // Do NOT expose correct answer to standard users before assessment submission!
      questions = questions.map((q) => ({
        _id: q._id,
        courseId: q.courseId,
        module: q.module,
        question: q.question,
        options: q.options,
        type: q.type,
        difficulty: q.difficulty,
        marks: q.marks,
      }));
    }

    res.json({
      success: true,
      count: questions.length,
      questions,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Add new question to course (Admin)
// @route POST /api/questions
export const addQuestion = async (req, res) => {
  try {
    const { courseId, module, question, options, correctAnswer, type, difficulty, marks, explanation } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Target course not found' });
    }

    const newQuestion = await Question.create({
      courseId,
      module: module || 'General',
      question,
      options,
      correctAnswer,
      type: type || 'single',
      difficulty: difficulty || 'Intermediate',
      marks: marks || 2,
      explanation: explanation || '',
    });

    // Update questionCount in Course
    const count = await Question.countDocuments({ courseId });
    course.questionCount = count;
    await course.save();

    res.status(201).json({ success: true, question: newQuestion });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Update question (Admin)
// @route PUT /api/questions/:id
export const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    let question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    question = await Question.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

    res.json({ success: true, question });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Delete question (Admin)
// @route DELETE /api/questions/:id
export const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    const courseId = question.courseId;
    await Question.findByIdAndDelete(id);

    // Update questionCount in Course
    const course = await Course.findById(courseId);
    if (course) {
      const count = await Question.countDocuments({ courseId });
      course.questionCount = count;
      await course.save();
    }

    res.json({ success: true, message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
