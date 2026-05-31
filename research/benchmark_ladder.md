# Benchmark Ladder for NarrativeDecay

To calibrate NarrativeDecay’s ambition, this benchmark ladder compares our desired product against existing solutions across four tiers: **same‑niche**, **same‑subfield**, **category‑defining**, and **cross‑domain**.  Each tier lists examples with URLs, notes what we should import (best practices) and what to avoid copying blindly.  All sources are from official documentation, project readmes or reputable articles as of **May 31 2026**.

## Same‑niche (multi‑agent market analysis frameworks)

These projects operate in the same niche as NarrativeDecay: applying multi‑agent systems to analyse financial markets.

| Example | URL & accessed date | Why relevant / what to import | What not to copy blindly |
| --- | --- | --- | --- |
| **TradingAgents** | Simulation lab with role‑based analysts【837273169804491†L19-L36】 | Demonstrates how specialists (sentiment, news, technical) collaborate; shows importance of combining different viewpoints; emphasises agent pipelines. | Focus on trading execution and backtesting rather than narrative persistence; lacks long‑term ledger. |
| **Financial AI Assistant** (imanoop7) | <https://github.com/imanoop7/financial-analysis> (accessed 2026‑05‑30) | Provides wide coverage of technical, fundamental and sentiment analysis and interactive charts【283568158387453†L3-L24】; uses accessible libraries (`crewai`, `langchain`) for agent orchestration. | UI emphasises recommendations and can lead to overclaiming; does not manage story decay. |
| **Agentic Trading Lab** | <https://github.com/agentlabs/agentic-trading-lab> (accessed 2026‑05‑30) | Integrates real market data, agent trading logic and dashboards【949465176385402†L302-L346】; good example of using Alpaca API and backtest dashboards. | Focused on trading performance and leaderboard; no evidence ledger or thesis decay. |

## Same‑subfield (AI financial analysis with multi‑agents)

Projects here share the subfield of AI‑driven financial analysis using multiple specialised agents.

| Example | URL & accessed date | Why relevant / what to import | What not to copy blindly |
| --- | --- | --- | --- |
| **AWS Multi‑Agent Hedge Fund Assistant** | <https://github.com/aws-samples/multi-agent-hedge-fund-assistant> (accessed 2026‑05‑30) | Shows hierarchical agent design with supervisor and sub‑agents; uses Bedrock LLMs and custom tools for retrieving statements and price data【45777556623723†L21-L91】; emphasises modularity. | Notebook demonstration; not production ready; does not address memory persistence or narrative half‑life. |
| **LangAlpha** | <https://github.com/langalpha/financial-research-agent> (accessed 2026‑05‑30) | Provides a multi‑agent workflow (researcher, market data, analyst, reporter) built on `LangGraph`【48590548104760†L18-L63】; clearly lists capabilities and limitations and uses retrieval‑augmented generation. | Early project; high token usage; limited to US markets and does not maintain a ledger【48590548104760†L90-L152】. |
| **Investment‑Team** | <https://github.com/agno-ai/investment-team> (accessed 2026‑05‑30) | Demonstrates complex team composition (market analyst, financial analyst, technical analyst, risk officer, knowledge agent, memo writer, committee chair) and a three‑layer knowledge base【374962201360335†L2-L58】. | Heavy; complex to replicate; focuses on memo generation rather than narrative decay; may require proprietary models. |

## Category‑defining (automated narrative/reporting products)

These tools define the category of automated narrative or reporting for finance and business.

| Example | URL & accessed date | Why relevant / what to import | What not to copy blindly |
| --- | --- | --- | --- |
| **AI Weekly Report (Jenova AI)** | <https://jenova.ai/blog/ai-weekly-report> (accessed 2026‑05‑30) | Illustrates how specialised agents (writing assistant, accounting & audit assistant, real‑time search) generate weekly summaries【497164160917668†L20-L49】【497164160917668†L63-L85】; emphasises time savings and integration of macro context. | Weekly cadence; summarises events but does not track narrative states; risk of over‑summarisation. |
| **Domo Financial Narrative Generation Agent** | <https://www.domo.com/learn/financial-narrative-generation-agent> (accessed 2026‑05‑30) | Generates executive commentary across multiple dashboards; cross‑metric synthesis and configurable prompts【690281757895853†L180-L214】; demonstrates commercial viability. | Purpose‑built for Domo; dashboard summarisation, not thesis half‑life; uses proprietary environment. |
| **Medium article on multi‑agent pitfalls** | <https://medium.com/.../multi-agent-pitfalls> (accessed 2026‑05‑30) | Highlights the importance of durable memory and avoiding context rot【622606886587785†L45-L76】; emphasises that conversation logs alone are insufficient. | Serves as cautionary tale; not a concrete product; emphasises problems rather than solutions. |
| **Conflicting data discussion (Ysquare)** | <https://ysquare.com/ai-conflicting-data> (accessed 2026‑05‑30) | Underlines that agents must handle multiple versions of truth and data quality issues【390815581432592†L46-L68】【390815581432592†L69-L88】. | Problem description; no guidance on implementation; emphasises data quality rather than narrative tracking. |

## Cross‑domain gold standards

Cross‑domain examples may not be in finance but demonstrate patterns applicable to NarrativeDecay.

| Example | URL & accessed date | Lessons for NarrativeDecay | Caveats |
| --- | --- | --- | --- |
| **MetaGPT** | <https://github.com/geekan/metagpt> (accessed 2026‑05‑30) | Shows disciplined multi‑agent collaboration with SOPs and role definitions【665438329401912†L340-L349】; emphasises reproducibility and clear task boundaries. | Not domain specific; tasks differ from market analysis; uses heavy memory. |
| **Orchestrator frameworks review (Redwerk)** | <https://redwerk.com/blog/multi-agent-frameworks-2026> (accessed 2026‑05‑30) | Clarifies difference between frameworks (developer libraries) and orchestration platforms; summarises top toolkits and their use cases【549646236845758†L94-L116】. | General overview; not specific to narrative analysis; some frameworks may be unstable. |

## Summary of best practices

1. **Persistent memory**: Many projects ignore durable context; our design must maintain a ledger of theses and evidence to avoid inconsistent decisions.
2. **Role specialisation**: Hierarchical and role‑based agent collaboration (supervisor, researcher, analyst, sceptic) improves structure.  Borrow from LangAlpha, Investment‑Team and TradingAgents.
3. **Transparent states**: Narratives should have explicit states (forming, contested, decaying, etc.) rather than a single “score”; show rationale and evidence timeline.
4. **Source quality and contradiction detection**: Inspired by Jenova AI and Ysquare’s warnings, we must validate source reliability and flag conflicting data instead of blindly summarising majority sentiment.
5. **User‑defined ledger**: Provide means for traders to input their own theses and challenge them over time, addressing the pain point that most tools provide only one‑off answers.
