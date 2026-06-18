import type { Course, Lesson, LessonStep } from "../types";

type LessonSeed = {
  id: string;
  title: string;
  objective: string;
  estimatedMinutes: number;
  bookTitle: string;
  author: string;
  assignedConcept: string;
  readingPrompt: string;
  applicationPrompt: string;
  videoTitle: string;
  videoSource: string;
  videoUrl: string;
  whyRelevant: string;
  videoReflection: string;
  concept: string;
  badExample: string;
  betterExample: string;
  whyBetter: string;
  guidedPrompt: string;
  sampleAnswer: string;
  quizQuestion: string;
  quizOptions: string[];
  correctAnswer: string;
  realWork: string;
  reflection: string;
  checkpoint: string;
  stepOverrides?: LessonStep[];
};

function steps(seed: LessonSeed): LessonStep[] {
  if (seed.stepOverrides) return seed.stepOverrides;

  return [
    {
      id: `${seed.id}-overview`,
      type: "overview",
      title: "Overview",
      content: seed.objective,
      completionRequired: false
    },
    {
      id: `${seed.id}-reading`,
      type: "reading",
      title: `Reading: ${seed.bookTitle}`,
      content: seed.readingPrompt,
      prompt: seed.applicationPrompt,
      completionRequired: true
    },
    {
      id: `${seed.id}-video`,
      type: "video",
      title: seed.videoTitle,
      content: seed.whyRelevant,
      prompt: seed.videoReflection,
      completionRequired: true
    },
    {
      id: `${seed.id}-concept`,
      type: "concept",
      title: "Concept Explanation",
      content: seed.concept,
      completionRequired: true
    },
    {
      id: `${seed.id}-bad-example`,
      type: "example",
      title: "Bad Example",
      content: seed.badExample,
      completionRequired: true
    },
    {
      id: `${seed.id}-better-example`,
      type: "example",
      title: "Better Example",
      content: seed.betterExample,
      completionRequired: true
    },
    {
      id: `${seed.id}-why-better`,
      type: "example",
      title: "Why the Better Example Works",
      content: seed.whyBetter,
      completionRequired: true
    },
    {
      id: `${seed.id}-guided-practice`,
      type: "guided_practice",
      title: "Guided Practice",
      content: seed.guidedPrompt,
      sampleAnswer: seed.sampleAnswer,
      completionRequired: true
    },
    {
      id: `${seed.id}-quiz`,
      type: "quiz",
      title: "Mini Quiz",
      content: seed.quizQuestion,
      options: seed.quizOptions,
      correctAnswer: seed.correctAnswer,
      completionRequired: true
    },
    {
      id: `${seed.id}-real-work`,
      type: "real_work_application",
      title: "Real-Work Application",
      content: seed.realWork,
      completionRequired: true
    },
    {
      id: `${seed.id}-reflection`,
      type: "reflection",
      title: "Reflection",
      content: seed.reflection,
      completionRequired: true
    },
    {
      id: `${seed.id}-checkpoint`,
      type: "checkpoint",
      title: "Completion Checkpoint",
      content: seed.checkpoint,
      completionRequired: true
    }
  ];
}

function lesson(seed: LessonSeed): Lesson {
  return {
    id: seed.id,
    title: seed.title,
    objective: seed.objective,
    estimatedMinutes: seed.estimatedMinutes,
    bookConnection: {
      bookTitle: seed.bookTitle,
      author: seed.author,
      assignedConcept: seed.assignedConcept,
      readingPrompt: seed.readingPrompt,
      applicationPrompt: seed.applicationPrompt
    },
    video: {
      title: seed.videoTitle,
      source: seed.videoSource,
      url: seed.videoUrl,
      whyRelevant: seed.whyRelevant,
      reflectionPrompt: seed.videoReflection
    },
    steps: steps(seed)
  };
}

