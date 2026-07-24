require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('sslmode=require')
    ? { rejectUnauthorized: false }
    : false,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const senha = await bcrypt.hash('123', 10);

  const user = await prisma.perfil.upsert({
    where: { email: 'lucas@teltech.com.br' },
    update: { senha, nome: 'Lucas' },
    create: {
      email: 'lucas@teltech.com.br',
      nome: 'Lucas',
      senha,
    },
  });

  console.log('✅ Usuário criado/atualizado com sucesso!');
  console.log('📧 Email:', user.email);
  console.log('👤 Nome:', user.nome);
  console.log('🔑 Senha: 123');
}

main()
  .then(() => process.exit(0))
  .catch((e) => { console.error('❌ Erro:', e.message); process.exit(1); });
