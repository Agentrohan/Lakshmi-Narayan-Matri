/**
 * Persistent storage helper.
 * Primary:  /shared-storage/public/assets/lnm-data/  (survives redeploys on Railway)
 * Fallback: /private/  (local dev or if shared-storage not mounted)
 */
import fs from 'fs';
import path from 'path';

const PRIMARY_DIR = '/shared-storage/public/assets/lnm-data';
const FALLBACK_DIR = '/private';

function resolveFile(filename: string): string {
  // Try to use primary; fall back if the directory can't be created
  try {
    fs.mkdirSync(PRIMARY_DIR, { recursive: true });
    return path.join(PRIMARY_DIR, filename);
  } catch {
    try {
      fs.mkdirSync(FALLBACK_DIR, { recursive: true });
    } catch { /* already exists */ }
    return path.join(FALLBACK_DIR, filename);
  }
}

export function readJson<T>(filename: string, fallback: T): T {
  // Try primary first, then fallback dir
  const candidates = [
    path.join(PRIMARY_DIR, filename),
    path.join(FALLBACK_DIR, filename),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) {
      try {
        return JSON.parse(fs.readFileSync(p, 'utf-8')) as T;
      } catch {
        // corrupt file — continue to next candidate
      }
    }
  }
  return fallback;
}

export function writeJson(filename: string, data: unknown): void {
  const filePath = resolveFile(filename);
  const tmp = filePath + '.tmp';
  // Atomic write: write to .tmp then rename so a crash mid-write never corrupts the file
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tmp, filePath);
}
