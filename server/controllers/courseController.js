import Course from '../models/Course.js';
import Question from '../models/Question.js';
import { UG_COURSES, getAllSkillsList, findSkillBySlug } from '../../client/src/data/ugCoursesData.js';
import { generateQuestionBankForSkill } from '../utils/questionBankGenerator.js';

// @desc Get all courses with search, filter, sort & pagination
// @route GET /api/courses
export const getCourses = async (req, res) => {
  try {
    const { search, category, difficulty, sort, page = 1, limit = 12 } = req.query;

    const query = {};

    if (search) {
      const cleanSearch = search.trim();
      query.$or = [
        { title: { $regex: cleanSearch, $options: 'i' } },
        { slug: { $regex: cleanSearch, $options: 'i' } },
        { category: { $regex: cleanSearch, $options: 'i' } },
        { description: { $regex: cleanSearch, $options: 'i' } },
      ];
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (difficulty && difficulty !== 'All') {
      query.difficulty = difficulty;
    }

    if (!req.query.includeDrafts) {
      query.status = 'published';
    }

    let sortOptions = { createdAt: -1 };
    if (sort === 'popular') sortOptions = { enrolledCount: -1 };
    if (sort === 'duration-asc') sortOptions = { duration: 1 };
    if (sort === 'duration-desc') sortOptions = { duration: -1 };

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    let totalCourses = await Course.countDocuments(query);
    let courses = await Course.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    // Fallback: If DB query returns 0 results for a specific search term, check ugCoursesData
    if (courses.length === 0 && search) {
      const matchedSkill = findSkillBySlug(search);
      if (matchedSkill) {
        // Try finding or creating the course for this skill on-the-fly
        let course = await Course.findOne({ slug: matchedSkill.slug });
        if (!course) {
          course = await Course.create({
            title: matchedSkill.certificationTitle || `${matchedSkill.name} Certification`,
            slug: matchedSkill.slug,
            description: matchedSkill.desc || `Official certification track for ${matchedSkill.name}`,
            category: matchedSkill.fieldName || matchedSkill.degreeTitle || 'General',
            difficulty: 'Intermediate',
            duration: 45,
            questionCount: 25,
            passingPercentage: 70,
            thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
            status: 'published',
            enrolledCount: 150,
            syllabus: [
              { moduleTitle: `${matchedSkill.name} Core Fundamentals`, topics: ['Foundational Concepts', 'Standard Principles', 'Architecture'] },
              { moduleTitle: `${matchedSkill.name} Advanced Applications`, topics: ['Practical Workflows', 'Performance Optimization', 'Best Practices'] }
            ]
          });
        }
        courses = [course];
        totalCourses = 1;
      }
    }

    res.json({
      success: true,
      count: courses.length,
      totalCourses,
      totalPages: Math.ceil(totalCourses / limitNum) || 1,
      currentPage: pageNum,
      courses,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get single course by ID or Slug
// @route GET /api/courses/:id
export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    let course;

    const cleanId = String(id).trim().toLowerCase();

    if (cleanId.match(/^[0-9a-fA-F]{24}$/)) {
      course = await Course.findById(cleanId);
    } else {
      course = await Course.findOne({ slug: cleanId });
    }

    // Fallback: If course is not found in DB, check ugCoursesData
    if (!course) {
      const matchedSkill = findSkillBySlug(cleanId);
      if (matchedSkill) {
        course = await Course.findOne({ slug: matchedSkill.slug });
        if (!course) {
          // Auto-create course record for this skill
          course = await Course.create({
            title: matchedSkill.certificationTitle || `${matchedSkill.name} Certification`,
            slug: matchedSkill.slug,
            description: matchedSkill.desc || `Official certification track for ${matchedSkill.name}`,
            category: matchedSkill.fieldName || matchedSkill.degreeTitle || 'General',
            difficulty: 'Intermediate',
            duration: 45,
            questionCount: 25,
            passingPercentage: 70,
            thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
            status: 'published',
            enrolledCount: 180,
            syllabus: [
              { moduleTitle: `${matchedSkill.name} Core Fundamentals`, topics: ['Foundational Concepts', 'Standard Principles', 'Architecture'] },
              { moduleTitle: `${matchedSkill.name} Advanced Applications`, topics: ['Practical Workflows', 'Performance Optimization', 'Best Practices'] }
            ]
          });
        }

        // Auto-seed question bank for this skill if no questions exist
        const existingQCount = await Question.countDocuments({
          $or: [
            { courseId: course._id },
            { skill: { $regex: matchedSkill.name, $options: 'i' } },
            { slug: matchedSkill.slug }
          ]
        });

        if (existingQCount === 0) {
          const questionsToInsert = generateQuestionBankForSkill(matchedSkill, course);
          await Question.insertMany(questionsToInsert);
        }
      }
    }

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course certification not found' });
    }

    // Get exact total available questions count for this course or skill
    const actualQuestionCount = await Question.countDocuments({
      $or: [
        { courseId: course._id },
        { skill: { $regex: course.title.replace(' Certification', ''), $options: 'i' } },
        { course: { $regex: course.title, $options: 'i' } },
        { slug: course.slug }
      ]
    });

    res.json({
      success: true,
      course: {
        ...course.toObject(),
        actualQuestionCount: actualQuestionCount || 25,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Create new course (Admin)
// @route POST /api/courses
export const createCourse = async (req, res) => {
  try {
    const { title, description, category, difficulty, duration, questionCount, passingPercentage, syllabus, thumbnail, icon, status } = req.body;

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const courseExists = await Course.findOne({ slug });
    if (courseExists) {
      return res.status(400).json({ success: false, message: 'Course with a similar title already exists' });
    }

    const course = await Course.create({
      title,
      slug,
      description,
      category,
      difficulty,
      duration,
      questionCount,
      passingPercentage,
      syllabus: syllabus || [],
      thumbnail,
      icon,
      status: status || 'published',
    });

    res.status(201).json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Update course (Admin)
// @route PUT /api/courses/:id
export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    let course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (req.body.title && req.body.title !== course.title) {
      req.body.slug = req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    course = await Course.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Delete course (Admin)
// @route DELETE /api/courses/:id
export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    await Course.findByIdAndDelete(id);
    await Question.deleteMany({ courseId: id });

    res.json({ success: true, message: 'Course and related questions deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
