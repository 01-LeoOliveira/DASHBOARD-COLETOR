// app/Login/utils/auth.ts
import { sign, verify, Secret, JwtPayload } from 'jsonwebtoken';

const SECRET_KEY: Secret = process.env.JWT_SECRET_KEY || 'your-secret-key';

export function createToken(payload: object): string {
  return sign(payload, SECRET_KEY, { expiresIn: '1h' });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return verify(token, SECRET_KEY) as JwtPayload;
  } catch (error) {
    return null;
  }
}

function isClient(): boolean {
  return typeof window !== 'undefined';
}

export function setToken(token: string): void {
  if (isClient()) {
    localStorage.setItem('adminToken', token);
  }
}

export function getToken(): string | null {
  if (isClient()) {
    return localStorage.getItem('adminToken');
  }
  return null;
}

export function removeToken(): void {
  if (isClient()) {
    localStorage.removeItem('adminToken');
  }
}