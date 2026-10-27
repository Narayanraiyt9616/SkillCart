import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, BookOpen, Clock, HelpCircle, Award, Users, ChevronRight } from 'lucide-react';
import API from '../services/api';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Badge } from '../components/common/Badge';
import { CourseCardSkeleton } from '../components/common/SkeletonLoader';
import { EmptyState } from '../components/common/EmptyState';
import { Pagination } from '../components/common/Pagination';

export const CoursesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || 'All';
  const difficulty = searchParams.get('difficulty') || 'All';
  const sort = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '1');

  const categories = [
    'All',
    'Web Development',
    'Software Engineering',
    'Data & Analytics',
    'AI & Machine Learning',
    'Cloud & DevOps',
    'Cyber Security',
    'Programming',
    'UI/UX',
  ];

  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (category !== 'All') params.append('category', category);
        if (difficulty !== 'All') params.append('difficulty', difficulty);
        if (sort) params.append('sort', sort);
        params.append('page', page);
        params.append('limit', 9);

        const res = await API.get(`/courses?${params.toString()}`);
        if (res.data.success) {
          setCourses(res.data.courses);
          setTotalPages(res.data.totalPages);
        }
      } catch (err) {
        console.error('[Courses Fetch Error]', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [search, category, difficulty, sort, page]);

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'All') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Professional Certifications</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Choose an assessment track, test your knowledge, and earn verifiable digital credentials.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 mb-8 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search certifications (e.g. React, Python, Full Stack)..."
                value={search}
                onChange={(e) => updateFilter('search', e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Difficulty Filter */}
            <div className="md:col-span-3">
              <select
                value={difficulty}
                onChange={(e) => updateFilter('difficulty', e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-700 dark:text-slate-200"
              >
                <option value="All">All Difficulties</option>
                {difficulties.filter(d => d !== 'All').map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div className="md:col-span-3">
              <select
                value={sort}
                onChange={(e) => updateFilter('sort', e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-700 dark:text-slate-200"
              >
                <option value="newest">Newest First</option>
                <option value="popular">Most Popular</option>
                <option value="duration-asc">Shortest Duration</option>
                <option value="duration-desc">Longest Duration</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pt-2 pb-1 scrollbar-none">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2 shrink-0">Category:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => updateFilter('category', cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  category === cat
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <CourseCardSkeleton key={i} />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <EmptyState
            title="No Certifications Found"
            description="No certifications match your search query or filters. Try clearing your filters."
            action={
              <button
                onClick={() => setSearchParams({})}
                className="px-5 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold"
              >
                Reset All Filters
              </button>
            }
          />
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Thumbnail Header */}
                    <div className="relative h-48 overflow-hidden bg-slate-800">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge variant="blue">{course.category}</Badge>
                      </div>
                      <div className="absolute top-4 right-4">
                        <Badge variant="slate">{course.difficulty}</Badge>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-3">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {course.description}
                      </p>

                      {/* Course Meta Info */}
                      <div className="grid grid-cols-2 gap-2 pt-2 text-xs text-slate-500 dark:text-slate-400">
                        <div className="flex items-center space-x-1.5">
                          <HelpCircle className="w-4 h-4 text-brand-500" />
                          <span>{course.questionCount} Questions</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <Clock className="w-4 h-4 text-amber-500" />
                          <span>{course.duration} Mins</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <Award className="w-4 h-4 text-emerald-500" />
                          <span>{course.passingPercentage}% Pass Threshold</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <Users className="w-4 h-4 text-indigo-500" />
                          <span>{course.enrolledCount} Learners</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="p-6 pt-0 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between mt-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-emerald-600 flex items-center">
                        Exam: FREE
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        Cert Unlock: ₹1
                      </span>
                    </div>
                    <Link
                      to={`/courses/${course._id}`}
                      className="inline-flex items-center space-x-1 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 transition-colors shadow-md shadow-brand-500/10"
                    >
                      <span>Take Free Exam</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(p) => updateFilter('page', p)}
            />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
