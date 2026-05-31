import { Thesis, Evidence, ThesisState } from '@narrative-decay/core';
import { fetchEvidence } from '@narrative-decay/providers';
import { evaluateThesisState } from '@narrative-decay/agents';

/**
 * Run the update workflow.  Loads fresh evidence via the configured provider,
 * groups the evidence by thesis, applies the agents' evaluation function to
 * determine new thesis states, and returns a breakdown of which narratives
 * are newly strengthening or decaying.  Theses that changed from neutral to
 * contested or vice versa are considered "decaying" for demonstration.
 */
export async function updateTheses(theses: Thesis[]): Promise<{
  updated: Thesis[];
  new: Thesis[];
  decaying: Thesis[];
  inconsistent: Thesis[];
}> {
  const providerResult = await fetchEvidence();
  const evidenceList: Evidence[] = providerResult.data ?? [];
  const updated: Thesis[] = [];
  const newNarratives: Thesis[] = [];
  const decaying: Thesis[] = [];
  const inconsistent: Thesis[] = [];

  // Group evidence by thesisId
  const byThesis: Record<string, Evidence[]> = {};
  for (const ev of evidenceList) {
    if (!ev.thesisId) continue;
    if (!byThesis[ev.thesisId]) byThesis[ev.thesisId] = [];
    byThesis[ev.thesisId].push(ev);
  }

  const now = new Date().toISOString();
  for (const thesis of theses) {
    const evidence = byThesis[thesis.id] ?? [];
    const newState = evaluateThesisState(thesis.state as ThesisState, evidence);
    const updatedThesis: Thesis = { ...thesis, state: newState, lastUpdated: now };
    updated.push(updatedThesis);
    // categorize
    if (thesis.state !== newState) {
      if (newState === ThesisState.DECAYING || newState === ThesisState.CONTESTED) {
        decaying.push(updatedThesis);
      } else {
        newNarratives.push(updatedThesis);
      }
    }
    // simplistic inconsistent check: no evidence but still not forming
    if (evidence.length === 0 && thesis.state !== ThesisState.FORMING) {
      inconsistent.push(updatedThesis);
    }
  }
  return { updated, new: newNarratives, decaying, inconsistent };
}