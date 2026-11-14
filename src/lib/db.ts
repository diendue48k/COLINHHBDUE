import fs from 'fs';
import path from 'path';
import { DatabaseState, Scholarship } from '../types';
import { initialData } from '../data/initialData';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db as firestoreDb } from './firebase';

const DB_FILE_PATH = path.join(process.cwd(), 'data', 'db.json');

// Global in-memory cache so serverless instances (e.g. Vercel where filesystem is read-only)
// retain the latest state immediately across requests even before Firestore finishes.
const globalForDb = globalThis as unknown as {
  __dueMemoryDb?: DatabaseState;
};

function getTodayDateString(): string {
  const now = new Date();
  const offsetMs = 7 * 60 * 60 * 1000;
  const vnTime = new Date(now.getTime() + offsetMs);
  return vnTime.toISOString().split('T')[0];
}

function getTimestamp(state?: DatabaseState | null): number {
  if (!state) return 0;
  const t1 = state.lastUpdatedAt ? new Date(state.lastUpdatedAt).getTime() : 0;
  const t2 = state.lastSyncedAt ? new Date(state.lastSyncedAt).getTime() : 0;
  return Math.max(t1 || 0, t2 || 0);
}

// Ensure local fallback db file exists (or return in-memory / initialData on read-only FS)
function ensureDbFile(): DatabaseState {
  let diskData: DatabaseState | null = null;
  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const content = fs.readFileSync(DB_FILE_PATH, 'utf-8');
      diskData = JSON.parse(content) as DatabaseState;
    } else {
      const dir = path.dirname(DB_FILE_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(initialData, null, 2), 'utf-8');
      diskData = initialData;
    }
  } catch (_) {
    // On Vercel or read-only environment, ignore disk write/read errors
  }

  const memData = globalForDb.__dueMemoryDb;
  if (memData && getTimestamp(memData) >= getTimestamp(diskData)) {
    return JSON.parse(JSON.stringify(memData)) as DatabaseState;
  }

  const resolved = diskData || initialData;
  globalForDb.__dueMemoryDb = JSON.parse(JSON.stringify(resolved)) as DatabaseState;
  return JSON.parse(JSON.stringify(resolved)) as DatabaseState;
}

export function getDatabase(): DatabaseState {
  return ensureDbFile();
}

/**
 * Async database getter: Fetches real-time state from Firebase Firestore and compares
 * timestamps with local/in-memory state so newer writes are never overwritten by stale data.
 */
export async function getDatabaseAsync(): Promise<DatabaseState> {
  const localData = ensureDbFile();
  try {
    const docRef = doc(firestoreDb, 'portal', 'main_database');
    const snap = await Promise.race([
      getDoc(docRef),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Firestore read timeout')), 5000)
      ),
    ]);
    if (snap.exists()) {
      const remoteData = snap.data() as DatabaseState;
      const localTime = getTimestamp(localData);
      const remoteTime = getTimestamp(remoteData);

      // If local/memory is newer than remote Firestore, keep local/memory and push to Firestore
      if (localTime > remoteTime) {
        setDoc(docRef, {
          ...localData,
          lastUpdatedAt: localData.lastUpdatedAt,
          lastSyncedAt: localData.lastUpdatedAt,
        }).catch(() => {});
        return localData;
      }

      // Otherwise update memory and disk cache from remoteData
      globalForDb.__dueMemoryDb = JSON.parse(JSON.stringify(remoteData)) as DatabaseState;
      try {
        fs.writeFileSync(DB_FILE_PATH, JSON.stringify(remoteData, null, 2), 'utf-8');
      } catch (_) {}
      return remoteData;
    }
  } catch (err) {
    console.warn('Firebase Firestore read failed or timed out, using local fallback:', (err as Error).message);
  }
  return localData;
}

/**
 * Save database synchronously to memory + disk (if writable) and trigger async sync to Firebase Firestore
 */
export function saveDatabase(data: DatabaseState): boolean {
  const nowIso = new Date().toISOString();
  data.lastUpdatedAt = nowIso;
  data.lastSyncedAt = nowIso;

  globalForDb.__dueMemoryDb = JSON.parse(JSON.stringify(data)) as DatabaseState;

  try {
    const dir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (_) {
    // Ignore read-only filesystem error on serverless deployments
  }

  setDoc(doc(firestoreDb, 'portal', 'main_database'), {
    ...data,
    lastUpdatedAt: nowIso,
    lastSyncedAt: nowIso,
  }).catch((err) => {
    console.error('Error syncing to Firebase Firestore:', err);
  });

  return true;
}

/**
 * Save database to memory + disk (if writable) AND always await Firestore sync
 * so serverless deployments (Vercel) persist every mutation reliably.
 */
export async function saveDatabaseAsync(data: DatabaseState): Promise<boolean> {
  const nowIso = new Date().toISOString();
  data.lastUpdatedAt = nowIso;
  data.lastSyncedAt = nowIso;

  globalForDb.__dueMemoryDb = JSON.parse(JSON.stringify(data)) as DatabaseState;

  try {
    const dir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (_) {
    // Ignore read-only filesystem error on Vercel; continue to Firestore save!
  }

  try {
    await Promise.race([
      setDoc(doc(firestoreDb, 'portal', 'main_database'), {
        ...data,
        lastUpdatedAt: nowIso,
        lastSyncedAt: nowIso,
      }),
      new Promise((_, resolve) => setTimeout(resolve, 6000)),
    ]);
  } catch (syncErr) {
    console.warn('Firestore sync warning:', (syncErr as Error).message);
  }

  return true;
}

export function getScholarships(): Scholarship[] {
  return getDatabase().scholarships;
}

export function getScholarshipBySlugOrId(idOrSlug: string): Scholarship | undefined {
  const db = getDatabase();
  return db.scholarships.find((s) => s.id === idOrSlug || s.slug === idOrSlug);
}

export async function incrementScholarshipViews(idOrSlug: string): Promise<number> {
  const db = await getDatabaseAsync();
  const item = db.scholarships.find((s) => s.id === idOrSlug || s.slug === idOrSlug);
  if (item) {
    item.viewsCount = (item.viewsCount || 0) + 1;
    if (!db.stats) {
      db.stats = { totalViews: 0, dailyViews: [] };
    }
    db.stats.totalViews = db.scholarships.reduce((sum, s) => sum + (s.viewsCount || 0), 0);

    if (!Array.isArray(db.stats.dailyViews)) {
      db.stats.dailyViews = [];
    }
    const todayStr = getTodayDateString();
    const todayEntry = db.stats.dailyViews.find((d) => d.date === todayStr);
    if (todayEntry) {
      todayEntry.views = (todayEntry.views || 0) + 1;
    } else {
      db.stats.dailyViews.push({ date: todayStr, views: 1 });
      db.stats.dailyViews.sort((a, b) => a.date.localeCompare(b.date));
      if (db.stats.dailyViews.length > 7) {
        db.stats.dailyViews = db.stats.dailyViews.slice(-7);
      }
    }

    await saveDatabaseAsync(db);
    return item.viewsCount;
  }
  return 0;
}
