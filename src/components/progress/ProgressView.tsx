import React, { useState } from 'react';
import { useLeitner } from '../../context/LeitnerContext';

export const ProgressView: React.FC = () => {
  const { studyLogs, startStudySession, stats } = useLeitner();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('7d');

  const handleExportReport = () => {
    const csvContent = `Timestamp,Course Module,Cards Reviewed,Fidelity Accuracy,Session Duration\n` +
      studyLogs.map(l => `"${l.timestamp}","${l.courseModule}",${l.cardsReviewed},"${l.fidelityPercent}%","${l.sessionDuration}"`).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leitner_retention_report_${timeRange}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col w-full pb-space-xl">
      {/* Top Control Bar & Breadcrumb Sync */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md pt-2 pb-space-lg">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-on-surface-variant text-xs tracking-wider uppercase font-code">
            <span>Academic Workspace</span>
            <span className="material-symbols-outlined text-outline text-[14px]">chevron_right</span>
            <span className="text-primary font-medium">Learning Analytics & Retention</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-semibold text-on-surface tracking-tight font-display">
            Learning Analytics & Retention Engine
          </h1>
          <p className="text-xs text-on-surface-variant max-w-xl leading-relaxed">
            Precision memory modeling calibrated to optimal Ebbinghaus decay decay vectors and Leitner progression thresholds.
          </p>
        </div>

        {/* Controls Cluster */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Time Range Segmented Control */}
          <div className="flex items-center p-0.5 rounded-xl bg-surface-container border border-surface-container-highest/30">
            {(['7d', '30d', '90d', 'all'] as const).map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-lg text-xs font-code transition-all ${
                  timeRange === range
                    ? 'text-on-primary bg-primary-container shadow-xs font-semibold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
                type="button"
              >
                {range === '7d' ? 'Last 7 Days' : range === '30d' ? 'Last 30 Days' : range === '90d' ? 'Current Semester (90d)' : 'All Time'}
              </button>
            ))}
          </div>

          {/* Export Action */}
          <button
            onClick={handleExportReport}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-medium transition-all shadow-xs active:scale-[0.985] border border-surface-container-highest/30"
            type="button"
          >
            <span className="material-symbols-outlined text-outline text-[16px]">ios_share</span>
            <span>Export Report (.PDF / .CSV)</span>
          </button>
        </div>
      </div>

      {/* KPI Monolithic Matrix (Top 4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md mb-space-xl">
        {/* Metric 1: Retention Stability */}
        <div className="flex flex-col justify-between p-space-md rounded-2xl bg-surface-container border border-surface-container-highest/30 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider font-code">
              Retention Stability
            </span>
            <div className="flex items-center gap-0.5 text-secondary font-code text-xs px-1.5 py-0.5 rounded bg-surface-container-low border border-secondary/20">
              <span className="material-symbols-outlined text-[13px]">trending_up</span>
              <span>+2.3%</span>
            </div>
          </div>
          <div className="my-2.5 flex items-baseline gap-2">
            <span className="text-3xl font-semibold text-on-surface font-display">{stats.retentionRate}%</span>
            <span className="text-xs text-outline font-code">σ = 0.04</span>
          </div>
          <div className="flex items-center gap-1.5 text-on-surface-variant text-[11px] pt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            <span className="truncate">Measured across 2,410 total reviews</span>
          </div>
        </div>

        {/* Metric 2: Total Reviews Logged */}
        <div className="flex flex-col justify-between p-space-md rounded-2xl bg-surface-container border border-surface-container-highest/30 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider font-code">
              Total Reviews Logged
            </span>
            <span className="font-code text-[11px] px-1.5 py-0.5 rounded bg-surface-container-low text-primary border border-primary/20">
              7d window
            </span>
          </div>
          <div className="my-2.5 flex items-baseline gap-2">
            <span className="text-3xl font-semibold text-on-surface font-display">1,842</span>
            <span className="text-xs text-outline font-code">cards</span>
          </div>
          <div className="flex items-center justify-between text-on-surface-variant text-[11px] pt-1 font-code">
            <span>Daily Avg: 46 cards</span>
            <span className="text-tertiary font-bold">Streak: 14d</span>
          </div>
        </div>

        {/* Metric 3: Box 5 Mastery Yield */}
        <div className="flex flex-col justify-between p-space-md rounded-2xl bg-surface-container border border-surface-container-highest/30 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider font-code">
              Box 5 Mastery Yield
            </span>
            <span className="font-code text-[11px] px-1.5 py-0.5 rounded bg-surface-container-low text-secondary border border-secondary/20">
              Optimal Tier
            </span>
          </div>
          <div className="my-2.5 flex items-baseline gap-2">
            <span className="text-3xl font-semibold text-on-surface font-display">46.0%</span>
            <span className="text-xs text-outline font-code">340 / 739</span>
          </div>
          <div className="w-full bg-surface-container-low h-1 rounded-full overflow-hidden">
            <div className="bg-secondary h-full rounded-full" style={{ width: '46%' }}></div>
          </div>
          <span className="text-on-surface-variant text-[11px] pt-1 truncate font-code">
            Permanently consolidated in 14-day loop
          </span>
        </div>

        {/* Metric 4: Memory Decay Velocity */}
        <div className="flex flex-col justify-between p-space-md rounded-2xl bg-surface-container border border-surface-container-highest/30 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider font-code">
              Memory Decay Velocity
            </span>
            <span className="material-symbols-outlined text-outline text-[16px]">show_chart</span>
          </div>
          <div className="my-2.5 flex items-baseline gap-2">
            <span className="text-3xl font-semibold text-on-surface font-display">0.12</span>
            <span className="text-xs text-primary font-code">d⁻¹</span>
          </div>
          <div className="flex items-center gap-1.5 text-on-surface-variant text-[11px] pt-1 font-code">
            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
            <span className="truncate">Zero algorithmic collapse detected</span>
          </div>
        </div>
      </div>

      {/* Primary Asymmetric Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg mb-space-xl">
        {/* Left Major Column (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-space-lg">
          {/* Module 1: Leitner Spatial Distribution & Velocity */}
          <div className="flex flex-col p-space-lg rounded-2xl bg-surface-container border border-surface-container-highest/30 shadow-xs">
            <div className="flex items-center justify-between mb-space-md">
              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-wider text-outline font-code">
                  State Transition Matrix
                </span>
                <h2 className="text-base font-semibold text-on-surface">
                  Leitner Spatial Distribution & Velocity
                </h2>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-on-surface-variant bg-surface-container-low px-2.5 py-1 rounded-lg border border-surface-container-highest/20 font-code">
                <span className="material-symbols-outlined text-[14px] text-secondary">sync_alt</span>
                <span>739 Total Active Trackers</span>
              </div>
            </div>

            {/* Tier Flow Graphic */}
            <div className="grid grid-cols-5 gap-2 p-2.5 rounded-xl bg-surface-container-low mb-space-md border border-surface-container-highest/20">
              {/* Box 1 */}
              <div className="flex flex-col items-center text-center p-2 rounded-lg bg-surface-container">
                <span className="text-[11px] text-outline font-code">BOX 1</span>
                <span className="text-lg font-bold text-on-surface mt-1 font-display">112</span>
                <span className="text-[10px] text-on-surface-variant">Daily</span>
                <div className="w-full bg-error/20 h-1 rounded-full mt-2 overflow-hidden">
                  <div className="bg-error h-full rounded-full" style={{ width: '15%' }}></div>
                </div>
              </div>

              {/* Box 2 */}
              <div className="flex flex-col items-center text-center p-2 rounded-lg bg-surface-container">
                <span className="text-[11px] text-outline font-code">BOX 2</span>
                <span className="text-lg font-bold text-on-surface mt-1 font-display">146</span>
                <span className="text-[10px] text-on-surface-variant">3 Days</span>
                <div className="w-full bg-tertiary/20 h-1 rounded-full mt-2 overflow-hidden">
                  <div className="bg-tertiary h-full rounded-full" style={{ width: '20%' }}></div>
                </div>
              </div>

              {/* Box 3 */}
              <div className="flex flex-col items-center text-center p-2 rounded-lg bg-surface-container">
                <span className="text-[11px] text-outline font-code">BOX 3</span>
                <span className="text-lg font-bold text-on-surface mt-1 font-display">98</span>
                <span className="text-[10px] text-on-surface-variant">5 Days</span>
                <div className="w-full bg-primary/20 h-1 rounded-full mt-2 overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: '13%' }}></div>
                </div>
              </div>

              {/* Box 4 */}
              <div className="flex flex-col items-center text-center p-2 rounded-lg bg-surface-container">
                <span className="text-[11px] text-outline font-code">BOX 4</span>
                <span className="text-lg font-bold text-on-surface mt-1 font-display">43</span>
                <span className="text-[10px] text-on-surface-variant">9 Days</span>
                <div className="w-full bg-primary-container/20 h-1 rounded-full mt-2 overflow-hidden">
                  <div className="bg-primary-container h-full rounded-full" style={{ width: '6%' }}></div>
                </div>
              </div>

              {/* Box 5 */}
              <div className="flex flex-col items-center text-center p-2 rounded-lg bg-surface-container shadow-xs ring-1 ring-secondary/30">
                <span className="text-[11px] text-secondary font-code font-bold">BOX 5</span>
                <span className="text-lg font-bold text-secondary mt-1 font-display">340</span>
                <span className="text-[10px] text-on-surface-variant font-code">14 Days</span>
                <div className="w-full bg-secondary/20 h-1 rounded-full mt-2 overflow-hidden">
                  <div className="bg-secondary h-full rounded-full" style={{ width: '46%' }}></div>
                </div>
              </div>
            </div>

            {/* Dynamic Transition Vectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm pt-1">
              <div className="flex items-center justify-between p-space-sm rounded-xl bg-surface-container-low border border-surface-container-highest/20">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[16px]">arrow_forward</span>
                  <span className="text-xs text-on-surface">Box 1 → 2 Advance Rate</span>
                </div>
                <span className="font-code text-xs text-secondary font-bold">88.4%</span>
              </div>
              <div className="flex items-center justify-between p-space-sm rounded-xl bg-surface-container-low border border-surface-container-highest/20">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-error text-[16px]">replay</span>
                  <span className="text-xs text-on-surface">Tier Relapse back to Box 1</span>
                </div>
                <span className="font-code text-xs text-error font-bold">11.6%</span>
              </div>
            </div>
          </div>

          {/* Module 2: Weekly Review Activity */}
          <div className="flex flex-col p-space-lg rounded-2xl bg-surface-container border border-surface-container-highest/30 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs mb-space-md">
              <div>
                <span className="text-xs uppercase tracking-wider text-outline font-code">
                  Daily Throughput & Fidelity
                </span>
                <h2 className="text-base font-semibold text-on-surface">Weekly Review Activity</h2>
              </div>
              {/* Legend */}
              <div className="flex items-center gap-3 text-xs text-on-surface-variant font-code">
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-xs bg-secondary"></span>
                  <span>Good/Easy</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-xs bg-tertiary"></span>
                  <span>Hard</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-xs bg-error"></span>
                  <span>Again</span>
                </div>
              </div>
            </div>

            {/* Inline SVG Multi-Bar Visualization */}
            <div className="w-full h-56 relative bg-surface-container-low rounded-xl p-space-sm flex flex-col justify-end border border-surface-container-highest/20">
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 700 200">
                {/* Target Guideline (80 cards) */}
                <line
                  className="text-outline-variant"
                  stroke="currentColor"
                  strokeDasharray="4 4"
                  strokeWidth="1.5"
                  x1="40"
                  x2="680"
                  y1="60"
                  y2="60"
                />
                <text className="font-code fill-[#908fa0] text-[11px]" x="42" y="52">
                  Target Quota: 80 cards/day
                </text>
                <text className="font-code fill-[#908fa0] text-[10px]" x="10" y="64">80</text>
                <text className="font-code fill-[#908fa0] text-[10px]" x="10" y="130">40</text>
                <text className="font-code fill-[#908fa0] text-[10px]" x="15" y="195">0</text>

                {/* Monday: 84 reviews */}
                <g transform="translate(60, 0)">
                  <rect className="fill-error" height="15" rx="2" width="48" x="0" y="175" />
                  <rect className="fill-tertiary" height="25" rx="2" width="48" x="0" y="148" />
                  <rect className="fill-secondary" height="86" rx="2" width="48" x="0" y="60" />
                  <text className="font-code fill-[#c7c4d7] text-[11px]" textAnchor="middle" x="24" y="198">MON</text>
                </g>

                {/* Tuesday: 92 reviews */}
                <g transform="translate(150, 0)">
                  <rect className="fill-error" height="10" rx="2" width="48" x="0" y="180" />
                  <rect className="fill-tertiary" height="20" rx="2" width="48" x="0" y="158" />
                  <rect className="fill-secondary" height="108" rx="2" width="48" x="0" y="48" />
                  <text className="font-code fill-[#c7c4d7] text-[11px]" textAnchor="middle" x="24" y="198">TUE</text>
                </g>

                {/* Wednesday: 64 reviews */}
                <g transform="translate(240, 0)">
                  <rect className="fill-error" height="18" rx="2" width="48" x="0" y="172" />
                  <rect className="fill-tertiary" height="22" rx="2" width="48" x="0" y="148" />
                  <rect className="fill-secondary" height="56" rx="2" width="48" x="0" y="90" />
                  <text className="font-code fill-[#c7c4d7] text-[11px]" textAnchor="middle" x="24" y="198">WED</text>
                </g>

                {/* Thursday: 104 reviews */}
                <g transform="translate(330, 0)">
                  <rect className="fill-error" height="12" rx="2" width="48" x="0" y="178" />
                  <rect className="fill-tertiary" height="18" rx="2" width="48" x="0" y="158" />
                  <rect className="fill-secondary" height="126" rx="2" width="48" x="0" y="30" />
                  <text className="font-code fill-[#c7c4d7] text-[11px]" textAnchor="middle" x="24" y="198">THU</text>
                </g>

                {/* Friday: 78 reviews */}
                <g transform="translate(420, 0)">
                  <rect className="fill-error" height="8" rx="2" width="48" x="0" y="182" />
                  <rect className="fill-tertiary" height="22" rx="2" width="48" x="0" y="158" />
                  <rect className="fill-secondary" height="87" rx="2" width="48" x="0" y="69" />
                  <text className="font-code fill-[#c7c4d7] text-[11px]" textAnchor="middle" x="24" y="198">FRI</text>
                </g>

                {/* Saturday: 42 reviews */}
                <g transform="translate(510, 0)">
                  <rect className="fill-error" height="6" rx="2" width="48" x="0" y="184" />
                  <rect className="fill-tertiary" height="12" rx="2" width="48" x="0" y="170" />
                  <rect className="fill-secondary" height="45" rx="2" width="48" x="0" y="123" />
                  <text className="font-code fill-[#c7c4d7] text-[11px]" textAnchor="middle" x="24" y="198">SAT</text>
                </g>

                {/* Sunday: 110 reviews */}
                <g transform="translate(600, 0)">
                  <rect className="fill-error" height="14" rx="2" width="48" x="0" y="176" />
                  <rect className="fill-tertiary" height="20" rx="2" width="48" x="0" y="154" />
                  <rect className="fill-secondary" height="132" rx="2" width="48" x="0" y="20" />
                  <text className="font-code fill-primary font-bold text-[11px]" textAnchor="middle" x="24" y="198">SUN*</text>
                </g>
              </svg>
            </div>

            <div className="flex items-center justify-between pt-2 text-on-surface-variant text-xs font-code">
              <span>Aggregate Weekly Accuracy: <strong className="text-on-surface">86.2%</strong></span>
              <span>Peak Velocity: Thursday (104 cards)</span>
            </div>
          </div>

          {/* Module 3: Theoretical vs Leitner Spaced Decay Curve */}
          <div className="flex flex-col p-space-lg rounded-2xl bg-surface-container border border-surface-container-highest/30 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-wider text-outline font-code">
                  Retention Curve Formulation
                </span>
                <h2 className="text-base font-semibold text-on-surface">
                  Ebbinghaus Decay vs Leitner Reinforcement
                </h2>
              </div>
              <span className="font-code text-xs text-primary bg-surface-container-low px-2 py-0.5 rounded border border-primary/20">
                R = e^(-t/S)
              </span>
            </div>
            <p className="text-xs text-on-surface-variant mb-3 leading-relaxed">
              Visual comparison of spontaneous memory entropy without review vs sustained longitudinal stability after structured Leitner interval encounters.
            </p>

            <div className="w-full h-48 bg-surface-container-low rounded-xl p-space-sm relative border border-surface-container-highest/20">
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 650 160">
                <line className="text-surface-variant" stroke="currentColor" strokeWidth="1" x1="0" x2="650" y1="40" y2="40" />
                <line className="text-surface-variant" stroke="currentColor" strokeWidth="1" x1="0" x2="650" y1="80" y2="80" />
                <line className="text-surface-variant" stroke="currentColor" strokeWidth="1" x1="0" x2="650" y1="120" y2="120" />

                {/* Classical Exponential Drop */}
                <path
                  className="text-error/60"
                  d="M 20 20 Q 80 120, 200 145 T 630 155"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray="3 3"
                  strokeWidth="2"
                />

                {/* Leitner Intervention Reinforcement curve */}
                <path
                  className="text-secondary"
                  d="M 20 20 Q 70 80, 120 100 L 120 25 Q 190 70, 260 82 L 260 25 Q 360 55, 450 62 L 450 22 Q 540 38, 630 42"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                />

                <circle className="text-secondary" cx="120" cy="25" fill="currentColor" r="4" />
                <circle className="text-secondary" cx="260" cy="25" fill="currentColor" r="4" />
                <circle className="text-secondary" cx="450" cy="22" fill="currentColor" r="4" />

                <text className="font-code fill-error text-[11px]" x="210" y="140">
                  Natural Forgetting Curve
                </text>
                <text className="font-code fill-secondary text-[11px] font-bold" x="430" y="35">
                  Leitner Reinforced State (92% recall)
                </text>
              </svg>
            </div>

            <div className="flex items-center justify-between pt-2 text-[11px] text-on-surface-variant font-code">
              <span>Day 0 (Initial Encoding)</span>
              <span>Day 3 (Intervention 1)</span>
              <span>Day 7 (Intervention 2)</span>
              <span>Day 14 (Box 5 Consolidation)</span>
            </div>
          </div>
        </div>

        {/* Right Minor Column (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-space-lg">
          {/* Section: Relapse & Deficit Tracker */}
          <div className="flex flex-col p-space-lg rounded-2xl bg-surface-container border border-surface-container-highest/30 shadow-xs">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-error text-[18px]">warning</span>
                <h2 className="text-base font-semibold text-on-surface">High Spacing Deficits</h2>
              </div>
              <span className="font-code text-xs text-error bg-error-container/20 px-2 py-0.5 rounded border border-error/20 font-bold">
                3 Priority
              </span>
            </div>
            <p className="text-xs text-on-surface-variant mb-space-md leading-relaxed">
              Cards with repeated regression back to Box 1 during previous 14 days.
            </p>

            <div className="flex flex-col gap-2.5">
              {/* Relapsed 1 */}
              <div className="p-3 rounded-xl bg-surface-container-low flex flex-col gap-1 hover:bg-surface-container-high transition-colors border border-surface-container-highest/20">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs text-on-surface font-medium leading-snug">
                    Describe the function of the Subnet Mask in IPv4
                  </span>
                  <button
                    onClick={() => startStudySession('cs-304')}
                    className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary text-on-primary text-xs font-semibold hover:opacity-90 transition-opacity"
                    type="button"
                  >
                    <span>Drill</span>
                    <span className="material-symbols-outlined text-[13px]">bolt</span>
                  </button>
                </div>
                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="text-on-surface-variant font-code">Data Communication</span>
                  <span className="text-error font-code font-bold">Relapsed 4× to Box 1</span>
                </div>
              </div>

              {/* Relapsed 2 */}
              <div className="p-3 rounded-xl bg-surface-container-low flex flex-col gap-1 hover:bg-surface-container-high transition-colors border border-surface-container-highest/20">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs text-on-surface font-medium leading-snug">
                    Differentiate between Capital Expenditure (CapEx) and OpEx
                  </span>
                  <button
                    onClick={() => startStudySession('fin-101')}
                    className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container text-on-surface hover:text-primary text-xs font-semibold transition-colors border border-surface-container-highest/30"
                    type="button"
                  >
                    <span>Drill</span>
                    <span className="material-symbols-outlined text-[13px]">bolt</span>
                  </button>
                </div>
                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="text-on-surface-variant font-code">Intro to Corporate Finance</span>
                  <span className="text-tertiary font-code font-bold">Relapsed 2× to Box 1</span>
                </div>
              </div>

              {/* Relapsed 3 */}
              <div className="p-3 rounded-xl bg-surface-container-low flex flex-col gap-1 hover:bg-surface-container-high transition-colors border border-surface-container-highest/20">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs text-on-surface font-medium leading-snug">
                    3NF Relational Normalization integrity rules & transitive dependencies
                  </span>
                  <button
                    onClick={() => startStudySession('is-201')}
                    className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container text-on-surface hover:text-primary text-xs font-semibold transition-colors border border-surface-container-highest/30"
                    type="button"
                  >
                    <span>Drill</span>
                    <span className="material-symbols-outlined text-[13px]">bolt</span>
                  </button>
                </div>
                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="text-on-surface-variant font-code">Database Information Systems</span>
                  <span className="text-tertiary font-code font-bold">Relapsed 2× to Box 1</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Topics Requiring Revision */}
          <div className="flex flex-col p-space-lg rounded-2xl bg-surface-container border border-surface-container-highest/30 shadow-xs">
            <div className="flex items-center justify-between mb-space-md">
              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-wider text-outline font-code">
                  Syllabus Breakdown
                </span>
                <h2 className="text-base font-semibold text-on-surface">Topics Requiring Strategic Revision</h2>
              </div>
              <span className="material-symbols-outlined text-outline text-[18px]">tune</span>
            </div>

            <div className="flex flex-col gap-3">
              {/* Topic 1 */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-on-surface font-medium">IP Addressing & CIDR Notation</span>
                  <span className="font-code text-error font-semibold">62% Mastery · 12 Due</span>
                </div>
                <div className="w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden">
                  <div className="bg-error h-full rounded-full" style={{ width: '62%' }}></div>
                </div>
              </div>

              {/* Topic 2 */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-on-surface font-medium">Contracts & Tort Liability Foundations</span>
                  <span className="font-code text-tertiary font-semibold">68% Mastery · 8 Due</span>
                </div>
                <div className="w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden">
                  <div className="bg-tertiary h-full rounded-full" style={{ width: '68%' }}></div>
                </div>
              </div>

              {/* Topic 3 */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-on-surface font-medium">Time Value of Money (TVM & Perpetuities)</span>
                  <span className="font-code text-primary font-semibold">74% Mastery · 6 Due</span>
                </div>
                <div className="w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: '74%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Course Performance Matrix */}
          <div className="flex flex-col p-space-lg rounded-2xl bg-surface-container border border-surface-container-highest/30 shadow-xs">
            <div className="flex items-center justify-between mb-space-md">
              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-wider text-outline font-code">
                  Cross-Disciplinary Index
                </span>
                <h2 className="text-base font-semibold text-on-surface">Course Performance Matrix</h2>
              </div>
              <span className="font-code text-xs text-on-surface-variant">6 Enrolled</span>
            </div>

            <div className="flex flex-col gap-2">
              {[
                { name: 'Computer Architecture', cards: 210, latency: '3.2s', score: '94.1%', badge: 'Secured', badgeColor: 'bg-secondary/10 text-secondary' },
                { name: 'Algorithms & Complexity', cards: 184, latency: '4.1s', score: '91.0%', badge: 'Secured', badgeColor: 'bg-secondary/10 text-secondary' },
                { name: 'Database Information Systems', cards: 142, latency: '3.5s', score: '86.5%', badge: 'Solid', badgeColor: 'bg-primary/10 text-primary' },
                { name: 'Intro to Corporate Finance', cards: 95, latency: '5.2s', score: '78.2%', badge: 'Review', badgeColor: 'bg-tertiary/10 text-tertiary' },
                { name: 'Data Communication', cards: 68, latency: '6.1s', score: '68.4%', badge: 'Warning', badgeColor: 'bg-error/10 text-error' },
                { name: 'Cyber Law & Ethics', cards: 40, latency: '3.9s', score: '84.0%', badge: 'Solid', badgeColor: 'bg-primary/10 text-primary' },
              ].map(item => (
                <div key={item.name} className="flex items-center justify-between py-1 border-b border-surface-container-highest/20 last:border-0">
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs text-on-surface font-medium truncate">{item.name}</span>
                    <span className="text-[11px] text-on-surface-variant font-code">{item.cards} cards · {item.latency} avg latency</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-code text-xs text-on-surface font-bold">{item.score}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-code ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Comprehensive Session Review History Log */}
      <div className="flex flex-col p-space-lg rounded-2xl bg-surface-container border border-surface-container-highest/30 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs mb-space-md">
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-wider text-outline font-code">Raw Event Stream</span>
            <h2 className="text-base font-semibold text-on-surface">Recent Study Session Executions</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => alert('Filtering session events by course')}
              className="flex items-center gap-1 text-xs text-on-surface-variant hover:text-on-surface px-2.5 py-1 rounded-lg bg-surface-container-low transition-colors border border-surface-container-highest/20"
              type="button"
            >
              <span className="material-symbols-outlined text-[14px]">filter_list</span>
              <span>Filter Courses</span>
            </button>
            <span className="font-code text-xs text-on-surface-variant">Showing latest {studyLogs.length} entries</span>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant text-[11px] font-semibold uppercase tracking-wider font-code">
                <th className="py-2.5 px-space-md rounded-l-lg">Timestamp</th>
                <th className="py-2.5 px-space-md">Course Module</th>
                <th className="py-2.5 px-space-md text-right">Cards Reviewed</th>
                <th className="py-2.5 px-space-md text-right">Fidelity / Accuracy</th>
                <th className="py-2.5 px-space-md text-right rounded-r-lg">Session Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-high/40">
              {studyLogs.map(log => (
                <tr key={log.id} className="hover:bg-surface-container-high/30 transition-colors">
                  <td className="py-3 px-space-md font-code text-on-surface-variant">{log.timestamp}</td>
                  <td className="py-3 px-space-md font-medium text-on-surface">{log.courseModule}</td>
                  <td className="py-3 px-space-md text-right font-code text-on-surface">{log.cardsReviewed} cards</td>
                  <td className="py-3 px-space-md text-right">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded font-code text-[11px] font-bold ${
                      log.fidelityPercent >= 90
                        ? 'bg-secondary/15 text-secondary'
                        : log.fidelityPercent >= 80
                        ? 'bg-primary/15 text-primary'
                        : log.fidelityPercent >= 75
                        ? 'bg-tertiary/15 text-tertiary'
                        : 'bg-error/15 text-error'
                    }`}>
                      {log.fidelityPercent}%
                    </span>
                  </td>
                  <td className="py-3 px-space-md text-right font-code text-on-surface-variant">{log.sessionDuration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
