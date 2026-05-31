import { Evidence, ThesisState } from '@narrative-decay/core';

/**
 * Inspect a list of evidence items and decide how they influence the state of
 * a thesis.  This simple heuristic counts supporting and contradicting
 * instances.  In a production system this would incorporate source quality,
 * timing, price action and more nuanced signals.
 */
export function evaluateThesisState(current: ThesisState, evidence: Evidence[]): ThesisState {
  let supports = 0;
  let contradictions = 0;
  evidence.forEach((ev) => {
    if (ev.supports) supports++;
    else contradictions++;
  });
  if (supports === 0 && contradictions === 0) {
    return current;
  }
  if (contradictions > supports) {
    // more negative evidence implies decay
    if (current === ThesisState.FORMING || current === ThesisState.CROWDED) {
      return ThesisState.CONTESTED;
    }
    return ThesisState.DECAYING;
  }
  if (supports > contradictions) {
    // more support implies strengthening
    if (current === ThesisState.DECAYING || current === ThesisState.CONTESTED) {
      return ThesisState.RE_ACCELERATING;
    }
    return current;
  }
  // equal support and contradiction -> contested
  return ThesisState.CONTESTED;
}