import User from '../models/User.js';
import Course from '../models/Course.js';
import Question from '../models/Question.js';
import AssessmentAttempt from '../models/AssessmentAttempt.js';
import Certificate from '../models/Certificate.js';

// @desc Get Admin Dashboard Platform Stats
// @route GET /api/admin/stats
export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalCourses = await Course.countDocuments({});
    const totalQuestions = await Question.countDocuments({});
    const totalAssessments = await AssessmentAttempt.countDocuments({});
    const certificatesIssued = await Certificate.countDocuments({ status: 'VALID' });
    const revokedCertificates = await Certificate.countDocuments({ status: 'REVOKED' });
    const paidCertificates = await Certificate.countDocuments({ isPaid: true });
    const totalRevenue = paidCertificates * 29;

    const passedAttempts = await AssessmentAttempt.countDocuments({ status: 'PASSED' });
    const passRate = totalAssessments > 0 ? Math.round((passedAttempts / totalAssessments) * 100) : 0;

    // Recent attempts
    const recentAttempts = await AssessmentAttempt.find({})
      .populate('userId', 'name email profileImage')
      .populate('courseId', 'title')
      .sort({ startedAt: -1 })
      .limit(5);

    // Recent certificates
    const recentCertificates = await Certificate.find({})
      .populate('userId', 'name email')
      .populate('courseId', 'title')
      .sort({ issueDate: -1 })
      .limit(10);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalCourses,
        totalQuestions,
        totalAssessments,
        certificatesIssued,
        revokedCertificates,
        paidCertificates,
        totalRevenue,
        passRate,
      },
      recentAttempts,
      recentCertificates,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
