import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { Plus, Trash2, CheckCircle2, XCircle, DollarSign, CreditCard } from 'lucide-react';
import { PAYMENT_METHODS } from '../constants';

export const FixedExpensesTable = ({ onOpenAddModal }) => {
  const { monthlyMetrics, settings, toggleFixedStatus, deleteFixedExpense, activeMonth } = useFinance();
  const { monthFixed, totalFixed } = monthlyMetrics;

  const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

  const getPersonLabel = (p) => {
    if (p === 'person1') return settings.person1Name;
    if (p === 'person2') return settings.person2Name;
    return 'Casal';
  };

  const getPaymentMethodLabel = (methodId) => {
    const found = PAYMENT_METHODS.find(m => m.id === methodId);
    return found ? found.label : methodId || 'Pix';
  };

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h2 className="card-title">
            <DollarSign className="text-warning" size={20} />
            Contas Fixas e Assinaturas ({activeMonth})
          </h2>
          <p className="card-subtitle">Aluguel, contas de luz, internet e despesas recorrentes do casal</p>
        </div>

        <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.78rem' }} onClick={() => onOpenAddModal('fixed')}>
          <Plus size={14} />
          Adicionar Conta Fixa
        </button>
      </div>

      {monthFixed.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <CreditCard size={22} />
          </div>
          <p>Nenhuma conta fixa cadastrada neste mês.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="g440-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>Status</th>
                <th>Descrição</th>
                <th>Vencimento</th>
                <th>Pagamento</th>
                <th>Responsável</th>
                <th>Valor</th>
                <th style={{ width: '40px' }}></th>
              </tr>
            </thead>
            <tbody>
              {monthFixed.map((item) => {
                const isPaid = item.status === 'paid';
                return (
                  <tr key={item.id} style={{ opacity: isPaid ? 0.85 : 1 }}>
                    <td>
                      <button
                        className="btn btn-ghost btn-icon"
                        style={{ width: '32px', height: '32px' }}
                        onClick={() => toggleFixedStatus(item.id)}
                        title={isPaid ? 'Marcar como Pendente' : 'Marcar como Pago'}
                      >
                        {isPaid ? (
                          <CheckCircle2 size={20} style={{ color: 'var(--success)' }} />
                        ) : (
                          <XCircle size={20} style={{ color: 'var(--danger)' }} />
                        )}
                      </button>
                    </td>
                    <td>
                      <strong style={{ textDecoration: isPaid ? 'line-through' : 'none', color: isPaid ? 'var(--text-muted)' : 'var(--text)' }}>
                        {item.description}
                      </strong>
                    </td>
                    <td>
                      <span className="badge badge-subtle">Dia {item.dueDay || '--'}</span>
                    </td>
                    <td>
                      <span className="badge badge-purple">
                        {getPaymentMethodLabel(item.paymentMethod)}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-info">{getPersonLabel(item.person)}</span>
                    </td>
                    <td style={{ fontWeight: 800, color: 'var(--text)' }}>
                      {formatCurrency(item.amount)}
                    </td>
                    <td>
                      <button className="btn btn-ghost btn-icon" style={{ width: '28px', height: '28px' }} onClick={() => deleteFixedExpense(item.id)} title="Excluir">
                        <Trash2 size={14} style={{ color: 'var(--danger)' }} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{ background: 'var(--bg-surface)', fontWeight: 800 }}>
                <td colSpan={5}>TOTAL CONTAS FIXAS</td>
                <td style={{ color: 'var(--text)', fontSize: '0.95rem' }}>{formatCurrency(totalFixed)}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
};
