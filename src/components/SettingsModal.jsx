import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { X, Check, Plus, Users, Tag } from 'lucide-react';

export const SettingsModal = ({ isOpen, onClose }) => {
  const { settings, setSettings, categories, addCategory } = useFinance();
  const [p1Name, setP1Name] = useState(settings.person1Name);
  const [p2Name, setP2Name] = useState(settings.person2Name);

  const [newCatLabel, setNewCatLabel] = useState('');
  const [newCatColor, setNewCatColor] = useState('#06b6d4');

  if (!isOpen) return null;

  const handleSaveNames = (e) => {
    e.preventDefault();
    setSettings(prev => ({
      ...prev,
      person1Name: p1Name.trim() || 'Máximo',
      person2Name: p2Name.trim() || 'Namorada'
    }));
    alert('Nomes atualizados com sucesso!');
  };

  const handleAddCat = (e) => {
    e.preventDefault();
    if (!newCatLabel) return;
    addCategory({
      label: newCatLabel,
      color: newCatColor
    });
    setNewCatLabel('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            <Users size={20} /> Configurações do Casal & Categorias
          </h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Form 1: Couple Names */}
        <form onSubmit={handleSaveNames} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text)' }}>
            1. Nome dos Integrantes do Casal
          </h3>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Seu Nome (Pessoa 1)</label>
              <input
                type="text"
                className="form-input"
                value={p1Name}
                onChange={(e) => setP1Name(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Nome da Namorada (Pessoa 2)</label>
              <input
                type="text"
                className="form-input"
                value={p2Name}
                onChange={(e) => setP2Name(e.target.value)}
                required
              />
            </div>
          </div>
          <button type="submit" className="btn btn-secondary" style={{ alignSelf: 'flex-start' }}>
            <Check size={14} /> Salvar Nomes
          </button>
        </form>

        <hr style={{ borderColor: 'var(--border-subtle)', margin: '8px 0' }} />

        {/* Form 2: New Custom Category */}
        <form onSubmit={handleAddCat} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Tag size={16} /> 2. Categorias Personalizadas
          </h3>

          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Ex: Petshop, Viagens"
              value={newCatLabel}
              onChange={(e) => setNewCatLabel(e.target.value)}
            />
            <input
              type="color"
              value={newCatColor}
              onChange={(e) => setNewCatColor(e.target.value)}
              style={{ width: '42px', height: '42px', border: 'none', background: 'transparent', cursor: 'pointer' }}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '0 16px' }}>
              <Plus size={16} />
            </button>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxHeight: '120px', overflowY: 'auto' }}>
            {categories.map(c => (
              <span key={c.id} className="badge badge-subtle" style={{ fontSize: '0.78rem' }}>
                <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: c.color, marginRight: '4px' }} />
                {c.label}
              </span>
            ))}
          </div>
        </form>
      </div>
    </div>
  );
};
