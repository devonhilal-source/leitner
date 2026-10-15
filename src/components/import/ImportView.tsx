import React, { useState, useRef } from 'react';
import { useLeitner } from '../../context/LeitnerContext';

export const ImportView: React.FC = () => {
  const { 
    setCurrentView, 
    courses, 
    ingestIssues, 
    ingestRows, 
    resolveIngestIssue, 
    commitImport 
  } = useLeitner();

  const [activeStep, setActiveStep] = useState(2);
  const [selectedTargetCourse, setSelectedTargetCourse] = useState('data-comm');
  const [quickFillInput8, setQuickFillInput8] = useState(
    'Carrier Sense Multiple Access with Collision Detection; a media access control method used in early Ethernet networks.'
  );
  const [isQuickFill8Open, setIsQuickFill8Open] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [fileName, setFileName] = useState('networks_midterm_deck.csv');
  const [fileSize, setFileSize] = useState('124 KB');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const issue8 = ingestIssues.find(i => i.rowNumber === 8);
  const issue19 = ingestIssues.find(i => i.rowNumber === 19);
  const issue34 = ingestIssues.find(i => i.rowNumber === 34);

  // Count ready cards
  const readyCount = 51 + (issue8?.resolved && !issue8.isExcluded ? 1 : 0);

  const handleCopyPrompt = () => {
    const promptText = `Extract core flashcards from this text into a CSV with exact headers: question, answer, course, topic, difficulty, tags. Keep questions single-concept, answers under 40 words, and difficulty rated as Easy, Medium, or Hard. Format as UTF-8 comma-separated text.`;
    navigator.clipboard.writeText(promptText);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2200);
  };

  const handleDownloadSample = () => {
    const csvContent = `question,answer,course,topic,difficulty,tags
"What is an interpreter?","A program that translates and executes code statement by statement without prior compilation.","Intro to IT","Programming Languages","Medium","programming;syntax"
"Explain the difference between TCP and UDP.","TCP is connection-oriented, stateful, and guarantees ordered delivery; UDP is connectionless, stateless, and operates on best-effort.","Data Communication","Transport Layer","Hard","networking;protocols"
"Define Price Elasticity of Demand.","The percentage change in quantity demanded divided by the percentage change in price.","Intro to Business Finance","Microeconomics","Medium","economics;formula"`;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leitner_sample_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      setFileSize(`${Math.round(file.size / 1024)} KB`);
    }
  };

  return (
    <div className="flex flex-col w-full pb-space-xl">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".csv,.tsv,.txt"
        className="hidden"
      />

      {/* Top Command Breadcrumb & Mode Status */}
      <div className="flex items-center justify-between py-1 mb-space-md select-none">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-primary-container text-on-primary-container font-code text-xs font-bold">
            CSV
          </span>
          <div className="flex items-center gap-1.5 text-xs text-on-surface-variant font-code">
            <span>Ingest Pipeline</span>
            <span className="text-outline">/</span>
            <span className="text-on-surface">Data Parser v2.4</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container text-secondary font-code border border-secondary/20">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
            Parser Engine: Active
          </span>
          <span className="text-outline">·</span>
          <span className="text-on-surface-variant font-code text-[11px]">Schema: v3-LeitnerStandard</span>
        </div>
      </div>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-lg">
        <div className="max-w-2xl">
          <div className="flex items-center gap-1 text-primary text-xs mb-1 tracking-wider uppercase font-code font-semibold">
            <span className="material-symbols-outlined text-[16px]">auto_read_play</span>
            <span>Standardized Dataset Ingest</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-semibold text-on-surface tracking-tight font-display">
            Import Flashcards
          </h1>
          <p className="text-sm text-on-surface-variant mt-1 leading-relaxed">
            Import structured decks via CSV generated from your lecture notes, syllabi, or frontier AI models like Claude 3.7 & GPT-4o.
          </p>
        </div>

        {/* Upload Summary Pill */}
        <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-surface-container shadow-xs self-start md:self-auto border border-surface-container-highest/30">
          <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[18px]">description</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-code text-xs text-on-surface font-medium truncate max-w-[180px]">
                {fileName}
              </span>
              <span className="text-[11px] text-outline font-code">· {fileSize}</span>
            </div>
            <span className="text-[11px] text-on-surface-variant">Parsed just now · UTF-8 CRLF</span>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="ml-2 px-2.5 py-1 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface text-xs font-medium transition-all active:scale-95 border border-surface-container-highest/40"
            type="button"
          >
            Change file
          </button>
        </div>
      </div>

      {/* Stepper Indicator (5 discrete stages) */}
      <div className="w-full bg-surface-container-low rounded-2xl p-space-md mb-space-lg shadow-sm border border-surface-container-highest/30">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 items-center">
          {/* Step 1: Upload (Done) */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-code text-xs font-bold">
              <span className="material-symbols-outlined text-[16px] font-bold">check</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-secondary uppercase tracking-wider font-semibold font-code">Step 01</span>
              <span className="text-xs text-on-surface truncate font-medium">Upload File</span>
            </div>
          </div>

          {/* Step 2: Validate (Active) */}
          <div className="flex items-center gap-2 relative">
            <div className="w-7 h-7 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-code text-xs font-bold ring-2 ring-primary">
              02
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-primary uppercase tracking-wider font-semibold font-code">Step 02</span>
              <span className="text-xs text-on-surface truncate font-semibold">Validate Schema</span>
            </div>
          </div>

          {/* Step 3: Inspect */}
          <div className="flex items-center gap-2 opacity-60">
            <div className="w-7 h-7 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center font-code text-xs">
              03
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-code">Step 03</span>
              <span className="text-xs text-on-surface truncate">Inspect Cards</span>
            </div>
          </div>

          {/* Step 4: Confirm */}
          <div className="flex items-center gap-2 opacity-40">
            <div className="w-7 h-7 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center font-code text-xs">
              04
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-code">Step 04</span>
              <span className="text-xs text-on-surface truncate">Target Deck</span>
            </div>
          </div>

          {/* Step 5: Success */}
          <div className="flex items-center gap-2 opacity-30">
            <div className="w-7 h-7 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center font-code text-xs">
              05
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-code">Step 05</span>
              <span className="text-xs text-on-surface truncate">Ready for Study</span>
            </div>
          </div>
        </div>

        {/* Progress track */}
        <div className="w-full bg-surface-container-highest h-1 rounded-full mt-3 overflow-hidden">
          <div className="bg-gradient-to-r from-secondary via-primary to-primary-container h-full w-[38%] transition-all duration-500 rounded-full"></div>
        </div>
      </div>

      {/* Frontier AI Prompt Orchestration Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-surface-container p-space-md mb-space-lg shadow-sm border border-surface-container-highest/30">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md relative z-10">
          <div className="flex items-start gap-space-md">
            <div className="w-10 h-10 rounded-xl bg-tertiary-container/30 text-tertiary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[24px]">magic_button</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold text-on-surface">Frontier AI Prompt Orchestration</span>
                <span className="px-2 py-0.5 rounded text-[11px] font-code bg-tertiary/20 text-tertiary">
                  Claude / GPT Compatible
                </span>
              </div>
              <p className="text-xs text-on-surface-variant mt-1 max-w-3xl leading-relaxed">
                Synthesizing dense medical, technical, or legal texts? Copy our hardened Leitner-compliant prompt into Claude or ChatGPT to generate faultless CSVs containing optimal question granularity, context-rich answers, and automated tier difficulty.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
            <button
              onClick={handleCopyPrompt}
              className={`flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all active:scale-95 border border-surface-container-highest/40 ${
                copyFeedback 
                  ? 'bg-secondary text-on-secondary font-bold' 
                  : 'bg-surface-container-high hover:bg-surface-bright text-on-surface'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">
                {copyFeedback ? 'check' : 'content_copy'}
              </span>
              <span>{copyFeedback ? 'Prompt Copied!' : 'Copy AI Prompt'}</span>
              <kbd className="font-code text-[10px] text-outline ml-1">⌘C</kbd>
            </button>
            <button
              onClick={handleDownloadSample}
              className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface-variant hover:text-on-surface text-xs font-medium transition-all border border-surface-container-highest/40"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>Sample Template</span>
            </button>
          </div>
        </div>
      </div>

      {/* Validation Status KPI Matrix */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-space-md mb-space-lg">
        {/* Total Ingested */}
        <div className="p-space-md rounded-xl bg-surface-container-low border border-surface-container-highest/30 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="text-[11px] font-semibold uppercase tracking-wider font-code">Total Ingested</span>
            <span className="material-symbols-outlined text-outline text-[18px]">format_list_numbered</span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-semibold text-on-surface font-display">54</span>
            <span className="text-xs text-on-surface-variant font-code">rows</span>
          </div>
          <span className="text-xs text-outline mt-1 truncate">Header row verified</span>
        </div>

        {/* Valid Cards */}
        <div className="p-space-md rounded-xl bg-surface-container-low border border-surface-container-highest/30 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-secondary">
            <span className="text-[11px] font-semibold uppercase tracking-wider font-code">Valid Cards</span>
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-semibold text-secondary font-display">{readyCount}</span>
            <span className="text-xs text-secondary-container font-code">94.4% match</span>
          </div>
          <span className="text-xs text-secondary font-medium mt-1 truncate">Ready for Leitner Stage 1</span>
        </div>

        {/* Schema Warnings */}
        <div className="p-space-md rounded-xl bg-surface-container-low border border-surface-container-highest/30 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-tertiary">
            <span className="text-[11px] font-semibold uppercase tracking-wider font-code">Schema Warnings</span>
            <span className="material-symbols-outlined text-[18px]">warning</span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-semibold text-tertiary font-display">
              {issue8?.resolved ? 1 : 2}
            </span>
            <span className="text-xs text-tertiary font-code">action needed</span>
          </div>
          <span className="text-xs text-on-surface-variant mt-1 truncate">Missing values & types</span>
        </div>

        {/* Deck Overlaps */}
        <div className="p-space-md rounded-xl bg-surface-container-low border border-surface-container-highest/30 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="text-[11px] font-semibold uppercase tracking-wider font-code">Deck Overlaps</span>
            <span className="material-symbols-outlined text-outline text-[18px]">content_copy</span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-semibold text-outline font-display">1</span>
            <span className="text-xs text-outline font-code">collision</span>
          </div>
          <span className="text-xs text-outline mt-1 truncate">Identified in Target Deck</span>
        </div>
      </div>

      {/* Validation Inspector & Resolution Engine */}
      <div className="rounded-2xl bg-surface-container p-space-md mb-space-lg shadow-sm border border-surface-container-highest/30">
        <div className="flex items-center justify-between pb-space-sm mb-space-sm border-b border-surface-container-highest/20">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-tertiary"></div>
            <h3 className="text-sm font-semibold text-on-surface">Validation Inspector & Resolution Engine</h3>
            <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-tertiary font-code text-xs">
              3 Attention Flags
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
            <span className="material-symbols-outlined text-[16px]">tune</span>
            <span>Auto-sanitize on confirm enabled</span>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          {/* Issue 1: Row 8 (Missing Required Field: answer) */}
          <div className="p-space-md rounded-xl bg-surface-container-high flex flex-col lg:flex-row lg:items-center justify-between gap-space-md transition-all border border-surface-container-highest/30">
            <div className="flex items-start gap-space-md">
              <div className="px-2 py-1 rounded bg-error-container text-on-error-container font-code text-xs font-semibold shrink-0">
                Row 08
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-code text-xs text-error font-semibold uppercase">
                    Missing Required Field: `answer`
                  </span>
                  <span className="text-outline">·</span>
                  <span className="text-xs text-on-surface font-medium">Question: "What is CSMA/CD?"</span>
                </div>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  {issue8?.resolved
                    ? issue8.resolvedAction
                    : 'Every flashcard requires an explicit answer field to initialize the spaced recall loop.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end lg:self-auto shrink-0">
              {issue8?.resolved ? (
                <span className="text-xs font-code text-secondary flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">task_alt</span>
                  <span>Resolved</span>
                </span>
              ) : (
                <>
                  <button
                    onClick={() => setIsQuickFill8Open(!isQuickFill8Open)}
                    className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-bright text-primary text-xs font-medium transition-colors flex items-center gap-1 border border-surface-container-highest/30"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[14px]">edit</span>
                    <span>Quick Fill In-Line</span>
                  </button>
                  <button
                    onClick={() => resolveIngestIssue('iss-8', 'exclude')}
                    className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-error-container hover:text-on-error-container text-on-surface-variant text-xs font-medium transition-colors border border-surface-container-highest/30"
                    type="button"
                  >
                    Exclude Row
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Quick Fill In-Line Drawer for Row 8 */}
          {isQuickFill8Open && !issue8?.resolved && (
            <div className="p-3.5 rounded-xl bg-surface-container-low shadow-inner border border-primary/30 flex flex-col gap-2 animate-fadeIn">
              <label className="text-xs text-on-surface-variant font-code">
                Inject Answer for "What is CSMA/CD?":
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={quickFillInput8}
                  onChange={(e) => setQuickFillInput8(e.target.value)}
                  className="flex-1 bg-surface-container px-3 py-2 rounded-lg text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary border border-surface-container-highest/40"
                />
                <button
                  onClick={() => {
                    resolveIngestIssue('iss-8', 'quickfill', quickFillInput8);
                    setIsQuickFill8Open(false);
                  }}
                  className="px-4 py-2 rounded-lg bg-primary-container text-on-primary-container text-xs font-semibold hover:bg-primary transition-colors shrink-0"
                  type="button"
                >
                  Save & Resolve
                </button>
              </div>
            </div>
          )}

          {/* Issue 2: Row 19 (Collision: Duplicate Question) */}
          <div className="p-space-md rounded-xl bg-surface-container-high flex flex-col lg:flex-row lg:items-center justify-between gap-space-md transition-all border border-surface-container-highest/30">
            <div className="flex items-start gap-space-md">
              <div className="px-2 py-1 rounded bg-surface-container text-on-surface-variant font-code text-xs font-semibold shrink-0">
                Row 19
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-code text-xs text-tertiary font-semibold uppercase">
                    Collision: Duplicate Question
                  </span>
                  <span className="text-outline">·</span>
                  <span className="text-xs text-on-surface font-medium">Course: "Data Communication"</span>
                </div>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  {issue19?.resolved
                    ? issue19.resolvedAction
                    : 'Exact match detected in active Box 3 deck: "Describe the function of the Physical Layer."'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end lg:self-auto shrink-0">
              {issue19?.resolved ? (
                <span className="text-xs font-code text-secondary flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">check</span>
                  <span>Handled</span>
                </span>
              ) : (
                <>
                  <button
                    onClick={() => resolveIngestIssue('iss-19', 'keep')}
                    className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-bright text-on-surface text-xs font-medium transition-colors border border-surface-container-highest/30"
                    type="button"
                  >
                    Keep Existing
                  </button>
                  <button
                    onClick={() => resolveIngestIssue('iss-19', 'overwrite')}
                    className="px-3 py-1.5 rounded-lg bg-secondary-container text-on-secondary-container text-xs font-semibold hover:bg-secondary transition-colors"
                    type="button"
                  >
                    Overwrite Current
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Issue 3: Row 34 (Type Coercion: Unknown Difficulty) */}
          <div className="p-space-md rounded-xl bg-surface-container-high flex flex-col lg:flex-row lg:items-center justify-between gap-space-md transition-all border border-surface-container-highest/30">
            <div className="flex items-start gap-space-md">
              <div className="px-2 py-1 rounded bg-surface-container text-outline font-code text-xs font-semibold shrink-0">
                Row 34
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-code text-xs text-outline font-semibold uppercase">
                    Type Coercion: Unknown Difficulty Value
                  </span>
                  <span className="text-outline">·</span>
                  <span className="font-code text-xs text-on-surface font-semibold">`ExtremelyHard`</span>
                </div>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Non-standard enum value mapped automatically to <span className="text-tertiary font-code">`Hard`</span> (Leitner Initial Multiplier: 1.0x).
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 self-end lg:self-auto shrink-0 text-xs text-secondary font-code">
              <span className="material-symbols-outlined text-[16px]">check</span>
              <span>Auto-Coerced to Hard</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Ingest Preview Matrix Table */}
      <div className="rounded-2xl bg-surface-container-low shadow-sm overflow-hidden mb-space-lg border border-surface-container-highest/30">
        <div className="p-space-md flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm bg-surface-container border-b border-surface-container-highest/20">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-outline text-[18px]">table_view</span>
            <h3 className="text-sm font-semibold text-on-surface">Ingest Preview (Sample of 51 Verified Rows)</h3>
          </div>
          <div className="flex items-center gap-1 text-xs text-on-surface-variant font-code">
            <span>Schema: [Question, Answer, Course, Topic, Difficulty, Tags]</span>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-surface-container-high text-on-surface-variant text-[11px] font-semibold uppercase tracking-wider font-code">
                <th className="py-2.5 px-space-md w-12">#</th>
                <th className="py-2.5 px-space-md min-w-[220px]">Prompt / Question</th>
                <th className="py-2.5 px-space-md min-w-[260px]">Structured Answer</th>
                <th className="py-2.5 px-space-md min-w-[160px]">Course & Topic</th>
                <th className="py-2.5 px-space-md w-28">Difficulty</th>
                <th className="py-2.5 px-space-md min-w-[140px]">Tags</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-high/30">
              {ingestRows.map((row) => (
                <tr key={row.rowNumber} className="hover:bg-surface-container-high/40 transition-colors">
                  <td className="py-3 px-space-md font-code text-outline text-xs align-top">
                    {row.rowNumber.toString().padStart(2, '0')}
                  </td>
                  <td className="py-3 px-space-md font-medium text-on-surface align-top leading-snug">
                    {row.question}
                  </td>
                  <td className="py-3 px-space-md text-on-surface-variant align-top leading-relaxed font-code text-[11px]">
                    {row.answer}
                  </td>
                  <td className="py-3 px-space-md align-top">
                    <div className="flex flex-col">
                      <span className="font-medium text-on-surface">{row.course}</span>
                      <span className="text-[11px] text-outline font-code">{row.topic}</span>
                    </div>
                  </td>
                  <td className="py-3 px-space-md align-top">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-code ${
                      row.difficulty === 'Hard'
                        ? 'bg-tertiary-container/30 text-tertiary font-semibold'
                        : 'bg-surface-container-highest text-primary'
                    }`}>
                      {row.difficulty}
                    </span>
                  </td>
                  <td className="py-3 px-space-md align-top">
                    <div className="flex flex-wrap gap-1">
                      {row.tags.map(t => (
                        <span key={t} className="px-1.5 py-0.5 rounded bg-surface-container font-code text-[10px] text-on-surface-variant">
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-space-md py-2.5 bg-surface-container flex items-center justify-between text-on-surface-variant text-xs border-t border-surface-container-highest/20 font-code">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">visibility</span>
            <span>Showing rows 1–5 of 51 valid items</span>
          </div>
          <span className="text-primary hover:underline cursor-pointer">
            View All 51 Rows ↗
          </span>
        </div>
      </div>

      {/* Destination Course Mapping Configuration */}
      <div className="p-space-md rounded-2xl bg-surface-container mb-space-xl shadow-sm border border-surface-container-highest/30">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
          <div className="flex items-start gap-space-md">
            <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-[20px]">folder_managed</span>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-on-surface">Target Deck Routing</h4>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Decide whether to assign all validated cards to a designated academic course or respect row-level metadata.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative min-w-[280px]">
              <select
                value={selectedTargetCourse}
                onChange={(e) => setSelectedTargetCourse(e.target.value)}
                className="w-full bg-surface-container-low text-on-surface px-3 py-2 rounded-xl appearance-none text-xs focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer pr-10 border border-surface-container-highest/40"
              >
                <option value="cs-304">Data Communication & Computer Networks</option>
                <option value="cs-210">Introduction to IT / Web Dev 1</option>
                <option value="fin-101">Intro to Business Finance</option>
                <option value="csv-course">→ Use 'Course' Column from CSV (Dynamic Split)</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-2.5 text-outline pointer-events-none text-[18px]">
                expand_more
              </span>
            </div>
            <div className="flex items-center gap-1 px-3 py-2 rounded-xl bg-surface-container-high text-on-surface-variant text-xs font-code border border-surface-container-highest/30">
              <span className="material-symbols-outlined text-[14px]">schedule</span>
              <span>Box 1 Initializer</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Step Navigation Footer */}
      <div className="sticky bottom-4 z-30 w-full rounded-2xl bg-surface-container/95 backdrop-blur-xl p-space-md shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-space-md border border-surface-container-highest/40">
        <div className="flex items-center gap-space-md w-full sm:w-auto justify-between sm:justify-start">
          <button
            onClick={() => setCurrentView('overview')}
            className="px-3 py-2 rounded-lg bg-transparent hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface text-xs transition-colors cursor-pointer"
            type="button"
          >
            Cancel Import
          </button>
          <span className="hidden sm:inline text-outline">|</span>
          <div className="flex items-center gap-2 font-code text-xs text-on-surface-variant">
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            <span>{readyCount} ready for ingestion</span>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setCurrentView('overview')}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1 px-4 py-2 rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface text-xs font-medium transition-colors border border-surface-container-highest/30"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Back to Upload</span>
          </button>
          <button
            onClick={() => commitImport(selectedTargetCourse)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-fixed text-on-primary text-xs font-semibold transition-all hover:scale-[1.01] active:scale-[0.98] shadow-md cursor-pointer"
            type="button"
          >
            <span>Proceed to Step 4: Target Deck ({readyCount} Cards)</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};
