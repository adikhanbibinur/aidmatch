# Agent Activity Timeline — Requirements

## Purpose

AidMatch should visibly demonstrate the actions performed by the AI agent when evaluating a donation.

The timeline must represent real backend agent activity rather than fake frontend animation.

## Requirement 1 — Display Agent Activity

WHEN a user runs the AidMatch agent,
THE SYSTEM SHALL display an activity timeline describing the important steps performed by the agent.

The timeline may include:

- inspecting the selected donation
- retrieving matching organisation needs
- running the deterministic allocation algorithm
- producing the final recommendation
- waiting for human approval

## Requirement 2 — Use Real Tool Activity

WHEN the agent calls a backend tool,
THE SYSTEM SHALL record a corresponding activity entry.

The frontend must not invent tool calls that did not actually occur.

## Requirement 3 — Preserve Existing Allocation Logic

WHEN the agent calculates an allocation,
THE SYSTEM SHALL continue using the existing deterministic allocation algorithm for exact quantities.

The LLM must not independently determine allocation quantities.

## Requirement 4 — Human Approval

WHEN the agent produces a recommendation,
THE SYSTEM SHALL identify the recommendation as awaiting human approval.

The timeline must not claim that an allocation has been completed before approval succeeds.

## Requirement 5 — User Experience

WHEN the timeline is displayed,
THE SYSTEM SHALL present the steps in a clear chronological order suitable for a hackathon demo.

Each activity should include:

- step label
- short description
- status

## Requirement 6 — Existing Architecture

THE SYSTEM SHALL use the existing:

- Next.js architecture
- TypeScript codebase
- OpenRouter agent
- Supabase/PostgreSQL database
- AidMatch agent tools

No additional framework is required for this feature.