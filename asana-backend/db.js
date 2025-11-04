import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

// Configure postgres connection with SSL for Supabase
const sql = postgres(connectionString, {
//   ssl: 'require',
  max: 10, // Maximum number of connections in the pool
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