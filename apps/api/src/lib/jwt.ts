import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret-change-in-production';

interface AdminTokenPayload {
  adminId: string;
  iat?: number;
  exp?: number;
}

export function signAdminToken(adminId: string): string {
  return jwt.sign({ adminId }, JWT_SECRET, { expiresIn: '8h' });
}

export function verifyAdminToken(token: string): AdminTokenPayload | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as AdminTokenPayload;
    return payload;
  } catch {
    return null;
  }
}

export function generateDownloadToken(): string {
  return uuidv4();
}
