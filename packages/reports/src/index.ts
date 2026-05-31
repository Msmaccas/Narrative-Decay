import { Thesis } from '@narrative-decay/core';

export interface UpdateSummary {
  updated: Thesis[];
  new: Thesis[];
  decaying: Thesis[];
  inconsistent: Thesis[];
}

/**
 * Generate a human‑readable report summarising the changes across narratives.  It
 * lists strengthening, decaying and inconsistent narratives with their
 * current state and titles.  The report intentionally avoids numeric
 * precision and emphasises evidence‑driven state changes.
 */
export function generateReport(theses: Thesis[], summary: UpdateSummary): string {
  const lines: string[] = [];
  lines.push(`# Daily Narrative Update`);
  lines.push('');
  if (summary.new.length > 0) {
    lines.push('## Strengthening or Fresh Narratives');
    summary.new.forEach((t) => {
      lines.push(`- **${t.title}** → state changed to ${t.state}`);
    });
    lines.push('');
  }
  if (summary.decaying.length > 0) {
    lines.push('## Decaying or Contested Narratives');
    summary.decaying.forEach((t) => {
      lines.push(`- **${t.title}** → state changed to ${t.state}`);
    });
    lines.push('');
  }
  if (summary.inconsistent.length > 0) {
    lines.push('## Inconsistent Narratives');
    summary.inconsistent.forEach((t) => {
      lines.push(`- **${t.title}** appears inconsistent with incoming evidence`);
    });
    lines.push('');
  }
  if (lines.length === 2) {
    lines.push('No significant changes today.');
  }
  return lines.join('\n');
}