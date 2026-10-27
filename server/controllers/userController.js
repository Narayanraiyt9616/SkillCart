import User from '../models/User.js';
import Certificate from '../models/Certificate.js';
import AssessmentAttempt from '../models/AssessmentAttempt.js';

// @desc Get logged in user profile
// @route GET /api/users/profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const certificatesCount = await Certificate.countDocuments({ userId: req.user._id, status: 'VALID' });
    const attemptsCount = await AssessmentAttempt.countDocuments({ userId: req.user._id });

    res.json({
      success: true,
      user,
      stats: {
        certificatesCount,
        attemptsCount,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Update user profile
// @route PUT /api/users/profile
export const updateProfile = async (req, res) => {
  try {
    const { name, bio, profileImage, skills } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (profileImage) user.profileImage = profileImage;
    if (skills && Array.isArray(skills)) user.skills = skills;

    await user.save();

    res.json({
      success: true,
      user,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get public user profile by username
// @route GET /api/users/public/:username
export const getPublicProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username: username.toLowerCase() }).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User profile not found' });
    }

    const certificates = await Certificate.find({ userId: user._id, status: 'VALID' })
      .populate('courseId', 'title category difficulty duration thumbnail icon')
      .sort({ issueDate: -1 });

    const totalPassed = await AssessmentAttempt.countDocuments({ userId: user._id, status: 'PASSED' });

    res.json({
      success: true,
      profile: {
        _id: user._id,
        name: user.name,
        username: user.username,
        profileImage: user.profileImage,
        bio: user.bio,
        skills: user.skills,
        createdAt: user.createdAt,
      },
      certificates,
      stats: {
        totalCertificates: certificates.length,
        totalPassed,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get all users (Admin)
// @route GET /api/users
export const getUsers = async (req, res) => {
  try {
    const { search } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query).select('-password').sort({ createdAt: -1 });

    // Attach counts for each user
    const usersWithStats = await Promise.all(
      users.map(async (u) => {
        const certCount = await Certificate.countDocuments({ userId: u._id, status: 'VALID' });
        const attemptCount = await AssessmentAttempt.countDocuments({ userId: u._id });
        return {
          ...u.toObject(),
          certCount,
          attemptCount,
        };
      })
    );

    res.json({
      success: true,
      count: usersWithStats.length,
      users: usersWithStats,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Toggle user suspension (Admin)
// @route PUT /api/users/:id/suspend
export const toggleUserSuspend = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot suspend an admin account' });
    }

    user.isSuspended = !user.isSuspended;
    await user.save();

    res.json({
      success: true,
      message: `User ${user.name} has been ${user.isSuspended ? 'suspended' : 'reactivated'}.`,
      isSuspended: user.isSuspended,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
