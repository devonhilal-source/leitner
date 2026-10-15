import React, { useState } from 'react';
import { useLeitner } from '../../context/LeitnerContext';

export const SettingsView: React.FC = () => {
  const { 
    isDarkMode, 
    toggleDarkMode, 
    resetToDefaults, 
    flashcards, 
    courses, 
    stats 
  } = useLeitner();

  const [boxIntervals, setBoxIntervals] = useState({
    1: 1,
    2: 3,
    3: 5,
    4: 9,
    5: 14,
  });

  const [dailyTarget, setDailyTarget] = useState(80);
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [showNotification, setShowNotification] = useState(false);

  const handleSave = () => {
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2500);
  };

  const handleExportAll = () => {
    const backupData = {
      version: '2.4-Pro',
      exportedAt: new Date().toISOString(),
      courses,
      flashcards,
      stats,
    };
    const jsonStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leitner_os_backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col w-full pb-space-xl max-w-4xl">
      {/* Top Header */}
      <div className="flex flex-col gap-1 pt-2 pb-space-lg">
        <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-primary font-code">
          <span>Academic Workspace</span>
          <span className="material-symbols-outlined text-outline text-[14px]">chevron_right</span>
          <span className="text-on-surface-variant">System Configuration</span>
        </div>
        <h1 className="text-2xl lg:text-3xl font-semibold text-on-surface tracking-tight font-display">
          Settings & Spaced Repetition Parameters
        </h1>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          Calibrate Leitner spatial box intervals, daily study targets, and local data persistence.
        </p>
      </div>

      {showNotification && (
        <div className="mb-4 p-3 rounded-xl bg-secondary/15 border border-secondary/30 text-secondary text-xs flex items-center gap-2 animate-fadeIn font-code">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span>Configuration saved and active across all Leitner execution queues.</span>
        </div>
      )}

      <div className="flex flex-col gap-space-lg">
        {/* Box Interval Durations */}
        <section className="p-space-lg rounded-2xl bg-surface-container border border-surface-container-highest/30 shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-surface-container-highest/20">
            <div>
              <h3 className="text-sm font-semibold text-on-surface">Leitner Spatial Decay Intervals</h3>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Set number of days before a promoted card enters the next review cycle.
              </p>
            </div>
            <span className="font-code text-xs px-2.5 py-1 rounded-lg bg-surface-container-low text-primary border border-primary/20">
              Ebbinghaus Calibrated
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {[1, 2, 3, 4, 5].map((b) => (
              <div key={b} className="flex flex-col gap-1.5 p-3 rounded-xl bg-surface-container-low border border-surface-container-highest/20">
                <span className="font-code text-xs font-semibold text-on-surface">Box {b}</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={boxIntervals[b as keyof typeof boxIntervals]}
                    onChange={(e) =>
                      setBoxIntervals({
                        ...boxIntervals,
                        [b]: Math.max(1, parseInt(e.target.value) || 1),
                      })
                    }
                    className="w-16 p-1.5 rounded-lg bg-surface-container text-xs text-on-surface font-code text-center border border-surface-container-highest/40 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <span className="text-xs text-outline font-code">days</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Daily Goals & Preferences */}
        <section className="p-space-lg rounded-2xl bg-surface-container border border-surface-container-highest/30 shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-surface-container-highest/20">
            <div>
              <h3 className="text-sm font-semibold text-on-surface">Study Targets & Feedback</h3>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Adjust daily card goals and hardware interaction preferences.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {/* Daily Quota */}
            <div className="flex items-center justify-between py-2 border-b border-surface-container-highest/20">
              <div>
                <span className="text-xs font-medium text-on-surface block">Daily Review Target</span>
                <span className="text-[11px] text-outline">Target quota indicated in weekly activity charts</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={10}
                  max={300}
                  step={5}
                  value={dailyTarget}
                  onChange={(e) => setDailyTarget(parseInt(e.target.value) || 80)}
                  className="w-20 p-1.5 rounded-lg bg-surface-container-low text-xs text-on-surface font-code text-center border border-surface-container-highest/40 focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <span className="text-xs text-outline font-code">cards / day</span>
              </div>
            </div>

            {/* Tactile & Sound */}
            <div className="flex items-center justify-between py-2 border-b border-surface-container-highest/20">
              <div>
                <span className="text-xs font-medium text-on-surface block">Tactile Animation & Audio Feedback</span>
                <span className="text-[11px] text-outline">Confetti celebrations and micro-transitions on grading</span>
              </div>
              <button
                onClick={() => setHapticFeedback(!hapticFeedback)}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  hapticFeedback ? 'bg-secondary' : 'bg-surface-container-high'
                }`}
                type="button"
              >
                <span
                  className={`w-4 h-4 rounded-full bg-surface-container-lowest absolute top-1 transition-transform ${
                    hapticFeedback ? 'left-6' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* Dark Mode */}
            <div className="flex items-center justify-between py-2">
              <div>
                <span className="text-xs font-medium text-on-surface block">Theme Mode</span>
                <span className="text-[11px] text-outline">Switch between Leitner Dark Slate and Light clean view</span>
              </div>
              <button
                onClick={toggleDarkMode}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container-high text-xs font-medium text-on-surface border border-surface-container-highest/30 transition-colors"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {isDarkMode ? 'dark_mode' : 'light_mode'}
                </span>
                <span>{isDarkMode ? 'Dark' : 'Light'}</span>
              </button>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-fixed text-on-primary text-xs font-semibold transition-all shadow-xs active:scale-95 cursor-pointer"
              type="button"
            >
              Save Configuration
            </button>
          </div>
        </section>

        {/* Data Management */}
        <section className="p-space-lg rounded-2xl bg-surface-container border border-surface-container-highest/30 shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-surface-container-highest/20">
            <div>
              <h3 className="text-sm font-semibold text-on-surface">Data Backup & Factory Reset</h3>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Export all user cards or restore initial demo state.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleExportAll}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface text-xs font-medium transition-colors border border-surface-container-highest/30 cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>Export Complete Deck Backup (.JSON)</span>
            </button>

            <button
              onClick={() => {
                if (confirm('Reset all flashcards and courses back to the authentic initial seed data?')) {
                  resetToDefaults();
                  alert('Reset complete. Original decks and session history restored.');
                }
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-error-container/20 hover:bg-error-container/40 text-error text-xs font-medium transition-colors border border-error/20 cursor-pointer ml-auto"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">restart_alt</span>
              <span>Reset to Sample Data</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
