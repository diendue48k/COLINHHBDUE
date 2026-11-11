import { NextResponse } from 'next/server';
import { getDatabase, getDatabaseAsync, saveDatabaseAsync, incrementScholarshipViews } from '@/lib/db';
import { ADMIN_USERS } from '@/lib/auth';
import { Scholarship, Category, Announcement, User, FAQItem, ContactInquiry } from '@/types';

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

    if (!db.users || db.users.length === 0) {
      db.users = ADMIN_USERS;
    }

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
    if (type === 'users') {
      return NextResponse.json(db.users, { headers: noCacheHeaders });
    }
    if (type === 'inquiries') {
      return NextResponse.json(db.inquiries || [], { headers: noCacheHeaders });
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

    if (!action || typeof action !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid action' }, { status: 400 });
    }

    const db = getDatabase();
    if (!db.users || db.users.length === 0) {
      db.users = [...ADMIN_USERS];
    }

    switch (action) {
      case 'increment_views': {
        if (!payload?.id) {
          return NextResponse.json({ error: 'Missing scholarship id' }, { status: 400 });
        }
        const newViews = await incrementScholarshipViews(payload.id);
        return NextResponse.json({ success: true, viewsCount: newViews });
      }

      case 'save_scholarship': {
        const scholarship: Scholarship = payload;
        if (!scholarship?.id || !scholarship?.title) {
          return NextResponse.json({ error: 'Missing required scholarship fields' }, { status: 400 });
        }
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
        await saveDatabaseAsync(db);
        return NextResponse.json({ success: true, data: scholarship });
      }

      case 'delete_scholarship': {
        if (!payload?.id) {
          return NextResponse.json({ error: 'Missing scholarship id' }, { status: 400 });
        }
        db.scholarships = db.scholarships.filter((s) => s.id !== payload.id);
        await saveDatabaseAsync(db);
        return NextResponse.json({ success: true });
      }

      case 'duplicate_scholarship': {
        const original = db.scholarships.find((s) => s.id === payload?.id);
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
          cardTitle: original.cardTitle ? `${original.cardTitle} (Bản sao)` : '',
          viewsCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        db.scholarships.push(duplicate);
        await saveDatabaseAsync(db);
        return NextResponse.json({ success: true, data: duplicate });
      }

      case 'save_category': {
        const category: Category = payload;
        if (!category?.id || !category?.title) {
          return NextResponse.json({ error: 'Missing required category fields' }, { status: 400 });
        }
        const index = db.categories.findIndex((c) => c.id === category.id);
        if (index >= 0) {
          db.categories[index] = category;
        } else {
          db.categories.push(category);
        }
        await saveDatabaseAsync(db);
        return NextResponse.json({ success: true, data: category });
      }

      case 'delete_category': {
        if (!payload?.id) {
          return NextResponse.json({ error: 'Missing category id' }, { status: 400 });
        }
        db.categories = db.categories.filter((c) => c.id !== payload.id);
        await saveDatabaseAsync(db);
        return NextResponse.json({ success: true });
      }

      case 'save_announcement': {
        const announcement: Announcement = payload;
        if (!announcement?.id || !announcement?.title) {
          return NextResponse.json({ error: 'Missing required announcement fields' }, { status: 400 });
        }
        const index = db.announcements.findIndex((a) => a.id === announcement.id);
        if (index >= 0) {
          db.announcements[index] = announcement;
        } else {
          db.announcements.unshift(announcement);
        }
        await saveDatabaseAsync(db);
        return NextResponse.json({ success: true, data: announcement });
      }

      case 'delete_announcement': {
        if (!payload?.id) {
          return NextResponse.json({ error: 'Missing announcement id' }, { status: 400 });
        }
        db.announcements = db.announcements.filter((a) => a.id !== payload.id);
        await saveDatabaseAsync(db);
        return NextResponse.json({ success: true });
      }

      case 'save_faq': {
        const faq: FAQItem = payload;
        if (!faq?.id || !faq?.question) {
          return NextResponse.json({ error: 'Missing required FAQ fields' }, { status: 400 });
        }
        if (!db.faqs) db.faqs = [];
        const index = db.faqs.findIndex((f) => f.id === faq.id);
        if (index >= 0) {
          db.faqs[index] = faq;
        } else {
          db.faqs.push(faq);
        }
        await saveDatabaseAsync(db);
        return NextResponse.json({ success: true, data: faq });
      }

      case 'delete_faq': {
        if (!payload?.id) {
          return NextResponse.json({ error: 'Missing FAQ id' }, { status: 400 });
        }
        if (db.faqs) {
          db.faqs = db.faqs.filter((f) => f.id !== payload.id);
          await saveDatabaseAsync(db);
        }
        return NextResponse.json({ success: true });
      }

      case 'save_user': {
        const user: User = payload;
        if (!user?.id || !user?.name || !user?.email) {
          return NextResponse.json({ error: 'Missing required user fields' }, { status: 400 });
        }
        if (!db.users) db.users = [...ADMIN_USERS];
        const index = db.users.findIndex((u) => u.id === user.id);
        if (index >= 0) {
          db.users[index] = user;
        } else {
          db.users.push(user);
        }
        await saveDatabaseAsync(db);
        return NextResponse.json({ success: true, data: user, users: db.users });
      }

      case 'delete_user': {
        if (!payload?.id) {
          return NextResponse.json({ error: 'Missing user id' }, { status: 400 });
        }
        if (!db.users) db.users = [...ADMIN_USERS];
        if (db.users.length <= 1) {
          return NextResponse.json(
            { error: 'Không thể xóa tài khoản quản trị viên cuối cùng của hệ thống' },
            { status: 400 }
          );
        }
        db.users = db.users.filter((u) => u.id !== payload.id);
        await saveDatabaseAsync(db);
        return NextResponse.json({ success: true, users: db.users });
      }

      case 'save_inquiry': {
        const inquiry: ContactInquiry = {
          id: payload?.id || `inq-${Date.now()}`,
          fullName: (payload?.fullName || '').trim(),
          email: (payload?.email || '').trim(),
          phone: (payload?.phone || '').trim(),
          topic: (payload?.topic || 'Chung').trim(),
          content: (payload?.content || '').trim(),
          status: payload?.status || 'new',
          createdAt: payload?.createdAt || new Date().toISOString(),
        };
        if (!inquiry.fullName || !inquiry.email || !inquiry.content) {
          return NextResponse.json({ error: 'Vui lòng điền đầy đủ thông tin bắt buộc' }, { status: 400 });
        }
        if (!db.inquiries) db.inquiries = [];
        const idx = db.inquiries.findIndex((i) => i.id === inquiry.id);
        if (idx >= 0) {
          db.inquiries[idx] = inquiry;
        } else {
          db.inquiries.unshift(inquiry);
        }
        await saveDatabaseAsync(db);
        return NextResponse.json({ success: true, data: inquiry });
      }

      case 'delete_inquiry': {
        if (!payload?.id) {
          return NextResponse.json({ error: 'Missing inquiry id' }, { status: 400 });
        }
        if (db.inquiries) {
          db.inquiries = db.inquiries.filter((i) => i.id !== payload.id);
          await saveDatabaseAsync(db);
        }
        return NextResponse.json({ success: true });
      }

      case 'save_settings': {
        db.settings = { ...db.settings, ...payload };
        await saveDatabaseAsync(db);
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
