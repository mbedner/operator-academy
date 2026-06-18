import Database from "@tauri-apps/plugin-sql";
import { allLessons } from "./data/curriculumSeed";
import { firebaseProjectId, getFirebaseIdToken } from "./firebaseClient";
import type { AppData, ExerciseResponse, FinalProject, LessonProgress, QuizResponse } from "./types";

type SqlDb = Awaited<ReturnType<typeof Database.load>>;
export type RepositoryMode = "sqlite" | "browser" | "firebase";
export type Repository = {
  mode: RepositoryMode;
  loadData: () => Promise<AppData>;
  saveData: (data: AppData) => Promise<void>;
};

const fallbackKey = "operator-academy-course-data-v2";
const projectId = "course-1";

const now = () => new Date().toISOString();

function hasTauriRuntime() {
  return typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
}

export function defaultFinalProject(): FinalProject {
  return {
    originalUpdate: "",
    revisedExecutiveVersion: "",
    recommendation: "",
    businessImpact: "",
    ask: "",
    tradeoffs: "",
    risks: "",
    reflection: "",
    rubric: {
      recommendationClarity: 3,
      businessImpact: 3,
      conciseness: 3,
      askClarity: 3,
      tradeoffQuality: 3,
      executiveReadiness: 3
    },
    completedAt: null,
    updatedAt: now()
  };
}

function emptyData(): AppData {
  return {
    lessonProgress: allLessons.map((lesson) => ({
      lessonId: lesson.id,
      currentStepId: lesson.steps[0].id,
      completedSteps: [],
      isCompleted: false,
      updatedAt: now()
    })),
    exerciseResponses: [],
    quizResponses: [],
    finalProject: defaultFinalProject()
  };
}

function mergeWithSeed(data: AppData): AppData {
  const progress = [...data.lessonProgress];
  for (const lesson of allLessons) {
    if (!progress.some((item) => item.lessonId === lesson.id)) {
      progress.push({
        lessonId: lesson.id,
        currentStepId: lesson.steps[0].id,
        completedSteps: [],
        isCompleted: false,
        updatedAt: now()
      });
    }
  }
  return { ...data, lessonProgress: progress };
}

class BrowserRepository implements Repository {
  mode: RepositoryMode = "browser";

  async init() {
    if (!localStorage.getItem(fallbackKey)) {
      localStorage.setItem(fallbackKey, JSON.stringify(emptyData()));
    }
  }

  async loadData(): Promise<AppData> {
    const value = localStorage.getItem(fallbackKey);
    return mergeWithSeed(value ? (JSON.parse(value) as AppData) : emptyData());
  }

  async saveData(data: AppData) {
    localStorage.setItem(fallbackKey, JSON.stringify(data));
  }
}

class FirebaseRepository implements Repository {
  mode: RepositoryMode = "firebase";

  constructor(private userId: string) {}

  async init() {
    const data = await this.loadData();
    await this.saveData(data);
  }

  private documentUrl() {
    if (!firebaseProjectId) throw new Error("Firebase project ID is not configured.");
    return `https://firestore.googleapis.com/v1/projects/${firebaseProjectId}/databases/(default)/documents/users/${this.userId}/appData/${projectId}`;
  }

  private async authHeaders() {
    return {
      "Authorization": `Bearer ${await getFirebaseIdToken()}`,
      "Content-Type": "application/json"
    };
  }

  async loadData(): Promise<AppData> {
    const response = await fetch(this.documentUrl(), {
      method: "GET",
      headers: await this.authHeaders()
    });

    if (response.status === 404) {
      return mergeWithSeed(emptyData());
    }

    if (!response.ok) {
      throw new Error(await response.text() || "Unable to load Firebase data.");
    }

    const document = await response.json() as { fields?: { payload?: { stringValue?: string } } };
    const payload = document.fields?.payload?.stringValue;
    if (!payload) return mergeWithSeed(emptyData());
    return mergeWithSeed(JSON.parse(payload) as AppData);
  }

