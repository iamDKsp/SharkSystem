import { Client } from 'pg';

const supabaseUrl = "postgresql://postgres:evvFG9KI2aNFSc5x@db.baotwyiqijzkhkwinitj.supabase.co:5432/postgres";
const localUrl = "postgresql://postgres:postgres@localhost:5433/sharksystem";

async function copyTable(remoteClient: Client, localClient: Client, tableName: string) {
  const res = await remoteClient.query(`SELECT * FROM "${tableName}"`);
  const rows = res.rows;
  console.log(` 📦 Copiando tabela "${tableName}" (${rows.length} registros)...`);

  for (const row of rows) {
    const keys = Object.keys(row);
    const columns = keys.map(k => `"${k}"`).join(', ');
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
    const values = Object.values(row);

    const query = `
      INSERT INTO "${tableName}" (${columns})
      VALUES (${placeholders})
      ON CONFLICT (id) DO NOTHING;
    `;
    await localClient.query(query, values);
  }
}

async function cloneData() {
  console.log("🔌 Conectando ao Supabase e ao Banco Local...");

  const remoteClient = new Client({ connectionString: supabaseUrl });
  const localClient = new Client({ connectionString: localUrl });

  await remoteClient.connect();
  await localClient.connect();

  console.log("✅ Conexões estabelecidas! Iniciando cópia segura (somente leitura do Supabase)...\n");

  const tables = ['perfis', 'clientes', 'parceiros', 'emprestimos', 'parcelas', 'cheques'];

  for (const table of tables) {
    await copyTable(remoteClient, localClient, table);
  }

  await remoteClient.end();
  await localClient.end();

  console.log("\n🎉 DADOS COPIADOS COM SUCESSO PARA O SEU BANCO LOCAL!");
}

cloneData().catch(err => {
  console.error("❌ Erro ao clonar dados:", err);
});
