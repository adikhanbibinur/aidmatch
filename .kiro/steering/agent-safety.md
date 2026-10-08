# AidMatch Agent and Safety Rules

## Core Principle

AidMatch uses AI to support resource-allocation decisions.

The LLM must not be treated as the authoritative source for numerical allocations or database state.

## Source of Truth

The Supabase/PostgreSQL database is the source of truth for:

- donations
- quantities
- organisation needs
- urgency
- locations
- approved allocations

The AI must not invent missing database information.

## Allocation Authority

Exact allocation quantities must come from deterministic application logic.

The LLM may:

- inspect resource information
- choose tools
- compare results
- reason about priorities
- explain decisions

The LLM must not independently invent or alter allocation quantities.

## Human Approval

AI-generated resource allocations are recommendations.

Permanent allocation changes require explicit human approval.

The interface should clearly distinguish:

Recommendation

from:

Approved allocation

## Revalidation

Before committing an allocation:

1. retrieve current database state
2. recalculate the allocation on the backend
3. verify resources are still available
4. only then save the allocation

Do not trust quantities sent from the frontend.

## Tool Use

When current AidMatch information is required, the agent should use tools rather than assumptions.

Examples:

get_donation
get_matching_needs
calculate_allocation

Tool results should be treated as more authoritative than the model's prior assumptions.

## Secrets

Never expose:

- database secret keys
- AI API keys
- authentication secrets

to client-side components.

Never place secrets directly in committed source code.

## Explainability

Agent recommendations should explain:

- which organisation is prioritised
- how much it receives
- why it was prioritised
- whether its need is partially fulfilled
- whether resources remain
- what should happen next

## Claims

The AI must not claim:

- a resource was allocated
- a database record was saved
- an organisation was contacted
- an external action succeeded

unless the relevant backend action actually completed successfully.

## Development Priorities

During the hackathon prioritise:

1. Reliable demo
2. Clear agentic behaviour
3. Explainable decisions
4. Human oversight
5. Strong SDG relevance
6. Simple maintainable architecture

Do not add complexity solely to make the project appear more advanced.