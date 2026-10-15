export type LeitnerBoxNumber = 1 | 2 | 3 | 4 | 5;

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface BreakdownPoint {
  step: number;
  title: string;
  subtitle: string;
  description: string;
  badge?: string;
  color?: string;
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  courseId: string;
  courseName: string;
  topic: string;
  difficulty: Difficulty;
  box: LeitnerBoxNumber;
  nextDueText: string;
  dueDate: string; // ISO date string
  isDue: boolean;
  tags: string[];
  notes?: string;
  hasDiagram?: boolean;
  diagramType?: 'tcp_handshake' | 'flow' | 'architecture';
  breakdown?: BreakdownPoint[];
  relapseCount?: number;
  reviewCount?: number;
  lastReviewed?: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  totalCards: number;
  dueCards: number;
  masteryPercentage: number;
  box5Cards: number;
  boxDistribution: [number, number, number, number, number]; // Box 1 to 5 counts
  topics: string[];
  iteration: number;
  lastStudiedTopic?: string;
  lastStudiedTime?: string;
  nextScheduled?: string;
  isAllCaughtUp: boolean;
  urgencyColor: 'error' | 'tertiary' | 'primary' | 'secondary';
}

export interface StudySessionLog {
  id: string;
  timestamp: string;
  courseModule: string;
  cardsReviewed: number;
  fidelityPercent: number;
  sessionDuration: string;
  correctCount: number;
  hardCount: number;
  againCount: number;
}

export interface IngestIssue {
  id: string;
  rowNumber: number;
  type: 'missing_field' | 'duplicate_question' | 'type_coercion';
  title: string;
  description: string;
  field?: string;
  questionText: string;
  courseText: string;
  resolved: boolean;
  resolvedAction?: string;
  injectedValue?: string;
  isExcluded?: boolean;
}

export interface IngestRow {
  rowNumber: number;
  question: string;
  answer: string;
  course: string;
  topic: string;
  difficulty: Difficulty;
  tags: string[];
  status: 'valid' | 'warning' | 'error' | 'excluded';
}

export type ViewScreen = 'overview' | 'library' | 'study' | 'courses' | 'progress' | 'import' | 'settings';
