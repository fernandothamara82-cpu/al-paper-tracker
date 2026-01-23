
export type SubjectId = 'physics' | 'chemistry' | 'maths';

export interface PaperCategories {
  physics: { mcq: number; essay: number };
  chemistry: { mcq: number; essay: number };
  maths: { pure: number; applied: number };
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface StudyGoal {
  id: string;
  subject: SubjectId;
  target: number;
  period: 'weekly' | 'monthly';
}

export interface DayEntry {
  date: string; // YYYY-MM-DD
  papers: PaperCategories;
  notes?: string;
}

export interface SubjectMetadata {
  id: SubjectId;
  label: string;
  icon: string;
  color: string;
  subCategories: { id: string; label: string }[];
}

export const SUBJECT_METADATA: Record<SubjectId, SubjectMetadata> = {
  physics: {
    id: 'physics',
    label: 'Physics',
    icon: 'fa-atom',
    color: 'blue',
    subCategories: [
      { id: 'mcq', label: 'MCQ' },
      { id: 'essay', label: 'Essay' }
    ]
  },
  chemistry: {
    id: 'chemistry',
    label: 'Chemistry',
    icon: 'fa-flask',
    color: 'emerald',
    subCategories: [
      { id: 'mcq', label: 'MCQ' },
      { id: 'essay', label: 'Essay' }
    ]
  },
  maths: {
    id: 'maths',
    label: 'Maths',
    icon: 'fa-calculator',
    color: 'indigo',
    subCategories: [
      { id: 'pure', label: 'Pure' },
      { id: 'applied', label: 'Applied' }
    ]
  }
};
