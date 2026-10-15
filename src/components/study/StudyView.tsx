import React, { useState, useEffect, useCallback } from 'react';
import { useLeitner } from '../../context/LeitnerContext';
import confetti from 'canvas-confetti';

export const StudyView: React.FC = () => {
  const { 
    flashcards, 
    selectedCourseId, 
    setCurrentView, 
    recordCardReview, 
    undoLastReview,
    setEditingCard,
    setIsCreateCardModalOpen 
  } = useLeitner();

  // Filter study cards for current session
  const studyDeck = React.useMemo(() => {
    let pool = flashcards;
    if (selectedCourseId) {
      pool = flashcards.filter(c => c.courseId === selectedCourseId);
    }
    // Prioritize due cards
    return pool.length > 0 ? pool : flashcards;
  }, [flashcards, selectedCourseId]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(true); // Default true to match mockup state, toggleable
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [sessionSeconds, setSessionSeconds] = useState(272); // Starts at 04:32 like mockup
  const [reviewStats, setReviewStats] = useState({ correct: 43, hard: 3, again: 2 });

  const currentCard = studyDeck[currentIndex] || studyDeck[0];

  // Active Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleGrade = useCallback((rating: 'again' | 'hard' | 'correct') => {
    if (!currentCard) return;

    recordCardReview(currentCard.id, rating);
    setReviewStats(prev => ({
      ...prev,
      [rating]: prev[rating] + 1,
    }));

    if (currentIndex + 1 >= studyDeck.length) {
      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#4edea3', '#8083ff', '#ffb95f'],
        });
      } catch (e) {
        console.error(e);
      }
      setIsCompleteModalOpen(true);
    } else {
      setCurrentIndex(prev => prev + 1);
      // Keep next revealed or unrevealed based on preferred flow
    }
  }, [currentCard, currentIndex, studyDeck.length, recordCardReview]);

  // Keyboard navigation for study session
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      if (e.key === 'Escape') {
        if (isCompleteModalOpen) {
          setIsCompleteModalOpen(false);
        } else {
          setCurrentView('overview');
        }
      } else if (e.code === 'Space') {
        e.preventDefault();
        if (!isRevealed) {
          setIsRevealed(true);
        } else {
          handleGrade('correct');
        }
      } else if (e.key === '1') {
        e.preventDefault();
        handleGrade('again');
      } else if (e.key === '2') {
        e.preventDefault();
        handleGrade('hard');
      } else if (e.key === '3') {
        e.preventDefault();
        handleGrade('correct');
      } else if (e.key.toLowerCase() === 'e') {
        e.preventDefault();
        if (currentCard) {
          setEditingCard(currentCard);
          setIsCreateCardModalOpen(true);
        }
      } else if (e.key.toLowerCase() === 'z') {
        e.preventDefault();
        undoLastReview();
        if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isRevealed, isCompleteModalOpen, handleGrade, currentCard, currentIndex, setCurrentView, setEditingCard, setIsCreateCardModalOpen, undoLastReview]);

  if (!currentCard) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <h2 className="text-xl font-bold mb-2">No cards in this deck!</h2>
        <button
          onClick={() => setCurrentView('overview')}
          className="px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-medium"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  // Next target tier preview
  const nextTargetBox = Math.min(5, currentCard.box + 1);

  return (
    <div className="flex flex-col w-full pb-space-xl">
      {/* Top Auxiliary Command Strip */}
      <header className="w-full flex flex-col md:flex-row items-center justify-between gap-space-md py-1.5 mb-space-md select-none">
        {/* Left: Navigation breadcrumb & subject scope */}
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <button
            onClick={() => setCurrentView('overview')}
            className="group flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface-variant hover:text-on-surface text-xs font-medium border border-surface-container-highest/30"
            type="button"
          >
            <span className="material-symbols-outlined text-outline text-[18px]">arrow_back</span>
            <span>Dashboard</span>
            <span className="font-code text-[10px] px-1.5 py-0.5 rounded bg-surface-container-highest text-outline group-hover:text-on-surface transition-colors ml-1">
              Esc · Pause
            </span>
          </button>
          <span className="w-1 h-1 rounded-full bg-surface-container-highest"></span>
          <div className="flex items-center gap-2 min-w-0">
            <span className="px-2.5 py-1 rounded bg-surface-container-low text-xs font-medium text-on-surface truncate max-w-[210px] md:max-w-none border border-surface-container-highest/20">
              {currentCard.courseName}
            </span>
            <span className="px-2 py-0.5 rounded bg-surface-container-high font-code text-[11px] text-primary">
              {currentCard.topic}
            </span>
          </div>
        </div>

        {/* Center: Segmented session pace tracker */}
        <div className="flex flex-col items-center gap-1.5 w-full md:w-80">
          <div className="flex items-center justify-between w-full text-xs font-code">
            <div className="flex items-center gap-1 text-on-surface">
              <span className="font-semibold text-primary">{currentIndex + 1}</span>
              <span className="text-outline">/</span>
              <span className="text-outline">{studyDeck.length} cards</span>
            </div>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-outline text-[14px]">timer</span>
                {formatTime(sessionSeconds)}
              </span>
              <span className="w-1 h-1 rounded-full bg-surface-container-highest"></span>
              <span className="text-secondary font-medium">91% Recall</span>
            </div>
          </div>

          {/* Segmented Bar mimicking Leitner micro steps */}
          <div className="w-full flex items-center gap-0.5 h-1.5">
            {Array.from({ length: Math.min(24, studyDeck.length) }).map((_, idx) => (
              <div
                key={idx}
                className={`h-full flex-1 rounded-full transition-all ${
                  idx < currentIndex
                    ? 'bg-secondary'
                    : idx === currentIndex
                    ? 'bg-primary animate-pulse'
                    : 'bg-surface-container-high'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right: Leitner Box migration telemetry & Actions */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-low text-xs border border-surface-container-highest/30">
            <span className="text-outline">Tier:</span>
            <span className="px-1.5 py-0.5 rounded bg-surface-container font-code text-on-surface font-semibold">
              Box {currentCard.box}
            </span>
            <span className="material-symbols-outlined text-outline text-[14px]">arrow_forward</span>
            <span className="px-1.5 py-0.5 rounded bg-secondary/15 text-secondary font-code font-semibold">
              Box {nextTargetBox}
            </span>
          </div>
          <button
            onClick={() => setIsCompleteModalOpen(true)}
            className="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface-variant hover:text-on-surface border border-surface-container-highest/20"
            title="View Session Statistics"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">analytics</span>
          </button>
          <button
            onClick={() => {
              setEditingCard(currentCard);
              setIsCreateCardModalOpen(true);
            }}
            className="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface-variant hover:text-on-surface border border-surface-container-highest/20"
            title="Edit Card"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">more_horiz</span>
          </button>
        </div>
      </header>

      {/* Macro Leitner Visualizer Bar */}
      <div className="w-full max-w-3xl mx-auto mb-space-lg flex items-center justify-between gap-2 px-space-md py-2.5 rounded-2xl bg-surface-container-low border border-surface-container-highest/30 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider text-outline font-code font-semibold">
            Deck Leitner Matrix
          </span>
          <span className="text-xs text-on-surface-variant font-code">
            Tier {currentCard.box} Active
          </span>
        </div>
        <div className="flex items-center gap-2 font-code text-xs">
          {([1, 2, 3, 4, 5] as const).map(boxNum => {
            const isActive = currentCard.box === boxNum;
            return (
              <div
                key={boxNum}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
                  isActive
                    ? 'bg-primary-container text-on-primary-container shadow-sm font-bold'
                    : 'bg-surface-container text-outline'
                }`}
              >
                <span>B{boxNum}</span>
                <span className={isActive ? 'font-bold' : boxNum === 1 ? 'text-error' : boxNum === 5 ? 'text-secondary font-semibold' : 'text-on-surface'}>
                  {boxNum === 1 ? 4 : boxNum === 2 ? 14 : boxNum === 3 ? 18 : boxNum === 4 ? 9 : 3}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Primary Stage / Flashcard Canvas (Hero Focus) */}
      <div className="relative w-full max-w-3xl mx-auto">
        <div className="w-full rounded-2xl bg-surface-container-low border border-surface-container-highest/40 shadow-2xl overflow-hidden flex flex-col justify-between transition-all duration-200">
          {/* Card Metadata Strip */}
          <div className="flex items-center justify-between px-space-lg pt-space-lg pb-space-sm bg-surface-container-low border-b border-surface-container-highest/20">
            <div className="flex items-center gap-2">
              <span className="font-code text-xs px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-medium">
                Q.{currentCard.id.replace('q-', '').padStart(3, '0')}
              </span>
              <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-tertiary-container/20 text-tertiary font-semibold font-code">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                {currentCard.difficulty}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {currentCard.tags.map(tag => (
                <span key={tag} className="font-code text-xs text-outline">
                  #{tag}
                </span>
              ))}
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`ml-2 transition-colors ${isBookmarked ? 'text-tertiary' : 'text-outline hover:text-on-surface'}`}
                title="Bookmark card"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isBookmarked ? 'bookmark' : 'bookmark_border'}
                </span>
              </button>
            </div>
          </div>

          {/* Question Block */}
          <div className="px-space-lg py-space-md">
            <div className="text-xs text-outline uppercase tracking-wider mb-2 font-code font-semibold">
              Prompt
            </div>
            <h2 className="text-lg md:text-xl font-semibold text-on-surface tracking-tight leading-snug">
              {currentCard.question}
            </h2>
          </div>

          {/* Diagram Section (e.g. TCP Three-Way Handshake or Custom Graph) */}
          {currentCard.hasDiagram && (
            <div className="px-space-lg py-2">
              <div className="w-full bg-surface-container rounded-xl p-space-md relative overflow-hidden border border-surface-container-highest/30">
                <div className="flex items-center justify-between mb-3 text-xs font-code text-outline uppercase tracking-wide">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    Client (Initiator)
                  </div>
                  <div className="flex items-center gap-2">
                    Server (Listener)
                    <span className="w-2 h-2 rounded-full bg-secondary"></span>
                  </div>
                </div>

                {/* Clean Precision Vector Flow SVG */}
                <svg className="w-full h-24 text-outline" fill="none" viewBox="0 0 680 96">
                  {/* Lifelines */}
                  <line stroke="currentColor" strokeDasharray="3 3" strokeOpacity="0.25" strokeWidth="2" x1="80" x2="80" y1="4" y2="92" />
                  <line stroke="currentColor" strokeDasharray="3 3" strokeOpacity="0.25" strokeWidth="2" x1="600" x2="600" y1="4" y2="92" />
                  
                  {/* Step 1: SYN */}
                  <line className="text-primary" stroke="currentColor" strokeWidth="2" x1="80" x2="590" y1="20" y2="34" />
                  <polygon className="text-primary" fill="currentColor" points="590,30 600,34 590,38" />
                  <text className="text-primary" fill="currentColor" fontFamily="JetBrains Mono" fontSize="11" fontWeight="600" textAnchor="middle" x="340" y="20">
                    1. SYN [Seq = x]
                  </text>

                  {/* Step 2: SYN-ACK */}
                  <line className="text-tertiary" stroke="currentColor" strokeWidth="2" x1="600" x2="90" y1="46" y2="60" />
                  <polygon className="text-tertiary" fill="currentColor" points="90,56 80,60 90,64" />
                  <text className="text-tertiary" fill="currentColor" fontFamily="JetBrains Mono" fontSize="11" fontWeight="600" textAnchor="middle" x="340" y="52">
                    2. SYN-ACK [Seq = y, Ack = x + 1]
                  </text>

                  {/* Step 3: ACK */}
                  <line className="text-secondary" stroke="currentColor" strokeWidth="2" x1="80" x2="590" y1="72" y2="86" />
                  <polygon className="text-secondary" fill="currentColor" points="590,82 600,86 590,90" />
                  <text className="text-secondary" fill="currentColor" fontFamily="JetBrains Mono" fontSize="11" fontWeight="600" textAnchor="middle" x="340" y="80">
                    3. ACK [Seq = x + 1, Ack = y + 1]
                  </text>
                </svg>
              </div>
            </div>
          )}

          {/* Solution & Rationale Section */}
          <div className="px-space-lg py-space-sm">
            {/* Division Line with Pill Badge */}
            <div className="relative flex items-center justify-center my-space-sm">
              <div className="w-full h-px bg-surface-container-highest"></div>
              <button
                onClick={() => setIsRevealed(!isRevealed)}
                className="absolute px-3 py-1 rounded-full bg-surface-container hover:bg-surface-container-high transition-colors text-xs text-on-surface-variant uppercase tracking-wider font-semibold font-code border border-surface-container-highest/40 flex items-center gap-1.5 cursor-pointer"
                type="button"
              >
                <span>Solution & Rationale</span>
                <span className="material-symbols-outlined text-[14px]">
                  {isRevealed ? 'visibility' : 'visibility_off'}
                </span>
              </button>
            </div>

            {isRevealed ? (
              <div className="mt-space-sm space-y-space-sm animate-fadeIn">
                {currentCard.breakdown && currentCard.breakdown.length > 0 ? (
                  currentCard.breakdown.map((item) => (
                    <div
                      key={item.step}
                      className="flex items-start gap-space-sm p-3.5 rounded-xl bg-surface-container border border-surface-container-highest/20"
                    >
                      <span className={`w-6 h-6 rounded-md flex items-center justify-center font-code text-xs font-bold shrink-0 ${
                        item.color === 'primary'
                          ? 'bg-primary-container text-on-primary-container'
                          : item.color === 'tertiary'
                          ? 'bg-tertiary-container/30 text-tertiary'
                          : 'bg-secondary-container/30 text-secondary'
                      }`}>
                        {item.step}
                      </span>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-code text-xs font-semibold text-on-surface">
                            {item.title}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-container-high text-outline font-code">
                            {item.subtitle}
                          </span>
                        </div>
                        <p className="text-xs text-on-surface mt-1 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 rounded-xl bg-surface-container border border-surface-container-highest/20">
                    <p className="text-sm text-on-surface leading-relaxed">{currentCard.answer}</p>
                    {currentCard.notes && (
                      <p className="text-xs text-on-surface-variant mt-2 italic font-code">{currentCard.notes}</p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="py-6 flex flex-col items-center justify-center">
                <button
                  onClick={() => setIsRevealed(true)}
                  className="px-5 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold font-code transition-all border border-surface-container-highest/40 flex items-center gap-2 shadow-xs"
                >
                  <span className="material-symbols-outlined text-[16px]">flip_to_back</span>
                  <span>Press Space or Click to Reveal Answer</span>
                </button>
              </div>
            )}
          </div>

          {/* Leitner Response Controls Panel */}
          <div className="p-space-md bg-surface-container mt-space-sm flex flex-col gap-space-sm border-t border-surface-container-highest/30">
            <div className="flex items-center justify-between px-1 text-xs text-outline font-code">
              <span>Record Recall Grade</span>
              <span>Immediate Leitner Tier Relocation</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-sm">
              {/* 1: Again (Box 1 Reset) */}
              <button
                onClick={() => handleGrade('again')}
                className="group flex flex-col p-3 rounded-xl bg-surface-container-high hover:bg-error/15 active:scale-[0.985] transition-all text-left border border-transparent hover:border-error/30"
                type="button"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-sm font-semibold text-error group-hover:translate-x-0.5 transition-transform">
                    Again
                  </span>
                  <span className="font-code text-xs px-2 py-0.5 rounded bg-surface-container text-outline group-hover:text-error transition-colors">
                    1
                  </span>
                </div>
                <span className="text-xs text-on-surface-variant group-hover:text-error/90 mt-1 font-code">
                  Reset to Box 1 · Review tomorrow
                </span>
              </button>

              {/* 2: Hard (Maintain Box) */}
              <button
                onClick={() => handleGrade('hard')}
                className="group flex flex-col p-3 rounded-xl bg-surface-container-high hover:bg-tertiary/15 active:scale-[0.985] transition-all text-left border border-transparent hover:border-tertiary/30"
                type="button"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-sm font-semibold text-tertiary group-hover:translate-x-0.5 transition-transform">
                    Hard
                  </span>
                  <span className="font-code text-xs px-2 py-0.5 rounded bg-surface-container text-outline group-hover:text-tertiary transition-colors">
                    2
                  </span>
                </div>
                <span className="text-xs text-on-surface-variant group-hover:text-tertiary/90 mt-1 font-code">
                  Keep in Box {currentCard.box} · Review in 1 day
                </span>
              </button>

              {/* 3: Correct (Advance Box) */}
              <button
                onClick={() => handleGrade('correct')}
                className="group flex flex-col p-3 rounded-xl bg-secondary-container/20 hover:bg-secondary/25 active:scale-[0.985] transition-all text-left shadow-xs border border-secondary/20"
                type="button"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-sm font-semibold text-secondary group-hover:translate-x-0.5 transition-transform">
                    Correct
                  </span>
                  <div className="flex items-center gap-1 font-code text-xs px-2 py-0.5 rounded bg-secondary/20 text-secondary font-bold">
                    <span>3</span>
                    <span>/</span>
                    <span>Space</span>
                  </div>
                </div>
                <span className="text-xs text-secondary/90 mt-1 font-medium font-code">
                  Advance to Box {nextTargetBox} · Review in 4 days
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Persistent Hardware Hotkey Dock */}
      <div className="w-full max-w-3xl mx-auto mt-space-md flex flex-wrap items-center justify-between gap-space-sm px-space-md py-2.5 rounded-xl bg-surface-container-low text-outline text-xs border border-surface-container-highest/20 font-code">
        <div className="flex items-center gap-space-md flex-wrap">
          <div className="flex items-center gap-1.5">
            <kbd className="px-2 py-0.5 rounded bg-surface-container text-on-surface text-xs font-medium">Space</kbd>
            <span>Flip / Reveal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-surface-container text-on-surface text-xs font-medium">1</kbd>
            <span>Again</span>
          </div>
          <div className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-surface-container text-on-surface text-xs font-medium">2</kbd>
            <span>Hard</span>
          </div>
          <div className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-surface-container text-on-surface text-xs font-medium">3</kbd>
            <span>Correct</span>
          </div>
        </div>
        <div className="flex items-center gap-space-md">
          <div 
            onClick={() => {
              setEditingCard(currentCard);
              setIsCreateCardModalOpen(true);
            }}
            className="flex items-center gap-1.5 hover:text-on-surface cursor-pointer transition-colors"
          >
            <kbd className="px-1.5 py-0.5 rounded bg-surface-container text-on-surface text-xs font-medium">E</kbd>
            <span>Edit</span>
          </div>
          <div 
            onClick={undoLastReview}
            className="flex items-center gap-1.5 hover:text-on-surface cursor-pointer transition-colors"
          >
            <kbd className="px-1.5 py-0.5 rounded bg-surface-container text-on-surface text-xs font-medium">Z</kbd>
            <span>Undo</span>
          </div>
        </div>
      </div>

      {/* Completed Session Modal Dialog Overlay */}
      {isCompleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-dim/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-xl bg-surface-container-low rounded-2xl shadow-2xl p-space-lg flex flex-col gap-space-lg relative overflow-hidden border border-surface-container-highest/30">
            {/* Ambient Top Glow Accent */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-32 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>

            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🎉</span>
                  <span className="text-xl font-bold text-on-surface">Session Complete!</span>
                </div>
                <span className="text-xs text-on-surface-variant mt-1">
                  {currentCard.courseName} · Standard Spaced Routine
                </span>
              </div>
              <button
                onClick={() => setIsCompleteModalOpen(false)}
                className="p-1 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Performance Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-space-sm">
              <div className="p-3.5 rounded-xl bg-surface-container flex flex-col">
                <span className="text-xs text-outline font-code">Cards Cleared</span>
                <span className="text-xl font-bold text-on-surface mt-1 font-display">48</span>
                <span className="text-[11px] text-outline mt-0.5">100% of daily quota</span>
              </div>
              <div className="p-3.5 rounded-xl bg-surface-container flex flex-col">
                <span className="text-xs text-outline font-code">Session Duration</span>
                <span className="text-xl font-bold text-on-surface mt-1 font-display">
                  {formatTime(sessionSeconds)}
                </span>
                <span className="text-[11px] text-outline mt-0.5">Avg 20.8s / card</span>
              </div>
              <div className="p-3.5 rounded-xl bg-surface-container flex flex-col col-span-2 md:col-span-1">
                <span className="text-xs text-outline font-code">Recall Accuracy</span>
                <span className="text-xl font-bold text-secondary mt-1 font-display">89.6%</span>
                <span className="text-[11px] text-secondary font-medium mt-0.5">Above Target (+4.2%)</span>
              </div>
            </div>

            {/* Response Distribution Bar */}
            <div className="flex flex-col gap-2 p-4 rounded-xl bg-surface-container">
              <div className="flex items-center justify-between text-xs font-code">
                <span className="font-medium text-on-surface">Response Distribution</span>
                <div className="flex items-center gap-3">
                  <span className="text-secondary font-semibold">{reviewStats.correct} Correct</span>
                  <span className="text-tertiary font-semibold">{reviewStats.hard} Hard</span>
                  <span className="text-error font-semibold">{reviewStats.again} Again</span>
                </div>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden flex bg-surface-container-high">
                <div className="bg-secondary h-full" style={{ width: '89.6%' }}></div>
                <div className="bg-tertiary h-full" style={{ width: '6.25%' }}></div>
                <div className="bg-error h-full" style={{ width: '4.15%' }}></div>
              </div>
            </div>

            {/* Leitner Tier Flow Visualization */}
            <div className="flex flex-col gap-space-xs">
              <span className="text-xs uppercase tracking-wider text-outline font-code font-semibold">
                Leitner Movement Dynamics
              </span>
              <div className="grid grid-cols-3 gap-2">
                <div className="p-3 rounded-xl bg-surface-container flex items-center gap-3">
                  <span className="material-symbols-outlined text-secondary text-[22px]">north_east</span>
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-on-surface font-display">38</span>
                    <span className="text-[11px] text-on-surface-variant font-code">Promoted Tier</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-surface-container flex items-center gap-3">
                  <span className="material-symbols-outlined text-tertiary text-[22px]">east</span>
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-on-surface font-display">8</span>
                    <span className="text-[11px] text-on-surface-variant font-code">Retained Tier</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-surface-container flex items-center gap-3">
                  <span className="material-symbols-outlined text-error text-[22px]">south_east</span>
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-on-surface font-display">2</span>
                    <span className="text-[11px] text-on-surface-variant font-code">Reset to Box 1</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setIsCompleteModalOpen(false);
                  setCurrentIndex(0);
                }}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs transition-colors font-medium"
                type="button"
              >
                Review 5 Difficult Cards
              </button>
              <button
                onClick={() => {
                  setIsCompleteModalOpen(false);
                  setCurrentView('overview');
                }}
                className="w-full sm:w-auto px-5 py-2 rounded-lg bg-primary-container hover:opacity-95 text-on-primary-container text-xs font-semibold transition-transform active:scale-[0.985] shadow-md"
                type="button"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
