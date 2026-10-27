import mongoose from 'mongoose';

const syllabusModuleSchema = new mongoose.Schema({
  moduleTitle: { type: String, required: true },
  topics: [{ type: String }],
});

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  category: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Intermediate',
  },
  duration: {
    type: Number, // In minutes
    required: true,
    default: 60,
  },
  questionCount: {
    type: Number,
    required: true,
    default: 10,
  },
  passingPercentage: {
    type: Number,
    required: true,
    default: 70,
  },
  syllabus: [syllabusModuleSchema],
  icon: {
    type: String,
    default: 'Code',
  },
  thumbnail: {
    type: String,
    default: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
  },
  status: {
    type: String,
    enum: ['published', 'draft'],
    default: 'published',
  },
  enrolledCount: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    default: 499,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Course = mongoose.models.Course || mongoose.model('Course', courseSchema);
export default Course;
