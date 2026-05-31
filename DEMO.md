# Demo Guide for NarrativeDecay

This guide demonstrates how to use the **NarrativeDecay** prototype end‑to‑end.  It assumes you have followed the installation steps in `README.md` and built the project.

## Seeding sample theses and evidence

The repository includes fixture files in `fixtures/raw` that seed two sample theses and a handful of evidence items:

* **th1** – *“AI capex supercycle broadens”*.  Initial evidence supports the idea that companies are ramping up spending on AI infrastructure.  Contradicting evidence later suggests supply constraints and budgeting pullbacks.
* **th2** – *“Consumer weakness is transitory”*.  Evidence suggests consumers will resume spending as macro headwinds fade.

You can explore these fixtures by opening `fixtures/raw/evidence.json` and `fixtures/raw/theses.json`.

## Running the smoke path

Execute the smoke test to simulate a single update cycle:

```bash
npm run smoke
```

Expected output:

```
# Daily Narrative Update

## Decaying or Contested Narratives
- **AI capex supercycle broadens** → state changed to contested

```

The smoke script loads the fixtures, runs the update workflow and generates a human‑readable report.  In the sample run, thesis `th1` becomes **contested** because new evidence contradicts the initial bullish narrative, and it appears in the decaying list.  Thesis `th2` remains **forming** because it has only supportive evidence.

## Using the dashboard

Start the server and open the dashboard:

```bash
PORT=3000 npm start
```

Then browse to `http://localhost:3000/dashboard`.  You will see a list of theses on the left.  Click a thesis to view its evidence timeline.  The top bar shows three counts:

* **Strengthening** – theses whose evidence coherence increased and half‑life lengthened.
* **Decaying** – theses marked as contested or decaying due to contradictory evidence or fragmentation.
* **Inconsistent** – theses where price behaviour diverges from evidence quality (not demonstrated in the fixture but supported by the engine).

Press the **Refresh** button in the UI to trigger an update.  The dashboard calls the `/update` endpoint (POST) and reloads the lists and counts.  After an update, thesis `th1` will show its state as contested and appear in the decaying column.

## Adding your own theses

In this prototype, user‑defined theses can be added by editing `fixtures/raw/theses.json` and `fixtures/raw/evidence.json` before building.  Each thesis must have an `id`, `title`, `description`, `state`, `created` and `lastUpdated` timestamp.  Evidence items require an `id`, `summary`, `source`, `timestamp`, `support` boolean and `thesisId`.  After modifying these files, rebuild and run the smoke test to see how states change.  A future version will include a proper API and UI for adding and editing theses on the fly.

## Running the worker

To run the worker (which performs the same update workflow without serving an API):

```bash
NODE_PATH=dist/packages node dist/packages/worker/src/index.js
```

The worker prints the summary of updated theses and can be scheduled via cron.  It uses the same core pipeline as the server and dashboard.

## Live data integration

NarrativeDecay’s architecture includes a providers layer (`packages/providers`) where you can implement connections to real data sources such as news APIs, SEC filings or price feeds.  Each provider must return a `ProviderResult<T>` with metadata (`source`, `providerTimestamp`, `receivedTimestamp`, `confidence`, `state`, `warnings`, `schemaVersion`, `missingDataReason`).  Use environment variables (configure via `.env.example`) to set API keys.  After adding real providers, rebuild the project and run the smoke test or server to see the impact on thesis states.

## Caveats and next steps

This prototype demonstrates the core concept of narrative half‑life tracking but is not production ready.  Limitations include:

* Only synchronous update cycles; no streaming or incremental ingestion.
* In‑memory ledger resets when the process restarts.
* Fixtures are simplistic; real data ingestion requires robust parsing and rate‑limiting.
* Web UI is minimal; advanced charts and interactive features are planned.
* The current half‑life calculation is heuristic; future versions could incorporate statistical models.

Despite these limitations, the demo illustrates how continuous thesis tracking and contradiction detection can help investors identify when narratives are quietly dying and when they are being mispriced by the market.
