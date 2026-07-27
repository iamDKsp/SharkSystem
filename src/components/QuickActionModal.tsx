import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Banknote, 
  UserPlus, 
  Receipt, 
  Calculator, 
  User, 
  Wallet, 
  Settings, 
  Check, 
  ChevronDown, 
  Search,
  Calendar,
  Clock
} from 'lucide-react';
import { Client, Loan, PaymentReceipt, Partner } from '../types';
import { UploadAnexoDocumentos } from './UploadAnexoDocumentos';

interface QuickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  clients: Client[];
  loans: Loan[];
  partners?: Partner[];
  onAddLoan: (newLoan: Omit<Loan, 'id' | 'code' | 'totalPaid' | 'remainingAmount' | 'paidInstallmentsCount'>) => void;
  onAddClient: (newClient: Omit<Client, 'id' | 'activeLoansCount' | 'totalBorrowed'>) => void;
  onAddReceipt: (newReceipt: Omit<PaymentReceipt, 'id' | 'code'>) => void;
}

interface CustomSelectOption {
  value: string;
  label: string;
  subtitle?: string;
}

const CustomSelect: React.FC<{
  label: string;
  value: string;
  options: CustomSelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}> = ({ label, value, options, onChange, placeholder = 'Selecione...', required }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(
    (o) =>
      o.label.toLowerCase().includes(search.toLowerCase()) ||
      (o.subtitle && o.subtitle.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-[11px] font-black text-[#00D084] uppercase tracking-wider mb-1.5">
        {label} {required && '*'}
      </label>

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full min-h-[48px] bg-[#090D16] border rounded-2xl px-4 py-3 text-left flex items-center justify-between transition-all duration-150 ${
          isOpen
            ? 'border-[#00D084] shadow-[0_0_15px_rgba(0,208,132,0.15)] ring-1 ring-[#00D084]'
            : 'border-[#1E293B] hover:border-[#00D084]/40'
        }`}
      >
        <div className="truncate pr-2">
          {selectedOption ? (
            <div>
              <p className="text-sm font-bold text-white truncate">{selectedOption.label}</p>
              {selectedOption.subtitle && (
                <p className="text-[11px] text-gray-400 truncate">{selectedOption.subtitle}</p>
              )}
            </div>
          ) : (
            <span className="text-sm text-gray-500 font-medium">{placeholder}</span>
          )}
        </div>
        <ChevronDown
          className={`w-5 h-5 text-[#00D084] shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-[#0D1321] border border-[#1E293B] rounded-2xl shadow-2xl p-2 space-y-1 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
          {options.length > 5 && (
            <div className="p-1 mb-1 sticky top-0 bg-[#0D1321] z-10">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-[#090D16] border border-[#1E293B] rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-[#00D084]"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          )}

          {filteredOptions.length === 0 ? (
            <div className="p-3 text-center text-xs text-gray-400">Nenhuma opção encontrada</div>
          ) : (
            filteredOptions.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                    setSearch('');
                  }}
                  className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl text-left flex items-center justify-between transition ${
                    isSelected
                      ? 'bg-[#00D084]/15 text-[#00D084] font-bold border border-[#00D084]/30'
                      : 'text-gray-200 hover:bg-[#1E293B]/70 hover:text-white'
                  }`}
                >
                  <div className="truncate pr-2">
                    <p className="text-xs font-bold truncate">{option.label}</p>
                    {option.subtitle && (
                      <p className="text-[10px] text-gray-400 font-normal truncate">{option.subtitle}</p>
                    )}
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-[#00D084] shrink-0" />}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export const QuickActionModal: React.FC<QuickActionModalProps> = ({
  isOpen,
  onClose,
  clients,
  loans,
  partners = [],
  onAddLoan,
  onAddClient,
  onAddReceipt,
}) => {
  const [activeTab, setActiveTab] = useState<'emprestimo' | 'cliente' | 'recebimento'>('emprestimo');

  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id || '');
  const [lenderPerson, setLenderPerson] = useState('Eu (Administrador)');
  
  const [amount, setAmount] = useState<number>(1000);
  const [paymentType, setPaymentType] = useState<
    'a_vista' | 'a_vista_juros' | 'juros_compostos' | 'parcelado' | 'juros_mensais' | 'parcela_juros_mes'
  >('a_vista_juros');
  
  const [category, setCategory] = useState<string>('Sem categoria');
  
  const [interestRate, setInterestRate] = useState<number>(10);
  const [installmentsCount, setInstallmentsCount] = useState<number>(1);
  const [periodicity, setPeriodicity] = useState<'diario' | 'semanal' | 'quinzena' | 'mensal'>('mensal');
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  
  const [autoLateFee, setAutoLateFee] = useState<boolean>(true);
  const [lateFeeRate, setLateFeeRate] = useState<number>(2);
  const [observations, setObservations] = useState<string>('');

  const [clientName, setClientName] = useState('');
  const [clientDocument, setClientDocument] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientCity, setClientCity] = useState('Bauru - SP');
  const [creditLimit, setCreditLimit] = useState(10000);

  const [clientFotoUrl, setClientFotoUrl] = useState('');
  const [clientDocs, setClientDocs] = useState<string[]>([]);
  const [selectedLoanId, setSelectedLoanId] = useState(loans[0]?.id || '');
  const [receiptAmount, setReceiptAmount] = useState<number>(1000);
  const [paymentMethod, setPaymentMethod] = useState<'PIX' | 'Dinheiro' | 'Transferência'>('PIX');

  useEffect(() => {
    if (clients.length > 0 && !selectedClientId) {
      setSelectedClientId(clients[0].id);
    }
  }, [clients, selectedClientId]);

  useEffect(() => {
    if (loans.length > 0 && !selectedLoanId) {
      setSelectedLoanId(loans[0].id);
    }
  }, [loans, selectedLoanId]);

  const calculateTotal = () => {
    const numAmount = Number(amount) || 0;
    const numRate = Number(interestRate) || 0;
    const numInstallments = Math.max(1, Number(installmentsCount) || 1);

    if (paymentType === 'a_vista') return numAmount;
    if (paymentType === 'a_vista_juros') return numAmount * (1 + numRate / 100);
    if (paymentType === 'juros_compostos') return numAmount * Math.pow(1 + numRate / 100, numInstallments);
    if (paymentType === 'parcelado') return numAmount * (1 + numRate / 100);
    if (paymentType === 'juros_mensais') return numAmount + (numAmount * (numRate / 100) * numInstallments);
    return numAmount * (1 + numRate / 100);
  };

  const totalToReceive = calculateTotal();
  const safeInstallmentsCount = Math.max(1, Number(installmentsCount) || 1);
  const installmentAmount = safeInstallmentsCount > 0 ? totalToReceive / safeInstallmentsCount : totalToReceive;

  if (!isOpen) return null;

  const handleCreateLoan = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const client = clients.find(c => c.id === selectedClientId) || clients[0];
    const safeNumAmount = Math.max(0, Number(amount) || 0);
    const safeRate = Math.max(0, Number(interestRate) || 0);
    const safeInstCount = Math.max(1, Number(installmentsCount) || 1);
    const safeTotal = Number(totalToReceive) || safeNumAmount;
    const safeInstAmount = Number(installmentAmount) || (safeTotal / safeInstCount);
    
    onAddLoan({
      clientId: client?.id || 'c1',
      clientName: client?.name || 'Cliente Selecionado',
      clientPhone: client?.phone || '(11) 99999-8888',
      amount: safeNumAmount,
      interestRate: safeRate,
      totalToReceive: Math.round(safeTotal * 100) / 100,
      installmentsCount: safeInstCount,
      installmentAmount: Math.round(safeInstAmount * 100) / 100,
      periodicity: periodicity || 'mensal',
      startDate: startDate || new Date().toISOString().split('T')[0],
      nextDueDate: startDate || new Date().toISOString().split('T')[0],
      status: 'em_dia',
      partnerName: lenderPerson !== 'Eu (Administrador)' ? lenderPerson : undefined,
    });
    
    onClose();
  };

  const handleCreateClient = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const name = clientName.trim() || 'Novo Cliente';

    onAddClient({
      name,
      document: clientDocument.trim() || '000.000.000-00',
      phone: clientPhone.trim() || '(11) 90000-0000',
      email: `${name.toLowerCase().replace(/\s+/g, '')}@email.com`,
      city: clientCity.trim() || 'Bauru - SP',
      creditLimit: Number(creditLimit) || 5000,
      status: 'ativo',
    });

    setClientName('');
    setClientPhone('');
    setClientDocument('');
    onClose();
  };

  const handleCreateReceipt = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const loan = loans.find(l => l.id === selectedLoanId) || loans[0];
    const safeReceiptAmount = Math.max(0, Number(receiptAmount) || 0);
    const loanRate = Number(loan?.interestRate) || 10;
    
    const principalPortion = safeReceiptAmount * (1 - (loanRate / 100));
    const interestPortion = safeReceiptAmount - principalPortion;

    const now = new Date();
    onAddReceipt({
      clientName: loan?.clientName || 'Cliente',
      loanCode: loan?.code || 'EMP-100',
      amount: safeReceiptAmount,
      principalPortion: Math.round(principalPortion * 100) / 100,
      interestPortion: Math.round(interestPortion * 100) / 100,
      date: now.toISOString().split('T')[0],
      time: `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`,
      method: paymentMethod || 'PIX',
      operatorName: 'Operador Principal',
    });

    onClose();
  };

  const paymentTypeDescriptions: Record<string, string> = {
    a_vista: 'Pagamento único do valor principal sem incidência de juros adicionais.',
    a_vista_juros: 'Pagamento único com juros simples. Ex: R$ 500 a 10% → recebe R$ 550 no vencimento.',
    juros_compostos: 'O valor cresce com juros compostos a cada período acordado.',
    parcelado: 'O montante com juros divididos em parcelas fixas iguais.',
    juros_mensais: 'O cliente paga os juros mensalmente e quita o principal na última parcela.',
    parcela_juros_mes: 'Parcelas fixas calculadas com taxa de juros mensal estipulada.',
  };

  const categories = ['Sem categoria', 'Educação', 'Emergência', 'Família', 'Pessoal', 'Trabalho'];

  const clientOptions: CustomSelectOption[] = clients.map((c) => ({
    value: c?.id || '',
    label: c?.name || 'Cliente Sem Nome',
    subtitle: `${c?.city || ''} • Limite: R$ ${(Number(c?.creditLimit) || 0).toLocaleString('pt-BR')}`,
  }));

  const lenderOptions: CustomSelectOption[] = [
    { value: 'Eu (Administrador)', label: 'Eu (Administrador)', subtitle: 'Capital próprio da plataforma' },
    ...partners.map((p) => ({
      value: p?.name || '',
      label: `Parceiro: ${p?.name || 'Sem nome'}`,
      subtitle: `Promotor parceiro`,
    })),
  ];

  const loanOptions: CustomSelectOption[] = loans.map((l) => ({
    value: l?.id || '',
    label: `${l?.code || ''} - ${l?.clientName || 'Cliente'}`,
    subtitle: `Saldo devedor: R$ ${(Number(l?.remainingAmount) || 0).toLocaleString('pt-BR')}`,
  }));

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="fixed inset-0" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-[#090D16] border border-[#1E293B] rounded-t-3xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl z-10 max-h-[94vh] flex flex-col animate-in fade-in slide-in-from-bottom duration-200">
        
        <div className="w-12 h-1.5 bg-gray-700/60 rounded-full mx-auto mb-3 shrink-0 sm:hidden" />
        
        <div className="flex items-center justify-between pb-3.5 border-b border-[#1E293B] shrink-0">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2 tracking-tight">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00D084]" />
              {activeTab === 'emprestimo' ? 'Novo Empréstimo' : activeTab === 'cliente' ? 'Novo Cliente' : 'Registrar Recebimento'}
            </h3>
            <p className="text-xs text-[#00D084] font-medium mt-0.5">
              {activeTab === 'emprestimo' ? 'Configure os parâmetros do novo empréstimo.' : 'Preencha os dados da operação.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-[#1E293B]/70 text-gray-400 hover:text-white transition active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-1.5 my-3.5 p-1 rounded-2xl bg-[#0F172A] border border-[#1E293B] shrink-0">
          <button
            onClick={() => setActiveTab('emprestimo')}
            className={`flex items-center justify-center gap-1.5 min-h-[44px] py-2 px-2 rounded-xl text-xs font-black transition ${
              activeTab === 'emprestimo'
                ? 'bg-[#00D084] text-slate-950 shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Banknote className="w-4 h-4" />
            <span>Empréstimo</span>
          </button>

          <button
            onClick={() => setActiveTab('cliente')}
            className={`flex items-center justify-center gap-1.5 min-h-[44px] py-2 px-2 rounded-xl text-xs font-black transition ${
              activeTab === 'cliente'
                ? 'bg-[#00D084] text-slate-950 shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Cliente</span>
          </button>

          <button
            onClick={() => setActiveTab('recebimento')}
            className={`flex items-center justify-center gap-1.5 min-h-[44px] py-2 px-2 rounded-xl text-xs font-black transition ${
              activeTab === 'recebimento'
                ? 'bg-[#00D084] text-slate-950 shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Receber</span>
          </button>
        </div>

        <div className="overflow-y-auto flex-1 pr-1 space-y-4 pb-4">

          {activeTab === 'emprestimo' && (
            <form id="loan-form" onSubmit={handleCreateLoan} className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#0F172A] border-l-4 border-l-[#00D084] border border-[#1E293B] space-y-4 shadow-sm">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#00D084]/15 text-[#00D084] flex items-center justify-center shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white">Dados do Cliente</h4>
                    <p className="text-[11px] text-[#00D084] font-medium">Vincule o empréstimo a uma pessoa e parceiro.</p>
                  </div>
                </div>

                <div className="space-y-3.5 pt-1">
                  <CustomSelect
                    label="PESSOA"
                    value={selectedClientId}
                    options={clientOptions}
                    onChange={(val) => setSelectedClientId(val)}
                    placeholder="Selecione uma pessoa..."
                    required
                  />

                  <CustomSelect
                    label="QUEM EMPRESTOU?"
                    value={lenderPerson}
                    options={lenderOptions}
                    onChange={(val) => setLenderPerson(val)}
                    placeholder="Selecione o doador/investidor..."
                    required
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#0F172A] border-l-4 border-l-blue-500 border border-[#1E293B] space-y-4 shadow-sm">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white">Valores e Modalidade</h4>
                    <p className="text-[11px] text-[#00D084] font-medium">Defina o montante e a forma como será pago.</p>
                  </div>
                </div>

                <div className="space-y-4 pt-1">
                  <div>
                    <label className="block text-[11px] font-black text-[#00D084] uppercase tracking-wider mb-1.5">
                      VALOR PRINCIPAL *
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black text-[#00D084] font-mono">
                        R$
                      </span>
                      <input
                        type="number"
                        step="50"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="w-full min-h-[50px] bg-[#090D16] border border-[#1E293B] rounded-2xl pl-12 pr-4 text-base font-black text-[#00D084] font-mono focus:outline-none focus:border-[#00D084] focus:ring-1 focus:ring-[#00D084]"
                        placeholder="0,00"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-[#00D084] uppercase tracking-wider mb-2">
                      TIPO DE PAGAMENTO *
                    </label>

                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'a_vista', label: 'À Vista' },
                        { id: 'a_vista_juros', label: 'À Vista + Juros' },
                        { id: 'juros_compostos', label: 'Juros Compostos' },
                        { id: 'parcelado', label: 'Parcelado' },
                        { id: 'juros_mensais', label: 'Juros Mensais' },
                        { id: 'parcela_juros_mes', label: 'Parcela + Juros/Mês' },
                      ].map((type) => {
                        const isSelected = paymentType === type.id;
                        return (
                          <button
                            key={type.id}
                            type="button"
                            onClick={() => setPaymentType(type.id as any)}
                            className={`min-h-[46px] py-2.5 px-3 rounded-2xl text-xs font-black flex items-center justify-center gap-1.5 transition active:scale-95 border ${
                              isSelected
                                ? 'bg-[#00D084] text-slate-950 border-[#00D084] shadow-md'
                                : 'bg-[#090D16] text-gray-300 border-[#1E293B] hover:border-[#00D084]/40'
                            }`}
                          >
                            {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                            <span className="text-center">{type.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-2.5 p-3.5 rounded-2xl bg-[#090D16] border border-[#1E293B] text-xs text-gray-300 flex items-start gap-2.5">
                      <Calculator className="w-4 h-4 text-[#00D084] shrink-0 mt-0.5" />
                      <p className="leading-relaxed">
                        {paymentTypeDescriptions[paymentType]}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-black text-[#00D084] uppercase tracking-wider mb-1.5">
                        TAXA DE JUROS (%)
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        value={interestRate}
                        onChange={(e) => setInterestRate(Number(e.target.value))}
                        className="w-full min-h-[48px] bg-[#090D16] border border-[#1E293B] rounded-2xl px-4 text-sm font-mono font-bold text-white focus:outline-none focus:border-[#00D084]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-black text-[#00D084] uppercase tracking-wider mb-1.5">
                        Nº DE PARCELAS
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="60"
                        value={installmentsCount}
                        onChange={(e) => setInstallmentsCount(Number(e.target.value))}
                        className="w-full min-h-[48px] bg-[#090D16] border border-[#1E293B] rounded-2xl px-4 text-sm font-mono font-bold text-white focus:outline-none focus:border-[#00D084]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-black text-[#00D084] uppercase tracking-wider mb-1.5">
                        PERIODICIDADE
                      </label>
                      <div className="grid grid-cols-2 gap-1 bg-[#090D16] p-1 border border-[#1E293B] rounded-2xl">
                        {(['mensal', 'semanal'] as const).map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setPeriodicity(p)}
                            className={`min-h-[38px] rounded-xl text-[11px] font-black capitalize transition ${
                              periodicity === p
                                ? 'bg-[#00D084] text-slate-950'
                                : 'text-gray-400 hover:text-white'
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-black text-[#00D084] uppercase tracking-wider mb-1.5">
                        1º VENCIMENTO
                      </label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full min-h-[48px] bg-[#090D16] border border-[#1E293B] rounded-2xl px-3 text-xs font-mono font-bold text-white focus:outline-none focus:border-[#00D084]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-[#00D084] uppercase tracking-wider mb-2">
                      CATEGORIA DA OPERAÇÃO
                    </label>

                    <div className="flex flex-wrap gap-2">
                      {categories.map((cat) => {
                        const isSelected = category === cat;
                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setCategory(cat)}
                            className={`min-h-[38px] px-3.5 py-1.5 rounded-full text-xs font-extrabold transition active:scale-95 border ${
                              isSelected
                                ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                                : 'bg-[#090D16] text-[#00D084] border-[#1E293B] hover:border-[#00D084]/50'
                            }`}
                          >
                            {cat}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#0F172A] border-l-4 border-l-[#00D084] border border-[#1E293B] space-y-4 shadow-sm">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#00D084]/15 text-[#00D084] flex items-center justify-center shrink-0">
                    <Settings className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white">Opções Avançadas</h4>
                    <p className="text-[11px] text-[#00D084] font-medium">Juros de atraso e anotações extras.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#090D16] border border-[#1E293B] flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-black text-white">Cobrar juros automáticos por atraso</p>
                    <p className="text-[11px] text-[#00D084] mt-0.5">
                      Quando ativado, é acrescida uma porcentagem ao valor em atraso.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setAutoLateFee(!autoLateFee)}
                    className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-200 shrink-0 ${
                      autoLateFee ? 'bg-[#00D084]' : 'bg-[#1E293B]'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform duration-200 ${
                      autoLateFee ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                {autoLateFee && (
                  <div>
                    <label className="block text-[11px] font-black text-[#00D084] uppercase tracking-wider mb-1.5">
                      JUROS POR ATRASO (%) *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.5"
                        value={lateFeeRate}
                        onChange={(e) => setLateFeeRate(Number(e.target.value))}
                        className="w-full min-h-[48px] bg-[#090D16] border border-[#1E293B] rounded-2xl px-4 text-xs font-mono font-bold text-white focus:outline-none focus:border-[#00D084]"
                        required
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                        %
                      </span>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-black text-[#00D084] uppercase tracking-wider mb-1.5">
                    OBSERVAÇÕES
                  </label>
                  <textarea
                    rows={3}
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    placeholder="Notas sobre o empréstimo..."
                    className="w-full bg-[#090D16] border border-[#1E293B] rounded-2xl p-3.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00D084]"
                  />
                </div>

              </div>

              <div className="p-4 rounded-2xl bg-[#0F172A] border border-[#00D084]/40 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Total Previsto a Receber</p>
                  <p className="text-xs text-[#00D084] font-medium">{installmentsCount}x de R$ {installmentAmount.toFixed(2)}</p>
                </div>
                <span className="text-lg font-black text-[#00D084] font-mono">
                  R$ {(Number(totalToReceive) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>

            </form>
          )}

          {activeTab === 'cliente' && (
            <form id="client-form" onSubmit={handleCreateClient} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">
                  Nome Completo do Cliente *
                </label>
                <input
                  type="text"
                  placeholder="Ex: João da Silva"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full min-h-[48px] bg-[#090D16] border border-[#1E293B] rounded-2xl px-4 text-sm text-white focus:outline-none focus:border-[#00D084]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">
                    CPF / CNPJ
                  </label>
                  <input
                    type="text"
                    placeholder="000.000.000-00"
                    value={clientDocument}
                    onChange={(e) => setClientDocument(e.target.value)}
                    className="w-full min-h-[48px] bg-[#090D16] border border-[#1E293B] rounded-2xl px-4 text-xs text-white focus:outline-none focus:border-[#00D084]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">
                    Telefone / WhatsApp
                  </label>
                  <input
                    type="text"
                    placeholder="(11) 90000-0000"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full min-h-[48px] bg-[#090D16] border border-[#1E293B] rounded-2xl px-4 text-xs text-white focus:outline-none focus:border-[#00D084]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">
                    Cidade / Estado
                  </label>
                  <input
                    type="text"
                    placeholder="Bauru - SP"
                    value={clientCity}
                    onChange={(e) => setClientCity(e.target.value)}
                    className="w-full min-h-[48px] bg-[#090D16] border border-[#1E293B] rounded-2xl px-4 text-xs text-white focus:outline-none focus:border-[#00D084]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">
                    Limite de Crédito (R$)
                  </label>
                  <input
                    type="number"
                    value={creditLimit}
                    onChange={(e) => setCreditLimit(Number(e.target.value))}
                    className="w-full min-h-[48px] bg-[#090D16] border border-[#1E293B] rounded-2xl px-4 text-xs text-white focus:outline-none focus:border-[#00D084]"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#090D16] border border-[#1E293B]">
                <UploadAnexoDocumentos
                  fotoUrl={clientFotoUrl}
                  onFotoChange={setClientFotoUrl}
                  documentosUrls={clientDocs}
                  onDocumentosChange={setClientDocs}
                />
              </div>
            </form>
          )}

          {activeTab === 'recebimento' && (
            <form id="receipt-form" onSubmit={handleCreateReceipt} className="space-y-4">
              <CustomSelect
                label="EMPRÉSTIMO REFERÊNCIA"
                value={selectedLoanId}
                options={loanOptions}
                onChange={(val) => setSelectedLoanId(val)}
                placeholder="Selecione um contrato..."
                required
              />

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">
                  Valor do Pagamento Recebido (R$) *
                </label>
                <input
                  type="number"
                  step="50"
                  value={receiptAmount}
                  onChange={(e) => setReceiptAmount(Number(e.target.value))}
                  className="w-full min-h-[50px] bg-[#090D16] border border-[#1E293B] rounded-2xl px-4 text-base text-[#00D084] font-black font-mono focus:outline-none focus:border-[#00D084]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-2">
                  Forma de Pagamento
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['PIX', 'Dinheiro', 'Transferência'] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`min-h-[46px] py-2.5 px-3 rounded-2xl border text-xs font-bold transition active:scale-95 ${
                        paymentMethod === method
                          ? 'bg-[#00D084]/20 border-[#00D084] text-[#00D084]'
                          : 'bg-[#090D16] border-[#1E293B] text-gray-400 hover:text-white'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>
            </form>
          )}

        </div>

        <div className="pt-3 border-t border-[#1E293B] grid grid-cols-2 gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[50px] py-3 px-4 rounded-2xl bg-[#0F172A] border border-[#1E293B] text-gray-300 font-bold text-xs hover:bg-[#1E293B] active:scale-95 transition"
          >
            Cancelar
          </button>

          {activeTab === 'emprestimo' && (
            <button
              type="button"
              onClick={() => handleCreateLoan()}
              className="min-h-[50px] py-3 px-4 rounded-2xl bg-[#00D084] text-slate-950 font-black text-xs flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition shadow-[0_0_20px_rgba(0,208,132,0.3)]"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Criar Empréstimo</span>
            </button>
          )}

          {activeTab === 'cliente' && (
            <button
              type="button"
              onClick={() => handleCreateClient()}
              className="min-h-[50px] py-3 px-4 rounded-2xl bg-[#00D084] text-slate-950 font-black text-xs flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition shadow-[0_0_20px_rgba(0,208,132,0.3)]"
            >
              <UserPlus className="w-4 h-4" />
              <span>Salvar Cliente</span>
            </button>
          )}

          {activeTab === 'recebimento' && (
            <button
              type="button"
              onClick={() => handleCreateReceipt()}
              className="min-h-[50px] py-3 px-4 rounded-2xl bg-[#00D084] text-slate-950 font-black text-xs flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition shadow-[0_0_20px_rgba(0,208,132,0.3)]"
            >
              <Receipt className="w-4 h-4" />
              <span>Dar Baixa</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
