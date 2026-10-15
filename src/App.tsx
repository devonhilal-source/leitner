/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LeitnerProvider, useLeitner } from './context/LeitnerContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { OverviewView } from './components/overview/OverviewView';
import { LibraryView } from './components/library/LibraryView';
import { StudyView } from './components/study/StudyView';
import { CoursesView } from './components/courses/CoursesView';
import { ProgressView } from './components/progress/ProgressView';
import { ImportView } from './components/import/ImportView';
import { SettingsView } from './components/settings/SettingsView';
import { QuickJumpModal } from './components/common/QuickJumpModal';
import { CreateCardModal } from './components/common/CreateCardModal';
import { NewCourseModal } from './components/common/NewCourseModal';

const AppContent: React.FC = () => {
  const { currentView } = useLeitner();

  return (
    <div className="min-h-screen bg-surface-container-lowest text-on-surface flex flex-col font-sans">
      <Sidebar />
      <div className="pl-64 flex flex-col min-h-screen">
        <Header />
        <main className="relative pt-20 min-h-screen bg-surface-container-lowest w-full px-space-lg">
          {currentView === 'overview' && <OverviewView />}
          {currentView === 'library' && <LibraryView />}
          {currentView === 'study' && <StudyView />}
          {currentView === 'courses' && <CoursesView />}
          {currentView === 'progress' && <ProgressView />}
          {currentView === 'import' && <ImportView />}
          {currentView === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Global Modals */}
      <QuickJumpModal />
      <CreateCardModal />
      <NewCourseModal />
    </div>
  );
};

export default function App() {
  return (
    <LeitnerProvider>
      <AppContent />
    </LeitnerProvider>
  );
}
