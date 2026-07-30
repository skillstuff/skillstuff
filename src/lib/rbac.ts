import { getAuthenticatedUser } from './auth';

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR' | 'AUTHOR';

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  SUPER_ADMIN: 4,
  ADMIN: 3,
  EDITOR: 2,
  AUTHOR: 1,
};

export function hasRole(userRole: string, requiredRole: UserRole): boolean {
  const userRank = ROLE_HIERARCHY[userRole as UserRole] || 0;
  const requiredRank = ROLE_HIERARCHY[requiredRole] || 0;
  return userRank >= requiredRank;
}

export async function requireAuth(requiredRole: UserRole = 'AUTHOR') {
  const user = await getAuthenticatedUser();
  if (!user) {
    throw new Error('UNAUTHORIZED: Authentication required.');
  }

  if (!hasRole(user.role, requiredRole)) {
    throw new Error(`FORBIDDEN: Insufficient permissions. Required role: ${requiredRole}.`);
  }

  return user;
}

export async function canManageUser(targetUserRole: string): Promise<boolean> {
  const currentUser = await getAuthenticatedUser();
  if (!currentUser) return false;

  if (currentUser.role === 'SUPER_ADMIN') return true;
  if (currentUser.role === 'ADMIN' && targetUserRole !== 'SUPER_ADMIN') return true;
  return false;
}

export async function canModifyArticle(articleAuthorId: string): Promise<boolean> {
  const user = await getAuthenticatedUser();
  if (!user) return false;

  // Super Admin, Admin, Editor can edit any article
  if (hasRole(user.role, 'EDITOR')) return true;

  // Author can only edit their own articles
  if (user.role === 'AUTHOR' && user.author?.id === articleAuthorId) return true;

  return false;
}
