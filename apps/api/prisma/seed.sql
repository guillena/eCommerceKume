-- ================================================================
-- eCommerceKume — Script de Datos Iniciales (Producción / Dev)
-- Puedes ejecutar este SQL directamente en la pestaña "Data" o "Query" 
-- del servicio Postgres en Railway.
-- ================================================================

-- 1. Usuario Administrador Inicial
-- Email: admin@kume.com
-- Password por defecto: Admin1234!
INSERT INTO "AdminUser" ("id", "email", "passwordHash", "createdAt") 
VALUES (
  'cmtrywf2v0000v0agb2iwq2do',
  'admin@kume.com',
  '$2a$12$vtBjC9UCbiWnpGgRRSyIS.fIQzC0SkgzXRhPuilrfEaNAbH6xnKhq',
  NOW()
)
ON CONFLICT ("email") DO UPDATE 
SET "passwordHash" = EXCLUDED."passwordHash";

-- 2. Categorías Iniciales
INSERT INTO "Category" ("id", "name", "slug", "icon") 
VALUES
  ('cat_ebooks', 'Ebooks', 'ebooks', '📚'),
  ('cat_cursos', 'Cursos y Talleres', 'cursos', '🎓'),
  ('cat_plantillas', 'Plantillas y Guías', 'plantillas', '📋'),
  ('cat_marketing', 'Marketing Digital', 'marketing', '📣'),
  ('cat_finanzas', 'Finanzas', 'finanzas', '💰'),
  ('cat_productividad', 'Productividad', 'productividad', '⚡')
ON CONFLICT ("slug") DO UPDATE 
SET "name" = EXCLUDED."name", "icon" = EXCLUDED."icon";

-- 3. Cache de Cotización USD/ARS (Singleton)
INSERT INTO "ExchangeRateCache" ("id", "usdToArs", "updatedAt") 
VALUES ('singleton', 1400.0, NOW())
ON CONFLICT ("id") DO UPDATE 
SET "usdToArs" = EXCLUDED."usdToArs", "updatedAt" = EXCLUDED."updatedAt";

-- 4. Productos de Ejemplo / Catálogo Inicial
INSERT INTO "Product" (
  "id", "slug", "title", "tagline", "description", 
  "benefits", "objectives", "price", "currency", 
  "fileUrl", "previewUrl", "coverImage", "images", 
  "fileType", "fileSizeBytes", "pageCount", "previewPages", 
  "isActive", "isFeatured", "duration", "targetAudience", 
  "attendeeCount", "categoryId", "createdAt", "updatedAt"
)
VALUES
(
  'prod_hacer_lugar',
  'hacer-lugar',
  'HACER LUGAR',
  'Experiencia vivencial para adultos que acompañan infancias y adolescencias',
  'Hay niños y adolescentes que hablan mucho. Otros responden con un "todo bien", se refugian en el celular, evitan la mirada o reaccionan con enojo. Con frecuencia, el desafío para los adultos no es saber qué hacer cuando un chico cuenta un problema, sino lograr que quiera contarlo.',
  ARRAY['Transformar la mirada del adulto antes que transmitir información.', 'Ofrecer herramientas simples y aplicables.'],
  ARRAY['Fortalecer las competencias vinculares de los adultos para construir relaciones de confianza con niños y adolescentes, favoreciendo espacios donde pedir ayuda sea posible.'],
  7500.0,
  'ARS',
  'storage/files/hacer-lugar.pdf',
  '/api/preview/hacer-lugar',
  '',
  ARRAY[]::text[],
  'pdf',
  162651,
  6,
  3,
  true,
  true,
  '1 encuentro (80-90 minutos)',
  'Referentes adultos que trabajan con infancias y adolescencias',
  '20/30 participantes',
  (SELECT "id" FROM "Category" WHERE "slug" = 'cursos' LIMIT 1),
  NOW(),
  NOW()
),
(
  'prod_aprendizajes',
  'aprendizajes-en-juego',
  'Aprendizajes en Juego',
  'Diseño de experiencias lúdicas para potenciar el aprendizaje',
  'Guía y herramientas prácticas para docentes, psicopedagogos y talleristas interesadas en potenciar el aprendizaje a través del juego y dinámicas participativas.',
  ARRAY['Estrategias lúdicas probadas en aula y talleres.', 'Metodología para diseñar experiencias de aprendizaje atractivas.'],
  ARRAY['Aprender a diseñar y facilitar juegos como disparadores de conocimiento y reflexión.'],
  6000.0,
  'ARS',
  'storage/files/aprendizajes-juegos.pdf',
  '/api/preview/aprendizajes-juegos',
  '/api/covers/aprendizajes-juegos.jpg',
  ARRAY[]::text[],
  'pdf',
  4059087,
  10,
  3,
  true,
  true,
  '1 encuentro (80-90 minutos)',
  'Docentes, psicopedagogos/as, profesionales de la educación, talleristas y coordinadores de grupos.',
  '20/30 participantes',
  (SELECT "id" FROM "Category" WHERE "slug" = 'ebooks' LIMIT 1),
  NOW(),
  NOW()
)
ON CONFLICT ("slug") DO UPDATE 
SET 
  "title" = EXCLUDED."title",
  "tagline" = EXCLUDED."tagline",
  "price" = EXCLUDED."price",
  "isActive" = EXCLUDED."isActive",
  "isFeatured" = EXCLUDED."isFeatured";
