import React, { useState, useMemo } from 'react';
import { useLeitner } from '../../context/LeitnerContext';
import { Course } from '../../types';

export const CoursesView: React.FC = () => {
  const { 
    courses, 
    setCurrentView, 
    startStudySession, 
    setIsNewCourseModalOpen,
    stats 
  } = useLeitner();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<'urgency' | 'mastery' | 'total'>('urgency');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const filteredCourses = useMemo(() => {
    let result = courses.filter(c => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.topics.some(t => t.toLowerCase().includes(q))
      );
    });

    if (sortOption === 'urgency') {
      result.sort((a, b) => b.dueCards - a.dueCards);
    } else if (sortOption === 'mastery') {
      result.sort((a, b) => b.masteryPercentage - a.masteryPercentage);
    } else if (sortOption === 'total') {
      result.sort((a, b) => b.totalCards - a.totalCards);
    }

    return result;
  }, [courses, searchQuery, sortOption]);

  const handleBatchOptimize = () => {
    alert('Optimizing all 6 active curricula decay vectors based on FSRS-5 spacing parameters. All intervals synchronized.');
  };

  return (
    <div className="flex flex-col w-full pb-space-xl">
      {/* Ambient Micro Top Gradient */}
      <div className="relative w-full overflow-hidden">
        <div className="absolute -top-32 left-1/4 w-96 h-96 bg-primary-container/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -top-32 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header Section */}
        <div className="flex flex-col gap-space-lg pt-2 pb-space-md">
          {/* Title Block & Primary CTA */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-xs text-primary tracking-wider uppercase font-code">
                <span>Academic Workspace</span>
                <span className="material-symbols-outlined text-outline text-[14px]">chevron_right</span>
                <span className="text-on-surface-variant">Curricula Management</span>
              </div>
              <div className="flex items-baseline gap-space-md flex-wrap">
                <h1 className="text-2xl lg:text-3xl font-semibold text-on-surface tracking-tight font-display">
                  Courses & Curricula
                </h1>
                <div className="flex items-center gap-2 text-xs text-on-surface-variant bg-surface-container-low px-3 py-1 rounded-full border border-surface-container-highest/30 font-code">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  <span>{courses.length} Active Courses</span>
                  <span className="text-outline">·</span>
                  <span>{stats.totalCards} Total Flashcards</span>
                  <span className="text-outline">·</span>
                  <span className="text-error font-medium">{stats.dueToday} Cards Due</span>
                </div>
              </div>
            </div>

            {/* Global Action Group */}
            <div className="flex items-center gap-2 self-start lg:self-auto">
              <button
                onClick={handleBatchOptimize}
                className="group relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface text-xs font-medium transition-all shadow-xs border border-surface-container-highest/40"
                type="button"
              >
                <span className="material-symbols-outlined text-outline group-hover:text-on-surface text-[18px]">
                  batch_prediction
                </span>
                <span>Batch Optimize</span>
                <kbd className="font-code text-[10px] text-outline px-1 rounded bg-surface-container-lowest ml-1">
                  ⌥B
                </kbd>
              </button>
              <button
                onClick={() => setIsNewCourseModalOpen(true)}
                className="relative flex items-center gap-1 px-4 py-2 rounded-xl bg-primary-container text-on-primary-container text-xs font-semibold hover:brightness-110 active:scale-[0.985] transition-all shadow-md"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                <span>New Course</span>
                <kbd className="font-code text-[10px] px-1.5 py-0.5 rounded bg-on-primary-container/20 text-on-primary-container ml-1">
                  N
                </kbd>
              </button>
            </div>
          </div>

          {/* Filter, Search, and Display Preference Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md p-2 rounded-xl bg-surface-container-low border border-surface-container-highest/30">
            {/* Search & Filter Cluster */}
            <div className="flex items-center gap-2 flex-1 max-w-xl">
              <div className="relative flex-1 flex items-center">
                <span className="material-symbols-outlined absolute left-2.5 text-outline pointer-events-none text-[18px]">
                  search
                </span>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-surface-container rounded-lg text-xs text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-highest transition-colors border border-surface-container-highest/20"
                  placeholder="Filter by course name, code (e.g. CS-304), or topic..."
                  type="text"
                />
              </div>

              {/* Sort Menu */}
              <div className="relative flex items-center">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as any)}
                  className="appearance-none bg-surface-container hover:bg-surface-container-high text-on-surface text-xs pl-3 pr-7 py-1.5 rounded-lg focus:outline-none cursor-pointer border border-surface-container-highest/30 font-code"
                >
                  <option value="urgency">Sort: Due Urgency</option>
                  <option value="mastery">Sort: Mastery %</option>
                  <option value="total">Sort: Total Cards</option>
                </select>
                <span className="material-symbols-outlined absolute right-2 text-outline pointer-events-none text-[16px]">
                  expand_more
                </span>
              </div>
            </div>

            {/* Layout Density & View Toggle */}
            <div className="flex items-center gap-3 self-end md:self-auto">
              <div className="flex items-center p-0.5 rounded-lg bg-surface-container border border-surface-container-highest/30">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center justify-center p-1.5 rounded transition-colors ${
                    viewMode === 'grid' ? 'bg-surface-container-highest text-on-surface shadow-xs' : 'text-outline hover:text-on-surface'
                  }`}
                  title="Bento Grid View"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">grid_view</span>
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`flex items-center justify-center p-1.5 rounded transition-colors ${
                    viewMode === 'table' ? 'bg-surface-container-highest text-on-surface shadow-xs' : 'text-outline hover:text-on-surface'
                  }`}
                  title="Tabular Matrix View"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">table_rows</span>
                </button>
              </div>
              <div className="h-4 w-px bg-surface-container-highest"></div>
              <div className="flex items-center gap-1.5 text-outline text-xs">
                <span>Retention Target:</span>
                <span className="font-code text-on-surface bg-surface-container px-1.5 py-0.5 rounded font-medium border border-surface-container-highest/20">
                  85% FSRS
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Courses Dynamic Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-space-lg pt-1">
          {filteredCourses.map((course) => {
            const getAccentColor = () => {
              if (course.dueCards > 15) return 'bg-error';
              if (course.dueCards > 0) return 'bg-tertiary';
              return 'bg-secondary';
            };

            return (
              <article
                key={course.id}
                className="relative flex flex-col justify-between rounded-2xl bg-surface-container p-space-lg shadow-sm hover:shadow-xl transition-all group overflow-hidden border border-surface-container-highest/30"
              >
                {/* Top Indicator Accent Bar */}
                <div className={`absolute top-0 left-0 right-0 h-1 ${getAccentColor()}`}></div>

                <div>
                  {/* Header Metadata */}
                  <div className="flex items-start justify-between gap-space-sm mb-2">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="font-code text-[11px] px-1.5 py-0.5 rounded bg-surface-container-high text-primary font-semibold">
                          {course.code}
                        </span>
                        <span className="text-[11px] text-outline font-code">
                          · {course.totalCards} Flashcards
                        </span>
                      </div>
                      <h2 className="text-base font-semibold text-on-surface tracking-tight leading-snug">
                        {course.name}
                      </h2>
                    </div>
                    <button
                      onClick={() => {
                        alert(`Configuring course properties for ${course.name}`);
                      }}
                      className="p-1 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container-high transition-colors"
                      title="Course Options"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">more_horiz</span>
                    </button>
                  </div>

                  {/* Urgency & Due Status Pill */}
                  <div className="flex items-center gap-2 mb-3">
                    {course.dueCards > 0 ? (
                      <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-error-container/40 text-error text-xs font-semibold font-code">
                        <span className="w-1.5 h-1.5 rounded-full bg-error animate-pulse"></span>
                        <span>{course.dueCards} cards due today</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary-container/20 text-secondary text-xs font-semibold font-code">
                        <span className="material-symbols-outlined text-[14px]">check_circle</span>
                        <span>All caught up</span>
                      </div>
                    )}
                    <span className="text-xs text-outline font-code">
                      Leitner Iteration {course.iteration}
                    </span>
                  </div>

                  {/* Leitner Box Distribution Miniature Visualizer */}
                  <div className="flex flex-col gap-1.5 p-2.5 rounded-xl bg-surface-container-low mb-space-md border border-surface-container-highest/20">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-on-surface-variant font-medium">
                        Box 5 Mastery: <strong className={course.masteryPercentage >= 90 ? 'text-secondary font-bold' : 'text-on-surface'}>{course.masteryPercentage}%</strong>
                      </span>
                      <span className="font-code text-outline text-[11px]">
                        {course.box5Cards} in L5
                      </span>
                    </div>

                    {/* Segmented Distribution Bar */}
                    <div className="flex h-2 w-full rounded-full overflow-hidden bg-surface-container-lowest gap-0.5">
                      <div className="bg-error/80" style={{ width: `${course.boxDistribution[0]}%` }} title={`Box 1: ${course.boxDistribution[0]} cards`}></div>
                      <div className="bg-tertiary/75" style={{ width: `${course.boxDistribution[1]}%` }} title={`Box 2: ${course.boxDistribution[1]} cards`}></div>
                      <div className="bg-primary-container/80" style={{ width: `${course.boxDistribution[2]}%` }} title={`Box 3: ${course.boxDistribution[2]} cards`}></div>
                      <div className="bg-primary/90" style={{ width: `${course.boxDistribution[3]}%` }} title={`Box 4: ${course.boxDistribution[3]} cards`}></div>
                      <div className="bg-secondary" style={{ width: `${course.boxDistribution[4]}%` }} title={`Box 5: ${course.boxDistribution[4]} cards`}></div>
                    </div>

                    {/* Micro Leitner Box Labels */}
                    <div className="flex justify-between items-center text-[10px] text-outline font-code px-0.5">
                      <span>L1: {course.boxDistribution[0]}</span>
                      <span>L2: {course.boxDistribution[1]}</span>
                      <span>L3: {course.boxDistribution[2]}</span>
                      <span>L4: {course.boxDistribution[3]}</span>
                      <span className="text-secondary font-semibold">L5: {course.boxDistribution[4]}</span>
                    </div>
                  </div>

                  {/* Semantic Topics Matrix */}
                  <div className="flex flex-wrap gap-1.5 mb-space-md">
                    {course.topics.map(topic => (
                      <span
                        key={topic}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-surface-container-high text-on-surface-variant border border-surface-container-highest/20 font-medium"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer / Interaction State */}
                <div className="flex flex-col gap-2 pt-2 border-t border-surface-container-highest/30">
                  <div className="flex items-center gap-1.5 text-xs text-on-surface-variant truncate font-code">
                    <span className="material-symbols-outlined text-outline text-[14px]">
                      {course.dueCards > 0 ? 'history' : 'alarm'}
                    </span>
                    <span className="truncate">
                      {course.dueCards > 0 ? (
                        <>Studied {course.lastStudiedTime} · <span className="text-on-surface font-medium">{course.lastStudiedTopic}</span></>
                      ) : (
                        <>Next review {course.nextScheduled} · <span className="text-on-surface font-medium">{course.lastStudiedTopic}</span></>
                      )}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    {course.dueCards > 0 ? (
                      <button
                        onClick={() => startStudySession(course.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-primary text-on-primary text-xs font-semibold hover:bg-primary-fixed transition-all active:scale-[0.985] shadow-xs cursor-pointer"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                        <span>Study Now</span>
                        <span className="font-code text-[10px] opacity-75">↵</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => startStudySession(course.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface text-xs font-medium transition-all active:scale-[0.985] cursor-pointer"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-outline text-[16px]">fast_forward</span>
                        <span>Review Ahead</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setCurrentView('library');
                      }}
                      className="flex items-center justify-center p-2 rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface-variant hover:text-on-surface transition-colors border border-surface-container-highest/30"
                      title="Inspect Deck Database"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[16px]">style</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Curricular Health & Retention Synthesis Bento Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg mt-space-lg">
          {/* Box Retention Heatmap Visual */}
          <div className="flex flex-col p-space-lg rounded-2xl bg-surface-container-low gap-space-md border border-surface-container-highest/30 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[18px]">analytics</span>
                <span className="text-sm font-semibold text-on-surface">Leitner Equilibrium</span>
              </div>
              <span className="text-xs text-secondary font-code font-bold">84.2% Total Retention</span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Probability of retrieval across 5 storage thresholds based on Ebbinghaus decay formulas.
            </p>

            {/* Retention Chart */}
            <div className="w-full flex items-end gap-3 h-28 pt-2">
              <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <span className="font-code text-[11px] text-outline">18%</span>
                <div className="w-full bg-error rounded-t transition-all" style={{ height: '28%' }}></div>
                <span className="text-[11px] text-outline font-code">Box 1</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <span className="font-code text-[11px] text-outline">35%</span>
                <div className="w-full bg-tertiary rounded-t transition-all" style={{ height: '45%' }}></div>
                <span className="text-[11px] text-outline font-code">Box 2</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <span className="font-code text-[11px] text-outline">62%</span>
                <div className="w-full bg-primary-container rounded-t transition-all" style={{ height: '65%' }}></div>
                <span className="text-[11px] text-outline font-code">Box 3</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <span className="font-code text-[11px] text-outline">81%</span>
                <div className="w-full bg-primary rounded-t transition-all" style={{ height: '82%' }}></div>
                <span className="text-[11px] text-outline font-code">Box 4</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <span className="font-code text-[11px] text-secondary font-bold">95%</span>
                <div className="w-full bg-secondary rounded-t transition-all" style={{ height: '96%' }}></div>
                <span className="text-[11px] text-secondary font-code font-semibold">Box 5</span>
              </div>
            </div>
          </div>

          {/* Quick Syllabi / CSV Ingest Dropzone Strip (Span 2) */}
          <div className="lg:col-span-2 flex flex-col justify-between p-space-lg rounded-2xl bg-surface-container-low relative overflow-hidden border border-surface-container-highest/30 shadow-xs">
            <div className="flex flex-col gap-1 z-10">
              <div className="flex items-center gap-1 text-primary text-xs font-semibold tracking-wider uppercase font-code">
                <span className="material-symbols-outlined text-[16px]">bolt</span>
                <span>Rapid Curricular Ingestion</span>
              </div>
              <h3 className="text-base font-semibold text-on-surface">Drop lecture syllabi, Markdown or CSV</h3>
              <p className="text-xs text-on-surface-variant max-w-xl leading-relaxed">
                Automatically tokenize key terms, construct Leitner Tier-1 baseline intervals, and bind prerequisite courses via our local neural parser.
              </p>
            </div>

            {/* Tactile Dropzone Plate */}
            <div 
              onClick={() => setCurrentView('import')}
              className="mt-space-md p-space-md rounded-xl bg-surface-container flex flex-col sm:flex-row items-center justify-between gap-space-md hover:bg-surface-container-high transition-colors cursor-pointer group border border-surface-container-highest/30"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-surface-container-highest flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[20px]">upload_file</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-on-surface">Select academic spreadsheet or notes export</span>
                  <span className="text-[11px] text-outline font-code">Supported: .csv, .tsv, .md (Anki/Quizlet compatible)</span>
                </div>
              </div>
              <button 
                className="px-4 py-2 rounded-xl bg-surface-container-highest hover:bg-surface-bright text-on-surface text-xs font-semibold transition-colors whitespace-nowrap shadow-xs"
                type="button"
              >
                Launch Ingest Wizard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
