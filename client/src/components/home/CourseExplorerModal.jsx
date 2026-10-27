import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Search, ChevronRight, Award, BookOpen, Sparkles, ArrowRight, CheckCircle, Layers, Cpu, Code2, BarChart3, FlaskConical, Pill, Briefcase, Building2, Palette, Activity, UtensilsCrossed, Scale } from 'lucide-react';

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

export const CourseExplorerModal = ({ course, isOpen, onClose }) => {
  const navigate = useNavigate();
  const [activeSpecId, setActiveSpecId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (course && course.specializations && course.specializations.length > 0) {
      setActiveSpecId(course.specializations[0].id);
    }
    setSearchQuery('');
  }, [course]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !course) return null;

  const CourseIcon = ICON_MAP[course.icon] || BookOpen;

  const activeSpec = course.specializations.find((s) => s.id === activeSpecId) || course.specializations[0];

  // Filter skills based on search query
  const filteredSkills = searchQuery.trim()
    ? activeSpec.skills.filter(
        (s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.desc.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : activeSpec.skills;

  const handleSelectSkill = (skillObj) => {
    onClose();
    const targetSlug = skillObj.slug || skillObj.id || skillObj.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    navigate(`/courses/${targetSlug}?degree=${course.id}&field=${activeSpec.id}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden transform transition-all duration-300 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className={`p-6 bg-gradient-to-r ${course.gradient} text-white relative overflow-hidden shrink-0`}>
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="flex items-start justify-between relative z-10">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shrink-0">
                <CourseIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-extrabold uppercase tracking-wider text-white mb-1">
                  <span>{course.badge}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black">{course.title} — {course.fullName}</h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-colors shrink-0"
              aria-label="Close Explorer Modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <p className="mt-3 text-sm text-white/90 max-w-3xl leading-relaxed font-medium">
            {course.description}
          </p>

          {/* Breadcrumb path */}
          <div className="mt-4 pt-3 border-t border-white/20 flex items-center flex-wrap gap-2 text-xs font-semibold text-white/90">
            <span className="bg-white/20 px-2.5 py-1 rounded-lg">{course.title}</span>
            <ChevronRight className="w-3.5 h-3.5 opacity-70" />
            <span className="bg-white/20 px-2.5 py-1 rounded-lg">{activeSpec?.name}</span>
            <ChevronRight className="w-3.5 h-3.5 opacity-70" />
            <span className="bg-white/30 px-2.5 py-1 rounded-lg font-bold">Certification Track</span>
          </div>
        </div>

        {/* Modal Main Body */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-50 dark:bg-slate-950">
          
          {/* Left Column: Specializations Navigation */}
          <div className="w-full md:w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 shrink-0 overflow-y-auto max-h-48 md:max-h-none space-y-2">
            <div className="px-2 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider">
              Fields & Specializations ({course.specializations.length})
            </div>

            {course.specializations.map((spec) => {
              const isActive = spec.id === activeSpecId;
              return (
                <button
                  key={spec.id}
                  onClick={() => {
                    setActiveSpecId(spec.id);
                    setSearchQuery('');
                  }}
                  className={`w-full text-left p-3.5 rounded-2xl transition-all duration-200 flex flex-col justify-between ${
                    isActive
                      ? `${course.lightBg} border-2 ${course.borderColor} shadow-sm`
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-bold ${isActive ? course.textColor : 'text-slate-800 dark:text-slate-200'}`}>
                      {spec.name}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 ml-2 shrink-0">
                      {spec.skills.length} skills
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-1 font-normal">
                    {spec.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Right Column: Skills & Certification List */}
          <div className="flex-1 flex flex-col p-4 sm:p-6 overflow-hidden">
            
            {/* Field Header & Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center space-x-2">
                  <span>{activeSpec.name}</span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                    {activeSpec.skills.length} Core Subjects
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {activeSpec.description}
                </p>
              </div>

              {/* Search bar inside active field */}
              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search skills in this field..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            {/* Skills Grid */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-3">
              {filteredSkills.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                  <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-600 dark:text-slate-400">No matching skills found</p>
                  <p className="text-xs text-slate-400 mt-1">Try clearing your search query to see all skills.</p>
                </div>
              ) : (
                filteredSkills.map((skill, idx) => (
                  <div
                    key={skill.id || idx}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 hover:border-brand-500/50 hover:shadow-lg transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                  >
                    <div className="space-y-1 max-w-xl">
                      <div className="flex items-center space-x-2">
                        <span className="w-6 h-6 rounded-lg bg-brand-50 dark:bg-brand-950/80 text-brand-600 dark:text-brand-400 text-xs font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors">
                          {skill.name}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 pl-8 leading-relaxed">
                        {skill.desc}
                      </p>
                    </div>

                    <button
                      onClick={() => handleSelectSkill(skill)}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 shadow-md shadow-brand-500/20 transition-all hover:scale-105 flex items-center justify-center space-x-2 shrink-0"
                    >
                      <Award className="w-4 h-4" />
                      <span>Take Certification</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer Tip */}
            <div className="pt-4 mt-2 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 shrink-0">
              <div className="flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Selecting a skill launches its official SkillCert assessment module.</span>
              </div>
              <span className="font-semibold">{activeSpec.skills.length} Certifications Available</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
