import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, HelpCircle } from 'lucide-react';
import API from '../../services/api';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';

export const AdminQuestionsPage = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editQ, setEditQ] = useState(null);

  const [formData, setFormData] = useState({
    course: 'B.Tech',
    field: 'Computer Science',
    skill: 'Web Development',
    module: 'Core Module',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    type: 'single',
    difficulty: 'medium',
    marks: 2,
    explanation: '',
  });

  const { addToast } = useToast();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await API.get('/courses?limit=100');
        if (res.data.success && res.data.courses.length > 0) {
          setCourses(res.data.courses);
          setSelectedCourseId(res.data.courses[0]._id);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCourses();
  }, []);

  const fetchQuestions = async (cId) => {
    if (!cId) return;
    setLoading(true);
    try {
      const res = await API.get(`/questions/course/${cId}`);
      if (res.data.success) {
        setQuestions(res.data.questions);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCourseId) {
      fetchQuestions(selectedCourseId);
    }
  }, [selectedCourseId]);

  const handleOpenAddModal = () => {
    setEditQ(null);
    setFormData({
      course: 'B.Tech',
      field: 'Computer Science',
      skill: 'Web Development',
      module: 'Core Module',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      type: 'single',
      difficulty: 'medium',
      marks: 2,
      explanation: '',
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (q) => {
    setEditQ(q);
    setFormData({
      course: q.course || 'B.Tech',
      field: q.field || 'Computer Science',
      skill: q.skill || 'Web Development',
      module: q.module || 'Core Module',
      question: q.question,
      options: q.options || ['', '', '', ''],
      correctAnswer: q.correctAnswer !== undefined ? q.correctAnswer : 0,
      type: q.type || 'single',
      difficulty: q.difficulty || 'medium',
      marks: q.marks || 2,
      explanation: q.explanation || '',
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editQ) {
        await API.put(`/questions/${editQ._id}`, formData);
        addToast('Question updated', 'success');
      } else {
        await API.post('/questions', { ...formData, courseId: selectedCourseId });
        addToast('Question added', 'success');
      }
      setShowModal(false);
      fetchQuestions(selectedCourseId);
    } catch (err) {
      addToast(err.response?.data?.message || 'Error saving question', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this question?')) return;
    try {
      await API.delete(`/questions/${id}`);
      addToast('Question deleted', 'info');
      fetchQuestions(selectedCourseId);
    } catch (err) {
      addToast('Failed to delete question', 'error');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Question Bank Manager</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Add and manage technical questions, options, difficulty levels (easy, medium, hard, very-hard), and explanations per course.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="px-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold"
            >
              {courses.map((c) => (
                <option key={c._id} value={c._id}>{c.title}</option>
              ))}
            </select>

            <button
              onClick={handleOpenAddModal}
              className="flex items-center space-x-2 px-5 py-3 rounded-2xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-lg shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Question</span>
            </button>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {questions.map((q, idx) => (
            <div key={q._id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-400">Q{idx + 1} • {q.module}</span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-extrabold uppercase text-[10px] text-brand-600">
                    {q.difficulty || 'medium'}
                  </span>
                </div>
                <div className="space-x-2">
                  <button onClick={() => handleOpenEditModal(q)} className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(q._id)} className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>

              <p className="text-sm font-bold text-slate-900 dark:text-white">{q.question}</p>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {q.options?.map((opt, oIdx) => (
                  <div
                    key={oIdx}
                    className={`p-2.5 rounded-xl border ${
                      String(q.correctAnswer) === String(oIdx)
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-700 font-bold'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {String.fromCharCode(65 + oIdx)}. {opt} {String(q.correctAnswer) === String(oIdx) && '✓'}
                  </div>
                ))}
              </div>

              {q.explanation && (
                <p className="text-xs text-slate-500 italic pt-1 border-t border-slate-100 dark:border-slate-800">
                  <span className="font-bold">Explanation:</span> {q.explanation}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add / Edit Question Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editQ ? 'Edit Question' : 'Add Question'}>
        <form onSubmit={handleSave} className="space-y-4 text-slate-900 dark:text-white text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold mb-1">Undergraduate Course</label>
              <input
                type="text"
                placeholder="e.g. B.Tech, B.Com"
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border"
              />
            </div>
            <div>
              <label className="block font-bold mb-1">Field / Specialization</label>
              <input
                type="text"
                placeholder="e.g. Computer Science"
                value={formData.field}
                onChange={(e) => setFormData({ ...formData, field: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold mb-1">Skill / Subject</label>
              <input
                type="text"
                placeholder="e.g. React.js, Taxation"
                value={formData.skill}
                onChange={(e) => setFormData({ ...formData, skill: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border"
              />
            </div>
            <div>
              <label className="block font-bold mb-1">Difficulty Level</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border font-bold"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
                <option value="very-hard">Very Hard</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold mb-1">Module / Topic Tag</label>
            <input
              type="text"
              required
              value={formData.module}
              onChange={(e) => setFormData({ ...formData, module: e.target.value })}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border"
            />
          </div>

          <div>
            <label className="block font-bold mb-1">Question Prompt</label>
            <textarea
              rows={2}
              required
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border"
            />
          </div>

          <div>
            <label className="block font-bold mb-1">Options (4 Options)</label>
            {formData.options.map((opt, oIdx) => (
              <div key={oIdx} className="flex items-center space-x-2 mb-2">
                <span className="font-bold">{String.fromCharCode(65 + oIdx)}.</span>
                <input
                  type="text"
                  required
                  value={opt}
                  onChange={(e) => {
                    const newOpts = [...formData.options];
                    newOpts[oIdx] = e.target.value;
                    setFormData({ ...formData, options: newOpts });
                  }}
                  className="flex-1 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border"
                />
              </div>
            ))}
          </div>

          <div>
            <label className="block font-bold mb-1">Correct Option Index (0 = A, 1 = B, 2 = C, 3 = D)</label>
            <select
              value={formData.correctAnswer}
              onChange={(e) => setFormData({ ...formData, correctAnswer: parseInt(e.target.value) })}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border"
            >
              {formData.options.map((_, i) => (
                <option key={i} value={i}>Option {String.fromCharCode(65 + i)}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold mb-1">Explanation</label>
            <textarea
              rows={2}
              value={formData.explanation}
              onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
              placeholder="Explain why the answer is correct..."
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border"
            />
          </div>

          <button type="submit" className="w-full py-3 rounded-xl font-bold text-white bg-rose-600 hover:bg-rose-700">
            Save Question
          </button>
        </form>
      </Modal>
    </AdminLayout>
  );
};
