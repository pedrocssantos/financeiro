import React from 'react';
import { MONTHS } from '../constants';
import { useFinance } from '../context/FinanceContext';
import { Calendar, BarChart3 } from 'lucide-react';

export const MonthNav = () => {
  const { activeMonth, setActiveMonth } = useFinance();

  return (
    <nav className="month-nav">
      {MONTHS.map(m => (
        <button
          key={m}
          className={`month-tab ${activeMonth === m ? 'active' : ''}`}
          onClick={() => setActiveMonth(m)}
        >
          <Calendar size={14} />
          {m}
        </button>
      ))}

      <button
        className={`month-tab tab-summary ${activeMonth === 'ANNUAL_SUMMARY' ? 'active' : ''}`}
        onClick={() => setActiveMonth('ANNUAL_SUMMARY')}
      >
        <BarChart3 size={15} />
        RESUMO ANUAL
      </button>
    </nav>
  );
};
