import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../../lib/prisma';
import { signAdminToken } from '../../lib/jwt';

const router = Router();

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as { email: string; password: string };

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const admin = await prisma.adminUser.findUnique({ where: { email } });
    if (!admin) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const valid = await bcrypt.compare(password, admin.passwordHash);
    if (!valid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = signAdminToken(admin.id);
    res.json({ token, email: admin.email });
  } catch (err) {
    console.error('[admin:login]', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

export default router;
