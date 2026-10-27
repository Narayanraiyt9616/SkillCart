import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
  certificateId: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  attemptId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AssessmentAttempt',
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  percentage: {
    type: Number,
    required: true,
  },
  grade: {
    type: String,
    required: true,
  },
  issueDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['VALID', 'REVOKED'],
    default: 'VALID',
  },
  verificationUrl: {
    type: String,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  paidAmount: {
    type: Number,
    default: 29,
  },
  transactionId: {
    type: String,
  },
  paymentDate: {
    type: Date,
  },
});

const Certificate = mongoose.models.Certificate || mongoose.model('Certificate', certificateSchema);
export default Certificate;
