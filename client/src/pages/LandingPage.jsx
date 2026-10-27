import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Award, ShieldCheck, CheckCircle2, ArrowRight, BookOpen, Users, BarChart3, Star, Sparkles, Code2, Server, Cpu, Cloud, Database, Layers, Search, ChevronRight,
  FlaskConical, Pill, Briefcase, Building2, Palette, Activity, UtensilsCrossed, Scale
} from 'lucide-react';
import API from '../services/api';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { UG_COURSES, UG_STREAMS } from '../data/ugCoursesData';
import { CourseExplorerModal } from '../components/home/CourseExplorerModal';

const ICON_MAP = {
  Cpu,
  Code2,
  BarChart3,
  FlaskConical,
  Pill,
  Briefcase,
  BookOpen,
  Building2,
  Palette,
  Activity,
  UtensilsCrossed,
  Scale,
};

export const LandingPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStream, setActiveStream] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isExplorerOpen, setIsExplorerOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPopularCourses = async () => {
      try {
        const res = await API.get('/courses?sort=popular&limit=6');
        if (res.data.success) {
          setCourses(res.data.courses);
        }
      } catch (err) {
        console.error('[Landing Courses Error]', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPopularCourses();

    if (window.location.hash === '#how-it-works') {
      setTimeout(() => {
        const elem = document.getElementById('how-it-works');
        if (elem) elem.scrollIntoView({ behavior: 'smooth' });
      }, 200);
    }
  }, []);

  const handleOpenExplorer = (ugCourse) => {
    setSelectedCourse(ugCourse);
    setIsExplorerOpen(true);
  };

  // Filter undergraduate courses by stream and search query
  const filteredUgCourses = UG_COURSES.filter((c) => {
    const matchesStream = activeStream === 'all' || c.stream === activeStream;
    if (!matchesStream) return false;

    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase();
    const titleMatch = c.title.toLowerCase().includes(q) || c.fullName.toLowerCase().includes(q) || c.badge.toLowerCase().includes(q);
    const fieldMatch = c.specializations.some((spec) =>
      spec.name.toLowerCase().includes(q) ||
      spec.skills.some((sk) => sk.name.toLowerCase().includes(q) || sk.desc.toLowerCase().includes(q))
    );

    return titleMatch || fieldMatch;
  });

  const howItWorksSteps = [
    { step: '01', title: 'Choose a Degree Track', desc: 'Select your Undergraduate degree (B.Tech, BCA, B.Com, B.Pharm, BBA, LLB, etc.)' },
    { step: '02', title: 'Explore Fields & Skills', desc: 'Browse specialized academic domains, major subjects, and career-oriented skill modules.' },
    { step: '03', title: 'Take Assessment', desc: 'Complete timed, single/multi-choice and scenario-based technical evaluations.' },
    { step: '04', title: 'Get Skill Breakdown', desc: 'Receive instant automated grading with topic-wise skill breakdown analysis.' },
    { step: '05', title: 'Earn Your Certificate', desc: 'Generate a verifiable digital certificate with QR code and export high-res PDF.' },
  ];

  const testimonials = [
    {
      name: 'Sarah Jenkins',
      role: 'Senior React Developer @ Vercel',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
      comment: 'SkillCert credentials proved my full stack expertise to recruiters immediately. The QR code verification page adds total authenticity.',
      rating: 5,
    },
    {
      name: 'Manish Kumar',
      role: 'Full Stack Engineer',
      image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
      comment: 'The assessment engine feels like a real-world technical interview. Getting my Full Stack certificate PDF in minutes was incredible!',
      rating: 5,
    },
    {
      name: 'Alex Rivera',
      role: 'DevOps Lead @ Datadog',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      comment: 'We use SkillCert to pre-screen software engineering candidates. The non-repudiable certificate IDs give us 100% confidence.',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 bg-gradient-to-b from-brand-50/60 via-slate-50 to-slate-50 dark:from-slate-900/60 dark:via-slate-950 dark:to-slate-950">
        {/* Background Decorative Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-brand-500/10 dark:bg-brand-500/20 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-100/80 dark:bg-brand-950/80 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-xs font-bold shadow-sm">
                <Sparkles className="w-4 h-4 text-brand-600 animate-pulse" />
                <span>Undergraduate Degree Skill Certifications</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                Explore Your Degree.{' '}
                <span className="bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-400 bg-clip-text text-transparent">
                  Certify Your Skills.
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Explore an entire undergraduate degree ecosystem (B.Tech, BCA, B.Com, B.Sc, B.Pharm, BBA, BA, B.Arch, B.Des, BPT, BHM, LLB) and obtain verifiable certifications for individual skills and fields within your degree.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                <a
                  href="#degree-tracks"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 shadow-xl shadow-brand-500/25 transition-all hover:scale-[1.02] flex items-center justify-center space-x-2"
                >
                  <span>Explore Degree Tracks</span>
                  <ArrowRight className="w-5 h-5" />
                </a>

                <Link
                  to="/courses"
                  className="w-full sm:w-auto px-7 py-4 rounded-2xl text-base font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center justify-center space-x-2"
                >
                  <BookOpen className="w-5 h-5 text-brand-600" />
                  <span>Take Assessment</span>
                </Link>

                <Link
                  to="/resume"
                  className="w-full sm:w-auto px-6 py-4 rounded-2xl text-base font-bold text-slate-800 dark:text-slate-100 bg-emerald-50/80 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-all flex items-center justify-center space-x-2 shadow-xs"
                >
                  <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Build ATS Resume</span>
                  <span className="text-[10px] uppercase font-mono font-bold px-1.5 py-0.5 bg-emerald-600 text-white rounded-full">
                    AI
                  </span>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-semibold">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>12+ Undergraduate Ecosystems</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Field & Subject Level Exams</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Verifiable Digital Credentials</span>
                </div>
              </div>
            </div>

            {/* Right Visual Badge Mockup */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
                  {/* Floating Certificate Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center">
                        <Award className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">SkillCert Credential</p>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">B.Tech — Computer Science</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                      ✓ VERIFIED
                    </span>
                  </div>

                  {/* Simulated Result Score */}
                  <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 space-y-3">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-500">Web Development Certification</span>
                      <span className="text-emerald-600">89% (Passed)</span>
                    </div>
                    <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-brand-500 to-emerald-500 w-[89%] rounded-full"></div>
                    </div>
                  </div>

                  {/* Skill Breakdown */}
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-slate-600 dark:text-slate-300">
                      <span>Frontend & React.js</span>
                      <span className="font-bold">92%</span>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-300">
                      <span>Backend & REST Architecture</span>
                      <span className="font-bold">86%</span>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-300">
                      <span>Data Structures & SQL</span>
                      <span className="font-bold">89%</span>
                    </div>
                  </div>

                  <div className="pt-2 text-center text-xs font-mono font-bold text-slate-400">
                    ID: SC-BTECH-CSE-2026-X91
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl sm:text-4xl font-black text-brand-600 dark:text-brand-400">12+</p>
              <p className="text-sm font-semibold text-slate-500 mt-1">Undergraduate Courses</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-indigo-600 dark:text-indigo-400">50+</p>
              <p className="text-sm font-semibold text-slate-500 mt-1">Specialized Fields</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400">150+</p>
              <p className="text-sm font-semibold text-slate-500 mt-1">Skill & Subject Exams</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-purple-600 dark:text-purple-400">100%</p>
              <p className="text-sm font-semibold text-slate-500 mt-1">Verifiable Credentials</p>
            </div>
          </div>
        </div>
      </section>

      {/* Undergraduate Course Certification Tracks Section */}
      <section id="degree-tracks" className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-10">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 text-xs font-extrabold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Academic & Skill Certification Ecosystem</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            The Exploration Certification Tracks
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base max-w-2xl mx-auto">
            Explore your undergraduate degree ecosystem. Navigate from <span className="font-bold text-slate-800 dark:text-slate-200">Degree → Specialization → Skills</span> and obtain verifiable certifications for your field.
          </p>
        </div>

        {/* Filters & Search Controls */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 mb-10 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Stream Category Tabs */}
            <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
              {UG_STREAMS.map((st) => (
                <button
                  key={st.id}
                  onClick={() => setActiveStream(st.id)}
                  className={`px-4 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all duration-200 ${
                    activeStream === st.id
                      ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/25 scale-[1.02]'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {st.name}
                </button>
              ))}
            </div>

            {/* In-Section Search Bar */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search degree, field, or skill (e.g. React, GST, B.Pharm)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Course Cards Grid */}
        {filteredUgCourses.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No matching degree courses found</h3>
            <p className="text-xs text-slate-500 mt-1">Try adjusting your stream filter or search query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUgCourses.map((course) => {
              const IconComp = ICON_MAP[course.icon] || BookOpen;
              const totalSkillsCount = course.specializations.reduce(
                (sum, spec) => sum + spec.skills.length,
                0
              );

              return (
                <div
                  key={course.id}
                  onClick={() => handleOpenExplorer(course)}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 hover:shadow-2xl hover:border-brand-500/50 transition-all duration-300 flex flex-col justify-between cursor-pointer group relative overflow-hidden"
                >
                  {/* Decorative Subtle Corner Accent */}
                  <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${course.gradient} opacity-10 rounded-bl-full group-hover:opacity-20 transition-opacity`}></div>

                  <div className="space-y-4 relative z-10">
                    
                    {/* Top Row: Icon + Badge */}
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-2xl ${course.lightBg} ${course.textColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <IconComp className="w-6 h-6" />
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${course.lightBg} ${course.textColor} border ${course.borderColor}`}>
                        {course.badge}
                      </span>
                    </div>

                    {/* Degree Names */}
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-xs font-bold text-slate-400 mt-0.5">{course.fullName}</p>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>

                    {/* Fields Preview Pills */}
                    <div className="space-y-2 pt-2">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Major Fields & Specializations:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {course.specializations.map((spec) => (
                          <span
                            key={spec.id}
                            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60"
                          >
                            {spec.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Action */}
                  <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between relative z-10">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      {course.specializations.length} Fields • {totalSkillsCount}+ Skills
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenExplorer(course);
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-extrabold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 hover:bg-brand-600 hover:text-white transition-all duration-200 flex items-center space-x-1 group-hover:bg-brand-600 group-hover:text-white shadow-sm"
                    >
                      <span>Explore Fields</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal Explorer Component */}
        <CourseExplorerModal
          course={selectedCourse}
          isOpen={isExplorerOpen}
          onClose={() => setIsExplorerOpen(false)}
        />
      </section>


      {/* Popular Certifications */}
      <section className="py-16 bg-slate-100/70 dark:bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white">Popular Certifications</h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                Highest enrolled certification exams across developers.
              </p>
            </div>
            <Link
              to="/courses"
              className="mt-4 sm:mt-0 font-bold text-sm text-brand-600 hover:text-brand-700 flex items-center space-x-1"
            >
              <span>View All Courses</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {courses.slice(0, 3).map((course) => (
              <div
                key={course._id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <img src={course.thumbnail} alt={course.title} className="w-full h-48 object-cover" />
                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2.5 py-0.5 rounded-full font-bold bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                        {course.category}
                      </span>
                      <span className="font-semibold text-slate-400">{course.difficulty}</span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{course.title}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{course.description}</p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between mt-4">
                  <span className="text-xs font-semibold text-slate-500">{course.duration} mins • {course.passingPercentage}% Pass</span>
                  <Link
                    to={`/courses/${course._id}`}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">How SkillCert Works</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Five simple steps from choosing a domain to possessing a verifiable digital credential.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {howItWorksSteps.map((s, idx) => (
            <div
              key={s.step}
              className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex flex-col justify-between"
            >
              <div className="text-3xl font-black text-brand-600/30 dark:text-brand-400/30 mb-4">{s.step}</div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{s.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-black">Trusted by Software Engineers</h2>
            <p className="text-slate-400 text-sm mt-2">See what developers say about SkillCert credentials.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-6 space-y-4">
                <div className="flex items-center space-x-1 text-amber-400">
                  {[...Array(t.rating)].map((_, r) => (
                    <Star key={r} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-300 italic">"{t.comment}"</p>
                <div className="flex items-center space-x-3 pt-2">
                  <img src={t.image} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-bold">{t.name}</p>
                    <p className="text-xs text-slate-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-brand-600 to-indigo-700 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-black mb-4">Ready to prove your skills?</h2>
          <p className="text-lg text-brand-100 mb-8 max-w-2xl mx-auto">
            Take a free assessment today and share your verified digital credential with employers worldwide.
          </p>
          <Link
            to="/courses"
            className="inline-flex items-center space-x-2 px-8 py-4 rounded-2xl text-base font-extrabold text-brand-900 bg-white hover:bg-brand-50 transition-all shadow-2xl hover:scale-105"
          >
            <span>Explore Certifications</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

const TerminalIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);
