import { Evidence, Thesis } from './types';

/**
 * The ThesisLedger stores all thesis and evidence entities in memory.  In a
 * production setting this would likely persist to a database or distributed
 * store.  Here we keep it simple for demonstration and smoke testing.
 */
export class ThesisLedger {
  private theses: Map<string, Thesis> = new Map();
  private evidence: Map<string, Evidence> = new Map();
  private thesisEvidence: Map<string, Set<string>> = new Map();

  /**
   * Register a new thesis in the ledger.  Throws if a thesis with the same
   * identifier already exists.
   */
  addThesis(thesis: Thesis): void {
    if (this.theses.has(thesis.id)) {
      throw new Error(`Thesis with id ${thesis.id} already exists`);
    }
    this.theses.set(thesis.id, thesis);
    this.thesisEvidence.set(thesis.id, new Set(thesis.evidenceIds));
  }

  /**
   * Register a piece of evidence.  Throws if an evidence item with the same
   * identifier already exists.
   */
  addEvidence(item: Evidence): void {
    if (this.evidence.has(item.id)) {
      throw new Error(`Evidence with id ${item.id} already exists`);
    }
    this.evidence.set(item.id, item);
  }

  /**
   * Link a piece of evidence to a thesis.  Both must already be registered.
   */
  linkEvidenceToThesis(evidenceId: string, thesisId: string): void {
    const thesisSet = this.thesisEvidence.get(thesisId);
    if (!thesisSet) {
      throw new Error(`Unknown thesis ${thesisId}`);
    }
    if (!this.evidence.has(evidenceId)) {
      throw new Error(`Unknown evidence ${evidenceId}`);
    }
    thesisSet.add(evidenceId);
  }

  /**
   * Retrieve a thesis by its id.
   */
  getThesisById(id: string): Thesis | undefined {
    return this.theses.get(id);
  }

  /**
   * Retrieve evidence by its id.
   */
  getEvidenceById(id: string): Evidence | undefined {
    return this.evidence.get(id);
  }

  /**
   * Get all evidence items linked to a thesis.
   */
  getEvidenceForThesis(thesisId: string): Evidence[] {
    const ids = this.thesisEvidence.get(thesisId);
    if (!ids) return [];
    const items: Evidence[] = [];
    ids.forEach((eid) => {
      const ev = this.evidence.get(eid);
      if (ev) items.push(ev);
    });
    return items;
  }

  /**
   * Return all theses currently stored.
   */
  listTheses(): Thesis[] {
    return Array.from(this.theses.values());
  }
}