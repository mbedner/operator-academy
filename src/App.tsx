import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { clsx } from "clsx";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import {
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  ExternalLink,
  GraduationCap,
  LayoutDashboard,
  Maximize2,
  PlayCircle,
  LogOut,
  Trophy,
  X
} from "lucide-react";
import { allLessons, curriculumSeed } from "./data/curriculumSeed";
import { createRepository, timestamp } from "./storage";
import { getStoredFirebaseUser, googleClientId, isFirebaseConfigured, isGoogleSignInConfigured, signInWithFirebase, signInWithGoogleCredential, signOutOfFirebase, signUpWithFirebase } from "./firebaseClient";
import type { AppData, ExerciseResponse, FinalProject, Lesson, LessonProgress, LessonStatus, LessonStep, QuizResponse } from "./types";

type Repository = Awaited<ReturnType<typeof createRepository>>;
type Screen = "dashboard" | "unit" | "lesson" | "finalProject" | "progress";
type AuthUser = { id: string; email: string };

const emptyData: AppData = {
  lessonProgress: [],
  exerciseResponses: [],
  quizResponses: [],
  finalProject: {
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
    updatedAt: ""
  }
};

export function App() {
  const [repository, setRepository] = useState<Repository | null>(null);
  const [data, setData] = useState<AppData>(emptyData);
  const [screen, setScreen] = useState<Screen>("dashboard");
  const [selectedLessonId, setSelectedLessonId] = useState(allLessons[0].id);
  const [ready, setReady] = useState(false);
  const [authReady, setAuthReady] = useState(!isFirebaseConfigured);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [startupError, setStartupError] = useState<string | null>(null);
  const [isMainScrolling, setIsMainScrolling] = useState(false);
  const scrollTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured) return;

    let mounted = true;
    getStoredFirebaseUser()
      .then((user) => {
        if (!mounted) return;
        setAuthUser(user);
        setAuthReady(true);
      })
      .catch((error) => {
        console.error(error);
        if (!mounted) return;
        setAuthUser(null);
        setAuthReady(true);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!authReady) return;
    if (isFirebaseConfigured && !authUser) {
      setRepository(null);
      setData(emptyData);
      setReady(true);
      return;
    }

    setReady(false);
    createRepository(authUser?.id)
      .then(async (repo) => {
        setRepository(repo);
        const loaded = await repo.loadData();
        setData(loaded);
        const current = findContinueLesson(loaded);
        setSelectedLessonId(current.id);
        setReady(true);
      })
      .catch((error) => {
        console.error(error);
        setStartupError(error instanceof Error ? error.message : "Unable to open Operator Academy.");
        setReady(true);
      });
  }, [authReady, authUser?.id]);

  async function persist(next: AppData) {
    setData(next);
    await repository?.saveData(next);
  }

  async function signOut() {
    signOutOfFirebase();
    setAuthUser(null);
    setRepository(null);
    setData(emptyData);
    setScreen("dashboard");
  }

  function handleMainScroll() {
    setIsMainScrolling(true);
    if (scrollTimeoutRef.current) {
      window.clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = window.setTimeout(() => {
      setIsMainScrolling(false);
      scrollTimeoutRef.current = null;
    }, 900);
  }

  const metrics = useMemo(() => calculateMetrics(data), [data]);
  const selectedLesson = allLessons.find((lesson) => lesson.id === selectedLessonId) ?? allLessons[0];

  if (!ready) {
    return <div className="loading">Opening Operator Academy</div>;
  }

  if (startupError) {
    return <div className="loading">Startup error: {startupError}</div>;
  }

  if (isFirebaseConfigured && !authUser) {
    return <AuthScreen onAuthenticated={setAuthUser} />;
  }

  return (
    <div className="app-shell">
      <Sidebar
        data={data}
        metrics={metrics}
        selectedLessonId={selectedLesson.id}
        screen={screen}
        setScreen={setScreen}
        authEmail={authUser?.email}
        onSignOut={isFirebaseConfigured ? signOut : undefined}
        selectLesson={(lessonId) => {
          setSelectedLessonId(lessonId);
          setScreen("lesson");
        }}
      />
      <main className={clsx("main-content", isMainScrolling && "is-scrolling")} onScroll={handleMainScroll}>
        {screen === "dashboard" && (
          <CourseDashboard
            data={data}
            metrics={metrics}
            continueLesson={() => {
              const lesson = findContinueLesson(data);
              setSelectedLessonId(lesson.id);
              setScreen(lesson.id === "final-project" ? "finalProject" : "lesson");
            }}
            goUnit={() => setScreen("unit")}
          />
        )}
        {screen === "unit" && <UnitOverview data={data} openLesson={(id) => { setSelectedLessonId(id); setScreen(id === "final-project" ? "finalProject" : "lesson"); }} />}
        {screen === "lesson" && (
          <LessonPlayer
            lesson={selectedLesson}
            data={data}
            persist={persist}
            openFinalProject={() => setScreen("finalProject")}
            onLessonComplete={(lessonId) => {
              const lessonIndex = allLessons.findIndex((item) => item.id === lessonId);
              const nextLesson = allLessons[lessonIndex + 1];
              document.querySelector(".main-content")?.scrollTo({ top: 0 });
              if (!nextLesson) {
                setScreen("progress");
                return;
              }
              setSelectedLessonId(nextLesson.id);
              setScreen(nextLesson.id === "final-project" ? "finalProject" : "lesson");
            }}
          />
        )}
        {screen === "finalProject" && <FinalProjectScreen data={data} persist={persist} />}
        {screen === "progress" && <ProgressDashboard data={data} metrics={metrics} />}
      </main>
      <RightPanel lesson={selectedLesson} data={data} screen={screen} />
    </div>
  );
}

