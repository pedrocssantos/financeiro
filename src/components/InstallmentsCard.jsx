import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { CreditCard, Plus, Trash2 } from 'lucide-react';

export const InstallmentsCard = ({ onOpenAddModal }) => {
  const { installments, settings, deleteInstallment } = useFinance();
  const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

  const getPersonLabel = (p) => {
    if (p === 'person1') return settings.person1Name;
    if (p === 'person2') return settings.person2Name;
    return 'Casal';
  };

  const totalMonthlyInstallments = installments.reduce((acc, curr) => acc + Number(curr.monthlyAmount || 0), 0);

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h2 className="card-title">
            <CreditCard className="text-info" size={20} />
            Compras Parceladas & Financiamentos
          </h2>
          <p className="card-subtitle">Controle de parcelas no cartão de crédito</p>
        </div>

        <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.78rem' }} onClick={() => onOpenAddModal('installment')}>
          <Plus size={14} />
          Nova Parcela
        </button>
      </div>

      {installments.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <CreditCard size={22} />
          </div>
          <p>Nenhum parcelamento ativo registrado.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="g440-table">
            <thead>
              <tr>
                <th>Item / Compra</th>
                <th>Parcelas</th>
                <th>Responsável</th>
                <th>Valor Total</th>
                <th>Parcela Mensal</th>
                <th style={{ width: '40px' }}></th>
              </tr>
            </thead>
            <tbody>
              {installments.map((item) => (
                <tr key={item.id}>
                  <td>
                    <strong>{item.description}</strong>
                  </td>
                  <td>
                    <span className="badge badge-purple">
                      {item.currentInstallment} / {item.totalInstallments}x
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-info">{getPersonLabel(item.person)}</span>
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>
                    {formatCurrency(item.totalValue)}
                  </td>
                  <td style={{ fontWeight: 800, color: 'var(--info)' }}>
                    {formatCurrency(item.monthlyAmount)}
                  </td>
                  <td>
                    <button className="btn btn-ghost btn-icon" style={{ width: '28px', height: '28px' }} onClick={() => deleteInstallment(item.id)} title="Excluir">
                      <Trash2 size={14} style={{ color: 'var(--danger)' }} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ background: 'var(--bg-surface)', fontWeight: 800 }}>
                <td colSpan={4}>TOTAL PARCELAS DO MÊS</td>
                <td style={{ color: 'var(--info)', fontSize: '0.95rem' }}>{formatCurrency(totalMonthlyInstallments)}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
};
