import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export const MarkdownRenderer = ({ content = '' }) => {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleCopy = (code, index) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Split content by code blocks ```lang ... ```
  const parts = [];
  const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;
  let blockIdx = 0;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        content: content.substring(lastIndex, match.index),
      });
    }
    parts.push({
      type: 'code',
      lang: match[1] || 'code',
      code: match[2].trim(),
      index: blockIdx++,
    });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    parts.push({
      type: 'text',
      content: content.substring(lastIndex),
    });
  }

  // Format inline text (bold, inline code, bullets, headers)
  const renderFormattedText = (rawText) => {
    const lines = rawText.split('\n');

    return lines.map((line, lineIdx) => {
      // Heading 3: ###
      if (line.startsWith('### ')) {
        return (
          <h4 key={lineIdx} className="text-base font-bold text-slate-900 dark:text-white mt-3 mb-1">
            {formatInline(line.replace('### ', ''))}
          </h4>
        );
      }
      // Heading 2: ##
      if (line.startsWith('## ')) {
        return (
          <h3 key={lineIdx} className="text-lg font-bold text-slate-900 dark:text-white mt-3 mb-1.5 border-b border-slate-200 dark:border-slate-800 pb-1">
            {formatInline(line.replace('## ', ''))}
          </h3>
        );
      }
      // Heading 1: #
      if (line.startsWith('# ')) {
        return (
          <h2 key={lineIdx} className="text-xl font-extrabold text-slate-900 dark:text-white mt-4 mb-2">
            {formatInline(line.replace('# ', ''))}
          </h2>
        );
      }
      // Bullet list item
      if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
        const itemText = line.trim().replace(/^[\*\-]\s+/, '');
        return (
          <div key={lineIdx} className="flex items-start space-x-2 my-1 pl-1">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0" />
            <div className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
              {formatInline(itemText)}
            </div>
          </div>
        );
      }
      // Numbered list item: e.g. "1. "
      const numMatch = line.trim().match(/^(\d+)\.\s+(.*)/);
      if (numMatch) {
        return (
          <div key={lineIdx} className="flex items-start space-x-2 my-1 pl-1">
            <span className="text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 px-1.5 py-0.5 rounded shrink-0">
              {numMatch[1]}.
            </span>
            <div className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
              {formatInline(numMatch[2])}
            </div>
          </div>
        );
      }
      // Empty line
      if (!line.trim()) {
        return <div key={lineIdx} className="h-2" />;
      }

      // Normal paragraph
      return (
        <p key={lineIdx} className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed my-1">
          {formatInline(line)}
        </p>
      );
    });
  };

  // Helper for bold and inline code
  const formatInline = (text) => {
    // Split by inline code `code`
    const tokens = text.split(/(`[^`]+`)/g);
    return tokens.map((token, idx) => {
      if (token.startsWith('`') && token.endsWith('`')) {
        return (
          <code
            key={idx}
            className="font-mono text-[12px] bg-slate-100 dark:bg-slate-800/90 text-brand-600 dark:text-brand-400 px-1.5 py-0.5 rounded border border-slate-200/60 dark:border-slate-700/60"
          >
            {token.slice(1, -1)}
          </code>
        );
      }

      // Format bold **text**
      const boldParts = token.split(/(\*\*[^*]+\*\*)/g);
      return boldParts.map((sub, sIdx) => {
        if (sub.startsWith('**') && sub.endsWith('**')) {
          return (
            <strong key={`${idx}-${sIdx}`} className="font-semibold text-slate-900 dark:text-white">
              {sub.slice(2, -2)}
            </strong>
          );
        }
        return sub;
      });
    });
  };

  return (
    <div className="ai-markdown-body space-y-1">
      {parts.map((part, pIdx) => {
        if (part.type === 'code') {
          const isCopied = copiedIndex === part.index;
          return (
            <div
              key={pIdx}
              className="my-3 rounded-xl overflow-hidden border border-slate-700/50 bg-slate-900 text-slate-100 shadow-lg text-xs"
            >
              {/* Code block header */}
              <div className="flex items-center justify-between px-3.5 py-1.5 bg-slate-950/80 border-b border-slate-800 text-[11px] text-slate-400">
                <span className="font-mono font-medium tracking-wide uppercase text-brand-400">
                  {part.lang}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(part.code, part.index)}
                  className="flex items-center space-x-1 px-2 py-0.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                  title="Copy code"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-medium">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              {/* Code block body */}
              <pre className="p-3.5 overflow-x-auto font-mono text-[12.5px] leading-relaxed text-slate-200">
                <code>{part.code}</code>
              </pre>
            </div>
          );
        }
        return <div key={pIdx}>{renderFormattedText(part.content)}</div>;
      })}
    </div>
  );
};
