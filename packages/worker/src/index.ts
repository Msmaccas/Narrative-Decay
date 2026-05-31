import { loadThesesFromFixtures, loadEvidenceFromFixtures } from '@narrative-decay/data';
import { ThesisLedger, Thesis } from '@narrative-decay/core';
import { updateTheses } from '@narrative-decay/workflows';
import { generateReport } from '@narrative-decay/reports';

async function runOnce() {
  const ledger = new ThesisLedger();
  let theses: Thesis[] = loadThesesFromFixtures();
  for (const t of theses) {
    ledger.addThesis(t);
  }
  const evidence = loadEvidenceFromFixtures();
  for (const ev of evidence) {
    ledger.addEvidence(ev);
    if (ev.thesisId) {
      try {
        ledger.linkEvidenceToThesis(ev.id, ev.thesisId);
      } catch {
        /* ignore linking errors */
      }
    }
  }
  const summary = await updateTheses(theses);
  const report = generateReport(summary.updated, summary);
  console.log(report);
}

runOnce().catch((err) => {
  console.error('Worker encountered an error', err);
});