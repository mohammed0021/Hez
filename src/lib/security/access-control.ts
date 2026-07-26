export type Role = 'user' | 'premium' | 'admin';
export type Permission =
  'read:own' | 'write:own' | 'delete:own' | 'read:any' | 'write:any' | 'delete:any' | 'admin';

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  user: ['read:own', 'write:own', 'delete:own'],
  premium: ['read:own', 'write:own', 'delete:own'],
  admin: ['read:own', 'write:own', 'delete:own', 'read:any', 'write:any', 'delete:any', 'admin'],
};

export function hasPermission(userRole: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[userRole]?.includes(permission) ?? false;
}

export function isOwner(userId: string, resourceOwnerId: string): boolean {
  return userId === resourceOwnerId;
}

export function checkAccess(
  userId: string,
  resourceOwnerId: string,
  userRole: Role,
  permission: Permission,
): {
  allowed: boolean;
  reason?: string;
} {
  if (hasPermission(userRole, permission.replace('own', 'any') as Permission)) {
    return { allowed: true };
  }
  if (hasPermission(userRole, permission) && isOwner(userId, resourceOwnerId)) {
    return { allowed: true };
  }
  return { allowed: false, reason: 'Access denied: insufficient permissions' };
}

export function requireOwnership(
  userId: string,
  resourceOwnerId: string,
): {
  allowed: boolean;
  reason?: string;
} {
  if (userId === resourceOwnerId) return { allowed: true };
  return { allowed: false, reason: 'Access denied: resource does not belong to user' };
}

export function maskUserId(id: string): string {
  if (id.length < 8) return id;
  return `${id.slice(0, 4)}...${id.slice(-4)}`;
}
