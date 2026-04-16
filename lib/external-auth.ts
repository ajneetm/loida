import { SignJWT, jwtVerify } from 'jose'

const ACCESS_TTL  = 60 * 60        // 1 hour
const REFRESH_TTL = 60 * 60 * 24 * 30  // 30 days

function key(secret: string) {
  return new TextEncoder().encode(secret)
}

export async function signAccessToken(payload: object, secret: string) {
  const now = Math.floor(Date.now() / 1000)
  return new SignJWT({ ...(payload as any), type: 'access' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(now)
    .setExpirationTime(now + ACCESS_TTL)
    .sign(key(secret))
}

export async function signRefreshToken(payload: object, secret: string) {
  const now = Math.floor(Date.now() / 1000)
  return new SignJWT({ ...(payload as any), type: 'refresh' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(now)
    .setExpirationTime(now + REFRESH_TTL)
    .sign(key(secret))
}

export async function verifyToken(token: string, secret: string) {
  const { payload } = await jwtVerify(token, key(secret))
  return payload
}

export function accessExpiresAt() {
  return new Date(Date.now() + ACCESS_TTL * 1000).toISOString()
}

export function refreshExpiresAt() {
  return new Date(Date.now() + REFRESH_TTL * 1000).toISOString()
}
