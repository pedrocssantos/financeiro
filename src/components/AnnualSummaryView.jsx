import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { MONTHS } from '../constants';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, PieChart, Pie, Cell 
} from 'recharts';
import { BarChart2, PieChart as PieIcon, Layers, TrendingUp, Users } from 'lucide-react';

export const AnnualSummaryView = () => {
  const { incomes, fixedExpenses, variableExpenses, investments, settings } = useFinance();

  const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

  // Compute monthly data for 12 months
  const monthlyData = MONTHS.map(m => {
    const inc = incomes.filter(i => i.month === m).reduce((a, c) => a + Number(c.amount || 0), 0);
    const fix = fixedExpenses.filter(f => f.month === m).reduce((a, c) => a + Number(c.amount || 0), 0);
    const v = variableExpenses.filter(varE => varE.month === m).reduce((a, c) => a + Number(c.amount || 0), 0);
    const inv = investments.reduce((a, c) => a + Number(c.monthlyContribution || 0), 0);

    const totalExpense = fix + v;
    const netBalance = inc - totalExpense - inv;

    return {
      month: m.slice(0, 3),
      Entradas: inc,
      Despesas: totalExpense,
      Investimentos: inv,
      Saldo: netBalance
    };
  });

  // Totals for year
  const yearTotalIncome = monthlyData.reduce((a, c) => a + c.Entradas, 0);
  const yearTotalExpense = monthlyData.reduce((a, c) => a + c.Despesas, 0);
  const yearTotalInvest = monthlyData.reduce((a, c) => a + c.Investimentos, 0);
  const yearNetBalance = yearTotalIncome - yearTotalExpense - yearTotalInvest;

  // Category distribution calculation
  const categoryTotals = {};
  variableExpenses.forEach(v => {
    const cat = v.category || 'Outros';
    categoryTotals[cat] = (categoryTotals[cat] || 0) + Number(v.amount || 0);
  });
  fixedExpenses.forEach(f => {
    const cat = f.category || 'Outros';
    categoryTotals[cat] = (categoryTotals[cat] || 0) + Number(f.amount || 0);
  });

  const pieData = Object.keys(categoryTotals).map(cat => ({
    name: cat,
    value: categoryTotals[cat]
  })).sort((a, b) => b.value - a.value);

  const COLORS = ['#06b6d4', '#22c55e', '#f59e0b', '#ec4899', '#a855f7', '#3b82f6', '#f43f5e', '#10b981', '#fb923c'];

  // Person split calculation
  const p1TotalIncome = incomes.filter(i => i.person === 'person1').reduce((a, c) => a + Number(c.amount || 0), 0);
  const p2TotalIncome = incomes.filter(i => i.person === 'person2').reduce((a, c) => a + Number(c.amount || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Annual Top KPIs */}
      <div className="kpi-grid">
        <div className="card kpi-card accent-income">
          <div className="kpi-header">
            <span className="kpi-title">Total de Entradas (Ano)</span>
            <div className="kpi-icon"><TrendingUp size={18} /></div>
          </div>
          <div className="kpi-value">{formatCurrency(yearTotalIncome)}</div>
        </div>

        <div className="card kpi-card accent-expense">
          <div className="kpi-header">
            <span className="kpi-title">Total de Despesas (Ano)</span>
            <div className="kpi-icon"><BarChart2 size={18} /></div>
          </div>
          <div className="kpi-value">{formatCurrency(yearTotalExpense)}</div>
        </div>

        <div className="card kpi-card accent-invest">
          <div className="kpi-header">
            <span className="kpi-title">Total Investido/Reservado</span>
            <div className="kpi-icon"><Layers size={18} /></div>
          </div>
          <div className="kpi-value">{formatCurrency(yearTotalInvest)}</div>
        </div>

        <div className="card kpi-card accent-balance">
          <div className="kpi-header">
            <span className="kpi-title">Saldo Anual Líquido</span>
            <div className="kpi-icon"><PieIcon size={18} /></div>
          </div>
          <div className="kpi-value" style={{ color: yearNetBalance >= 0 ? 'var(--info)' : 'var(--danger)' }}>
            {formatCurrency(yearNetBalance)}
          </div>
        </div>
      </div>

      {/* Bar Chart: Evolution 12 Months */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">
              <BarChart2 className="text-info" size={20} />
              Evolução Financeira Mensal (Janeiro - Dezembro)
            </h2>
            <p className="card-subtitle">Comparativo mensal entre Entradas, Despesas e Investimentos</p>
          </div>
        </div>

        <div style={{ width: '100%', height: 350 }}>
          <ResponsiveContainer>
            <BarChart data={monthlyData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
              <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} />
              <YAxis stroke="var(--text-muted)" fontSize={12} tickFormatter={(v) => `R$${v}`} />
              <Tooltip 
                formatter={(val) => formatCurrency(val)} 
                contentStyle={{ background: 'var(--bg-card)', borderColor: 'var(--border)', borderRadius: '10px' }} 
              />
              <Legend />
              <Bar dataKey="Entradas" fill="#22c55e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Despesas" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Investimentos" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Category Breakdown Donut */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <PieIcon className="text-purple" size={20} />
              Distribuição por Categorias
            </h2>
          </div>
          {pieData.length === 0 ? (
            <div className="empty-state">Sem dados de despesas para gráfico.</div>
          ) : (
            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(val) => formatCurrency(val)} 
                    contentStyle={{ background: 'var(--bg-card)', borderColor: 'var(--border)', borderRadius: '10px' }} 
                  />
                  <Legend fontSize={11} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Couple Income Contribution Breakdown */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <Users className="text-info" size={20} />
              Divisão da Renda do Casal
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '10px 0' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span>{settings.person1Name}</span>
                <strong>{formatCurrency(p1TotalIncome)} ({yearTotalIncome > 0 ? ((p1TotalIncome / yearTotalIncome) * 100).toFixed(1) : 0}%)</strong>
              </div>
              <div className="progress-bar-bg">
                <div 
                  className="progress-bar-fill" 
                  style={{ width: `${yearTotalIncome > 0 ? (p1TotalIncome / yearTotalIncome) * 100 : 0}%`, background: 'var(--info)' }} 
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span>{settings.person2Name}</span>
                <strong>{formatCurrency(p2TotalIncome)} ({yearTotalIncome > 0 ? ((p2TotalIncome / yearTotalIncome) * 100).toFixed(1) : 0}%)</strong>
              </div>
              <div className="progress-bar-bg">
                <div 
                  className="progress-bar-fill" 
                  style={{ width: `${yearTotalIncome > 0 ? (p2TotalIncome / yearTotalIncome) * 100 : 0}%`, background: 'var(--pink)' }} 
                />
              </div>
            </div>

            <div style={{ marginTop: '12px', background: 'var(--bg-surface)', padding: '14px', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem' }}>
              <strong>Sugestão de Divisão Proporcional das Contas do Casal:</strong>
              <div style={{ marginTop: '6px', color: 'var(--text-muted)' }}>
                • {settings.person1Name}: {yearTotalIncome > 0 ? ((p1TotalIncome / yearTotalIncome) * 100).toFixed(1) : 50}% das contas conjuntas.<br />
                • {settings.person2Name}: {yearTotalIncome > 0 ? ((p2TotalIncome / yearTotalIncome) * 100).toFixed(1) : 50}% das contas conjuntas.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
