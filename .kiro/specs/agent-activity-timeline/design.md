# Agent Activity Timeline — Design

## Overview

The AidMatch agent API already records the tools used during the agent loop.

The feature will extend this behaviour by returning structured activity records to the frontend.

## Backend

Endpoint:

src/app/api/agent/route.ts

The endpoint will maintain an activity array during agent execution.

Example:

```json
[
  {
    "type": "tool",
    "title": "Inspected donation",
    "description": "Retrieved donation data",
    "status": "completed"
  }
]