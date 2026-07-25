const USER_KEY = 'et_user'
const TOKEN_KEY = 'et_user_token'

export type AuthUser = {
  id: string
  email: string
  name: string
  role: 'super_admin' | 'admin' | 'customer'
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