export const curriculumSeed: Course = {
  id: "executive-communication-foundations",
  title: "Executive Communication Foundations for Design Leaders",
  subtitle: "Course 1",
  description:
    "A self-paced executive learning program for communicating clearly, strategically, and credibly with senior leaders.",
  audience: "Aspiring senior design leaders",
  estimatedHours: 5,
  units: [
    {
      id: "unit-1",
      title: "Communicating Like an Executive",
      description:
        "Learn to put recommendations, business impact, asks, and tradeoffs into a decision-ready structure.",
      lessons: [
        lesson({
          id: "lead-with-the-point",
          title: "Lead With the Point",
          objective: "Learn to communicate recommendation-first instead of context-first.",
          estimatedMinutes: 85,
          bookTitle: "Made to Stick",
          author: "Chip Heath and Dan Heath",
          assignedConcept: "Simple: finding the core of the message",
          readingPrompt:
            "Read the Introduction and Chapter 1: Simple. Focus on how the authors distinguish simple from simplistic, and how strong communicators strip away everything that does not serve the core idea.",
          applicationPrompt:
            "Apply the chapter by identifying the core recommendation in a product update before writing any background, evidence, or caveats.",
          videoTitle: "Think Fast, Talk Smart: Communication Techniques",
          videoSource: "Stanford Graduate School of Business",
          videoUrl: "https://www.youtube.com/embed/HAnw168huqA",
          whyRelevant:
            "A strong executive communication talk makes the structure visible: main point, stakes, evidence, tradeoffs, and ask. Use the video to observe how much context is included before the speaker establishes the point.",
          videoReflection:
            "While watching, note how quickly the speaker establishes the main point, when evidence is introduced, how tradeoffs are handled, and whether the message would be easy for someone else to repeat.",
          concept:
            "Recommendation-first communication is not a writing trick. It is a leadership behavior. At senior levels, communication is evaluated by whether it helps people make better decisions with less confusion. A senior design leader is expected to reduce ambiguity, not transfer it to the room. Leading with the point means you open with the recommendation, decision, or conclusion the audience should orient around. You then explain why it matters, what evidence supports it, what risks or tradeoffs exist, and what you need from the audience. This is the opposite of discovery-order communication, where you narrate how you arrived at the answer. Discovery order can feel responsible because it shows the work. Decision order is usually more valuable because it helps the audience act.",
          badExample:
            "We have been looking at onboarding over the last few weeks. The team reviewed analytics, talked to support, and looked at some session recordings. There are a few areas where users seem confused, especially before activation.",
          betterExample:
            "I recommend prioritizing onboarding improvements next because too many new users are dropping before activation. This is likely affecting retention and paid conversion.",
          whyBetter:
            "The better version leads with the recommendation, names the customer problem, connects it to business impact, and creates a decision-oriented conversation. It does not hide uncertainty, but it also does not force executives to assemble the point themselves.",
          guidedPrompt:
            "Rewrite this context-first update: We have been reviewing checkout feedback and noticed that customers mention confusion around shipping costs. The team thinks there may be an opportunity to improve the checkout flow.",
          sampleAnswer:
            "I recommend improving shipping cost clarity in checkout because confusion at this point may be increasing abandonment and reducing conversion.",
          quizQuestion: "Which opening is most executive-ready?",
          quizOptions: [
            "A. We have been reviewing checkout data.",
            "B. There are several checkout issues we should discuss.",
            "C. I recommend prioritizing checkout clarity because it may be reducing conversion."
          ],
          correctAnswer: "C. I recommend prioritizing checkout clarity because it may be reducing conversion.",
          realWork:
            "Paste a recent work update and rewrite it so the recommendation appears in the first two sentences.",
          reflection: "Where do you tend to over-explain before making the point?",
          checkpoint: "Complete both guided rewrites, the video notes, knowledge check, real-work rewrite, reflection, and senior design leader lens notes.",
          stepOverrides: [
            {
              id: "lead-with-the-point-overview",
              type: "overview",
              title: "Overview",
              content: `This lesson teaches one of the most important shifts from manager communication to executive communication: lead with the point. In product organizations, people often communicate in the order they discovered information. They begin with research, then analysis, then constraints, then team discussion, and finally the recommendation. That structure is natural because it mirrors the work. It is also often the wrong structure for executives.

Executives are rarely asking, "Can you show me every step of your thinking?" They are usually asking, "What decision needs to be made, why does it matter, and what are the consequences?" A senior design leader has to communicate in that decision order. The point comes first. The evidence follows. The caveats are named clearly. The ask is explicit.

This matters because executive attention is scarce. Senior leaders are moving across company strategy, capital allocation, organizational design, customer risk, market pressure, hiring, board communication, and cross-functional tradeoffs. If you make them hunt for your recommendation, you increase cognitive load and reduce confidence in your judgment. If you open with the recommendation and frame the stakes clearly, you create a better conversation.

In this lesson, you will learn how to identify the core point, state it in the first two sentences, connect it to business impact, and then layer in context without burying the recommendation. You will practice rewriting product updates, diagnosing weak openings, and applying the skill to a real communication from your work.` ,
              completionRequired: false
            },
            {
              id: "lead-with-the-point-objectives",
              type: "learning_objectives",
              title: "Learning Objectives",
              content: `By the end of this lesson, you should be able to:

- Identify the core recommendation in a product update before writing supporting context.
- Rewrite a context-first message into a recommendation-first message.
- Distinguish between discovery order and decision order.
- Explain why recommendation-first communication increases executive confidence.
- Connect a product recommendation to a business consequence without overstating certainty.
- Use a reusable opening structure: recommendation, impact, risk, ask, context.
- Diagnose when you are over-explaining because you feel uncertain rather than because the audience needs the information.

These objectives are measurable. If you can take a messy update and produce a first sentence that makes the recommendation, stakes, and decision clear, you are practicing the communication behavior expected of senior design leaders.` ,
              completionRequired: true
            },
            {
              id: "lead-with-the-point-why-this-matters",
              type: "why_this_matters",
              title: "Why This Matters: Manager, Director, Senior Leader Mindset",
              content: `A manager often communicates to show execution awareness. The manager mindset is: "Here is what happened, here is what the team found, here is what we are doing next." This is useful inside a team because it creates shared context and shows operational control.

A director communicates to align multiple teams. The director mindset is: "Here is the pattern across teams, here are the dependencies, here are the risks, and here is where we need alignment." This is more strategic, but it can still become context-heavy if the recommendation is delayed.

A senior design leader communicates to make judgment visible. The senior design leadership mindset is: "Here is what I recommend, here is why it matters to the business, here is the tradeoff, here is the risk, and here is the decision or support needed." A senior design leader is not merely reporting status. A senior design leader is shaping decisions.

The difference is not seniority theater. It changes how people experience you. When you lead with background, executives may wonder whether you know what matters. When you lead with the point, they can immediately evaluate the recommendation, test the assumptions, and engage at the right level. They may disagree, but disagreement is productive because the decision is visible.

Common mistake: Design leaders sometimes hide the recommendation because they want to appear thoughtful, inclusive, or data-driven. They build toward the point slowly. That can work in a workshop. It usually fails in an executive setting. Executives do not need suspense. They need orientation.` ,
              completionRequired: true
            },
            {
              id: "lead-with-the-point-reading",
              type: "reading",
              title: "Reading Assignment: Made to Stick",
              content: `Book: Made to Stick
Author: Chip Heath and Dan Heath
Assigned Reading: Introduction and Chapter 1: Simple

Why this chapter matters: Senior design leaders are expected to reduce ambiguity. The idea of "Simple" is not about dumbing down a message. It is about finding the core. For executive communication, the core is usually the recommendation or decision. If the listener remembers only one thing, what should it be?

What to look for while reading:
- How the authors distinguish simple from simplistic.
- How memorable ideas are stripped to their essential meaning.
- How communicators choose what to leave out.
- Why a core message must be useful enough to guide action.
- How simplicity helps others repeat the message accurately.

How it applies to senior design leadership: roadmap updates, launch decisions, product and design strategy, executive escalations, and tradeoff discussions all require compression. A senior design leader must often turn a messy body of evidence into a clear recommendation. The reading should help you ask: What is the core message here? What can be removed without weakening the decision? What must be retained because it affects judgment?` ,
              prompt: "After reading, write one sentence that explains the difference between simple and simplistic in executive communication.",
              completionRequired: true
            },
            {
              id: "lead-with-the-point-core-concept",
              type: "concept",
              title: "Core Concept: Decision Order Beats Discovery Order",
              content: `Most design work happens in discovery order. You notice a problem, gather data, talk to customers, analyze constraints, debate options, and arrive at a recommendation. That order is appropriate for doing the work. It is usually not the best order for communicating the work upward.

Discovery-order communication sounds like this: "We started looking at activation because support flagged several tickets. Then analytics showed a drop-off. Then design reviewed session recordings. Then engineering raised some constraints. We think onboarding may need attention." This is not wrong, but it asks the executive to wait for the point. It also leaves room for the listener to form a different point before you arrive at yours.

Decision-order communication sounds like this: "I recommend prioritizing onboarding improvements next because activation drop-off is likely hurting retention and paid conversion. The evidence is support volume, analytics drop-off before activation, and session recordings showing confusion in setup." This version gives the executive a mental handle. Now the listener knows what to evaluate.

Leading with the point does not mean being simplistic, arrogant, or prematurely certain. You can still express uncertainty. In fact, strong executive communication often uses calibrated language: "I recommend," "The risk is," "The current evidence suggests," "The tradeoff is," "The decision needed is." These phrases show judgment while preserving credibility.

A senior design leader must also understand the organizational implication. When your message is unclear, ambiguity spreads. Engineering may interpret the priority one way, Sales another, Marketing another, and the CEO another. Clear recommendations reduce downstream misalignment. They also make accountability visible. If you recommend a path, you are showing that you understand the decision and are willing to own the reasoning.

The key discipline is to separate the work you did from the message the audience needs. The executive does not need every detail at the beginning. They need the conclusion, why it matters, the decision or support required, and then the right amount of evidence.` ,
              completionRequired: true
            },
            {
              id: "lead-with-the-point-examples",
              type: "example",
              title: "Examples: Weak and Strong Openings",
              content: `Scenario 1: Activation issue
Bad: "We have been looking at onboarding over the last few weeks. The team reviewed analytics, talked to support, and looked at some session recordings. There are a few areas where users seem confused, especially before activation."
Good: "I recommend prioritizing onboarding improvements next because too many new users are dropping before activation. This is likely affecting retention and paid conversion."
Why it works: The good version names the recommendation, customer behavior, and business consequence. It gives the executive an immediate decision frame.

Scenario 2: Delayed launch
Bad: "Engineering has been working through some issues with the reporting API, and design has a few unresolved questions about export settings. We may need to revisit the launch plan."
Good: "I recommend moving the reporting launch by two weeks because unresolved API and export decisions create a quality risk for enterprise customers."
Why it works: The good version does not hide the delay behind context. It states the recommendation and the reason in one sentence.

Scenario 3: Roadmap tradeoff
Bad: "There are a lot of requests from Sales for admin controls, and Customer Success has also been asking about onboarding improvements. We need to discuss what should come first."
Good: "I recommend prioritizing onboarding improvements before admin controls because activation is the larger near-term retention risk, while admin controls mainly affect expansion conversations later in the quarter."
Why it works: The good version compares options and explains prioritization logic. It sounds like a leader making a choice, not a team listing demands.

Scenario 4: Executive escalation
Bad: "We are seeing some cross-functional alignment issues around the launch, especially between Product, Marketing, and Sales."
Good: "I need alignment this week on launch success criteria because Product, Marketing, and Sales are currently optimizing for different outcomes."
Why it works: The good version turns a vague issue into a specific ask.` ,
              completionRequired: true
            },
            {
              id: "lead-with-the-point-framework",
              type: "framework",
              title: "Framework: Recommendation, Impact, Risk, Ask, Context",
              content: `Use this framework when writing or speaking to executives:

1. Recommendation: What do you think should happen?
Example: "I recommend prioritizing onboarding improvements next."

2. Impact: Why does it matter to the business?
Example: "Activation drop-off is likely reducing retention and paid conversion."

3. Risk: What uncertainty or downside should leaders understand?
Example: "The risk is that we delay admin controls requested by Sales."

4. Ask: What do you need from the audience?
Example: "I need agreement today on whether onboarding should replace admin controls as the next roadmap priority."

5. Context: What evidence is necessary to evaluate the recommendation?
Example: "The evidence is a 14 percent drop before setup completion, support tickets mentioning confusion, and session recordings showing users missing required configuration steps."

The order matters. If you start with context, the audience must infer the recommendation. If you start with the recommendation, the context becomes easier to process. The framework is not a script you must use every time. It is a thinking tool. Before any executive update, ask whether each part is visible. If the recommendation is missing, the message will feel like a status report. If impact is missing, the message will feel tactical. If risk is missing, it may sound naive. If the ask is missing, the discussion may drift. If context is missing, the recommendation may feel unsupported.` ,
              completionRequired: true
            },
            {
              id: "lead-with-the-point-guided-1",
              type: "guided_practice",
              title: "Guided Exercise #1: Rewrite the Opening",
              content: `Rewrite this context-first update into a recommendation-first update:

"We have been reviewing checkout feedback and noticed that customers mention confusion around shipping costs. The team thinks there may be an opportunity to improve the checkout flow. Analytics also show some drop-off near the shipping step, although we have not fully isolated the cause yet."

Your rewrite should include:
- A recommendation.
- A business impact.
- Calibrated uncertainty.
- No more than two sentences.` ,
              sampleAnswer: "I recommend improving shipping cost clarity in checkout because confusion at that step may be increasing abandonment and reducing conversion. The evidence is customer feedback and drop-off near the shipping step, though we still need to isolate the exact cause.",
              completionRequired: true
            },
            {
              id: "lead-with-the-point-guided-2",
              type: "guided_practice",
              title: "Guided Exercise #2: Choose the Core Message",
              content: `Read the scenario and choose the core message before writing the update.

Scenario: The mobile team is behind on a dependency for a personalization experiment. Marketing wants the experiment live before a campaign. Analytics instrumentation is also not ready. The team can either delay the experiment, launch with weaker measurement, or reduce scope.

First, identify the core recommendation. Then write a two-sentence executive opening that includes the recommendation, impact, risk, and ask.` ,
              sampleAnswer: "I recommend delaying the personalization experiment by two weeks because launching without mobile readiness and analytics instrumentation would create execution and measurement risk. I need agreement on whether we should protect learning quality or reduce scope to meet the campaign date.",
              completionRequired: true
            },
            {
              id: "lead-with-the-point-video",
              type: "video",
              title: "Video Assignment: Executive Communication Structure",
              content: `Video Title: Think Fast, Talk Smart: Communication Techniques
Source: Stanford Graduate School of Business
URL: https://www.youtube.com/watch?v=HAnw168huqA

Why this video matters: Strong executive communicators make the listener feel oriented quickly. They establish the main point, create a structure, use evidence selectively, and return to the implication. The goal is not to copy the speaker style. The goal is to observe structure.

What to observe while watching:
- How quickly does the speaker establish the main point?
- How much context appears before the main point?
- When is evidence introduced?
- How does the speaker handle nuance without losing clarity?
- Which sentences would be easy for another executive to repeat?
- Where do you see recommendation, impact, risk, ask, or context?

After watching, write three observations you can apply to your next executive-facing communication.` ,
              prompt: "Write three observations from the video and one behavior you will try in your next meeting.",
              completionRequired: true
            },
            {
              id: "lead-with-the-point-knowledge-check",
              type: "quiz",
              title: "Knowledge Check",
              content: "Which opening is most executive-ready?",
              options: [
                "A. We have been reviewing checkout data and have several findings to discuss.",
                "B. There are several checkout issues that might be worth looking at soon.",
                "C. I recommend prioritizing checkout clarity because confusion at the shipping step may be reducing conversion."
              ],
              correctAnswer: "C. I recommend prioritizing checkout clarity because confusion at the shipping step may be reducing conversion.",
              completionRequired: true
            },
            {
              id: "lead-with-the-point-real-work",
              type: "real_work_application",
              title: "Work Assignment: Rewrite a Real Update",
              content: `Choose a real message from your work. This could be a Slack update, roadmap note, project status, customer escalation, launch update, or meeting opening. Paste the original message. Then rewrite it so the recommendation appears in the first two sentences.

Use this checklist:
- Is the recommendation visible immediately?
- Is the business impact clear?
- Is uncertainty calibrated rather than hidden?
- Is the ask explicit if a decision or support is needed?
- Is context limited to what helps the audience evaluate the recommendation?

Do not optimize for sounding impressive. Optimize for making the decision easier.` ,
              completionRequired: true
            },
            {
              id: "lead-with-the-point-reflection",
              type: "reflection",
              title: "Reflection",
              content: `Reflect on your default communication pattern.

Prompts:
- Where do you tend to over-explain before making the point?
- What are you trying to protect yourself from when you lead with context?
- How might your communication change if you trusted the recommendation enough to state it first?
- What kind of context is genuinely useful to your executives?
- What context mainly demonstrates that you did the work?

This reflection matters because communication habits are often emotional habits. People bury the point when they fear being challenged, when they are unsure of their authority, or when they want the evidence to speak for them. senior leadership communication requires a different posture: make the judgment visible, then invite pressure-testing.` ,
              completionRequired: true
            },
            {
              id: "lead-with-the-point-vp-lens",
              type: "vp_lens",
              title: "Design Leadership Lens",
              content: `A senior design leader would not treat this as a writing exercise. They would treat it as a leadership operating system.

When a senior design leader leads with the point, they are doing several things at once. They are clarifying the decision. They are signaling ownership. They are reducing cognitive load for the CEO and executive team. They are helping cross-functional leaders repeat the same message. They are making tradeoffs discussable. They are creating a record of judgment.

A weaker design leader may think, "I need to show all the analysis so people trust me." A stronger design leader thinks, "I need to make the recommendation clear enough that the executive team can evaluate it quickly and pressure-test the assumptions." The difference is confidence plus service. You are not simplifying for yourself. You are simplifying for the organization.

In real executive settings, leading with the point also changes meeting dynamics. If you open with context, the room may debate details before agreeing on the decision. If you open with the recommendation, the room can ask sharper questions: Is this the right priority? Is the business impact credible? What tradeoff are we accepting? What risk are we ignoring? What decision is needed today?

That is the standard for senior design leader communication: not more words, better orientation.` ,
              completionRequired: true
            },
            {
              id: "lead-with-the-point-checkpoint",
              type: "checkpoint",
              title: "Completion Checkpoint",
              content: `You have completed the lesson when you have:

- Read the assigned Made to Stick section and identified how simplicity applies to executive communication.
- Completed both guided exercises.
- Watched the video and captured observations.
- Answered the knowledge check.
- Rewritten a real work update with the recommendation in the first two sentences.
- Reflected on where you over-explain.
- Written a senior design leader lens note about how this changes your leadership behavior.

Before moving on, write one sentence you will use as a personal rule for the next week. Example: "I will state the recommendation before I explain the background."` ,
              completionRequired: true
            }
          ]
        }),
        lesson({
          id: "separate-context-from-recommendation",
          title: "Separate Context From Recommendation",
          objective: "Learn to separate background information from the decision or recommendation.",
          estimatedMinutes: 85,
          bookTitle: "Made to Stick",
          author: "Chip Heath and Dan Heath",
          assignedConcept: "Simple and Concrete: core messages that become actionable",
          readingPrompt:
            "Read Chapter 1: Simple and Chapter 3: Concrete. Focus on how strong communicators identify the core message and make it specific enough for others to act on.",
          applicationPrompt:
            "Identify the core recommendation hidden inside a recent roadmap discussion, project update, critique summary, stakeholder message, or strategy document.",
          videoTitle: "How to Speak",
          videoSource: "MIT OpenCourseWare / Patrick Winston",
          videoUrl: "https://www.youtube.com/embed/Unzc731iCUY",
          whyRelevant:
            "This talk is useful because it shows how structure, repetition, and selective detail help an audience follow a complex message without being overwhelmed.",
          videoReflection:
            "Observe how quickly the speaker establishes the main point, how much supporting detail appears, what details are omitted, and how often the core message is reinforced.",
          concept:
            "Context is not the point. Context exists to help the audience understand, evaluate, and act on the recommendation. When context competes with the recommendation, senior leaders must do unnecessary work before they can make a decision.",
          badExample:
            "Since engineering still has concerns about API reliability and Design is not finished with the search flow, we may need to reconsider launch timing.",
          betterExample:
            "I recommend delaying the search launch by two weeks because unresolved API and design risks threaten launch quality.",
          whyBetter:
            "The improved version separates the recommendation from the context. The decision appears first; the supporting detail explains why the decision is necessary.",
          guidedPrompt:
            "Rewrite this update using recommendation, impact, ask, and context: Since engineering still has concerns about API reliability and Design is not finished with the search flow, we may need to reconsider launch timing.",
          sampleAnswer:
            "Recommendation: Delay launch by two weeks. Impact: Reduces delivery and customer experience risk. Ask: Approve the revised launch date. Context: API reliability and design issues remain unresolved.",
          quizQuestion: "What is the purpose of context?",
          quizOptions: ["A. Demonstrate effort", "B. Prevent criticism", "C. Support better decisions"],
          correctAnswer: "C. Support better decisions",
          realWork:
            "Choose one executive-facing communication. Create the original version and a recommendation-first rewrite, then identify what context you removed and what context remained.",
          reflection: "Which type of context do you overuse, and what are you trying to protect yourself from?",
          checkpoint: "Complete the assigned reading, video notes, both guided exercises, knowledge checks, real-world rewrite, reflection, and senior design leader lens notes.",
          stepOverrides: [
            {
              id: "separate-context-overview",
              type: "overview",
              title: "Overview",
              content: `Most aspiring leaders do not fail because they lack recommendations. They fail because they dilute them.

A recommendation can be strategically sound and still land poorly if it is buried beneath too much background. Executives do not want less rigor. They want the rigor organized in a way that helps them decide. This lesson teaches you to separate the recommendation from the context, decide which supporting details actually matter, and write updates that feel decision-oriented rather than defensive.

The distinction is simple but powerful: the recommendation is what should happen; the context is the information required to evaluate why. When those two are mixed together, the audience has to extract the point. When they are separated, the audience can immediately engage with the decision.

For a senior design leader, this is a core executive communication skill. Design leaders often carry rich context: customer research, usability insights, design critique history, stakeholder feedback, technical constraints, brand considerations, accessibility risks, and team process. The leadership move is not to unload all of that. The leadership move is to compress it into a clear recommendation, then provide only the context needed for the executive team to make a better decision.` ,
              completionRequired: false
            },
            {
              id: "separate-context-outcome",
              type: "learning_objectives",
              title: "Lesson Outcome",
              content: `By the end of this lesson, you should be able to:

- Distinguish context from recommendation.
- Identify communication clutter.
- Structure updates for executive audiences.
- Avoid defensive communication patterns.
- Write decision-oriented updates.
- Reduce unnecessary detail.
- Create executive-ready messaging.

Measurable behavior: Given a context-heavy update, you can extract the recommendation, name the business or customer impact, state the ask, and include only the context that helps the audience make a better decision.` ,
              completionRequired: true
            },
            {
              id: "separate-context-why-this-matters",
              type: "why_this_matters",
              title: "Why This Matters",
              content: `Manager-style communication often sounds like this:

"We have been evaluating onboarding performance over the last few months and after reviewing analytics, customer feedback, support tickets, and competitor experiences we have identified a number of opportunities that may improve activation."

Senior-leader-style communication sounds like this:

"I recommend prioritizing onboarding improvements because activation appears to be constraining retention."

Both statements may arrive at the same conclusion. Only one helps a senior leader make a decision quickly.

This matters because context-heavy communication creates three problems. First, it delays the decision. The listener has to wait until the end to understand what is being recommended. Second, it creates interpretation risk. Different executives may hear different points inside the same body of context. Third, it can make the communicator sound less confident, even when the underlying recommendation is strong.

The goal is not to remove all context. The goal is to put context in its proper role. Context supports the recommendation. It does not lead the communication. It does not substitute for judgment. It does not prove leadership. It helps the audience evaluate the decision.` ,
              completionRequired: true
            },
            {
              id: "separate-context-reading",
              type: "reading",
              title: "Reading Assignment",
              content: `Primary Reading

Book: Made to Stick
Author: Chip Heath and Dan Heath
Read: Chapter 1: Simple and Chapter 3: Concrete

Why these chapters matter: Simple teaches how to identify the core message. Concrete teaches how to make that message actionable. Many leaders believe more context creates more clarity. These chapters teach the opposite: the more information you add, the harder it becomes to identify the core message.

Reading Questions:
- What information is essential?
- What information is merely interesting?
- What information helps action?
- What information distracts from action?

Application Goal: Identify the core recommendation hidden inside a recent roadmap discussion, project update, design critique summary, stakeholder communication, or strategy document.

Supplemental Reading

Book: The First 90 Days
Author: Michael Watkins
Read: Chapter 2: Accelerate Your Learning

Why it matters: New leaders gather enormous amounts of information. The challenge is not learning more. The challenge is deciding which information matters. Executive communication follows the same principle.` ,
              prompt: "After reading, list three details from a recent communication that were interesting but not essential to the decision.",
              completionRequired: true
            },
            {
              id: "separate-context-video",
              type: "video",
              title: "Video Assignment",
              content: `Video Title: How to Speak
Source: MIT OpenCourseWare / Patrick Winston
URL: https://www.youtube.com/watch?v=Unzc731iCUY

Why this video matters: Strong communicators separate the main point from supporting evidence. They do not overwhelm the audience with everything they know. They use structure, repetition, and selective detail to keep the audience oriented.

Reflection Questions:
- How quickly does the speaker establish the main point?
- How much supporting detail is included?
- What details are intentionally omitted?
- How often is the core message reinforced?
- Does the speaker ever overwhelm the audience with context?` ,
              prompt: "Write three observations about how the speaker manages context and one technique you can apply to executive updates.",
              completionRequired: true
            },
            {
              id: "separate-context-core-concept",
              type: "concept",
              title: "Core Concept: Context Is Not the Point",
              content: `Many design leaders treat context as proof. They believe, "If I explain enough, people will agree." Executive communication works differently.

Executives rarely need the full research journey, every stakeholder conversation, every design iteration, every technical constraint, or every supporting detail. They need the recommendation, impact, decision, and risk. Context exists only to support those things.

The context trap usually comes from three patterns.

Reason 1: Fear of criticism. The leader thinks, "If I show all my work, nobody can challenge my recommendation." In reality, more context often creates more questions. It gives the audience more material to debate before they understand the decision.

Reason 2: Desire to demonstrate effort. The leader thinks, "People need to know how much work went into this." Executives evaluate judgment and outcomes, not effort. Effort may be appreciated, but it is not the message.

Reason 3: Discovery-order thinking. The leader communicates information in the order they learned it instead of the order someone needs it. That may feel natural to the communicator, but it creates work for the listener.

A strong executive update does not hide context. It filters context. It asks: does this information help the audience make a better decision? If not, remove it or move it to backup material.` ,
              completionRequired: true
            },
            {
              id: "separate-context-common-mistakes",
              type: "concept",
              title: "Common Mistakes: When Context Becomes Clutter",
              content: `Context becomes clutter when it asks the audience to do work the communicator should have already done.

Mistake 1: Including process history. Process history sounds like, "First we talked to Sales, then we reviewed analytics, then we held a workshop, then Design explored three directions." This may be useful in a team review, but it rarely belongs near the top of an executive update. The executive needs to know what the process produced, not every step of the process.

Mistake 2: Including stakeholder politics too early. Product design leaders often want to show that they have heard every function. That instinct is healthy, but it can dilute the recommendation. If Marketing, Sales, CX, Engineering, and Legal all have input, synthesize the implications first. Do not make the executive team listen to the stakeholder map before they know the decision.

Mistake 3: Using research detail as emotional protection. Customer quotes, usability clips, and journey pain points can be powerful. They can also become a shield. If you lead with five research details before making the recommendation, you may be trying to make the evidence carry the leadership burden. A senior design leader uses evidence to support judgment; they do not hide behind evidence.

Mistake 4: Confusing nuance with clarity. Nuance matters, especially in design. But nuance should sharpen the recommendation, not blur it. A clear executive message can still say, "The evidence is directional," "The tradeoff is," or "The risk is." Clarity does not require false certainty.

The correction is to decide what role each detail plays. If a detail changes the recommendation, include it. If it changes the risk profile, include it. If it helps the decision-maker understand impact, include it. If it merely proves that work happened, move it to backup material.` ,
              completionRequired: true
            },
            {
              id: "separate-context-mindset",
              type: "why_this_matters",
              title: "Manager vs Director vs Senior Leader",
              content: `Manager: "I want people to understand my work."

Director: "I want people to understand my recommendation."

Senior leader: "I want people to make a decision."

This mindset shift is foundational. A manager is often proving execution quality. A director is building alignment across teams. A senior design leader is shaping decisions across the business. That requires compression.

Compression does not mean shallow thinking. It means the leader has already done the work of deciding what matters. When you separate context from recommendation, you make it easier for executives to engage at the right level. They can test the recommendation, challenge the impact, ask about risk, or make the decision. They do not have to search through the communication to find the point.` ,
              completionRequired: true
            },
            {
              id: "separate-context-framework",
              type: "framework",
              title: "Framework: Recommendation, Impact, Ask, Context",
              content: `Recommendation: What should happen?
Impact: Why does it matter?
Ask: What decision is needed?
Context: What supporting information is required?

Example

Recommendation: Prioritize onboarding improvements.
Impact: Activation is likely suppressing retention.
Ask: Approve onboarding as a Q3 priority.
Context: Research and analytics indicate setup friction is the primary contributor.

Every piece of information should pass one test: Does this information help the audience make a better decision?

If not, remove it.

This framework is intentionally shorter than Lesson 1's recommendation, impact, risk, ask, context structure. The purpose here is to isolate context and keep it subordinate. Risk can still be included when it matters, but the main skill is learning to stop context from taking over the communication.` ,
              completionRequired: true
            },
            {
              id: "separate-context-example-1",
              type: "example",
              title: "Example 1: The Recommendation Survives Without Context",
              content: `Original Version: We spent six weeks reviewing onboarding analytics, conducted customer interviews, evaluated competitor onboarding experiences, reviewed support ticket data, and collaborated with CX to identify opportunities.

Improved Version: I recommend prioritizing onboarding improvements because activation appears to be limiting retention.

Supporting Context: Customer interviews, support tickets, and analytics suggest onboarding friction is concentrated during setup.

Analysis: The recommendation survives without the context. The context cannot survive without the recommendation. That is the relationship.` ,
              completionRequired: true
            },
            {
              id: "separate-context-example-2",
              type: "example",
              title: "Example 2: Launch Timing",
              content: `Original: Engineering has raised concerns about API stability while Design is still iterating on search flows and Product has identified several unresolved questions.

Executive Version: I recommend delaying the search launch by two weeks because unresolved API and design risks threaten launch quality.

Why Better: The decision appears first. The context supports the decision. The improved version does not remove the API or design concerns; it puts them in service of the recommendation.` ,
              completionRequired: true
            },
            {
              id: "separate-context-guided-1",
              type: "guided_practice",
              title: "Guided Exercise #1",
              content: `Rewrite this update:

"Since engineering still has concerns about API reliability and Design is not finished with the search flow, we may need to reconsider launch timing."

Requirements:
- Recommendation
- Impact
- Ask
- Context` ,
              sampleAnswer: `Recommendation: Delay launch by two weeks.
Impact: Reduces delivery and customer experience risk.
Ask: Approve the revised launch date.
Context: API reliability and design issues remain unresolved.` ,
              completionRequired: true
            },
            {
              id: "separate-context-guided-2",
              type: "guided_practice",
              title: "Guided Exercise #2",
              content: `Use a real work document. Select one of the following:

- Roadmap update
- Email
- Slack message
- Stakeholder communication
- Strategy document

Highlight or label the content:

Green: Recommendation
Blue: Impact
Yellow: Context
Red: Ask

Then reorganize the communication so the recommendation appears first.` ,
              completionRequired: true
            },
            {
              id: "separate-context-advanced",
              type: "concept",
              title: "Advanced Concept: Context Budget",
              content: `Every communication has a limited context budget. The more context you add, the less attention remains.

Treat context as expensive, not free.

This is especially important for design leadership. Design work produces rich evidence: research clips, journey maps, usability findings, behavioral data, visual explorations, stakeholder reactions, accessibility notes, and implementation constraints. All of that can matter. But not all of it belongs in the opening.

A context budget forces prioritization. If you have room for only three pieces of context, which three help the decision most? If a detail does not affect the recommendation, impact, ask, or risk, it probably belongs in backup material. The discipline is not to discard evidence. The discipline is to sequence evidence so it serves the decision.` ,
              completionRequired: true
            },
            {
              id: "separate-context-case-study",
              type: "example",
              title: "Case Study: The First Minute With the CEO",
              content: `Scenario: You are presenting to the CEO.

You have:
- 30 minutes of analysis
- 20 slides
- 4 stakeholder interviews
- 6 charts

Question: How much should appear in the first minute?

Answer: Almost none of it.

The first minute should contain:
- Recommendation
- Impact
- Ask

Everything else is supporting material. If the CEO agrees with the direction, you may not need all 20 slides. If the CEO disagrees, the slides should help diagnose the disagreement. Either way, the analysis exists to support the decision. It should not delay the decision.` ,
              completionRequired: true
            },
            {
              id: "separate-context-quiz-1",
              type: "quiz",
              title: "Knowledge Check 1",
              content: "What is the purpose of context?",
              options: ["A. Demonstrate effort", "B. Prevent criticism", "C. Support better decisions"],
              correctAnswer: "C. Support better decisions",
              completionRequired: true
            },
            {
              id: "separate-context-quiz-2",
              type: "quiz",
              title: "Knowledge Check 2",
              content: "Which should appear first?",
              options: ["A. Recommendation", "B. Context"],
              correctAnswer: "A. Recommendation",
              completionRequired: true
            },
            {
              id: "separate-context-quiz-3",
              type: "quiz",
              title: "Knowledge Check 3",
              content: "Which statement is strongest?",
              options: [
                "A. We reviewed onboarding performance and found opportunities.",
                "B. Analytics suggest onboarding issues.",
                "C. I recommend prioritizing onboarding because activation appears to be limiting retention."
              ],
              correctAnswer: "C. I recommend prioritizing onboarding because activation appears to be limiting retention.",
              completionRequired: true
            },
            {
              id: "separate-context-real-work",
              type: "real_work_application",
              title: "Real-World Assignment",
              content: `Choose one executive-facing communication. Examples:

- Email
- Roadmap update
- Stakeholder presentation
- Strategy memo

Create:

Version 1: Original
Version 2: Recommendation-first rewrite

Then answer:

1. What context did you remove?
2. What context remained?
3. What became clearer?
4. What decision became easier?` ,
              completionRequired: true
            },
            {
              id: "separate-context-reflection",
              type: "reflection",
              title: "Reflection",
              content: `Question 1: Which type of context do you overuse?

- Research
- Stakeholder opinions
- Technical details
- Implementation details
- Historical background

Question 2: Why? What are you trying to protect yourself from?

Question 3: What communication this week could benefit from a smaller context budget?` ,
              completionRequired: true
            },
            {
              id: "separate-context-vp-lens",
              type: "vp_lens",
              title: "Design Leadership Lens",
              content: `The difference between Directors and senior leaders is often not insight. It is compression.

Executive leaders absorb complexity. Then they communicate recommendation, impact, risk, and decision in a way others can act on.

The goal is not to communicate everything you know. The goal is to communicate what others need.

For a senior design leader, this is especially important because design evidence can be nuanced and emotionally persuasive. Research stories, customer quotes, visual examples, and critique history can all be compelling. But executive communication requires deciding which evidence moves the decision. The strongest design executives do not flood the room with artifacts. They use the right artifact at the right moment to support a clear recommendation.

That is the essence of executive communication: absorb complexity, then make action easier.` ,
              completionRequired: true
            },
            {
              id: "separate-context-checkpoint",
              type: "checkpoint",
              title: "Completion Criteria",
              content: `This lesson is complete when you have:

- Completed assigned reading.
- Watched the video.
- Finished Guided Exercise #1.
- Finished Guided Exercise #2.
- Completed all three knowledge checks.
- Submitted the real-world assignment.
- Completed the reflection questions.
- Written the senior design leader lens note.

Only then should Lesson 2 be marked complete.` ,
              completionRequired: true
            }
          ]
        }),
        lesson({
          id: "make-business-impact-explicit",
          title: "Make the Business Impact Explicit",
          objective: "Translate design work into explicit business impact without overstating certainty.",
          estimatedMinutes: 110,
          bookTitle: "Good Strategy Bad Strategy",
          author: "Richard Rumelt",
          assignedConcept: "Diagnosis, guiding policy, coherent action",
          readingPrompt:
            "Focus on the idea that good strategy starts with a clear diagnosis and leads to coherent action.",
          applicationPrompt:
            "Use this idea to connect design work to a business problem, not just a feature opportunity.",
          videoTitle: "The Single Biggest Reason Why Startups Succeed",
          videoSource: "TED / Bill Gross",
          videoUrl: "https://www.youtube.com/embed/bNpx7gpSqbY",
          whyRelevant:
            "The talk is useful because it separates product activity from the business conditions that determine whether work creates value.",
          videoReflection: "How does the speaker connect product choices, customer timing, market conditions, and business results?",
          concept:
            "Design leaders often describe work in design and product language: features, flows, UX issues, research themes, or backlog items. Executives listen for business language: revenue, retention, conversion, margin, cost, risk, growth, or strategic position. Senior design leaders translate design work into business impact without exaggerating the certainty.",
          badExample: "We should improve search filters because users are having trouble narrowing results.",
          betterExample:
            "I recommend improving search filters because product discovery friction may be reducing conversion for high-intent shoppers.",
          whyBetter:
            "The better version connects the UX issue to a business outcome. It does not overclaim. It uses may be reducing to signal impact while preserving credibility.",
          guidedPrompt:
            "Rewrite: We should improve the account dashboard because customers say it is hard to find important information.",
          sampleAnswer:
            "I recommend improving the account dashboard because poor account visibility is likely increasing support contacts and reducing customer self-service.",
          quizQuestion: "Which is the strongest business framing?",
          quizOptions: [
            "A. The flow is confusing.",
            "B. Users do not like the flow.",
            "C. The confusing flow may be increasing drop-off before activation."
          ],
          correctAnswer: "C. The confusing flow may be increasing drop-off before activation.",
          realWork:
            "Choose one roadmap item and rewrite it using at least one business outcome: revenue, retention, conversion, cost, risk, margin, or strategic advantage.",
          reflection: "Did you make the business impact credible, or did you overstate it?",
          checkpoint: "Complete the business framing rewrite, quiz, real-work application, and reflection.",
          stepOverrides: [
            {
              id: "business-impact-overview",
              type: "overview",
              title: "Overview",
              content: `This lesson is about one of the most important shifts in executive communication: moving from product activity to business impact.

For a senior design leader, this shift is especially important because design work can be easy to describe at the level of artifacts: flows, screens, research findings, usability problems, accessibility improvements, information architecture, visual systems, and interaction quality. Those things matter. They are often the work. But they are not automatically the reason executives should allocate attention, people, money, or political capital.

Executive audiences need to understand why a customer problem matters to the organization. They are usually listening for a connection to revenue, retention, conversion, margin, cost, operational efficiency, growth, risk, brand trust, strategic positioning, or speed of execution. If that connection is missing, the issue can sound like a preference, a craft concern, or a local team problem even when it is strategically important.

The lesson does not ask you to become less customer-centered. It asks you to become more complete. Strong senior design leaders can hold both truths at once: customers are experiencing friction, and that friction matters because it changes behavior that affects the business.

By the end of this lesson, you should be able to take a product or design issue and explain four levels of meaning: the activity, the customer impact, the business impact, and the strategic impact. You will practice doing this without exaggerating certainty. That matters because executive trust depends on judgment. Leaders lose credibility when they make every design improvement sound like guaranteed revenue. They gain credibility when they explain the likely impact, evidence, assumptions, and risk clearly.` ,
              completionRequired: false
            },
            {
              id: "business-impact-outcomes",
              type: "learning_objectives",
              title: "Lesson Outcome",
              content: `By the end of this lesson, you should be able to:

- Translate design work into business outcomes.
- Connect customer problems to organizational goals.
- Explain product investments using business language.
- Avoid feature-centric communication.
- Identify weak business framing.
- Build executive-ready business cases.
- Communicate strategic importance without exaggeration.

These outcomes are practical. The test is not whether you can name business metrics. The test is whether you can take a sentence like "the checkout flow is confusing" and turn it into a credible executive recommendation such as "checkout friction appears to be reducing conversion among high-intent customers, so I recommend simplifying the decision path before we increase acquisition spend."

That second version does more work. It identifies the customer problem, the user behavior, the business consequence, and the reason timing matters. It also leaves room for uncertainty. It says "appears to be" instead of pretending the design change alone will cause a guaranteed business result.` ,
              completionRequired: true
            },
            {
              id: "business-impact-why-matters",
              type: "why_this_matters",
              title: "Why This Matters",
              content: `One of the clearest differences between product managers, directors, and senior design leaders is the language they use.

Product managers often communicate:

- Features.
- Experiences.
- Workflows.
- Usability issues.
- Customer feedback.
- Research findings.
- Delivery status.

Directors often communicate:

- Portfolio priorities.
- Team capacity.
- Cross-functional dependencies.
- Quality risks.
- Sequencing decisions.
- Stakeholder alignment.

Executive leaders communicate:

- Revenue.
- Retention.
- Conversion.
- Growth.
- Margin.
- Operational efficiency.
- Strategic positioning.
- Risk.
- Confidence in investment decisions.

This does not mean executives care less about customers. It means executives need to understand why a customer problem matters to the business. A customer problem without business impact is an observation. A customer problem connected to business impact becomes a strategic issue.

Consider the difference between these two updates.

Manager mindset: "Users are confused by the current onboarding flow."

Director mindset: "The onboarding flow is causing confusion across three high-priority customer segments, and the team has identified the setup sequence as the main source of friction."

Senior design leadership mindset: "Onboarding friction appears to be suppressing activation for new accounts, which may be limiting retention and reducing the return on our acquisition spend. I recommend prioritizing setup simplification before adding more acquisition volume."

The senior leadership version is not longer because it adds more context. It is stronger because it translates the issue into the terms executives use to allocate resources. It connects customer behavior to business consequence and business consequence to strategic choice.

This is where many senior leaders plateau. They have good product judgment, strong customer empathy, and excellent design taste, but their communication remains feature-centric. They describe what should be improved but not why the organization should care now. Executive influence grows when you can make that connection quickly, credibly, and repeatedly.` ,
              completionRequired: true
            },
            {
              id: "business-impact-reading",
              type: "reading",
              title: "Reading Assignment: Good Strategy Bad Strategy",
              content: `Book: Good Strategy Bad Strategy
Author: Richard Rumelt
Assigned Reading: Chapter 1: Good Strategy and Bad Strategy; Chapter 2: Discovering Power; Chapter 4: Why So Much Bad Strategy?

Why these chapters matter:

Many product and design leaders confuse strategy with priorities. Rumelt argues that good strategy requires diagnosis, guiding policy, and coherent action. This applies directly to executive communication.

Executives need to hear:

- What problem matters?
- Why does it matter?
- What should we do?
- Why is this action coherent with the problem?

The ability to connect design work to business outcomes is one of the foundations of strategic leadership. If your recommendation does not include a diagnosis, it can sound like a preference. If it does not include a business consequence, it can sound local. If it does not include coherent action, it can sound like a wish.

What to look for while reading:

- The difference between a goal and a strategy.
- Why leaders often communicate aspirations instead of diagnoses.
- What makes a diagnosis persuasive.
- How coherent action applies to product investments.
- Which current roadmap item lacks a strong diagnosis.

Application to senior design leadership:

Product design strategy is not only a collection of experience principles or interface improvements. It should explain which customer behaviors need to change, why those behaviors matter to the business, and what coherent design actions will improve the odds of that change. As you read, notice how Rumelt's strategy kernel maps directly to executive communication: diagnosis becomes the business problem, guiding policy becomes the investment thesis, and coherent action becomes the design work you recommend.` ,
              prompt: `After reading, choose one current design or product priority and write its diagnosis in one sentence. The sentence should name the business issue, not only the customer pain point.`,
              completionRequired: true
            },
            {
              id: "business-impact-supplemental-reading",
              type: "reading",
              title: "Supplemental Reading: Made to Stick",
              content: `Book: Made to Stick
Author: Chip Heath and Dan Heath
Assigned Reading: Chapter: Credible

Why this chapter matters:

Business impact framing can fail in two opposite ways. The first failure is under-framing: you describe the product work but never explain the business consequence. The second failure is overclaiming: you imply the work will definitely create an outcome you cannot actually guarantee.

The Credible chapter helps with the second risk. Executive audiences do not need inflated certainty. They need evidence, assumptions, and judgment. A senior design leader should be able to say "this may improve conversion" or "the evidence suggests this is contributing to retention risk" without making the claim weaker. Probability language can make the claim stronger because it signals maturity.

What to look for:

- How credibility is created through concrete evidence.
- How claims become more believable when they are specific.
- How communicators avoid making ideas feel vague or inflated.
- How evidence can support a recommendation without pretending to remove all uncertainty.

Application:

When you connect design work to business outcomes, use evidence and probability language. For example, "This redesign will increase revenue" is usually too strong. "Customer behavior and funnel analysis suggest this redesign may improve conversion" is more credible. It tells executives what you believe, what evidence supports it, and where uncertainty remains.` ,
              prompt: `Write one business-impact sentence that uses credible probability language instead of guaranteed impact language.`,
              completionRequired: true
            },
            {
              id: "business-impact-video",
              type: "video",
              title: "Video Assignment: The Single Biggest Reason Why Startups Succeed",
              content: `Video Title: The Single Biggest Reason Why Startups Succeed
Source: TED / Bill Gross
URL: https://www.youtube.com/watch?v=bNpx7gpSqbY

Why this video matters:

The assignment asks you to observe how a speaker connects company outcomes to underlying business drivers. This is not a design leadership talk, and that is part of the value. Executives frequently operate at the level of conditions, risk, timing, market behavior, customer demand, and investment return. The product itself matters, but it is rarely the only variable.

As you watch, pay attention to how the speaker moves from examples to business explanation. The useful habit is not copying the content. The useful habit is noticing how a broad claim becomes credible when it is tied to evidence, comparison, and business consequence.

While watching:

- What business outcomes are discussed most frequently?
- How are investments or company choices justified?
- What evidence is used?
- Does the speaker communicate certainty or probability?
- How are risks or failed assumptions discussed?
- Where does the explanation move beyond product quality into business conditions?

After watching, translate one point from the video into your own design leadership context. For example: if timing affects startup success, what is the equivalent timing variable in a design roadmap decision? Is it market readiness, enterprise buying cycles, implementation burden, customer migration risk, or stakeholder appetite?` ,
              prompt: `Write three observations about how the speaker connects product or company choices to business outcomes.`,
              completionRequired: true
            },
            {
              id: "business-impact-core-concept",
              type: "concept",
              title: "Core Concept: Product Work Is Not the Business Impact",
              content: `One of the most common communication mistakes in product organizations is treating product activity as impact.

Examples:

- "We redesigned onboarding."
- "We improved search."
- "We launched personalization."
- "We updated navigation."
- "We refreshed the dashboard."
- "We completed the research synthesis."

These are activities. They may be valuable activities, but they are not outcomes. Executives evaluate outcomes.

The distinction matters because product and design teams often spend months close to the work. By the time they present to executives, the team has lived through the research, the debates, the constraints, the iterations, and the tradeoffs. The team can feel the importance of the work. Executives cannot. They enter the conversation with a different frame: what is changing, why should this matter now, what should we fund, what risk are we accepting, and what result should we expect?

If you say "we redesigned onboarding," the executive has to infer the business meaning. That inference may be wrong or incomplete. They might hear "quality improvement" when you mean "retention risk." They might hear "design polish" when you mean "activation bottleneck." They might hear "team preference" when you mean "growth efficiency."

Your job as a senior design leader is to make the business meaning explicit.

That does not mean every sentence should sound financial. It means the relationship between customer experience and business performance should be visible. A design issue becomes executive-level when it affects behavior that matters: people abandon setup, fail to discover relevant products, contact support instead of self-serving, delay purchase decisions, mistrust the platform, churn after first use, or require expensive implementation help.

The strongest framing often follows this pattern:

- Customer problem: What friction, unmet need, or confusion exists?
- Behavior impact: What do customers do differently because of it?
- Business outcome: Which business metric or operating condition does that behavior affect?
- Strategic impact: Why does that outcome matter to the company's priorities now?

This is the difference between saying "customers are confused" and saying "setup confusion appears to be suppressing activation, which may be limiting retention and reducing the return on acquisition spend." The second statement is not less customer-centered. It is more useful because it explains why the customer issue deserves organizational action.` ,
              completionRequired: true
            },
            {
              id: "business-impact-outcome-hierarchy",
              type: "framework",
              title: "The Outcome Hierarchy",
              content: `Use the outcome hierarchy to move from activity to strategic impact.

1. Activity: What did the team do or propose doing?

Example: "We redesigned onboarding."

2. Customer Impact: What changes for the user or customer?

Example: "New users complete setup more successfully."

3. Business Impact: What business outcome may change?

Example: "Improved activation may increase retention and subscription conversion."

4. Strategic Impact: Why does this matter to the company's direction?

Example: "Improving activation strengthens long-term growth and reduces acquisition waste."

Senior design leaders communicate all four levels. Most teams stop at level 1 or 2.

Stopping at activity creates a funding problem. Executives can see that work happened, but they cannot evaluate whether it was the right work. Stopping at customer impact creates a prioritization problem. Executives can see that customers benefit, but they still may not understand why this issue should beat other customer issues competing for the same capacity.

The hierarchy gives you a way to move from local evidence to executive relevance. It also helps you avoid overclaiming. You are not saying the design work alone will guarantee the business outcome. You are saying the design work addresses a customer behavior that is plausibly connected to a business outcome that matters strategically.` ,
              completionRequired: true
            },
            {
              id: "business-impact-example-one",
              type: "example",
              title: "Example 1: Onboarding",
              content: `Weak version:

"We should improve onboarding because users are confused."

Executive version:

"I recommend improving onboarding because activation friction appears to be limiting retention and paid conversion."

Why the executive version is better:

- It identifies a business problem.
- It explains why the customer issue matters.
- It creates urgency.
- It supports prioritization.
- It avoids pretending the outcome is guaranteed.

The weak version is not wrong. It is incomplete. It names a customer problem but does not explain why leadership should act on it now. Many products contain confusing areas. The executive question is: which confusion is strategically important?

The stronger version translates confusion into activation friction. Activation is a business-relevant behavior because it often predicts whether a customer reaches value, retains, converts, or expands. By connecting onboarding to activation and conversion, the recommendation gives executives a reason to care beyond general experience quality.

A senior design leader would be prepared to support this claim with evidence: funnel drop-off, session recordings, customer interviews, support tickets, cohort retention, or conversion analysis. The sentence opens the executive conversation. The evidence earns confidence.` ,
              completionRequired: true
            },
            {
              id: "business-impact-example-two",
              type: "example",
              title: "Example 2: Search Filters",
              content: `Weak version:

"Search filters are difficult to use."

Executive version:

"I recommend improving search filters because discovery friction may be reducing conversion among high-intent customers."

Why the executive version is better:

- It connects user experience to economics.
- It explains why leadership should care.
- It frames the opportunity strategically.
- It identifies the affected customer behavior.

The phrase "high-intent customers" matters. It signals that this is not generic usability polish. It is a problem affecting users who may already be close to purchase, adoption, or deeper engagement. That makes the issue more valuable to examine.

Notice the probability language: "may be reducing." This is stronger than it looks. It communicates judgment without overstatement. A less mature version would say "fixing search filters will increase revenue." That may be true, but unless you have causal evidence, the claim is too certain. The executive version points to the likely relationship and invites evidence-based decision making.

For design leaders, this is a core skill. You are often advocating for improvements that feel obvious from a user perspective. But executive rooms require you to explain the business consequence. Clear business framing does not cheapen the design argument. It helps the organization understand why design quality is not decorative. It is connected to behavior, trust, efficiency, and growth.` ,
              completionRequired: true
            },
            {
              id: "business-impact-framework",
              type: "framework",
              title: "The Design Translation Framework",
              content: `Every design issue should be translated through four questions.

1. What customer problem exists?

Name the actual friction, unmet need, anxiety, confusion, or failed expectation. Avoid starting with the solution. "The dashboard needs a redesign" is a solution-shaped statement. "Customers cannot find the account health information they need before renewal conversations" is a problem-shaped statement.

2. What behavior does it affect?

Executives care about behavior because behavior connects experience to outcomes. Do users abandon setup? Delay purchase? Contact support? Ignore recommendations? Fail to invite teammates? Revert to manual workarounds? Misconfigure important settings? Behavior is the bridge.

3. What business outcome does that behavior affect?

Connect the behavior to a business outcome such as activation, retention, conversion, expansion, cost to serve, sales cycle length, margin, risk, or growth efficiency. Be specific. "Business impact" is not a magic phrase. The useful question is which business outcome is likely affected.

4. Why does that outcome matter strategically?

Tie the outcome to what the company is trying to accomplish now. The same design issue can mean different things depending on company strategy. In a growth phase, onboarding friction may matter because it reduces acquisition efficiency. In an enterprise expansion phase, reporting friction may matter because it weakens renewal confidence. In a cost discipline phase, self-service friction may matter because it increases support load.

Framework example:

Customer Problem: Users struggle during onboarding.

Behavior: Users abandon setup.

Business Outcome: Lower activation and retention.

Strategic Impact: Reduced growth efficiency.

The framework helps you prepare executive communication in decision order. Start with the recommendation and business issue, then bring in the customer evidence needed to support the judgment.` ,
              completionRequired: true
            },
            {
              id: "business-impact-guided-one",
              type: "guided_practice",
              title: "Guided Exercise #1",
              content: `Translate the following statement into executive business language.

Original:

"Our dashboard experience needs improvement."

Strong answer:

Customer Problem: Users struggle to find important account information.

Behavior: Users contact support more frequently and rely on internal teams for information they should be able to self-serve.

Business Outcome: Higher support costs and slower customer decision-making.

Strategic Impact: Reduced operational efficiency and weaker confidence in the product as a system of record.

Executive recommendation:

"I recommend improving the account dashboard because poor visibility appears to be increasing support demand and slowing customer self-service. This work should reduce operational drag and strengthen confidence in the product as the place customers manage account health."

Why this works:

The answer does not stop at "dashboard improvement." It explains the user problem, the behavior, the operating cost, and the strategic value. It also uses cautious language: "appears to be." That leaves room for evidence and avoids promising a guaranteed cost reduction.` ,
              prompt: `Now write your own version for a dashboard or reporting issue from your current work. Include customer problem, behavior, business outcome, strategic impact, and a one-sentence recommendation.`,
              completionRequired: true
            },
            {
              id: "business-impact-guided-two",
              type: "guided_practice",
              title: "Guided Exercise #2",
              content: `Translate this statement:

"Our checkout flow is confusing."

Required output:

1. Customer Problem.
2. Behavior Impact.
3. Business Impact.
4. Strategic Impact.
5. Executive Recommendation.

Before writing, resist the urge to jump straight to "redesign checkout." The executive-level issue is not the existence of confusion. The issue is what the confusion changes. Does it cause abandonment? Does it increase support contacts? Does it reduce average order value? Does it delay purchasing? Does it create risk for a strategic segment?

Example answer:

Customer Problem: Customers do not understand required checkout steps or total cost before confirmation.

Behavior Impact: Some high-intent customers abandon the flow or delay purchase.

Business Impact: Checkout friction may be reducing conversion and wasting acquisition spend.

Strategic Impact: If we are increasing demand generation, unresolved checkout friction will make growth less efficient.

Executive Recommendation: "I recommend simplifying checkout before we increase paid acquisition, because current flow confusion may be reducing conversion among high-intent buyers and lowering the return on acquisition spend."

The final sentence is executive-ready because it links the design issue to timing. The recommendation is not merely "improve the experience." It says what should happen first and why.` ,
              prompt: `Complete the same five-part translation for a checkout, signup, onboarding, or request flow you know well.`,
              completionRequired: true
            },
            {
              id: "business-impact-probability-language",
              type: "concept",
              title: "Advanced Concept: Probability Language",
              content: `One mistake many aspiring leaders make is overstating certainty.

Bad:

"This redesign will increase revenue."

Better:

"This redesign is likely to improve conversion."

Best:

"Customer behavior and funnel analysis suggest this redesign may improve conversion."

Credibility matters. Strong executives communicate evidence, assumptions, and uncertainty.

This is not hedging. It is precision. When you say "will increase revenue" without causal proof, you force the room to either accept an overclaim or challenge your credibility. When you say "may improve conversion" and explain the evidence, you invite a better executive conversation: how strong is the signal, what is the opportunity size, what would we need to believe, what risk remains, and what decision is warranted?

Useful probability phrases:

- "The evidence suggests..."
- "This appears to be contributing to..."
- "This may be limiting..."
- "We believe this is likely to..."
- "The strongest signal is..."
- "The risk is that..."
- "We have directional evidence that..."
- "We do not yet know the exact magnitude, but the pattern is consistent with..."

Weak probability language sounds vague because it hides the evidence. Strong probability language sounds credible because it pairs uncertainty with the basis for judgment.

Weak: "This might help retention."

Stronger: "We do not yet have causal proof, but cohort analysis shows customers who complete setup within the first session retain at a materially higher rate. That suggests reducing setup friction may improve retention."

The second version does not overpromise. It gives the executive team enough information to evaluate whether the investment is worth making.` ,
              completionRequired: true
            },
            {
              id: "business-impact-case-study",
              type: "example",
              title: "Case Study: Navigation Friction",
              content: `Scenario:

The design team identifies navigation problems in a core workflow. Research shows customers struggle to discover important features, and support tickets frequently mention confusion about where to complete specific tasks.

You could communicate:

A. "The navigation experience is poor."

Or:

B. "Navigation friction may be reducing product discovery and limiting conversion opportunities."

The stronger answer is B.

Why?

Because it connects customer experience to business outcomes.

A is a quality judgment. It may be accurate, but it leaves executives with unanswered questions. Poor compared with what? For which customers? What behavior changes? Why should this compete with other work?

B frames the issue as product discovery and conversion risk. It gives the room a business reason to examine the navigation problem. It also gives you a path to evidence: feature discovery rates, conversion by entry path, task completion data, support volume, research clips, and sales or customer success feedback.

A senior design leader would not stop at B. They would be ready with a short supporting case:

"The strongest evidence is that high-intent visitors who enter through comparison pages are failing to find the configuration workflow. We see this in analytics, support tickets, and five recent enterprise research sessions. I do not think this is a visual refresh problem. I think it is a discovery problem affecting conversion for customers already evaluating us. I recommend fixing the navigation path before expanding the next acquisition campaign."

That version is executive-ready because it brings together diagnosis, evidence, business consequence, and sequencing.` ,
              completionRequired: true
            },
            {
              id: "business-impact-quiz-one",
              type: "quiz",
              title: "Knowledge Check 1",
              content: `Question: Which statement demonstrates the strongest business framing?

A. "The search experience is difficult."

B. "Users struggle to locate products."

C. "Discovery friction may be reducing conversion among high-intent customers."

Correct answer: C.

Why:

C connects user friction to a business outcome and identifies the affected customer intent. A is a quality judgment. B names the customer problem. C explains why the issue may matter to the business.` ,
              prompt: `Write a one-sentence explanation of why C is stronger than B.`,
              completionRequired: true
            },
            {
              id: "business-impact-quiz-two",
              type: "quiz",
              title: "Knowledge Check 2",
              content: `Question: Which is not a business outcome?

A. Retention.

B. Revenue.

C. Redesigned dashboard.

Correct answer: C.

Why:

A redesigned dashboard is an activity or deliverable. It may influence a business outcome, but it is not the outcome itself. The executive communication task is to explain what customer behavior the redesigned dashboard changes and which business outcome that behavior affects.` ,
              prompt: `Rewrite "redesigned dashboard" as a business-impact statement.`,
              completionRequired: true
            },
            {
              id: "business-impact-quiz-three",
              type: "quiz",
              title: "Knowledge Check 3",
              content: `Question: Why should executives care about customer problems?

A. Because customers matter.

B. Because customer problems often affect business outcomes.

Correct answer: B.

Why:

Customers do matter. But in executive communication, that statement is not usually sufficient. Executives need to understand which customer problems affect the organization's goals, risks, economics, or strategic position. Your job is to make that connection clear without reducing the customer problem to a spreadsheet-only argument.` ,
              prompt: `Name one customer problem and the business outcome it may affect.`,
              completionRequired: true
            },
            {
              id: "business-impact-real-world",
              type: "real_work_application",
              title: "Real-World Assignment",
              content: `Choose a current roadmap item, design initiative, research finding, or product improvement.

Complete the following:

1. Customer Problem.

2. User Behavior Impact.

3. Business Outcome.

4. Strategic Impact.

Then write a one-paragraph executive recommendation explaining:

- Why the issue matters.
- What should happen.
- What outcome may improve.
- What evidence supports the claim.
- What uncertainty remains.

A strong answer should avoid both extremes. It should not be feature-centric, and it should not overpromise. The goal is to sound like a senior leader with judgment.

Template:

"I recommend [action] because [customer behavior] appears to be affecting [business outcome]. The strongest evidence is [evidence]. This matters now because [strategic reason]. The main uncertainty is [uncertainty], so I recommend [next decision or next step]."

Example:

"I recommend simplifying enterprise setup because configuration confusion appears to be delaying activation for new accounts. The strongest evidence is first-session drop-off, implementation feedback, and recent support volume tied to setup errors. This matters now because we are increasing enterprise acquisition and cannot afford to add customers into a high-friction activation path. The main uncertainty is the exact retention impact, so I recommend a focused redesign and measurement plan before expanding the onboarding scope."` ,
              prompt: `Draft your real-world recommendation using the template, then edit it down until the first sentence carries the business impact clearly.`,
              completionRequired: true
            },
            {
              id: "business-impact-reflection",
              type: "reflection",
              title: "Reflection",
              content: `Question 1: Which business outcomes do you naturally discuss?

- Revenue.
- Retention.
- Growth.
- Cost.
- Risk.
- Margin.
- Conversion.
- Operational efficiency.
- Strategic positioning.

Question 2: Which business outcomes do you rarely discuss?

Question 3: What design work are you currently describing as activity rather than outcome?

Question 4: How often do you explicitly connect customer problems to organizational goals?

Question 5: Where are you most likely to overstate certainty because you want the work to sound important?

Question 6: Where are you most likely to understate business impact because you are more comfortable speaking in customer or craft language?

The reflection matters because this is not only a writing technique. It is a leadership habit. Your default language reveals what you are optimizing for. Senior design leaders need to preserve the richness of customer understanding while making the business consequence clear enough for executive decision-making.` ,
              completionRequired: true
            },
            {
              id: "business-impact-vp-lens",
              type: "vp_lens",
              title: "Design Leadership Lens",
              content: `Product managers often ask:

"What should we build?"

Product design managers often ask:

"What experience should we improve?"

Senior design leaders ask:

"What business outcome are we trying to create through better customer behavior?"

This is one of the most important transitions in executive thinking.

The goal is not to stop caring about customers. The goal is to understand why customer problems matter strategically. Executives do not fund features. They fund outcomes. They fund risk reduction. They fund growth. They fund efficiency. They fund strategic advantage. They fund work that increases confidence in where the organization is going.

A senior design leader must therefore translate between worlds. To the design team, they protect the integrity of the customer problem. To the executive team, they explain the business consequence. To cross-functional peers, they show how design work changes behavior that matters to shared goals.

The best leaders do this without flattening design into metrics alone. They do not say "only revenue matters." They say "this customer problem matters because it is changing behavior in a way that affects retention, trust, cost, or growth." That distinction is crucial.

When you communicate this way consistently, you become easier to trust in executive rooms. You help the organization allocate resources more effectively. You make design work legible as strategic work. You also raise the quality of product decisions because the team is forced to articulate the connection between problem, behavior, business outcome, and strategic priority.

Leadership move: Make the business impact explicit while preserving the integrity of the customer insight.` ,
              completionRequired: true
            },
            {
              id: "business-impact-checkpoint",
              type: "checkpoint",
              title: "Completion Criteria",
              content: `This lesson is complete when you have:

- Completed the assigned reading from Good Strategy Bad Strategy.
- Completed the supplemental reading from Made to Stick.
- Watched the assigned video.
- Finished Guided Exercise #1.
- Finished Guided Exercise #2.
- Completed all three knowledge checks.
- Submitted the real-world assignment.
- Completed the reflection questions.
- Written the senior design leader lens note.

Only then should Lesson 3 be marked complete.` ,
              completionRequired: true
            }
          ]
        }),
        lesson({
          id: "frame-the-ask",
          title: "Frame the Ask",
          objective: "Turn executive communication into a clear decision, commitment, or next action.",
          estimatedMinutes: 110,
          bookTitle: "Influence",
          author: "Robert Cialdini",
          assignedConcept: "Commitment, consistency, and authority",
          readingPrompt:
            "Focus on how explicit commitments, clear expectations, and visible ownership make action more likely.",
          applicationPrompt:
            "Use these ideas to make design recommendations easier to decide, approve, support, or unblock.",
          videoTitle: "How Great Leaders Inspire Action",
          videoSource: "TED / Simon Sinek",
          videoUrl: "https://www.youtube.com/embed/qp0HIF3SfI4",
          whyRelevant:
            "The talk is useful for studying how leaders create movement by making the desired direction and call to action clear.",
          videoReflection: "What is the speaker asking the audience to believe, support, or do next?",
          concept:
            "Many leaders explain problems without making a clear ask. Senior design leaders must turn ambiguity into a decision, approval, alignment, input, or escalation request.",
          badExample: "There are concerns about launch readiness.",
          betterExample:
            "I need a decision by Friday on whether we reduce scope or move the launch date.",
          whyBetter:
            "The better version names the decision, the deadline, and the action needed from the audience.",
          guidedPrompt:
            "Rewrite: There are open questions about whether marketing and product are aligned on the launch plan.",
          sampleAnswer:
            "I need alignment this week on whether marketing and product are using the same launch success criteria.",
          quizQuestion: "What is the purpose of an executive ask?",
          quizOptions: [
            "A. Provide information.",
            "B. Create action or decision.",
            "C. Demonstrate effort."
          ],
          correctAnswer: "B. Create action or decision.",
          realWork:
            "Choose one current initiative and define the recommendation, business impact, ask, owner, and timeline.",
          reflection: "Which ask type do you avoid, and what does that avoidance cost?",
          checkpoint: "Complete the ask framework, knowledge checks, real-world assignment, and reflection.",
          stepOverrides: [
            {
              id: "frame-ask-overview",
              type: "overview",
              title: "Overview",
              content: `This lesson is about converting executive communication from explanation into movement.

One of the most common senior communication failures is not that the leader lacks insight. It is that the leader explains the situation, describes the risks, gives the context, and then stops before asking for anything. The meeting ends with nods. Everyone agrees the issue matters. Nothing changes because no decision, owner, commitment, or timeline was created.

For a senior design leader, this is a serious leadership problem. Design work often involves ambiguity: customer evidence, experience quality, research interpretation, product strategy, engineering constraints, brand implications, and stakeholder preferences. If you only describe the ambiguity, executives may leave impressed by the complexity but unclear on what they are supposed to do.

A strong ask answers four practical questions: what decision is needed, who needs to make it, by when, and what happens next. This is what turns communication into action. Without an ask, communication becomes observation. With an ask, communication creates movement.

This lesson teaches you how to distinguish between informing and asking, how to define the type of ask you need, and how to frame requests in a way that executives can act on. You will practice writing decision-oriented communication that includes recommendation, rationale, ask, owner, and timeline. The goal is not to become aggressive. The goal is to become useful. Executives trust leaders who can make the next action clear.` ,
              completionRequired: false
            },
            {
              id: "frame-ask-outcomes",
              type: "learning_objectives",
              title: "Lesson Outcome",
              content: `By the end of this lesson, you should be able to:

- Clearly identify the decision needed.
- Distinguish between informing and asking.
- Write decision-oriented communication.
- Reduce vague stakeholder conversations.
- Frame requests for executives.
- Communicate ownership and accountability.
- Structure recommendations around action.

Measurable outcome: When you prepare an executive update, you should be able to name the ask in one sentence before you build the rest of the communication. If you cannot name the ask, the message is probably not ready.

A clear ask does not always mean demanding a decision. Sometimes the ask is approval. Sometimes it is input. Sometimes it is alignment. Sometimes it is escalation support. Sometimes it is permission to stop doing something. The executive skill is knowing which kind of action the situation requires and making that action visible.` ,
              completionRequired: true
            },
            {
              id: "frame-ask-why-matters",
              type: "why_this_matters",
              title: "Why This Matters",
              content: `One of the most common executive communication failures is this: leaders explain a problem but never ask for anything.

The pattern looks familiar.

A team presents that checkout abandonment continues to be a concern. They show data, customer quotes, design concepts, and competitor examples. The executive team agrees the issue seems important. Then the conversation drifts. Should it be prioritized now? Does the team need resources? Is there a tradeoff? Is leadership being asked to decide, approve, align, or simply listen? Nobody knows.

This occurs because the communication lacked an ask.

Strong leaders understand that every serious communication should clarify:

- What decision is needed?
- Who needs to make it?
- By when?
- What happens next?

Manager mindset: "There is a launch readiness concern."

Director mindset: "There is a launch readiness concern, and the team has identified scope and quality as the two main variables."

Senior design leadership mindset: "I need a decision by Friday on whether we reduce scope or move the launch date. My recommendation is to reduce scope because the highest-risk quality issues are concentrated in two non-critical workflows."

The senior leadership version creates movement. It names the decision, gives a recommendation, identifies timing, and frames the tradeoff. The audience knows what role they are being asked to play.

This matters because executives are not only evaluating the content of your recommendation. They are evaluating whether you can move the organization through ambiguity. Leaders who avoid asks often look thoughtful but passive. Leaders who frame asks well look accountable. They reduce the hidden cost of vague conversations: repeated meetings, unclear ownership, delayed decisions, stakeholder frustration, and work that continues without commitment.` ,
              completionRequired: true
            },
            {
              id: "frame-ask-reading",
              type: "reading",
              title: "Reading Assignment: Influence",
              content: `Book: Influence
Author: Robert Cialdini
Assigned Reading: Commitment and Consistency; Authority

Why these chapters matter:

Many leaders assume influence comes from having the right answer. Having the right answer matters, but influence often comes from making participation clear. People are more likely to act when expectations are explicit, commitments are visible, and ownership is clear.

The commitment and consistency principle is useful because executive asks often create a moment of commitment. When a leader agrees to a decision, approves resources, confirms direction, or accepts ownership, the organization can move with more confidence. Ambiguous agreement is weaker. Explicit commitment changes behavior.

The authority principle matters because a senior design leader must use authority responsibly. Authority is not a license to force agreement. It is a responsibility to make decisions easier for others. When you bring a clear recommendation and a specific ask, you reduce cognitive load for the room. You show that you are not merely transferring complexity upward.

What to look for while reading:

- Why people are more likely to act when commitments are explicit.
- How ambiguity weakens accountability.
- Why leaders avoid making direct asks.
- What happens when ownership is unclear.
- How stronger asks improve decision-making.

Application to senior design leadership:

Design leaders often influence without direct control. You may need engineering capacity, product prioritization, marketing alignment, sales enablement, research access, legal guidance, or executive air cover. If your ask is vague, stakeholders can agree in principle while avoiding real commitment. Clear asks make collaboration concrete.` ,
              prompt: `After reading, write one sentence explaining why explicit commitment matters in an executive design decision.`,
              completionRequired: true
            },
            {
              id: "frame-ask-supplemental-reading",
              type: "reading",
              title: "Supplemental Reading: The First 90 Days",
              content: `Book: The First 90 Days
Author: Michael Watkins
Assigned Reading: Stakeholder discussions and coalition building sections

Why this reading matters:

Watkins emphasizes that leaders create momentum through conversations, expectations, and coalition building. That is directly connected to framing asks. A stakeholder conversation is not only a place to share information. It is a place to shape commitment.

What to look for:

- How leaders identify the stakeholders needed for momentum.
- How early conversations clarify expectations.
- How coalitions form around decisions, not merely shared interest.
- How leaders build credibility by being specific about what they need.

Application:

A senior design leader frequently operates across functions. You may need alignment from Product, Engineering, Marketing, Sales, Customer Success, Finance, Legal, or the CEO. The ask should match the stakeholder. A CFO may need an investment rationale. A CTO may need a capacity tradeoff. A CMO may need launch timing clarity. A CEO may need a recommendation and risk summary. Coalition building improves when each stakeholder knows the action you need from them.` ,
              prompt: `Choose one stakeholder for a current initiative and define the specific ask you need from them.`,
              completionRequired: true
            },
            {
              id: "frame-ask-video",
              type: "video",
              title: "Video Assignment: How Great Leaders Inspire Action",
              content: `Video Title: How Great Leaders Inspire Action
Source: TED / Simon Sinek
URL: https://www.youtube.com/watch?v=qp0HIF3SfI4

Why this video matters:

This video is useful for observing how a leader creates movement by making direction and desired belief clear. It is not a board meeting recording, but it gives you a clean public example of communication designed to create action rather than merely transfer information.

While watching, focus less on the famous framework and more on the audience effect. What is the speaker asking the audience to believe, support, or do differently after the talk? How does the structure build toward that ask? How does the message create a reason to act?

While watching:

- What is the speaker asking for?
- Is the ask explicit or implied?
- Who owns the decision or action after the message?
- What timeline is implied?
- How does the speaker create accountability?
- What would make the ask stronger in an executive meeting?

The leadership exercise is to translate inspiration into executive specificity. In a company setting, a talk cannot stop at belief. It must connect to a decision, commitment, or next step.` ,
              prompt: `Write one explicit executive ask that could follow from the video. Name the action, owner, and timing.`,
              completionRequired: true
            },
            {
              id: "frame-ask-core-concept",
              type: "concept",
              title: "Core Concept: The Difference Between a Problem and an Ask",
              content: `Many leaders stop here:

"There is a problem."

Strong leaders continue:

"Here is what should happen."

The highest-performing leaders communicate recommendation, rationale, ask, owner, and timeline.

A problem statement is useful, but it is not enough. "Checkout abandonment continues to be a concern" may be accurate. It may even be important. But it does not tell the room what to do. Should the team investigate? Should leadership approve a roadmap change? Should engineering reallocate capacity? Should marketing pause a campaign? Should the launch move? Should someone make a tradeoff decision?

An ask creates a decision point.

Weak: "Checkout abandonment continues to be a concern."

Stronger: "I recommend prioritizing checkout improvements in Q3 and would like approval to reallocate two engineering resources to the effort."

The first statement informs. The second creates a decision.

This distinction is particularly important for design leaders because design teams are often good at identifying friction but less consistent at framing the organizational action needed. A research synthesis may show that customers are confused. A usability test may reveal setup errors. A journey map may expose cross-channel frustration. But the executive room still needs the ask.

Do you need approval to reprioritize? Do you need input before choosing between options? Do you need alignment between Product and Sales? Do you need escalation support to resolve a dependency? Do you need a decision on scope, timing, or quality?

A clear ask is respectful. It tells the audience why they are in the conversation and what role they need to play. It also shows accountability because you are willing to define what happens next.` ,
              completionRequired: true
            },
            {
              id: "frame-ask-examples",
              type: "example",
              title: "Examples: From Information to Decision",
              content: `Example 1:

Weak version:

"Checkout abandonment continues to be a concern."

Executive version:

"I recommend prioritizing checkout improvements in Q3 and would like approval to reallocate two engineering resources to the effort."

Why better:

The first statement informs. The second creates a decision. It also makes the resource implication explicit. Executives can now approve, reject, ask for more evidence, or propose a different tradeoff.

Example 2:

Weak version:

"There are concerns about launch readiness."

Executive version:

"I need a decision by Friday on whether we reduce scope or move the launch date."

Why better:

The second version names the decision, names the deadline, and creates ownership. It prevents the meeting from becoming a general discussion about concern.

Example 3:

Weak version:

"Design and Sales are not fully aligned on the enterprise demo experience."

Executive version:

"I need alignment from Sales and Design by Wednesday on whether the enterprise demo should prioritize configurability or time-to-value. Without that decision, the team will continue designing for two different narratives."

Why better:

The ask makes the conflict actionable. It does not blame either team. It identifies the decision that will reduce wasted work.

Pattern: The stronger version tells the room what decision, approval, alignment, input, or escalation is needed.` ,
              completionRequired: true
            },
            {
              id: "frame-ask-framework",
              type: "framework",
              title: "The Ask Framework",
              content: `Every executive communication should answer five questions.

1. What do I recommend?

The recommendation gives the audience a point of view to react to. Avoid making executives assemble your recommendation from scattered context.

2. Why does it matter?

The rationale connects the recommendation to customer behavior, business impact, strategic priority, risk, or operational cost.

3. What specifically am I asking for?

Name the action. Are you asking for a decision, approval, input, alignment, or escalation?

4. Who needs to act?

Name the owner or decision group. A vague ask to "the team" often means no one owns it.

5. By when?

Timing turns intent into commitment. Without timing, the ask remains optional.

Framework example:

Recommendation: Prioritize onboarding improvements.

Why: Activation appears to be limiting retention.

Ask: Approve onboarding as a Q3 priority.

Owner: Product and Engineering leadership.

Timeline: Decision needed by next planning review.

Executive version:

"I recommend approving onboarding improvements as a Q3 priority because activation friction appears to be limiting retention. Product and Engineering leadership need to confirm the capacity tradeoff by the next planning review."` ,
              completionRequired: true
            },
            {
              id: "frame-ask-types",
              type: "framework",
              title: "Five Types of Executive Asks",
              content: `Most executive asks fall into one of five categories.

1. Decision: Choose between options.

Example: "I need a decision today on whether we reduce scope or move the launch date."

2. Approval: Authorize a recommendation.

Example: "I recommend moving onboarding into the Q3 roadmap and need approval to shift two engineers from reporting work."

3. Input: Provide perspective before a decision.

Example: "Before I finalize the recommendation, I need Sales input on whether this tradeoff affects the enterprise renewal narrative."

4. Alignment: Confirm shared direction.

Example: "I need Product, Design, and Marketing aligned this week on whether the launch story is speed, control, or reliability."

5. Escalation: Remove a blocker.

Example: "I need executive support to resolve the data access dependency with Legal by Friday."

Choosing the ask type matters. If you need a decision but ask for input, the conversation will generate opinions instead of closure. If you need escalation but ask for alignment, the room may agree with you while the blocker remains. If you need approval but frame it as a discussion, leaders may not realize they are being asked to authorize a tradeoff.

Before every executive conversation, write the ask type at the top of your notes. Then write the ask itself in one sentence. This forces clarity before you add evidence.` ,
              completionRequired: true
            },
            {
              id: "frame-ask-guided-one",
              type: "guided_practice",
              title: "Guided Exercise #1: Identify the Ask",
              content: `Statement:

"We wanted to share concerns about roadmap timing."

Question:

What is missing?

Answer:

The ask.

A stronger version depends on what action you need.

If you need a decision:

"I need a decision by Friday on whether we move the analytics work out of Q3 or extend the roadmap timeline."

If you need approval:

"I recommend moving the analytics work out of Q3 and need approval to communicate the revised roadmap this week."

If you need input:

"Before we make the roadmap tradeoff, I need Customer Success input on which accounts would be affected by delaying analytics."

If you need escalation:

"I need executive support to resolve the platform dependency that is putting the Q3 roadmap at risk."

The same vague statement can become several different asks. The right version depends on what movement is required.` ,
              prompt: `Rewrite "We wanted to share concerns about roadmap timing" into three different asks: decision, approval, and escalation.`,
              completionRequired: true
            },
            {
              id: "frame-ask-guided-two",
              type: "guided_practice",
              title: "Guided Exercise #2: Rewrite a Launch Readiness Update",
              content: `Rewrite this statement:

"There are open questions regarding launch readiness."

Requirements:

- Recommendation.
- Ask.
- Owner.
- Timeline.

Sample answer:

"I recommend making a launch readiness decision by Friday. Product and Engineering leadership should determine whether to reduce scope or move the release date. My recommendation is to reduce scope because the remaining quality issues are concentrated in non-critical workflows."

Why this works:

The answer does not simply name concern. It creates a decision point. It also assigns ownership to Product and Engineering leadership and gives a deadline.

A stronger version can include business impact:

"I recommend reducing launch scope by Friday rather than moving the release date. The unresolved quality issues are concentrated in two non-critical workflows, while delaying the full launch would affect the enterprise commitment date. I need Product and Engineering leadership to approve the reduced scope plan by Friday so Marketing and Customer Success can update launch communications."` ,
              prompt: `Write your own version for a launch, roadmap, or staffing decision. Include recommendation, ask, owner, and timeline.`,
              completionRequired: true
            },
            {
              id: "frame-ask-advanced",
              type: "concept",
              title: "Advanced Concept: The Fear of Asking",
              content: `Many leaders avoid asks because they fear rejection, conflict, or accountability.

A vague update feels safer. If you say "there are concerns," no one can reject your recommendation because you have not made one. If you say "we may need to revisit the plan," no one can hold you accountable for a specific next step. If you say "alignment is needed," you do not have to name the person whose decision is required.

The short-term emotional benefit is safety. The organizational cost is delay.

Executives notice this. They may not say it directly, but they can feel when a leader is transferring ambiguity upward instead of structuring it. The leader may be smart, thoughtful, and well-intentioned, but the communication creates work for everyone else.

Strong leaders are willing to create decision points. They accept that an ask can be declined. They accept that a recommendation can be challenged. They accept that naming an owner can create tension. That is part of executive work.

This does not mean every ask should be rigid. You can frame an ask with openness:

"My recommendation is to reduce scope, but the decision I need today is whether we protect the launch date or protect the full feature set."

That sentence is strong because it separates recommendation from decision. It gives a point of view but keeps the executive decision explicit.

The more senior you become, the more your communication should create clarity around action. Avoiding asks may preserve comfort in the moment, but it slows the organization and weakens your executive presence.` ,
              completionRequired: true
            },
            {
              id: "frame-ask-case-study",
              type: "example",
              title: "Case Study: Expanding a Project",
              content: `Scenario:

You need executive support to expand a project. The team has found that the current scope will address the visible workflow issue but not the deeper adoption problem. You believe the initiative should expand, but expansion requires two additional engineers and a tradeoff against lower-priority reporting work.

Version A:

"We have identified opportunities that may require additional investment."

Version B:

"I recommend expanding the initiative and need approval for two additional engineers by next week's planning meeting. Without that decision, we should keep the current scope and accept that the deeper adoption issue will remain unresolved."

Which creates action?

Version B.

Why?

Version A is cautious but vague. It does not say whether a decision is needed, what investment means, who owns the decision, or what happens if the investment is not approved.

Version B is clearer. It makes the recommendation explicit, names the approval needed, gives a deadline, and explains the consequence of not approving the request. It also avoids manipulation. The executive team can still say no. But if they say no, the tradeoff is visible.

A senior design leader should be able to frame this kind of ask without drama. The goal is not to pressure executives. The goal is to make resource decisions honest.` ,
              completionRequired: true
            },
            {
              id: "frame-ask-quiz-one",
              type: "quiz",
              title: "Knowledge Check 1",
              content: `Question: Which statement contains a clear ask?

A. "There are concerns regarding onboarding."

B. "Onboarding may be impacting retention."

C. "I recommend prioritizing onboarding and need approval to move it into the next planning cycle."

Correct answer: C.

Why:

A names concern. B connects the issue to business impact. C creates action by pairing a recommendation with an approval request.` ,
              prompt: `Rewrite option B so it includes a clear ask.`,
              completionRequired: true
            },
            {
              id: "frame-ask-quiz-two",
              type: "quiz",
              title: "Knowledge Check 2",
              content: `Question: What is the purpose of an ask?

A. Provide information.

B. Create action or decision.

C. Demonstrate effort.

Correct answer: B.

Why:

Information is often necessary, but it is not the purpose of the ask. The ask clarifies what movement is needed from the audience.` ,
              prompt: `Name one current communication where you are providing information but need action.`,
              completionRequired: true
            },
            {
              id: "frame-ask-quiz-three",
              type: "quiz",
              title: "Knowledge Check 3",
              content: `Question: Which ask type removes blockers?

A. Approval.

B. Input.

C. Escalation.

Correct answer: C.

Why:

Escalation asks are used when progress requires someone with authority, context, or cross-functional leverage to remove a blocker. Escalation should be specific: name the blocker, owner, deadline, and consequence.` ,
              prompt: `Write one escalation ask for a blocker in your current work.`,
              completionRequired: true
            },
            {
              id: "frame-ask-real-world",
              type: "real_work_application",
              title: "Real-World Assignment",
              content: `Choose a current initiative, decision, roadmap discussion, launch issue, design quality concern, or stakeholder alignment problem.

Create:

1. Recommendation.

2. Business Impact.

3. Ask.

4. Owner.

5. Timeline.

Then rewrite an existing communication using the framework.

Template:

"I recommend [recommendation] because [business impact or risk]. I need [ask type and specific action] from [owner] by [timeline] so that [next step or consequence]."

Example:

"I recommend reducing launch scope because the remaining quality issues are concentrated in two low-usage workflows, while delaying launch would affect the enterprise commitment date. I need Product and Engineering leadership to approve the reduced scope plan by Friday so Marketing and Customer Success can update launch communications."

Before submitting, check whether the ask is specific enough to be accepted, rejected, delegated, or scheduled. If the audience cannot tell what action to take, the ask is not clear enough.` ,
              prompt: `Draft your real-world ask. Then edit it until the action, owner, and timing are impossible to miss.`,
              completionRequired: true
            },
            {
              id: "frame-ask-reflection",
              type: "reflection",
              title: "Reflection",
              content: `Question 1: Which ask type do you use most often?

- Decision.
- Approval.
- Alignment.
- Escalation.
- Input.

Question 2: Which ask type do you avoid?

Question 3: Why do you avoid it?

Question 4: What recent conversation would have benefited from a stronger ask?

Question 5: When you avoid making an ask, what are you usually trying to protect: harmony, optionality, credibility, control, or personal comfort?

Question 6: What is the organizational cost of that avoidance?

Reflection is important because ask clarity is not only a writing behavior. It is a leadership behavior. If you avoid direct asks, your communication may sound collaborative while quietly creating delay. If you overuse asks without rationale, you may sound forceful but not strategic. The executive move is to pair a clear ask with a credible reason.` ,
              completionRequired: true
            },
            {
              id: "frame-ask-vp-lens",
              type: "vp_lens",
              title: "Design Leadership Lens",
              content: `Managers often communicate information.

Directors communicate recommendations.

Executive leaders communicate decisions.

That does not mean a senior leader makes every decision alone. It means they create clarity around the decisions the organization must make. They define what should happen, who owns it, when it must happen, and what tradeoff is being accepted.

For a senior design leader, this skill is central because design leadership often sits between evidence and action. Research may reveal ambiguity. Design may expose quality problems. Product strategy may require tradeoffs. Engineering constraints may create sequencing decisions. Stakeholders may agree that an issue matters while disagreeing about what to do.

The leader's job is to frame the ask.

A weak design executive says, "The experience needs improvement."

A stronger design executive says, "I recommend prioritizing setup simplification because activation friction appears to be limiting retention. I need approval to move this into the next planning cycle and to shift one squad from lower-impact reporting work."

The second version is not less design-led. It is more executive. It connects experience quality to business impact, names the action, and clarifies the tradeoff.

The ability to frame decisions accelerates organizations. The ability to avoid decisions slows them. Great senior design leaders create momentum by helping others understand exactly what action is needed.` ,
              completionRequired: true
            },
            {
              id: "frame-ask-checkpoint",
              type: "checkpoint",
              title: "Completion Criteria",
              content: `This lesson is complete when you have:

- Completed the assigned reading from Influence.
- Completed the supplemental reading from The First 90 Days.
- Watched the assigned video.
- Finished Guided Exercise #1.
- Finished Guided Exercise #2.
- Completed all three knowledge checks.
- Submitted the real-world assignment.
- Completed the reflection questions.
- Written the senior design leader lens note.

Only then should Lesson 4 be marked complete.` ,
              completionRequired: true
            }
          ]
        }),
        lesson({
          id: "communicate-tradeoffs",
          title: "Communicate Tradeoffs",
          objective: "Make prioritization logic visible by explaining what is chosen, what is deferred, and why.",
          estimatedMinutes: 110,
          bookTitle: "Good Strategy Bad Strategy",
          author: "Richard Rumelt",
          assignedConcept: "Focus, leverage, and the kernel of good strategy",
          readingPrompt:
            "Focus on how good strategy concentrates effort and excludes alternatives rather than collecting goals.",
          applicationPrompt:
            "Use the reading to explain why one design priority deserves focus over another.",
          videoTitle: "How to Make Hard Choices",
          videoSource: "TED / Ruth Chang",
          videoUrl: "https://www.youtube.com/embed/8GQZuzIdeQQ",
          whyRelevant:
            "The talk is useful because executive prioritization is a series of hard choices between valuable but incompatible options.",
          videoReflection: "How does the speaker describe choice, values, and the responsibility of deciding between competing paths?",
          concept:
            "Most recommendations are incomplete unless they explain the tradeoff. Senior design leaders must show what is being chosen, what is being deferred, why the choice is strategically sound, and what consequences the organization is accepting.",
          badExample: "I recommend prioritizing onboarding improvements.",
          betterExample:
            "I recommend prioritizing onboarding improvements before dashboard modernization because activation appears to be a larger constraint on retention.",
          whyBetter:
            "The better version communicates a choice, not just a preference. It compares alternatives and makes prioritization logic visible.",
          guidedPrompt:
            "Expand this statement with a competing option, reasoning, and consequence: We should prioritize onboarding.",
          sampleAnswer:
            "I recommend prioritizing onboarding over dashboard modernization because activation affects customers earlier in the lifecycle and appears to be a stronger retention constraint. Dashboard modernization should move to next quarter.",
          quizQuestion: "What is a tradeoff?",
          quizOptions: [
            "A. A risk.",
            "B. A choice between competing priorities.",
            "C. A stakeholder disagreement."
          ],
          correctAnswer: "B. A choice between competing priorities.",
          realWork:
            "Select two competing priorities from your current work and write a one-paragraph recommendation that names the option chosen, the option deferred, rationale, risks, and opportunity cost.",
          reflection: "Do you naturally communicate recommendations, or do you communicate tradeoffs?",
          checkpoint: "Complete the tradeoff framework, guided exercises, knowledge checks, executive communication analysis, real-world assignment, and reflection.",
          stepOverrides: [
            {
              id: "tradeoffs-overview",
              type: "overview",
              title: "Overview",
              content: `This lesson is about one of the clearest markers of executive judgment: communicating tradeoffs.

Many leaders can make recommendations. Fewer leaders can explain what their recommendation costs. That difference matters because executives are not only choosing what to do. They are choosing what to do instead of something else. Every roadmap decision uses capacity that could have gone elsewhere. Every design initiative delays another improvement. Every quality investment competes with speed, scope, revenue work, technical debt, stakeholder requests, or customer commitments.

A senior design leader must be able to name those choices clearly. If you say, "I recommend prioritizing onboarding," you have communicated a preference. If you say, "I recommend prioritizing onboarding before dashboard modernization because activation appears to be a larger constraint on retention," you have communicated a choice. The second version shows comparison, rationale, prioritization logic, and business judgment.

Tradeoffs are not a weakness in the recommendation. They are evidence that prioritization occurred. In executive rooms, a recommendation that does not mention what is being deprioritized can sound naive. It may imply that the organization has unlimited capacity, no competing goals, and no opportunity cost. Senior leaders know that is never true.

This lesson teaches you to make prioritization logic visible. You will practice naming the competing options, explaining why one option deserves focus, acknowledging consequences, identifying assumptions, and communicating uncertainty responsibly. The goal is not to make every decision feel final. The goal is to show the quality of your judgment so executives can trust how you allocate attention and resources.` ,
              completionRequired: false
            },
            {
              id: "tradeoffs-outcomes",
              type: "learning_objectives",
              title: "Lesson Outcome",
              content: `By the end of this lesson, you should be able to:

- Identify tradeoffs in design and product decisions.
- Communicate competing priorities clearly.
- Explain why one option is being chosen over another.
- Avoid recommendation-only communication.
- Demonstrate executive judgment.
- Make prioritization logic visible.
- Communicate uncertainty responsibly.

The practical test is whether your recommendation answers the executive question behind the question: why this, why now, and why not the other thing?

A weak recommendation says what should happen. A stronger recommendation explains the decision logic. A senior recommendation also names what is being delayed, reduced, or accepted as a consequence. This does not make the message negative. It makes the message trustworthy.` ,
              completionRequired: true
            },
            {
              id: "tradeoffs-why-matters",
              type: "why_this_matters",
              title: "Why This Matters",
              content: `Many product leaders communicate recommendations. Few communicate tradeoffs.

Weak communication:

"We should prioritize onboarding."

Executive communication:

"I recommend prioritizing onboarding before dashboard improvements because activation is currently a larger constraint on retention and growth."

Notice the difference. The first statement communicates a preference. The second communicates a choice.

Executives are paid to make choices. Tradeoffs are the language of strategy. Without tradeoffs, you are communicating wishes. With tradeoffs, you are communicating judgment.

Manager mindset: "This customer problem is important."

Director mindset: "This customer problem is important and should be prioritized in the roadmap."

Senior design leadership mindset: "This customer problem should be prioritized ahead of dashboard modernization because it affects activation earlier in the customer lifecycle and appears to create a larger retention constraint. The consequence is that dashboard modernization moves to next quarter, which is acceptable because its current impact is concentrated in a smaller segment."

The senior leadership version is stronger because it shows the decision logic. It does not pretend every issue can be solved at once. It names the cost of the recommendation and explains why that cost is acceptable.

This matters especially in design leadership because design teams often see many valid problems at the same time. The onboarding flow is confusing. The dashboard is outdated. Search is difficult. Reporting lacks clarity. Accessibility needs work. The design system is inconsistent. Customer trust is fragile. All of these may be true. Executive leadership requires deciding which problem receives attention first and why.

When you communicate tradeoffs well, you help the organization focus. When you avoid tradeoffs, you make prioritization look easier than it is and leave the hard choices hidden for someone else to resolve.` ,
              completionRequired: true
            },
            {
              id: "tradeoffs-reading",
              type: "reading",
              title: "Reading Assignment: Good Strategy Bad Strategy",
              content: `Book: Good Strategy Bad Strategy
Author: Richard Rumelt
Assigned Reading: Chapter 5: The Kernel of Good Strategy; Chapter 7: Using Leverage

Why these chapters matter:

Rumelt argues that strategy is not a collection of goals. Strategy requires diagnosis, guiding policy, coherent action, focus, and leverage. In practice, that means choosing. A strategy that tries to pursue everything is usually not a strategy. It is a list of aspirations.

This connects directly to tradeoff communication. Every meaningful strategy excludes alternatives. Tradeoffs are not evidence that a recommendation is weak. Tradeoffs are evidence that the leader understands focus.

What to look for while reading:

- Why focus is difficult.
- Why organizations avoid tradeoffs.
- What happens when leaders try to pursue everything.
- What leverage means.
- Which roadmap items currently lack a clear strategic rationale.

Application to senior design leadership:

Product design organizations often have more important work than capacity. A design executive must decide where design effort creates the most leverage. Does improving onboarding unlock retention? Does fixing search improve conversion across the full customer base? Does dashboard modernization protect enterprise renewals? Does design system work accelerate future delivery? The answer depends on diagnosis, business context, and timing.

As you read, connect Rumelt's idea of leverage to your current roadmap. Which initiative concentrates effort where the business constraint is strongest? Which initiatives are important but lower leverage right now?` ,
              prompt: `After reading, identify one current roadmap item that looks important but may not be the highest-leverage use of design capacity right now. Explain why.`,
              completionRequired: true
            },
            {
              id: "tradeoffs-supplemental-reading",
              type: "reading",
              title: "Supplemental Reading: Influence",
              content: `Book: Influence
Author: Robert Cialdini
Assigned Reading: Authority

Why this chapter matters:

People are more likely to follow leaders who communicate confidence and reasoning. Tradeoffs help establish credibility because they demonstrate thoughtful judgment. A leader who says "we should do this" may be right. A leader who says "we should do this before that, because this constraint is more material right now" sounds more senior.

Authority in this context does not mean force. It means earned confidence. You earn confidence by showing that you have considered alternatives, consequences, and uncertainty. Tradeoff communication helps executives see how you think.

What to look for:

- How credibility is formed.
- Why people trust leaders who can explain reasoning.
- How specificity strengthens authority.
- How overconfidence can weaken trust.

Application:

When you communicate a design priority, include the alternative you are not choosing. This makes your reasoning visible. It also invites a better conversation. Executives can challenge your assumptions, agree with your prioritization, or ask for more evidence. That is far better than reacting to a preference with no visible logic.` ,
              prompt: `Write one recommendation that names both the chosen option and the option you would defer.`,
              completionRequired: true
            },
            {
              id: "tradeoffs-video",
              type: "video",
              title: "Video Assignment: How to Make Hard Choices",
              content: `Video Title: How to Make Hard Choices
Source: TED / Ruth Chang
URL: https://www.youtube.com/watch?v=8GQZuzIdeQQ

Why this video matters:

This video is useful because product and design prioritization often involves hard choices between options that are each valuable in different ways. Executive tradeoffs are rarely obvious choices between good and bad. They are usually choices between good and good, urgent and important, short-term and long-term, growth and quality, speed and confidence, customer value and business timing.

While watching, observe how the speaker frames hard choices as moments where values and judgment become visible. That is exactly what executive prioritization requires. Your recommendation reveals what you believe matters most under constraint.

While watching:

- What tradeoffs are discussed?
- How does the speaker describe options that cannot be compared by one simple metric?
- How does choice reveal values?
- How does this apply to roadmap prioritization?
- What uncertainty remains when a hard choice is made?

After watching, translate the idea into your work. When two initiatives both matter, what value system are you using to choose? Retention over polish? Activation over modernization? Strategic customer commitments over broad usability? Delivery speed over confidence? Naming that logic is executive communication.` ,
              prompt: `Write one paragraph connecting the video to a current design prioritization decision.`,
              completionRequired: true
            },
            {
              id: "tradeoffs-core-concept",
              type: "concept",
              title: "Core Concept: All Prioritization Is Tradeoffs",
              content: `Most product teams think prioritization means asking, "What should we do?"

Executive teams think, "What should we do instead of something else?"

This distinction matters. A roadmap without tradeoffs is not a roadmap. It is a wishlist.

When a leader recommends onboarding, dashboard modernization, search improvements, reporting enhancements, personalization, design system investment, accessibility work, and technical debt reduction all at once, the recommendation may reflect real needs. But it does not create focus. It shifts the burden of prioritization to capacity planning, stakeholder negotiation, or whoever has the loudest request.

Executive prioritization begins when you acknowledge constraint. There is limited time, limited engineering capacity, limited design attention, limited executive patience, limited launch bandwidth, limited customer tolerance for change, and limited organizational energy. Because capacity is finite, the recommendation must explain what is being chosen and what is being deferred.

A strong prioritization message answers:

- What should we do?
- What are we not doing?
- Why is this more important?
- What are the consequences?
- What assumptions exist?

This is not bureaucracy. It is judgment in visible form.

For a senior design leader, tradeoff clarity also protects the team. If the organization wants design quality, faster delivery, deeper research, broader experimentation, executive polish, and lower headcount all at once, the design leader has to expose the tradeoff. Otherwise the team absorbs impossible expectations silently. Clear tradeoff communication helps the organization make honest decisions about what it values most right now.` ,
              completionRequired: true
            },
            {
              id: "tradeoffs-executive-model",
              type: "framework",
              title: "The Executive Prioritization Model",
              content: `Every recommendation should answer five questions.

1. What should we do?

State the recommendation clearly. Do not make the room infer your preferred path.

2. What are we not doing?

Name the competing option or deferred work. This is where the recommendation becomes a tradeoff.

3. Why is this more important?

Explain the business, customer, strategic, operational, or risk-based rationale. The reason should be specific enough to evaluate.

4. What are the consequences?

Name what gets delayed, reduced, risked, or left unresolved. Consequences do not weaken the recommendation. They make it honest.

5. What assumptions exist?

Identify the uncertain beliefs behind the recommendation. For example, you may assume activation is a stronger retention constraint than dashboard usability, or that search affects more high-intent customers than personalization.

Example:

Recommendation: Improve onboarding.

Deferred option: Dashboard modernization.

Reasoning: Activation affects more customers earlier in the lifecycle and appears to influence retention.

Consequence: Dashboard modernization moves to next quarter.

Assumption: Improving setup completion will have a larger near-term retention effect than improving account visibility.

Executive version:

"I recommend prioritizing onboarding before dashboard modernization because activation appears to be a larger constraint on retention. The consequence is that dashboard modernization moves to next quarter. The main assumption is that improving setup completion will create more near-term retention leverage than improving account visibility."` ,
              completionRequired: true
            },
            {
              id: "tradeoffs-examples",
              type: "example",
              title: "Examples: Recommendation Versus Tradeoff",
              content: `Example 1:

Weak version:

"I recommend prioritizing onboarding improvements."

Executive version:

"I recommend prioritizing onboarding improvements before dashboard modernization because activation appears to be a larger constraint on retention."

Why better:

The recommendation includes comparison, rationale, and prioritization logic. The audience can now understand the choice.

Example 2:

Weak version:

"We should improve search."

Executive version:

"I recommend improving search before personalization because discovery friction is affecting all users, while personalization primarily affects repeat visitors."

Why better:

The recommendation explains scope, impact, and prioritization. It also shows that personalization may still be valuable, just not the strongest next investment.

Example 3:

Weak version:

"We should invest in the design system."

Executive version:

"I recommend investing in the design system before adding more net-new UI patterns because inconsistency is now slowing delivery across three squads. The consequence is fewer new interaction explorations this quarter, but the leverage is faster execution and lower quality risk next quarter."

Why better:

The executive version explains the tradeoff between infrastructure and feature exploration. It connects design system work to business-relevant outcomes: speed, quality, and leverage.` ,
              completionRequired: true
            },
            {
              id: "tradeoffs-framework",
              type: "framework",
              title: "The Tradeoff Framework",
              content: `When making a recommendation, communicate five elements.

1. Option A.

What is one possible path?

2. Option B.

What is the competing path?

3. Recommendation.

Which option do you recommend?

4. Reasoning.

Why is this the better use of attention or capacity right now?

5. Consequences.

What does the organization accept by choosing this option?

Framework example:

Option A: Improve onboarding.

Option B: Modernize dashboard.

Recommendation: Improve onboarding.

Reasoning: Activation impacts more customers and influences retention earlier in the lifecycle.

Consequences: Dashboard modernization is delayed until next quarter.

Executive paragraph:

"I recommend improving onboarding before modernizing the dashboard. Activation impacts more customers earlier in the lifecycle and appears to influence retention more directly. The consequence is that dashboard modernization moves to next quarter, but that is acceptable because its current impact is concentrated in a smaller set of existing accounts."

This framework prevents a common mistake: presenting only the preferred option. Executives need to know what the recommendation is being compared against. Without the comparison, they cannot assess prioritization quality.` ,
              completionRequired: true
            },
            {
              id: "tradeoffs-guided-one",
              type: "guided_practice",
              title: "Guided Exercise #1: Expand the Recommendation",
              content: `Original statement:

"We should prioritize onboarding."

Task:

Expand it using the Tradeoff Framework.

Required:

- Competing option.
- Recommendation.
- Reasoning.
- Consequence.

Strong answer:

Competing option: Dashboard modernization.

Recommendation: Prioritize onboarding.

Reasoning: Activation friction appears to be limiting retention earlier in the customer lifecycle, while dashboard issues primarily affect existing users after setup.

Consequence: Dashboard modernization moves to next quarter.

Executive version:

"I recommend prioritizing onboarding before dashboard modernization because activation friction appears to be limiting retention earlier in the customer lifecycle. Dashboard modernization remains important, but it should move to next quarter while we address the stronger retention constraint."

Why this works:

The answer communicates judgment. It does not claim dashboard modernization is unimportant. It explains why onboarding is more important now.` ,
              prompt: `Rewrite "We should prioritize onboarding" using a competing option from your own work. Include the consequence.`,
              completionRequired: true
            },
            {
              id: "tradeoffs-guided-two",
              type: "guided_practice",
              title: "Guided Exercise #2: Choose Between Two Initiatives",
              content: `Scenario:

You have budget for only one initiative.

Option A: Checkout optimization.

Option B: Account dashboard redesign.

Create:

- Recommendation.
- Reasoning.
- Consequences.
- Assumptions.

Example answer:

Recommendation: Prioritize checkout optimization.

Reasoning: Checkout affects high-intent customers at the point of conversion, while the dashboard redesign mainly improves post-purchase management for existing customers.

Consequences: Account dashboard redesign is delayed, which may frustrate some existing customers and Customer Success stakeholders.

Assumptions: Funnel friction is a larger near-term business constraint than account management friction, and the checkout issues can be improved without a full platform redesign.

Executive version:

"I recommend prioritizing checkout optimization over account dashboard redesign because checkout friction affects high-intent customers at the point of conversion. The consequence is delaying dashboard improvements, which may frustrate some existing customers, but the near-term business leverage appears stronger in conversion. The main assumption is that checkout friction is a larger constraint than account management friction this quarter."` ,
              prompt: `Create your own recommendation, reasoning, consequences, and assumptions for the checkout versus dashboard scenario.`,
              completionRequired: true
            },
            {
              id: "tradeoffs-opportunity-cost",
              type: "concept",
              title: "Advanced Concept: Opportunity Cost",
              content: `Executives care deeply about what happens if we do this. But they care equally about what happens if we do not.

Every investment has an opportunity cost. Every roadmap decision excludes another roadmap decision. Every design sprint spent on one initiative is a design sprint not spent somewhere else.

Opportunity cost is often hidden in product communication. A leader says, "We should improve search," but does not say that doing so delays onboarding. A leader says, "We need to modernize the dashboard," but does not say that modernization will reduce capacity for enterprise reporting. A leader says, "We should increase research depth," but does not say that deeper research may slow delivery.

Strong executive communication acknowledges this.

Example:

"I recommend improving search before personalization. The opportunity cost is delaying personalization work for repeat visitors. I think that is acceptable because search friction affects both new and returning users, and it appears to be limiting discovery for high-intent customers."

This sentence is stronger because it names the cost and explains why the cost is acceptable.

Opportunity cost also prevents false alignment. Stakeholders may agree that search matters until they realize personalization will be delayed. Naming the tradeoff early creates a more honest decision. It is better to surface disagreement before resources are committed than after the team has already started execution.

For a senior design leader, opportunity cost communication is a form of leadership maturity. It shows that you understand the full system, not just the work you want funded.` ,
              completionRequired: true
            },
            {
              id: "tradeoffs-case-study",
              type: "example",
              title: "Case Study: One Initiative Can Move Forward",
              content: `Scenario:

The team wants four initiatives:

- Onboarding improvements.
- Dashboard redesign.
- Search improvements.
- Reporting enhancements.

Resources allow only one initiative this quarter.

Bad:

"We should improve onboarding."

Better:

"I recommend improving onboarding because activation is affecting retention more significantly than dashboard, search, or reporting concerns."

Best:

"I recommend prioritizing onboarding this quarter because activation is currently the strongest constraint on retention. Search and reporting remain important but appear to have less near-term business impact. Dashboard improvements will be deferred until activation metrics improve."

Why best works:

The best version does four things. It names the recommendation. It compares the alternatives. It explains the business rationale. It states the consequence.

It also avoids a subtle leadership failure: pretending the deferred work does not matter. Search, reporting, and dashboard improvements may all be valid. The question is not whether they matter. The question is whether they matter more than onboarding right now.

A senior design leader would support this recommendation with evidence: activation funnel data, retention cohorts, customer research, support tickets, revenue exposure, or implementation constraints. But the executive sentence already shows the shape of the decision. It makes the strategy visible.` ,
              completionRequired: true
            },
            {
              id: "tradeoffs-quiz-one",
              type: "quiz",
              title: "Knowledge Check 1",
              content: `Question: Which statement demonstrates the strongest executive thinking?

A. "We should improve onboarding."

B. "Onboarding is important."

C. "I recommend prioritizing onboarding before dashboard modernization because activation appears to be a larger retention constraint."

Correct answer: C.

Why:

C communicates the recommendation as a choice between competing priorities. It includes comparison and rationale, which makes the prioritization logic visible.` ,
              prompt: `Write one sentence explaining why C is stronger than A.`,
              completionRequired: true
            },
            {
              id: "tradeoffs-quiz-two",
              type: "quiz",
              title: "Knowledge Check 2",
              content: `Question: What is a tradeoff?

A. A risk.

B. A choice between competing priorities.

C. A stakeholder disagreement.

Correct answer: B.

Why:

A risk may be part of a tradeoff, and stakeholder disagreement may reveal a tradeoff, but the tradeoff itself is the choice between competing priorities under constraint.` ,
              prompt: `Name one tradeoff currently present in your work.`,
              completionRequired: true
            },
            {
              id: "tradeoffs-quiz-three",
              type: "quiz",
              title: "Knowledge Check 3",
              content: `Question: Why do tradeoffs increase credibility?

A. They make communication longer.

B. They demonstrate judgment and prioritization.

C. They eliminate uncertainty.

Correct answer: B.

Why:

Tradeoffs increase credibility because they show the leader has considered alternatives, consequences, and opportunity cost. They do not eliminate uncertainty. They make uncertainty easier to evaluate.` ,
              prompt: `Write one sentence that names a consequence of your recommendation.`,
              completionRequired: true
            },
            {
              id: "tradeoffs-real-world",
              type: "real_work_application",
              title: "Real-World Assignment",
              content: `Select two competing priorities from your current work.

Examples:

- Onboarding versus reporting.
- Search versus personalization.
- Technical debt versus feature delivery.
- Design system investment versus net-new experience work.
- Research depth versus delivery speed.
- Accessibility remediation versus roadmap expansion.

Create:

1. Option A.

2. Option B.

3. Recommendation.

4. Business Rationale.

5. Risks.

6. Consequences.

7. Opportunity Cost.

Then write a one-paragraph executive recommendation.

Template:

"I recommend [Option A] before [Option B] because [business rationale]. The consequence is [what is delayed, reduced, or accepted]. The main risk is [risk]. The opportunity cost is [what we do not get by choosing this path], but I believe this is the stronger choice because [strategic rationale]."

Before submitting, check whether the paragraph makes the tradeoff impossible to miss. A reader should be able to identify what you chose, what you did not choose, why, and what consequence you accept.` ,
              prompt: `Draft your one-paragraph executive recommendation using the template.`,
              completionRequired: true
            },
            {
              id: "tradeoffs-executive-analysis",
              type: "real_work_application",
              title: "Real Executive Communication Analysis",
              content: `Review one real executive communication artifact:

- A shareholder letter.
- An investor presentation.
- An earnings call transcript.
- An investor day presentation.
- A CEO or product executive interview.

Identify:

1. Recommendation or strategic direction.

2. Tradeoff.

3. Investment priority.

4. Opportunity cost.

5. Strategic rationale.

Document your observations.

What to look for:

Executives often do not say "tradeoff" explicitly. They communicate tradeoffs through language about focus, investment, discipline, sequencing, operating leverage, resource allocation, long-term bets, or near-term constraints. Notice what receives attention and what is implicitly deprioritized.

For example, if a company emphasizes AI infrastructure investment, what else is receiving less attention? If a company emphasizes margin discipline, what growth investments might be constrained? If a company emphasizes enterprise customers, what consumer or self-serve work might be less central?

The goal is to train your ear. Executive communication is full of tradeoffs, but they are often embedded in strategy language.` ,
              prompt: `Summarize the executive communication artifact you reviewed and identify the tradeoff you observed.`,
              completionRequired: true
            },
            {
              id: "tradeoffs-reflection",
              type: "reflection",
              title: "Reflection",
              content: `Question 1: Do you naturally communicate recommendations or tradeoffs?

Question 2: What tradeoffs do you avoid discussing?

Question 3: Why do you avoid them?

Question 4: What decision from the past month would have been stronger if you had explicitly communicated opportunity cost?

Question 5: Which stakeholder group tends to resist tradeoff clarity in your environment?

Question 6: Where are you currently allowing the team to believe everything can happen?

Reflection matters because tradeoffs can feel uncomfortable. Naming a tradeoff can disappoint a stakeholder, expose a capacity limit, or force a decision that people were avoiding. But avoiding the tradeoff does not remove it. It only hides it until later, usually when the cost is higher.

The executive habit is to surface tradeoffs early enough that the organization can make conscious choices.` ,
              completionRequired: true
            },
            {
              id: "tradeoffs-vp-lens",
              type: "vp_lens",
              title: "Design Leadership Lens",
              content: `Most product managers ask:

"What should we build?"

Strong directors ask:

"What should we prioritize?"

Senior design leaders ask:

"What should we prioritize instead of something else?"

This is one of the defining characteristics of executive judgment. Executives are resource allocation leaders. Their job is not generating ideas. Their job is choosing among them.

For design executives, this can be difficult because design quality is multi-dimensional. You can always identify more work worth doing. More research would improve confidence. More craft would improve quality. More design system work would improve consistency. More usability work would reduce friction. More accessibility work would reduce exclusion and risk. More strategic exploration would improve long-term direction.

All of that may be true. But executive leadership requires focus.

Tradeoffs make prioritization visible. Prioritization makes strategy visible. Strategy creates organizational focus. That chain begins with communicating tradeoffs clearly.

A senior design leader who communicates tradeoffs well earns influence because they help the organization make better choices. They do not merely advocate for design work. They explain which design work matters most under constraint, which work should wait, and what consequence the organization is accepting.

That is how design leadership becomes strategic leadership.` ,
              completionRequired: true
            },
            {
              id: "tradeoffs-checkpoint",
              type: "checkpoint",
              title: "Completion Criteria",
              content: `This lesson is complete when you have:

- Completed the assigned reading from Good Strategy Bad Strategy.
- Completed the supplemental reading from Influence.
- Watched the assigned video.
- Finished Guided Exercise #1.
- Finished Guided Exercise #2.
- Completed all three knowledge checks.
- Completed the Executive Communication Analysis.
- Submitted the Real-World Assignment.
- Completed the reflection questions.
- Written the senior design leader lens note.

Only then should Lesson 5 be marked complete.` ,
              completionRequired: true
            }
          ]
        }),
        lesson({
          id: "final-project",
          title: "Capstone Project: Rewrite a Real Executive Update",
          objective: "Synthesize the full course by transforming a real work artifact into executive-ready communication.",
          estimatedMinutes: 150,
          bookTitle: "Made to Stick, Influence, Good Strategy Bad Strategy, The First 90 Days",
          author: "Chip Heath and Dan Heath, Robert Cialdini, Richard Rumelt, and Michael Watkins",
          assignedConcept:
            "Simplicity, credibility, commitment, authority, strategic focus, leverage, stakeholder management, and organizational context.",
          readingPrompt: "Review the specific chapters and concepts used across Lessons 1-5 before beginning the rewrite.",
          applicationPrompt: "Use the full course to diagnose and rewrite a real executive-facing communication artifact.",
          videoTitle: "The Art of Choosing",
          videoSource: "TED / Sheena Iyengar",
          videoUrl: "https://www.youtube.com/embed/lDq9-QxvsNU",
          whyRelevant:
            "The talk reinforces that executive communication often requires choosing a path and explaining the values, constraints, and consequences behind that choice.",
          videoReflection: "What does the speaker reveal about choice, clarity, and the burden of decision-making?",
          concept:
            "The capstone turns the course into evidence of skill. You will take a real communication artifact and rewrite it so the recommendation, business impact, ask, tradeoffs, risks, and supporting context are clear.",
          badExample: "Here is a long chronological status update with the recommendation hidden at the end.",
          betterExample:
            "I recommend the scoped launch plan because it protects the highest-impact customer workflow while reducing timeline risk. The tradeoff is that reporting enhancements move to the next release.",
          whyBetter:
            "The stronger version leads with the recommendation, makes impact visible, names the tradeoff, and gives leaders something concrete to decide.",
          guidedPrompt:
            "Use the Final Project screen to paste a real update, rewrite it, and score it against the rubric.",
          sampleAnswer:
            "A strong final project makes the recommendation, business impact, ask, tradeoffs, risks, and next step visible within the first few lines.",
          quizQuestion: "What is the first thing executives typically need?",
          quizOptions: [
            "A. Background.",
            "B. Recommendation.",
            "C. Research."
          ],
          correctAnswer: "B. Recommendation.",
          realWork:
            "Complete the capstone workspace with the original version, executive rewrite, recommendation, business impact, ask, tradeoffs, risks, reflection, and rubric scores.",
          reflection: "What communication behavior will you continue practicing after this course?",
          checkpoint: "The course is complete when all lessons, exercises, quizzes, reflections, and the capstone rewrite are completed.",
          stepOverrides: [
            {
              id: "capstone-overview",
              type: "overview",
              title: "Capstone Project Overview",
              content: `This capstone is designed to turn the course from a set of concepts into evidence of skill.

Most communication training teaches principles. Far less communication training produces a real artifact that shows whether those principles can be applied under actual work conditions. The purpose of this capstone is to take a real communication artifact from your work and transform it into executive-ready communication.

Acceptable source materials include:

- Roadmap update.
- Strategy memo.
- Executive email.
- Project proposal.
- Product recommendation.
- Stakeholder presentation.
- Planning document.
- Business case.
- Investment request.

Use a real example whenever possible. The goal is not to write a generic sample. The goal is to practice the skill on material that has real ambiguity, real stakeholders, real business context, and real tradeoffs.

Your final rewrite should demonstrate the full course:

- Lesson 1: Lead With the Point.
- Lesson 2: Separate Context From Recommendation.
- Lesson 3: Make the Business Impact Explicit.
- Lesson 4: Frame the Ask.
- Lesson 5: Communicate Tradeoffs.

For a senior design leader, this is the closest exercise in the course to actual executive work. You are not simply making language more polished. You are making the thinking clearer. The final artifact should help an executive understand what should happen, why it matters, what decision is needed, what is being deprioritized, what risks remain, and what happens next.` ,
              completionRequired: false
            },
            {
              id: "capstone-objective",
              type: "learning_objectives",
              title: "Capstone Objective",
              content: `The purpose of this capstone is to synthesize everything learned in the course.

By the end of this project, you should have produced a communication artifact that demonstrates:

- Executive thinking.
- Strategic framing.
- Business awareness.
- Prioritization.
- Decision-making.
- Leadership judgment.
- Clear writing under constraint.

The final artifact should be meaningfully better than the original. It should not merely be shorter. It should be more useful. It should lead with the recommendation, separate context from decision, connect design work to business outcomes, name the ask, show the tradeoff, and communicate risk without hiding uncertainty.

A strong capstone gives you something you can reuse. It can become a model for future executive updates, roadmap narratives, decision memos, planning requests, or stakeholder communications.` ,
              completionRequired: true
            },
            {
              id: "capstone-why-matters",
              type: "why_this_matters",
              title: "Why This Matters",
              content: `Most communication training teaches concepts. Very little communication training creates evidence of skill.

The goal of this capstone is to produce a communication artifact that demonstrates executive communication in practice. This matters because leadership development is not complete until it changes actual work behavior. A person can understand recommendation-first communication and still send context-heavy updates. A person can understand business impact and still describe design work as activity. A person can understand tradeoffs and still avoid naming what will be deferred.

The capstone closes that gap.

You will take something real and diagnose it. Then you will rewrite it. Then you will review it through the lens of an executive audience. The work should feel more demanding than writing from a blank template because real communication carries history, politics, ambiguity, stakeholder pressure, and incomplete evidence.

For a senior design leader, this is exactly the job. You often receive messy inputs: research findings, product constraints, executive questions, sales pressure, engineering risk, customer needs, and design quality concerns. Your responsibility is to turn that mess into clear judgment.

This project is not about sounding more corporate. It is about being more useful to the organization.` ,
              completionRequired: true
            },
            {
              id: "capstone-reading-review",
              type: "reading",
              title: "Reading Review",
              content: `Review the core reading from the course before beginning the project.

Made to Stick: Simple, Concrete, Credible.

Review how to find the core message, make communication concrete, and support claims without overstatement.

Influence: Authority; Commitment and Consistency.

Review how explicit commitments, clear expectations, and credible authority make action more likely.

Good Strategy Bad Strategy: Kernel of Good Strategy; Leverage.

Review how strategy requires diagnosis, guiding policy, coherent action, focus, and leverage.

The First 90 Days: Stakeholder Management; Organizational Context.

Review how leaders build momentum by understanding stakeholders, context, expectations, and coalition dynamics.

Reading reflection:

1. What communication habit changed most during this course?

2. Which concept has had the greatest impact?

3. Which concept still feels difficult?

4. What communication behavior are you actively trying to develop?

The review is meant to prepare your judgment. You are not reviewing to memorize the books. You are reviewing to apply the concepts to a real artifact.` ,
              prompt: `Answer the four reading reflection questions before beginning the rewrite.`,
              completionRequired: true
            },
            {
              id: "capstone-video",
              type: "video",
              title: "Video Assignment: The Art of Choosing",
              content: `Video Title: The Art of Choosing
Source: TED / Sheena Iyengar
URL: https://www.youtube.com/watch?v=lDq9-QxvsNU

Why this video matters:

The capstone requires choice. You must decide what the communication is really trying to do, what should be included, what should be removed, what action is needed, and what tradeoff must be named. The Art of Choosing is useful because it explores how people approach decisions, constraints, and the experience of choice.

While watching, identify:

1. Recommendation.

2. Business impact or consequence.

3. Ask or implied action.

4. Tradeoff.

5. Risk.

6. Strategic rationale.

The video may not map perfectly to every executive communication element. That is part of the exercise. You are training yourself to listen for structure: what is the point, why does it matter, what choice is being made, and what consequence follows?

Alternative viewing option:

You may instead review an earnings call, investor day presentation, executive interview, or board-style presentation from a company relevant to your work. If you choose an alternative, document the title, source, and URL in your response.` ,
              prompt: `Document the recommendation, business impact, ask, tradeoff, risk, and strategic rationale you observed.`,
              completionRequired: true
            },
            {
              id: "capstone-source-material",
              type: "guided_practice",
              title: "Step 1: Original Communication",
              content: `Paste the original communication.

Examples:

- Email.
- Slack update.
- Roadmap summary.
- Planning document.
- Presentation summary.
- Strategy memo.
- Investment request.

Requirements:

Do not edit the original. Capture the original version exactly as written. The purpose is to preserve the baseline so you can compare the before and after honestly.

If the original contains sensitive information, anonymize names, customers, financials, and internal project names. Do not remove the structural weaknesses. If the original buries the recommendation, keep that. If it has too much context, keep that. If the ask is unclear, keep that. You need the real starting point to diagnose the communication accurately.` ,
              prompt: `Paste the original communication here, or note where you captured it in the Final Project workspace.`,
              completionRequired: true
            },
            {
              id: "capstone-diagnosis",
              type: "guided_practice",
              title: "Step 2: Communication Diagnosis",
              content: `Analyze the original communication before rewriting it.

Identify:

1. Recommendation.

2. Context.

3. Business Impact.

4. Ask.

5. Tradeoffs.

6. Risks.

This step matters because weak communication often hides its weakness. The update may contain useful information but no recommendation. It may contain a recommendation but no business impact. It may contain business impact but no ask. It may ask for action but fail to name the tradeoff. Diagnosis prevents you from simply polishing sentences.

Self-assessment:

Score each category from 1 to 5.

Recommendation Clarity: 1-5.

Business Framing: 1-5.

Ask Clarity: 1-5.

Tradeoff Communication: 1-5.

Executive Readiness: 1-5.

A low score is not failure. It is useful evidence. The point of the capstone is to show improvement.` ,
              prompt: `Diagnose the original communication and score the five categories.`,
              completionRequired: true
            },
            {
              id: "capstone-rewrite-framework",
              type: "framework",
              title: "Step 3: Rewrite Framework",
              content: `Rewrite the communication using this executive communication structure.

Recommendation: What should happen?

Business Impact: Why does it matter?

Ask: What decision, approval, input, alignment, or escalation is needed?

Tradeoffs: What alternatives were considered, and what is being deferred?

Context: What supporting information is necessary and only necessary?

Risks: What uncertainty remains?

This order matters. Do not recreate the original chronology. Executives rarely need the discovery order. They need decision order.

A strong executive version should make the central point clear within the first few lines. It should also be honest. Do not hide risk. Do not overstate certainty. Do not pretend tradeoffs do not exist. Executive-ready communication is not spin. It is clear judgment.

Before moving on, read your rewrite and ask: if a CEO had sixty seconds, would they know what I recommend, why it matters, and what action is needed?` ,
              completionRequired: true
            },
            {
              id: "capstone-open-workspace",
              type: "guided_practice",
              title: "Open Capstone Workspace",
              content: `Use the Final Project workspace to submit the final deliverable.

Complete these fields:

- Original Version.
- Executive Version.
- Recommendation.
- Business Impact.
- Ask.
- Tradeoffs.
- Risks.
- Reflection.

Then score the rubric:

- Recommendation Clarity.
- Business Impact.
- Conciseness.
- Ask Clarity.
- Tradeoff Quality.
- Executive Readiness.

The workspace saves locally. It is the source of truth for your submitted capstone artifact.` ,
              completionRequired: true
            },
            {
              id: "capstone-vp-review",
              type: "reflection",
              title: "Step 4: Design Leadership Review",
              content: `Review the rewritten communication through a senior design leader lens.

Question 1:

Would a CEO understand this communication in under sixty seconds? Why or why not?

Question 2:

Does the communication clearly explain:

- Why now?
- Why this?
- Why not something else?

Question 3:

Would an executive know exactly what action is needed?

Question 4:

Does the communication preserve the customer insight while making the business consequence clear?

Question 5:

Does the rewrite demonstrate judgment, or does it only sound more polished?

This review is intentionally strict. Executive communication is not successful because it reads well. It is successful because it helps a senior audience make a better decision faster.` ,
              prompt: `Answer the five design leadership review questions.`,
              completionRequired: true
            },
            {
              id: "capstone-advanced-review",
              type: "reflection",
              title: "Advanced Review",
              content: `Identify any remaining issues in the rewritten communication.

Examples:

- Too much context.
- Weak recommendation.
- Unclear business impact.
- Missing ask.
- Missing tradeoff.
- Missing risk.
- Vague owner.
- No timeline.
- Overstated certainty.
- Underdeveloped rationale.

Strong leaders revise beyond polish. They look for the communication behavior that is still weak. If your rewrite is clear but avoids tradeoffs, fix the tradeoff. If it has a strong recommendation but a vague ask, fix the ask. If it connects to business impact but overstates certainty, fix the evidence language.

The point is to leave with a reusable standard for your own executive communication.` ,
              prompt: `List the remaining issues and revise one section of your executive version accordingly.`,
              completionRequired: true
            },
            {
              id: "capstone-case-comparison",
              type: "real_work_application",
              title: "Case Study Comparison",
              content: `Compare your rewrite against a real executive communication example.

Choose:

- Shareholder letter.
- Earnings call.
- Investor presentation.
- Executive interview.

Analyze:

1. How quickly is the recommendation or strategic direction established?

2. How is business impact communicated?

3. How are tradeoffs discussed?

4. How is uncertainty handled?

5. What can you borrow?

This exercise trains taste. Real executive communication often compresses enormous complexity into clear strategic language. Notice how senior leaders signal priorities, explain investment choices, acknowledge risk, and create confidence without drowning the audience in process detail.` ,
              prompt: `Summarize the executive example you reviewed and identify one technique you can borrow.`,
              completionRequired: true
            },
            {
              id: "capstone-final-deliverable",
              type: "real_work_application",
              title: "Final Deliverable",
              content: `Submit the following in the Final Project workspace:

Original Version.

Executive Version.

Recommendation.

Business Impact.

Ask.

Tradeoffs.

Risks.

Reflection.

Your Executive Version should be able to stand alone. A senior leader should not need the original version to understand the recommendation, rationale, ask, tradeoff, and risk.

Quality bar:

- The first paragraph carries the recommendation.
- The business impact is explicit.
- The ask is concrete.
- The tradeoff is named.
- The context is supporting, not dominant.
- The risk is clear without undermining the recommendation.
- The communication sounds like leadership judgment, not status reporting.` ,
              prompt: `Confirm that the Final Project workspace contains all deliverable fields.`,
              completionRequired: true
            },
            {
              id: "capstone-final-knowledge-check-one",
              type: "quiz",
              title: "Final Knowledge Check 1",
              content: `Question: What is the first thing executives typically need?

A. Background.

B. Recommendation.

C. Research.

Correct answer: B.

Why:

Executives need to know where the communication is going. Background and research may be necessary, but they should support the recommendation rather than obscure it.` ,
              prompt: `Write one sentence explaining how your capstone leads with the recommendation.`,
              completionRequired: true
            },
            {
              id: "capstone-final-knowledge-check-two",
              type: "quiz",
              title: "Final Knowledge Check 2",
              content: `Question: Which statement best demonstrates executive communication?

A. "We spent several weeks researching onboarding."

B. "We identified a few opportunities."

C. "I recommend prioritizing onboarding because activation appears to be limiting retention."

Correct answer: C.

Why:

C leads with a recommendation and connects it to business impact. A is activity. B is vague. C is decision-oriented.` ,
              prompt: `Rewrite one activity-based sentence from your original communication into an executive sentence.`,
              completionRequired: true
            },
            {
              id: "capstone-final-knowledge-check-three",
              type: "quiz",
              title: "Final Knowledge Check 3",
              content: `Question: Which element is most commonly missing from product communication?

A. Data.

B. Context.

C. Ask.

Correct answer: C.

Why:

Product communication often contains data and context. It less often clarifies the decision, approval, input, alignment, or escalation needed from the audience.` ,
              prompt: `Write the ask from your capstone in one sentence.`,
              completionRequired: true
            },
            {
              id: "capstone-final-knowledge-check-four",
              type: "quiz",
              title: "Final Knowledge Check 4",
              content: `Question: Why are tradeoffs important?

A. They make communication longer.

B. They demonstrate prioritization and judgment.

C. They eliminate risk.

Correct answer: B.

Why:

Tradeoffs show that the leader understands constraint, opportunity cost, and prioritization. They do not eliminate risk. They make the decision more honest.` ,
              prompt: `Name the primary tradeoff in your capstone.`,
              completionRequired: true
            },
            {
              id: "capstone-reflection",
              type: "reflection",
              title: "Capstone Reflection",
              content: `Question 1:

What was the biggest weakness in the original communication?

Question 2:

What improved most?

Question 3:

What still needs improvement?

Question 4:

How has your communication changed since Lesson 1?

Question 5:

What communication behavior will you continue practicing?

Question 6:

What will you use as your personal standard before sending executive communication?

The reflection matters because the course is not complete when the artifact is submitted. The course is complete when you know what behavior you are trying to carry forward.` ,
              prompt: `Complete the six capstone reflection questions.`,
              completionRequired: true
            },
            {
              id: "capstone-vp-lens",
              type: "vp_lens",
              title: "Design Leadership Lens",
              content: `The transition from product or design management to senior design leader is not primarily about product expertise or design taste. Those still matter, but they are not enough.

The transition is about organizational influence.

senior leadership leaders consistently help organizations answer:

- What should we do?
- Why does it matter?
- What should we stop doing?
- What decision is needed?
- What risks exist?

The ability to answer those questions clearly creates trust. Trust creates influence. Influence creates leadership leverage.

This capstone is designed to help you begin practicing that skill. You took a real artifact, diagnosed its weaknesses, rewrote it for executive use, reviewed it against a senior leadership standard, and submitted a final version.

Core behavior: Take complexity in, send clarity out.

For a senior design leader, clarity is not simplification for its own sake. It is a form of leadership. It helps the organization make better decisions, understand customer problems in business terms, allocate resources honestly, and move with focus.` ,
              completionRequired: true
            },
            {
              id: "capstone-completion",
              type: "checkpoint",
              title: "Course Completion Criteria",
              content: `The course is complete when you have:

- Completed all six lessons.
- Completed all quizzes.
- Completed all guided exercises.
- Completed all reflections.
- Submitted the capstone project.
- Submitted the final executive communication rewrite.

Completion status:

Executive Communication Foundations for Design Leaders.

Status: Completed when all course work and the capstone are complete.

Lessons Completed: 6 of 6.

Capstone: Submitted.

Key competencies developed:

- Executive Communication.
- Strategic Framing.
- Business Impact Communication.
- Decision Framing.
- Tradeoff Communication.
- Executive Writing.

The current MVP supports local completion tracking and Markdown export. A downloadable PDF certificate can be added as a separate product feature if you want a formal certificate screen next.` ,
              completionRequired: true
            }
          ]
        }),      ]
    }
  ]
};

export const allLessons = curriculumSeed.units.flatMap((unit) => unit.lessons);
