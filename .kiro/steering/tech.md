# AidMatch Technical Stack

## Frontend

Use:

- Next.js
- React
- TypeScript
- Tailwind CSS
- Next.js App Router

Use client components only when browser-side interaction or React state is required.

## Backend

Use Next.js Route Handlers under:

src/app/api/

Backend responsibilities include:

- validation
- database access
- allocation calculations
- AI provider requests
- agent tool execution
- permanent actions

Never place server secrets in frontend components.

## Database

Use:

- Supabase
- PostgreSQL

Current primary tables include:

- donations
- needs
- allocations

Supabase is the persistent source of truth for AidMatch resource data.

## AI

Development AI provider:

- OpenRouter

The provider should be accessed only through backend code.

AI provider configuration belongs in environment variables.

Never expose API keys to the browser.

The architecture should make it possible to replace OpenRouter with Amazon Bedrock later without rewriting the whole application.

## Agent Architecture

The LLM is responsible for:

- reasoning
- choosing tools
- interpreting tool results
- explaining recommendations

Deterministic application code is responsible for:

- exact allocation quantities
- database updates
- validation
- permanent actions

## Current Agent Tools

Examples include:

- getDonation()
- getMatchingNeeds()
- calculateAllocation()

Additional tools should be small, explicit, and reusable.

## Environment Variables

Secrets belong in:

.env.local

Typical variables include:

SUPABASE_URL
SUPABASE_SECRET_KEY
OPENROUTER_API_KEY
OPENROUTER_MODEL

Never commit `.env.local`.

## Deployment

Planned deployment:

- GitHub for source control
- Vercel for the Next.js application
- Supabase for hosted PostgreSQL

Prefer services that support the hackathon MVP without unnecessary infrastructure.

## Engineering Principle

Prefer:

- simple
- testable
- explainable
- reliable

over:

- unnecessary abstractions
- excessive dependencies
- complicated infrastructure