import postgres from 'postgres';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env relative to this file so it works no matter where the process starts
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL not set. Please define it in asana-backend/.env');
}

// Configure postgres connection with SSL for Supabase (allow self-signed/managed certs)
const sql = postgres(connectionString, {
  ssl: { rejectUnauthorized: false },
  max: 10,
});

// Test connection on import
sql`SELECT 1`
  .then(() => {
    console.log('✅ Database connection established via db.js');
  })
  .catch((error) => {
    console.error('❌ Database connection error in db.js:', error.message);
  });

export default sql;