import { isAdminAuthed } from '@/lib/engagementStore'
import { isGodRole, isStaffRole, loadAuthUser, type UserRole } from '@/lib/auth'

export type AdminActor = {
  /** 'owner' = admin-panel session from the owner key. */
  role: 'owner' | UserRole | 'public'
  name: string
  god: boolean
  staff: boolean
  /** Unmasked visitor IP / user-agent visibility. */
  canSeeVisitorPii: boolean
}

/**
 * Who the browser currently is, from the client's point of view. The server
 * re-derives all of this from the request headers, so this is only used to pick
 * the right UI — never as the sole gate on privileged data.
 */
export function currentActor(): AdminActor {
  const user = loadAuthUser()
  if (isAdminAuthed()) {
    return { role: 'owner', name: user?.name || 'Owner', god: true, staff: true, canSeeVisitorPii: true }
  }
  if (user && isGodRole(user.role)) {
    return { role: user.role, name: user.name, god: true, staff: true, canSeeVisitorPii: true }
  }
  if (user && isStaffRole(user.role)) {
    return {
      role: user.role,
      name: user.name,
      god: false,
      staff: true,
      canSeeVisitorPii: user.role === 'admin',
    }
  }
  return {
    role: user?.role ?? 'public',
    name: user?.name || '',
    god: false,
    staff: false,
    canSeeVisitorPii: false,
  }
}

/** True when the caller can reach `/admin` — owner session or super admin account. */
export function hasGodMode(): boolean {
  return currentActor().god
}
