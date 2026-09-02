import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { GROCERY_CATEGORIES, ONLINE_MARKET_DATABASE } from '../constants';
import { 
  ShoppingCart, Tag, TrendingDown, Award, Plus, Trash2, CheckCircle, 
  Circle, DollarSign, Store, ArrowRight, ShieldCheck, Sparkles, Filter, Search, X, Check,
  Globe, Download, ExternalLink, Zap
} from 'lucide-react';

export const GroceryView = () => {
  const { 
    groceryItems, groceryMetrics, 
    addGroceryItem, deleteGroceryItem, toggleGroceryChecked,
    addPriceToItem, deletePriceFromItem, convertGroceryToVariableExpense
  } = useFinance();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedMarketFilter, setSelectedMarketFilter] = useState('ALL');
  
  // Modal / Form state for new item
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState(GROCERY_CATEGORIES[0]);
  const [newItemQty, setNewItemQty] = useState(1);
  const [newItemUnit, setNewItemUnit] = useState('un');
  const [initialMarketName, setInitialMarketName] = useState('');
  const [initialPrice, setInitialPrice] = useState('');

  // State for inline add price modal
  const [priceModalItemId, setPriceModalItemId] = useState(null);
  const [marketInput, setMarketInput] = useState('');
  const [priceInput, setPriceInput] = useState('');

  // State for Web Price Search Modal
  const [isWebSearchModalOpen, setIsWebSearchModalOpen] = useState(false);
  const [webSearchQuery, setWebSearchQuery] = useState('');
  const [webSearchResults, setWebSearchResults] = useState(null);
  const [isSearchingWeb, setIsSearchingWeb] = useState(false);
  const [webSearchTargetItemId, setWebSearchTargetItemId] = useState(null);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);
  };

  // Helper to find cheapest price and market for an item
  const getItemPriceStats = (item) => {
    if (!item.prices || item.prices.length === 0) {
      return { minPrice: null, bestMarket: null, maxPrice: null, prices: [] };
    }
    const validPrices = item.prices.filter(p => p.price && !isNaN(p.price));
    if (validPrices.length === 0) {
      return { minPrice: null, bestMarket: null, maxPrice: null, prices: [] };
    }
    const sorted = [...validPrices].sort((a, b) => Number(a.price) - Number(b.price));
    const minObj = sorted[0];
    const maxObj = sorted[sorted.length - 1];
    return {
      minPrice: Number(minObj.price),
      bestMarket: minObj.marketName,
      maxPrice: Number(maxObj.price),
      prices: sorted
    };
  };

  // Filter items by search, category, and market
  const filteredItems = groceryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesMarket = selectedMarketFilter === 'ALL' || (item.prices && item.prices.some(p => p.marketName === selectedMarketFilter));
    return matchesSearch && matchesCat && matchesMarket;
  });

  const bestMarketObj = groceryMetrics.bestMarketObj;
  const rankedMarkets = groceryMetrics.rankedMarkets || [];

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const prices = [];
    if (initialMarketName.trim() && initialPrice) {
      prices.push({
        marketName: initialMarketName.trim(),
        price: Number(initialPrice)
      });
    }

    addGroceryItem({
      name: newItemName.trim(),
      category: newItemCategory,
      quantity: Number(newItemQty) || 1,
      unit: newItemUnit,
      prices
    });

    setNewItemName('');
    setNewItemQty(1);
    setInitialMarketName('');
    setInitialPrice('');
    setIsAddModalOpen(false);
  };

  const handleSaveNewPrice = (e) => {
    e.preventDefault();
    if (!priceModalItemId || !marketInput.trim() || !priceInput) return;
    addPriceToItem(priceModalItemId, marketInput.trim(), Number(priceInput));
    setPriceModalItemId(null);
    setMarketInput('');
    setPriceInput('');
  };

  // Real Price Search Engine (Real Supermarket Catalog + Online API Fetch)
  const executeWebPriceSearchAsync = async (term) => {
    if (!term || !term.trim()) return null;
    const cleanTerm = term.toLowerCase().trim();

    // 1. Check Real Supermarket Catalog (Assaí, Atacadão, Carrefour, Pão de Açúcar)
    const foundInCatalog = ONLINE_MARKET_DATABASE.find(dbItem => 
      dbItem.keywords.some(kw => cleanTerm.includes(kw) || kw.includes(cleanTerm)) ||
      dbItem.name.toLowerCase().includes(cleanTerm)
    );

    if (foundInCatalog) {
      return {
        productName: foundInCatalog.name,
        category: foundInCatalog.category,
        unit: foundInCatalog.unit,
        isLive: false,
        isCatalog: true,
        offers: [...foundInCatalog.offers].sort((a, b) => a.price - b.price)
      };
    }

    // 2. Try Live Public API (Mercado Livre Supermercado / E-commerce BR)
    try {
      const encoded = encodeURIComponent(cleanTerm);
      const res = await fetch(`https://api.mercadolivre.com/sites/MLB/search?q=${encoded}&limit=8`);
      
      if (res.ok) {
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          const liveOffers = data.results.map(item => {
            const storeName = item.official_store_name || (item.seller && item.seller.nickname) || 'Supermercado Online (Mercado Livre)';
            return {
              marketName: storeName.replace(/_/g, ' '),
              price: Number(item.price),
              sourceUrl: item.permalink,
              title: item.title,
              thumbnail: item.thumbnail,
              isLive: true
            };
          }).filter(o => o.price > 0).sort((a, b) => a.price - b.price);

          if (liveOffers.length > 0) {
            return {
              productName: data.results[0].title || term,
              category: 'Supermercado Online (API)',
              unit: 'un',
              isLive: true,
              offers: liveOffers
            };
          }
        }
      }
    } catch (err) {
      console.info('Consulta à API online indisponível:', err);
    }

    // 3. Partial Keyword Match in Real Supermarket Catalog
    const words = cleanTerm.split(' ');
    for (const w of words) {
      if (w.length > 2) {
        const partial = ONLINE_MARKET_DATABASE.find(dbItem => 
          dbItem.keywords.some(kw => kw.includes(w) || w.includes(kw))
        );
        if (partial) {
          return {
            productName: partial.name,
            category: partial.category,
            unit: partial.unit,
            isLive: false,
            isCatalog: true,
            offers: [...partial.offers].sort((a, b) => a.price - b.price)
          };
        }
      }
    }

    return {
      productName: term,
      noResults: true,
      offers: []
    };
  };

  const handleOpenWebSearchForTerm = async (term = '', itemId = null) => {
    setWebSearchTargetItemId(itemId);
    setWebSearchQuery(term);
    setIsWebSearchModalOpen(true);
    if (term.trim()) {
      setIsSearchingWeb(true);
      const res = await executeWebPriceSearchAsync(term);
      setWebSearchResults(res);
      setIsSearchingWeb(false);
    } else {
      setWebSearchResults(null);
    }
  };

  const handleRunWebSearch = async (e) => {
    e.preventDefault();
    if (!webSearchQuery.trim()) return;
    setIsSearchingWeb(true);
    const res = await executeWebPriceSearchAsync(webSearchQuery);
    setWebSearchResults(res);
    setIsSearchingWeb(false);
  };

  const handleImportWebOfferToItem = (itemId, offer) => {
    addPriceToItem(itemId, offer.marketName, offer.price);
  };

  const handleImportAllWebOffersToItem = (itemId, offers) => {
    offers.forEach(off => {
      addPriceToItem(itemId, off.marketName, off.price);
    });
  };

  const handleAutoQuoteItem = async (item) => {
    const res = await executeWebPriceSearchAsync(item.name);
    if (res && res.offers) {
      res.offers.forEach(off => {
        addPriceToItem(item.id, off.marketName, off.price);
      });
    }
  };

  return (
    <div className="grocery-container">
      {/* Header Banner */}
      <div className="card grocery-banner">
        <div className="grocery-banner-content">
          <div className="grocery-badge">
            <Sparkles size={18} />
            <span>Inteligência de Preços & Comparador</span>
          </div>
          <h2>Pesquisa de Mercado & Economia Máxima</h2>
          <p>
            Compare os preços dos supermercados em tempo real, descubra qual mercado possui o menor preço para a sua lista completa e economize dinheiro no orçamento do casal.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary btn-lg" onClick={() => handleOpenWebSearchForTerm('', null)}>
            <Globe size={18} />
            Pesquisar Ofertas na Web
          </button>
          <button className="btn btn-primary btn-lg" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={18} />
            Adicionar Item à Lista
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="card kpi-card accent-income">
          <div className="kpi-header">
            <span className="kpi-title">Itens na Lista</span>
            <div className="kpi-icon">
              <ShoppingCart size={18} />
            </div>
          </div>
          <div className="kpi-value">{groceryMetrics.pendingCount} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/ {groceryMetrics.totalItems} pendentes</span></div>
          <div className="kpi-sub">
            <span>{groceryMetrics.totalItems - groceryMetrics.pendingCount} já no carrinho</span>
          </div>
        </div>

        <div className="card kpi-card accent-invest">
          <div className="kpi-header">
            <span className="kpi-title">Menor Custo Estimado</span>
            <div className="kpi-icon">
              <Tag size={18} />
            </div>
          </div>
          <div className="kpi-value" style={{ color: 'var(--primary)' }}>
            {formatCurrency(groceryMetrics.bestTotal)}
          </div>
          <div className="kpi-sub">
            <span>Comprando nos menores preços</span>
          </div>
        </div>

        <div className="card kpi-card accent-fixed">
          <div className="kpi-header">
            <span className="kpi-title">Economia Máxima</span>
            <div className="kpi-icon">
              <TrendingDown size={18} />
            </div>
          </div>
          <div className="kpi-value" style={{ color: 'var(--success)' }}>
            {formatCurrency(groceryMetrics.totalSavings)}
          </div>
          <div className="kpi-sub">
            <span>Economia em relação aos maiores preços</span>
          </div>
        </div>

        <div className="card kpi-card accent-balance">
          <div className="kpi-header">
            <span className="kpi-title">Mercado Campeão</span>
            <div className="kpi-icon">
              <Award size={18} />
            </div>
          </div>
          <div className="kpi-value" style={{ fontSize: '1.2rem' }}>
            {bestMarketObj ? bestMarketObj.marketName : 'Sem Cotações'}
          </div>
          <div className="kpi-sub">
            <span>
              {bestMarketObj 
                ? `${bestMarketObj.cheapestCount} itens com menor preço` 
                : 'Cadastre preços para comparar'}
            </span>
          </div>
        </div>
      </div>

      {/* Market Recommendation Diagnostic Hero & Strategy */}
      {rankedMarkets.length > 0 && (
        <div className="card market-recommendation-hero">
          <div className="market-recommendation-header">
            <div className="market-hero-title-group">
              <div className="market-hero-icon">
                <Store size={24} />
              </div>
              <div>
                <h3 className="market-hero-name">
                  Supermercado Recomendado: {bestMarketObj ? bestMarketObj.marketName : 'Aguardando cotações'}
                </h3>
                <p className="market-hero-desc">
                  Com base na pesquisa de preços dos seus itens cadastrados, este é o melhor mercado para suas compras.
                </p>
              </div>
            </div>
            {bestMarketObj && (
              <span className="badge badge-success" style={{ padding: '6px 14px', fontSize: '0.82rem' }}>
                <Award size={14} /> Campeão de Economia
              </span>
            )}
          </div>

          {/* Strategy Breakdown Cards */}
          <div className="market-strategy-grid">
            <div className="market-strategy-card highlight">
              <div className="strategy-title">
                <ShieldCheck size={16} style={{ color: 'var(--success)' }} />
                Opção 1: Compra Concentrada (Praticidade)
              </div>
              <div className="strategy-value">
                {formatCurrency(bestMarketObj ? bestMarketObj.total : 0)}
              </div>
              <div className="strategy-sub">
                Compre todos os itens cotados no <strong>{bestMarketObj ? bestMarketObj.marketName : 'mercado selecionado'}</strong>. É a opção mais conveniente para fazer a feira em um único local.
              </div>
            </div>

            <div className="market-strategy-card">
              <div className="strategy-title">
                <TrendingDown size={16} style={{ color: 'var(--info)' }} />
                Opção 2: Rota Multi-Mercados (Economia Máxima)
              </div>
              <div className="strategy-value" style={{ color: 'var(--success)' }}>
                {formatCurrency(groceryMetrics.bestTotal)}
              </div>
              <div className="strategy-sub">
                Compre cada produto no seu menor preço absoluto entre todos os mercados. Economia adicional de <strong>{formatCurrency(groceryMetrics.totalSavings)}</strong>.
              </div>
            </div>
          </div>

          {/* Market Ranking Table */}
          <div style={{ marginTop: '8px' }}>
            <div className="comparison-header" style={{ marginBottom: '8px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text)' }}>
                Ranking Geral dos Supermercados Cotados:
              </span>
              {selectedMarketFilter !== 'ALL' && (
                <button 
                  className="btn btn-ghost btn-xs text-primary"
                  onClick={() => setSelectedMarketFilter('ALL')}
                >
                  Limpar filtro de mercado ({selectedMarketFilter})
                </button>
              )}
            </div>

            <div className="table-wrapper">
              <table className="g440-table">
                <thead>
                  <tr>
                    <th>Ranking</th>
                    <th>Supermercado</th>
                    <th>Itens Cotados</th>
                    <th>Menor Preço em</th>
                    <th>Total Estimado</th>
                    <th>Filtrar</th>
                  </tr>
                </thead>
                <tbody>
                  {rankedMarkets.map((m, idx) => {
                    const isTop = idx === 0;
                    return (
                      <tr key={m.marketName} style={{ background: isTop ? 'rgba(34, 197, 94, 0.05)' : 'transparent' }}>
                        <td>
                          {isTop ? (
                            <span className="badge badge-success">#1 Campeão</span>
                          ) : (
                            <span className="badge badge-subtle">#{idx + 1}</span>
                          )}
                        </td>
                        <td>
                          <strong>{m.marketName}</strong>
                        </td>
                        <td>
                          <span className="badge badge-info">{m.itemCount} produto(s)</span>
                        </td>
                        <td>
                          <strong style={{ color: 'var(--success)' }}>{m.cheapestCount} item(ns)</strong>
                        </td>
                        <td style={{ fontWeight: 800, color: isTop ? 'var(--success)' : 'var(--text)' }}>
                          {formatCurrency(m.total)}
                        </td>
                        <td>
                          <button 
                            className={`btn ${selectedMarketFilter === m.marketName ? 'btn-primary' : 'btn-secondary'} btn-xs`}
                            onClick={() => setSelectedMarketFilter(selectedMarketFilter === m.marketName ? 'ALL' : m.marketName)}
                          >
                            {selectedMarketFilter === m.marketName ? 'Exibindo' : 'Ver Itens'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Toolbar: Search and Filter */}
      <div className="grocery-toolbar">
        <div className="search-box">
          <Search size={16} />
          <input 
            type="text" 
            placeholder="Pesquisar produto e comparar preços (ex: arroz, sabão)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="btn btn-ghost btn-xs" onClick={() => setSearchQuery('')} style={{ padding: '2px 6px' }}>
              <X size={14} />
            </button>
          )}
        </div>

        <div className="filter-box">
          <Filter size={16} />
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="ALL">Todas as Categorias</option>
            {GROCERY_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Live Search Price Comparator Banner when searching */}
      {searchQuery.trim() !== '' && (
        <div className="live-search-comparator">
          <div className="live-search-header">
            <span>Resultados da Pesquisa de Preço para "{searchQuery}":</span>
            <span className="badge badge-info">{filteredItems.length} resultado(s)</span>
          </div>

          {filteredItems.length === 0 ? (
            <p className="text-muted-sm">Nenhum produto encontrado com o termo "{searchQuery}".</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filteredItems.map(item => {
                const { minPrice, bestMarket, prices } = getItemPriceStats(item);
                return (
                  <div key={item.id} className="live-search-item-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong style={{ fontSize: '0.95rem' }}>{item.name}</strong>
                        <span className="badge badge-category" style={{ marginLeft: '8px' }}>{item.category}</span>
                      </div>
                      <span className="text-muted-sm">Qtd: {item.quantity} {item.unit}</span>
                    </div>

                    {prices.length > 0 ? (
                      <div className="price-pills-list">
                        {prices.map((p, pIdx) => {
                          const isMin = Number(p.price) === minPrice;
                          const diff = minPrice ? Number(p.price) - minPrice : 0;
                          const percentDiff = minPrice && minPrice > 0 ? ((diff / minPrice) * 100).toFixed(1) : 0;

                          return (
                            <div key={pIdx} className={`price-pill ${isMin ? 'is-best' : ''}`}>
                              <span className="pill-market">{p.marketName}:</span>
                              <span className="pill-price">{formatCurrency(p.price)}</span>
                              {isMin ? (
                                <span className="pill-badge">Menor Preço</span>
                              ) : (
                                <span style={{ fontSize: '0.68rem', color: 'var(--danger)' }}>
                                  (+{formatCurrency(diff)} / +{percentDiff}%)
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <span className="text-muted-sm">Sem preços cadastrados para este item.</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Grocery Items List */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <ShoppingCart size={20} className="icon-emerald" />
            <span>Itens da Lista & Comparador de Menor Preço</span>
          </div>
          <span className="badge badge-secondary">{filteredItems.length} produto(s)</span>
        </div>

        {filteredItems.length === 0 ? (
          <div className="empty-state">
            <ShoppingCart size={40} />
            <p>Nenhum item encontrado na lista de mercado.</p>
            <button className="btn btn-primary btn-sm" onClick={() => setIsAddModalOpen(true)}>
              <Plus size={14} /> Adicionar Novo Item
            </button>
          </div>
        ) : (
          <div className="grocery-items-grid">
            {filteredItems.map(item => {
              const { minPrice, bestMarket, maxPrice, prices } = getItemPriceStats(item);
              const qty = Number(item.quantity || 1);
              const itemTotal = minPrice ? minPrice * qty : 0;
              const savings = (maxPrice && minPrice && maxPrice > minPrice) ? (maxPrice - minPrice) * qty : 0;

              return (
                <div key={item.id} className={`grocery-item-card ${item.checked ? 'checked-item' : ''}`}>
                  <div className="grocery-item-top">
                    <button 
                      className="btn-checkbox" 
                      onClick={() => toggleGroceryChecked(item.id)}
                      title={item.checked ? 'Marcar como pendente' : 'Marcar como comprado'}
                    >
                      {item.checked ? <CheckCircle size={22} className="check-icon active" /> : <Circle size={22} className="check-icon" />}
                    </button>

                    <div className="grocery-item-info">
                      <div className="grocery-item-title-row">
                        <span className={`item-name ${item.checked ? 'completed' : ''}`}>{item.name}</span>
                        <span className="badge badge-category">{item.category}</span>
                      </div>
                      <div className="grocery-item-qty">
                        Qtd: <strong>{item.quantity} {item.unit}</strong>
                      </div>
                    </div>

                    <div className="grocery-item-actions">
                      <button 
                        className="btn btn-ghost btn-icon text-danger" 
                        onClick={() => deleteGroceryItem(item.id)}
                        title="Remover item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Lowest Price Highlight Box */}
                  <div className="lowest-price-box">
                    <div className="lowest-label">
                      <Tag size={14} />
                      <span>Menor Preço Encontrado:</span>
                    </div>

                    {minPrice !== null ? (
                      <div className="lowest-details">
                        <div className="price-tag-highlight">
                          <span className="price-val">{formatCurrency(minPrice)}</span>
                          <span className="unit-label">/ {item.unit}</span>
                          <span className="market-badge">no <strong>{bestMarket}</strong></span>
                        </div>

                        <div className="lowest-subtotal">
                          <span>Subtotal ({item.quantity}x): </span>
                          <strong>{formatCurrency(itemTotal)}</strong>
                          {savings > 0 && (
                            <span className="savings-tag">
                              (Economia: {formatCurrency(savings)})
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="no-price-alert">
                        <span>Nenhum preço cadastrado ainda.</span>
                      </div>
                    )}
                  </div>

                  {/* Price Comparison Pills */}
                  <div className="item-prices-comparison">
                    <div className="comparison-header">
                      <span>Cotações por Mercado:</span>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button 
                          className="btn btn-ghost btn-xs text-info" 
                          onClick={() => handleOpenWebSearchForTerm(item.name, item.id)}
                          title="Buscar preços na internet"
                        >
                          <Globe size={12} /> Pesquisar Web
                        </button>
                        <button 
                          className="btn btn-ghost btn-xs text-primary" 
                          onClick={() => {
                            setPriceModalItemId(item.id);
                            setMarketInput('');
                            setPriceInput('');
                          }}
                        >
                          <Plus size={12} /> Preço Manual
                        </button>
                      </div>
                    </div>

                    <div className="price-pills-list">
                      {prices.length > 0 ? (
                        prices.map((p, idx) => {
                          const isMin = Number(p.price) === minPrice;
                          return (
                            <div key={idx} className={`price-pill ${isMin ? 'is-best' : ''}`}>
                              <span className="pill-market">{p.marketName}:</span>
                              <span className="pill-price">{formatCurrency(p.price)}</span>
                              {isMin && <span className="pill-badge">Menor</span>}
                              <button 
                                className="pill-remove" 
                                onClick={() => deletePriceFromItem(item.id, p.marketName)}
                                title="Remover este preço"
                              >
                                &times;
                              </button>
                            </div>
                          );
                        })
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
                          <span className="text-muted-sm">Nenhum preço cadastrado para este produto.</span>
                          <button 
                            className="btn btn-secondary btn-xs"
                            onClick={() => handleAutoQuoteItem(item)}
                            style={{ alignSelf: 'flex-start' }}
                          >
                            <Zap size={12} /> Buscar Preços Online Automaticamente
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom Convert to Variable Expense Button */}
                  {minPrice !== null && (
                    <div className="item-footer-action">
                      <button 
                        className="btn btn-secondary btn-sm full-width"
                        onClick={() => convertGroceryToVariableExpense(item.id, 'debit')}
                        title="Marcar como comprado e lançar valor no controle financeiro"
                      >
                        <DollarSign size={14} />
                        Lançar Compra no Financeiro ({formatCurrency(itemTotal)})
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add New Item Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Adicionar Item à Lista de Mercado</h3>
              <button className="btn btn-ghost btn-icon" onClick={() => setIsAddModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleAddItem} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Nome do Produto *</label>
                <input 
                  type="text" 
                  className="form-input"
                  placeholder="Ex: Arroz Tipo 1 5kg, Sabão em Pó..." 
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  required
                />
              </div>

              <div className="form-row-3">
                <div className="form-group">
                  <label className="form-label">Categoria</label>
                  <select 
                    className="form-select"
                    value={newItemCategory} 
                    onChange={(e) => setNewItemCategory(e.target.value)}
                  >
                    {GROCERY_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Quantidade</label>
                  <input 
                    type="number" 
                    min="1"
                    step="1"
                    className="form-input"
                    value={newItemQty}
                    onChange={(e) => setNewItemQty(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Unidade</label>
                  <select className="form-select" value={newItemUnit} onChange={(e) => setNewItemUnit(e.target.value)}>
                    <option value="un">unidade(s)</option>
                    <option value="kg">kg</option>
                    <option value="pacote">pacote</option>
                    <option value="caixa">caixa</option>
                    <option value="kit">kit</option>
                    <option value="litro">litro</option>
                  </select>
                </div>
              </div>

              <div className="form-divider">
                <span>Cotação Inicial (Opcional)</span>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Supermercado</label>
                  <input 
                    type="text" 
                    className="form-input"
                    placeholder="Ex: Assaí, Atacadão, Carrefour" 
                    value={initialMarketName}
                    onChange={(e) => setInitialMarketName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Preço Unitário (R$)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    className="form-input"
                    placeholder="0.00" 
                    value={initialPrice}
                    onChange={(e) => setInitialPrice(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setIsAddModalOpen(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">
                  <Check size={16} /> Salvar Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Price Modal */}
      {priceModalItemId && (
        <div className="modal-overlay" onClick={() => setPriceModalItemId(null)}>
          <div className="modal-content modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Cotação de Preço Manual</h3>
              <button className="btn btn-ghost btn-icon" onClick={() => setPriceModalItemId(null)}>
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleSaveNewPrice} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Nome do Supermercado *</label>
                <input 
                  type="text" 
                  className="form-input"
                  placeholder="Ex: Assaí, Atacadão, Carrefour" 
                  value={marketInput}
                  onChange={(e) => setMarketInput(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Preço neste Mercado (R$) *</label>
                <input 
                  type="number" 
                  step="0.01" 
                  className="form-input"
                  placeholder="0.00" 
                  value={priceInput}
                  onChange={(e) => setPriceInput(e.target.value)}
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setPriceModalItemId(null)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">
                  <Check size={16} /> Salvar Preço
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Web Price Search Modal */}
      {isWebSearchModalOpen && (
        <div className="modal-overlay" onClick={() => setIsWebSearchModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <Globe size={20} className="icon-emerald" />
                <span>Pesquisa de Preços na Internet</span>
              </div>
              <button className="btn btn-ghost btn-icon" onClick={() => setIsWebSearchModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleRunWebSearch} style={{ display: 'flex', gap: '8px' }}>
              <div className="search-box" style={{ flex: 1 }}>
                <Search size={16} />
                <input 
                  type="text" 
                  placeholder="Digite o produto (ex: Arroz, Feijão, Café, Leite, Detergente)..."
                  value={webSearchQuery}
                  onChange={(e) => setWebSearchQuery(e.target.value)}
                  autoFocus
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={isSearchingWeb}>
                {isSearchingWeb ? 'Buscando...' : 'Buscar Ofertas'}
              </button>
            </form>

            {isSearchingWeb ? (
              <div className="empty-state" style={{ padding: '30px 0' }}>
                <Globe size={36} className="spin-icon" style={{ color: 'var(--primary)' }} />
                <p>Consultando ofertas em tempo real em supermercados online...</p>
              </div>
            ) : webSearchResults && webSearchResults.noResults ? (
              <div className="empty-state" style={{ padding: '30px 0' }}>
                <Search size={36} style={{ color: 'var(--text-subtle)' }} />
                <p style={{ fontWeight: 600, margin: '8px 0 4px 0', color: 'var(--text)' }}>
                  Nenhum produto ou oferta encontrada para "{webSearchResults.productName}".
                </p>
                <span className="text-muted-sm" style={{ fontSize: '0.82rem' }}>
                  Verifique se o nome está correto ou tente buscar produtos comuns de supermercado (ex: Arroz 5kg, Feijão, Café, Leite, Detergente, Azeite).
                </span>
              </div>
            ) : webSearchResults ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text)' }}>
                      {webSearchResults.productName}
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                      <span className="badge badge-category">
                        {webSearchResults.category}
                      </span>
                      {webSearchResults.isLive ? (
                        <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Zap size={12} /> Dados Ao Vivo da Internet (Mercado Livre API)
                        </span>
                      ) : (
                        <span className="badge badge-secondary" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <ShieldCheck size={12} /> Referência de Mercado
                        </span>
                      )}
                    </div>
                  </div>

                  {webSearchTargetItemId && (
                    <button 
                      className="btn btn-success btn-sm"
                      onClick={() => {
                        handleImportAllWebOffersToItem(webSearchTargetItemId, webSearchResults.offers);
                        setIsWebSearchModalOpen(false);
                      }}
                    >
                      <Download size={14} /> Importar Cotações na Lista
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    OFERTAS ENCONTRADAS (CLASSIFICADAS PELO MENOR PREÇO):
                  </span>

                  {webSearchResults.offers.map((off, oIdx) => {
                    const isMin = oIdx === 0;
                    return (
                      <div 
                        key={oIdx} 
                        style={{
                          background: isMin ? 'rgba(34, 197, 94, 0.08)' : 'var(--bg-base)',
                          border: `1px solid ${isMin ? 'var(--success)' : 'var(--border-subtle)'}`,
                          borderRadius: 'var(--radius-sm)',
                          padding: '12px 14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '12px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {off.thumbnail && (
                            <img 
                              src={off.thumbnail} 
                              alt={off.title || off.marketName} 
                              style={{ width: '40px', height: '40px', objectFit: 'contain', borderRadius: '4px' }} 
                            />
                          )}
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                              <strong style={{ fontSize: '0.92rem' }}>{off.marketName}</strong>
                              {isMin && <span className="badge badge-success">Menor Preço</span>}
                            </div>
                            {off.title && (
                              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', maxWdith: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {off.title}
                              </div>
                            )}
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '1.15rem', fontWeight: 800, color: isMin ? 'var(--success)' : 'var(--text)' }}>
                            {formatCurrency(off.price)}
                          </span>

                          {off.sourceUrl && off.sourceUrl.startsWith('http') && (
                            <a 
                              href={off.sourceUrl} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="btn btn-ghost btn-icon text-primary"
                              title="Ver produto no site oficial"
                            >
                              <ExternalLink size={14} />
                            </a>
                          )}

                          {webSearchTargetItemId ? (
                            <button 
                              className="btn btn-secondary btn-xs"
                              onClick={() => {
                                handleImportWebOfferToItem(webSearchTargetItemId, off);
                              }}
                            >
                              + Importar
                            </button>
                          ) : (
                            <button 
                              className="btn btn-secondary btn-xs"
                              onClick={() => {
                                addGroceryItem({
                                  name: off.title || webSearchResults.productName,
                                  category: webSearchResults.category,
                                  quantity: 1,
                                  unit: webSearchResults.unit,
                                  prices: [{ marketName: off.marketName, price: off.price }]
                                });
                                setIsWebSearchModalOpen(false);
                              }}
                            >
                              + Adicionar à Lista
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="empty-state" style={{ padding: '30px 0' }}>
                <Globe size={36} style={{ color: 'var(--text-subtle)' }} />
                <p>Digite o nome do produto acima para pesquisar preços nos supermercados online do Brasil.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

