// Shark System - Deployment v2.0 - Redeploy Railway
import { prisma } from "@/lib/db";
import { SharkAppShell } from "@/components/SharkAppShell";
import { Client, Loan, Installment, PaymentReceipt, Partner, AuditLog, ChequeItem } from "@/types";

export const revalidate = 0;

function safeDateStr(dateInput: any): string {
  if (!dateInput) return new Date().toISOString().split('T')[0];
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) {
      return new Date().toISOString().split('T')[0];
    }
    return d.toISOString().split('T')[0];
  } catch {
    return new Date().toISOString().split('T')[0];
  }
}

function safeString(strInput: any, fallback: string = ""): string {
  if (strInput === null || strInput === undefined) return fallback;
  return String(strInput);
}

export default async function DashboardPage() {
  try {
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

    const safeClientes = clientesDb || [];
    const safeEmprestimos = emprestimosDb || [];
    const safeParceiros = parceirosDb || [];
    const safeCheques = chequesDb || [];

    const initialClients: Client[] = safeClientes.map(c => {
      const safeName = safeString(c.nome, "Cliente Sem Nome");
      const safeEmail = c.email || `${safeName.toLowerCase().replace(/[^a-z0-9]/g, '')}@email.com`;
      return {
        id: c.id,
        name: safeName,
        document: c.documento || "000.000.000-00",
        phone: c.telefone || "(11) 99999-9999",
        email: safeEmail,
        city: c.cidade || "Bauru - SP",
        creditLimit: 10000,
        status: c.blacklist ? "inadimplente" : "ativo",
        notes: c.observacoes || undefined,
        activeLoansCount: safeEmprestimos.filter(e => e.cliente_id === c.id && e.status === "ativo").length,
        totalBorrowed: safeEmprestimos.filter(e => e.cliente_id === c.id).reduce((acc, e) => acc + Number(e.valor_emprestado || 0), 0),
      };
    });

    const initialLoans: Loan[] = safeEmprestimos.map((e, idx) => {
      const principal = Number(e.valor_emprestado || 0);
      const juros = Number(e.taxa_juros || 0);
      const parcelasArr = e.parcelas || [];
      const instCount = parcelasArr.length || 1;
      const totalToRec = principal * (1 + juros / 100);
      const instAmount = instCount > 0 ? totalToRec / instCount : totalToRec;

      const paidParcelas = parcelasArr.filter(p => p.status && String(p.status).startsWith("pago"));
      const totalPaid = paidParcelas.reduce((acc, p) => acc + (Number(p.valor_pago) || Number(p.valor) || 0), 0);
      const remainingAmount = Math.max(0, totalToRec - totalPaid);

      const dueDate = safeDateStr(e.data_vencimento);

      let status: 'em_dia' | 'atrasado' | 'quitado' = 'em_dia';
      if (e.status === 'quitado' || remainingAmount <= 0) {
        status = 'quitado';
      } else if (e.data_vencimento && new Date(e.data_vencimento) < new Date()) {
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
        startDate: dueDate,
        nextDueDate: dueDate,
        status,
        totalPaid,
        remainingAmount,
        paidInstallmentsCount: paidParcelas.length,
        partnerName: e.parceiro?.nome || undefined,
      };
    });

    const initialInstallments: Installment[] = [];
    safeEmprestimos.forEach((e, idx) => {
      const loanCode = `EMP-2026-${String(idx + 1).padStart(3, '0')}`;
      const parcelasArr = e.parcelas || [];
      parcelasArr.forEach(p => {
        let status: 'pendente' | 'vencendo_hoje' | 'atrasada' | 'paga' = 'pendente';
        const pStatus = String(p.status || '');
        if (pStatus.startsWith('pago')) {
          status = 'paga';
        } else if (p.data_vencimento) {
          const pv = new Date(p.data_vencimento);
          const hoje = new Date();
          if (!isNaN(pv.getTime())) {
            if (pv.toDateString() === hoje.toDateString()) {
              status = 'vencendo_hoje';
            } else if (pv < hoje) {
              status = 'atrasada';
            }
          }
        }

        initialInstallments.push({
          id: p.id,
          loanId: e.id,
          loanCode,
          clientName: e.cliente?.nome || "Cliente",
          number: p.numero || 1,
          totalNumber: parcelasArr.length || 1,
          amount: Number(p.valor || 0),
          dueDate: safeDateStr(p.data_vencimento),
          status,
          paymentDate: p.data_pagamento ? safeDateStr(p.data_pagamento) : undefined,
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

    const initialPartners: Partner[] = safeParceiros.map(p => ({
      id: p.id,
      name: safeString(p.nome, "Parceiro"),
      phone: p.telefone || "(11) 98888-7777",
      commissionRate: 2.5,
      status: 'ativo',
      totalIndicatedLoans: safeEmprestimos.filter(e => e.parceiro_id === p.id).length,
      totalCommissionEarned: safeEmprestimos
        .filter(e => e.parceiro_id === p.id)
        .reduce((acc, e) => acc + (Number(e.valor_emprestado || 0) * 0.025), 0),
    }));

    const initialCheques: ChequeItem[] = safeCheques.map(c => ({
      id: c.id,
      numero: safeString(c.id).slice(-6),
      banco: c.banco || "Banco do Brasil",
      emitente: c.titular || "Emitente",
      valor: Number(c.valor || 0),
      dataDeposito: safeDateStr(c.data_compensacao || c.criado_em),
      status: c.status === 'compensado' ? 'COMPENSADO' : c.status === 'devolvido' ? 'DEVOLVIDO' : 'EM_CUSTODIA',
      observacao: c.observacoes || undefined,
    }));

    const initialLogs: AuditLog[] = [
      {
        id: 'log_1',
        action: 'Sistema Inicializado',
        details: 'Sessão master iniciada no Shark System com banco de dados real.',
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
  } catch (error) {
    console.error("Erro ao carregar dados do banco:", error);
    return (
      <SharkAppShell
        initialClients={[]}
        initialLoans={[]}
        initialInstallments={[]}
        initialReceipts={[]}
        initialPartners={[]}
        initialLogs={[]}
        initialCheques={[]}
      />
    );
  }
}
