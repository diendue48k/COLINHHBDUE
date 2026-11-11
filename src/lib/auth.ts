import { User } from '@/types';

export const ADMIN_USERS: User[] = [
  {
    id: 'usr-1',
    name: 'TS. Nguyễn Văn Quản Trị',
    email: 'admin@due.edu.vn',
    role: 'admin',
    avatar: '/images/logo-due-shield.png',
    createdAt: '2025-01-01',
  },
  {
    id: 'usr-2',
    name: 'Ban Quản trị Học bổng DUE',
    email: 'phongcongtacsinhvien@due.edu.vn',
    role: 'admin',
    avatar: '/images/logo-due-shield.png',
    createdAt: '2025-01-15',
  },
];

export const CURRENT_USER_KEY = 'due_portal_admin_user';
export const LOGGED_OUT_KEY = 'due_portal_admin_logged_out';

export function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null;
  if (localStorage.getItem(LOGGED_OUT_KEY) === 'true') {
    return null;
  }
  const raw = localStorage.getItem(CURRENT_USER_KEY);
  if (!raw) {
    return ADMIN_USERS[0];
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    return ADMIN_USERS[0];
  }
}

export function setStoredUser(user: User | null): void {
  if (typeof window === 'undefined') return;
  if (!user) {
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.setItem(LOGGED_OUT_KEY, 'true');
  } else {
    localStorage.removeItem(LOGGED_OUT_KEY);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  }
}

export function clearStoredUser(): void {
  setStoredUser(null);
}
