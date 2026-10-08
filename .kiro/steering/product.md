# AidMatch Product Overview

## Product

AidMatch is an agentic AI resource-allocation platform that helps match donated resources with community organisations that need them.

The platform connects two sides:

- donors with available resources
- community organisations with active needs

AidMatch analyses urgency, location, quantity, and resource type to recommend responsible allocations.

## Problem

Useful resources can exist while organisations with urgent needs struggle to obtain them.

The problem is not always lack of resources. It can also be:

- fragmented information
- inefficient matching
- delayed coordination
- poor prioritisation
- lack of visibility into available resources and current needs

AidMatch aims to reduce this coordination gap.

## Core Users

### Donors

Examples:

- individuals
- companies
- university departments
- student organisations
- community groups

Donors can register available resources.

### Community Organisations

Examples:

- shelters
- NGOs
- community centres
- charities
- support organisations

Organisations can register resources they currently need.

## Core Workflow

1. A donor submits a resource.
2. An organisation submits a need.
3. AidMatch retrieves relevant needs.
4. A deterministic allocation algorithm calculates candidate allocations.
5. The AI agent inspects the data and uses available tools.
6. The agent explains the recommendation.
7. A human reviews the recommendation.
8. The backend recalculates against the latest database state.
9. The approved allocation is stored permanently.

## Agentic AI

AidMatch is not intended to be a generic chatbot.

The AI agent should be able to use tools such as:

- get donation data
- retrieve organisation needs
- calculate allocations
- explain recommendations

The agent may decide which tools are necessary to achieve the user's goal.

## Social Impact

AidMatch is designed around responsible resource distribution and supports themes related to:

- SDG 1 — No Poverty
- SDG 10 — Reduced Inequalities
- SDG 11 — Sustainable Cities and Communities
- SDG 12 — Responsible Consumption and Production

The specific SDG framing may be adjusted to match the hackathon challenge.

## Hackathon Goal

The MVP should clearly demonstrate:

- a meaningful social problem
- functional full-stack implementation
- visible agentic AI behaviour
- explainable recommendations
- responsible human oversight
- measurable resource allocation impact