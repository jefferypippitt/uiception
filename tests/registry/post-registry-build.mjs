/**
 * Post-build validation pass â€” runs after `shadcn build`.
 *
 * Previously this script patched the built registry JSON to:
 *   - Strip corrupted binary content from media file stubs
 *   - Generate pending manifest JSON for the deferred media downloader
 *   - Add the uiception-media-fetch registryDependency
 *   - Fix the instrumentation.ts import path
 *
 * All four of those concerns are now handled directly in the source:
 *   - Binary stubs are gone â€” media blocks reference media-manifest.json text files
 *   - media-manifest.json files are source files shadcn build embeds cleanly
 *   - uiception-media-fetch dep is declared in registry.json per block
 *   - instrumentation.ts already uses the correct install-time import path
 *
 * This file is kept as a no-op so the prebuild script entry in package.json
 * doesn't need to change while the registry output stabilises.
 */

