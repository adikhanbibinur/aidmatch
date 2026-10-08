# AidMatch Project Structure

AidMatch uses the Next.js App Router architecture.

## Main Structure

src/
├── app/
│   ├── page.tsx
│   ├── needs/
│   ├── match/
│   └── api/
│
└── lib/

## Pages

Use:

src/app/

for application pages.

Examples:

src/app/page.tsx
- main dashboard

src/app/needs/page.tsx
- organisation needs interface

src/app/match/page.tsx
- allocation and AI agent interface

## API Routes

Use:

src/app/api/

for backend HTTP endpoints.

Examples:

src/app/api/donations/route.ts
src/app/api/needs/route.ts
src/app/api/match/route.ts
src/app/api/agent/route.ts
src/app/api/allocations/commit/route.ts

API routes should handle:

- validation
- authentication when introduced
- backend orchestration
- calling reusable business logic
- returning structured JSON

## Reusable Logic

Use:

src/lib/

for reusable application logic.

Examples:

src/lib/supabase.ts
- Supabase connection

src/lib/openrouter.ts
- AI provider interface

src/lib/aidmatch-tools.ts
- reusable AidMatch agent tools and allocation logic

Do not duplicate major business logic across multiple API routes.

## UI Components

If repeated UI grows, create:

src/components/

Examples may later include:

DonationCard.tsx
NeedCard.tsx
AgentTimeline.tsx
MetricCard.tsx

Do not extract tiny components unnecessarily during the MVP.

## Kiro Files

Use:

.kiro/steering/

for persistent project guidance.

Use:

.kiro/specs/

for structured feature specifications.

## Naming

React components:
PascalCase

Example:
AgentTimeline

Functions and variables:
camelCase

Example:
calculateAllocation

API route folders:
lowercase descriptive names

## General Rule

Keep responsibilities separated:

Frontend
→ presentation and user interaction

API routes
→ HTTP/backend orchestration

lib
→ reusable application/business logic

database
→ persistent source of truth

AI
→ reasoning and tool selection