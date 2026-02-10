import { UserRole } from '@/types/user';

export function getRoleBasedRoute(role: UserRole): string {
  switch (role) {
    case 'user':
      return '/(tabs)';
    case 'author':
      return '/(author-tabs)';
    case 'admin':
      return '/(admin-tabs)';
    default:
      return '/(tabs)';
  }
}
