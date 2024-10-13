import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const roundsOfHashing = 10;

async function main() {
    const passwordZalfy = await bcrypt.hash('admin', roundsOfHashing);
    const passwordNest = await bcrypt.hash('nestprisma', roundsOfHashing);

  const user1 = await prisma.user.upsert({
    where: { email: 'zalfy@gmail.com' },
    update: {
        password: passwordZalfy
    },
    create: {
      email: 'zalfy@gmail.com',
      name: 'Zalfy Putra',
      password: passwordZalfy,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'nest@prisma.com' },
    update: {
        password: passwordNest
    },
    create: {
      email: 'nest@prisma.com',
      name: 'Nest JS',
      password: passwordNest,
    },
  });

  const note1 = await prisma.note.upsert({
    where: { title: 'Prisma Adds Support for MongoDB' },
    update: {
        authorId: user1.id,
    },
    create: {
      title: 'Prisma Adds Support for MongoDB',
      body: 'Support for MongoDB has been one of the most requested features since the initial release of...',
      authorId: user1.id,
    },
  });

  const note2 = await prisma.note.upsert({
    where: { title: "What's new in Prisma? (Q1/22)" },
    update: {
        authorId: user2.id,
    },
    create: {
      title: "What's new in Prisma? (Q1/22)",
      body: 'Our engineers have been working hard, issuing new releases with many improvements...',
      authorId: user2.id,
    },
  });

  const note3 = await prisma.note.upsert({
    where: { title: 'Prisma Client Just Became a Lot More Flexible' },
    update: {},
    create: {
      title: 'Prisma Client Just Became a Lot More Flexible',
      body: 'Prisma Client extensions provide a powerful new way to add functionality to Prisma in a type-safe manner...',
    },
  });

  console.log({ user1, user2, note1, note2, note3 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
