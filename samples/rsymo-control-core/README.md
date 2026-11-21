# RSYMO Control: Selected Orchestration Code

**Two real JavaScript modules from a private RSYMO orchestration project, with a standalone demonstration and 12 tests.**

The broader private project coordinates objectives, automation, approvals, execution and verification. This small public sample demonstrates specific parts of the implementation. It is **not** the full system.

## Problem and approach

A work request may ask for analysis, a concrete code change, or no modification at all. Even a concrete change cannot proceed until target files have been identified. Workflow integrations can also deliver payloads as an object or a JSON string.

The two source modules are selected excerpts of the existing private code, published without personal records or integration credentials.

| Source | Responsibility |
| --- | --- |
| [objective-intent.js](objective-intent.js) | Classifies natural language for planning only constraints, concrete change intent and target file presence |
| [workflow-payload.js](workflow-payload.js) | Normalizes workflow payloads and handles malformed JSON |
| [demo.mjs](demo.mjs) | Demonstrates classification on entirely fictional examples, without performing actions |
| [tests/core.test.mjs](tests/core.test.mjs) | 12 unit tests of classification and normalization |

The core source excerpts came from the private RSYMO codebase. The standalone demonstration, tests and this description were prepared for public inspection.

## Run

Node.js 20 or newer. No npm dependencies, API keys, account, model provider or cloud environment.

```bash
npm test
npm run demo
```

Run these commands from this directory. A successful test run proves only the behaviors covered by these checks.

## Safety and scope

**This is a heuristic intent classifier, not an authorization or security boundary.** The `execution_ready` field does not grant permission to edit files. Real code execution requires separate authentication, explicit user and repository permissions, protective tool constraints, validation, and tested recovery for uncertain outcomes.

This demonstration does not execute code changes, make network requests, send messages, deploy infrastructure or invoke an AI model.

The private orchestration system also explores work queues, human approvals, safe runner handoff and recording verified outcomes. Those systems are **not** part of this example and are not claimed to be publicly available.

## Authorship

This work is part of my independent RSYMO software experiments. I define objectives, system behavior and product requirements and use AI coding assistants extensively to develop and iterate. AI tools contribute significant code. I do not claim to have manually written every line or to have delivered this example as a commercial service.

[Back to my engineering profile](../../README.md)
