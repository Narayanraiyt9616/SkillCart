import Certificate from '../models/Certificate.js';
import User from '../models/User.js';
import Course from '../models/Course.js';
import AssessmentAttempt from '../models/AssessmentAttempt.js';

// @desc Get logged-in user's certificates
// @route GET /api/certificates/my
export const getMyCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({ userId: req.user._id })
      .populate('courseId', 'title category difficulty duration thumbnail icon')
      .populate('userId', 'name email username profileImage')
      .sort({ issueDate: -1 });

    res.json({
      success: true,
      count: certificates.length,
      certificates,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get single certificate details by MongoDB ID or Certificate ID
// @route GET /api/certificates/:id
export const getCertificateById = async (req, res) => {
  try {
    const { id } = req.params;
    let certificate;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      certificate = await Certificate.findById(id)
        .populate('courseId')
        .populate('userId', 'name email username profileImage bio skills')
        .populate('attemptId');
    } else {
      certificate = await Certificate.findOne({ certificateId: id.toUpperCase() })
        .populate('courseId')
        .populate('userId', 'name email username profileImage bio skills')
        .populate('attemptId');
    }

    if (!certificate) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }

    res.json({
      success: true,
      certificate,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Public Verification endpoint for Certificates (No auth required)
// @route GET /api/certificates/verify/:certificateId
export const verifyCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;

    const certificate = await Certificate.findOne({ certificateId: certificateId.toUpperCase() })
      .populate('courseId', 'title category difficulty duration description icon')
      .populate('userId', 'name username profileImage');

    if (!certificate) {
      return res.status(404).json({
        success: false,
        verified: false,
        status: 'INVALID',
        message: 'No certificate found with the specified Certificate ID.',
      });
    }

    if (certificate.status === 'REVOKED') {
      return res.json({
        success: true,
        verified: false,
        status: 'REVOKED',
        message: 'This certificate has been revoked by SkillCert administration.',
        certificate: {
          certificateId: certificate.certificateId,
          userName: certificate.userId ? certificate.userId.name : 'Unknown Learner',
          courseTitle: certificate.courseId ? certificate.courseId.title : 'Course',
          issueDate: certificate.issueDate,
          score: certificate.score,
          percentage: certificate.percentage,
          grade: certificate.grade,
          status: 'REVOKED',
        },
      });
    }

    res.json({
      success: true,
      verified: true,
      status: 'VALID',
      message: 'Certificate successfully verified! Official SkillCert Credential.',
      certificate: {
        certificateId: certificate.certificateId,
        userName: certificate.userId ? certificate.userId.name : 'Learner',
        userUsername: certificate.userId ? certificate.userId.username : '',
        courseTitle: certificate.courseId ? certificate.courseId.title : 'Course',
        courseCategory: certificate.courseId ? certificate.courseId.category : 'General',
        courseDifficulty: certificate.courseId ? certificate.courseId.difficulty : 'Intermediate',
        issueDate: certificate.issueDate,
        score: certificate.score,
        percentage: certificate.percentage,
        grade: certificate.grade,
        status: 'VALID',
        verificationUrl: certificate.verificationUrl,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Revoke certificate (Admin)
// @route PUT /api/certificates/:id/revoke
export const revokeCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    const certificate = await Certificate.findById(id);

    if (!certificate) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }

    certificate.status = 'REVOKED';
    await certificate.save();

    res.json({
      success: true,
      message: `Certificate ${certificate.certificateId} has been revoked.`,
      certificate,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Restore certificate (Admin)
// @route PUT /api/certificates/:id/restore
export const restoreCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    const certificate = await Certificate.findById(id);

    if (!certificate) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }

    certificate.status = 'VALID';
    await certificate.save();

    res.json({
      success: true,
      message: `Certificate ${certificate.certificateId} has been restored to VALID status.`,
      certificate,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Initiate ₹29 QR Code payment for unlocking certificate
// @route POST /api/certificates/:id/pay-initiate
export const initiateCertificatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    let certificate;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      certificate = await Certificate.findById(id).populate('courseId');
    } else {
      certificate = await Certificate.findOne({ certificateId: id.toUpperCase() }).populate('courseId');
    }

    if (!certificate) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }

    if (certificate.isPaid) {
      return res.json({
        success: true,
        alreadyPaid: true,
        message: 'Certificate is already unlocked!',
        certificate,
      });
    }

    const price = 1; // ₹1 INR fee to unlock & download certificate
    const upiId = 'rainarayan709@oksbi';
    const upiName = 'narayan rai';
    const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(upiName)}&am=${price}&cu=INR&tn=Cert_${certificate.certificateId}`;
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes timer

    res.json({
      success: true,
      certificateId: certificate.certificateId,
      amount: price,
      currency: 'INR',
      upiId,
      upiName,
      upiUrl,
      qrImageUrl: '/certificate-qr.jpg',
      expiresAt,
      courseTitle: certificate.courseId?.title || 'Skill Certificate',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Verify ₹1 QR Code payment and unlock certificate
// @route POST /api/certificates/:id/pay-verify
export const verifyCertificatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { transactionId } = req.body;

    let certificate;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      certificate = await Certificate.findById(id);
    } else {
      certificate = await Certificate.findOne({ certificateId: id.toUpperCase() });
    }

    if (!certificate) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }

    const txId = transactionId?.trim() || `UPI_CERT_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

    certificate.isPaid = true;
    certificate.paidAmount = 1;
    certificate.transactionId = txId;
    certificate.paymentDate = new Date();
    await certificate.save();

    res.json({
      success: true,
      message: 'Payment of ₹1 verified successfully! Certificate unlocked for download.',
      certificate,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Admin Unlock Certificate (Manually set isPaid = true)
// @route PUT /api/certificates/:id/unlock
export const unlockCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    const certificate = await Certificate.findById(id);

    if (!certificate) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }

    certificate.isPaid = true;
    certificate.paidAmount = 29;
    certificate.transactionId = `ADMIN_UNLOCK_${Date.now()}`;
    certificate.paymentDate = new Date();
    await certificate.save();

    res.json({
      success: true,
      message: `Certificate ${certificate.certificateId} has been unlocked by Admin.`,
      certificate,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
