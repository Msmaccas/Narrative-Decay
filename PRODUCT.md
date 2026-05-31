# Product Definition: NarrativeDecay

## Broad field

**Trading** – the application operates in the ecosystem of discretionary investors, portfolio managers and research boutiques who monitor markets, news, filings and macro conditions to inform their positions.  The field covers equities, options and macro markets with high information velocity.

## Subfield

**AI‑driven market narrative analysis** – a nascent subfield that uses large language models and agents to synthesize news, earnings transcripts, filings, management commentary and price behaviour into coherent market stories.  Unlike conventional sentiment analysis or technical signals, narrative analysis seeks to understand the causal chain of why investors are bullish or bearish on themes and companies.

## Specialized niche

**Thesis half‑life monitoring** – NarrativeDecay focuses on tracking the life cycle of named investment theses (e.g., “AI capex supercycle”, “consumer weakness is transitory”).  For each thesis, the system ingests headlines, filings, transcripts, price action and macro context, and continuously evaluates whether new evidence supports, contradicts or fragments the story.  It assigns states such as *forming*, *crowded*, *contested*, *decaying*, *broken* or *re‑accelerating*.  Crucially, it calculates a narrative **half‑life** that widens when evidence is weak or uncertain and shrinks when the thesis is under stress.  This helps traders recognise when a thesis has quietly died even if the market price has not yet adjusted.

## Job to be done

Busy discretionary traders and research boutiques need to maintain situational awareness across dozens of market narratives.  Traditional tools either push constant headlines or summarise the news of the day, leaving users to decide whether a story still matters.  **NarrativeDecay’s job is to relieve traders from manually tracking whether a thesis is still valid.**  It continuously updates each thesis, surfaces contradictions, highlights evidence gaps, and warns when a story is fragmenting or when price action diverges from underlying evidence.  Users can also input their own theses into a ledger and let the engine challenge them over time.  The product aims to turn scattered information into actionable meta‑insight: which narratives are strengthening, which are decaying and which are mispriced.

## Core promise

* **Evidence‑first** – All narrative states and half‑life calculations are grounded in source‑level evidence (citations, timestamps, source quality).  There is no hidden model summarising “sentiment” without showing its inputs.
* **Continuous tracking** – Unlike daily or weekly reports, NarrativeDecay maintains persistent thesis objects that accumulate evidence over weeks and months.  It does not reset context each day.
* **Contradiction detection** – A dedicated agent examines new data for contradictions or fragmentation relative to the current thesis chain.  A thesis can become contested even if many positive headlines appear, acknowledging that consensus sometimes misses critical breaks.
* **Price context** – A price‑context analyst compares price behaviour with evidence coherence.  If price moves higher while evidence deteriorates, the half‑life shortens and the narrative is flagged as inconsistent.
* **User ledger** – Traders can define their own theses and let the system monitor them.  This shifts the agent from simply providing answers to actively challenging the user’s beliefs.

## Target user

**Wealthy busy men** – The initial persona is a discretionary portfolio manager or high‑net‑worth individual who follows multiple themes but has limited time to read every headline.  They value tools that save time, surface non‑obvious contradictions and provide transparent reasoning.  They are comfortable paying for professional analytics and require a polished dashboard and API integration.

## Maturity target

NarrativeDecay aims for **beta‑level maturity** on launch: end‑to‑end pipeline working, including ingest agents, evidence ledger, state update logic, dashboard, API and scheduling.  Smoke tests show the system can seed sample theses, ingest fixture evidence, flip one thesis from valid to decaying and another from contested to strengthened.  The product should withstand hostile inputs (malformed files, contradictory data) without crashing and degrade gracefully.  Long‑term, the goal is to become a reliable SaaS product with enterprise integrations and plug‑and‑play data providers.

## Why this should exist

1. **Narratives drive markets** – Price action often reflects market stories rather than fundamentals.  However, narratives can decay quietly before price reacts.  There is no mainstream product that tracks the internal coherence and half‑life of market stories.
2. **Information overload** – Traders face an onslaught of news, filings and commentary.  Many tools summarise but do not tell whether the underlying story is still intact.  NarrativeDecay fills the gap by connecting each new data point back to a specific thesis and updating its state.
3. **Agentic workflows with durable memory** – Existing multi‑agent frameworks answer one question at a time and suffer from context rot【622606886587785†L45-L76】.  NarrativeDecay deliberately builds long‑term memory through a ledger of evidence and explicit state transitions, aligning with research insights on durable memory.
4. **Actionable meta‑signal** – By highlighting when a narrative is decaying or mispriced relative to evidence, the system offers a new kind of signal to discretionary traders.  It does not predict prices; it alerts users to pay attention to an underlying story’s health.
