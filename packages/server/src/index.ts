import * as http from 'http';
import { URL } from 'url';
import * as fs from 'fs';
import * as path from 'path';
import { loadThesesFromFixtures, loadEvidenceFromFixtures } from '@narrative-decay/data';
import { ThesisLedger, Thesis } from '@narrative-decay/core';
import { updateTheses } from '@narrative-decay/workflows';
import { generateReport } from '@narrative-decay/reports';

// Initialise ledger and load fixtures
const ledger = new ThesisLedger();
let theses: Thesis[] = loadThesesFromFixtures();
for (const thesis of theses) {
  ledger.addThesis(thesis);
}
const evidenceList = loadEvidenceFromFixtures();
for (const ev of evidenceList) {
  ledger.addEvidence(ev);
  if (ev.thesisId) {
    try {
      ledger.linkEvidenceToThesis(ev.id, ev.thesisId);
    } catch (err) {
      // ignore linking errors for unknown theses
    }
  }
}
let lastSummary = {
  updated: theses,
  new: [] as Thesis[],
  decaying: [] as Thesis[],
  inconsistent: [] as Thesis[],
};

/**
 * Helper to send JSON responses.  Ensures consistent content type and HTTP
 * status code.
 */
function sendJson(res: http.ServerResponse, status: number, body: any) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

/**
 * Helper to parse incoming request bodies.  We assume JSON payloads for
 * simplicity.  Returns a promise that resolves with the parsed object or
 * undefined if no body is present.
 */
function parseBody(req: http.IncomingMessage): Promise<any | undefined> {
  return new Promise((resolve) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    req.on('end', () => {
      if (chunks.length === 0) {
        resolve(undefined);
        return;
      }
      try {
        const body = JSON.parse(Buffer.concat(chunks).toString('utf-8'));
        resolve(body);
      } catch {
        resolve(undefined);
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  const url = req.url ? new URL(req.url, `http://${req.headers.host || 'localhost'}`) : new URL('/', 'http://localhost');
  // Root route returns a welcome message
  if (url.pathname === '/' && req.method === 'GET') {
    sendJson(res, 200, { message: 'NarrativeDecay API is running' });
    return;
  }
  // Serve dashboard HTML at /dashboard
  if (url.pathname === '/dashboard' && req.method === 'GET') {
    // Compute path to compiled dashboard index.html
    // __dirname points to dist/packages/server/src at runtime after compilation
    const dashboardPath = path.join(__dirname, '..', '..', '..', 'apps', 'web', 'index.html');
    try {
      const content = fs.readFileSync(dashboardPath);
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content);
    } catch (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Dashboard not found');
    }
    return;
  }
  // Serve static files under /web/ path, e.g. JS bundle
  if (url.pathname.startsWith('/web/') && req.method === 'GET') {
    const rel = url.pathname.replace('/web/', '');
    const staticPath = path.join(__dirname, '..', '..', '..', 'apps', 'web', rel);
    if (fs.existsSync(staticPath)) {
      const ext = path.extname(staticPath);
      const contentType = ext === '.js' ? 'application/javascript' : ext === '.css' ? 'text/css' : ext === '.html' ? 'text/html' : 'application/octet-stream';
      try {
        const data = fs.readFileSync(staticPath);
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
      } catch {
        res.writeHead(500);
        res.end('Error loading file');
      }
      return;
    }
  }
  // List all theses
  if (url.pathname === '/theses' && req.method === 'GET') {
    sendJson(res, 200, theses);
    return;
  }
  // Get single thesis with evidence timeline
  if (url.pathname.startsWith('/thesis/') && req.method === 'GET') {
    const parts = url.pathname.split('/');
    const id = parts[2];
    const thesis = theses.find((t) => t.id === id);
    if (!thesis) {
      sendJson(res, 404, { error: 'Thesis not found' });
      return;
    }
    const evidence = ledger.getEvidenceForThesis(id);
    sendJson(res, 200, { thesis, evidence });
    return;
  }
  // Trigger update run
  if (url.pathname === '/update' && req.method === 'POST') {
    // Optionally allow posting new evidence or theses in body; ignored here
    await parseBody(req);
    const summary = await updateTheses(theses);
    lastSummary = summary;
    theses = summary.updated;
    sendJson(res, 200, summary);
    return;
  }
  // Get last summary
  if (url.pathname === '/summary' && req.method === 'GET') {
    sendJson(res, 200, lastSummary);
    return;
  }
  // Not found
  sendJson(res, 404, { error: 'Not found' });
});

const port = parseInt(process.env.PORT || '3000', 10);
server.listen(port, () => {
  console.log(`NarrativeDecay server running on port ${port}`);
});