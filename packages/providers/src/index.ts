import { loadEvidenceFromFixtures } from '@narrative-decay/data';
import { Evidence, ProviderResult } from '@narrative-decay/core';

/**
 * Simulated provider that returns evidence from fixture files.  In a real
 * implementation this could call external APIs, parse SEC filings or scrape
 * news sites.  The provider always returns a ProviderResult wrapper.
 */
export async function fetchEvidence(): Promise<ProviderResult<Evidence[]>> {
  const receivedTimestamp = new Date().toISOString();
  try {
    const data = loadEvidenceFromFixtures();
    return {
      data,
      source: 'fixture',
      providerTimestamp: receivedTimestamp,
      receivedTimestamp,
      confidence: 1.0,
      state: 'OK',
    };
  } catch (err) {
    return {
      data: null,
      source: 'fixture',
      providerTimestamp: receivedTimestamp,
      receivedTimestamp,
      confidence: 0,
      state: 'NOT_AVAILABLE',
      warnings: [String(err)],
      missingReason: 'Failed to load fixture evidence',
    };
  }
}