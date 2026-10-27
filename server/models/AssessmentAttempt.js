import mongoose from 'mongoose';

const attemptQuestionSnapshotSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  module: String,
  question: String,
  options: [String],
  type: String,
  difficulty: String,
  marks: Number,
  explanation: String,
  correctAnswer: mongoose.Schema.Types.Mixed,
});

const userAnswerSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  selectedAnswer: mongoose.Schema.Types.Mixed, // Index or Array of Indices
  isCorrect: { type: Boolean, default: false },
  marksAwarded: { type: Number, default: 0 }
});

const skillBreakdownSchema = new mongoose.Schema({
  module: String,
  earned: Number,
  total: Number,
  percentage: Number,
});

const difficultyStatSchema = new mongoose.Schema({
  correct: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  percentage: { type: Number, default: 0 },
});

const difficultyBreakdownSchema = new mongoose.Schema({
  easy: difficultyStatSchema,
  medium: difficultyStatSchema,
  hard: difficultyStatSchema,
  veryHard: difficultyStatSchema,
});

const assessmentAttemptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: false,
  },
  difficultyMode: {
    type: String,
    enum: ['mixed', 'easy', 'medium', 'hard', 'very-hard'],
    default: 'mixed',
  },
  questions: [attemptQuestionSnapshotSchema],
  userAnswers: [userAnswerSchema],
  score: {
    type: Number,
    default: 0,
  },
  maxScore: {
    type: Number,
    default: 0,
  },
  percentage: {
    type: Number,
    default: 0,
  },
  grade: {
    type: String,
    enum: ['A+', 'A', 'B', 'C', 'F'],
    default: 'F',
  },
  status: {
    type: String,
    enum: ['IN_PROGRESS', 'PASSED', 'FAILED'],
    default: 'IN_PROGRESS',
  },
  correct: {
    type: Number,
    default: 0,
  },
  incorrect: {
    type: Number,
    default: 0,
  },
  skipped: {
    type: Number,
    default: 0,
  },
  timeTaken: {
    type: Number, // seconds
    default: 0,
  },
  skillBreakdown: [skillBreakdownSchema],
  difficultyBreakdown: difficultyBreakdownSchema,
  startedAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: {
    type: Date,
  }
});

const AssessmentAttempt = mongoose.models.AssessmentAttempt || mongoose.model('AssessmentAttempt', assessmentAttemptSchema);
export default AssessmentAttempt;