  async saveData(data: AppData) {
    const response = await fetch(this.documentUrl(), {
      method: "PATCH",
      headers: await this.authHeaders(),
      body: JSON.stringify({
        fields: {
          payload: { stringValue: JSON.stringify(data) },
          updatedAt: { timestampValue: now() }
        }
      })
    });

    if (!response.ok) {
      throw new Error(await response.text() || "Unable to save Firebase data.");
    }
  }
}

class SqliteRepository implements Repository {
  mode: RepositoryMode = "sqlite";
  private db: SqlDb | null = null;

  async init() {
    this.db = await Database.load("sqlite:operator-academy.db");
    await this.requireDb().execute(`
      CREATE TABLE IF NOT EXISTS lesson_progress (
        lesson_id TEXT PRIMARY KEY,
        current_step_id TEXT NOT NULL,
        completed_steps TEXT NOT NULL,
        is_completed INTEGER NOT NULL,
        updated_at TEXT NOT NULL
      )
    `);
    await this.requireDb().execute(`
      CREATE TABLE IF NOT EXISTS exercise_responses (
        lesson_id TEXT NOT NULL,
        step_id TEXT NOT NULL,
        response TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        PRIMARY KEY (lesson_id, step_id)
      )
    `);
    await this.requireDb().execute(`
      CREATE TABLE IF NOT EXISTS quiz_responses (
        lesson_id TEXT NOT NULL,
        step_id TEXT NOT NULL,
        selected_answer TEXT NOT NULL,
        is_correct INTEGER NOT NULL,
        created_at TEXT NOT NULL,
        PRIMARY KEY (lesson_id, step_id)
      )
    `);
    await this.requireDb().execute(`
      CREATE TABLE IF NOT EXISTS final_project (
        id TEXT PRIMARY KEY,
        original_update TEXT NOT NULL,
        revised_executive_version TEXT NOT NULL,
        recommendation TEXT NOT NULL,
        business_impact TEXT NOT NULL,
        ask TEXT NOT NULL,
        tradeoffs TEXT NOT NULL,
        risks TEXT NOT NULL,
        reflection TEXT NOT NULL,
        rubric TEXT NOT NULL,
        completed_at TEXT,
        updated_at TEXT NOT NULL
      )
    `);
    await this.seedProgress();
  }

  private requireDb() {
    if (!this.db) throw new Error("Database has not initialized.");
    return this.db;
  }

  private async seedProgress() {
    const data = await this.loadDataWithoutSeed();
    const merged = mergeWithSeed(data);
    await this.saveData(merged);
  }

  private async loadDataWithoutSeed(): Promise<AppData> {
    const db = this.requireDb();
    const progress = await db.select<Record<string, unknown>[]>("SELECT * FROM lesson_progress");
    const exercises = await db.select<Record<string, unknown>[]>("SELECT * FROM exercise_responses");
    const quizzes = await db.select<Record<string, unknown>[]>("SELECT * FROM quiz_responses");
    const projects = await db.select<Record<string, unknown>[]>("SELECT * FROM final_project WHERE id = $1", [projectId]);
    return {
      lessonProgress: progress.map(rowToProgress),
      exerciseResponses: exercises.map(rowToExercise),
      quizResponses: quizzes.map(rowToQuiz),
      finalProject: projects[0] ? rowToFinalProject(projects[0]) : defaultFinalProject()
    };
  }

  async loadData(): Promise<AppData> {
    return mergeWithSeed(await this.loadDataWithoutSeed());
  }

