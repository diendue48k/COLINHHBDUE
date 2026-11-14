const fs = require('fs');
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyAvI8WlZp6JCukBINRKeirlSh-CsoKfzDE",
  authDomain: "hbclinh.firebaseapp.com",
  projectId: "hbclinh",
  storageBucket: "hbclinh.firebasestorage.app",
  messagingSenderId: "102299246755",
  appId: "1:102299246755:web:b116ebfa02dced85489f16"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function syncAll() {
  console.log('Reading local data/db.json...');
  const data = JSON.parse(fs.readFileSync('data/db.json', 'utf8'));

  console.log(`Syncing ${data.categories.length} categories to Firestore...`);
  for (const cat of data.categories) {
    await setDoc(doc(db, 'categories', cat.id), cat);
  }

  console.log(`Syncing ${data.scholarships.length} scholarships to Firestore...`);
  for (const s of data.scholarships) {
    await setDoc(doc(db, 'scholarships', s.id), s);
  }

  console.log(`Syncing ${data.announcements.length} announcements to Firestore...`);
  for (const ann of data.announcements) {
    await setDoc(doc(db, 'announcements', ann.id), ann);
  }

  if (data.faqs && Array.isArray(data.faqs)) {
    console.log(`Syncing ${data.faqs.length} FAQs to Firestore...`);
    for (const faq of data.faqs) {
      await setDoc(doc(db, 'faqs', faq.id), faq);
    }
  }

  if (data.settings) {
    await setDoc(doc(db, 'system', 'settings'), data.settings);
  }

  if (data.stats) {
    await setDoc(doc(db, 'system', 'stats'), data.stats);
  }

  // Also save a master document for single-trip fast fetching
  const nowIso = new Date().toISOString();
  await setDoc(doc(db, 'portal', 'main_database'), {
    categories: data.categories,
    scholarships: data.scholarships,
    announcements: data.announcements,
    faqs: data.faqs || [],
    users: data.users || [],
    inquiries: data.inquiries || [],
    settings: data.settings || {},
    stats: data.stats || {},
    lastUpdatedAt: nowIso,
    lastSyncedAt: nowIso,
  });

  console.log('🎉 Successfully synced all data to Firebase Firestore (project hbclinh)!');
}

syncAll()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('Error syncing:', e);
    process.exit(1);
  });
