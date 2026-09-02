import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { TrendingUp, TrendingDown, DollarSign, PiggyBank, Scale, AlertCircle } from 'lucide-react';

export const KpiCards = () => {
  const { monthlyMetrics, activeMonth } = useFinance();
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);
  };

  if (activeMonth === 'ANNUAL_SUMMARY') return null;

  const {
    totalIncome,
    totalFixed,
    paidFixed,
    totalVariable,
    totalInvestments,
    remainingBalance,
    compromisedPercentage
  } = monthlyMetrics;

  return (
    <div className="kpi-grid">
      {/* Entradas / Income */}
      <div className="card kpi-card accent-income">
        <div className="kpi-header">
          <span className="kpi-title">Entradas Totais</span>
          <div className="kpi-icon">
            <TrendingUp size={18} />
          </div>
        </div>
        <div className="kpi-value">{formatCurrency(totalIncome)}</div>
        <div className="kpi-sub">
          <span>Receitas acumuladas no mês</span>
        </div>
      </div>

      {/* Gastos Fixos */}
      <div className="card kpi-card accent-fixed">
        <div className="kpi-header">
          <span className="kpi-title">Contas Fixas</span>
          <div className="kpi-icon">
            <DollarSign size={18} />
          </div>
        </div>
        <div className="kpi-value">{formatCurrency(totalFixed)}</div>
        <div className="kpi-sub">
          <span className="badge badge-success" style={{ padding: '2px 6px' }}>
            Pago: {formatCurrency(paidFixed)}
          </span>
        </div>
      </div>

      {/* Gastos Variáveis */}
      <div className="card kpi-card accent-expense">
        <div className="kpi-header">
          <span className="kpi-title">Gastos Variáveis</span>
          <div className="kpi-icon">
            <TrendingDown size={18} />
          </div>
        </div>
        <div className="kpi-value">{formatCurrency(totalVariable)}</div>
        <div className="kpi-sub">
          <span>Supermercado, lazer e dia a dia</span>
        </div>
      </div>

      {/* Reservas & Investimentos */}
      <div className="card kpi-card accent-invest">
        <div className="kpi-header">
          <span className="kpi-title">Reservas do Mês</span>
          <div className="kpi-icon">
            <PiggyBank size={18} />
          </div>
        </div>
        <div className="kpi-value">{formatCurrency(totalInvestments)}</div>
        <div className="kpi-sub">
          <span>Economia e aplicações para metas</span>
        </div>
      </div>

      {/* Saldo Restante */}
      <div className="card kpi-card accent-balance">
        <div className="kpi-header">
          <span className="kpi-title">Saldo Restante</span>
          <div className="kpi-icon">
            <Scale size={18} />
          </div>
        </div>
        <div className="kpi-value" style={{ color: remainingBalance >= 0 ? 'var(--info)' : 'var(--danger)' }}>
          {formatCurrency(remainingBalance)}
        </div>
        <div className="kpi-sub">
          <span>{remainingBalance >= 0 ? 'Superávit disponível' : 'Atenção: Saldo negativo'}</span>
        </div>
      </div>

      {/* Renda Comprometida */}
      <div className="card kpi-card">
        <div className="kpi-header">
          <span className="kpi-title">Renda Comprometida</span>
          <div className="kpi-icon" style={{ background: 'var(--purple-bg)', color: 'var(--purple)' }}>
            <AlertCircle size={18} />
          </div>
        </div>
        <div className="kpi-value" style={{ color: Number(compromisedPercentage) > 80 ? 'var(--danger)' : 'var(--text)' }}>
          {compromisedPercentage}%
        </div>
        <div className="kpi-sub">
          <div className="progress-bar-bg">
            <div 
              className="progress-bar-fill" 
              style={{ 
                width: `${Math.min(100, Number(compromisedPercentage))}%`,
                background: Number(compromisedPercentage) > 80 ? 'var(--danger)' : Number(compromisedPercentage) > 60 ? 'var(--warning)' : 'var(--success)'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
