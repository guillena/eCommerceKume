/**
 * Seed script for eCommerceKume
 * Run with: pnpm db:seed
 *
 * Creates:
 * - Admin user (using ADMIN_EMAIL and ADMIN_PASSWORD env vars)
 * - Default categories
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@kume.com';
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'admin1234';

  const existing = await prisma.adminUser.findUnique({ where: { email: adminEmail } });
  if (!existing) {
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    await prisma.adminUser.create({
      data: { email: adminEmail, passwordHash },
    });
    console.log(`✅ Admin user created: ${adminEmail}`);
  } else {
    console.log(`ℹ️ Admin user already exists: ${adminEmail}`);
  }

  // Create default categories
  const categories = [
    { name: 'Ebooks', slug: 'ebooks', icon: '📚' },
    { name: 'Plantillas', slug: 'plantillas', icon: '📋' },
    { name: 'Cursos', slug: 'cursos', icon: '🎓' },
    { name: 'Marketing', slug: 'marketing', icon: '📣' },
    { name: 'Finanzas', slug: 'finanzas', icon: '💰' },
    { name: 'Productividad', slug: 'productividad', icon: '⚡' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log(`✅ ${categories.length} categories seeded`);

  console.log('🎉 Seeding complete!');
}

main()
  .catch((err) => {
    console.error('❌ Seed error:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
