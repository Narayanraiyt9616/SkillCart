import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: false,
  },
  course: {
    type: String,
    default: '',
  },
  field: {
    type: String,
    default: '',
  },
  specialization: {
    type: String,
    default: '',
  },
  skill: {
    type: String,
    default: '',
  },
  module: {
    type: String,
    default: 'General',
  },
  topic: {
    type: String,
    default: '',
  },
  tags: [{
    type: String,
  }],
  question: {
    type: String,
    required: true,
  },
  options: [{
    type: String,
    required: true,
  }],
  correctAnswer: {
    type: mongoose.Schema.Types.Mixed, // Number or Array of numbers
    required: true,
  },
  type: {
    type: String,
    enum: ['single', 'multiple', 'true_false', 'scenario'],
    default: 'single',
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard', 'very-hard', 'Beginner', 'Intermediate', 'Advanced'],
    default: 'medium',
  },
  marks: {
    type: Number,
    default: 2,
  },
  explanation: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Question = mongoose.models.Question || mongoose.model('Question', questionSchema);
export default Question;
