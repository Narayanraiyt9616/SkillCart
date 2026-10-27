import React from 'react';

export const CourseCardSkeleton = () => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 animate-pulse flex flex-col space-y-4">
    <div className="w-full h-44 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
    <div className="flex justify-between items-center">
      <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
      <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
    </div>
    <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3"></div>
    <div className="pt-4 flex justify-between items-center border-t border-slate-100 dark:border-slate-800">
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
      <div className="h-9 bg-slate-200 dark:bg-slate-800 rounded-xl w-1/3"></div>
    </div>
  </div>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="w-full space-y-3 animate-pulse">
    {[...Array(rows)].map((_, i) => (
      <div key={i} className="h-14 bg-slate-200/70 dark:bg-slate-800/70 rounded-xl w-full"></div>
    ))}
  </div>
);
