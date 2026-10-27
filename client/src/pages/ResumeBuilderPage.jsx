import React, { useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import {
  FileText,
  Sparkles,
  Download,
  Printer,
  FileCheck,
  Plus,
  Trash2,
  RefreshCw,
  Award,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderGit2,
  User,
  Sliders,
  CheckCircle2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Layout,
  ExternalLink,
  ChevronRight,
  Loader2,
  HelpCircle,
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { ResumePreview } from '../components/resume/ResumePreview';
import { ATSScoreModal } from '../components/resume/ATSScoreModal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import API from '../services/api';
import { sendChatMessage } from '../services/aiService';

const DEFAULT_RESUME_DATA = {
  personalInfo: {
    fullName: 'Alex Johnson',
    title: 'Full Stack Software Engineer',
    email: 'alex.johnson@example.com',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexjohnson-dev',
    github: 'github.com/alexjohnson',
    portfolio: 'alexjohnson.dev',
  },
  summary: 'Results-driven Full Stack Engineer with 3+ years of experience designing scalable web architectures, REST microservices, and responsive client applications. Certified in Web Development & Cloud Computing with a track record of boosting system performance by 35%.',
  experience: [
    {
      id: '1',
      role: 'Senior Frontend Developer',
      company: 'TechFlow Solutions',
      location: 'San Francisco, CA',
      startDate: 'Jan 2023',
      endDate: 'Present',
      description: 'Architected responsive React and Node.js micro-frontends serving over 150,000 monthly active users.\nEngineered optimized Redux and caching layers, slashing initial page load time by 42%.\nCollaborated in Agile sprints with cross-functional product and DevOps teams.',
    },
    {
      id: '2',
      role: 'Software Engineer',
      company: 'Apex Digital Labs',
      location: 'Austin, TX',
      startDate: 'Jun 2021',
      endDate: 'Dec 2022',
      description: 'Developed scalable RESTful APIs in Express and MongoDB handling 5M+ weekly requests.\nImplemented JWT authentication and RBAC security controls meeting SOC2 compliance.\nAutomated CI/CD testing pipelines using GitHub Actions, reducing deployment errors by 28%.',
    },
  ],
  education: [
    {
      id: '1',
      degree: 'B.Tech in Computer Science & Engineering',
      institution: 'Institute of Technology',
      location: 'California, USA',
      startDate: '2017',
      endDate: '2021',
      gpa: '3.8 / 4.0 (First Class with Distinction)',
    },
  ],
  skills: [
    'React.js',
    'JavaScript (ES6+)',
    'TypeScript',
    'Node.js',
    'Express.js',
    'MongoDB',
    'PostgreSQL',
    'REST APIs',
    'Docker',
    'Git / GitHub',
    'Tailwind CSS',
    'System Design',
  ],
  certificates: [
    {
      id: '1',
      name: 'Web Development Certification',
      issuer: 'SkillCert Platform',
      date: '2024',
      certificateId: 'SKILLCERT-2024-WD-78912',
      verified: true,
      url: 'https://skillcert.org/verify/SKILLCERT-2024-WD-78912',
    },
    {
      id: '2',
      name: 'Data Structures & Algorithms Certified Specialist',
      issuer: 'SkillCert Platform',
      date: '2024',
      certificateId: 'SKILLCERT-2024-DSA-45123',
      verified: true,
      url: 'https://skillcert.org/verify/SKILLCERT-2024-DSA-45123',
    },
  ],
  projects: [
    {
      id: '1',
      name: 'SkillCert Learning & Certification Portal',
      techStack: 'React, Node.js, MongoDB, Tailwind CSS',
      link: 'github.com/example/skillcert',
      description: 'Built a high-performance skill assessment platform with real-time timers, automated certificate PDF generation, and QR verification.',
    },
    {
      id: '2',
      name: 'Distributed Cloud Storage Monitor',
      techStack: 'Go, Docker, Prometheus, React',
      link: 'github.com/example/cloud-monitor',
      description: 'Created a containerized metric dashboard monitoring multi-region storage nodes with automated alerting and 99.9% uptime tracking.',
    },
  ],
};

export const ResumeBuilderPage = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [resumeData, setResumeData] = useState(() => {
    const saved = localStorage.getItem('skillcert_resume_draft');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_RESUME_DATA;
      }
    }
    return DEFAULT_RESUME_DATA;
  });

  const [activeTab, setActiveTab] = useState('personal');
  const [template, setTemplate] = useState('ats-classic'); // 'ats-classic' | 'modern-tech' | 'minimal-executive'
  const [zoom, setZoom] = useState(1);
  const [downloading, setDownloading] = useState(false);
  const [atsModalOpen, setAtsModalOpen] = useState(false);
  const [importingCerts, setImportingCerts] = useState(false);
  const [aiEnhancing, setAiEnhancing] = useState(false);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [viewMode, setViewMode] = useState('split'); // 'split' | 'editor' | 'preview'

  // Persist draft
  useEffect(() => {
    localStorage.setItem('skillcert_resume_draft', JSON.stringify(resumeData));
  }, [resumeData]);

  // If user is logged in, optionally populate name and email if empty
  useEffect(() => {
    if (user && resumeData.personalInfo.fullName === 'Alex Johnson') {
      setResumeData((prev) => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          fullName: user.name || prev.personalInfo.fullName,
          email: user.email || prev.personalInfo.email,
        },
      }));
    }
  }, [user]);

  // Auto-import user's verified SkillCert certificates
  const handleImportSkillCertCerts = async () => {
    setImportingCerts(true);
    try {
      const res = await API.get('/certificates/my');
      if (res.data.success && res.data.certificates?.length > 0) {
        const imported = res.data.certificates.map((c) => ({
          id: c._id,
          name: c.title || `${c.course?.title || 'Skill'} Certification`,
          issuer: 'SkillCert Accredited',
          date: new Date(c.issueDate || c.createdAt).getFullYear().toString(),
          certificateId: c.certificateId,
          verified: true,
          url: `${window.location.origin}/verify/${c.certificateId}`,
        }));

        setResumeData((prev) => ({
          ...prev,
          certificates: [...prev.certificates, ...imported.filter(nc => !prev.certificates.some(ec => ec.certificateId === nc.certificateId))],
        }));

        addToast(`Successfully imported ${imported.length} verified certificate(s)!`, 'success');
      } else {
        addToast('No certificates found yet. Complete an exam to earn verified credentials!', 'info');
      }
    } catch (err) {
      console.error('Import error:', err);
      addToast('Failed to fetch certificates from server.', 'error');
    } finally {
      setImportingCerts(false);
    }
  };

  // Enhance Professional Summary with Gemini AI
  const handleEnhanceSummaryWithAI = async () => {
    setAiEnhancing(true);
    try {
      const prompt = `Enhance and polish the following resume professional summary for an ATS-optimized, high-impact technical resume.
Target Title: "${resumeData.personalInfo.title}"
Skills: ${resumeData.skills.join(', ')}
Current Summary: "${resumeData.summary}"

Return ONLY the rewritten professional summary text (2-3 powerful sentences, action-oriented, keyword-rich). No explanations, no quotes.`;

      const response = await sendChatMessage({
        messages: [{ role: 'user', content: prompt }],
      });

      if (response.reply) {
        setResumeData((prev) => ({
          ...prev,
          summary: response.reply.trim().replace(/^"/, '').replace(/"$/, ''),
        }));
        addToast('Summary enhanced with Gemini AI!', 'success');
      }
    } catch (err) {
      console.error('Summary enhance error:', err);
      addToast(err.message || 'Gemini enhancement failed. Check API key in AI Assistant.', 'error');
    } finally {
      setAiEnhancing(false);
    }
  };

  // Enhance Experience Bullets with Gemini AI
  const handleEnhanceExperienceBullets = async (index) => {
    const exp = resumeData.experience[index];
    if (!exp) return;

    setAiEnhancing(true);
    try {
      const prompt = `Rewrite and optimize the following job responsibilities into 2-3 high-impact, ATS-optimized bullet points using the Google XYZ formula ("Accomplished [X] as measured by [Y] by doing [Z]").
Role: "${exp.role}" at "${exp.company}"
Current descriptions:
${exp.description}

Return ONLY the bullet points, each starting on a new line with no asterisks or dashes. Keep it concise, quantified, and powerful.`;

      const response = await sendChatMessage({
        messages: [{ role: 'user', content: prompt }],
      });

      if (response.reply) {
        setResumeData((prev) => {
          const nextExp = [...prev.experience];
          nextExp[index] = {
            ...nextExp[index],
            description: response.reply.trim(),
          };
          return { ...prev, experience: nextExp };
        });
        addToast('Work experience bullets optimized with Gemini AI!', 'success');
      }
    } catch (err) {
      console.error('Bullet enhance error:', err);
      addToast(err.message || 'Gemini enhancement failed.', 'error');
    } finally {
      setAiEnhancing(false);
    }
  };

  // Download PDF using html2canvas & jsPDF
  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      const element = document.getElementById('resume-preview-area');
      if (!element) {
        throw new Error('Resume element not found');
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210; // A4 width mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      const fileName = `${(resumeData.personalInfo.fullName || 'Resume').replace(/\s+/g, '_')}_Resume.pdf`;
      pdf.save(fileName);
      addToast('Resume PDF downloaded successfully!', 'success');
    } catch (err) {
      console.error('PDF Export Error:', err);
      window.print();
    } finally {
      setDownloading(false);
    }
  };

  // Add / remove skill
  const handleAddSkill = (skillToAdd) => {
    const s = (skillToAdd || newSkillInput).trim();
    if (!s) return;
    if (resumeData.skills.includes(s)) {
      addToast(`Skill "${s}" already exists.`, 'info');
      return;
    }
    setResumeData((prev) => ({
      ...prev,
      skills: [...prev.skills, s],
    }));
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setResumeData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  // Load sample data
  const handleLoadSample = () => {
    if (window.confirm('Reset resume to rich sample data?')) {
      setResumeData(DEFAULT_RESUME_DATA);
      addToast('Sample resume data loaded.', 'info');
    }
  };

  // Clear all
  const handleReset = () => {
    if (window.confirm('Clear all resume details and start fresh?')) {
      setResumeData({
        personalInfo: { fullName: '', title: '', email: '', phone: '', location: '', linkedin: '', github: '', portfolio: '' },
        summary: '',
        experience: [],
        education: [],
        skills: [],
        certificates: [],
        projects: [],
      });
      addToast('Resume reset.', 'info');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar />

      <main className="flex-1 w-full max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-5">
        {/* Top Control Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  AI Resume Builder & ATS Scanner
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-xs">
                    Gemini AI
                  </span>
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Build 100% ATS-compliant tech resumes with verified credentials & AI optimization
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions & ATS Meter Pill */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* ATS Score Button */}
            <button
              type="button"
              onClick={() => setAtsModalOpen(true)}
              className="flex items-center space-x-2 px-3.5 py-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold hover:scale-105 active:scale-95 transition-all shadow-xs group cursor-pointer"
            >
              <FileCheck className="w-4 h-4 text-emerald-600 group-hover:rotate-12 transition-transform" />
              <span>ATS Score: 85%</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-600 text-white font-mono">
                Scanner
              </span>
            </button>

            {/* Template Selector */}
            <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setTemplate('ats-classic')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  template === 'ats-classic'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-bold'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                ATS Classic
              </button>
              <button
                type="button"
                onClick={() => setTemplate('modern-tech')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  template === 'modern-tech'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-bold'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Modern Tech
              </button>
              <button
                type="button"
                onClick={() => setTemplate('minimal-executive')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  template === 'minimal-executive'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-bold'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Minimal Executive
              </button>
            </div>

            {/* Download PDF Button */}
            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="px-4 py-2 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-brand-500/20 flex items-center space-x-1.5 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              <span>Download PDF</span>
            </button>

            {/* Print Button */}
            <button
              type="button"
              onClick={() => window.print()}
              className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              title="Print Resume"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* View Mode Switcher for smaller screens */}
        <div className="flex lg:hidden items-center justify-center p-1 rounded-2xl bg-slate-200 dark:bg-slate-800 text-xs font-semibold max-w-xs mx-auto">
          <button
            type="button"
            onClick={() => setViewMode('editor')}
            className={`flex-1 py-1.5 rounded-xl transition-all text-center ${
              viewMode === 'editor' ? 'bg-white dark:bg-slate-900 font-bold shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Edit Content
          </button>
          <button
            type="button"
            onClick={() => setViewMode('preview')}
            className={`flex-1 py-1.5 rounded-xl transition-all text-center ${
              viewMode === 'preview' ? 'bg-white dark:bg-slate-900 font-bold shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Live Preview
          </button>
        </div>

        {/* Master Workspace: Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Form Editor (5 cols) */}
          <div className={`lg:col-span-5 space-y-4 ${viewMode === 'preview' ? 'hidden lg:block' : 'block'}`}>
            {/* Editor Tabs Navigation */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-2 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center space-x-1 overflow-x-auto no-scrollbar">
              {[
                { id: 'personal', label: 'Personal', icon: User },
                { id: 'summary', label: 'Summary', icon: FileText },
                { id: 'experience', label: 'Experience', icon: Briefcase },
                { id: 'education', label: 'Education', icon: GraduationCap },
                { id: 'skills', label: 'Skills', icon: Wrench },
                { id: 'certificates', label: 'Certifications', icon: Award },
                { id: 'projects', label: 'Projects', icon: FolderGit2 },
              ].map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 ${
                      active
                        ? 'bg-brand-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab 1: Personal Info */}
            {activeTab === 'personal' && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 animate-fadeIn">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <User className="w-4 h-4 text-brand-500" />
                  Personal Information
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.fullName}
                      onChange={(e) =>
                        setResumeData({
                          ...resumeData,
                          personalInfo: { ...resumeData.personalInfo, fullName: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Professional Title</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.title}
                      onChange={(e) =>
                        setResumeData({
                          ...resumeData,
                          personalInfo: { ...resumeData.personalInfo, title: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Email</label>
                      <input
                        type="email"
                        value={resumeData.personalInfo.email}
                        onChange={(e) =>
                          setResumeData({
                            ...resumeData,
                            personalInfo: { ...resumeData.personalInfo, email: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone</label>
                      <input
                        type="text"
                        value={resumeData.personalInfo.phone}
                        onChange={(e) =>
                          setResumeData({
                            ...resumeData,
                            personalInfo: { ...resumeData.personalInfo, phone: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Location (City, Country)</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.location}
                      onChange={(e) =>
                        setResumeData({
                          ...resumeData,
                          personalInfo: { ...resumeData.personalInfo, location: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">LinkedIn Profile</label>
                      <input
                        type="text"
                        placeholder="linkedin.com/in/username"
                        value={resumeData.personalInfo.linkedin}
                        onChange={(e) =>
                          setResumeData({
                            ...resumeData,
                            personalInfo: { ...resumeData.personalInfo, linkedin: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">GitHub / Portfolio</label>
                      <input
                        type="text"
                        placeholder="github.com/username"
                        value={resumeData.personalInfo.github}
                        onChange={(e) =>
                          setResumeData({
                            ...resumeData,
                            personalInfo: { ...resumeData.personalInfo, github: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Summary */}
            {activeTab === 'summary' && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4 text-brand-500" />
                    Professional Summary
                  </h3>
                  <button
                    type="button"
                    onClick={handleEnhanceSummaryWithAI}
                    disabled={aiEnhancing}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-brand-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {aiEnhancing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-amber-300" />}
                    <span>Enhance with Gemini AI</span>
                  </button>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  A strong 2-3 sentence overview of your technical background, certified credentials, and measurable achievements.
                </p>

                <textarea
                  rows={5}
                  value={resumeData.summary}
                  onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })}
                  placeholder="Write your professional summary here..."
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs leading-relaxed"
                />
              </div>
            )}

            {/* Tab 3: Experience */}
            {activeTab === 'experience' && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-brand-500" />
                    Work Experience
                  </h3>
                  <button
                    type="button"
                    onClick={() =>
                      setResumeData({
                        ...resumeData,
                        experience: [
                          ...resumeData.experience,
                          {
                            id: Date.now().toString(),
                            role: 'Software Engineer',
                            company: 'Company Name',
                            location: 'City, Country',
                            startDate: '2023',
                            endDate: 'Present',
                            description: 'Developed scalable features using modern tech stack.\nCollaborated with agile engineering teams to deliver on time.',
                          },
                        ],
                      })
                    }
                    className="px-3 py-1.5 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800 text-xs font-bold flex items-center gap-1 hover:bg-brand-100"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Role</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {resumeData.experience.map((exp, idx) => (
                    <div
                      key={exp.id || idx}
                      className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40 space-y-3 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white">Role #{idx + 1}</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleEnhanceExperienceBullets(idx)}
                            disabled={aiEnhancing}
                            className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-[11px] font-bold flex items-center gap-1 hover:bg-indigo-100"
                            title="Enhance bullets using Gemini AI"
                          >
                            <Sparkles className="w-3 h-3 text-indigo-500" />
                            <span>AI Polish</span>
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setResumeData({
                                ...resumeData,
                                experience: resumeData.experience.filter((_, i) => i !== idx),
                              })
                            }
                            className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <input
                          type="text"
                          placeholder="Job Title / Role"
                          value={exp.role}
                          onChange={(e) => {
                            const next = [...resumeData.experience];
                            next[idx].role = e.target.value;
                            setResumeData({ ...resumeData, experience: next });
                          }}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        />
                        <input
                          type="text"
                          placeholder="Company Name"
                          value={exp.company}
                          onChange={(e) => {
                            const next = [...resumeData.experience];
                            next[idx].company = e.target.value;
                            setResumeData({ ...resumeData, experience: next });
                          }}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        <input
                          type="text"
                          placeholder="Start Date (e.g. Jan 2022)"
                          value={exp.startDate}
                          onChange={(e) => {
                            const next = [...resumeData.experience];
                            next[idx].startDate = e.target.value;
                            setResumeData({ ...resumeData, experience: next });
                          }}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        />
                        <input
                          type="text"
                          placeholder="End Date (or Present)"
                          value={exp.endDate}
                          onChange={(e) => {
                            const next = [...resumeData.experience];
                            next[idx].endDate = e.target.value;
                            setResumeData({ ...resumeData, experience: next });
                          }}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        />
                        <input
                          type="text"
                          placeholder="Location (optional)"
                          value={exp.location}
                          onChange={(e) => {
                            const next = [...resumeData.experience];
                            next[idx].location = e.target.value;
                            setResumeData({ ...resumeData, experience: next });
                          }}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                          Bullet points (1 per line):
                        </label>
                        <textarea
                          rows={3}
                          value={exp.description}
                          onChange={(e) => {
                            const next = [...resumeData.experience];
                            next[idx].description = e.target.value;
                            setResumeData({ ...resumeData, experience: next });
                          }}
                          className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 4: Education */}
            {activeTab === 'education' && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-brand-500" />
                    Education
                  </h3>
                  <button
                    type="button"
                    onClick={() =>
                      setResumeData({
                        ...resumeData,
                        education: [
                          ...resumeData.education,
                          {
                            id: Date.now().toString(),
                            degree: 'Bachelor of Technology (B.Tech)',
                            institution: 'University / Institute Name',
                            location: 'Location',
                            startDate: '2020',
                            endDate: '2024',
                            gpa: 'GPA or Percentage',
                          },
                        ],
                      })
                    }
                    className="px-3 py-1.5 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800 text-xs font-bold flex items-center gap-1 hover:bg-brand-100"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Degree</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {resumeData.education.map((edu, idx) => (
                    <div
                      key={edu.id || idx}
                      className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40 space-y-2.5 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white">Degree #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setResumeData({
                              ...resumeData,
                              education: resumeData.education.filter((_, i) => i !== idx),
                            })
                          }
                          className="p-1 rounded-lg text-rose-500 hover:bg-rose-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <input
                        type="text"
                        placeholder="Degree / Course"
                        value={edu.degree}
                        onChange={(e) => {
                          const next = [...resumeData.education];
                          next[idx].degree = e.target.value;
                          setResumeData({ ...resumeData, education: next });
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Institution Name"
                          value={edu.institution}
                          onChange={(e) => {
                            const next = [...resumeData.education];
                            next[idx].institution = e.target.value;
                            setResumeData({ ...resumeData, education: next });
                          }}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        />
                        <input
                          type="text"
                          placeholder="Years (e.g. 2018 - 2022)"
                          value={`${edu.startDate || ''} - ${edu.endDate || ''}`}
                          onChange={(e) => {
                            const next = [...resumeData.education];
                            const parts = e.target.value.split('-');
                            next[idx].startDate = parts[0]?.trim() || '';
                            next[idx].endDate = parts[1]?.trim() || '';
                            setResumeData({ ...resumeData, education: next });
                          }}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 5: Skills */}
            {activeTab === 'skills' && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 animate-fadeIn">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-brand-500" />
                  Skills & Core Competencies
                </h3>

                {/* Add new skill */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                    placeholder="Type skill name & hit Enter (e.g. Docker, Redux, AWS)"
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddSkill()}
                    className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs"
                  >
                    Add
                  </button>
                </div>

                {/* Skill Chips */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {resumeData.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-slate-400 hover:text-rose-500 transition-colors"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                {/* Quick Add Suggestions */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] font-semibold text-slate-400 block mb-2">
                    Popular In-Demand Tech Skills:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {['TypeScript', 'Next.js', 'PostgreSQL', 'Docker', 'Kubernetes', 'GraphQL', 'AWS', 'Python', 'TailwindCSS'].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => handleAddSkill(s)}
                        className="px-2 py-0.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 hover:bg-brand-50 dark:hover:bg-brand-950 text-slate-600 dark:text-slate-300 text-[11px] border border-slate-200 dark:border-slate-700 hover:border-brand-300"
                      >
                        + {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 6: Certifications */}
            {activeTab === 'certificates' && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <Award className="w-4 h-4 text-brand-500" />
                    Verified Certifications
                  </h3>
                  <button
                    type="button"
                    onClick={handleImportSkillCertCerts}
                    disabled={importingCerts}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center gap-1 shadow-sm transition-all"
                  >
                    {importingCerts ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Award className="w-3.5 h-3.5" />}
                    <span>Import SkillCert Credentials</span>
                  </button>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Accredited certificates with tamper-proof Verification IDs boost ATS recruiter trust score by up to 25%.
                </p>

                <div className="space-y-3">
                  {resumeData.certificates.map((cert, cIdx) => (
                    <div
                      key={cert.id || cIdx}
                      className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1.5 font-bold text-slate-900 dark:text-white">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span>{cert.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setResumeData({
                              ...resumeData,
                              certificates: resumeData.certificates.filter((_, i) => i !== cIdx),
                            })
                          }
                          className="p-1 rounded-lg text-rose-500 hover:bg-rose-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div>Issuer: <span className="font-semibold">{cert.issuer}</span></div>
                        <div>Date: <span className="font-semibold">{cert.date}</span></div>
                      </div>

                      {cert.certificateId && (
                        <div className="text-[10px] text-emerald-700 dark:text-emerald-300 font-mono bg-emerald-50 dark:bg-emerald-950/60 p-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between">
                          <span>Verification ID: {cert.certificateId}</span>
                          <span className="font-bold">Verified ✓</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 7: Projects */}
            {activeTab === 'projects' && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <FolderGit2 className="w-4 h-4 text-brand-500" />
                    Key Projects
                  </h3>
                  <button
                    type="button"
                    onClick={() =>
                      setResumeData({
                        ...resumeData,
                        projects: [
                          ...resumeData.projects,
                          {
                            id: Date.now().toString(),
                            name: 'New Project Name',
                            techStack: 'React, Node.js, MongoDB',
                            link: 'github.com/username/project',
                            description: 'Description of key features and impact.',
                          },
                        ],
                      })
                    }
                    className="px-3 py-1.5 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800 text-xs font-bold flex items-center gap-1 hover:bg-brand-100"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Project</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {resumeData.projects.map((proj, idx) => (
                    <div
                      key={proj.id || idx}
                      className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white">Project #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setResumeData({
                              ...resumeData,
                              projects: resumeData.projects.filter((_, i) => i !== idx),
                            })
                          }
                          className="p-1 rounded-lg text-rose-500 hover:bg-rose-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <input
                        type="text"
                        placeholder="Project Name"
                        value={proj.name}
                        onChange={(e) => {
                          const next = [...resumeData.projects];
                          next[idx].name = e.target.value;
                          setResumeData({ ...resumeData, projects: next });
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Tech Stack (e.g. React, Express, MongoDB)"
                          value={proj.techStack}
                          onChange={(e) => {
                            const next = [...resumeData.projects];
                            next[idx].techStack = e.target.value;
                            setResumeData({ ...resumeData, projects: next });
                          }}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        />
                        <input
                          type="text"
                          placeholder="GitHub / Live URL"
                          value={proj.link}
                          onChange={(e) => {
                            const next = [...resumeData.projects];
                            next[idx].link = e.target.value;
                            setResumeData({ ...resumeData, projects: next });
                          }}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        />
                      </div>

                      <textarea
                        rows={2}
                        placeholder="Project description and key metrics"
                        value={proj.description}
                        onChange={(e) => {
                          const next = [...resumeData.projects];
                          next[idx].description = e.target.value;
                          setResumeData({ ...resumeData, projects: next });
                        }}
                        className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Reset / Sample Buttons */}
            <div className="flex items-center justify-between pt-2 px-1 text-xs">
              <button
                type="button"
                onClick={handleLoadSample}
                className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline"
              >
                Load Sample Data
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="text-rose-500 hover:text-rose-600 underline"
              >
                Clear All Fields
              </button>
            </div>
          </div>

          {/* Right Column: Live Interactive Resume Preview (7 cols) */}
          <div className={`lg:col-span-7 space-y-3 ${viewMode === 'editor' ? 'hidden lg:block' : 'block'}`}>
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Layout className="w-3.5 h-3.5 text-brand-500" />
                Live Document Preview (A4 Standard)
              </span>

              {/* Zoom Controls */}
              <div className="flex items-center space-x-1 text-xs text-slate-500">
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.max(0.7, z - 0.1))}
                  className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono text-[11px] px-1">{Math.round(zoom * 100)}%</span>
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.min(1.3, z + 0.1))}
                  className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoom(1)}
                  className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-semibold"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Document Render Container with Zoom & Shadow */}
            <div className="w-full overflow-x-auto p-4 bg-slate-200/60 dark:bg-slate-950/80 rounded-3xl border border-slate-300 dark:border-slate-800 flex justify-center">
              <div
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: 'top center',
                  transition: 'transform 0.15s ease-out',
                }}
                className="w-full flex justify-center"
              >
                <ResumePreview
                  resumeData={resumeData}
                  template={template}
                  id="resume-preview-area"
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ATS Scanner & AI Optimizer Modal */}
      <ATSScoreModal
        isOpen={atsModalOpen}
        onClose={() => setAtsModalOpen(false)}
        resumeData={resumeData}
        onApplySummary={(aiSummary) => {
          setResumeData((prev) => ({ ...prev, summary: aiSummary }));
          addToast('AI summary applied to resume!', 'success');
        }}
        onAddSkill={(skill) => {
          handleAddSkill(skill);
          addToast(`Added "${skill}" to skills!`, 'success');
        }}
      />

      <Footer />
    </div>
  );
};
