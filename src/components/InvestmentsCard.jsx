import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Target, PiggyBank, Plus, Trash2, Edit3, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

export const InvestmentsCard = ({ onOpenAddModal }) => {
  const { investments, updateInvestmentAmount, deleteInvestment } = useFinance();
  const [editingId, setEditingId] = useState(null);
  const [tempAmount, setTempAmount] = useState('');

  const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

  const handleSaveAmount = (id) => {
    if (tempAmount !== '') {
      updateInvestmentAmount(id, tempAmount);
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    }
    setEditingId(null);
  };

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h2 className="card-title">
            <PiggyBank className="text-warning" size={20} />
            Reservas & Metas Financeiras
          </h2>
          <p className="card-subtitle">Reserva de emergência, viagens e investimentos de longo prazo</p>
        </div>

        <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.78rem' }} onClick={() => onOpenAddModal('investment')}>
          <Plus size={14} />
          Nova Meta
        </button>
      </div>

      {investments.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <PiggyBank size={22} />
          </div>
          <p>Nenhuma reserva ou meta cadastrada.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          {investments.map(item => {
            const current = Number(item.currentAmount || 0);
            const target = Number(item.targetAmount || 1);
            const percent = Math.min(100, Math.round((current / target) * 100));
            const isCompleted = percent >= 100;

            return (
              <div 
                key={item.id} 
                style={{ 
                  background: 'var(--bg-base)', 
                  border: isCompleted ? '1px solid var(--success)' : '1px solid var(--border)', 
                  borderRadius: 'var(--radius-md)', 
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Target size={18} style={{ color: isCompleted ? 'var(--success)' : 'var(--warning)' }} />
                    <strong style={{ fontSize: '0.92rem' }}>{item.name}</strong>
                  </div>
                  <button className="btn btn-ghost btn-icon" style={{ width: '24px', height: '24px' }} onClick={() => deleteInvestment(item.id)}>
                    <Trash2 size={13} style={{ color: 'var(--danger)' }} />
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                  {editingId === item.id ? (
                    <div style={{ display: 'flex', gap: '6px', width: '100%' }}>
                      <input
                        type="number"
                        value={tempAmount}
                        onChange={(e) => setTempAmount(e.target.value)}
                        className="form-input"
                        placeholder={current}
                        style={{ padding: '4px 8px', fontSize: '0.85rem' }}
                      />
                      <button className="btn btn-primary" style={{ padding: '4px 10px', fontSize: '0.75rem' }} onClick={() => handleSaveAmount(item.id)}>
                        Salvar
                      </button>
                    </div>
                  ) : (
                    <>
                      <div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--warning)' }}>
                          {formatCurrency(current)}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-subtle)' }}>
                          Meta: {formatCurrency(target)}
                        </div>
                      </div>
                      <button 
                        className="btn btn-ghost btn-icon" 
                        style={{ width: '28px', height: '28px' }} 
                        onClick={() => { setEditingId(item.id); setTempAmount(current); }}
                        title="Atualizar saldo atual"
                      >
                        <Edit3 size={14} />
                      </button>
                    </>
                  )}
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    <span>Progresso ({percent}%)</span>
                    <span>Aporte mensal: {formatCurrency(item.monthlyContribution)}</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div 
                      className="progress-bar-fill" 
                      style={{ 
                        width: `${percent}%`, 
                        background: isCompleted ? 'linear-gradient(90deg, #22c55e, #10b981)' : 'linear-gradient(90deg, #f59e0b, #06b6d4)' 
                      }} 
                    />
                  </div>
                </div>

                {isCompleted && (
                  <div className="badge badge-success" style={{ alignSelf: 'flex-start', gap: '4px' }}>
                    <Award size={13} /> Meta Concluída!
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
