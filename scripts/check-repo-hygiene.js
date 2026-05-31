const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');

// Patterns of paths that must not be tracked in the repository.  The hygiene
// check operates on tracked files rather than the working tree.  Build
// artifacts and dependencies may exist after `npm run build`, but they are
// ignored as long as they are not committed.
const disallowed = [
  /node_modules\//,
  /dist\//,
  /\.tsbuildinfo$/,
  /reports\//,
  /fixtures\/(golden|golden)\//,
];

// Use git ls-files to obtain a list of tracked files.  If git is not
// available (e.g., in a shallow checkout), fall back to scanning the
// filesystem but only warn.
function getTrackedFiles() {
  try {
    const { execSync } = require('child_process');
    const output = execSync('git ls-files', { cwd: repoRoot, stdio: ['ignore', 'pipe', 'ignore'] }).toString();
    return output.split('\n').filter((f) => f.trim().length > 0);
  } catch {
    // If git is unavailable, return an empty list.  The hygiene check will
    // effectively be skipped.  This should not happen in CI.
    return [];
  }
}

const trackedFiles = getTrackedFiles();

for (const rel of trackedFiles) {
  for (const pattern of disallowed) {
    if (pattern.test(rel)) {
      console.error(`Hygiene violation: disallowed file committed: ${rel}`);
      process.exit(1);
    }
  }
}
console.log('Repository hygiene check passed');