import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { X, Check } from 'lucide-react';
import { PAYMENT_METHODS } from '../constants';

export const AddTransactionModal = ({ isOpen, onClose, initialType = 'income' }) => {
  const { 
    activeMonth, settings, categories, 
    addIncome, addFixedExpense, addVariableExpense, addInvestment, addInstallment 
  } = useFinance();

  const [type, setType] = useState(initialType);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(categories[0]?.label || 'Supermercado');
  const [paymentMethod, setPaymentMethod] = useState('pix');
  const [person, setPerson] = useState('both');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [dueDay, setDueDay] = useState(10);
  const [essential, setEssential] = useState(true);

  // Investment specific
  const [targetAmount, setTargetAmount] = useState('');
  const [monthlyContribution, setMonthlyContribution] = useState('');

  // Installment specific
  const [totalInstallments, setTotalInstallments] = useState(10);
  const [currentInstallment, setCurrentInstallment] = useState(1);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !amount) {
      alert('Por favor preencha a descrição e o valor.');
      return;
    }

    const numAmount = Number(amount);

    if (type === 'income') {
      addIncome({
        month: activeMonth,
        description,
        amount: numAmount,
        category,
        person,
        date
      });
    } else if (type === 'fixed') {
      addFixedExpense({
        month: activeMonth,
        description,
        amount: numAmount,
        dueDay: Number(dueDay),
        category,
        paymentMethod,
        person,
        status: 'pending'
      });
    } else if (type === 'variable') {
      addVariableExpense({
        month: activeMonth,
        description,
        amount: numAmount,
        date,
        category,
        paymentMethod,
        essential,
        person
      });
    } else if (type === 'investment') {
      addInvestment({
        name: description,
        currentAmount: numAmount,
        targetAmount: Number(targetAmount || numAmount * 5),
        monthlyContribution: Number(monthlyContribution || numAmount * 0.1),
        category
      });
    } else if (type === 'installment') {
      const tot = Number(totalInstallments || 1);
      addInstallment({
        description,
        totalValue: numAmount,
        currentInstallment: Number(currentInstallment || 1),
        totalInstallments: tot,
        monthlyAmount: Number((numAmount / tot).toFixed(2)),
        person
      });
    }

    // Reset & Close
    setDescription('');
    setAmount('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Novo Lançamento ({activeMonth})</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Type selector tabs */}
        <div className="person-filter-group" style={{ width: '100%', justifyContent: 'space-between' }}>
          <button 
            type="button" 
            className={`person-filter-btn ${type === 'income' ? 'active' : ''}`}
            onClick={() => setType('income')}
          >
            Renda
          </button>
          <button 
            type="button" 
            className={`person-filter-btn ${type === 'fixed' ? 'active' : ''}`}
            onClick={() => setType('fixed')}
          >
            Fixo
          </button>
          <button 
            type="button" 
            className={`person-filter-btn ${type === 'variable' ? 'active' : ''}`}
            onClick={() => setType('variable')}
          >
            Variável
          </button>
          <button 
            type="button" 
            className={`person-filter-btn ${type === 'investment' ? 'active' : ''}`}
            onClick={() => setType('investment')}
          >
            Meta
          </button>
          <button 
            type="button" 
            className={`person-filter-btn ${type === 'installment' ? 'active' : ''}`}
            onClick={() => setType('installment')}
          >
            Parcela
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="form-group">
            <label className="form-label">Descrição</label>
            <input
              type="text"
              className="form-input"
              placeholder={
                type === 'income' ? 'Ex: Salário, Projeto Extra' :
                type === 'fixed' ? 'Ex: Aluguel, Netflix, Luz' :
                type === 'variable' ? 'Ex: Compras no Supermercado' :
                type === 'investment' ? 'Ex: Reserva de Emergência' : 'Ex: Compra de Eletrodoméstico'
              }
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">{type === 'installment' ? 'Valor Total (R$)' : 'Valor (R$)'}</label>
              <input
                type="number"
                step="0.01"
                className="form-input"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Responsável</label>
              <select className="form-select" value={person} onChange={(e) => setPerson(e.target.value)}>
                <option value="both">Casal (Ambos)</option>
                <option value="person1">{settings.person1Name}</option>
                <option value="person2">{settings.person2Name}</option>
              </select>
            </div>
          </div>

          {type !== 'investment' && (
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Categoria</label>
                <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                  {categories.map(c => (
                    <option key={c.id} value={c.label}>{c.label}</option>
                  ))}
                </select>
              </div>

              {type !== 'income' && (
                <div className="form-group">
                  <label className="form-label">Forma de Pagamento</label>
                  <select className="form-select" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                    {PAYMENT_METHODS.map(p => (
                      <option key={p.id} value={p.id}>{p.label}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {type === 'fixed' && (
            <div className="form-group">
              <label className="form-label">Dia do Vencimento (1 a 31)</label>
              <input
                type="number"
                min="1"
                max="31"
                className="form-input"
                value={dueDay}
                onChange={(e) => setDueDay(e.target.value)}
              />
            </div>
          )}

          {type === 'variable' && (
            <div className="form-row" style={{ alignItems: 'center' }}>
              <div className="form-group">
                <label className="form-label">Data</label>
                <input
                  type="date"
                  className="form-input"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '8px', marginTop: '20px' }}>
                <input
                  type="checkbox"
                  id="chk-essential"
                  checked={essential}
                  onChange={(e) => setEssential(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="chk-essential" className="form-label" style={{ cursor: 'pointer', margin: 0 }}>
                  É um gasto essencial?
                </label>
              </div>
            </div>
          )}

          {type === 'investment' && (
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Meta Final (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-input"
                  placeholder="Ex: 30000"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Aporte Mensal (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-input"
                  placeholder="Ex: 1000"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(e.target.value)}
                />
              </div>
            </div>
          )}

          {type === 'installment' && (
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Total de Parcelas</label>
                <input
                  type="number"
                  min="1"
                  className="form-input"
                  value={totalInstallments}
                  onChange={(e) => setTotalInstallments(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Parcela Atual</label>
                <input
                  type="number"
                  min="1"
                  className="form-input"
                  value={currentInstallment}
                  onChange={(e) => setCurrentInstallment(e.target.value)}
                />
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary">
              <Check size={16} /> Salvar Lançamento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
