"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function logRemindersSent(parcelasIds: string[]) {
  console.log(`[Disparo de Cobrança] Remetente: Admin. Enviado lembretes para ${parcelasIds.length} parcelas.`);
  return { success: true, count: parcelasIds.length };
}

/**
 * Marca um empréstimo como "cobrado" com timestamp persistido no banco.
 * Isso resolve o problema identificado pelo cliente: impossibilidade de
 * saber quem já foi cobrado ou não na rotina do dia.
 */
export async function marcarEmprestimoComoCobrado(emprestimoId: string) {
  const agora = new Date();
  await prisma.emprestimo.update({
    where: { id: emprestimoId },
    data: {
      cobrado_em: agora,
    },
  });
  revalidatePath("/cobrancas");
  revalidatePath("/emprestimos");
  return { success: true, cobrado_em: agora.toISOString() };
}

/**
 * Limpa o status de cobrado de um empréstimo (para desfazer marcação incorreta).
 */
export async function desmarcarEmprestimoComoCobrado(emprestimoId: string) {
  await prisma.emprestimo.update({
    where: { id: emprestimoId },
    data: {
      cobrado_em: null,
    },
  });
  revalidatePath("/cobrancas");
  return { success: true };
}

