import { prisma } from "../src/lib/db";
import fs from "fs";
import path from "path";
import https from "https";

function downloadFile(url: string, destPath: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (!url || !url.startsWith("http")) {
      resolve(false);
      return;
    }

    const fileStream = fs.createWriteStream(destPath);
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(fileStream);
        fileStream.on("finish", () => {
          fileStream.close();
          resolve(true);
        });
      } else {
        fileStream.close();
        fs.unlink(destPath, () => {});
        resolve(false);
      }
    }).on("error", (err) => {
      console.error(`Erro ao baixar ${url}:`, err.message);
      fileStream.close();
      fs.unlink(destPath, () => {});
      resolve(false);
    });
  });
}

async function main() {
  console.log("🚀 Iniciando migração de mídia do Supabase para public/uploads...");

  const baseDir = path.join(process.cwd(), "public", "uploads");
  const fotosDir = path.join(baseDir, "clientes");
  const docsDir = path.join(baseDir, "documentos");
  const chequesDir = path.join(baseDir, "cheques");

  fs.mkdirSync(fotosDir, { recursive: true });
  fs.mkdirSync(docsDir, { recursive: true });
  fs.mkdirSync(chequesDir, { recursive: true });

  // 1. Migrar Fotos de Clientes
  const clientesComFoto = await prisma.cliente.findMany({
    where: { foto_url: { not: null } }
  });

  console.log(`📸 Encontrados ${clientesComFoto.length} clientes com foto.`);
  let fotosBaixadas = 0;

  for (const c of clientesComFoto) {
    if (!c.foto_url || !c.foto_url.startsWith("http")) continue;

    try {
      const urlObj = new URL(c.foto_url);
      const pathname = urlObj.pathname;
      const ext = path.extname(pathname) || ".jpg";
      const filename = `client_${c.id}${ext}`;
      const destPath = path.join(fotosDir, filename);

      const success = await downloadFile(c.foto_url, destPath);
      if (success) {
        const localUrl = `/uploads/clientes/${filename}`;
        await prisma.cliente.update({
          where: { id: c.id },
          data: { foto_url: localUrl }
        });
        fotosBaixadas++;
      }
    } catch (e) {
      console.error(`Falha ao processar foto do cliente ${c.id}:`, e);
    }
  }
  console.log(`✅ ${fotosBaixadas} fotos de clientes migradas com sucesso!`);

  // 2. Migrar Documentos de Clientes
  const clientesComDocs = await prisma.cliente.findMany({
    where: { documentos_urls: { not: null } }
  });

  console.log(`📄 Encontrados ${clientesComDocs.length} clientes com documentos.`);
  let docsBaixados = 0;

  for (const c of clientesComDocs) {
    if (!c.documentos_urls || !c.documentos_urls.startsWith("http")) continue;

    try {
      const rawUrls = c.documentos_urls.split(",").map(s => s.trim()).filter(Boolean);
      const newLocalUrls: string[] = [];

      for (let i = 0; i < rawUrls.length; i++) {
        const singleUrl = rawUrls[i];
        if (!singleUrl.startsWith("http")) continue;

        const urlObj = new URL(singleUrl);
        const ext = path.extname(urlObj.pathname) || ".jpg";
        const filename = `doc_${c.id}_${i + 1}${ext}`;
        const destPath = path.join(docsDir, filename);

        const success = await downloadFile(singleUrl, destPath);
        if (success) {
          newLocalUrls.push(`/uploads/documentos/${filename}`);
          docsBaixados++;
        }
      }

      if (newLocalUrls.length > 0) {
        await prisma.cliente.update({
          where: { id: c.id },
          data: { documentos_urls: newLocalUrls.join(",") }
        });
      }
    } catch (e) {
      console.error(`Falha ao processar documentos do cliente ${c.id}:`, e);
    }
  }
  console.log(`✅ ${docsBaixados} arquivos de documentos migrados com sucesso!`);

  // 3. Migrar Cheques
  const chequesComFoto = await prisma.cheque.findMany({
    where: { foto_url: { not: null } }
  });

  console.log(`🧾 Encontrados ${chequesComFoto.length} cheques com foto.`);
  let chequesBaixados = 0;

  for (const ch of chequesComFoto) {
    if (!ch.foto_url || !ch.foto_url.startsWith("http")) continue;

    try {
      const urlObj = new URL(ch.foto_url);
      const ext = path.extname(urlObj.pathname) || ".jpg";
      const filename = `cheque_${ch.id}${ext}`;
      const destPath = path.join(chequesDir, filename);

      const success = await downloadFile(ch.foto_url, destPath);
      if (success) {
        const localUrl = `/uploads/cheques/${filename}`;
        await prisma.cheque.update({
          where: { id: ch.id },
          data: { foto_url: localUrl }
        });
        chequesBaixados++;
      }
    } catch (e) {
      console.error(`Falha ao processar foto do cheque ${ch.id}:`, e);
    }
  }
  console.log(`✅ ${chequesBaixados} fotos de cheques migradas com sucesso!`);

  console.log("\n🎉 MIGRAÇÃO DE MÍDIA CONCLUÍDA COM SUCESSO!");
}

main()
  .catch((e) => {
    console.error("Erro fatal na migração de mídia:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
