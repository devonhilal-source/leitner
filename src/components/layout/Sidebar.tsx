import React from 'react';
import { useLeitner } from '../../context/LeitnerContext';
import { ViewScreen } from '../../types';

export const Sidebar: React.FC = () => {
  const { currentView, setCurrentView, isDarkMode, toggleDarkMode, setIsQuickJumpOpen, stats } = useLeitner();

  const navItems: { id: ViewScreen; label: string; icon: string; badge?: string }[] = [
    { id: 'overview', label: 'Overview', icon: 'dashboard' },
    { id: 'study', label: 'Study', icon: 'play_circle', badge: `${stats.dueToday} due` },
    { id: 'library', label: 'My Library', icon: 'layers' },
    { id: 'courses', label: 'Courses', icon: 'school' },
    { id: 'progress', label: 'Progress', icon: 'trending_up' },
    { id: 'settings', label: 'Settings', icon: 'tune' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-surface-container-low z-50 flex flex-col justify-between py-space-md border-r border-surface-container-highest/30 select-none">
      <div className="flex flex-col gap-space-md">
        {/* Logo Lockup */}
        <div className="px-space-md flex items-center justify-between">
          <div 
            className="flex items-center gap-space-sm cursor-pointer"
            onClick={() => setCurrentView('overview')}
          >
            <img
              alt="Leitner OS Logo"
              className="h-8 w-auto object-contain"
              src="https://lh3.googleusercontent.com/aida/AEtjO1X3WuaxT4yXNEeyK6xdC2BDDe_DKlzOUKrUYGWc91OfaH9bIwE2eGUyKP0JddEDYmT8-r9CrOLqB2BO_XatGpEmWxJcuAohOjTLElPvVS754KVYaCw51IOTU8x1ZDXpJ_odjRryak2pfqMke5OV9l6cNRUDamMx6bUHBXgCyMOj9ZBDOTMAoMRRO3NtOStaZfBWLqn1slTecb6LvOzb_bdr0Kr32qByn9DCgnLx1G8I-pHy6vJYPxCGA-_q"
            />
            <div className="flex flex-col">
              <span className="font-semibold text-lg text-on-surface tracking-tight leading-tight">Leitner OS</span>
              <span className="font-code text-[11px] text-on-surface-variant">v2.4 Pro</span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1 px-space-sm">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setCurrentView(item.id)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg transition-all text-left text-sm ${
                  isActive
                    ? 'bg-surface-container-high text-on-surface font-medium shadow-xs'
                    : 'text-on-surface-variant hover:bg-surface-container-high/60 hover:text-on-surface'
                }`}
              >
                <div className="flex items-center gap-space-sm">
                  <span className={`material-symbols-outlined text-[20px] ${isActive ? 'text-primary' : 'text-outline'}`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="font-code text-[11px] px-2 py-0.5 rounded-full bg-primary-container text-on-primary-container font-semibold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile and Utilities */}
      <div className="px-space-sm flex flex-col gap-space-sm">
        {/* Dark Mode & ⌘K controls */}
        <div className="flex items-center justify-between px-space-sm py-1.5 rounded-lg bg-surface-container">
          <button
            onClick={toggleDarkMode}
            className="flex items-center gap-1.5 text-on-surface-variant hover:text-on-surface transition-colors text-xs"
            type="button"
          >
            <span className="material-symbols-outlined text-outline text-[16px]">
              {isDarkMode ? 'dark_mode' : 'light_mode'}
            </span>
            <span>{isDarkMode ? 'Dark' : 'Light'}</span>
          </button>
          <button
            onClick={() => setIsQuickJumpOpen(true)}
            className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors font-code text-[11px]"
            type="button"
            title="Open Quick Jump (⌘K)"
          >
            <span>⌘K / ?</span>
          </button>
        </div>

        {/* User Profile Capsule */}
        <div 
          onClick={() => setCurrentView('settings')}
          className="flex items-center gap-space-sm p-2 rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer"
        >
          <div className="relative">
            <img
              alt="Elena Vance Profile"
              className="w-8 h-8 rounded-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtKuiwWiWZQmf8E_XUlBYjWjPFf34mOusY9k7uot4QW-d2HrjJWNHrh-vR9lYVFfXJ_fFjeK8ulJJ76tpRESTzVGIDBL-HrxMbRF9a4Ggj_XGhTOip3FPk0uM1UtMVk_spYNnzisypbo2xWKvyVhjzP4caEr0zofwvTHHzyypZbbBZl5-qSMDjNyKTQXA4V15EBVL-rdGin7q-v2u4aQM6Rt5imPx5GwNK_wbSskE2WrxxFvUt2YPwmA"
            />
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-secondary ring-2 ring-surface-container"></span>
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-xs text-on-surface font-medium truncate">Elena Vance</span>
            <span className="text-[11px] text-on-surface-variant truncate font-code">CS · 3rd Year</span>
          </div>
          <span className="material-symbols-outlined text-outline text-[18px]">unfold_more</span>
        </div>
      </div>
    </aside>
  );
};
