import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

// Log the connection string (masking password for security)
const dbUrl = process.env.DATABASE_URL || '';
if (dbUrl) {
  // Mask password in output
  const maskedUrl = dbUrl.replace(/:([^:@]+)@/, ':***@');
  console.log('🔍 Checking connection string format...');
  console.log('Connection string:', maskedUrl);
  
  // Check for common issues
  if (dbUrl.includes('[YOUR_PASSWORD]')) {
    console.error('❌ ERROR: You still have [YOUR_PASSWORD] in your .env file!');
    console.error('   Replace it with your actual password.');
  }
  
  if (dbUrl.includes('@') && !dbUrl.includes('%40')) {
    const parts = dbUrl.split('@');
    if (parts.length > 2) {
      console.error('❌ ERROR: Multiple @ symbols found. Your password may contain @ that needs encoding.');
      console.error('   If your password has @, replace @ with %40');
    }
  }
  
  // Check port
  const portMatch = dbUrl.match(/:(\d+)\//);
  if (portMatch) {
    const port = parseInt(portMatch[1]);
    console.log(`✅ Port number: ${port}`);
    if (port !== 5432) {
      console.warn('⚠️  WARNING: Port is not 5432. Are you sure this is the direct connection?');
    }
  } else {
    console.error('❌ ERROR: Could not find port number in connection string');
  }
  
  console.log('\n🧪 Testing connection...\n');
  
  prisma.$connect()
    .then(() => {
      console.log('✅ SUCCESS! Connection works!');
      return prisma.$disconnect();
    })
    .catch((error) => {
      console.error('❌ Connection failed:');
      console.error(error.message);
      if (error.message.includes('port')) {
        console.error('\n💡 TIP: Check your connection string format. Common issues:');
        console.error('   1. Password with @ not encoded (use %40 instead of @)');
        console.error('   2. Using pooler instead of direct (port should be 5432, not 6543)');
        console.error('   3. Still has [YOUR_PASSWORD] instead of real password');
      }
      process.exit(1);
    });
} else {
  console.error('❌ ERROR: DATABASE_URL not found in .env file');
  process.exit(1);
}


