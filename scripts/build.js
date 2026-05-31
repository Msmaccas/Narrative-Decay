const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Build script for NarrativeDecay
//
// This script performs a two‑step build:
// 1. Runs the TypeScript compiler (tsc) according to the project's tsconfig.json
//    to emit compiled JavaScript into the dist directory.  Compilation uses
//    path mappings defined in tsconfig to correctly resolve internal packages.
// 2. Copies non‑code assets such as HTML files, fixtures and package manifests
//    into the dist directory so that runtime commands (tests, smoke, server) can
//    locate these resources.  It also rewrites each package.json copied into
//    dist to point its `main` field at the compiled entry point.

function runTsc() {
  // Determine the local TypeScript binary.  We can't rely on a global
  // installation, so we use the version installed in node_modules.  If it
  // doesn't exist this script will throw.
  // Locate the TypeScript compiler.  We reference the project's root node_modules
  // because dependencies are installed at the workspace root rather than within
  // the narrative-decay package.  The path two levels up from this script
  // resolves to the repository root.
  const rootDir = path.resolve(__dirname, '..', '..');
  const tscPath = path.join(rootDir, 'node_modules', 'typescript', 'bin', 'tsc');
  execSync(`node ${tscPath}`, { stdio: 'inherit', cwd: path.join(__dirname, '..') });
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function copyFile(src, dest) {
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

function copyDirectory(srcDir, destDir) {
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      copyFile(srcPath, destPath);
    }
  }
}

function copyAssets() {
  const projectRoot = path.join(__dirname, '..');
  const distRoot = path.join(projectRoot, 'dist');
  // Copy frontend HTML into dist/apps/web
  const htmlSrc = path.join(projectRoot, 'apps', 'web', 'src', 'index.html');
  if (fs.existsSync(htmlSrc)) {
    const htmlDest = path.join(distRoot, 'apps', 'web', 'index.html');
    copyFile(htmlSrc, htmlDest);
  }
  // Copy fixtures into dist/fixtures
  const fixturesSrc = path.join(projectRoot, 'fixtures');
  const fixturesDest = path.join(distRoot, 'fixtures');
  if (fs.existsSync(fixturesSrc)) {
    copyDirectory(fixturesSrc, fixturesDest);
  }
  // Copy and rewrite package.json for each internal package so Node can
  // resolve compiled modules in dist via NODE_PATH=dist/packages
  const packagesDir = path.join(projectRoot, 'packages');
  if (fs.existsSync(packagesDir)) {
    const pkgs = fs.readdirSync(packagesDir, { withFileTypes: true }).filter((e) => e.isDirectory());
    for (const pkg of pkgs) {
      const pkgSrc = path.join(packagesDir, pkg.name, 'package.json');
      if (!fs.existsSync(pkgSrc)) continue;
      const destDir = path.join(distRoot, 'packages', pkg.name);
      ensureDir(destDir);
      const pkgJson = JSON.parse(fs.readFileSync(pkgSrc, 'utf-8'));
      // compiled output resides in src/index.js within the dist folder
      pkgJson.main = 'src/index.js';
      fs.writeFileSync(path.join(destDir, 'package.json'), JSON.stringify(pkgJson, null, 2));

      // Also mirror the package into an @narrative-decay scoped directory so
      // require('@narrative-decay/<pkg>') can resolve.  Node's module
      // resolution looks for node_modules/@scope/package, so we replicate
      // that structure under dist/packages.
      const scopeDir = path.join(distRoot, 'packages', '@narrative-decay', pkg.name);
      ensureDir(scopeDir);
      // copy compiled sources
      const compiledSrc = path.join(distRoot, 'packages', pkg.name, 'src');
      if (fs.existsSync(compiledSrc)) {
        copyDirectory(compiledSrc, path.join(scopeDir, 'src'));
      }
      // copy package.json into scoped directory
      fs.writeFileSync(path.join(scopeDir, 'package.json'), JSON.stringify(pkgJson, null, 2));

      // In addition to mirroring compiled modules under dist/packages, also
      // copy them into the corresponding node_modules/@narrative-decay/<pkg>/dist
      // directory.  When using workspaces, npm links internal packages into
      // node_modules/@narrative-decay.  Their package.json typically points
      // `main` to `dist/index.js`, but our build emits compiled sources
      // elsewhere.  Without copying compiled output into node_modules, Node
      // attempts to load a nonexistent dist/index.js and fails.  By copying
      // our compiled sources into node_modules, we satisfy Node's default
      // resolution while keeping the compiled code solely produced by this
      // build script.  We do not commit these files; they exist only in the
      // build output.
      const nodeModulesScopeDir = path.join(projectRoot, 'node_modules', '@narrative-decay');
      const nodePackageDir = path.join(nodeModulesScopeDir, pkg.name);
      // Only copy if the destination exists; npm may not install internal
      // packages into node_modules when using certain install flags.  If
      // absent, skip copying.  This ensures the script doesn't create
      // extraneous directories.
      if (fs.existsSync(nodePackageDir)) {
        const nodeDestDir = path.join(nodePackageDir, 'dist');
        ensureDir(nodeDestDir);
        if (fs.existsSync(compiledSrc)) {
          copyDirectory(compiledSrc, nodeDestDir);
        }
      }
    }
  }
}

function main() {
  // Clean existing dist directory
  const distPath = path.join(__dirname, '..', 'dist');
  if (fs.existsSync(distPath)) {
    fs.rmSync(distPath, { recursive: true, force: true });
  }
  // Run the TypeScript compiler
  runTsc();
  // Copy assets and package manifests
  copyAssets();
}

main();