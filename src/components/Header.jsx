import React, { useRef } from 'react';
import { useFinance } from '../context/FinanceContext';
import { PlusCircle, Sun, Moon, Settings, Download, Upload, RefreshCw, Wallet, Users, User, LayoutDashboard, ShoppingCart } from 'lucide-react';

export const Header = ({ activeTab, onSelectTab, onOpenAddModal, onOpenSettingsModal }) => {
  const { 
    settings, setSettings, 
    activePersonFilter, setActivePersonFilter,
    groceryMetrics,
    exportBackupJSON, importBackupJSON, resetAllData 
  } = useFinance();

  const fileInputRef = useRef(null);

  const toggleTheme = () => {
    setSettings(prev => ({ ...prev, darkMode: !prev.darkMode }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target.result);
          importBackupJSON(json);
        } catch (err) {
          alert('Arquivo JSON inválido.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <header className="g440-header">
      <div className="g440-brand">
        <div className="g440-logo-badge">
          <Wallet size={24} />
        </div>
        <div className="g440-title-group">
          <h1>
            Finanças do Casal
            <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>Grupo 440 Edition</span>
          </h1>
          <p>{settings.person1Name} & {settings.person2Name} • Gestão Financeira Inteligente</p>
        </div>
      </div>

      {/* Main Navigation Tabs: Dashboard vs Lista de Mercado */}
      <div className="main-nav-tabs">
        <button 
          className={`nav-tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => onSelectTab('dashboard')}
        >
          <LayoutDashboard size={16} />
          <span>Dashboard</span>
        </button>

        <button 
          className={`nav-tab-btn ${activeTab === 'grocery' ? 'active' : ''}`}
          onClick={() => onSelectTab('grocery')}
        >
          <ShoppingCart size={16} />
          <span>Lista de Mercado</span>
          {groceryMetrics?.pendingCount > 0 && (
            <span className="nav-tab-badge">{groceryMetrics.pendingCount}</span>
          )}
        </button>
      </div>

      {/* Person Filter Pills */}
      <div className="person-filter-group">
        <button
          className={`person-filter-btn ${activePersonFilter === 'both' ? 'active' : ''}`}
          onClick={() => setActivePersonFilter('both')}
          title="Ver lançamentos do Casal (Ambos)"
        >
          <Users size={15} />
          Casal
        </button>

        <button
          className={`person-filter-btn ${activePersonFilter === 'person1' ? 'active' : ''}`}
          onClick={() => setActivePersonFilter('person1')}
          title={`Ver apenas gastos de ${settings.person1Name}`}
        >
          <User size={15} />
          {settings.person1Name}
        </button>

        <button
          className={`person-filter-btn ${activePersonFilter === 'person2' ? 'active' : ''}`}
          onClick={() => setActivePersonFilter('person2')}
          title={`Ver apenas gastos de ${settings.person2Name}`}
        >
          <User size={15} />
          {settings.person2Name}
        </button>
      </div>

      <div className="g440-actions-row">
        <button className="btn btn-primary" onClick={onOpenAddModal}>
          <PlusCircle size={16} />
          Novo Lançamento
        </button>

        <button className="btn btn-secondary btn-icon" onClick={toggleTheme} title="Alternar Tema Claro / Escuro">
          {settings.darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button className="btn btn-secondary btn-icon" onClick={onOpenSettingsModal} title="Configurações do Casal & Categorias">
          <Settings size={18} />
        </button>

        <button className="btn btn-ghost btn-icon" onClick={exportBackupJSON} title="Baixar Backup dos Dados (JSON)">
          <Download size={18} />
        </button>

        <button className="btn btn-ghost btn-icon" onClick={() => fileInputRef.current?.click()} title="Importar Backup (JSON)">
          <Upload size={18} />
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileUpload} 
          accept=".json" 
          style={{ display: 'none' }} 
        />

        <button className="btn btn-ghost btn-icon" onClick={resetAllData} title="Restaurar Dados Iniciais">
          <RefreshCw size={18} />
        </button>
      </div>
    </header>
  );
};
