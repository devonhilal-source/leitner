import React, { useState, useMemo } from 'react';
import { useLeitner } from '../../context/LeitnerContext';
import { Flashcard, LeitnerBoxNumber, Difficulty } from '../../types';

export const LibraryView: React.FC = () => {
  const { 
    flashcards, 
    courses, 
    setCurrentView, 
    startStudySession, 
    bulkMoveCards, 
    bulkDeleteCards, 
    deleteCard, 
    setEditingCard, 
    setIsCreateCardModalOpen,
    stats
  } = useLeitner();

  const [activeBoxTab, setActiveBoxTab] = useState<LeitnerBoxNumber | 'all'>('all');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [selectedCardIds, setSelectedCardIds] = useState<string[]>(['q-002', 'q-005']); // Pre-selected 2 like mockup
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter cards
  const filteredCards = useMemo(() => {
    return flashcards.filter(card => {
      if (activeBoxTab !== 'all' && card.box !== activeBoxTab) return false;
      if (selectedCourseFilter !== 'all' && card.courseId !== selectedCourseFilter) return false;
      if (difficultyFilter !== 'all' && card.difficulty !== difficultyFilter) return false;
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchesQ = card.question.toLowerCase().includes(query);
        const matchesA = card.answer.toLowerCase().includes(query);
        const matchesTopic = card.topic.toLowerCase().includes(query);
        const matchesCourse = card.courseName.toLowerCase().includes(query);
        const matchesTags = card.tags.some(t => t.toLowerCase().includes(query));
        if (!matchesQ && !matchesA && !matchesTopic && !matchesCourse && !matchesTags) return false;
      }
      return true;
    });
  }, [flashcards, activeBoxTab, selectedCourseFilter, difficultyFilter, searchTerm]);

  // Paginated cards
  const totalPages = Math.max(1, Math.ceil(filteredCards.length / itemsPerPage));
  const paginatedCards = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCards.slice(start, start + itemsPerPage);
  }, [filteredCards, currentPage]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedCardIds(paginatedCards.map(c => c.id));
    } else {
      setSelectedCardIds([]);
    }
  };

  const toggleSelectCard = (id: string) => {
    setSelectedCardIds(prev => 
      prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
    );
  };

  const handleExportSelected = () => {
    const toExport = flashcards.filter(c => selectedCardIds.includes(c.id));
    const jsonStr = JSON.stringify(toExport, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leitner_export_${selectedCardIds.length}_cards.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col w-full pb-space-xl">
      {/* Top Stats & Header Bar */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-space-md pt-2 pb-space-md">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-primary font-code">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-secondary"></span>
            <span>Repository Master Index</span>
          </div>
          <div className="flex items-baseline gap-space-sm flex-wrap">
            <h1 className="text-2xl lg:text-3xl font-semibold text-on-surface tracking-tight font-display">
              Flashcard Library
            </h1>
            <span className="text-xs text-on-surface-variant font-code px-2 py-0.5 rounded bg-surface-container-high border border-surface-container-highest/40">
              {stats.totalCards} cards across {courses.length} courses
            </span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentView('import')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors text-xs font-medium border border-surface-container-highest/30"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">file_upload</span>
            <span>Import CSV</span>
          </button>
          <button
            onClick={() => {
              setEditingCard(null);
              setIsCreateCardModalOpen(true);
            }}
            className="flex items-center gap-1 px-4 py-2 rounded-lg bg-primary text-on-primary text-xs font-semibold hover:bg-primary-fixed transition-all shadow-sm active:scale-95"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Create Card</span>
            <kbd className="ml-1 px-1.5 py-0.5 rounded bg-on-primary/20 text-on-primary font-code text-[10px]">
              C
            </kbd>
          </button>
        </div>
      </section>

      {/* Leitner System Distribution Ribbon */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-space-md">
        {/* Total All */}
        <button
          onClick={() => setActiveBoxTab('all')}
          className={`flex flex-col p-3 rounded-xl transition-all text-left group border ${
            activeBoxTab === 'all'
              ? 'bg-surface-container-high border-primary/40 shadow-xs'
              : 'bg-surface-container hover:bg-surface-container-high border-transparent'
          }`}
          type="button"
        >
          <div className="flex items-center justify-between w-full mb-1">
            <span className="text-xs font-semibold text-on-surface uppercase tracking-wider font-code">All Boxes</span>
            <span className="material-symbols-outlined text-outline text-[16px] group-hover:text-primary transition-colors">
              grid_view
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-on-surface font-display">{stats.totalCards}</span>
            <span className="text-xs text-on-surface-variant">total</span>
          </div>
          <div className="w-full bg-surface-container-lowest h-1.5 rounded-full mt-2.5 overflow-hidden flex">
            <div className="bg-error w-[5%] h-full"></div>
            <div className="bg-tertiary w-[9%] h-full"></div>
            <div className="bg-primary-container w-[15%] h-full"></div>
            <div className="bg-primary w-[25%] h-full"></div>
            <div className="bg-secondary w-[46%] h-full"></div>
          </div>
        </button>

        {/* Box 1 */}
        <button
          onClick={() => setActiveBoxTab(1)}
          className={`flex flex-col p-3 rounded-xl transition-all text-left border ${
            activeBoxTab === 1
              ? 'bg-surface-container-high border-error/40 shadow-xs'
              : 'bg-surface-container hover:bg-surface-container-high border-transparent'
          }`}
          type="button"
        >
          <div className="flex items-center justify-between w-full mb-1">
            <span className="text-xs text-on-surface-variant uppercase font-medium font-code">Box 1 · Daily</span>
            <span className="w-2 h-2 rounded-full bg-error"></span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-on-surface font-display">{stats.boxCounts[1]}</span>
            <span className="text-xs text-error font-medium font-code">due today</span>
          </div>
          <div className="w-full bg-surface-container-lowest h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div className="bg-error h-full" style={{ width: '100%' }}></div>
          </div>
        </button>

        {/* Box 2 */}
        <button
          onClick={() => setActiveBoxTab(2)}
          className={`flex flex-col p-3 rounded-xl transition-all text-left border ${
            activeBoxTab === 2
              ? 'bg-surface-container-high border-tertiary/40 shadow-xs'
              : 'bg-surface-container hover:bg-surface-container-high border-transparent'
          }`}
          type="button"
        >
          <div className="flex items-center justify-between w-full mb-1">
            <span className="text-xs text-on-surface-variant uppercase font-medium font-code">Box 2 · 2-3 Days</span>
            <span className="w-2 h-2 rounded-full bg-tertiary"></span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-on-surface font-display">{stats.boxCounts[2]}</span>
            <span className="text-xs text-on-surface-variant font-code">active</span>
          </div>
          <div className="w-full bg-surface-container-lowest h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div className="bg-tertiary h-full" style={{ width: '55%' }}></div>
          </div>
        </button>

        {/* Box 3 */}
        <button
          onClick={() => setActiveBoxTab(3)}
          className={`flex flex-col p-3 rounded-xl transition-all text-left border ${
            activeBoxTab === 3
              ? 'bg-surface-container-high border-primary-container/40 shadow-xs'
              : 'bg-surface-container hover:bg-surface-container-high border-transparent'
          }`}
          type="button"
        >
          <div className="flex items-center justify-between w-full mb-1">
            <span className="text-xs text-on-surface-variant uppercase font-medium font-code">Box 3 · Weekly</span>
            <span className="w-2 h-2 rounded-full bg-primary-container"></span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-on-surface font-display">{stats.boxCounts[3]}</span>
            <span className="text-xs text-on-surface-variant font-code">maturing</span>
          </div>
          <div className="w-full bg-surface-container-lowest h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div className="bg-primary-container h-full" style={{ width: '70%' }}></div>
          </div>
        </button>

        {/* Box 4 */}
        <button
          onClick={() => setActiveBoxTab(4)}
          className={`flex flex-col p-3 rounded-xl transition-all text-left border ${
            activeBoxTab === 4
              ? 'bg-surface-container-high border-primary/40 shadow-xs'
              : 'bg-surface-container hover:bg-surface-container-high border-transparent'
          }`}
          type="button"
        >
          <div className="flex items-center justify-between w-full mb-1">
            <span className="text-xs text-on-surface-variant uppercase font-medium font-code">Box 4 · Bi-weekly</span>
            <span className="w-2 h-2 rounded-full bg-primary"></span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-on-surface font-display">{stats.boxCounts[4]}</span>
            <span className="text-xs text-on-surface-variant font-code">stable</span>
          </div>
          <div className="w-full bg-surface-container-lowest h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div className="bg-primary h-full" style={{ width: '82%' }}></div>
          </div>
        </button>

        {/* Box 5 */}
        <button
          onClick={() => setActiveBoxTab(5)}
          className={`flex flex-col p-3 rounded-xl transition-all text-left border ${
            activeBoxTab === 5
              ? 'bg-surface-container-high border-secondary/40 shadow-xs'
              : 'bg-surface-container hover:bg-surface-container-high border-transparent'
          }`}
          type="button"
        >
          <div className="flex items-center justify-between w-full mb-1">
            <span className="text-xs text-secondary font-medium uppercase font-code">Box 5 · Mastered</span>
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-secondary font-display">{stats.boxCounts[5]}</span>
            <span className="text-xs text-secondary-fixed-dim font-code">retained</span>
          </div>
          <div className="w-full bg-surface-container-lowest h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div className="bg-secondary h-full" style={{ width: '95%' }}></div>
          </div>
        </button>
      </section>

      {/* Filter & Command Bar */}
      <section className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-space-sm p-2 bg-surface-container rounded-xl mb-space-sm border border-surface-container-highest/20">
        {/* Search Bar with hotkey cue */}
        <div className="relative flex-1 min-w-[280px]">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline text-[18px] pointer-events-none">
            search
          </span>
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-12 py-2 bg-surface-container-lowest rounded-lg text-xs text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-1 focus:ring-primary border border-surface-container-highest/30 transition-all"
            id="librarySearch"
            placeholder="Search questions, answers, formulas, or tags (/) ..."
            type="text"
          />
          <kbd className="absolute right-3 top-2.5 px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-code text-[10px] pointer-events-none">
            /
          </kbd>
        </div>

        {/* Dynamic Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Course Selector */}
          <div className="relative">
            <select
              value={selectedCourseFilter}
              onChange={(e) => setSelectedCourseFilter(e.target.value)}
              className="appearance-none bg-surface-container-lowest hover:bg-surface-container-high text-on-surface text-xs pl-3 pr-8 py-2 rounded-lg focus:outline-none cursor-pointer border border-surface-container-highest/30 transition-colors"
            >
              <option value="all">All Courses ({stats.totalCards})</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.name} ({course.totalCards})
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-outline text-[16px] pointer-events-none">
              expand_more
            </span>
          </div>

          {/* Difficulty Selector */}
          <div className="flex items-center bg-surface-container-lowest rounded-lg p-0.5 border border-surface-container-highest/30">
            {(['all', 'Easy', 'Medium', 'Hard'] as const).map(diff => (
              <button
                key={diff}
                onClick={() => setDifficultyFilter(diff)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  difficultyFilter === diff
                    ? 'bg-surface-container-high text-on-surface'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
                type="button"
              >
                {diff === 'all' ? 'Diff: All' : diff}
              </button>
            ))}
          </div>

          {/* View Switcher */}
          <div className="flex items-center bg-surface-container-lowest rounded-lg p-0.5 border border-surface-container-highest/30 ml-auto lg:ml-0">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'table' ? 'bg-surface-container-high text-primary shadow-xs' : 'text-on-surface-variant hover:text-on-surface'
              }`}
              title="Table View"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">table_rows</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-surface-container-high text-primary shadow-xs' : 'text-on-surface-variant hover:text-on-surface'
              }`}
              title="Grid Card View"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">view_module</span>
            </button>
          </div>
        </div>
      </section>

      {/* Bulk Selection Floating Context Strip */}
      {selectedCardIds.length > 0 && (
        <div className="flex items-center justify-between px-space-md py-2.5 bg-primary text-on-primary rounded-xl mb-space-sm shadow-md transition-all animate-fadeIn">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-5 h-5 rounded bg-on-primary text-primary font-code font-bold text-xs">
              {selectedCardIds.length}
            </div>
            <span className="text-xs font-semibold">cards selected in repository</span>
            <span className="text-on-primary/60 text-xs">·</span>
            <button
              onClick={() => setSelectedCardIds([])}
              className="text-on-primary/80 hover:text-on-primary underline text-xs cursor-pointer"
              type="button"
            >
              Deselect all
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => bulkMoveCards(selectedCardIds, 1)}
              className="px-2.5 py-1 rounded bg-on-primary/10 hover:bg-on-primary/20 text-on-primary text-xs font-medium transition-colors"
              type="button"
            >
              Move to Box 1
            </button>
            <button
              onClick={() => bulkMoveCards(selectedCardIds, 5)}
              className="px-2.5 py-1 rounded bg-on-primary/10 hover:bg-on-primary/20 text-on-primary text-xs font-medium transition-colors"
              type="button"
            >
              Move to Box 5
            </button>
            <button
              onClick={handleExportSelected}
              className="px-2.5 py-1 rounded bg-on-primary/10 hover:bg-on-primary/20 text-on-primary text-xs font-medium transition-colors flex items-center gap-1"
              type="button"
            >
              <span className="material-symbols-outlined text-[14px]">file_download</span>
              Export
            </button>
            <button
              onClick={() => {
                bulkDeleteCards(selectedCardIds);
                setSelectedCardIds([]);
              }}
              className="p-1 rounded bg-on-primary/10 hover:bg-error hover:text-on-error text-on-primary transition-colors ml-1"
              title="Delete selected"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">delete</span>
            </button>
          </div>
        </div>
      )}

      {/* View Mode: Table View */}
      {viewMode === 'table' ? (
        <div className="w-full bg-surface-container rounded-xl overflow-hidden shadow-sm border border-surface-container-highest/30">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-high/60 text-on-surface-variant text-[11px] font-semibold uppercase tracking-wider select-none font-code">
                  <th className="py-2.5 px-space-md w-12 text-center">
                    <input
                      checked={paginatedCards.length > 0 && paginatedCards.every(c => selectedCardIds.includes(c.id))}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded accent-primary cursor-pointer bg-surface-container-lowest"
                      type="checkbox"
                    />
                  </th>
                  <th className="py-2.5 px-3 font-medium">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-on-surface transition-colors">
                      <span>Prompt / Flashcard Question</span>
                      <span className="material-symbols-outlined text-[14px]">straight</span>
                    </div>
                  </th>
                  <th className="py-2.5 px-3 font-medium">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-on-surface transition-colors">
                      <span>Course & Topic</span>
                      <span className="material-symbols-outlined text-[14px] text-outline">unfold_more</span>
                    </div>
                  </th>
                  <th className="py-2.5 px-3 font-medium">Difficulty</th>
                  <th className="py-2.5 px-3 font-medium min-w-[170px]">
                    <div className="flex items-center gap-1">
                      <span>Leitner Box Progress</span>
                      <span className="material-symbols-outlined text-[14px] text-outline" title="Boxes 1 to 5">help_outline</span>
                    </div>
                  </th>
                  <th className="py-2.5 px-3 font-medium">Next Due</th>
                  <th className="py-2.5 px-space-md text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-high text-xs">
                {paginatedCards.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-on-surface-variant font-code">
                      No flashcards found matching the criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedCards.map((card) => {
                    const isSelected = selectedCardIds.includes(card.id);
                    const getBoxColor = (box: LeitnerBoxNumber) => {
                      switch (box) {
                        case 1: return 'text-error bg-error';
                        case 2: return 'text-tertiary bg-tertiary';
                        case 3: return 'text-primary-container bg-primary-container';
                        case 4: return 'text-primary bg-primary';
                        case 5: return 'text-secondary bg-secondary';
                      }
                    };
                    const boxLabels: Record<LeitnerBoxNumber, string> = {
                      1: 'Daily',
                      2: '2-3 Days',
                      3: 'Weekly',
                      4: 'Bi-weekly',
                      5: 'Mastered',
                    };

                    return (
                      <tr
                        key={card.id}
                        className={`transition-colors group ${
                          isSelected ? 'bg-surface-container-high/50' : 'hover:bg-surface-container-high/40'
                        }`}
                      >
                        <td className="py-3 px-space-md text-center">
                          <input
                            checked={isSelected}
                            onChange={() => toggleSelectCard(card.id)}
                            className="w-4 h-4 rounded accent-primary cursor-pointer bg-surface-container-lowest"
                            type="checkbox"
                          />
                        </td>
                        <td className="py-3 px-3 max-w-sm">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span 
                                onClick={() => {
                                  setEditingCard(card);
                                  setIsCreateCardModalOpen(true);
                                }}
                                className="text-on-surface font-medium group-hover:text-primary transition-colors cursor-pointer leading-snug"
                              >
                                {card.question}
                              </span>
                              {card.isDue && (
                                <span className="px-1.5 py-0.2 rounded bg-error-container text-error text-[10px] font-code uppercase font-bold">
                                  Due
                                </span>
                              )}
                            </div>
                            <span className="text-on-surface-variant font-code truncate text-[11px] mt-0.5">
                              {card.answer}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex flex-col">
                            <span className="text-on-surface font-medium">{card.courseName}</span>
                            <span className="text-on-surface-variant text-[11px]">{card.topic}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full font-code text-[11px] font-medium inline-block ${
                              card.difficulty === 'Hard'
                                ? 'bg-error/10 text-error'
                                : card.difficulty === 'Medium'
                                ? 'bg-surface-container-high text-tertiary'
                                : 'bg-secondary/10 text-secondary'
                            }`}
                          >
                            {card.difficulty}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className={`font-code font-medium ${getBoxColor(card.box).split(' ')[0]}`}>
                                Box {card.box}
                              </span>
                              <span className="text-on-surface-variant font-code">
                                {boxLabels[card.box]}
                              </span>
                            </div>
                            {/* 5-segment Leitner bar */}
                            <div className="flex gap-1 h-1.5 w-full">
                              {[1, 2, 3, 4, 5].map((b) => (
                                <span
                                  key={b}
                                  className={`flex-1 rounded-xs ${
                                    b <= card.box
                                      ? getBoxColor(card.box).split(' ')[1]
                                      : 'bg-surface-container-highest'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 font-code text-[11px]">
                          <span className={card.isDue ? 'text-error font-semibold' : 'text-on-surface-variant'}>
                            {card.nextDueText}
                          </span>
                        </td>
                        <td className="py-3 px-space-md text-right">
                          <div className="flex items-center justify-end gap-1">
                            {card.isDue && (
                              <button
                                onClick={() => startStudySession(card.courseId)}
                                className="px-2 py-1 rounded bg-error/15 text-error font-code text-[11px] font-semibold hover:bg-error hover:text-on-error transition-colors mr-1"
                                type="button"
                              >
                                Study Now
                              </button>
                            )}
                            <button
                              onClick={() => {
                                setEditingCard(card);
                                setIsCreateCardModalOpen(true);
                              }}
                              className="p-1.5 rounded hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface"
                              title="Edit Card"
                              type="button"
                            >
                              <span className="material-symbols-outlined text-[16px]">edit</span>
                            </button>
                            <button
                              onClick={() => {
                                const nextB = (card.box % 5 + 1) as LeitnerBoxNumber;
                                bulkMoveCards([card.id], nextB);
                              }}
                              className="p-1.5 rounded hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface"
                              title={`Advance Box (Current: Box ${card.box})`}
                              type="button"
                            >
                              <span className="material-symbols-outlined text-[16px]">drive_file_move</span>
                            </button>
                            <button
                              onClick={() => deleteCard(card.id)}
                              className="p-1.5 rounded hover:bg-error/20 text-on-surface-variant hover:text-error"
                              title="Delete Card"
                              type="button"
                            >
                              <span className="material-symbols-outlined text-[16px]">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer / Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-space-sm px-space-md py-3 bg-surface-container-high/40 border-t border-surface-container-highest/20 text-xs">
            <div className="flex items-center gap-2 text-on-surface-variant">
              <span>
                Showing <strong className="text-on-surface font-semibold">{Math.min(1, filteredCards.length)}–{Math.min(filteredCards.length, itemsPerPage * currentPage)}</strong> of{' '}
                <strong className="text-on-surface font-semibold">{stats.totalCards}</strong> cards
              </span>
              <span>·</span>
              <span className="font-code text-[11px]">Page {currentPage} of {totalPages}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg bg-surface-container text-outline hover:text-on-surface disabled:opacity-40 disabled:cursor-not-allowed"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">first_page</span>
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-2.5 py-1 rounded-lg bg-surface-container text-on-surface disabled:opacity-40 disabled:cursor-not-allowed font-medium"
                type="button"
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1).map((pg) => (
                  <button
                    key={pg}
                    onClick={() => setCurrentPage(pg)}
                    className={`w-7 h-7 rounded-lg font-code text-xs font-semibold ${
                      currentPage === pg
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                    }`}
                    type="button"
                  >
                    {pg}
                  </button>
                ))}
                {totalPages > 3 && <span className="text-outline px-1">...</span>}
              </div>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface disabled:opacity-40 disabled:cursor-not-allowed font-medium"
                type="button"
              >
                Next
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface disabled:opacity-40 disabled:cursor-not-allowed"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">last_page</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Grid Mode */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {paginatedCards.map(card => (
            <div
              key={card.id}
              className="p-4 rounded-xl bg-surface-container hover:bg-surface-container-high transition-all flex flex-col justify-between border border-surface-container-highest/30 shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-code text-xs px-2 py-0.5 rounded bg-surface-container-low text-primary">
                    Box {card.box}
                  </span>
                  <span className="text-xs text-on-surface-variant font-code">{card.nextDueText}</span>
                </div>
                <h4 className="font-medium text-sm text-on-surface mb-2 leading-snug">{card.question}</h4>
                <p className="text-xs text-on-surface-variant font-code leading-relaxed">{card.answer}</p>
              </div>
              <div className="flex items-center justify-between pt-3 mt-3 border-t border-surface-container-highest/20 text-xs">
                <span className="text-on-surface-variant truncate">{card.courseName}</span>
                <button
                  onClick={() => {
                    setEditingCard(card);
                    setIsCreateCardModalOpen(true);
                  }}
                  className="text-primary hover:underline font-code text-xs"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Keyboard Shortcuts Helper Strip */}
      <footer className="mt-space-md flex flex-wrap items-center justify-between gap-space-sm text-xs text-on-surface-variant">
        <div className="flex flex-wrap items-center gap-space-md">
          <div className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-surface-container font-code text-[11px] text-on-surface">Space</kbd>
            <span>Toggle Select</span>
          </div>
          <div className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-surface-container font-code text-[11px] text-on-surface">J / K</kbd>
            <span>Navigate Rows</span>
          </div>
          <div className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-surface-container font-code text-[11px] text-on-surface">E</kbd>
            <span>Quick Edit</span>
          </div>
          <div className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-surface-container font-code text-[11px] text-on-surface">1 - 5</kbd>
            <span>Reassign Leitner Box</span>
          </div>
        </div>
        <div className="flex items-center gap-2 font-code text-[11px]">
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
          <span>Sync state: Synchronized with Leitner Cloud Core</span>
        </div>
      </footer>
    </div>
  );
};
