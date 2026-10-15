import React, { useState, useEffect } from 'react';
import { useLeitner } from '../../context/LeitnerContext';
import { Difficulty } from '../../types';

export const CreateCardModal: React.FC = () => {
  const { 
    isCreateCardModalOpen, 
    setIsCreateCardModalOpen, 
    editingCard, 
    setEditingCard, 
    courses, 
    addCard, 
    updateCard 
  } = useLeitner();

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [courseId, setCourseId] = useState(courses[0]?.id || 'cs-304');
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
  const [tagsInput, setTagsInput] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (editingCard) {
      setQuestion(editingCard.question);
      setAnswer(editingCard.answer);
      setCourseId(editingCard.courseId);
      setTopic(editingCard.topic);
      setDifficulty(editingCard.difficulty);
      setTagsInput(editingCard.tags.join(', '));
      setNotes(editingCard.notes || '');
    } else {
      setQuestion('');
      setAnswer('');
      setCourseId(courses[0]?.id || 'cs-304');
      setTopic('');
      setDifficulty('Medium');
      setTagsInput('');
      setNotes('');
    }
  }, [editingCard, courses, isCreateCardModalOpen]);

  if (!isCreateCardModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    if (editingCard) {
      updateCard({
        ...editingCard,
        question,
        answer,
        courseId,
        courseName: courses.find(c => c.id === courseId)?.name || editingCard.courseName,
        topic: topic || 'General',
        difficulty,
        tags,
        notes,
      });
    } else {
      addCard({
        question,
        answer,
        courseId,
        topic: topic || 'General',
        difficulty,
        tags,
        notes,
      });
    }

    setIsCreateCardModalOpen(false);
    setEditingCard(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-dim/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-lg bg-surface-container rounded-2xl shadow-2xl border border-surface-container-highest/40 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-container-highest/30">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">
              {editingCard ? 'edit' : 'add_circle'}
            </span>
            <h3 className="text-base font-semibold text-on-surface">
              {editingCard ? 'Edit Flashcard' : 'Create New Flashcard'}
            </h3>
          </div>
          <button
            onClick={() => {
              setIsCreateCardModalOpen(false);
              setEditingCard(null);
            }}
            className="p-1 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container-high transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 text-xs">
          {/* Question */}
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-on-surface font-code">
              Prompt / Flashcard Question <span className="text-error">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. Describe the function of the Subnet Mask in IPv4."
              className="w-full p-3 rounded-xl bg-surface-container-low border border-surface-container-highest/40 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary font-sans leading-relaxed text-xs"
            />
          </div>

          {/* Answer */}
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-on-surface font-code">
              Structured Answer <span className="text-error">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="e.g. Distinguishes network component from host portion within a 32-bit address space..."
              className="w-full p-3 rounded-xl bg-surface-container-low border border-surface-container-highest/40 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary font-sans leading-relaxed text-xs"
            />
          </div>

          {/* Course & Difficulty row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-on-surface font-code">Course</label>
              <select
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-surface-container-low border border-surface-container-highest/40 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary font-sans text-xs"
              >
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-on-surface font-code">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                className="w-full p-2.5 rounded-xl bg-surface-container-low border border-surface-container-highest/40 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary font-code text-xs"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          {/* Topic & Tags */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-on-surface font-code">Topic / Concept</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. IP Addressing"
                className="w-full p-2.5 rounded-xl bg-surface-container-low border border-surface-container-highest/40 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary font-sans text-xs"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-on-surface font-code">Tags (comma separated)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="networking, ipv4, subnetting"
                className="w-full p-2.5 rounded-xl bg-surface-container-low border border-surface-container-highest/40 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary font-code text-xs"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-surface-container-highest/30">
            <button
              onClick={() => {
                setIsCreateCardModalOpen(false);
                setEditingCard(null);
              }}
              type="button"
              className="px-4 py-2 rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface text-xs font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-fixed text-on-primary text-xs font-semibold shadow-xs active:scale-95 transition-all"
            >
              {editingCard ? 'Save Changes' : 'Create Card (Box 1)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
