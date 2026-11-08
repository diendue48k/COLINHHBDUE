import fs from 'fs';
import path from 'path';
import { DatabaseState, Scholarship, Category, Announcement, User } from '../types';
import { initialData } from '../data/initialData';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db as firestoreDb } from './firebase';

const DB_FILE_PATH = path.join(process.cwd(), 'data', 'db.json');

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
 * Async database getter: Attempts to fetch real-time state from Firebase Firestore first,
 * with fast fallback to local db.json
 */
export async function getDatabaseAsync(): Promise<DatabaseState> {
  try {
    const docRef = doc(firestoreDb, 'portal', 'main_database');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data() as DatabaseState;
      // Also cache to local db.json for offline resilience
      try {
        fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
      } catch (_) {}
      return data;
    }
  } catch (err) {
    console.warn('Firebase Firestore read failed or timed out, using local fallback:', (err as Error).message);
  }
  return ensureDbFile();
}

/**
 * Save database: Writes to local disk and syncs directly to Firebase Firestore
 */
export function saveDatabase(data: DatabaseState): boolean {
  try {
    const dir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');

    // Async sync to Firebase Firestore without blocking
    setDoc(doc(firestoreDb, 'portal', 'main_database'), {
      ...data,
      lastUpdatedAt: new Date().toISOString(),
    }).catch((err) => {
      console.error('Error syncing to Firebase Firestore:', err);
    });

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

export function incrementScholarshipViews(idOrSlug: string): number {
  const db = getDatabase();
  const item = db.scholarships.find((s) => s.id === idOrSlug || s.slug === idOrSlug);
  if (item) {
    item.viewsCount = (item.viewsCount || 0) + 1;
    db.stats.totalViews = (db.stats.totalViews || 0) + 1;
    saveDatabase(db);
    return item.viewsCount;
  }
  return 0;
}
