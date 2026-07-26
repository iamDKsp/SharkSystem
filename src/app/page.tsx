import { prisma } from "@/lib/db";
import { SharkAppShell } from "@/components/SharkAppShell";
import { Client, Loan, Installment, PaymentReceipt, Partner, AuditLog, ChequeItem } from "@/types";

export const revalidate = 0;

export default async function DashboardPage() {
  const [
    clientesDb,
    emprestimosDb,
    parceirosDb,
    chequesDb,
  ] = await Promise.all([
    prisma.cliente.findMany({
      orderBy: { criado_em: "desc" },
    }),
    prisma.emprestimo.findMany({
      include: { cliente: true, parcelas: true, parceiro: true },
      orderBy: { data_vencimento: "asc" },
    }),
    prisma.parceiro.findMany({
      orderBy: { criado_em: "desc" },
    }),
    prisma.cheque.findMany({
      orderBy: { criado_em: "desc" },
    }),
  ]);

  const initialClients: Client[] = clientesDb.map(c => ({
    id: c.id,
    name: c.nome,
    document: c.documento || "000.000.000-00",
    phone: c.telefone || "(11) 99999-9999",
    email: c.email || `${c.nome.toLowerCase().replace(/\s+/g, '')}@email.com`,
    city: c.cidade || "Bauru - SP",
    creditLimit: 10000,
    status: c.blacklist ? "inadimplente" : "ativo",
    notes: c.observacoes || undefined,
    activeLoansCount: emprestimosDb.filter(e => e.cliente_id === c.id && e.status === "ativo").length,
    totalBorrowed: emprestimosDb.filter(e => e.cliente_id === c.id).reduce((acc, e) => acc + Number(e.valor_emprestado), 0),
  }));

  const initialLoans: Loan[] = emprestimosDb.map((e, idx) => {
    const principal = Number(e.valor_emprestado);
    const juros = Number(e.taxa_juros);
    const instCount = e.parcelas.length || 1;
    const totalToRec = principal * (1 + juros / 100);
    const instAmount = totalToRec / instCount;

    const paidParcelas = e.parcelas.filter(p => p.status.startsWith("pago"));
    const totalPaid = paidParcelas.reduce((acc, p) => acc + (Number(p.valor_pago) || Number(p.valor)), 0);
    const remainingAmount = Math.max(0, totalToRec - totalPaid);

    let status: 'em_dia' | 'atrasado' | 'quitado' = 'em_dia';
    if (e.status === 'quitado' || remainingAmount <= 0) {
      status = 'quitado';
    } else if (new Date(e.data_vencimento) < new Date()) {
      status = 'atrasado';
    }

    return {
      id: e.id,
      code: `EMP-2026-${String(idx + 1).padStart(3, '0')}`,
      clientId: e.cliente_id,
      clientName: e.cliente?.nome || "Cliente",
      clientPhone: e.cliente?.telefone || "(11) 99999-9999",
      amount: principal,
      interestRate: juros,
      totalToReceive: totalToRec,
      installmentsCount: instCount,
      installmentAmount: instAmount,
      periodicity: e.frequencia === 'diario' ? 'diario' : e.frequencia === 'semanal' ? 'semanal' : e.frequencia === 'quinzenal' ? 'quinzena' : 'mensal',
      startDate: new Date(e.data_vencimento).toISOString().split('T')[0],
      nextDueDate: new Date(e.data_vencimento).toISOString().split('T')[0],
      status,
      totalPaid,
      remainingAmount,
      paidInstallmentsCount: paidParcelas.length,
      partnerName: e.parceiro?.nome,
    };
  });

  const initialInstallments: Installment[] = [];
  emprestimosDb.forEach((e, idx) => {
    const loanCode = `EMP-2026-${String(idx + 1).padStart(3, '0')}`;
    e.parcelas.forEach(p => {
      let status: 'pendente' | 'vencendo_hoje' | 'atrasada' | 'paga' = 'pendente';
      if (p.status.startsWith('pago')) {
        status = 'paga';
      } else {
        const pv = new Date(p.data_vencimento);
        const hoje = new Date();
        if (pv.toDateString() === hoje.toDateString()) {
          status = 'vencendo_hoje';
        } else if (pv < hoje) {
          status = 'atrasada';
        }
      }

      initialInstallments.push({
        id: p.id,
        loanId: e.id,
        loanCode,
        clientName: e.cliente?.nome || "Cliente",
        number: p.numero,
        totalNumber: e.parcelas.length || 1,
        amount: Number(p.valor),
        dueDate: new Date(p.data_vencimento).toISOString().split('T')[0],
        status,
        paymentDate: p.data_pagamento ? new Date(p.data_pagamento).toISOString().split('T')[0] : undefined,
        paymentMethod: 'PIX',
      });
    });
  });

  const initialReceipts: PaymentReceipt[] = initialInstallments
    .filter(i => i.status === 'paga')
    .map((i, idx) => ({
      id: `rec_${i.id}`,
      code: `REC-${String(idx + 1).padStart(4, '0')}`,
      clientName: i.clientName,
      loanCode: i.loanCode,
      amount: i.amount,
      principalPortion: Math.round(i.amount * 0.85),
      interestPortion: Math.round(i.amount * 0.15),
      date: i.paymentDate || new Date().toISOString().split('T')[0],
      time: '14:30',
      method: i.paymentMethod || 'PIX',
      operatorName: 'Operador Principal',
    }));

  const initialPartners: Partner[] = parceirosDb.map(p => ({
    id: p.id,
    name: p.nome,
    phone: p.telefone || "(11) 98888-7777",
    commissionRate: 2.5,
    status: 'ativo',
    totalIndicatedLoans: emprestimosDb.filter(e => e.parceiro_id === p.id).length,
    totalCommissionEarned: emprestimosDb
      .filter(e => e.parceiro_id === p.id)
      .reduce((acc, e) => acc + (Number(e.valor_emprestado) * 0.025), 0),
  }));

  const initialCheques: ChequeItem[] = chequesDb.map(c => ({
    id: c.id,
    numero: c.id.slice(-6),
    banco: c.banco || "Banco do Brasil",
    emitente: c.titular || "Emitente",
    valor: Number(c.valor),
    dataDeposito: new Date(c.data_compensacao).toISOString().split('T')[0],
    status: c.status === 'compensado' ? 'COMPENSADO' : c.status === 'devolvido' ? 'DEVOLVIDO' : 'EM_CUSTODIA',
    observacao: c.observacoes || undefined,
  }));

  const initialLogs: AuditLog[] = [
    {
      id: 'log_1',
      action: 'Sistema Inicializado',
      details: 'Sessão master iniciada no Shark System.',
      user: 'Eduardo Finanças',
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      category: 'sistema',
    },
  ];

  return (
    <SharkAppShell
      initialClients={initialClients}
      initialLoans={initialLoans}
      initialInstallments={initialInstallments}
      initialReceipts={initialReceipts}
      initialPartners={initialPartners}
      initialLogs={initialLogs}
      initialCheques={initialCheques}
    />
  );
}
