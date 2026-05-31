import * as fs from 'fs';
import * as path from 'path';
import { Evidence, Thesis } from '@narrative-decay/core';

/**
 * Load evidence objects from the fixture JSON file.  This helper is used by
 * providers in development and smoke tests.  In a real system this function
 * would query a database or remote service.
 */
export function loadEvidenceFromFixtures(): Evidence[] {
  const filePath = path.resolve(__dirname, '../../..', 'fixtures/raw/evidence.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  const json = JSON.parse(raw) as Array<any>;
  // perform basic validation
  return json.map((item) => {
    const evidence: Evidence = {
      id: String(item.id),
      source: String(item.source),
      timestamp: String(item.timestamp),
      content: String(item.content),
      supports: Boolean(item.supports),
    };
    if (item.thesisId) {
      evidence.thesisId = String(item.thesisId);
    }
    return evidence;
  });
}

/**
 * Load thesis definitions from the fixture JSON file.  Theses are created
 * without attached evidence; linking happens during the workflow.
 */
export function loadThesesFromFixtures(): Thesis[] {
  const filePath = path.resolve(__dirname, '../../..', 'fixtures/raw/theses.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  const json = JSON.parse(raw) as Array<any>;
  return json.map((item) => {
    return {
      id: String(item.id),
      title: String(item.title),
      description: String(item.description ?? ''),
      state: item.state as any,
      evidenceIds: Array.isArray(item.evidenceIds) ? item.evidenceIds.map(String) : [],
      created: String(item.created),
      lastUpdated: String(item.lastUpdated),
    } as Thesis;
  });
}