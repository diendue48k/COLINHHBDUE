import fs from 'fs';
import path from 'path';
import { DatabaseState, Scholarship } from '../types';
import { initialData } from '../data/initialData';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db as firestoreDb } from './firebase';

const DB_FILE_PATH = path.join(process.cwd(), 'data', 'db.json');

function getTodayDateString(): string {
  const now = new Date();
  // Format YYYY-MM-DD in Asia/Ho_Chi_Minh (+07:00)
  const offsetMs = 7 * 60 * 60 * 1000;
  const vnTime = new Date(now.getTime() + offsetMs);
  return vnTime.toISOString().split('T')[0];
}

// Ensure local fallback db file exists
function ensureDbFile(): DatabaseState {
  try {
    const dir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (!fs.existsSync(DB_FILE_PATH)) {
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(initialData, null, 2), 'utf-8');
      return initialData;
    }

    const content = fs.readFileSync(DB_FILE_PATH, 'utf-8');
    return JSON.parse(content) as DatabaseState;
  } catch (err) {
    console.error('Error reading database file, falling back to initial data:', err);
    return initialData;
  }
}

export function getDatabase(): DatabaseState {
  return ensureDbFile();
}

/**
 * Async database getter: Fetches real-time state from Firebase Firestore and compares
 * timestamps with local db.json so newer local writes are never overwritten by stale remote data.
 */
export async function getDatabaseAsync(): Promise<DatabaseState> {
  const localData = ensureDbFile();
  try {
    const docRef = doc(firestoreDb, 'portal', 'main_database');
    const snap = await Promise.race([
      getDoc(docRef),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Firestore read timeout')), 3500)
      ),
    ]);
    if (snap.exists()) {
      const remoteData = snap.data() as DatabaseState;
      const localTime = localData.lastUpdatedAt ? new Date(localData.lastUpdatedAt).getTime() : 0;
      const remoteTime = remoteData.lastUpdatedAt
        ? new Date(remoteData.lastUpdatedAt).getTime()
        : remoteData.lastSyncedAt
        ? new Date(remoteData.lastSyncedAt).getTime()
        : 0;

      // If local file is newer than remote Firestore, keep local file and push to Firestore
      if (localTime > remoteTime) {
        setDoc(docRef, localData).catch(() => {});
        return localData;
      }

      // Otherwise cache remote data to local db.json
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
 * Save database synchronously to disk and trigger async sync to Firebase Firestore
 */
export function saveDatabase(data: DatabaseState): boolean {
  try {
    const nowIso = new Date().toISOString();
    data.lastUpdatedAt = nowIso;

    const dir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');

    // Async sync to Firebase Firestore
    setDoc(doc(firestoreDb, 'portal', 'main_database'), {
      ...data,
      lastUpdatedAt: nowIso,
    }).catch((err) => {
      console.error('Error syncing to Firebase Firestore:', err);
    });

    return true;
  } catch (err) {
    console.error('Error saving database file:', err);
    return false;
  }
}

/**
 * Save database and await Firestore sync (with timeout fallback)
 */
export async function saveDatabaseAsync(data: DatabaseState): Promise<boolean> {
  try {
    const nowIso = new Date().toISOString();
    data.lastUpdatedAt = nowIso;

    const dir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');

    try {
      await Promise.race([
        setDoc(doc(firestoreDb, 'portal', 'main_database'), {
          ...data,
          lastUpdatedAt: nowIso,
        }),
        new Promise((_, resolve) => setTimeout(resolve, 3000)),
      ]);
    } catch (syncErr) {
      console.warn('Firestore sync warning (saved locally):', (syncErr as Error).message);
    }

    return true;
  } catch (err) {
    console.error('Error saving database file:', err);
    return false;
  }
}

// Helper methods
export function getScholarships(): Scholarship[] {
  return getDatabase().scholarships;
}

export function getScholarshipBySlugOrId(idOrSlug: string): Scholarship | undefined {
  const db = getDatabase();
  return db.scholarships.find((s) => s.id === idOrSlug || s.slug === idOrSlug);
}

export async function incrementScholarshipViews(idOrSlug: string): Promise<number> {
  const db = getDatabase();
  const item = db.scholarships.find((s) => s.id === idOrSlug || s.slug === idOrSlug);
  if (item) {
    item.viewsCount = (item.viewsCount || 0) + 1;
    if (!db.stats) {
      db.stats = { totalViews: 0, dailyViews: [] };
    }
    db.stats.totalViews = db.scholarships.reduce((sum, s) => sum + (s.viewsCount || 0), 0);

    // Update dailyViews for today
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
