import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const db = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create a demo agent
  const passwordHash = await bcrypt.hash('password123', 12);

  const agent = await db.agent.upsert({
    where: { email: 'demo@financial-pro.com' },
    update: {},
    create: {
      email: 'demo@financial-pro.com',
      passwordHash,
      firstName: 'Demo',
      lastName: 'Agent',
      referralCode: 'demo-agent',
    },
  });

  console.log(`Created demo agent: ${agent.email} (code: ${agent.referralCode})`);
  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