  async saveData(data: AppData) {
    const db = this.requireDb();
    await db.execute("DELETE FROM lesson_progress");
    await db.execute("DELETE FROM exercise_responses");
    await db.execute("DELETE FROM quiz_responses");
    await db.execute("DELETE FROM final_project");

    for (const item of data.lessonProgress) {
      await db.execute(
        "INSERT INTO lesson_progress (lesson_id, current_step_id, completed_steps, is_completed, updated_at) VALUES ($1, $2, $3, $4, $5)",
        [item.lessonId, item.currentStepId, JSON.stringify(item.completedSteps), item.isCompleted ? 1 : 0, item.updatedAt]
      );
    }
    for (const item of data.exerciseResponses) {
      await db.execute(
        "INSERT INTO exercise_responses (lesson_id, step_id, response, created_at, updated_at) VALUES ($1, $2, $3, $4, $5)",
        [item.lessonId, item.stepId, item.response, item.createdAt, item.updatedAt]
      );
    }
    for (const item of data.quizResponses) {
      await db.execute(
        "INSERT INTO quiz_responses (lesson_id, step_id, selected_answer, is_correct, created_at) VALUES ($1, $2, $3, $4, $5)",
        [item.lessonId, item.stepId, item.selectedAnswer, item.isCorrect ? 1 : 0, item.createdAt]
      );
    }
    await db.execute(
      `INSERT INTO final_project
      (id, original_update, revised_executive_version, recommendation, business_impact, ask, tradeoffs, risks, reflection, rubric, completed_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [
        projectId,
        data.finalProject.originalUpdate,
        data.finalProject.revisedExecutiveVersion,
        data.finalProject.recommendation,
        data.finalProject.businessImpact,
        data.finalProject.ask,
        data.finalProject.tradeoffs,
        data.finalProject.risks,
        data.finalProject.reflection,
        JSON.stringify(data.finalProject.rubric),
        data.finalProject.completedAt,
        data.finalProject.updatedAt
      ]
    );
  }
}

function text(value: unknown) {
  return typeof value === "string" ? value : "";
}

function rowToProgress(row: Record<string, unknown>): LessonProgress {
  return {
    lessonId: text(row.lesson_id),
    currentStepId: text(row.current_step_id),
    completedSteps: Array.isArray(row.completed_steps)
      ? (row.completed_steps as string[])
      : JSON.parse(text(row.completed_steps) || "[]") as string[],
    isCompleted: typeof row.is_completed === "boolean" ? row.is_completed : Number(row.is_completed) === 1,
    updatedAt: text(row.updated_at)
  };
}

function rowToExercise(row: Record<string, unknown>): ExerciseResponse {
  return {
    lessonId: text(row.lesson_id),
    stepId: text(row.step_id),
    response: text(row.response),
    createdAt: text(row.created_at),
    updatedAt: text(row.updated_at)
  };
}

function rowToQuiz(row: Record<string, unknown>): QuizResponse {
  return {
    lessonId: text(row.lesson_id),
    stepId: text(row.step_id),
    selectedAnswer: text(row.selected_answer),
    isCorrect: typeof row.is_correct === "boolean" ? row.is_correct : Number(row.is_correct) === 1,
    createdAt: text(row.created_at)
  };
}

function rowToFinalProject(row: Record<string, unknown>): FinalProject {
  return {
    originalUpdate: text(row.original_update),
    revisedExecutiveVersion: text(row.revised_executive_version),
    recommendation: text(row.recommendation),
    businessImpact: text(row.business_impact),
    ask: text(row.ask),
    tradeoffs: text(row.tradeoffs),
    risks: text(row.risks),
    reflection: text(row.reflection),
    rubric: typeof row.rubric === "object" && row.rubric
      ? row.rubric as FinalProject["rubric"]
      : JSON.parse(text(row.rubric) || JSON.stringify(defaultFinalProject().rubric)),
    completedAt: row.completed_at ? text(row.completed_at) : null,
    updatedAt: text(row.updated_at)
  };
}

export async function createRepository(userId?: string): Promise<Repository> {
  if (userId && firebaseProjectId) {
    const firebaseRepository = new FirebaseRepository(userId);
    await firebaseRepository.init();
    return firebaseRepository;
  }

  if (hasTauriRuntime()) {
    const sqliteRepository = new SqliteRepository();
    try {
      await sqliteRepository.init();
      return sqliteRepository;
    } catch (error) {
      console.error("SQLite startup failed; using browser fallback for this session.", error);
    }
  }

  const browserRepository = new BrowserRepository();
  await browserRepository.init();
  return browserRepository;
}

export function timestamp() {
  return now();
}