function AuthScreen({ onAuthenticated }: { onAuthenticated: (user: AuthUser) => void }) {
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const googleButtonRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isGoogleSignInConfigured || !googleClientId || !googleButtonRef.current) return;

    const clientId = googleClientId;
    let cancelled = false;
    loadGoogleIdentityScript()
      .then(() => {
        if (cancelled || !googleButtonRef.current || !window.google?.accounts?.id) return;
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response) => {
            setIsSubmitting(true);
            setMessage(null);
            try {
              const user = await signInWithGoogleCredential(response.credential);
              onAuthenticated(user);
            } catch (error) {
              setMessage(error instanceof Error ? error.message : "Unable to sign in with Google.");
            } finally {
              setIsSubmitting(false);
            }
          }
        });
        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: "outline",
          size: "large",
          type: "standard",
          shape: "rectangular",
          text: "continue_with",
          logo_alignment: "left",
          width: googleButtonRef.current.offsetWidth || 396
        });
      })
      .catch(() => setMessage("Unable to load Google sign-in."));

    return () => {
      cancelled = true;
    };
  }, [onAuthenticated]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isFirebaseConfigured) return;

    setIsSubmitting(true);
    setMessage(null);
    try {
      const user = mode === "sign-in"
        ? await signInWithFirebase(email, password)
        : await signUpWithFirebase(email, password);
      onAuthenticated(user);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to authenticate.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-panel">
        <div>
          <div className="eyebrow">Operator Academy</div>
          <h1>Sign in to continue</h1>
          <p>Your curriculum progress, exercise responses, and final project are saved to your account.</p>
        </div>
        <div className="google-auth-block">
          {isGoogleSignInConfigured ? (
            <div ref={googleButtonRef} className="google-button-host" />
          ) : (
            <div className="google-config-note">Add <code>VITE_GOOGLE_CLIENT_ID</code> to enable Google sign-in.</div>
          )}
        </div>
        <div className="auth-divider"><span>or</span></div>
        <form className="auth-form" onSubmit={submit}>
          <label>
            <span>Email</span>
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>
          <label>
            <span>Password</span>
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={6} required />
          </label>
          {message && <p className="auth-message">{message}</p>}
          <button className="primary-button" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Working..." : mode === "sign-in" ? "Sign in" : "Create account"}
          </button>
          <button className="link-button" type="button" onClick={() => { setMode(mode === "sign-in" ? "sign-up" : "sign-in"); setMessage(null); }}>
            {mode === "sign-in" ? "Create a new account" : "I already have an account"}
          </button>
        </form>
      </section>
    </main>
  );
}

function loadGoogleIdentityScript() {
  const scriptId = "google-identity-services";
  const existing = document.getElementById(scriptId) as HTMLScriptElement | null;
  if (existing) {
    return existing.dataset.loaded === "true"
      ? Promise.resolve()
      : new Promise<void>((resolve, reject) => {
        existing.addEventListener("load", () => resolve(), { once: true });
        existing.addEventListener("error", () => reject(new Error("Unable to load Google sign-in.")), { once: true });
      });
  }

  return new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      script.dataset.loaded = "true";
      resolve();
    };
    script.onerror = () => reject(new Error("Unable to load Google sign-in."));
    document.head.appendChild(script);
  });
}

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (options: { client_id: string; callback: (response: { credential: string }) => void }) => void;
          renderButton: (element: HTMLElement, options: Record<string, string | number>) => void;
        };
      };
    };
  }
}

