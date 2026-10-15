import React from 'react';
import { useLeitner } from '../../context/LeitnerContext';

export const Header: React.FC = () => {
  const { currentView, setCurrentView, setIsQuickJumpOpen } = useLeitner();

  const getBreadcrumbTitle = () => {
    switch (currentView) {
      case 'overview':
        return 'Workspace Arena';
      case 'library':
        return 'Flashcard Library';
      case 'study':
        return 'Active Study Session';
      case 'courses':
        return 'Curricula Management';
      case 'progress':
        return 'Learning Analytics & Retention';
      case 'import':
        return 'CSV Ingest Pipeline';
      case 'settings':
        return 'System Configuration';
      default:
        return 'Workspace Arena';
    }
  };

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-surface/85 backdrop-blur-xl border-b border-surface-container-highest/20 z-40 flex items-center justify-between px-space-lg select-none">
      {/* Left: Breadcrumbs & Search */}
      <div className="flex items-center gap-space-md">
        <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
          <span 
            className="hover:text-on-surface cursor-pointer transition-colors"
            onClick={() => setCurrentView('overview')}
          >
            Academic Workspace
          </span>
          <span className="material-symbols-outlined text-outline text-[16px]">chevron_right</span>
          <span className="text-on-surface font-medium">{getBreadcrumbTitle()}</span>
        </div>

        {/* Global Quick Search Input */}
        <div 
          onClick={() => setIsQuickJumpOpen(true)}
          className="relative flex items-center cursor-pointer group"
        >
          <span className="material-symbols-outlined absolute left-2.5 text-outline text-[18px] pointer-events-none group-hover:text-primary transition-colors">
            search
          </span>
          <div className="w-72 pl-9 pr-3 py-1.5 bg-surface-container rounded-lg text-xs text-on-surface-variant flex items-center justify-between border border-transparent hover:border-surface-container-highest transition-all shadow-xs">
            <span>Quick jump or search ⌘K</span>
            <kbd className="px-1.5 py-0.5 rounded bg-surface-container-high text-outline font-code text-[10px]">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right: Streak & Actions */}
      <div className="flex items-center gap-space-md">
        {/* Streak Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-tertiary text-xs font-medium border border-tertiary/10">
          <span>🔥</span>
          <span className="font-code font-semibold">14-day streak</span>
        </div>

        {/* Import CSV CTA */}
        <button
          onClick={() => setCurrentView('import')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            currentView === 'import'
              ? 'bg-primary text-on-primary shadow-xs'
              : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
          }`}
          type="button"
        >
          <span className="material-symbols-outlined text-[16px]">file_upload</span>
          <span>Import CSV</span>
        </button>

        {/* Profile Avatar */}
        <img
          alt="Elena Vance Profile"
          className="w-8 h-8 rounded-full object-cover ring-1 ring-surface-container-highest cursor-pointer hover:ring-primary transition-all"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtKuiwWiWZQmf8E_XUlBYjWjPFf34mOusY9k7uot4QW-d2HrjJWNHrh-vR9lYVFfXJ_fFjeK8ulJJ76tpRESTzVGIDBL-HrxMbRF9a4Ggj_XGhTOip3FPk0uM1UtMVk_spYNnzisypbo2xWKvyVhjzP4caEr0zofwvTHHzyypZbbBZl5-qSMDjNyKTQXA4V15EBVL-rdGin7q-v2u4aQM6Rt5imPx5GwNK_wbSskE2WrxxFvUt2YPwmA"
          onClick={() => setCurrentView('settings')}
        />
      </div>
    </header>
  );
};
