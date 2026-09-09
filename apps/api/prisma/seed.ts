/**
 * Seed script for eCommerceKume
 * Run with: pnpm db:seed (or pnpm --filter api db:seed)
 *
 * Populates:
 * - Admin user (ADMIN_EMAIL, ADMIN_PASSWORD)
 * - Categories
 * - Exchange rate cache
 * - Initial products (Hacer Lugar, Aprendizajes en Juego)
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Admin User
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@kume.com';
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'Admin1234!';
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: {
      email: adminEmail,
      passwordHash,
    },
  });
  console.log(`✅ Admin user ready: ${admin.email} (Password: ${adminPassword})`);

  // 2. Default Categories
  const categories = [
    { name: 'Ebooks', slug: 'ebooks', icon: '📚' },
    { name: 'Cursos y Talleres', slug: 'cursos', icon: '🎓' },
    { name: 'Plantillas y Guías', slug: 'plantillas', icon: '📋' },
    { name: 'Marketing Digital', slug: 'marketing', icon: '📣' },
    { name: 'Finanzas', slug: 'finanzas', icon: '💰' },
    { name: 'Productividad', slug: 'productividad', icon: '⚡' },
  ];

  const categoryMap: Record<string, string> = {};
  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, icon: cat.icon },
      create: cat,
    });
    categoryMap[cat.slug] = created.id;
  }
  console.log(`✅ ${categories.length} categories seeded.`);

  // 3. Exchange Rate Cache singleton
  await prisma.exchangeRateCache.upsert({
    where: { id: 'singleton' },
    update: { usdToArs: 1400 },
    create: { id: 'singleton', usdToArs: 1400 },
  });
  console.log('✅ Exchange rate cache initialized (USD/ARS: 1400).');

  // 4. Initial Products
  const products = [
    {
      slug: 'hacer-lugar',
      title: 'HACER LUGAR',
      tagline: 'Experiencia vivencial para adultos que acompañan infancias y adolescencias',
      description:
        'Hay niños y adolescentes que hablan mucho. Otros responden con un "todo bien", se refugian en el celular, evitan la mirada o reaccionan con enojo. Con frecuencia, el desafío para los adultos no es saber qué hacer cuando un chico cuenta un problema, sino lograr que quiera contarlo.',
      benefits: [
        'Transformar la mirada del adulto antes que transmitir información.',
        'Ofrecer herramientas simples y aplicables.',
      ],
      objectives: [
        'Fortalecer las competencias vinculares de los adultos para construir relaciones de confianza con niños y adolescentes, favoreciendo espacios donde pedir ayuda sea posible.',
      ],
      price: 7500,
      currency: 'ARS',
      fileUrl: 'storage/files/hacer-lugar.pdf',
      previewUrl: '/api/preview/hacer-lugar',
      coverImage: '',
      images: [],
      fileType: 'pdf',
      fileSizeBytes: 162651,
      pageCount: 6,
      previewPages: 3,
      isActive: true,
      isFeatured: true,
      duration: '1 encuentro (80-90 minutos)',
      targetAudience: 'Referentes adultos que trabajan con infancias y adolescencias',
      attendeeCount: '20/30 participantes',
      categoryId: categoryMap['cursos'] ?? categoryMap['ebooks'],
    },
    {
      slug: 'aprendizajes-en-juego',
      title: 'Aprendizajes en Juego',
      tagline: 'Diseño de experiencias lúdicas para potenciar el aprendizaje',
      description:
        'Guía y herramientas prácticas para docentes, psicopedagogos y talleristas interesadas en potenciar el aprendizaje a través del juego y dinámicas participativas.',
      benefits: [
        'Estrategias lúdicas probadas en aula y talleres.',
        'Metodología para diseñar experiencias de aprendizaje atractivas.',
      ],
      objectives: [
        'Aprender a diseñar y facilitar juegos como disparadores de conocimiento y reflexión.',
      ],
      price: 6000,
      currency: 'ARS',
      fileUrl: 'storage/files/aprendizajes-juegos.pdf',
      previewUrl: '/api/preview/aprendizajes-juegos',
      coverImage: '/api/covers/aprendizajes-juegos.jpg',
      images: [],
      fileType: 'pdf',
      fileSizeBytes: 4059087,
      pageCount: 10,
      previewPages: 3,
      isActive: true,
      isFeatured: true,
      duration: '1 encuentro (80-90 minutos)',
      targetAudience:
        'Docentes, psicopedagogos/as, profesionales de la educación, talleristas y coordinadores de grupos.',
      attendeeCount: '20/30 participantes',
      categoryId: categoryMap['ebooks'],
    },
  ];

  for (const prod of products) {
    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {
        title: prod.title,
        tagline: prod.tagline,
        description: prod.description,
        price: prod.price,
        benefits: prod.benefits,
        objectives: prod.objectives,
        categoryId: prod.categoryId,
        isActive: prod.isActive,
        isFeatured: prod.isFeatured,
      },
      create: prod,
    });
  }
  console.log(`✅ ${products.length} products seeded.`);

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((err) => {
    console.error('❌ Seed error:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
