import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { Plus, Trash2, Wallet } from 'lucide-react';

export const IncomeTable = ({ onOpenAddModal }) => {
  const { monthlyMetrics, settings, deleteIncome, activeMonth } = useFinance();
  const { monthIncomes, totalIncome } = monthlyMetrics;

  const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

  const getPersonLabel = (p) => {
    if (p === 'person1') return settings.person1Name;
    if (p === 'person2') return settings.person2Name;
    return 'Casal';
  };

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h2 className="card-title">
            <Wallet className="text-success" size={20} />
            Fontes de Renda ({activeMonth})
          </h2>
          <p className="card-subtitle">Receitas de cada membro do casal</p>
        </div>

        <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.78rem' }} onClick={() => onOpenAddModal('income')}>
          <Plus size={14} />
          Adicionar Renda
        </button>
      </div>

      {monthIncomes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Wallet size={22} />
          </div>
          <p>Nenhuma renda registrada para este mês.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="g440-table">
            <thead>
              <tr>
                <th>Descrição</th>
                <th>Responsável</th>
                <th>Categoria</th>
                <th>Valor</th>
                <th style={{ width: '40px' }}></th>
              </tr>
            </thead>
            <tbody>
              {monthIncomes.map((item) => (
                <tr key={item.id}>
                  <td>
                    <strong>{item.description}</strong>
                  </td>
                  <td>
                    <span className="badge badge-info">{getPersonLabel(item.person)}</span>
                  </td>
                  <td>
                    <span className="badge badge-subtle">{item.category || 'Salário'}</span>
                  </td>
                  <td style={{ fontWeight: 800, color: 'var(--success)' }}>
                    {formatCurrency(item.amount)}
                  </td>
                  <td>
                    <button className="btn btn-ghost btn-icon" style={{ width: '28px', height: '28px' }} onClick={() => deleteIncome(item.id)} title="Excluir">
                      <Trash2 size={14} style={{ color: 'var(--danger)' }} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ background: 'var(--bg-surface)', fontWeight: 800 }}>
                <td colSpan={3}>TOTAL DE ENTRADAS</td>
                <td style={{ color: 'var(--success)', fontSize: '0.95rem' }}>{formatCurrency(totalIncome)}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
};
