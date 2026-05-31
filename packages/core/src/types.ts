export enum ThesisState {
  FORMING = 'forming',
  CROWDED = 'crowded',
  CONTESTED = 'contested',
  DECAYING = 'decaying',
  BROKEN = 'broken',
  RE_ACCELERATING = 're-accelerating'
}

/**
 * Evidence describes a piece of information extracted from a source.  It contains
 * the original text, a timestamp, and whether the evidence supports or
 * contradicts a thesis.  Additional metadata such as the originating source
 * allows quality analysis.
 */
export interface Evidence {
  /** Unique identifier for this evidence item. */
  id: string;
  /** Name of the source (e.g. news outlet, filing type). */
  source: string;
  /** ISO-8601 timestamp of when the evidence was generated. */
  timestamp: string;
  /** Human‑readable content of the evidence. */
  content: string;
  /** True if the evidence supports the thesis, false if it contradicts it. */
  supports: boolean;

  /**
   * Identifier of the thesis this evidence relates to.  This optional field
   * allows providers to link evidence to specific narratives.  Not all
   * evidence will have a thesis association at creation time; linking can
   * happen later in the workflow.
   */
  thesisId?: string;
}

/**
 * A thesis represents a market narrative under observation.  Theses are named
 * and described by the user.  They accumulate supporting or contradicting
 * evidence over time and transition through states such as forming or decaying.
 */
export interface Thesis {
  /** Unique identifier for the thesis. */
  id: string;
  /** Short title of the narrative (e.g. "AI capex supercycle broadens"). */
  title: string;
  /** Optional longer description of the causal chain underpinning the thesis. */
  description: string;
  /** Current classification of the thesis' health. */
  state: ThesisState;
  /** List of evidence identifiers associated with this thesis. */
  evidenceIds: string[];
  /** Creation timestamp. */
  created: string;
  /** Timestamp of last update. */
  lastUpdated: string;
}

/**
 * Generic wrapper returned by providers.  It includes metadata about the
 * retrieval process, confidence and warnings.  Downstream agents can use
 * this structured information to downgrade results or trigger manual review.
 */
export interface ProviderResult<T> {
  /** The actual result object or null if unavailable. */
  data: T | null;
  /** Identifier of the provider or data source used. */
  source: string;
  /** ISO-8601 timestamp recorded by the provider when the data was retrieved. */
  providerTimestamp: string;
  /** ISO-8601 timestamp of when the result was received by the system. */
  receivedTimestamp: string;
  /** Confidence score on a 0–1 scale describing the completeness/accuracy. */
  confidence: number;
  /** High level state describing how reliable the data is. */
  state: 'OK' | 'LOW_CONFIDENCE' | 'NOT_AVAILABLE' | 'UNKNOWN';
  /** Optional list of warnings emitted by the provider. */
  warnings?: string[];
  /** Optional message describing why the data could not be retrieved. */
  missingReason?: string;
}