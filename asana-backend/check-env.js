import dotenv from 'dotenv';
import fs from 'fs';

console.log('🔍 Checking .env file...\n');

// Read .env file directly
try {
  const envContent = fs.readFileSync('.env', 'utf8');
  const lines = envContent.split('\n');
  
  const dbUrlLine = lines.find(line => line.startsWith('DATABASE_URL'));
  
  if (!dbUrlLine) {
    console.error('❌ DATABASE_URL not found in .env file!');
    process.exit(1);
  }
  
  console.log('📄 DATABASE_URL line found:');
  console.log(dbUrlLine.substring(0, 50) + '...\n');
  
  // Check for common issues
  if (dbUrlLine.includes('username') && dbUrlLine.includes('host:port')) {
    console.error('❌ ERROR: Your .env still has the TEMPLATE, not the real Supabase connection string!');
    console.error('\n   It should look like:');
    console.error('   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.gfhdgquoonhtgqmyhvwc.supabase.co:5432/postgres"');
    console.error('\n   NOT like:');
    console.error('   DATABASE_URL="postgresql://username:password@host:port/database_name?schema=public"');
  } else if (dbUrlLine.includes('[YOUR_PASSWORD]')) {
    console.error('❌ ERROR: You still have [YOUR_PASSWORD] placeholder!');
    console.error('   Replace it with your actual password (URL-encoded if it has @)');
  } else if (dbUrlLine.includes('db.gfhdgquoonhtgqmyhvwc.supabase.co')) {
    console.log('✅ Good! Your connection string points to Supabase.');
    
    // Check for port
    if (dbUrlLine.includes(':5432/')) {
      console.log('✅ Port 5432 found (direct connection)');
    } else if (dbUrlLine.includes(':6543/')) {
      console.error('❌ ERROR: Port 6543 detected (this is the pooler, not direct connection!)');
      console.error('   Use port 5432 for direct connection');
    } else {
      console.warn('⚠️  Could not detect port number');
    }
    
    // Try to parse it
    dotenv.config();
    const dbUrl = process.env.DATABASE_URL;
    if (dbUrl) {
      try {
        const url = new URL(dbUrl);
        console.log(`✅ URL parsing successful`);
        console.log(`   Host: ${url.hostname}`);
        console.log(`   Port: ${url.port || 'default (5432)'}`);
        console.log(`   Database: ${url.pathname.replace('/', '')}`);
        console.log('\n✅ Format looks correct!');
      } catch (e) {
        console.error('❌ URL parsing failed:', e.message);
        console.error('   This usually means special characters in password need encoding');
      }
    }
  } else {
    console.log('📝 Your DATABASE_URL format:');
    console.log('   ', dbUrlLine.substring(0, 80) + '...');
  }
  
} catch (error) {
  console.error('❌ Error reading .env file:', error.message);
  console.error('   Make sure .env file exists in the asana-backend directory');
}


