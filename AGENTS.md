# NarrativeDecay Agents & Operational Guide

This document describes how to run, build and verify the **NarrativeDecay** project, along with internal guidelines for agent behaviour and project hygiene.  Follow these instructions to ensure deterministic builds and safe operation.

## Install and build

1. **Clone and extract**: Download the zipped repository into a fresh directory.  Do **not** reuse a previous build folder.
2. **Install dependencies**: Run `npm ci` at the project root.  This installs exact versions specified in the lockfile.  Avoid `npm install` which may alter the lockfile.
3. **Build**: Execute `npm run build`.  This runs the TypeScript compiler and copies assets.  After building, compiled JavaScript appears in `dist/` and compiled packages are mirrored into `node_modules/@narrative-decay/*/dist` by the build script.

## Run tests

Run unit tests with:

```bash
npm test
```

This executes the compiled tests from `dist/tests/run-tests.js` using `NODE_PATH=dist/packages` to resolve internal modules.  Tests verify that the update workflow correctly transitions theses between states.

## Smoke test

To perform a manual smoke test that seeds sample theses, ingests fixture evidence and prints a summary of which narratives are decaying, run:

```bash
npm run smoke
```

The script uses the same compiled code as the server and worker.  It loads fixtures from `fixtures/raw`, runs the update workflow once and prints a report.  The smoke path is considered successful if it prints a report where one thesis becomes contested (decaying) and another remains forming.

## Start server and dashboard

To start the REST API and serve the web dashboard:

```bash
PORT=3000 npm start
```

This will launch an HTTP server on the given port.  Key routes:

| Route | Method | Description |
| --- | --- | --- |
| `/` | GET | Returns a health message. |
| `/theses` | GET | Returns all theses currently in the ledger. |
| `/thesis/{id}` | GET | Returns a single thesis and its evidence timeline. |
| `/update` | POST | Triggers a run of all agents to fetch evidence, update thesis states and return a summary. |
| `/summary` | GET | Returns the summary from the last update. |
| `/dashboard` | GET | Serves the compiled dashboard HTML. |
| `/web/*` | GET | Serves static dashboard assets such as `index.js`. |

After starting the server, open `http://localhost:3000/dashboard` in your browser.  The dashboard lists theses on the left; clicking a thesis shows its evidence timeline, and the top bar displays the number of strengthening, decaying and inconsistent narratives.  Press the **Refresh** button to trigger an update via the `/update` endpoint.

## Start worker

The worker runs the same update workflow on a schedule or on demand without serving an API.  Run it with:

```bash
NODE_PATH=dist/packages node dist/packages/worker/src/index.js
```

You can schedule this script via cron or your container orchestrator.  It loads fixtures, runs the update once and prints the summary.  To integrate with external data sources, implement additional providers in `packages/providers/src/index.ts` and ensure they return typed `ProviderResult` objects.

## Hygiene and CI

Our repository enforces hygiene rules:

* **No committed build outputs**: `node_modules`, `dist`, `.tsbuildinfo`, compiled JS or DTS files, reports, images and secrets must not be checked in.  The script `npm run hygiene` scans for violations and exits non‑zero if any are found.
* **CI pipeline**: The GitHub Actions workflow in `.github/workflows/ci.yml` runs `npm ci`, `npm run build`, `npm test`, `npm run smoke` and `npm run hygiene` on multiple Node LTS versions.  It uses read‑only permissions and caches dependencies based on the lockfile.
* **Environment variables**: Configuration is done exclusively through environment variables.  See `.env.example` for supported variables.  Do not hardcode secrets in code or commit actual `.env` files.

## Agent behaviour and roles

NarrativeDecay employs a team of specialised agents.  Each agent implements a specific role and returns structured artifacts rather than free‑form strings.  Agents must follow these principles:

* **Source‑quality agent** – assigns confidence and warnings to each source based on reliability, timeliness and publication quality.  Downgrades evidence when sources are unknown or questionable.
* **Evidence extractor** – parses filings, transcripts, headlines and price data to identify fact statements relevant to a thesis.  Handles malformed input gracefully and sets `state: MANUAL_REVIEW` on suspicious data.
* **Contradiction detector** – compares new evidence against the current causal chain.  Flags contradictions and determines whether a thesis becomes contested or decaying.  Does not collapse contradictory evidence into sentiment; each piece is stored in the ledger with an explicit link.
* **Price‑context analyst** – correlates price trends with evidence coherence.  If price continues higher while evidence fragments, it marks the narrative as inconsistent and shortens the half‑life.  Uses explicit states: `UNKNOWN`, `NOT_AVAILABLE`, `LOW_CONFIDENCE`, `MANUAL_REVIEW`, `OK`.
* **Sceptic** – challenges the assumptions and thresholds used by other agents.  Downgrades confidence when evidence is scant or when narratives have become crowded.  Suggests “what would change my mind” triggers.
* **Synthesis lead** – combines artifacts from all agents into updated thesis objects, computes the half‑life window and writes a human‑readable report.  Never invents facts; always references the evidence ledger.

Agents must not output arbitrary recommendations or investment advice.  They return typed objects with `rationale`, `confidence`, `warnings` and `nextManualAction`.  Output must never claim truth because the majority of headlines say something; instead, emphasise the chain of evidence and internal coherence.

## Done criteria

Your implementation is complete when:

* The clean‑clone gate passes: from a fresh clone, running `rm -rf node_modules dist ...`, `npm ci`, `npm run build`, `npm test`, `npm run smoke` and `npm start` produces no errors.
* `npm run hygiene` finds no disallowed files.
* The dashboard loads and displays theses and evidence after triggering an update.
* Smoke tests demonstrate one thesis moving from valid to decaying and another being contested.  The worker and API share the same core pipeline.
* Documentation (`README.md`, `PRODUCT.md`, `AGENTS.md`, research reports) is present and accurate.
* CI passes on all targeted Node LTS versions.

## Do not overclaim

NarrativeDecay is an analysis tool, not a crystal ball.  It does **not** recommend trades or guarantee outcomes.  It highlights when narratives are strengthening, fragmenting or mispriced relative to evidence.  Users must exercise their own judgement and are responsible for their investment decisions.  Make this clear in any communications to avoid regulatory issues.
