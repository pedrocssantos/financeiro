import React, { useState } from 'react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import { Header } from './components/Header';
import { MonthNav } from './components/MonthNav';
import { KpiCards } from './components/KpiCards';
import { IncomeTable } from './components/IncomeTable';
import { FixedExpensesTable } from './components/FixedExpensesTable';
import { VariableExpensesTable } from './components/VariableExpensesTable';
import { InvestmentsCard } from './components/InvestmentsCard';
import { InstallmentsCard } from './components/InstallmentsCard';
import { AnnualSummaryView } from './components/AnnualSummaryView';
import { GroceryView } from './components/GroceryView';
import { AddTransactionModal } from './components/AddTransactionModal';
import { SettingsModal } from './components/SettingsModal';

const DashboardContent = () => {
  const { activeMonth } = useFinance();
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'grocery'
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addModalInitialType, setAddModalInitialType] = useState('income');
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const handleOpenAddModal = (type = 'income') => {
    setAddModalInitialType(type);
    setIsAddModalOpen(true);
  };

  return (
    <div className="app-container">
      {/* Top Bar with Brand, Filters & Quick Actions */}
      <Header 
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenAddModal={() => handleOpenAddModal('income')} 
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)} 
      />

      {activeTab === 'grocery' ? (
        <GroceryView />
      ) : (
        <>
          {/* Month Navigation */}
          <MonthNav />

          {activeMonth === 'ANNUAL_SUMMARY' ? (
            <AnnualSummaryView />
          ) : (
            <>
              {/* Main KPI Overview */}
              <KpiCards />

              {/* Grid Layout: Income & Fixed Bills */}
              <div className="dashboard-grid">
                <IncomeTable onOpenAddModal={handleOpenAddModal} />
                <FixedExpensesTable onOpenAddModal={handleOpenAddModal} />
              </div>

              {/* Variable Expenses (Shopping, Food, Daily) */}
              <VariableExpensesTable onOpenAddModal={handleOpenAddModal} />

              {/* Bottom Grid: Investments & Installments */}
              <div className="dashboard-grid">
                <InvestmentsCard onOpenAddModal={handleOpenAddModal} />
                <InstallmentsCard onOpenAddModal={handleOpenAddModal} />
              </div>
            </>
          )}
        </>
      )}

      {/* Modals */}
      <AddTransactionModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        initialType={addModalInitialType} 
      />

      <SettingsModal 
        isOpen={isSettingsModalOpen} 
        onClose={() => setIsSettingsModalOpen(false)} 
      />
    </div>
  );
};

export default function App() {
  return (
    <FinanceProvider>
      <DashboardContent />
    </FinanceProvider>
  );
}
