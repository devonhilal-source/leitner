import React, { useState } from 'react';
import { useLeitner } from '../../context/LeitnerContext';

export const NewCourseModal: React.FC = () => {
  const { isNewCourseModalOpen, setIsNewCourseModalOpen, addCourse } = useLeitner();

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [topicsInput, setTopicsInput] = useState('');

  if (!isNewCourseModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !name.trim()) return;

    const topics = topicsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    addCourse({
      code: code.trim().toUpperCase(),
      name: name.trim(),
      topics: topics.length > 0 ? topics : ['Core Modules'],
    });

    setIsNewCourseModalOpen(false);
    setCode('');
    setName('');
    setTopicsInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-dim/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-md bg-surface-container rounded-2xl shadow-2xl border border-surface-container-highest/40 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-container-highest/30">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">school</span>
            <h3 className="text-base font-semibold text-on-surface">Add New Curriculum</h3>
          </div>
          <button
            onClick={() => setIsNewCourseModalOpen(false)}
            className="p-1 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container-high transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 text-xs">
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-on-surface font-code">
              Course Code <span className="text-error">*</span>
            </label>
            <input
              required
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. CS-401 or BIO-102"
              className="w-full p-2.5 rounded-xl bg-surface-container-low border border-surface-container-highest/40 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary font-code text-xs uppercase"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-on-surface font-code">
              Course Title <span className="text-error">*</span>
            </label>
            <input
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Distributed Systems & Cloud Infrastructure"
              className="w-full p-2.5 rounded-xl bg-surface-container-low border border-surface-container-highest/40 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary font-sans text-xs"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-on-surface font-code">
              Core Topics (comma separated)
            </label>
            <input
              type="text"
              value={topicsInput}
              onChange={(e) => setTopicsInput(e.target.value)}
              placeholder="Raft Consensus, Microservices, CAP Theorem"
              className="w-full p-2.5 rounded-xl bg-surface-container-low border border-surface-container-highest/40 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary font-sans text-xs"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-surface-container-highest/30">
            <button
              onClick={() => setIsNewCourseModalOpen(false)}
              type="button"
              className="px-4 py-2 rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface text-xs font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-fixed text-on-primary text-xs font-semibold shadow-xs active:scale-95 transition-all"
            >
              Create Course
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
