import React from 'react';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, CheckCircle2, Award, ExternalLink } from 'lucide-react';

export const ResumePreview = ({ resumeData, template = 'ats-classic', id = 'resume-preview-area' }) => {
  const {
    personalInfo = {},
    summary = '',
    experience = [],
    education = [],
    skills = [],
    certificates = [],
    projects = [],
  } = resumeData;

  // Render Template 1: Classic ATS Single-Column
  if (template === 'ats-classic') {
    return (
      <div
        id={id}
        className="w-full max-w-[800px] mx-auto bg-white text-slate-900 p-8 sm:p-12 shadow-lg rounded-sm font-sans text-sm leading-normal border border-slate-200 print:border-none print:shadow-none print:p-0 print:m-0"
        style={{ minHeight: '1050px', color: '#111827' }}
      >
        {/* Header / Contact */}
        <header className="border-b-2 border-slate-900 pb-4 mb-5 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-wider text-slate-950 mb-1">
            {personalInfo.fullName || 'Your Name'}
          </h1>
          <p className="text-sm font-semibold text-slate-700 tracking-wide mb-2.5">
            {personalInfo.title || 'Professional Title'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-700">
            {personalInfo.email && (
              <span className="flex items-center gap-1">
                <span>{personalInfo.email}</span>
              </span>
            )}
            {personalInfo.phone && <span>• {personalInfo.phone}</span>}
            {personalInfo.location && <span>• {personalInfo.location}</span>}
            {personalInfo.linkedin && (
              <span>• <a href={`https://${personalInfo.linkedin}`} target="_blank" rel="noreferrer" className="underline">{personalInfo.linkedin}</a></span>
            )}
            {personalInfo.github && (
              <span>• <a href={`https://${personalInfo.github}`} target="_blank" rel="noreferrer" className="underline">{personalInfo.github}</a></span>
            )}
            {personalInfo.portfolio && (
              <span>• <a href={`https://${personalInfo.portfolio}`} target="_blank" rel="noreferrer" className="underline">{personalInfo.portfolio}</a></span>
            )}
          </div>
        </header>

        {/* Professional Summary */}
        {summary && (
          <section className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-widest border-b border-slate-300 pb-1 mb-2 text-slate-900">
              Professional Summary
            </h2>
            <p className="text-xs leading-relaxed text-slate-800 text-justify">
              {summary}
            </p>
          </section>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <section className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-widest border-b border-slate-300 pb-1 mb-2 text-slate-900">
              Technical & Core Competencies
            </h2>
            <p className="text-xs text-slate-800 leading-relaxed">
              <strong className="text-slate-900 font-semibold">Skills: </strong>
              {skills.join(' • ')}
            </p>
          </section>
        )}

        {/* Work Experience */}
        {experience && experience.length > 0 && (
          <section className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-widest border-b border-slate-300 pb-1 mb-3 text-slate-900">
              Professional Experience
            </h2>
            <div className="space-y-4">
              {experience.map((exp, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs font-bold text-slate-900">
                    <div>
                      <span>{exp.role}</span>
                      {exp.company && <span className="font-normal text-slate-700"> — {exp.company}</span>}
                    </div>
                    <span className="text-[11px] font-normal text-slate-600 shrink-0">
                      {exp.startDate} - {exp.endDate || 'Present'} {exp.location && `| ${exp.location}`}
                    </span>
                  </div>

                  {exp.description && (
                    <ul className="list-disc list-inside space-y-1 text-xs text-slate-800 pl-1 leading-relaxed">
                      {exp.description.split('\n').filter(Boolean).map((bullet, bIdx) => (
                        <li key={bIdx} className="text-justify">{bullet.replace(/^[-*•]\s*/, '')}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <section className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-widest border-b border-slate-300 pb-1 mb-3 text-slate-900">
              Key Technical Projects
            </h2>
            <div className="space-y-3">
              {projects.map((proj, pIdx) => (
                <div key={pIdx} className="space-y-0.5 text-xs">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <div>
                      <span>{proj.name}</span>
                      {proj.techStack && (
                        <span className="font-normal text-slate-600 text-[11px]"> ({proj.techStack})</span>
                      )}
                    </div>
                    {proj.link && (
                      <span className="text-[11px] font-normal underline text-slate-700">
                        {proj.link}
                      </span>
                    )}
                  </div>
                  {proj.description && (
                    <p className="text-slate-800 leading-relaxed text-justify">
                      {proj.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Verified Certifications */}
        {certificates && certificates.length > 0 && (
          <section className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-widest border-b border-slate-300 pb-1 mb-2 text-slate-900">
              Verified Certifications & Credentials
            </h2>
            <div className="space-y-1.5">
              {certificates.map((cert, cIdx) => (
                <div key={cIdx} className="flex items-center justify-between text-xs text-slate-800">
                  <div>
                    <span className="font-semibold text-slate-900">{cert.name}</span>
                    {cert.issuer && <span className="text-slate-600"> — {cert.issuer}</span>}
                    {cert.certificateId && (
                      <span className="text-[10px] text-slate-500 font-mono ml-1.5">
                        [ID: {cert.certificateId}]
                      </span>
                    )}
                  </div>
                  {cert.date && <span className="text-[11px] text-slate-600">{cert.date}</span>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <section className="mb-4">
            <h2 className="text-xs font-bold uppercase tracking-widest border-b border-slate-300 pb-1 mb-2 text-slate-900">
              Education
            </h2>
            <div className="space-y-2">
              {education.map((edu, eIdx) => (
                <div key={eIdx} className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-slate-800">
                  <div>
                    <span className="font-bold text-slate-900">{edu.degree}</span>
                    {edu.institution && <span> — {edu.institution}</span>}
                    {edu.gpa && <span className="text-slate-600 text-[11px] block sm:inline sm:ml-1">({edu.gpa})</span>}
                  </div>
                  <span className="text-[11px] text-slate-600 shrink-0">
                    {edu.startDate} - {edu.endDate || 'Present'} {edu.location && `| ${edu.location}`}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    );
  }

  // Render Template 2: Modern Tech (with sleek brand headers & badges)
  if (template === 'modern-tech') {
    return (
      <div
        id={id}
        className="w-full max-w-[800px] mx-auto bg-white text-slate-900 p-8 sm:p-12 shadow-lg rounded-sm font-sans text-sm leading-normal border border-slate-200 print:border-none print:shadow-none print:p-0 print:m-0"
        style={{ minHeight: '1050px', color: '#0f172a' }}
      >
        {/* Header */}
        <header className="border-b-2 border-brand-600 pb-5 mb-5">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
                {personalInfo.fullName || 'Your Name'}
              </h1>
              <p className="text-sm font-bold text-brand-600 tracking-wide mt-0.5">
                {personalInfo.title || 'Professional Title'}
              </p>
            </div>

            <div className="flex flex-col items-start sm:items-end text-xs text-slate-600 space-y-1">
              {personalInfo.email && (
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-brand-500" />
                  {personalInfo.email}
                </span>
              )}
              {personalInfo.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-brand-500" />
                  {personalInfo.phone}
                </span>
              )}
              {personalInfo.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-brand-500" />
                  {personalInfo.location}
                </span>
              )}
              {personalInfo.linkedin && (
                <span className="flex items-center gap-1.5">
                  <Linkedin className="w-3.5 h-3.5 text-brand-500" />
                  {personalInfo.linkedin}
                </span>
              )}
            </div>
          </div>
        </header>

        {/* Summary */}
        {summary && (
          <section className="mb-5">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-brand-700 mb-1.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-600 inline-block" />
              Professional Summary
            </h2>
            <p className="text-xs text-slate-700 leading-relaxed pl-4 border-l-2 border-slate-200">
              {summary}
            </p>
          </section>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <section className="mb-5">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-brand-700 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-600 inline-block" />
              Core Competencies & Technologies
            </h2>
            <div className="flex flex-wrap gap-1.5 pl-4">
              {skills.map((s, i) => (
                <span
                  key={i}
                  className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[11px] font-semibold border border-slate-200"
                >
                  {s}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <section className="mb-5">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-brand-700 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-600 inline-block" />
              Work Experience
            </h2>
            <div className="space-y-4 pl-4">
              {experience.map((exp, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                    <span className="text-slate-950 font-bold">{exp.role} • <span className="text-brand-600 font-semibold">{exp.company}</span></span>
                    <span className="text-[11px] text-slate-500 font-normal">
                      {exp.startDate} - {exp.endDate || 'Present'} {exp.location && `| ${exp.location}`}
                    </span>
                  </div>
                  {exp.description && (
                    <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 pl-1 leading-relaxed">
                      {exp.description.split('\n').filter(Boolean).map((bullet, bIdx) => (
                        <li key={bIdx}>{bullet.replace(/^[-*•]\s*/, '')}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <section className="mb-5">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-brand-700 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-600 inline-block" />
              Projects
            </h2>
            <div className="space-y-3 pl-4">
              {projects.map((proj, pIdx) => (
                <div key={pIdx} className="space-y-0.5 text-xs">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span>{proj.name} {proj.techStack && <span className="text-brand-600 font-medium text-[11px]">[{proj.techStack}]</span>}</span>
                    {proj.link && <span className="text-[11px] text-slate-500 font-normal underline">{proj.link}</span>}
                  </div>
                  {proj.description && <p className="text-slate-700 leading-relaxed">{proj.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Verified Certifications with SkillCert badges */}
        {certificates && certificates.length > 0 && (
          <section className="mb-5">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-brand-700 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-600 inline-block" />
              Verified Credentials
            </h2>
            <div className="space-y-1.5 pl-4">
              {certificates.map((cert, cIdx) => (
                <div key={cIdx} className="flex items-center justify-between text-xs text-slate-800">
                  <div className="flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="font-semibold text-slate-900">{cert.name}</span>
                    <span className="text-slate-500">({cert.issuer})</span>
                    {cert.certificateId && (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded">
                        Verified #{cert.certificateId}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-500">{cert.date}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <section className="mb-4">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-brand-700 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-600 inline-block" />
              Education
            </h2>
            <div className="space-y-1.5 pl-4">
              {education.map((edu, eIdx) => (
                <div key={eIdx} className="flex items-center justify-between text-xs text-slate-800">
                  <div>
                    <span className="font-bold text-slate-900">{edu.degree}</span>
                    <span className="text-slate-600"> • {edu.institution}</span>
                    {edu.gpa && <span className="text-slate-500 text-[11px] ml-1">({edu.gpa})</span>}
                  </div>
                  <span className="text-[11px] text-slate-500">{edu.startDate} - {edu.endDate || 'Present'}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    );
  }

  // Render Template 3: Minimal Executive
  return (
    <div
      id={id}
      className="w-full max-w-[800px] mx-auto bg-white text-slate-900 p-8 sm:p-12 shadow-lg rounded-sm font-sans text-sm leading-normal border border-slate-200 print:border-none print:shadow-none print:p-0 print:m-0"
      style={{ minHeight: '1050px', color: '#1e293b' }}
    >
      <header className="mb-6">
        <h1 className="text-3xl font-light tracking-tight text-slate-900 mb-1">
          {personalInfo.fullName || 'Your Name'}
        </h1>
        <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-3">
          {personalInfo.title || 'Professional Title'}
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
        </div>
        <div className="h-0.5 bg-slate-900 w-16 mt-4" />
      </header>

      {summary && (
        <section className="mb-6">
          <p className="text-xs leading-relaxed text-slate-700 text-justify italic">
            "{summary}"
          </p>
        </section>
      )}

      {skills && skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-2">
            Expertise
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed">
            {skills.join('  /  ')}
          </p>
        </section>
      )}

      {experience && experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-4">
            Experience
          </h2>
          <div className="space-y-5">
            {experience.map((exp, idx) => (
              <div key={idx} className="space-y-1 text-xs">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900">{exp.role}</span>
                  <span className="text-[11px] text-slate-500">{exp.startDate} – {exp.endDate || 'Present'}</span>
                </div>
                <div className="text-slate-600 italic mb-1">{exp.company} {exp.location && `(${exp.location})`}</div>
                {exp.description && (
                  <ul className="list-disc list-inside space-y-1 text-slate-700 pl-1 leading-relaxed">
                    {exp.description.split('\n').filter(Boolean).map((b, bI) => (
                      <li key={bI}>{b.replace(/^[-*•]\s*/, '')}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {projects && projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-3">
            Projects
          </h2>
          <div className="space-y-3">
            {projects.map((proj, idx) => (
              <div key={idx} className="text-xs space-y-0.5">
                <div className="font-bold text-slate-900">{proj.name}</div>
                {proj.description && <p className="text-slate-700">{proj.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {certificates && certificates.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-2">
            Credentials & Certifications
          </h2>
          <div className="space-y-1 text-xs text-slate-700">
            {certificates.map((c, i) => (
              <div key={i} className="flex justify-between">
                <span>{c.name} — {c.issuer}</span>
                <span className="text-slate-500 text-[11px]">{c.date}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {education && education.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-2">
            Education
          </h2>
          <div className="space-y-2 text-xs">
            {education.map((edu, idx) => (
              <div key={idx} className="flex justify-between">
                <div>
                  <span className="font-bold text-slate-900">{edu.degree}</span>
                  <span className="text-slate-600">, {edu.institution}</span>
                </div>
                <span className="text-slate-500 text-[11px]">{edu.startDate} – {edu.endDate || 'Present'}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
