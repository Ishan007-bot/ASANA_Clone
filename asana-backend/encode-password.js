// Helper script to URL-encode your password
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔐 Password Encoder for Supabase Connection String\n');
console.log('Enter your database password (it will be hidden):');

rl.question('Password: ', (password) => {
  const encoded = encodeURIComponent(password);
  console.log('\n✅ Your encoded password:', encoded);
  console.log('\n📝 Add this to your .env file:');
  console.log(`DATABASE_URL="postgresql://postgres:${encoded}@db.gfhdgquoonhtgqmyhvwc.supabase.co:5432/postgres"`);
  console.log('\n⚠️  Remember: Only encode the PASSWORD part, not the whole URL!');
  rl.close();
});


