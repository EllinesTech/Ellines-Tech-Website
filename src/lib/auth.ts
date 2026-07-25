const USER_KEY = 'et_user'
const TOKEN_KEY = 'et_user_token'

export type UserRole = 'super_admin' | 'admin' | 'staff' | 'customer'

export type AuthUser = {
  id: string
  email: string
  name: string
  role: UserRole
  jobTitle?: string
}

export function isStaffRole(role?: string | null): boolean {
  return role === 'staff' || role === 'admin' || role === 'super_admin'
}

export function isCustomerRole(role?: string | null): boolean {
  return role === 'customer'
}

export function loadAuthUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? (JSON.parse(raw) as AuthUser) : null
  } catch {
    return null
  }
}

export function loadAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function saveAuthSession(token: string, user: AuthUser) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearAuthSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}
