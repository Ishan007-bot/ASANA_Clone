import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('🔧 Fixing user passwords...\n');

  try {
    // Get all users
    const users = await prisma.user.findMany();
    console.log(`Found ${users.length} users to update`);

    // Hash the password once
    const passwordHash = await bcrypt.hash('password123', 10);

    // Update all users with the same password
    const updatePromises = users.map(user =>
      prisma.user.update({
        where: { id: user.id },
        data: { passwordHash },
      })
    );

    await Promise.all(updatePromises);

    console.log(`✅ Updated ${users.length} users with password: password123`);
    
    // Check if test user exists, if not create it
    let testUser = await prisma.user.findUnique({
      where: { email: 'test@example.com' },
    });

    if (!testUser) {
      testUser = await prisma.user.create({
        data: {
          email: 'test@example.com',
          name: 'Test User',
          initials: 'TU',
          passwordHash,
          theme: 'dark',
        },
      });
      console.log('✅ Created test user: test@example.com');
    }

    console.log('\n📝 Login credentials:');
    console.log('   Email: test@example.com');
    console.log('   Password: password123');
    console.log('\n   Or use any of the seeded user emails with password: password123');
    
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error('❌ Fatal error:', e);
    process.exit(1);
  });

