import { loadThesesFromFixtures } from '@narrative-decay/data';
import { updateTheses } from '@narrative-decay/workflows';
import { generateReport } from '@narrative-decay/reports';

async function smoke() {
  const theses = loadThesesFromFixtures();
  const summary = await updateTheses(theses);
  const report = generateReport(summary.updated, summary);
  console.log(report);
}

smoke().catch((err) => {
  console.error('Smoke test failed:', err);
  process.exit(1);
});