export type StepType =
  | "overview"
  | "learning_objectives"
  | "why_this_matters"
  | "reading"
  | "video"
  | "concept"
  | "example"
  | "framework"
  | "guided_practice"
  | "quiz"
  | "real_work_application"
  | "reflection"
  | "vp_lens"
  | "checkpoint";

export type BookConnection = {
  bookTitle: string;
  author: string;
  assignedConcept: string;
  readingPrompt: string;
  applicationPrompt: string;
};

export type Video = {
  title: string;
  source: string;
  url: string;
  whyRelevant: string;
  reflectionPrompt: string;
};

export type LessonStep = {
  id: string;
  type: StepType;
  title: string;
  content: string;
  prompt?: string;
  options?: string[];
  correctAnswer?: string;
  sampleAnswer?: string;
  completionRequired: boolean;
};

export type Lesson = {
  id: string;
  title: string;
  objective: string;
  estimatedMinutes: number;
  bookConnection: BookConnection;
  video: Video;
  steps: LessonStep[];
};

export type Unit = {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
};

export type Course = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  audience: string;
  estimatedHours: number;
  units: Unit[];
};

export type LessonProgress = {
  lessonId: string;
  currentStepId: string;
  completedSteps: string[];
  isCompleted: boolean;
  updatedAt: string;
};

export type ExerciseResponse = {
  lessonId: string;
  stepId: string;
  response: string;
  createdAt: string;
  updatedAt: string;
};

export type QuizResponse = {
  lessonId: string;
  stepId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  createdAt: string;
};

export type FinalProject = {
  originalUpdate: string;
  revisedExecutiveVersion: string;
  recommendation: string;
  businessImpact: string;
  ask: string;
  tradeoffs: string;
  risks: string;
  reflection: string;
  rubric: {
    recommendationClarity: number;
    businessImpact: number;
    conciseness: number;
    askClarity: number;
    tradeoffQuality: number;
    executiveReadiness: number;
  };
  completedAt: string | null;
  updatedAt: string;
};

export type AppData = {
  lessonProgress: LessonProgress[];
  exerciseResponses: ExerciseResponse[];
  quizResponses: QuizResponse[];
  finalProject: FinalProject;
};

export type LessonStatus = "Completed" | "In Progress" | "Not Started";
