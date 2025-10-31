import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting data migration...');

  // Check if there are applications without a userId
  const orphanedApps = await prisma.application.count({
    where: {
      userId: null,
    },
  });

  console.log(`Found ${orphanedApps} applications without a user.`);

  if (orphanedApps === 0) {
    console.log('No migration needed. All applications have users.');
    return;
  }

  // Create or find a default user
  const defaultEmail = 'user@applysimple.com';
  let defaultUser = await prisma.user.findUnique({
    where: { email: defaultEmail },
  });

  if (!defaultUser) {
    console.log(`Creating default user: ${defaultEmail}`);
    const hashedPassword = await bcrypt.hash('password123', 10);
    defaultUser = await prisma.user.create({
      data: {
        email: defaultEmail,
        password: hashedPassword,
        name: 'Default User',
      },
    });
    console.log(`✓ Created default user with email: ${defaultEmail}`);
    console.log(`  Password: password123`);
  } else {
    console.log(`✓ Using existing default user: ${defaultEmail}`);
  }

  // Assign all orphaned applications to the default user
  const result = await prisma.application.updateMany({
    where: {
      userId: null,
    },
    data: {
      userId: defaultUser.id,
    },
  });

  console.log(`✓ Assigned ${result.count} applications to the default user.`);
  console.log('\nMigration complete!');
  console.log(`\nYou can now sign in with:`);
  console.log(`  Email: ${defaultEmail}`);
  console.log(`  Password: password123`);
}

main()
  .catch((e) => {
    console.error('Migration failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
