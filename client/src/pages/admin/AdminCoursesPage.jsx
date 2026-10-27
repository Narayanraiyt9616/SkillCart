import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, BookOpen, Eye, CheckCircle2 } from 'lucide-react';
import API from '../../services/api';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';

export const AdminCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editCourse, setEditCourse] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Web Development',
    difficulty: 'Intermediate',
    duration: 60,
    passingPercentage: 70,
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
  });

  const { addToast } = useToast();

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await API.get('/courses?includeDrafts=true&limit=100');
      if (res.data.success) {
        setCourses(res.data.courses);
      }
    } catch (err) {
      console.error('[Admin Courses Error]', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleOpenCreateModal = () => {
    setEditCourse(null);
    setFormData({
      title: '',
      description: '',
      category: 'Web Development',
      difficulty: 'Intermediate',
      duration: 60,
      passingPercentage: 70,
      thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (course) => {
    setEditCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      category: course.category,
      difficulty: course.difficulty,
      duration: course.duration,
      passingPercentage: course.passingPercentage,
      thumbnail: course.thumbnail,
    });
    setShowModal(true);
  };

  const handleSaveCourse = async (e) => {
    e.preventDefault();
    try {
      if (editCourse) {
        await API.put(`/courses/${editCourse._id}`, formData);
        addToast('Course updated successfully!', 'success');
      } else {
        await API.post('/courses', formData);
        addToast('New course created successfully!', 'success');
      }
      setShowModal(false);
      fetchCourses();
    } catch (err) {
      addToast(err.response?.data?.message || 'Error saving course', 'error');
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course and all its questions?')) return;
    try {
      await API.delete(`/courses/${id}`);
      addToast('Course deleted', 'info');
      fetchCourses();
    } catch (err) {
      addToast('Failed to delete course', 'error');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Certification Courses Manager</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Create, edit, or publish certification exams across tech categories.
            </p>
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="flex items-center space-x-2 px-5 py-3 rounded-2xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Course</span>
          </button>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 uppercase font-bold text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-4">Course</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Difficulty</th>
                  <th className="p-4">Duration</th>
                  <th className="p-4">Pass Threshold</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {courses.map((course) => (
                  <tr key={course._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-4 font-bold text-slate-900 dark:text-white flex items-center space-x-3">
                      <img src={course.thumbnail} alt={course.title} className="w-10 h-10 rounded-xl object-cover" />
                      <span>{course.title}</span>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">{course.category}</td>
                    <td className="p-4">{course.difficulty}</td>
                    <td className="p-4">{course.duration} mins</td>
                    <td className="p-4 font-bold text-emerald-600">{course.passingPercentage}%</td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(course)}
                        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCourse(course._id)}
                        className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950 hover:bg-rose-100 text-rose-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editCourse ? 'Edit Certification Course' : 'Create New Certification Course'}
      >
        <form onSubmit={handleSaveCourse} className="space-y-4 text-slate-900 dark:text-white text-xs">
          <div>
            <label className="block font-bold mb-1">Course Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            />
          </div>

          <div>
            <label className="block font-bold mb-1">Description</label>
            <textarea
              rows={3}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              >
                <option value="Web Development">Web Development</option>
                <option value="Software Engineering">Software Engineering</option>
                <option value="Data & Analytics">Data & Analytics</option>
                <option value="AI & Machine Learning">AI & Machine Learning</option>
                <option value="Cloud & DevOps">Cloud & DevOps</option>
                <option value="Cyber Security">Cyber Security</option>
                <option value="Programming">Programming</option>
                <option value="UI/UX">UI/UX</option>
              </select>
            </div>

            <div>
              <label className="block font-bold mb-1">Difficulty</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold mb-1">Duration (Minutes)</label>
              <input
                type="number"
                required
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="block font-bold mb-1">Passing Threshold (%)</label>
              <input
                type="number"
                required
                value={formData.passingPercentage}
                onChange={(e) => setFormData({ ...formData, passingPercentage: parseInt(e.target.value) })}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl font-bold text-white bg-rose-600 hover:bg-rose-700"
          >
            Save Course
          </button>
        </form>
      </Modal>
    </AdminLayout>
  );
};
