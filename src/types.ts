export type ViewMode = 
  | 'dashboard'
  | 'clientes'
  | 'emprestimos'
  | 'cobrancas'
  | 'recebimentos'
  | 'parcelas'
  | 'historico'
  | 'relatorios'
  | 'configuracoes'
  | 'parceiros'
  | 'cheques';

export type LoanStatus = 'em_dia' | 'atrasado' | 'quitado' | 'em_analise';

export interface Client {
  id: string;
  name: string;
  document: string; // CPF or CNPJ
  phone: string;
  email: string;
  city: string;
  creditLimit: number;
  activeLoansCount: number;
  totalBorrowed: number;
  status: 'ativo' | 'inadimplente' | 'bloqueado';
  avatarUrl?: string;
  notes?: string;
}

export interface Loan {
  id: string;
  code: string; // e.g. EMP-2026-089
  clientId: string;
  clientName: string;
  clientPhone: string;
  clientAvatarUrl?: string;
  amount: number; // Valor Principal
  interestRate: number; // e.g., 20%
  totalToReceive: number; // Principal + Juros
  totalPaid: number;
  remainingAmount: number;
  installmentsCount: number;
  paidInstallmentsCount: number;
  installmentAmount: number;
  periodicity: 'diario' | 'semanal' | 'quinzena' | 'mensal';
  startDate: string;
  nextDueDate: string;
  status: LoanStatus;
  partnerName?: string;
}

export interface Installment {
  id: string;
  loanId: string;
  loanCode: string;
  clientName: string;
  clientAvatarUrl?: string;
  number: number;
  totalNumber: number;
  amount: number;
  dueDate: string;
  paidDate?: string;
  paymentDate?: string;
  status: 'paga' | 'pendente' | 'atrasada' | 'vencendo_hoje';
  paymentMethod?: 'PIX' | 'Dinheiro' | 'Transferência';
}

export interface CollectionItem {
  id: string;
  loanId?: string;
  clientName: string;
  clientPhone: string;
  overdueInstallmentsCount?: number;
  amountOverdue: number;
  interestAndFines: number;
  daysOverdue: number;
  lastContactDate?: string;
  status?: 'urgente' | 'em_atraso' | 'notificado';
  loanCode?: string;
}

export interface PaymentReceipt {
  id: string;
  code: string;
  clientName: string;
  loanCode: string;
  amount: number;
  principalPortion: number;
  interestPortion: number;
  date: string;
  time: string;
  method: 'PIX' | 'Dinheiro' | 'Transferência';
  operatorName: string;
}

export interface Partner {
  id: string;
  name: string;
  phone: string;
  commissionRate: number; // e.g., 3.5%
  activeLoansCount?: number;
  totalCapitalReferred?: number;
  commissionsEarned?: number;
  commissionsPaid?: number;
  totalIndicatedLoans?: number;
  totalCommissionEarned?: number;
  status: 'ativo' | 'inativo';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
  category: 'emprestimo' | 'recebimento' | 'cliente' | 'cobranca' | 'sistema' | string;
}

export interface SystemSettings {
  companyName: string;
  companySubtext: string;
  defaultInterestRate: number;
  defaultLateFeeRate: number;
  pixKey: string;
  pixKeyType?: string;
  whatsappGreetingTemplate: string;
  whatsappOverdueTemplate: string;
  enableAutoWhatsAppReminders?: boolean;
  enableSoundEffects?: boolean;
}

export interface ChequeItem {
  id: string;
  numero: string;
  banco: string;
  emitente: string;
  valor: number;
  dataDeposito: string;
  status: 'EM_CUSTODIA' | 'DEPOSITADO' | 'DEVOLVIDO' | 'COMPENSADO' | 'em_maos' | 'repassado';
  observacao?: string;
  observacoes?: string;
  clienteId?: string;
  clienteNome?: string;
  parceiroId?: string;
  parceiroNome?: string;
  taxaDesconto?: number;
  valorLiquido?: number;
  fotoUrl?: string;
}
