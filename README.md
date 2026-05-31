# NarrativeDecay

**NarrativeDecay** is an experimental market‑analysis platform that tracks the half‑life of investment narratives.  Instead of summarising today’s headlines, the app maintains persistent thesis objects that accumulate supporting and contradicting evidence over time.  Each run updates the state of every thesis (forming, crowded, contested, decaying, broken or re‑accelerating) and outputs three lists: narratives that are strengthening, those that are decaying and those whose market pricing appears inconsistent with new evidence.

## Quick start

This repository is a mono‑repo built with strict TypeScript and deterministic build processes.  To run locally:

```bash
git clone <your-fork>.git narrative-decay
cd narrative-decay
npm ci               # install exact dependencies
npm run build        # compile TypeScript and copy assets
npm test             # run unit tests
npm run smoke        # run the smoke path and print a report
PORT=3000 npm start  # start the HTTP API and dashboard
```

Open `http://localhost:3000/dashboard` to use the dashboard.  Click “Refresh” to trigger an update.  The counts of strengthening, decaying and inconsistent narratives will update accordingly.

## Repository layout

The mono‑repo is organised into apps, packages, fixtures, scripts and docs:

```
narrative-decay/
  apps/
    web/             # frontend dashboard (HTML & TS)
  packages/
    core/            # shared types and ledger implementation
    data/            # fixture loading and future data accessors
    providers/       # data providers (placeholder for external APIs)
    agents/          # state evaluation logic (agent roles)
    workflows/       # orchestrates providers and agents into updates
    reports/         # report generation logic
    server/          # HTTP server exposing API and dashboard
    worker/          # CLI worker for scheduled runs
  fixtures/
    raw/             # sample theses and evidence used by smoke tests
  tests/             # unit tests (compiled to dist/tests)
  scripts/
    build.js         # deterministic build script using TypeScript compiler
    check-repo-hygiene.js # ensures no forbidden files are committed
    smoke.ts         # smoke test executed via npm run smoke
  research/
    competitor_matrix.md
    benchmark_ladder.md
  PRODUCT.md
  AGENTS.md
  DEMO.md (to be created separately)
```

The compiled output appears in `dist/`, but this directory is not committed.  Instead, the build script copies compiled sources into `node_modules/@narrative-decay/<pkg>/dist` so that Node can resolve internal modules when run via `npm test` and `npm start`.

## Feature overview

* **Thesis ledger** – central in‑memory store of all theses and evidence.  Each evidence entry links back to its thesis and records timestamps, source quality and contradictions.
* **Multi‑agent pipeline** – specialised agents evaluate new evidence: source quality assessment, evidence extraction, contradiction detection, price context analysis, scepticism and synthesis.  Agents return typed artifacts with confidence and rationale.
* **Narrative states & half‑life** – each thesis is assigned a state (forming, crowded, contested, decaying, broken, re‑accelerating) and a half‑life that widens or narrows based on evidence strength and contradictions.
* **Web dashboard** – simple HTML/JS UI that lists theses, displays evidence timelines and shows counts of strengthening, decaying and inconsistent narratives.  Updates are triggered manually for demonstration.
* **API & worker** – REST endpoints to fetch theses, run updates and get the last summary; a CLI worker script that can be scheduled independently.
* **Research & documentation** – competitor matrix, benchmark ladder and product definition provide context and rationale.

## Configuration

All configuration is done through environment variables.  See `.env.example` for supported variables.  At minimum you can set `PORT` to control the server port.  Future providers (e.g., news APIs) should read API keys from the environment instead of hardcoding them.

## Contributing and licence

This project is an experimental prototype aimed at demonstrating disciplined multi‑agent architectures with persistent memory for financial narratives.  It is not investment advice.  Contributions are welcome via pull requests.  Ensure that your code passes `npm run hygiene` and all CI checks.  The repository is licensed under the MIT licence unless otherwise noted.

## Disclaimer

NarrativeDecay provides informational metrics about the coherence and decay of market stories.  It does **not** make recommendations or predict market prices.  Users are responsible for their own investment decisions.
