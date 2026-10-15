import React, { useState, useEffect } from 'react';
import { useLeitner } from '../../context/LeitnerContext';

export const QuickJumpModal: React.FC = () => {
  const { 
    isQuickJumpOpen, 
    setIsQuickJumpOpen, 
    setCurrentView, 
    startStudySession, 
    courses, 
    flashcards 
  } = useLeitner();

  const [query, setQuery] = useState('');

  useEffect(() => {
    if (isQuickJumpOpen) {
      setQuery('');
    }
  }, [isQuickJumpOpen]);

  if (!isQuickJumpOpen) return null;

  const filteredCourses = courses.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.code.toLowerCase().includes(query.toLowerCase())
  );

  const filteredCards = flashcards.filter(c =>
    c.question.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-surface-dim/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-xl bg-surface-container rounded-2xl shadow-2xl border border-surface-container-highest/50 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-surface-container-highest/40 bg-surface-container-high/40">
          <span className="material-symbols-outlined text-outline text-[20px] mr-2">search</span>
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, course, or card question..."
            className="flex-1 bg-transparent text-sm text-on-surface placeholder:text-outline focus:outline-none font-code"
          />
          <kbd 
            onClick={() => setIsQuickJumpOpen(false)}
            className="px-2 py-0.5 rounded bg-surface-container-highest text-outline text-xs font-code cursor-pointer hover:text-on-surface"
          >
            Esc
          </kbd>
        </div>

        {/* Quick Suggestions */}
        <div className="max-h-96 overflow-y-auto p-2 flex flex-col gap-1 text-xs">
          {/* Quick Views Navigation */}
          <div className="px-2 py-1 text-[10px] uppercase font-semibold text-outline font-code">
            Screens & Tools
          </div>
          {[
            { id: 'overview', label: 'Overview Dashboard', icon: 'dashboard' },
            { id: 'study', label: 'Study Daily Queue (48 cards)', icon: 'play_circle' },
            { id: 'library', label: 'Flashcard Library (739 cards)', icon: 'layers' },
            { id: 'courses', label: 'Courses & Curricula', icon: 'school' },
            { id: 'progress', label: 'Learning Analytics & Retention Engine', icon: 'trending_up' },
            { id: 'import', label: 'Import Flashcards (CSV Ingest Pipeline)', icon: 'file_upload' },
            { id: 'settings', label: 'Settings & Intervals', icon: 'tune' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentView(item.id as any);
                setIsQuickJumpOpen(false);
              }}
              className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-surface-container-high text-on-surface transition-colors text-left"
              type="button"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-outline text-[18px]">{item.icon}</span>
                <span>{item.label}</span>
              </div>
              <span className="font-code text-outline text-[11px]">Jump ↵</span>
            </button>
          ))}

          {/* Courses */}
          {filteredCourses.length > 0 && (
            <>
              <div className="px-2 py-1 mt-2 text-[10px] uppercase font-semibold text-outline font-code">
                Courses
              </div>
              {filteredCourses.map(course => (
                <button
                  key={course.id}
                  onClick={() => {
                    startStudySession(course.id);
                    setIsQuickJumpOpen(false);
                  }}
                  className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-surface-container-high text-on-surface transition-colors text-left"
                  type="button"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-code text-[11px] px-1.5 py-0.5 rounded bg-surface-container text-primary">
                      {course.code}
                    </span>
                    <span className="truncate">{course.name}</span>
                  </div>
                  <span className="font-code text-secondary text-[11px]">Study ↵</span>
                </button>
              ))}
            </>
          )}

          {/* Flashcards */}
          {filteredCards.length > 0 && (
            <>
              <div className="px-2 py-1 mt-2 text-[10px] uppercase font-semibold text-outline font-code">
                Matched Flashcards
              </div>
              {filteredCards.map(card => (
                <button
                  key={card.id}
                  onClick={() => {
                    setCurrentView('library');
                    setIsQuickJumpOpen(false);
                  }}
                  className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-surface-container-high text-on-surface transition-colors text-left"
                  type="button"
                >
                  <span className="truncate">{card.question}</span>
                  <span className="font-code text-outline text-[11px] shrink-0 ml-2">Box {card.box}</span>
                </button>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
