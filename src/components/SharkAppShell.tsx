'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { QuickActionModal } from './QuickActionModal';
import { WhatsAppModal } from './WhatsAppModal';
import { NotificationDrawer } from './NotificationDrawer';
import { ProfileModal } from './ProfileModal';
import { ProfileAvatarPopup } from './ProfileAvatarPopup';

import { DashboardView } from '../views/DashboardView';
import { ClientesView } from '../views/ClientesView';
import { EmprestimosView } from '../views/EmprestimosView';
import { CobrancasView } from '../views/CobrancasView';
import { RecebimentosView } from '../views/RecebimentosView';
import { ParcelasView } from '../views/ParcelasView';
import { HistoricoView } from '../views/HistoricoView';
import { RelatoriosView } from '../views/RelatoriosView';
import { ConfiguracoesView } from '../views/ConfiguracoesView';
import { ParceirosView } from '../views/ParceirosView';
import { ChequesView } from '../views/ChequesView';

import { 
  ViewMode, 
  Client, 
  Loan, 
  Installment, 
  CollectionItem, 
  PaymentReceipt, 
  Partner, 
  AuditLog, 
  SystemSettings, 
  ChequeItem 
} from '../types';

import { RenegociacaoModal } from './RenegociacaoModal';
import { ReprogramacaoModal } from './ReprogramacaoModal';
import { RenovacaoJurosModal } from './RenovacaoJurosModal';

import { createCliente } from '@/app/clientes/novo/actions';
import { createEmprestimo } from '@/app/emprestimos/novo/actions';
import { 
  payNextInstallment, 
  deleteLoan, 
  renegociarEmprestimo, 
  reprogramarEmprestimo, 
  receberSoJurosEmprestimo, 
  marcarEmprestimoComoCobrado 
} from '@/app/emprestimos/[id]/actions';
import { createParceiro, deleteParceiro } from '@/app/parceiros/actions';
import { createCheque, updateChequeStatus, deleteCheque } from '@/app/cheques/actions';

interface SharkAppShellProps {
  initialClients: Client[];
  initialLoans: Loan[];
  initialInstallments: Installment[];
  initialReceipts: PaymentReceipt[];
  initialPartners: Partner[];
  initialLogs: AuditLog[];
  initialCheques: ChequeItem[];
}

