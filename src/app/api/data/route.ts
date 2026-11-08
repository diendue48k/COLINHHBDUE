import { NextResponse } from 'next/server';
import { getDatabase, getDatabaseAsync, saveDatabase, incrementScholarshipViews } from '@/lib/db';
import { initialData } from '@/data/initialData';
import { Scholarship, Category, Announcement, User } from '@/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const noCacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const db = await getDatabaseAsync();

    if (type === 'scholarships') {
      return NextResponse.json(db.scholarships, { headers: noCacheHeaders });
    }
    if (type === 'categories') {
      return NextResponse.json(db.categories, { headers: noCacheHeaders });
    }
    if (type === 'announcements') {
      return NextResponse.json(db.announcements, { headers: noCacheHeaders });
    }
    if (type === 'faqs') {
      return NextResponse.json(db.faqs || [], { headers: noCacheHeaders });
    }
    if (type === 'settings') {
      return NextResponse.json(db.settings, { headers: noCacheHeaders });
    }
    if (type === 'stats') {
      return NextResponse.json(db.stats, { headers: noCacheHeaders });
    }

    return NextResponse.json(db, { headers: noCacheHeaders });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch database' }, { status: 500, headers: noCacheHeaders });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, payload } = body;
    const db = getDatabase();

    switch (action) {
      case 'increment_views': {
        const newViews = incrementScholarshipViews(payload.id);
        return NextResponse.json({ success: true, viewsCount: newViews });
      }

      case 'save_scholarship': {
        const scholarship: Scholarship = payload;
        const index = db.scholarships.findIndex((s) => s.id === scholarship.id);
        if (index >= 0) {
          db.scholarships[index] = { ...scholarship, updatedAt: new Date().toISOString() };
        } else {
          db.scholarships.push({
            ...scholarship,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
        saveDatabase(db);
        return NextResponse.json({ success: true, data: scholarship });
      }

      case 'delete_scholarship': {
        db.scholarships = db.scholarships.filter((s) => s.id !== payload.id);
        saveDatabase(db);
        return NextResponse.json({ success: true });
      }

      case 'duplicate_scholarship': {
        const original = db.scholarships.find((s) => s.id === payload.id);
        if (!original) {
          return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }
        const newId = `sc-${Date.now()}`;
        const newSlug = `${original.slug}-copy-${Date.now()}`;
        const duplicate: Scholarship = {
          ...original,
          id: newId,
          slug: newSlug,
          title: `${original.title} (Bản sao)`,
          viewsCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        db.scholarships.push(duplicate);
        saveDatabase(db);
        return NextResponse.json({ success: true, data: duplicate });
      }

      case 'save_category': {
        const category: Category = payload;
        const index = db.categories.findIndex((c) => c.id === category.id);
        if (index >= 0) {
          db.categories[index] = category;
        } else {
          db.categories.push(category);
        }
        saveDatabase(db);
        return NextResponse.json({ success: true, data: category });
      }

      case 'delete_category': {
        db.categories = db.categories.filter((c) => c.id !== payload.id);
        saveDatabase(db);
        return NextResponse.json({ success: true });
      }

      case 'save_announcement': {
        const announcement: Announcement = payload;
        const index = db.announcements.findIndex((a) => a.id === announcement.id);
        if (index >= 0) {
          db.announcements[index] = announcement;
        } else {
          db.announcements.unshift(announcement);
        }
        saveDatabase(db);
        return NextResponse.json({ success: true, data: announcement });
      }

      case 'delete_announcement': {
        db.announcements = db.announcements.filter((a) => a.id !== payload.id);
        saveDatabase(db);
        return NextResponse.json({ success: true });
      }

      case 'save_faq': {
        const faq = payload;
        if (!db.faqs) db.faqs = [];
        const index = db.faqs.findIndex((f) => f.id === faq.id);
        if (index >= 0) {
          db.faqs[index] = faq;
        } else {
          db.faqs.push(faq);
        }
        saveDatabase(db);
        return NextResponse.json({ success: true, data: faq });
      }

      case 'delete_faq': {
        if (db.faqs) {
          db.faqs = db.faqs.filter((f) => f.id !== payload.id);
          saveDatabase(db);
        }
        return NextResponse.json({ success: true });
      }

      case 'save_settings': {
        db.settings = { ...db.settings, ...payload };
        saveDatabase(db);
        return NextResponse.json({ success: true, data: db.settings });
      }

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Operation failed' }, { status: 500 });
  }
}