function Sidebar({ data, metrics, selectedLessonId, screen, setScreen, authEmail, onSignOut, selectLesson }: {
  data: AppData;
  metrics: ReturnType<typeof calculateMetrics>;
  selectedLessonId: string;
  screen: Screen;
  setScreen: (screen: Screen) => void;
  authEmail?: string;
  onSignOut?: () => void;
  selectLesson: (lessonId: string) => void;
}) {
  const unit = curriculumSeed.units[0];
  return (
    <aside className="sidebar">
      <div className="brand-block">
        <div className="brand-icon"><GraduationCap size={24} /></div>
        <div>
          <div className="eyebrow">{curriculumSeed.subtitle}</div>
          <h1>{curriculumSeed.title}</h1>
        </div>
      </div>
      <nav className="top-nav">
        <button className={clsx("nav-button", screen === "dashboard" && "active")} onClick={() => setScreen("dashboard")}><LayoutDashboard size={17} /> Course Dashboard</button>
        <button className={clsx("nav-button", screen === "unit" && "active")} onClick={() => setScreen("unit")}><BookOpen size={17} /> Unit Overview</button>
        <button className={clsx("nav-button", screen === "progress" && "active")} onClick={() => setScreen("progress")}><Trophy size={17} /> Progress</button>
      </nav>
      {authEmail && (
        <div className="account-card">
          <span>Signed in</span>
          <strong>{authEmail}</strong>
          {onSignOut && <button className="account-button" onClick={onSignOut}><LogOut size={15} /> Sign out</button>}
        </div>
      )}
      <div className="sidebar-progress">
        <div className="sidebar-progress-copy"><span>Course progress</span><strong>{metrics.courseProgress}%</strong></div>
        <ProgressBar value={metrics.courseProgress} />
      </div>
      <div className="unit-title">
        <span>Unit 1</span>
        <strong>{unit.title}</strong>
      </div>
      <div className="lesson-list">
        {unit.lessons.map((lesson, index) => {
          const status = lessonStatus(data, lesson.id);
          return (
            <button key={lesson.id} className={clsx("lesson-link", selectedLessonId === lesson.id && screen !== "dashboard" && "selected")} onClick={() => selectLesson(lesson.id)}>
              <span className="lesson-number">{index + 1}</span>
              <span className="lesson-link-copy"><strong>{lesson.title}</strong><small>{status}</small></span>
              {status === "Completed" ? <CheckCircle2 size={17} /> : <Circle size={17} />}
            </button>
          );
        })}
      </div>
    </aside>
  );
}

function CourseDashboard({ data, metrics, continueLesson, goUnit }: {
  data: AppData;
  metrics: ReturnType<typeof calculateMetrics>;
  continueLesson: () => void;
  goUnit: () => void;
}) {
  const current = findContinueLesson(data);
  return (
    <div className="page-stack">
      <section className="hero-panel">
        <div>
          <div className="eyebrow">Personal executive academy</div>
          <h2>{curriculumSeed.title}</h2>
          <p>{curriculumSeed.description}</p>
        </div>
        <div className="hero-actions">
          <button className="primary-button" onClick={continueLesson}><PlayCircle size={18} /> Continue</button>
          <button className="secondary-button" onClick={goUnit}><BookOpen size={18} /> View unit</button>
        </div>
      </section>
      <section className="metric-grid">
        <Metric label="Course progress" value={`${metrics.courseProgress}%`} />
        <Metric label="Lessons completed" value={`${metrics.completedLessons}/${allLessons.length}`} />
        <Metric label="Current lesson" value={current.title} compact />
        <Metric label="Time remaining" value={`${metrics.minutesRemaining} min`} />
        <Metric label="Final project" value={data.finalProject.completedAt ? "Complete" : "Open"} />
      </section>
      <section className="course-build-section">
        <div className="course-build-copy">
          <div className="eyebrow">Course outcomes</div>
          <h3>What this course builds</h3>
          <p>You will practice executive-ready communication: leading with recommendations, separating context from decisions, tying design work to business impact, making explicit asks, and communicating tradeoffs.</p>
        </div>
        <div className="continue-card">
          <div>
            <div className="eyebrow">Next lesson</div>
            <h3>{current.title}</h3>
            <p>{current.objective}</p>
          </div>
          <button className="primary-button" onClick={continueLesson}>Resume lesson</button>
        </div>
      </section>
    </div>
  );
}