export const SharkAppShell: React.FC<SharkAppShellProps> = ({
  initialClients,
  initialLoans,
  initialInstallments,
  initialReceipts,
  initialPartners,
  initialLogs,
  initialCheques,
}) => {
  const [isPending, startTransition] = useTransition();
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');

  const [clients, setClients] = useState<Client[]>(initialClients);
  const [loans, setLoans] = useState<Loan[]>(initialLoans);
  const [installments, setInstallments] = useState<Installment[]>(initialInstallments);
  const [receipts, setReceipts] = useState<PaymentReceipt[]>(initialReceipts);
  const [partners, setPartners] = useState<Partner[]>(initialPartners);
  const [logs, setLogs] = useState<AuditLog[]>(initialLogs);
  const [cheques, setCheques] = useState<ChequeItem[]>(initialCheques);

  // User & Settings state
  const [userName, setUserName] = useState('Roni Gabriel');
  const [userEmail, setUserEmail] = useState('ronigabrieloscar@hotmail.com');
  const [userPassword, setUserPassword] = useState('123456');
  const [avatarUrl, setAvatarUrl] = useState<string | null>('/shark-avatar.png');

  React.useEffect(() => {
    fetch('/api/perfil')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.perfil) {
          if (data.perfil.nome) setUserName(data.perfil.nome);
          if (data.perfil.email) setUserEmail(data.perfil.email);
        }
      })
      .catch(err => console.error("Erro ao carregar perfil do operador:", err));
  }, []);

  // Phone connection
  const [qrConnected, setQrConnected] = useState(true);
  const [qrPhoneDevice, setQrPhoneDevice] = useState('(11) 98877-6655 • iPhone 15 Pro');

  // Modals state
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);

  // Advanced Loan Modals state
  const [selectedLoanForAction, setSelectedLoanForAction] = useState<Loan | null>(null);
  const [isRenegociacaoOpen, setIsRenegociacaoOpen] = useState(false);
  const [isReprogramacaoOpen, setIsReprogramacaoOpen] = useState(false);
  const [isRenovacaoJurosOpen, setIsRenovacaoJurosOpen] = useState(false);

  // WhatsApp Modal state
  const [whatsAppModalData, setWhatsAppModalData] = useState<{
    isOpen: boolean;
    clientName: string;
    phone: string;
    loanCode: string;
    amount: number;
    dueDate: string;
    daysOverdue?: number;
    loanId?: string;
  }>({
    isOpen: false,
    clientName: '',
    phone: '',
    loanCode: '',
    amount: 0,
    dueDate: '',
  });

  const [settings, setSettings] = useState<SystemSettings>({
    companyName: 'Shark System',
    companySubtext: 'Gestão de Empréstimos',
    defaultInterestRate: 10,
    defaultLateFeeRate: 2,
    pixKey: '14991185521 (RONIVALDO GABRIEL OSCAR - ITAÚ)',
    whatsappGreetingTemplate: 'Olá {cliente}, lembramos que a parcela {codigo} de R$ {valor} vence em {vencimento}. Chave PIX: 14991185521',
    whatsappOverdueTemplate: 'Atenção {cliente}, a parcela {codigo} de R$ {valor} está vencida há {dias} dias. Chave PIX: 14991185521',
  });

  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('shark_theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === 'light') {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      } else {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
      }
    }

    const savedSettings = localStorage.getItem('shark_system_settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error("Erro ao carregar settings:", e);
      }
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('shark_theme', nextTheme);
    if (nextTheme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
  };

  const handleUpdateSettings = (newSettings: SystemSettings) => {
    setSettings(newSettings);
    localStorage.setItem('shark_system_settings', JSON.stringify(newSettings));
  };

  // Handlers for data mutations (Optimistic UI + Server Actions)
  const handleAddClient = (newClientData: Omit<Client, 'id' | 'activeLoansCount' | 'totalBorrowed'>) => {
    const tempId = `c_${Date.now()}`;
    const newClient: Client = {
      id: tempId,
      ...newClientData,
      activeLoansCount: 0,
      totalBorrowed: 0,
    };
    setClients(prev => [newClient, ...prev]);

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append('nome', newClientData.name);
        formData.append('documento', newClientData.document || '');
        formData.append('telefone', newClientData.phone || '');
        formData.append('cidade', newClientData.city || '');
        formData.append('limiteCredito', String(newClientData.creditLimit || 5000));
        await createCliente(formData);
      } catch (err) {
        console.error('Erro ao salvar cliente no backend:', err);
      }
    });

    setLogs(prev => [{
      id: `log_${Date.now()}`,
      action: 'Novo Cliente Cadastrado',
      details: `Cliente ${newClientData.name} cadastrado com sucesso.`,
      user: userName,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      category: 'cliente',
    }, ...prev]);
  };

  const handleAddLoan = (newLoanData: Omit<Loan, 'id' | 'code' | 'totalPaid' | 'remainingAmount' | 'paidInstallmentsCount'>) => {
    const tempId = `l_${Date.now()}`;
    const code = `EMP-2026-${String(loans.length + 1).padStart(3, '0')}`;
    
    const newLoan: Loan = {
      id: tempId,
      code,
      ...newLoanData,
      totalPaid: 0,
      remainingAmount: newLoanData.totalToReceive,
      paidInstallmentsCount: 0,
    };

    setLoans(prev => [newLoan, ...prev]);

    const newInsts: Installment[] = Array.from({ length: newLoanData.installmentsCount }).map((_, idx) => ({
      id: `inst_${tempId}_${idx + 1}`,
      loanId: tempId,
      loanCode: code,
      clientName: newLoanData.clientName,
      number: idx + 1,
      totalNumber: newLoanData.installmentsCount,
      amount: newLoanData.installmentAmount,
      dueDate: newLoanData.startDate,
      status: idx === 0 ? 'vencendo_hoje' : 'pendente',
    }));
    setInstallments(prev => [...newInsts, ...prev]);

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append('clienteId', newLoanData.clientId);
        formData.append('valorEmprestado', String(newLoanData.amount));
        formData.append('taxaJuros', String(newLoanData.interestRate));
        formData.append('tipoPagamento', 'a_vista_juros');
        formData.append('frequencia', newLoanData.periodicity);
        formData.append('dataInicio', newLoanData.startDate);
        formData.append('dataVencimento', newLoanData.nextDueDate);
        formData.append('categoria', 'Sem categoria');
        formData.append('observacoes', '');

        const parcelasArr = newInsts.map(i => ({
          numero: i.number,
          valor: i.amount,
          data_vencimento: i.dueDate,
        }));
        formData.append('parcelasJson', JSON.stringify(parcelasArr));

        await createEmprestimo(formData);
      } catch (err) {
        console.error('Erro ao salvar empréstimo no backend:', err);
      }
    });

    setLogs(prev => [{
      id: `log_${Date.now()}`,
      action: 'Novo Empréstimo Criado',
      details: `Contrato ${code} de R$ ${newLoanData.amount} criado para ${newLoanData.clientName}.`,
      user: userName,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      category: 'emprestimo',
    }, ...prev]);
  };

  const handleAddReceipt = (newReceiptData: Omit<PaymentReceipt, 'id' | 'code'>) => {
    const code = `REC-${Date.now().toString().slice(-4)}`;
    const newReceipt: PaymentReceipt = {
      id: `rec_${Date.now()}`,
      code,
      ...newReceiptData,
    };
    setReceipts(prev => [newReceipt, ...prev]);

    setLogs(prev => [{
      id: `log_${Date.now()}`,
      action: 'Baixa de Pagamento Registrada',
      details: `Recebimento de R$ ${newReceiptData.amount} registrado via ${newReceiptData.method}.`,
      user: userName,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      category: 'recebimento',
    }, ...prev]);
  };

  const handleMarkInstallmentPaid = (installmentId: string) => {
    setInstallments(prev => prev.map(inst => {
      if (inst.id === installmentId) {
        return { ...inst, status: 'paga', paymentDate: new Date().toISOString().split('T')[0] };
      }
      return inst;
    }));

    const inst = installments.find(i => i.id === installmentId);
    if (inst) {
      handleAddReceipt({
        clientName: inst.clientName,
        loanCode: inst.loanCode,
        amount: inst.amount,
        principalPortion: inst.amount * 0.9,
        interestPortion: inst.amount * 0.1,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        method: 'PIX',
        operatorName: userName,
      });

      startTransition(async () => {
        try {
          await payNextInstallment(inst.loanId, false);
        } catch (err) {
          console.error('Erro ao dar baixa na parcela no backend:', err);
        }
      });
    }
  };

  const handleAddPartner = (newPartnerData: Omit<Partner, 'id' | 'totalIndicatedLoans' | 'totalCommissionEarned'>) => {
    const tempId = `p_${Date.now()}`;
    const newPartner: Partner = {
      id: tempId,
      ...newPartnerData,
      totalIndicatedLoans: 0,
      totalCommissionEarned: 0,
    };
    setPartners(prev => [newPartner, ...prev]);

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append('nome', newPartnerData.name);
        formData.append('telefone', newPartnerData.phone);
        await createParceiro(formData);
      } catch (err) {
        console.error('Erro ao salvar parceiro:', err);
      }
    });
  };

  const handleAddCheque = (chequeData: Omit<ChequeItem, 'id'>) => {
    const tempId = `chq_${Date.now()}`;
    const newCheque: ChequeItem = {
      id: tempId,
      ...chequeData,
    };
    setCheques(prev => [newCheque, ...prev]);

    startTransition(async () => {
      try {
        await createCheque({
          cliente_id: chequeData.clienteId || clients[0]?.id || '',
          parceiro_id: chequeData.parceiroId,
          valor: chequeData.valor,
          taxa_desconto: chequeData.taxaDesconto || 0,
          valor_liquido: chequeData.valorLiquido || chequeData.valor,
          data_compensacao: chequeData.dataDeposito,
          observacoes: chequeData.observacao,
        });
      } catch (err) {
        console.error('Erro ao cadastrar cheque:', err);
      }
    });
  };

  const handleUpdateChequeStatus = (id: string, status: string) => {
    setCheques(prev => prev.map(c => c.id === id ? { ...c, status: status as any } : c));

    startTransition(async () => {
      try {
        await updateChequeStatus(id, status);
      } catch (err) {
        console.error('Erro ao atualizar status do cheque:', err);
      }
    });
  };

  const handleDeleteCheque = (id: string) => {
    setCheques(prev => prev.filter(c => c.id !== id));

    startTransition(async () => {
      try {
        await deleteCheque(id);
      } catch (err) {
        console.error('Erro ao deletar cheque:', err);
      }
    });
  };

  const openWhatsApp = (clientName: string, phone: string, loanCode: string, amount: number, dueDate: string, daysOverdue?: number, loanId?: string) => {
    setWhatsAppModalData({
      isOpen: true,
      clientName,
      phone,
      loanCode,
      amount,
      dueDate,
      daysOverdue,
      loanId,
    });
  };

  const handleOpenRenegociacao = (loan: Loan) => {
    setSelectedLoanForAction(loan);
    setIsRenegociacaoOpen(true);
  };

  const handleOpenReprogramacao = (loan: Loan) => {
    setSelectedLoanForAction(loan);
    setIsReprogramacaoOpen(true);
  };

  const handleOpenRenovacaoJuros = (loan: Loan) => {
    setSelectedLoanForAction(loan);
    setIsRenovacaoJurosOpen(true);
  };

  const handleConfirmRenegociacao = async (loanId: string, valorAbater: number, aplicarNovosJuros: boolean, novaTaxa: number) => {
    startTransition(async () => {
      try {
        await renegociarEmprestimo(loanId, valorAbater, aplicarNovosJuros, novaTaxa);
      } catch (err) {
        console.error('Erro na renegociação:', err);
      }
    });
  };

  const handleConfirmReprogramacao = async (
    loanId: string, 
    novaDataVencimento: string, 
    principalExtra: number, 
    taxaJuros: number, 
    frequencia: string
  ) => {
    startTransition(async () => {
      try {
        await reprogramarEmprestimo(loanId, novaDataVencimento, principalExtra, taxaJuros, frequencia);
      } catch (err) {
        console.error('Erro na reprogramação:', err);
      }
    });
  };

  const handleConfirmRenovacaoJuros = async (loanId: string) => {
    startTransition(async () => {
      try {
        await receberSoJurosEmprestimo(loanId);
      } catch (err) {
        console.error('Erro na renovação de juros:', err);
      }
    });
  };

  const handleMarkCobrado = async (loanId: string) => {
    startTransition(async () => {
      try {
        await marcarEmprestimoComoCobrado(loanId);
      } catch (err) {
        console.error('Erro ao marcar cobrado:', err);
      }
    });
  };

  const collectionItems: CollectionItem[] = loans
    .filter(l => l.status === 'atrasado')
    .map(l => ({
      id: `col_${l.id}`,
      loanId: l.id,
      clientName: l.clientName,
      clientPhone: l.clientPhone,
      overdueInstallmentsCount: 1,
      daysOverdue: 12,
      amountOverdue: l.installmentAmount,
      interestAndFines: Math.round(l.installmentAmount * 0.05),
      loanCode: l.code,
      lastContactDate: '2026-07-24',
      status: 'urgente',
    }));

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Erro ao fazer logout:', err);
    }
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-[#090D16] light:bg-slate-50 text-white light:text-slate-900 flex flex-col font-sans selection:bg-[#00D084] selection:text-slate-950">
      
      <Header
        currentView={currentView}
        setCurrentView={setCurrentView}
        userName={userName}
        avatarUrl={avatarUrl}
        qrConnected={qrConnected}
        unreadNotificationsCount={3}
        onOpenNotifications={() => setIsNotificationOpen(true)}
        onOpenProfilePopup={() => setIsProfilePopupOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main className="flex-1 max-w-5xl w-full mx-auto px-3 sm:px-6 pt-4">
        {currentView === 'dashboard' && (
          <DashboardView
            loans={loans}
            installments={installments}
            clients={clients}
            setCurrentView={setCurrentView}
            onOpenQuickAction={() => setIsQuickActionOpen(true)}
            onOpenWhatsApp={openWhatsApp}
            onMarkInstallmentPaid={handleMarkInstallmentPaid}
          />
        )}

        {currentView === 'clientes' && (
          <ClientesView
            clients={clients}
            loans={loans}
            onOpenQuickAction={() => setIsQuickActionOpen(true)}
            onOpenWhatsApp={openWhatsApp}
          />
        )}

        {currentView === 'emprestimos' && (
          <EmprestimosView
            loans={loans}
            onOpenQuickAction={() => setIsQuickActionOpen(true)}
            onOpenWhatsApp={openWhatsApp}
            onRenegociar={handleOpenRenegociacao}
            onReprogramar={handleOpenReprogramacao}
            onReceberSoJuros={handleOpenRenovacaoJuros}
          />
        )}

        {currentView === 'cobrancas' && (
          <CobrancasView
            collections={collectionItems}
            onOpenWhatsApp={openWhatsApp}
          />
        )}

        {currentView === 'recebimentos' && (
          <RecebimentosView
            receipts={receipts}
            onOpenQuickAction={() => setIsQuickActionOpen(true)}
          />
        )}

        {currentView === 'parcelas' && (
          <ParcelasView
            installments={installments}
            onMarkInstallmentPaid={handleMarkInstallmentPaid}
            onOpenWhatsApp={openWhatsApp}
          />
        )}

        {currentView === 'cheques' && (
          <ChequesView
            cheques={cheques}
            onAddCheque={handleAddCheque}
            onUpdateChequeStatus={handleUpdateChequeStatus}
            onDeleteCheque={handleDeleteCheque}
          />
        )}

        {currentView === 'historico' && (
          <HistoricoView logs={logs} />
        )}

        {currentView === 'relatorios' && (
          <RelatoriosView />
        )}

        {currentView === 'parceiros' && (
          <ParceirosView
            partners={partners}
            onAddPartner={handleAddPartner}
          />
        )}

        {currentView === 'configuracoes' && (
          <ConfiguracoesView
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
          />
        )}
      </main>

      <BottomNav
        currentView={currentView}
        setCurrentView={setCurrentView}
        onOpenQuickAction={() => setIsQuickActionOpen(true)}
      />

      <QuickActionModal
        isOpen={isQuickActionOpen}
        onClose={() => setIsQuickActionOpen(false)}
        clients={clients}
        loans={loans}
        partners={partners}
        onAddClient={handleAddClient}
        onAddLoan={handleAddLoan}
        onAddReceipt={handleAddReceipt}
      />

      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        onOpenWhatsApp={openWhatsApp}
      />

      <ProfileAvatarPopup
        isOpen={isProfilePopupOpen}
        onClose={() => setIsProfilePopupOpen(false)}
        userName={userName}
        userEmail={userEmail}
        avatarUrl={avatarUrl}
        qrConnected={qrConnected}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onLogout={handleLogout}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        userName={userName}
        setUserName={setUserName}
        userEmail={userEmail}
        userPassword={userPassword}
        setUserPassword={setUserPassword}
        avatarUrl={avatarUrl}
        setAvatarUrl={setAvatarUrl}
        qrConnected={qrConnected}
        setQrConnected={setQrConnected}
        qrPhoneDevice={qrPhoneDevice}
        setQrPhoneDevice={setQrPhoneDevice}
      />

      <WhatsAppModal
        isOpen={whatsAppModalData.isOpen}
        onClose={() => setWhatsAppModalData(prev => ({ ...prev, isOpen: false }))}
        clientName={whatsAppModalData.clientName}
        phone={whatsAppModalData.phone}
        loanCode={whatsAppModalData.loanCode}
        amount={whatsAppModalData.amount}
        dueDate={whatsAppModalData.dueDate}
        daysOverdue={whatsAppModalData.daysOverdue}
        loanId={whatsAppModalData.loanId}
        pixKey={settings.pixKey}
        onMarkCobrado={handleMarkCobrado}
      />

      <RenegociacaoModal
        isOpen={isRenegociacaoOpen}
        onClose={() => setIsRenegociacaoOpen(false)}
        loan={selectedLoanForAction}
        onConfirm={handleConfirmRenegociacao}
      />

      <ReprogramacaoModal
        isOpen={isReprogramacaoOpen}
        onClose={() => setIsReprogramacaoOpen(false)}
        loan={selectedLoanForAction}
        onConfirm={handleConfirmReprogramacao}
      />

      <RenovacaoJurosModal
        isOpen={isRenovacaoJurosOpen}
        onClose={() => setIsRenovacaoJurosOpen(false)}
        loan={selectedLoanForAction}
        onConfirm={handleConfirmRenovacaoJuros}
      />

    </div>
  );
};
