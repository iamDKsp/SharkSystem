import bcrypt from 'bcryptjs';
import { Client } from 'pg';

async function main() {
  const client = new Client('postgresql://postgres:postgres@localhost:5433/sharksystem');
  await client.connect();
  const hash = await bcrypt.hash('123456', 10);
  await client.query('UPDATE perfis SET senha = $1 WHERE email = $2', [hash, 'ronigabrieloscar@hotmail.com']);
  console.log('✅ Senha do usuário ronigabrieloscar@hotmail.com alterada para: 123456');
  await client.end();
}

main().catch(console.error);
