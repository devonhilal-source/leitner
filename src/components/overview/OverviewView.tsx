import React from 'react';
import { useLeitner } from '../../context/LeitnerContext';

export const OverviewView: React.FC = () => {
  const { setCurrentView, startStudySession, stats, courses } = useLeitner();

  return (
    <div className="flex flex-col w-full pb-space-xl">
      {/* Top Welcome & Session Launch Stage */}
      <section className="relative w-full rounded-2xl bg-surface-container-low p-space-lg shadow-sm overflow-hidden mb-space-lg border border-surface-container-highest/30">
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-primary/10 blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-space-lg">
          <div className="flex flex-col gap-1 max-w-2xl">
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container text-xs text-secondary font-medium border border-secondary/20">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                Session Active · Morning Cycle
              </span>
              <span className="font-code text-outline text-xs">•</span>
              <span className="text-xs text-on-surface-variant font-code">Scheduled Sync: 09:15 UTC</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-semibold text-on-surface tracking-tight">Good morning, Elena.</h1>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              You have <span className="text-on-surface font-semibold">{stats.dueToday} cards</span> scheduled across{' '}
              <span className="text-on-surface font-semibold">3 courses</span> today. All decay parameters are within nominal thresholds.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => startStudySession()}
              className="group flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-container hover:bg-primary-container/90 text-on-primary-container font-semibold text-sm transition-all shadow-md active:scale-[0.985]"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">play_arrow</span>
              <span>Start Daily Study</span>
              <span className="font-code text-xs px-2 py-0.5 rounded bg-surface-container-lowest/30 text-on-primary-container ml-1">
                {stats.dueToday} due
              </span>
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => startStudySession('cs-304')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-medium transition-colors border border-surface-container-highest/40"
                type="button"
              >
                <span className="material-symbols-outlined text-outline text-[16px]">bolt</span>
                <span>Quick Review</span>
                <span className="font-code text-on-surface-variant">10</span>
              </button>
              <span className="text-xs text-on-surface-variant px-2 py-1.5 rounded-xl bg-surface-container-lowest/60 flex items-center gap-1 font-code">
                <span className="material-symbols-outlined text-[14px] text-outline">schedule</span>
                <span>~18m</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Primary KPI Micro-Tiles */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md mb-space-lg">
        {/* KPI 1: Cards Due Today */}
        <div className="flex flex-col justify-between p-space-md rounded-xl bg-surface-container-low border border-surface-container-highest/30 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">Cards Due Today</span>
            <span className="material-symbols-outlined text-outline text-[18px]">calendar_today</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-semibold text-on-surface tracking-tight font-display">{stats.dueToday}</span>
            <span className="text-xs text-secondary bg-secondary/10 px-2 py-0.5 rounded-full font-code font-medium">+12 vs yester</span>
          </div>
          <div className="w-full bg-surface-container-highest h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: '62%' }}></div>
          </div>
        </div>

        {/* KPI 2: Overdue Cards */}
        <div className="flex flex-col justify-between p-space-md rounded-xl bg-surface-container-low border border-surface-container-highest/30 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">Overdue Cards</span>
            <span className="material-symbols-outlined text-error text-[18px]">priority_high</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-semibold text-error tracking-tight font-display">{stats.overdueCount}</span>
            <span className="text-xs text-error bg-error-container/40 px-2 py-0.5 rounded-full font-medium">Urgent Recall</span>
          </div>
          <p className="text-xs text-on-surface-variant mt-3 truncate font-code">Box 1 degradation in 3h 40m</p>
        </div>

        {/* KPI 3: Reviewed Today */}
        <div className="flex flex-col justify-between p-space-md rounded-xl bg-surface-container-low border border-surface-container-highest/30 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">Reviewed Today</span>
            <span className="material-symbols-outlined text-tertiary text-[18px]">done_all</span>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-semibold text-on-surface tracking-tight font-display">{stats.reviewedTodayCount}</span>
              <span className="text-sm text-on-surface-variant font-code">/ {stats.dailyTarget}</span>
            </div>
            <span className="text-xs text-tertiary font-code font-semibold">40.0%</span>
          </div>
          <div className="w-full bg-surface-container-highest h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-tertiary h-full rounded-full transition-all duration-500" style={{ width: '40%' }}></div>
          </div>
        </div>

        {/* KPI 4: Retention Rate */}
        <div className="flex flex-col justify-between p-space-md rounded-xl bg-surface-container-low border border-surface-container-highest/30 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">Retention Rate</span>
            <span className="material-symbols-outlined text-secondary text-[18px]">monitoring</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-semibold text-secondary tracking-tight font-display">{stats.retentionRate}%</span>
            <span className="text-xs text-secondary bg-secondary/10 px-2 py-0.5 rounded-full font-medium">Optimal</span>
          </div>
          <p className="text-xs text-on-surface-variant mt-3 truncate font-code">Spacing stability factor: 2.45</p>
        </div>
      </section>

      {/* Leitner 5-Box Structural Distribution */}
      <section className="w-full rounded-2xl bg-surface-container-low p-space-lg shadow-sm mb-space-lg border border-surface-container-highest/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-space-md gap-2">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
            <h2 className="text-base font-semibold text-on-surface tracking-tight">Leitner Spatial Distribution</h2>
            <span className="text-xs font-code text-on-surface-variant px-2 py-0.5 rounded bg-surface-container">
              Total: {stats.totalCards} Active Cards
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            <span>Tier 5 Mastery Goal: 60% (Current: 46.0%)</span>
          </div>
        </div>

        {/* 5-Box Segmented Board */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {/* Box 1 */}
          <div 
            onClick={() => setCurrentView('library')}
            className="group relative flex flex-col justify-between p-3.5 rounded-xl bg-surface-container hover:bg-surface-container-high transition-all cursor-pointer border border-transparent hover:border-error/30"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-error font-code">BOX 01</span>
              <span className="text-xs font-code text-on-surface-variant">1d int.</span>
            </div>
            <div className="my-3">
              <div className="text-2xl font-bold text-on-surface font-display">{stats.boxCounts[1]}</div>
              <div className="text-xs text-on-surface-variant">Daily Review</div>
            </div>
            <div className="flex items-center justify-between pt-1">
              <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden mr-2">
                <div className="bg-error h-full rounded-full" style={{ width: '5.1%' }}></div>
              </div>
              <span className="text-[11px] text-outline font-code">5.1%</span>
            </div>
          </div>

          {/* Box 2 */}
          <div 
            onClick={() => setCurrentView('library')}
            className="group relative flex flex-col justify-between p-3.5 rounded-xl bg-surface-container hover:bg-surface-container-high transition-all cursor-pointer border border-transparent hover:border-tertiary/30"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-tertiary font-code">BOX 02</span>
              <span className="text-xs font-code text-on-surface-variant">2d int.</span>
            </div>
            <div className="my-3">
              <div className="text-2xl font-bold text-on-surface font-display">{stats.boxCounts[2]}</div>
              <div className="text-xs text-on-surface-variant">Every 2-3 Days</div>
            </div>
            <div className="flex items-center justify-between pt-1">
              <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden mr-2">
                <div className="bg-tertiary h-full rounded-full" style={{ width: '8.6%' }}></div>
              </div>
              <span className="text-[11px] text-outline font-code">8.6%</span>
            </div>
          </div>

          {/* Box 3 */}
          <div 
            onClick={() => setCurrentView('library')}
            className="group relative flex flex-col justify-between p-3.5 rounded-xl bg-surface-container hover:bg-surface-container-high transition-all cursor-pointer border border-transparent hover:border-primary/30"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-primary font-code">BOX 03</span>
              <span className="text-xs font-code text-on-surface-variant">4d int.</span>
            </div>
            <div className="my-3">
              <div className="text-2xl font-bold text-on-surface font-display">{stats.boxCounts[3]}</div>
              <div className="text-xs text-on-surface-variant">Weekly Consolidation</div>
            </div>
            <div className="flex items-center justify-between pt-1">
              <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden mr-2">
                <div className="bg-primary h-full rounded-full" style={{ width: '15.1%' }}></div>
              </div>
              <span className="text-[11px] text-outline font-code">15.1%</span>
            </div>
          </div>

          {/* Box 4 */}
          <div 
            onClick={() => setCurrentView('library')}
            className="group relative flex flex-col justify-between p-3.5 rounded-xl bg-surface-container hover:bg-surface-container-high transition-all cursor-pointer border border-transparent hover:border-primary/30"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-primary font-code">BOX 04</span>
              <span className="text-xs font-code text-on-surface-variant">7d int.</span>
            </div>
            <div className="my-3">
              <div className="text-2xl font-bold text-on-surface font-display">{stats.boxCounts[4]}</div>
              <div className="text-xs text-on-surface-variant">Bi-Weekly Retain</div>
            </div>
            <div className="flex items-center justify-between pt-1">
              <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden mr-2">
                <div className="bg-primary h-full rounded-full" style={{ width: '25.0%' }}></div>
              </div>
              <span className="text-[11px] text-outline font-code">25.0%</span>
            </div>
          </div>

          {/* Box 5 (Mastered) */}
          <div 
            onClick={() => setCurrentView('library')}
            className="group relative flex flex-col justify-between p-3.5 rounded-xl bg-surface-container hover:bg-surface-container-high transition-all cursor-pointer border border-transparent hover:border-secondary/30 ring-1 ring-secondary/20"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-secondary font-code">BOX 05 (MASTERED)</span>
              <span className="text-xs font-code text-secondary font-medium">14d int.</span>
            </div>
            <div className="my-3">
              <div className="text-2xl font-bold text-secondary font-display">{stats.boxCounts[5]}</div>
              <div className="text-xs text-on-surface-variant">Long-Term Storage</div>
            </div>
            <div className="flex items-center justify-between pt-1">
              <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden mr-2">
                <div className="bg-secondary h-full rounded-full" style={{ width: '46.0%' }}></div>
              </div>
              <span className="text-[11px] text-secondary font-code font-semibold">46.0%</span>
            </div>
          </div>
        </div>
      </section>

      {/* Two-Column Layout (Course Priority Queue 60% / Activity Heatmap 40%) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
        {/* Left Column: Course Priority Queues (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-space-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-outline text-[18px]">queue</span>
              <h2 className="text-base font-medium text-on-surface">Course Priority & Due Queues</h2>
            </div>
            <span className="text-xs text-on-surface-variant font-code">Sorted by Spacing Urgency</span>
          </div>

          {/* Course 1: Data Comm */}
          <div className="p-space-md rounded-2xl bg-surface-container-low hover:bg-surface-container transition-all flex flex-col gap-3 border border-surface-container-highest/20 shadow-xs">
            <div className="flex items-start justify-between gap-space-sm">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-error"></span>
                  <h3 className="text-sm font-semibold text-on-surface">Data Communication & Networks</h3>
                </div>
                <p className="text-xs text-on-surface-variant">
                  Next concept: <span className="text-on-surface font-medium">TCP Congestion Control (Reno vs Cubic)</span>
                </p>
              </div>
              <button
                onClick={() => startStudySession('cs-304')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-container text-on-primary-container text-xs font-semibold hover:opacity-95 transition-all shadow-xs active:scale-95"
                type="button"
              >
                <span>Study Course</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-surface-container-highest/30">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-error font-medium font-code">22 due now</span>
                <span className="text-outline">•</span>
                <span className="text-on-surface-variant">184 cards enrolled</span>
                <span className="text-outline">•</span>
                <span className="text-secondary font-code">84% mastered</span>
              </div>
              <div className="w-28 bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                <div className="bg-secondary h-full rounded-full" style={{ width: '84%' }}></div>
              </div>
            </div>
          </div>

          {/* Course 2: Web Dev */}
          <div className="p-space-md rounded-2xl bg-surface-container-low hover:bg-surface-container transition-all flex flex-col gap-3 border border-surface-container-highest/20 shadow-xs">
            <div className="flex items-start justify-between gap-space-sm">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                  <h3 className="text-sm font-semibold text-on-surface">Web Development 1</h3>
                </div>
                <p className="text-xs text-on-surface-variant">
                  Next concept: <span className="text-on-surface font-medium">CSS Grid fractional tracks & flex-basis clamp</span>
                </p>
              </div>
              <button
                onClick={() => startStudySession('cs-210')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-medium transition-colors border border-surface-container-highest/40"
                type="button"
              >
                <span>Study Course</span>
                <span className="material-symbols-outlined text-[14px] text-outline">arrow_forward</span>
              </button>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-surface-container-highest/30">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-tertiary font-medium font-code">16 due now</span>
                <span className="text-outline">•</span>
                <span className="text-on-surface-variant">142 cards enrolled</span>
                <span className="text-outline">•</span>
                <span className="text-secondary font-code">92% mastered</span>
              </div>
              <div className="w-28 bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                <div className="bg-secondary h-full rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
          </div>

          {/* Course 3: Information Systems */}
          <div className="p-space-md rounded-2xl bg-surface-container-low hover:bg-surface-container transition-all flex flex-col gap-3 border border-surface-container-highest/20 shadow-xs">
            <div className="flex items-start justify-between gap-space-sm">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  <h3 className="text-sm font-semibold text-on-surface">Information Systems</h3>
                </div>
                <p className="text-xs text-on-surface-variant">
                  Next concept: <span className="text-on-surface font-medium">3NF Relational Decomposition rules</span>
                </p>
              </div>
              <button
                onClick={() => startStudySession('is-201')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-medium transition-colors border border-surface-container-highest/40"
                type="button"
              >
                <span>Study Course</span>
                <span className="material-symbols-outlined text-[14px] text-outline">arrow_forward</span>
              </button>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-surface-container-highest/30">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-primary font-medium font-code">10 due now</span>
                <span className="text-outline">•</span>
                <span className="text-on-surface-variant">98 cards enrolled</span>
                <span className="text-outline">•</span>
                <span className="text-secondary font-code">78% mastered</span>
              </div>
              <div className="w-28 bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                <div className="bg-secondary h-full rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
          </div>

          {/* Course 4: Business Finance (Caught up) */}
          <div className="p-space-md rounded-2xl bg-surface-container-low/70 flex flex-col gap-3 opacity-80 hover:opacity-100 transition-opacity border border-surface-container-highest/20">
            <div className="flex items-start justify-between gap-space-sm">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-secondary"></span>
                  <h3 className="text-sm font-semibold text-on-surface">Intro to Business Finance</h3>
                </div>
                <p className="text-xs text-secondary flex items-center gap-1 font-medium">
                  <span className="material-symbols-outlined text-[14px]">check_circle</span>
                  <span>All caught up · Next review scheduled tomorrow at 09:00 AM</span>
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-lg bg-surface-container text-on-surface-variant font-code">
                0 Due
              </span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-surface-container-highest/30 text-xs text-on-surface-variant">
              <span>315 cards enrolled</span>
              <span className="font-code text-secondary font-medium">96% mastered</span>
            </div>
          </div>
        </div>

        {/* Right Column: Weekly Activity & Recent Sessions (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-space-lg">
          {/* Weekly Study Activity Card */}
          <div className="p-space-md rounded-2xl bg-surface-container-low flex flex-col justify-between border border-surface-container-highest/30 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-outline text-[18px]">bar_chart</span>
                <h3 className="text-sm font-medium text-on-surface">Weekly Study Activity</h3>
              </div>
              <span className="text-xs text-secondary font-code font-bold">273 total</span>
            </div>

            {/* Inline SVG Bar Chart */}
            <div className="w-full flex flex-col gap-1">
              <svg className="w-full h-32 overflow-visible" viewBox="0 0 320 120">
                {/* Target Guideline (80 cards) */}
                <line
                  className="text-surface-container-highest"
                  stroke="currentColor"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                  x1="10"
                  x2="310"
                  y1="28"
                  y2="28"
                />
                <text className="font-code fill-[#908fa0] text-[9px]" x="312" y="31">
                  Target 80
                </text>
                
                {/* Mon: 45 */}
                <rect className="fill-surface-container-high hover:fill-primary-container transition-colors cursor-pointer" height="42" rx="4" width="24" x="20" y="58" />
                <text className="font-code fill-[#908fa0] text-[10px]" textAnchor="middle" x="32" y="114">M</text>
                <text className="font-code fill-[#c7c4d7] text-[10px]" textAnchor="middle" x="32" y="52">45</text>

                {/* Tue: 62 */}
                <rect className="fill-surface-container-high hover:fill-primary-container transition-colors cursor-pointer" height="58" rx="4" width="24" x="62" y="42" />
                <text className="font-code fill-[#908fa0] text-[10px]" textAnchor="middle" x="74" y="114">T</text>
                <text className="font-code fill-[#c7c4d7] text-[10px]" textAnchor="middle" x="74" y="36">62</text>

                {/* Wed: 50 */}
                <rect className="fill-surface-container-high hover:fill-primary-container transition-colors cursor-pointer" height="47" rx="4" width="24" x="104" y="53" />
                <text className="font-code fill-[#908fa0] text-[10px]" textAnchor="middle" x="116" y="114">W</text>
                <text className="font-code fill-[#c7c4d7] text-[10px]" textAnchor="middle" x="116" y="47">50</text>

                {/* Thu: 84 */}
                <rect className="fill-[#8083ff] transition-colors cursor-pointer" height="78" rx="4" width="24" x="146" y="22" />
                <text className="font-code fill-[#908fa0] text-[10px]" textAnchor="middle" x="158" y="114">T</text>
                <text className="font-code fill-[#c0c1ff] text-[10px] font-semibold" textAnchor="middle" x="158" y="16">84</text>

                {/* Fri (Today): 32 */}
                <rect className="fill-[#4edea3] transition-colors cursor-pointer" height="30" rx="4" width="24" x="188" y="70" />
                <circle className="fill-[#4edea3] animate-ping" cx="200" cy="64" r="2.5" />
                <text className="font-code fill-[#4edea3] text-[10px] font-semibold" textAnchor="middle" x="200" y="114">F</text>
                <text className="font-code fill-[#4edea3] text-[10px]" textAnchor="middle" x="200" y="62">32</text>

                {/* Sat: Plan */}
                <rect className="fill-[#333539]" height="4" rx="2" width="24" x="230" y="96" />
                <text className="font-code fill-[#908fa0] text-[10px]" textAnchor="middle" x="242" y="114">S</text>

                {/* Sun: Plan */}
                <rect className="fill-[#333539]" height="4" rx="2" width="24" x="272" y="96" />
                <text className="font-code fill-[#908fa0] text-[10px]" textAnchor="middle" x="284" y="114">S</text>
              </svg>
              <div className="flex items-center justify-between pt-1 text-xs text-on-surface-variant font-code">
                <span>Weekly Target: 560 cards</span>
                <span className="text-on-surface font-semibold">48.7% accomplished</span>
              </div>
            </div>
          </div>

          {/* Recent Sessions Feed */}
          <div className="p-space-md rounded-2xl bg-surface-container-low flex flex-col gap-2.5 border border-surface-container-highest/30 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-outline text-[18px]">history</span>
                <h3 className="text-sm font-medium text-on-surface">Recent Sessions</h3>
              </div>
              <button
                onClick={() => setCurrentView('progress')}
                className="text-xs text-primary hover:underline font-code"
                type="button"
              >
                View Log
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {/* Session 1 */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-secondary text-sm">code</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-medium text-on-surface truncate">Web Development 1</span>
                    <span className="text-[11px] text-on-surface-variant font-code">25 cards · 2h ago</span>
                  </div>
                </div>
                <span className="text-xs text-secondary bg-secondary/10 px-2 py-0.5 rounded-full font-code font-bold">
                  92%
                </span>
              </div>

              {/* Session 2 */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary text-sm">hub</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-medium text-on-surface truncate">Networks & Protocols</span>
                    <span className="text-[11px] text-on-surface-variant font-code">40 cards · Yesterday</span>
                  </div>
                </div>
                <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full font-code font-bold">
                  85%
                </span>
              </div>

              {/* Session 3 */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-tertiary text-sm">account_balance</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-medium text-on-surface truncate">Intro to Business Finance</span>
                    <span className="text-[11px] text-on-surface-variant font-code">30 cards · 2 days ago</span>
                  </div>
                </div>
                <span className="text-xs text-secondary bg-secondary/10 px-2 py-0.5 rounded-full font-code font-bold">
                  97%
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Keyboard Command Footnote */}
      <footer className="mt-space-lg flex flex-wrap items-center justify-between gap-space-sm px-space-md py-space-sm rounded-xl bg-surface-container-low text-on-surface-variant border border-surface-container-highest/20 text-xs">
        <div className="flex items-center gap-space-sm flex-wrap">
          <span className="material-symbols-outlined text-outline text-[16px]">keyboard</span>
          <span>Daily workflow binds:</span>
          <kbd className="px-1.5 py-0.5 rounded bg-surface-container font-code text-on-surface text-[11px]">Space</kbd>
          <span>Study All</span>
          <kbd className="px-1.5 py-0.5 rounded bg-surface-container font-code text-on-surface text-[11px]">1 - 4</kbd>
          <span>Quick Course Launch</span>
        </div>
        <div className="text-outline font-code text-[11px]">
          Leitner OS Precision Engine · Zero algorithmic noise
        </div>
      </footer>
    </div>
  );
};
