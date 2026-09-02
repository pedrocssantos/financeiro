import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { MONTHS, INITIAL_SETTINGS, INITIAL_DATA, DEFAULT_CATEGORIES } from '../constants';

const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
  // Current month state
  const [activeMonth, setActiveMonth] = useState('SETEMBRO');
  
  // Person filter: 'both' (Casal), 'person1' (Ele), 'person2' (Ela)
  const [activePersonFilter, setActivePersonFilter] = useState('both');

  // Load Settings from LocalStorage
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('g440_finance_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  // Load Categories
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('g440_finance_categories');
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });

  // Load Incomes
  const [incomes, setIncomes] = useState(() => {
    const saved = localStorage.getItem('g440_finance_incomes');
    return saved ? JSON.parse(saved) : INITIAL_DATA.incomes;
  });

  // Load Fixed Expenses
  const [fixedExpenses, setFixedExpenses] = useState(() => {
    const saved = localStorage.getItem('g440_finance_fixed');
    return saved ? JSON.parse(saved) : INITIAL_DATA.fixedExpenses;
  });

  // Load Variable Expenses
  const [variableExpenses, setVariableExpenses] = useState(() => {
    const saved = localStorage.getItem('g440_finance_variable');
    return saved ? JSON.parse(saved) : INITIAL_DATA.variableExpenses;
  });

  // Load Investments
  const [investments, setInvestments] = useState(() => {
    const saved = localStorage.getItem('g440_finance_investments');
    return saved ? JSON.parse(saved) : INITIAL_DATA.investments;
  });

  // Load Installments
  const [installments, setInstallments] = useState(() => {
    const saved = localStorage.getItem('g440_finance_installments');
    return saved ? JSON.parse(saved) : INITIAL_DATA.installments;
  });

  // Load Grocery Items (Lista de Mercado Inteligente)
  const [groceryItems, setGroceryItems] = useState(() => {
    const saved = localStorage.getItem('g440_finance_grocery');
    return saved ? JSON.parse(saved) : INITIAL_DATA.groceryItems;
  });

  // Theme synchronization with body element
  useEffect(() => {
    if (settings.darkMode) {
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
    }
  }, [settings.darkMode]);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('g440_finance_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('g440_finance_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('g440_finance_incomes', JSON.stringify(incomes));
  }, [incomes]);

  useEffect(() => {
    localStorage.setItem('g440_finance_fixed', JSON.stringify(fixedExpenses));
  }, [fixedExpenses]);

  useEffect(() => {
    localStorage.setItem('g440_finance_variable', JSON.stringify(variableExpenses));
  }, [variableExpenses]);

  useEffect(() => {
    localStorage.setItem('g440_finance_investments', JSON.stringify(investments));
  }, [investments]);

  useEffect(() => {
    localStorage.setItem('g440_finance_installments', JSON.stringify(installments));
  }, [installments]);

  useEffect(() => {
    localStorage.setItem('g440_finance_grocery', JSON.stringify(groceryItems));
  }, [groceryItems]);

  // Filter helper based on person view
  const matchesPerson = (itemPerson) => {
    if (activePersonFilter === 'both') return true;
    return itemPerson === activePersonFilter || itemPerson === 'both';
  };

  // Computations for active month
  const monthlyMetrics = useMemo(() => {
    // Current month incomes
    const monthIncomes = incomes.filter(i => (i.month === activeMonth || !i.month) && matchesPerson(i.person));
    const totalIncome = monthIncomes.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

    // Person 1 & Person 2 individual incomes
    const p1Income = incomes.filter(i => (i.month === activeMonth || !i.month) && i.person === 'person1').reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
    const p2Income = incomes.filter(i => (i.month === activeMonth || !i.month) && i.person === 'person2').reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

    // Current month fixed expenses
    const monthFixed = fixedExpenses.filter(f => (f.month === activeMonth || !f.month) && matchesPerson(f.person));
    const totalFixed = monthFixed.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
    const paidFixed = monthFixed.filter(f => f.status === 'paid').reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

    // Current month variable expenses
    const monthVar = variableExpenses.filter(v => (v.month === activeMonth || !v.month) && matchesPerson(v.person));
    const totalVariable = monthVar.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

    const essentialVar = monthVar.filter(v => v.essential).reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
    const nonEssentialVar = monthVar.filter(v => !v.essential).reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

    // Monthly investments contribution
    const totalInvestments = investments.reduce((acc, curr) => acc + Number(curr.monthlyContribution || 0), 0);

    // Installments monthly sum
    const monthInstallments = installments.filter(ins => matchesPerson(ins.person));
    const totalInstallments = monthInstallments.reduce((acc, curr) => acc + Number(curr.monthlyAmount || 0), 0);

    const totalExpenses = totalFixed + totalVariable + totalInstallments;
    const remainingBalance = totalIncome - totalExpenses - totalInvestments;
    const compromisedPercentage = totalIncome > 0 ? ((totalExpenses / totalIncome) * 100).toFixed(1) : 0;

    return {
      monthIncomes,
      totalIncome,
      p1Income,
      p2Income,
      monthFixed,
      totalFixed,
      paidFixed,
      monthVar,
      totalVariable,
      essentialVar,
      nonEssentialVar,
      totalInvestments,
      totalInstallments,
      totalExpenses,
      remainingBalance,
      compromisedPercentage
    };
  }, [activeMonth, activePersonFilter, incomes, fixedExpenses, variableExpenses, investments, installments]);

  // Grocery Metrics Computation
  const groceryMetrics = useMemo(() => {
    let pendingCount = 0;
    let bestTotal = 0;
    let maxTotal = 0;

    const marketCounts = {};

    groceryItems.forEach(item => {
      if (!item.checked) pendingCount++;
      const qty = Number(item.quantity || 1);
      
      if (item.prices && item.prices.length > 0) {
        const validPrices = item.prices.filter(p => p.price && !isNaN(p.price));
        if (validPrices.length > 0) {
          const pricesList = validPrices.map(p => Number(p.price));
          const minP = Math.min(...pricesList);
          const maxP = Math.max(...pricesList);
          
          bestTotal += minP * qty;
          maxTotal += maxP * qty;

          validPrices.forEach(p => {
            const mName = p.marketName;
            if (!marketCounts[mName]) {
              marketCounts[mName] = { cheapestCount: 0, total: 0, itemCount: 0, items: [] };
            }
            marketCounts[mName].itemCount += 1;
            marketCounts[mName].total += Number(p.price) * qty;
            marketCounts[mName].items.push({ name: item.name, price: Number(p.price), qty, isCheapest: Number(p.price) === minP });
            if (Number(p.price) === minP) {
              marketCounts[mName].cheapestCount += 1;
            }
          });
        }
      }
    });

    const totalSavings = maxTotal > bestTotal ? maxTotal - bestTotal : 0;

    const rankedMarkets = Object.entries(marketCounts)
      .map(([mName, data]) => ({
        marketName: mName,
        ...data
      }))
      .sort((a, b) => b.cheapestCount - a.cheapestCount || a.total - b.total);

    const bestMarketObj = rankedMarkets.length > 0 ? rankedMarkets[0] : null;

    return {
      pendingCount,
      totalItems: groceryItems.length,
      bestTotal,
      maxTotal,
      totalSavings,
      marketCounts,
      rankedMarkets,
      bestMarketObj
    };
  }, [groceryItems]);

  // CRUD Functions
  const addIncome = (incomeData) => {
    const newItem = { ...incomeData, id: 'inc-' + Date.now() };
    setIncomes(prev => [newItem, ...prev]);
  };

  const deleteIncome = (id) => {
    setIncomes(prev => prev.filter(i => i.id !== id));
  };

  const addFixedExpense = (fixedData) => {
    const newItem = { ...fixedData, id: 'fix-' + Date.now(), status: fixedData.status || 'pending' };
    setFixedExpenses(prev => [newItem, ...prev]);
  };

  const toggleFixedStatus = (id) => {
    setFixedExpenses(prev => prev.map(f => f.id === id ? { ...f, status: f.status === 'paid' ? 'pending' : 'paid' } : f));
  };

  const deleteFixedExpense = (id) => {
    setFixedExpenses(prev => prev.filter(f => f.id !== id));
  };

  const addVariableExpense = (varData) => {
    const newItem = { ...varData, id: 'var-' + Date.now() };
    setVariableExpenses(prev => [newItem, ...prev]);
  };

  const deleteVariableExpense = (id) => {
    setVariableExpenses(prev => prev.filter(v => v.id !== id));
  };

  const addInvestment = (invData) => {
    const newItem = { ...invData, id: 'inv-' + Date.now() };
    setInvestments(prev => [newItem, ...prev]);
  };

  const updateInvestmentAmount = (id, amount) => {
    setInvestments(prev => prev.map(inv => inv.id === id ? { ...inv, currentAmount: Number(amount) } : inv));
  };

  const deleteInvestment = (id) => {
    setInvestments(prev => prev.filter(inv => inv.id !== id));
  };

  const addInstallment = (insData) => {
    const newItem = { ...insData, id: 'ins-' + Date.now() };
    setInstallments(prev => [newItem, ...prev]);
  };

  const deleteInstallment = (id) => {
    setInstallments(prev => prev.filter(ins => ins.id !== id));
  };

  // Grocery Item CRUD
  const addGroceryItem = (itemData) => {
    const newItem = {
      id: 'g-' + Date.now(),
      name: itemData.name,
      category: itemData.category || 'Grãos & Cereais',
      quantity: Number(itemData.quantity) || 1,
      unit: itemData.unit || 'un',
      checked: false,
      prices: itemData.prices || []
    };
    setGroceryItems(prev => [newItem, ...prev]);
  };

  const updateGroceryItem = (id, updatedItem) => {
    setGroceryItems(prev => prev.map(g => g.id === id ? { ...g, ...updatedItem } : g));
  };

  const deleteGroceryItem = (id) => {
    setGroceryItems(prev => prev.filter(g => g.id !== id));
  };

  const toggleGroceryChecked = (id) => {
    setGroceryItems(prev => prev.map(g => g.id === id ? { ...g, checked: !g.checked } : g));
  };

  const addPriceToItem = (itemId, marketName, price) => {
    if (!marketName || !price) return;
    setGroceryItems(prev => prev.map(g => {
      if (g.id !== itemId) return g;
      const existingPrices = g.prices ? [...g.prices] : [];
      const index = existingPrices.findIndex(p => p.marketName.toLowerCase() === marketName.toLowerCase());
      if (index >= 0) {
        existingPrices[index] = { marketName, price: Number(price) };
      } else {
        existingPrices.push({ marketName, price: Number(price) });
      }
      return { ...g, prices: existingPrices };
    }));
  };

  const deletePriceFromItem = (itemId, marketName) => {
    setGroceryItems(prev => prev.map(g => {
      if (g.id !== itemId) return g;
      return {
        ...g,
        prices: (g.prices || []).filter(p => p.marketName.toLowerCase() !== marketName.toLowerCase())
      };
    }));
  };

  const convertGroceryToVariableExpense = (itemId, paymentMethod = 'debit') => {
    const item = groceryItems.find(g => g.id === itemId);
    if (!item || !item.prices || item.prices.length === 0) return;

    const minPriceObj = item.prices.reduce((min, p) => Number(p.price) < Number(min.price) ? p : min, item.prices[0]);
    const totalCost = Number(minPriceObj.price) * Number(item.quantity || 1);

    addVariableExpense({
      month: activeMonth === 'ANNUAL_SUMMARY' ? 'SETEMBRO' : activeMonth,
      description: `Compra: ${item.name} (${item.quantity} ${item.unit} no ${minPriceObj.marketName})`,
      amount: totalCost,
      date: new Date().toISOString().slice(0, 10),
      category: 'Supermercado',
      paymentMethod,
      essential: true,
      person: 'both'
    });

    toggleGroceryChecked(itemId);
  };

  const addCategory = (categoryData) => {
    const newCat = { ...categoryData, id: 'cat-' + Date.now() };
    setCategories(prev => [...prev, newCat]);
  };

  const resetAllData = () => {
    if (window.confirm('Tem certeza que deseja restaurar os dados iniciais de demonstração?')) {
      setIncomes(INITIAL_DATA.incomes);
      setFixedExpenses(INITIAL_DATA.fixedExpenses);
      setVariableExpenses(INITIAL_DATA.variableExpenses);
      setInvestments(INITIAL_DATA.investments);
      setInstallments(INITIAL_DATA.installments);
      setGroceryItems(INITIAL_DATA.groceryItems);
      setSettings(INITIAL_SETTINGS);
      setCategories(DEFAULT_CATEGORIES);
    }
  };

  const exportBackupJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      settings, categories, incomes, fixedExpenses, variableExpenses, investments, installments, groceryItems
    }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `financas_casal_backup_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importBackupJSON = (jsonObj) => {
    try {
      if (jsonObj.settings) setSettings(jsonObj.settings);
      if (jsonObj.categories) setCategories(jsonObj.categories);
      if (jsonObj.incomes) setIncomes(jsonObj.incomes);
      if (jsonObj.fixedExpenses) setFixedExpenses(jsonObj.fixedExpenses);
      if (jsonObj.variableExpenses) setVariableExpenses(jsonObj.variableExpenses);
      if (jsonObj.investments) setInvestments(jsonObj.investments);
      if (jsonObj.installments) setInstallments(jsonObj.installments);
      if (jsonObj.groceryItems) setGroceryItems(jsonObj.groceryItems);
      alert('Dados importados com sucesso!');
    } catch (e) {
      alert('Erro ao importar arquivo JSON.');
    }
  };

  return (
    <FinanceContext.Provider value={{
      activeMonth, setActiveMonth,
      activePersonFilter, setActivePersonFilter,
      settings, setSettings,
      categories, setCategories,
      incomes, fixedExpenses, variableExpenses, investments, installments, groceryItems,
      monthlyMetrics, groceryMetrics,
      addIncome, deleteIncome,
      addFixedExpense, toggleFixedStatus, deleteFixedExpense,
      addVariableExpense, deleteVariableExpense,
      addInvestment, updateInvestmentAmount, deleteInvestment,
      addInstallment, deleteInstallment,
      addGroceryItem, updateGroceryItem, deleteGroceryItem, toggleGroceryChecked,
      addPriceToItem, deletePriceFromItem, convertGroceryToVariableExpense,
      addCategory, resetAllData, exportBackupJSON, importBackupJSON
    }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => useContext(FinanceContext);
