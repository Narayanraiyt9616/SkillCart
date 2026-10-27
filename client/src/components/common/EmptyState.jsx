import React from 'react';
import { SearchX } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = SearchX,
  title = 'No Results Found',
  description = 'We couldn\'t find anything matching your criteria. Try adjusting your filters or search terms.',
  action,
}) => (
  <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl my-6">
    <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-950/60 flex items-center justify-center text-brand-600 dark:text-brand-400 mb-4">
      <Icon className="w-8 h-8" />
    </div>
    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
    <p className="text-slate-600 dark:text-slate-400 max-w-md mb-6 text-sm">{description}</p>
    {action && <div>{action}</div>}
  </div>
);
