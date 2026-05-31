import assert from 'assert';
import { loadThesesFromFixtures, loadEvidenceFromFixtures } from '@narrative-decay/data';
import { ThesisLedger, Thesis } from '@narrative-decay/core';
import { updateTheses } from '@narrative-decay/workflows';

async function testUpdate() {
  const theses = loadThesesFromFixtures();
  const ledger = new ThesisLedger();
  for (const t of theses) {
    ledger.addThesis(t);
  }
  // link evidence to theses via ledger to mimic server behaviour
  const evidence = loadEvidenceFromFixtures();
  for (const ev of evidence) {
    ledger.addEvidence(ev);
    if (ev.thesisId) {
      ledger.linkEvidenceToThesis(ev.id, ev.thesisId);
    }
  }
  const summary = await updateTheses(theses);
  // After update: th1 should be contested (decaying list)
  const th1 = summary.updated.find((t: Thesis) => t.id === 'th1');
  assert.ok(th1, 'th1 should exist');
  assert.strictEqual(th1!.state, 'contested', 'th1 should become contested');
  assert.ok(summary.decaying.find((t) => t.id === 'th1'), 'th1 should be in decaying list');
  // th2 should remain forming because only support evidence
  const th2 = summary.updated.find((t: Thesis) => t.id === 'th2');
  assert.ok(th2, 'th2 should exist');
  assert.strictEqual(th2!.state, 'forming', 'th2 should remain forming');
}

async function run() {
  await testUpdate();
  console.log('All tests passed');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});