![cover](./public/cover.png)

# Claude Code ↔ Figma: Building an AI-Powered Portfolio Assistant

### Project Brief
- Date: 2026.02
- Project Name: Claude Code ↔ Figma: Building an AI-Powered Portfolio Assistant
- Tag: AI, MCP, Product Design
- Company: Personal

> "I didn't just build an AI product. I used AI to build it—Claude Code to prototype, Figma MCP to design, and back to Claude Code to ship. The workflow *is* the work."

### Overview
- **Time to Prototype**: [1 days]
- **Demo**: [Screen recording link]
- **Product**: A personal AI assistant embedded in my portfolio website

A personal AI assistant embedded in my portfolio website (bottom-right chat) that helps hiring teams explore my work through conversation—then routes them to verifiable evidence (projects, artifacts, and pages).
放一个动图
- I built a **portfolio-native AI assistant** designed for the hiring-team workflow: ask a question, get a concise answer, and jump directly to proof.
- I ran a full **Claude Code → Figma → Claude Code** loop—starting with a working prototype, translating it into an editable design system, then implementing it back into production UI.
- I designed the assistant around real evaluation scenarios using guided interaction patterns like **cards, curated paths, and keyword/hashtag exploration**, reducing "blank prompt" friction.


### The Problem
Hiring teams evaluate portfolios under time pressure. Even strong candidates can be hard to assess because evidence is scattered, navigation is slow, and different interviewers care about different questions.

I wanted to redesign the portfolio experience around a single loop:

**Ask → understand → verify → continue.**

### The Approach

**Scope**: This was a fast, focused demo—built in 1 day to prove two independent things.

- **AI-native workflow** — that a Claude Code → Figma → Claude Code loop is a real, shippable way to work
- **AI-native product design** — that an assistant built for hiring teams needs guided discovery, not a blank chat box

---

### 1. AI-native workflow: Claude Code → Figma → Claude Code

I intentionally built this project to demonstrate how I work in AI-native teams—fast, iterative, and shippable.

**Prototype in code (Claude Code)**

I vibe-coded a functioning chat experience to validate feasibility and the core interaction flow inside my existing portfolio.

**Translate into editable design (Figma)**

I rebuilt the working UI in Figma as an editable system (not just static mock screens), defining:

- Component structure and interaction states
- Patterns for links, evidence, and "next step" actions
- Responsive behaviour and edge cases (loading, errors, retries)

**Implement back into production (Claude Code)**

I re-applied the Figma decisions to the codebase to ship a polished, production-ready experience.

This loop demonstrates a key AI experience design skill: **bridging prototypes, design craft, and production constraints without losing speed.**

---

### 2. AI-native product design: Guided Discovery, Not Generic Chat

Rather than letting the assistant behave like a general chatbot, I designed it around hiring-team intents, such as:

- "Give me a 60-second overview of you."
- "Show me your most relevant AI/agentic work."
- "How do you think about trust, uncertainty, and transparency?"
- "How do you collaborate with engineers?"

To reduce blank-prompt friction and speed up time-to-proof, I explored interaction patterns including:

- **Cards** that surface recommended projects and "proof bundles" (problem → approach → artifact)
- **Keyword / hashtag exploration** that reflects key themes and routes users to curated evidence
- **Planned guided pathways** (next iteration): shortcut bubbles, tabbed modes (e.g., About / AI Projects / Process / Contact), and scenario categories (Recruiter / Design Lead / Engineer)

**Screen recording**: [link]


### Outcomes
- A portfolio that becomes **interactive and faster to evaluate**, aligned with real interviewer questions.
- Clear evidence of how I design AI experiences: **prototype → systemise → ship → iterate**.
- A demonstration of **brand expression through agent behaviour**: tone, UI polish, and interaction design are intentional—not accidental.
