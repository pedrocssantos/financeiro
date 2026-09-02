import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Plus, Trash2, ShoppingBag, Filter, Search } from 'lucide-react';
import { PAYMENT_METHODS } from '../constants';

export const VariableExpensesTable = ({ onOpenAddModal }) => {
  const { monthlyMetrics, settings, deleteVariableExpense, activeMonth, categories } = useFinance();
  const { monthVar, totalVariable, essentialVar, nonEssentialVar } = monthlyMetrics;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');

  const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

  const getPersonLabel = (p) => {
    if (p === 'person1') return settings.person1Name;
    if (p === 'person2') return settings.person2Name;
    return 'Casal';
  };

  const getPaymentMethodLabel = (methodId) => {
    const found = PAYMENT_METHODS.find(m => m.id === methodId);
    return found ? found.label : methodId || 'Débito';
  };

  const filteredExpenses = monthVar.filter(item => {
    const matchesSearch = item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCat = selectedCategoryFilter === 'all' || item.category === selectedCategoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h2 className="card-title">
            <ShoppingBag className="text-danger" size={20} />
            Gastos do Mês - Variáveis ({activeMonth})
          </h2>
          <p className="card-subtitle">
            Essenciais: <strong style={{ color: 'var(--success)' }}>{formatCurrency(essentialVar)}</strong> | 
            Superfluos: <strong style={{ color: 'var(--warning)' }}>{formatCurrency(nonEssentialVar)}</strong>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', color: 'var(--text-subtle)' }} />
            <input
              type="text"
              placeholder="Buscar gasto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '30px', padding: '6px 12px 6px 30px', fontSize: '0.78rem', width: '150px' }}
            />
          </div>

          <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.78rem' }} onClick={() => onOpenAddModal('variable')}>
            <Plus size={14} />
            Lançar Gasto
          </button>
        </div>
      </div>

      {filteredExpenses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <ShoppingBag size={22} />
          </div>
          <p>Nenhum gasto variável registrado neste mês.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="g440-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Descrição</th>
                <th>Categoria</th>
                <th>Pagamento</th>
                <th>Essencial?</th>
                <th>Quem Pagou</th>
                <th>Valor</th>
                <th style={{ width: '40px' }}></th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((item) => (
                <tr key={item.id}>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                    {item.date ? new Date(item.date).toLocaleDateString('pt-BR') : '--'}
                  </td>
                  <td>
                    <strong>{item.description}</strong>
                  </td>
                  <td>
                    <span className="badge badge-subtle">{item.category || 'Variável'}</span>
                  </td>
                  <td>
                    <span className="badge badge-purple">
                      {getPaymentMethodLabel(item.paymentMethod)}
                    </span>
                  </td>
                  <td>
                    {item.essential ? (
                      <span className="badge badge-success">Sim</span>
                    ) : (
                      <span className="badge badge-warning">Não</span>
                    )}
                  </td>
                  <td>
                    <span className="badge badge-info">{getPersonLabel(item.person)}</span>
                  </td>
                  <td style={{ fontWeight: 800, color: 'var(--danger)' }}>
                    {formatCurrency(item.amount)}
                  </td>
                  <td>
                    <button className="btn btn-ghost btn-icon" style={{ width: '28px', height: '28px' }} onClick={() => deleteVariableExpense(item.id)} title="Excluir">
                      <Trash2 size={14} style={{ color: 'var(--danger)' }} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ background: 'var(--bg-surface)', fontWeight: 800 }}>
                <td colSpan={6}>TOTAL GASTOS VARIÁVEIS</td>
                <td style={{ color: 'var(--danger)', fontSize: '0.95rem' }}>{formatCurrency(totalVariable)}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
};