function UnitOverview({ data, openLesson }: { data: AppData; openLesson: (lessonId: string) => void }) {
  const unit = curriculumSeed.units[0];
  return (
    <div className="page-stack">
      <Header eyebrow="Unit 1" title={unit.title} text={unit.description} />
      <div className="unit-grid">
        {unit.lessons.map((lesson, index) => {
          const progress = getProgress(data, lesson);
          const status = lessonStatus(data, lesson.id);
          return (
            <button key={lesson.id} className="lesson-card" onClick={() => openLesson(lesson.id)}>
              <div className="lesson-card-top"><span>Lesson {index + 1}</span><Badge status={status} /></div>
              <h3>{lesson.title}</h3>
              <p>{lesson.objective}</p>
              <div className="lesson-meta"><span>{lesson.estimatedMinutes} min</span><span>{progress.completedSteps.length}/{lesson.steps.length} steps</span></div>
              <ProgressBar value={Math.round((progress.completedSteps.length / lesson.steps.length) * 100)} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function LessonPlayer({ lesson, data, persist, openFinalProject, onLessonComplete }: {
  lesson: Lesson;
  data: AppData;
  persist: (data: AppData) => Promise<void>;
  openFinalProject: () => void;
  onLessonComplete: (lessonId: string) => void;
}) {
  const progress = getProgress(data, lesson);
  const stepIndex = Math.max(0, lesson.steps.findIndex((step) => step.id === progress.currentStepId));
  const step = lesson.steps[stepIndex] ?? lesson.steps[0];

  async function setProgress(nextStepId: string, completedSteps = progress.completedSteps, isCompleted = progress.isCompleted) {
    const nextProgress: LessonProgress = { lessonId: lesson.id, currentStepId: nextStepId, completedSteps, isCompleted, updatedAt: timestamp() };
    await persist({ ...data, lessonProgress: upsert(data.lessonProgress, nextProgress, (item) => item.lessonId === lesson.id) });
  }

  async function completeCurrentStep() {
    const completed = Array.from(new Set([...progress.completedSteps, step.id]));
    const done = completed.length === lesson.steps.length;
    await setProgress(step.id, completed, done);
    return { completed, done };
  }

  async function go(delta: number) {
    const nextIndex = Math.min(Math.max(stepIndex + delta, 0), lesson.steps.length - 1);
    await setProgress(lesson.steps[nextIndex].id);
  }

  async function completeAndContinue() {
    const { completed } = await completeCurrentStep();
    if (stepIndex < lesson.steps.length - 1) {
      const nextStep = lesson.steps[stepIndex + 1];
      const nextProgress: LessonProgress = {
        lessonId: lesson.id,
        currentStepId: nextStep.id,
        completedSteps: completed,
        isCompleted: completed.length === lesson.steps.length,
        updatedAt: timestamp()
      };
      await persist({ ...data, lessonProgress: upsert(data.lessonProgress, nextProgress, (item) => item.lessonId === lesson.id) });
      document.querySelector(".main-content")?.scrollTo({ top: 0 });
      return;
    }

    onLessonComplete(lesson.id);
  }

  return (
    <div className="lesson-layout">
      <div className="lesson-header">
        <div>
          <div className="eyebrow">Lesson {allLessons.findIndex((item) => item.id === lesson.id) + 1}</div>
          <h2>{lesson.title}</h2>
          <p>{lesson.objective}</p>
        </div>
        <div className="step-count">Step {stepIndex + 1} of {lesson.steps.length}</div>
      </div>
      <ProgressBar value={Math.round((progress.completedSteps.length / lesson.steps.length) * 100)} />
      <div className="step-map" aria-label="Lesson step sequence">
        {lesson.steps.map((item, index) => (
          <button
            key={item.id}
            className={clsx("step-dot", item.id === step.id && "current", progress.completedSteps.includes(item.id) && "done")}
            onClick={() => setProgress(item.id)}
            title={item.title}
          >
            {index + 1}
          </button>
        ))}
      </div>
      <article className={clsx("step-panel", `step-${step.type}`)}>
        <div className="step-type">{step.type.replace(/_/g, " ")}</div>
        <h3>{step.title}</h3>
        <StepBody lesson={lesson} step={step} data={data} persist={persist} openFinalProject={openFinalProject} />
      </article>
      <div className="lesson-controls">
        <button className="secondary-button" disabled={stepIndex === 0} onClick={() => go(-1)}><ChevronLeft size={18} /> Back</button>
        <button className="primary-button" onClick={completeAndContinue}>
          <CheckCircle2 size={18} /> {stepIndex === lesson.steps.length - 1 ? "Complete lesson" : "Complete and continue"}
        </button>
      </div>
    </div>
  );
}

function StepBody({ lesson, step, data, persist, openFinalProject }: {
  lesson: Lesson;
  step: LessonStep;
  data: AppData;
  persist: (data: AppData) => Promise<void>;
  openFinalProject: () => void;
}) {
  if (lesson.id === "final-project" && step.id === "capstone-open-workspace") {
    return <button className="primary-button" onClick={openFinalProject}>Open Final Project</button>;
  }
  if (step.type === "video") {
    return <VideoStep lesson={lesson} step={step} />;
  }
  if (step.type === "quiz") {
    return <QuizStep lesson={lesson} step={step} data={data} persist={persist} />;
  }
  if (["guided_practice", "real_work_application", "reflection", "reading"].includes(step.type)) {
    return <ResponseStep lesson={lesson} step={step} data={data} persist={persist} />;
  }
  return (
    <div className={clsx("prose-block", step.title.toLowerCase().includes("bad") && "bad-example", step.title.toLowerCase().includes("better") && "better-example")}>
      <RichText content={step.content} />
      {step.prompt && <div className="prompt-box"><strong>Prompt</strong><RichText content={step.prompt} /></div>}
    </div>
  );
}

function RichText({ content }: { content: string }) {
  type RichBlock =
    | { type: "p" | "ul"; items: string[] }
    | { type: "ol"; items: Array<{ number: string; text: string }> }
    | { type: "meta"; items: Array<{ label: string; value: string }> };

  const blocks: RichBlock[] = [];
  let current: RichBlock | null = null;

  function flush() {
    if (!current) return;
    if (current.type === "meta" && current.items.length > 0) blocks.push(current);
    if (current.type !== "meta" && current.items.length > 0) blocks.push(current);
    current = null;
  }

  for (const rawLine of content.split("\n")) {
    const line = rawLine.trim();
    if (!line) {
      flush();
      continue;
    }

    const bullet = line.match(/^-\s+(.+)/);
    const numbered = line.match(/^(\d+)\.\s+(.+)/);
    const meta = line.match(/^([A-Z][A-Za-z0-9 #/&()\-]+):\s*(.+)$/);

    if (bullet) {
      if (!current || current.type !== "ul") {
        flush();
        current = { type: "ul", items: [] };
      }
      current.items.push(bullet[1]);
      continue;
    }

    if (numbered) {
      if (!current || current.type !== "ol") {
        flush();
        current = { type: "ol", items: [] };
      }
      (current.items as Array<{ number: string; text: string }>).push({ number: numbered[1], text: numbered[2] });
      continue;
    }

    if (meta && meta[1].length <= 36) {
      if (!current || current.type !== "meta") {
        flush();
        current = { type: "meta", items: [] };
      }
      current.items.push({ label: meta[1], value: meta[2] });
      continue;
    }

    if (!current || current.type !== "p") {
      flush();
      current = { type: "p", items: [] };
    }
    current.items.push(line);
  }
  flush();

  return (
    <div className="rich-text">
      {blocks.map((block, index) => {
        if (block.type === "ul") return <ul key={index}>{block.items.map((item) => <li key={item}>{renderLinkedText(item)}</li>)}</ul>;
        if (block.type === "ol") return <div className="rich-numbered" key={index}>{block.items.map((item) => <div className="rich-numbered-row" key={`${item.number}-${item.text}`}><span>{item.number}.</span><p>{renderLinkedText(item.text)}</p></div>)}</div>;
        if (block.type === "meta") {
          return (
            <dl className="rich-meta" key={index}>
              {block.items.map((item) => (
                <div className="rich-meta-row" key={`${item.label}-${item.value}`}>
                  <dt>{item.label}</dt>
                  <dd>{renderLinkedText(normalizeCalloutValue(item.label, item.value))}</dd>
                </div>
              ))}
            </dl>
          );
        }
        return <p key={index}>{renderLinkedText(block.items.join(" "))}</p>;
      })}
    </div>
  );
}

function normalizeCalloutValue(label: string, value: string) {
  if (label.toUpperCase() === "URL" || value.match(/^https?:\/\//)) return value;
  return value.replace(/^([a-z])/, (letter) => letter.toUpperCase());
}

function renderLinkedText(text: string) {
  const parts = text.split(/(https?:\/\/\S+)/g);
  return parts.map((part, index) => {
    if (!part.match(/^https?:\/\//)) return part;
    const cleanUrl = part.replace(/[),.;]+$/, "");
    const suffix = part.slice(cleanUrl.length);
    return (
      <span key={`${part}-${index}`}>
        <a className="inline-link" href={cleanUrl} target="_blank" rel="noreferrer">{cleanUrl}</a>
        {suffix}
      </span>
    );
  });
}

function VideoStep({ lesson, step }: { lesson: Lesson; step: LessonStep }) {
  const [expanded, setExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const modalIframeRef = useRef<HTMLIFrameElement | null>(null);
  const embedUrl = toEmbedUrl(lesson.video.url);
  const watchUrl = toWatchUrl(lesson.video.url);

  function sendVideoCommand(func: string, args: unknown[] = []) {
    const frame = expanded ? modalIframeRef.current : iframeRef.current;
    frame?.contentWindow?.postMessage(JSON.stringify({ event: "command", func, args }), "*");
  }

  function togglePlayback() {
    const nextPlaying = !isPlaying;
    sendVideoCommand(nextPlaying ? "playVideo" : "pauseVideo");
    setIsPlaying(nextPlaying);
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const tagName = target?.tagName.toLowerCase();
      if (tagName === "input" || tagName === "textarea" || target?.isContentEditable) return;

      if (event.code === "Space") {
        event.preventDefault();
        togglePlayback();
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        sendVideoCommand("seekBy", [-10]);
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        sendVideoCommand("seekBy", [10]);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [expanded, isPlaying]);

  return (
    <div className="video-step">
      <div className="video-frame-wrap">
        <div className="video-frame">
          <iframe
            ref={iframeRef}
            title={lesson.video.title}
            src={embedUrl}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
          />
        </div>
        <div className="video-actions-row">
          <button className="video-expand-button" onClick={() => setExpanded(true)}>
            <Maximize2 size={16} /> Expand video
          </button>
          <span className="video-shortcuts">Space play/pause. Arrow keys skip 10s.</span>
        </div>
      </div>
      <div className="resource-card video-resource">
        <div className="video-source-row">
          <strong>{lesson.video.source}</strong>
          <a className="source-link" href={watchUrl} target="_blank" rel="noreferrer">
            <ExternalLink size={15} /> Open in YouTube
          </a>
        </div>
        <RichText content={step.content} />
        <div className="prompt-box"><strong>Reflection</strong><RichText content={step.prompt ?? ""} /></div>
      </div>
      {expanded && (
        <div className="video-modal" role="dialog" aria-modal="true" aria-label={`${lesson.video.title} expanded video`}>
          <div className="video-modal-topbar">
            <strong>{lesson.video.title}</strong>
            <button className="video-modal-close" onClick={() => setExpanded(false)} aria-label="Close expanded video"><X size={18} /></button>
          </div>
          <div className="video-modal-frame">
            <iframe
              ref={modalIframeRef}
              title={`${lesson.video.title} expanded`}
              src={embedUrl}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
}

function toEmbedUrl(url: string) {
  try {
    const parsed = new URL(url);
    parsed.searchParams.set("controls", "1");
    parsed.searchParams.set("fs", "0");
    parsed.searchParams.set("rel", "0");
    parsed.searchParams.set("modestbranding", "1");
    parsed.searchParams.set("iv_load_policy", "3");
    parsed.searchParams.set("playsinline", "1");
    parsed.searchParams.set("enablejsapi", "1");
    return parsed.toString();
  } catch {
    return url;
  }
}

function toWatchUrl(url: string) {
  const match = url.match(/youtube\.com\/embed\/([^?]+)/);
  return match ? `https://www.youtube.com/watch?v=${match[1]}` : url;
}

function ResponseStep({ lesson, step, data, persist }: { lesson: Lesson; step: LessonStep; data: AppData; persist: (data: AppData) => Promise<void> }) {
  const saved = data.exerciseResponses.find((item) => item.lessonId === lesson.id && item.stepId === step.id)?.response ?? "";
  async function save(response: string) {
    const existing = data.exerciseResponses.find((item) => item.lessonId === lesson.id && item.stepId === step.id);
    const next: ExerciseResponse = { lessonId: lesson.id, stepId: step.id, response, createdAt: existing?.createdAt ?? timestamp(), updatedAt: timestamp() };
    await persist({ ...data, exerciseResponses: upsert(data.exerciseResponses, next, (item) => item.lessonId === lesson.id && item.stepId === step.id) });
  }
  return (
    <div className="response-step">
      <RichText content={step.content} />
      {step.prompt && <div className="prompt-box"><strong>Application</strong><RichText content={step.prompt} /></div>}
      <textarea key={`${lesson.id}-${step.id}`} className="text-area" defaultValue={saved} onBlur={(event) => save(event.target.value)} placeholder="Type your response here." />
      <div className="save-note">Saved when you leave the field.</div>
      {step.sampleAnswer && <details><summary>Show sample answer</summary><RichText content={step.sampleAnswer} /></details>}
    </div>
  );
}

function QuizStep({ lesson, step, data, persist }: { lesson: Lesson; step: LessonStep; data: AppData; persist: (data: AppData) => Promise<void> }) {
  const saved = data.quizResponses.find((item) => item.lessonId === lesson.id && item.stepId === step.id);
  async function answer(option: string) {
    const next: QuizResponse = { lessonId: lesson.id, stepId: step.id, selectedAnswer: option, isCorrect: option === step.correctAnswer, createdAt: timestamp() };
    await persist({ ...data, quizResponses: upsert(data.quizResponses, next, (item) => item.lessonId === lesson.id && item.stepId === step.id) });
  }
  return (
    <div className="quiz-step">
      <RichText content={step.content} />
      <div className="quiz-options">
        {step.options?.map((option) => (
          <button key={option} className={clsx("quiz-option", saved?.selectedAnswer === option && (saved.isCorrect ? "correct" : "incorrect"))} onClick={() => answer(option)}>{option}</button>
        ))}
      </div>
      {saved && <div className={clsx("answer-result", saved.isCorrect ? "correct-text" : "incorrect-text")}>{saved.isCorrect ? "Correct." : `Incorrect. Correct answer: ${step.correctAnswer}`}</div>}
    </div>
  );
}

function FinalProjectScreen({ data, persist }: { data: AppData; persist: (data: AppData) => Promise<void> }) {
  const project = data.finalProject;
  async function update(patch: Partial<FinalProject>) {
    await persist({ ...data, finalProject: { ...project, ...patch, updatedAt: timestamp() } });
  }
  async function updateRubric(key: keyof FinalProject["rubric"], value: number) {
    await update({ rubric: { ...project.rubric, [key]: value } });
  }
  const rubricLabels: Record<keyof FinalProject["rubric"], string> = {
    recommendationClarity: "Recommendation clarity",
    businessImpact: "Business impact",
    conciseness: "Conciseness",
    askClarity: "Ask clarity",
    tradeoffQuality: "Tradeoff quality",
    executiveReadiness: "Executive readiness"
  };
  return (
    <div className="page-stack">
      <Header eyebrow="Final Project" title="Rewrite a Real Executive Update" text="Paste a real update, memo, Slack message, or presentation summary. Rewrite it using the full unit: recommendation, impact, ask, tradeoffs, risks, and reflection." />
      <section className="project-grid">
        <ProjectField label="Original update" value={project.originalUpdate} onChange={(value) => update({ originalUpdate: value })} />
        <ProjectField label="Revised executive version" value={project.revisedExecutiveVersion} onChange={(value) => update({ revisedExecutiveVersion: value })} />
        <ProjectField label="Recommendation" value={project.recommendation} onChange={(value) => update({ recommendation: value })} />
        <ProjectField label="Business impact" value={project.businessImpact} onChange={(value) => update({ businessImpact: value })} />
        <ProjectField label="Ask" value={project.ask} onChange={(value) => update({ ask: value })} />
        <ProjectField label="Tradeoffs" value={project.tradeoffs} onChange={(value) => update({ tradeoffs: value })} />
        <ProjectField label="Risks" value={project.risks} onChange={(value) => update({ risks: value })} />
        <ProjectField label="Reflection" value={project.reflection} onChange={(value) => update({ reflection: value })} />
      </section>
      <section className="panel">
        <h3>Rubric</h3>
        <div className="rubric-grid">
          {(Object.keys(project.rubric) as Array<keyof FinalProject["rubric"]>).map((key) => (
            <label key={key}>
              <span>{rubricLabels[key]}: {project.rubric[key]}</span>
              <input type="range" min={1} max={5} value={project.rubric[key]} onChange={(event) => updateRubric(key, Number(event.target.value))} />
            </label>
          ))}
        </div>
        <button className="primary-button" onClick={() => update({ completedAt: timestamp() })}><CheckCircle2 size={18} /> Mark final project complete</button>
      </section>
    </div>
  );
}

function ProgressDashboard({ data, metrics }: { data: AppData; metrics: ReturnType<typeof calculateMetrics> }) {
  const chartData = allLessons.map((lesson, index) => ({
    name: `L${index + 1}`,
    steps: getProgress(data, lesson).completedSteps.length,
    quiz: data.quizResponses.find((item) => item.lessonId === lesson.id)?.isCorrect ? 1 : 0
  }));
  return (
    <div className="page-stack">
      <Header eyebrow="Progress" title="Course Progress Dashboard" text="A simple operating view of lesson completion, quiz results, exercise responses, and final project status." />
      <section className="metric-grid"><Metric label="Course progress" value={`${metrics.courseProgress}%`} /><Metric label="Exercises saved" value={`${data.exerciseResponses.length}`} /><Metric label="Quiz correct" value={`${metrics.correctQuizzes}/${data.quizResponses.length}`} /><Metric label="Final project" value={data.finalProject.completedAt ? "Complete" : "Open"} /></section>
      <section className="panel chart-panel"><ResponsiveContainer><AreaChart data={chartData}><CartesianGrid stroke="#d8ddd7" strokeDasharray="4 4" /><XAxis dataKey="name" /><YAxis allowDecimals={false} /><Tooltip /><Area dataKey="steps" name="Completed steps" stroke="#225d55" fill="#225d55" fillOpacity={0.18} /><Area dataKey="quiz" name="Correct quiz" stroke="#9a6a2f" fill="#9a6a2f" fillOpacity={0.18} /></AreaChart></ResponsiveContainer></section>
    </div>
  );
}

function RightPanel({ lesson, data, screen }: { lesson: Lesson; data: AppData; screen: Screen }) {
  const progress = getProgress(data, lesson);
  const lessonContext = screen === "lesson" || screen === "finalProject";
  return (
    <aside className="right-panel">
      {!lessonContext && (
        <div className="panel compact orientation-card">
          <div className="eyebrow">Course orientation</div>
          <h3>Use the left rail to choose a lesson.</h3>
          <p>The lesson workspace will show one step at a time, while this panel switches to reading, video, and checklist details.</p>
        </div>
      )}
      {lessonContext && (
        <>
          <div className="panel compact"><div className="eyebrow">Lesson checklist</div>{lesson.steps.map((step) => <div key={step.id} className="check-row">{progress.completedSteps.includes(step.id) ? <CheckCircle2 size={16} /> : <Circle size={16} />}<span>{step.title}</span></div>)}</div>
          <div className="panel compact reading-card"><div className="eyebrow">Reading assignment</div><h3>{lesson.bookConnection.bookTitle}</h3><p>{lesson.bookConnection.assignedConcept}</p><small>{lesson.bookConnection.author}</small></div>
          <div className="panel compact video-card"><div className="eyebrow">Video</div><h3>{lesson.video.title}</h3><p>{lesson.video.whyRelevant}</p><small>{lesson.video.source}</small></div>
          <div className="panel compact time-card"><div className="eyebrow">Estimated time</div><h3>{lesson.estimatedMinutes} minutes</h3><p>{progress.isCompleted ? "Completed" : lessonStatus(data, lesson.id)}</p></div>
        </>
      )}
    </aside>
  );
}

function ProjectField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="project-field"><span>{label}</span><textarea defaultValue={value} onBlur={(event) => onChange(event.target.value)} placeholder="Type here. Saved when you leave the field." /></label>;
}

function Header({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return <section className="page-header"><div className="eyebrow">{eyebrow}</div><h2>{title}</h2><p>{text}</p></section>;
}

function Metric({ label, value, compact = false }: { label: string; value: string; compact?: boolean }) {
  return <div className="metric"><span>{label}</span><strong className={compact ? "compact-value" : ""}>{value}</strong></div>;
}

function Badge({ status }: { status: LessonStatus }) {
  return <span className={clsx("badge", status.toLowerCase().replace(/ /g, "-"))}>{status}</span>;
}

function ProgressBar({ value }: { value: number }) {
  return <div className="progress-track"><div style={{ width: `${value}%` }} /></div>;
}

function getProgress(data: AppData, lesson: Lesson) {
  return data.lessonProgress.find((item) => item.lessonId === lesson.id) ?? { lessonId: lesson.id, currentStepId: lesson.steps[0].id, completedSteps: [], isCompleted: false, updatedAt: "" };
}

function lessonStatus(data: AppData, lessonId: string): LessonStatus {
  const progress = data.lessonProgress.find((item) => item.lessonId === lessonId);
  if (progress?.isCompleted) return "Completed";
  if (progress && progress.completedSteps.length > 0) return "In Progress";
  return "Not Started";
}

function calculateMetrics(data: AppData) {
  const totalSteps = allLessons.reduce((sum, lesson) => sum + lesson.steps.length, 0);
  const completedSteps = allLessons.reduce((sum, lesson) => sum + getProgress(data, lesson).completedSteps.length, 0);
  const completedLessons = allLessons.filter((lesson) => getProgress(data, lesson).isCompleted).length;
  const minutesRemaining = allLessons.filter((lesson) => !getProgress(data, lesson).isCompleted).reduce((sum, lesson) => sum + lesson.estimatedMinutes, 0);
  const correctQuizzes = data.quizResponses.filter((quiz) => quiz.isCorrect).length;
  return { courseProgress: Math.round((completedSteps / totalSteps) * 100), completedLessons, minutesRemaining, correctQuizzes };
}

function findContinueLesson(data: AppData) {
  return allLessons.find((lesson) => !getProgress(data, lesson).isCompleted) ?? allLessons[allLessons.length - 1];
}

function upsert<T>(items: T[], next: T, match: (item: T) => boolean) {
  return items.some(match) ? items.map((item) => (match(item) ? next : item)) : [...items, next];
}
