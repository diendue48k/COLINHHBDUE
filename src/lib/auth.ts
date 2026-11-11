import { User } from '@/types';

export const ADMIN_USERS: User[] = [
  {
    id: 'usr-1',
    username: 'admin',
    password: 'Admin@DUE2026',
    name: 'Quản trị viên Hệ thống DUE',
    email: 'admin@due.edu.vn',
    role: 'admin',
    avatar: '/images/logo-due-shield.png',
    createdAt: '2025-01-01',
  },
  {
    id: 'usr-2',
    username: 'ctsv',
    password: 'CTSV@DUE2026',
    name: 'Phòng Công tác Sinh viên DUE',
    email: 'phongcongtacsinhvien@due.edu.vn',
    role: 'admin',
    avatar: '/images/logo-due-shield.png',
    createdAt: '2025-01-15',
  },
];

export const CURRENT_USER_KEY = 'due_portal_admin_session_v2';

export function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(CURRENT_USER_KEY);
  if (!raw) {
    return null;
  }
  try {
    const parsed = JSON.parse(raw);
    if (parsed && parsed.id && parsed.email) {
      return parsed;
    }
    return null;
  } catch (e) {
    return null;
  }
}

export function setStoredUser(user: User | null): void {
  if (typeof window === 'undefined') return;
  if (!user) {
    localStorage.removeItem(CURRENT_USER_KEY);
  } else {
    const safeUser: User = { ...user };
    delete safeUser.password;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));
  }
}

export function clearStoredUser(): void {
  setStoredUser(null);
}
