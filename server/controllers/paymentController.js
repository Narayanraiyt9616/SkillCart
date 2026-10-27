import Payment from '../models/Payment.js';
import Course from '../models/Course.js';

// Helper to resolve Course by ID or Slug
const resolveCourse = async (courseIdOrSlug) => {
  const cleanId = String(courseIdOrSlug).trim().toLowerCase();
  let course;
  if (cleanId.match(/^[0-9a-fA-F]{24}$/)) {
    course = await Course.findById(cleanId);
  } else {
    course = await Course.findOne({ slug: cleanId });
  }
  return course;
};

// @desc Get payment status for a course by current user
// @route GET /api/payments/status/:courseId
export const getPaymentStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    const course = await resolveCourse(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Check if user already has a completed payment for this course
    const completedPayment = await Payment.findOne({
      userId,
      courseId: course._id,
      status: 'completed',
    });

    if (completedPayment) {
      return res.json({
        success: true,
        hasPaid: true,
        payment: completedPayment,
        course,
      });
    }

    res.json({
      success: true,
      hasPaid: false,
      course,
    });
  } catch (error) {
    console.error('[Get Payment Status Error]', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Initiate QR Code payment session (5 min expiry)
// @route POST /api/payments/initiate
export const initiatePayment = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user._id;

    const course = await resolveCourse(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Check if already completed
    const existingCompleted = await Payment.findOne({
      userId,
      courseId: course._id,
      status: 'completed',
    });

    if (existingCompleted) {
      return res.json({
        success: true,
        alreadyPaid: true,
        payment: existingCompleted,
        course,
      });
    }

    const price = course.price || 499;
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
    const upiId = 'rainarayan709@oksbi';
    const upiName = 'narayan rai';
    const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(upiName)}&am=${price}&cu=INR&tn=Course_${course.slug}`;

    const payment = await Payment.create({
      userId,
      courseId: course._id,
      amount: price,
      currency: 'INR',
      paymentMethod: 'QR_CODE',
      status: 'pending',
      upiId,
      expiresAt,
    });

    res.status(201).json({
      success: true,
      paymentId: payment._id,
      amount: price,
      currency: 'INR',
      upiId,
      upiName,
      upiUrl,
      qrImageUrl: '/certificate-qr.jpg',
      expiresAt,
      course: {
        _id: course._id,
        title: course.title,
        price: price,
        thumbnail: course.thumbnail,
      },
    });
  } catch (error) {
    console.error('[Initiate Payment Error]', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Verify/Confirm payment
// @route POST /api/payments/verify
export const verifyPayment = async (req, res) => {
  try {
    const { courseId, transactionId, paymentId } = req.body;
    const userId = req.user._id;

    const course = await resolveCourse(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const txId = transactionId || `TXN_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

    let payment;
    if (paymentId) {
      payment = await Payment.findById(paymentId);
    }

    if (!payment) {
      payment = await Payment.findOne({
        userId,
        courseId: course._id,
        status: 'pending',
      }).sort({ createdAt: -1 });
    }

    if (!payment) {
      payment = new Payment({
        userId,
        courseId: course._id,
        amount: course.price || 499,
        paymentMethod: 'QR_CODE',
      });
    }

    payment.status = 'completed';
    payment.transactionId = txId;
    await payment.save();

    // Increment enrolled count on course
    await Course.findByIdAndUpdate(course._id, { $inc: { enrolledCount: 1 } });

    res.json({
      success: true,
      message: 'Payment verified successfully! Access granted.',
      payment,
    });
  } catch (error) {
    console.error('[Verify Payment Error]', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
