import { PrismaClient, Role, MediaType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminPass = await bcrypt.hash('admin123', 10);
  const userPass = await bcrypt.hash('user123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@sdg7learn.local' },
    update: {},
    create: {
      name: 'Admin SDG7Learn',
      email: 'admin@sdg7learn.local',
      password: adminPass,
      role: Role.ADMIN,
    },
  });

  const user = await prisma.user.upsert({
    where: { email: 'mahasiswa@sdg7learn.local' },
    update: {},
    create: {
      name: 'Mahasiswa Demo',
      email: 'mahasiswa@sdg7learn.local',
      password: userPass,
      role: Role.USER,
    },
  });

  const article = await prisma.article.upsert({
    where: { slug: 'mengenal-energi-bersih' },
    update: {},
    create: {
      title: 'Mengenal Energi Bersih dan Terjangkau',
      slug: 'mengenal-energi-bersih',
      excerpt: 'Pengantar singkat tentang SDG 7.',
      content: 'Energi bersih dan terjangkau adalah tujuan ke-7 SDGs...',
      published: true,
      authorId: admin.id,
    },
  });

  await prisma.media.create({
    data: {
      type: MediaType.INFOGRAPHIC,
      title: 'Infografis SDG 7',
      url: 'https://example.com/infografis-sdg7.png',
      articleId: article.id,
    },
  });

  const quiz = await prisma.quiz.create({
    data: {
      title: 'Kuis Dasar Energi Bersih',
      description: 'Uji pemahamanmu tentang energi bersih.',
      published: true,
      creatorId: admin.id,
      questions: {
        create: [
          {
            questionText: 'Apa kepanjangan dari SDG?',
            order: 1,
            points: 1,
            options: {
              create: [
                { optionText: 'Sustainable Development Goals', isCorrect: true, order: 1 },
                { optionText: 'Simple Data Graph', isCorrect: false, order: 2 },
                { optionText: 'System Digital Gateway', isCorrect: false, order: 3 },
                { optionText: 'Software Design Guide', isCorrect: false, order: 4 },
              ],
            },
          },
          {
            questionText: 'SDG nomor berapa yang membahas energi bersih?',
            order: 2,
            points: 1,
            options: {
              create: [
                { optionText: 'SDG 5', isCorrect: false, order: 1 },
                { optionText: 'SDG 6', isCorrect: false, order: 2 },
                { optionText: 'SDG 7', isCorrect: true, order: 3 },
                { optionText: 'SDG 8', isCorrect: false, order: 4 },
              ],
            },
          },
        ],
      },
    },
  });

  await prisma.forum.create({
    data: {
      title: 'Diskusi Umum SDG 7',
      slug: 'diskusi-umum-sdg7',
      description: 'Forum untuk berdiskusi tentang energi bersih.',
      posts: {
        create: [
          {
            authorId: user.id,
            content: 'Halo semua, ada yang punya referensi jurnal tentang energi surya?',
          },
        ],
      },
    },
  });

  console.log('✅ Seed selesai. Admin:', admin.email, '| Quiz:', quiz.title);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });