export const MONTHS = [
  'JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL',
  'MAIO', 'JUNHO', 'JULHO', 'AGOSTO',
  'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'
];

export const PAYMENT_METHODS = [
  { id: 'pix', label: 'Dinheiro / Pix' },
  { id: 'credit', label: 'Crédito' },
  { id: 'debit', label: 'Débito' },
  { id: 'voucher', label: 'Vale' },
  { id: 'boleto', label: 'Boleto' }
];

export const DEFAULT_CATEGORIES = [
  { id: 'supermercado', label: 'Supermercado', color: '#22c55e' },
  { id: 'alimentacao', label: 'Alimentação', color: '#f59e0b' },
  { id: 'moradia', label: 'Moradia', color: '#06b6d4' },
  { id: 'transporte', label: 'Transporte', color: '#a855f7' },
  { id: 'lazer', label: 'Lazer', color: '#ec4899' },
  { id: 'pessoal', label: 'Gastos Pessoais', color: '#3b82f6' },
  { id: 'saude', label: 'Saúde e bem-estar', color: '#10b981' },
  { id: 'assinaturas', label: 'Assinaturas', color: '#6366f1' },
  { id: 'servicos', label: 'Serviços domésticos', color: '#eab308' },
  { id: 'parcelamentos', label: 'Parcelamentos', color: '#f43f5e' },
  { id: 'mensalidades', label: 'Mensalidades', color: '#8b5cf6' },
  { id: 'presentes', label: 'Presentes', color: '#f472b6' },
  { id: 'pets', label: 'Pets', color: '#fb923c' },
  { id: 'outros', label: 'Outros', color: '#94a3b8' }
];

export const PERSON_OPTIONS = [
  { id: 'both', label: 'Casal (Ambos)' },
  { id: 'person1', label: 'Máximo' },
  { id: 'person2', label: 'Namorada' }
];

export const INITIAL_SETTINGS = {
  person1Name: 'Máximo',
  person2Name: 'Namorada',
  currency: 'BRL',
  splitMethod: '50-50', // '50-50' or 'proportional'
  darkMode: true
};

export const GROCERY_CATEGORIES = [
  'Grãos & Cereais',
  'Laticínios',
  'Matinais',
  'Carnes & Aves',
  'Hortifrúti',
  'Limpeza',
  'Higiene Pessoal',
  'Temperos & Óleos',
  'Bebidas',
  'Biscoitos & Snacks',
  'Outros'
];

// Initial realistic data preloaded so the application looks populated on first open
export const INITIAL_DATA = {
  incomes: [
    { id: 'inc-1', month: 'SETEMBRO', description: 'Salário Máximo', amount: 5500, category: 'Salário', person: 'person1', date: '2026-09-01' },
    { id: 'inc-2', month: 'SETEMBRO', description: 'Salário Namorada', amount: 4800, category: 'Salário', person: 'person2', date: '2026-09-01' },
    { id: 'inc-3', month: 'SETEMBRO', description: 'Projeto Freelance', amount: 1200, category: 'Extra', person: 'person1', date: '2026-09-10' }
  ],
  fixedExpenses: [
    { id: 'fix-1', month: 'SETEMBRO', description: 'Aluguel & Condomínio', amount: 2400, dueDay: 10, category: 'Moradia', paymentMethod: 'pix', person: 'both', status: 'paid' },
    { id: 'fix-2', month: 'SETEMBRO', description: 'Internet Fibra', amount: 120, dueDay: 15, category: 'Assinaturas', paymentMethod: 'pix', person: 'both', status: 'paid' },
    { id: 'fix-3', month: 'SETEMBRO', description: 'Energia Elétrica', amount: 280, dueDay: 20, category: 'Serviços domésticos', paymentMethod: 'boleto', person: 'both', status: 'pending' },
    { id: 'fix-4', month: 'SETEMBRO', description: 'Academia Casal', amount: 220, dueDay: 5, category: 'Mensalidades', paymentMethod: 'credit', person: 'both', status: 'paid' },
    { id: 'fix-5', month: 'SETEMBRO', description: 'Plano de Saúde', amount: 650, dueDay: 12, category: 'Saúde e bem-estar', paymentMethod: 'boleto', person: 'both', status: 'paid' }
  ],
  variableExpenses: [
    { id: 'var-1', month: 'SETEMBRO', description: 'Supermercado Mensal', amount: 1150, date: '2026-09-03', category: 'Supermercado', paymentMethod: 'debit', essential: true, person: 'both' },
    { id: 'var-2', month: 'SETEMBRO', description: 'Jantar de Fim de Semana', amount: 180, date: '2026-09-05', category: 'Alimentação', paymentMethod: 'credit', essential: false, person: 'both' },
    { id: 'var-3', month: 'SETEMBRO', description: 'Combustível Carro', amount: 250, date: '2026-09-06', category: 'Transporte', paymentMethod: 'credit', essential: true, person: 'both' },
    { id: 'var-4', month: 'SETEMBRO', description: 'Consulta Veterinária Pipoca', amount: 160, date: '2026-09-08', category: 'Pets', paymentMethod: 'pix', essential: true, person: 'both' },
    { id: 'var-5', month: 'SETEMBRO', description: 'Ingressos Cinema', amount: 90, date: '2026-09-12', category: 'Lazer', paymentMethod: 'credit', essential: false, person: 'both' }
  ],
  investments: [
    { id: 'inv-1', name: 'Reserva de Emergência Casal', currentAmount: 18500, targetAmount: 30000, monthlyContribution: 1000, category: 'Reserva' },
    { id: 'inv-2', name: 'Viagem de Fim de Ano', currentAmount: 6200, targetAmount: 10000, monthlyContribution: 800, category: 'Meta' },
    { id: 'inv-3', name: 'Investimentos em Ações/FIIs', currentAmount: 14200, targetAmount: 50000, monthlyContribution: 600, category: 'Investimento' }
  ],
  installments: [
    { id: 'ins-1', description: 'Notebook / Computador', totalValue: 4800, currentInstallment: 4, totalInstallments: 10, monthlyAmount: 480, person: 'person1' },
    { id: 'ins-2', description: 'Sofá da Sala', totalValue: 2400, currentInstallment: 2, totalInstallments: 6, monthlyAmount: 400, person: 'both' }
  ],
  groceryItems: [
    {
      id: 'g-1',
      name: 'Arroz Tipo 1 5kg',
      category: 'Grãos & Cereais',
      quantity: 2,
      unit: 'pacote',
      checked: false,
      prices: [
        { marketName: 'Atacadão', price: 21.90 },
        { marketName: 'Assaí Atacadista', price: 23.50 },
        { marketName: 'Carrefour', price: 26.90 },
        { marketName: 'Mercado do Bairro', price: 28.50 }
      ]
    },
    {
      id: 'g-2',
      name: 'Feijão Carioca 1kg',
      category: 'Grãos & Cereais',
      quantity: 3,
      unit: 'kg',
      checked: false,
      prices: [
        { marketName: 'Assaí Atacadista', price: 6.80 },
        { marketName: 'Atacadão', price: 7.20 },
        { marketName: 'Carrefour', price: 8.50 }
      ]
    },
    {
      id: 'g-3',
      name: 'Café Torrado 500g',
      category: 'Matinais',
      quantity: 2,
      unit: 'pacote',
      checked: false,
      prices: [
        { marketName: 'Carrefour', price: 16.90 },
        { marketName: 'Assaí Atacadista', price: 14.50 },
        { marketName: 'Atacadão', price: 13.90 }
      ]
    },
    {
      id: 'g-4',
      name: 'Leite Integral 1L (Caixa c/ 12)',
      category: 'Laticínios',
      quantity: 1,
      unit: 'caixa',
      checked: false,
      prices: [
        { marketName: 'Assaí Atacadista', price: 54.00 },
        { marketName: 'Atacadão', price: 56.40 },
        { marketName: 'Carrefour', price: 62.90 }
      ]
    },
    {
      id: 'g-5',
      name: 'Azeite de Oliva Extra Virgem 500ml',
      category: 'Temperos & Óleos',
      quantity: 2,
      unit: 'un',
      checked: false,
      prices: [
        { marketName: 'Atacadão', price: 34.90 },
        { marketName: 'Assaí Atacadista', price: 36.90 },
        { marketName: 'Carrefour', price: 42.00 }
      ]
    },
    {
      id: 'g-6',
      name: 'Detergente Líquido 500ml (Kit 5)',
      category: 'Limpeza',
      quantity: 1,
      unit: 'kit',
      checked: true,
      prices: [
        { marketName: 'Assaí Atacadista', price: 11.50 },
        { marketName: 'Atacadão', price: 12.00 },
        { marketName: 'Mercado do Bairro', price: 14.90 }
      ]
    }
  ]
};

// Realistic Online Supermarket Price Database (Brazil) for automated price comparison
export const ONLINE_MARKET_DATABASE = [
  {
    keywords: ['arroz', 'arroz 5kg', 'arroz tipo 1'],
    name: 'Arroz Tipo 1 5kg',
    category: 'Grãos & Cereais',
    unit: 'pacote',
    offers: [
      { marketName: 'Atacadão', price: 21.90, sourceUrl: 'atacadao.com.br' },
      { marketName: 'Assaí Atacadista', price: 22.50, sourceUrl: 'assai.com.br' },
      { marketName: 'Carrefour', price: 26.90, sourceUrl: 'carrefour.com.br' },
      { marketName: 'Pão de Açúcar', price: 29.90, sourceUrl: 'paodeacucar.com' },
      { marketName: 'Mercado Livre Super', price: 24.90, sourceUrl: 'mercadolivre.com.br' }
    ]
  },
  {
    keywords: ['feijao', 'feijão', 'feijão carioca', 'feijao 1kg'],
    name: 'Feijão Carioca 1kg',
    category: 'Grãos & Cereais',
    unit: 'kg',
    offers: [
      { marketName: 'Assaí Atacadista', price: 6.49, sourceUrl: 'assai.com.br' },
      { marketName: 'Atacadão', price: 6.90, sourceUrl: 'atacadao.com.br' },
      { marketName: 'Mercado Livre Super', price: 7.20, sourceUrl: 'mercadolivre.com.br' },
      { marketName: 'Carrefour', price: 8.50, sourceUrl: 'carrefour.com.br' }
    ]
  },
  {
    keywords: ['cafe', 'café', 'café torrado', 'cafe 500g'],
    name: 'Café Torrado e Moído 500g',
    category: 'Matinais',
    unit: 'pacote',
    offers: [
      { marketName: 'Atacadão', price: 13.90, sourceUrl: 'atacadao.com.br' },
      { marketName: 'Assaí Atacadista', price: 14.50, sourceUrl: 'assai.com.br' },
      { marketName: 'Carrefour', price: 16.90, sourceUrl: 'carrefour.com.br' },
      { marketName: 'Pão de Açúcar', price: 18.90, sourceUrl: 'paodeacucar.com' }
    ]
  },
  {
    keywords: ['leite', 'leite integral', 'leite caixa', 'leite 1l'],
    name: 'Leite Integral 1L (Caixa c/ 12)',
    category: 'Laticínios',
    unit: 'caixa',
    offers: [
      { marketName: 'Assaí Atacadista', price: 53.90, sourceUrl: 'assai.com.br' },
      { marketName: 'Atacadão', price: 55.20, sourceUrl: 'atacadao.com.br' },
      { marketName: 'Carrefour', price: 61.90, sourceUrl: 'carrefour.com.br' }
    ]
  },
  {
    keywords: ['oleo', 'óleo', 'óleo de soja', 'oleo de soja'],
    name: 'Óleo de Soja 900ml',
    category: 'Temperos & Óleos',
    unit: 'un',
    offers: [
      { marketName: 'Atacadão', price: 5.89, sourceUrl: 'atacadao.com.br' },
      { marketName: 'Assaí Atacadista', price: 5.99, sourceUrl: 'assai.com.br' },
      { marketName: 'Carrefour', price: 6.79, sourceUrl: 'carrefour.com.br' }
    ]
  },
  {
    keywords: ['açucar', 'acucar', 'açúcar refinado'],
    name: 'Açúcar Refinado 1kg',
    category: 'Grãos & Cereais',
    unit: 'kg',
    offers: [
      { marketName: 'Assaí Atacadista', price: 3.99, sourceUrl: 'assai.com.br' },
      { marketName: 'Atacadão', price: 4.19, sourceUrl: 'atacadao.com.br' },
      { marketName: 'Carrefour', price: 4.89, sourceUrl: 'carrefour.com.br' }
    ]
  },
  {
    keywords: ['azeite', 'azeite extra virgem', 'azeite 500ml'],
    name: 'Azeite de Oliva Extra Virgem 500ml',
    category: 'Temperos & Óleos',
    unit: 'un',
    offers: [
      { marketName: 'Atacadão', price: 34.90, sourceUrl: 'atacadao.com.br' },
      { marketName: 'Assaí Atacadista', price: 36.50, sourceUrl: 'assai.com.br' },
      { marketName: 'Carrefour', price: 41.90, sourceUrl: 'carrefour.com.br' },
      { marketName: 'Pão de Açúcar', price: 44.90, sourceUrl: 'paodeacucar.com' }
    ]
  },
  {
    keywords: ['detergente', 'detergente liquido', 'ype'],
    name: 'Detergente Líquido 500ml (Kit 5)',
    category: 'Limpeza',
    unit: 'kit',
    offers: [
      { marketName: 'Assaí Atacadista', price: 11.20, sourceUrl: 'assai.com.br' },
      { marketName: 'Atacadão', price: 11.80, sourceUrl: 'atacadao.com.br' },
      { marketName: 'Mercado Livre Super', price: 12.50, sourceUrl: 'mercadolivre.com.br' }
    ]
  },
  {
    keywords: ['sabao', 'sabão em pó', 'omo', 'ypê'],
    name: 'Sabão em Pó 1.6kg',
    category: 'Limpeza',
    unit: 'un',
    offers: [
      { marketName: 'Atacadão', price: 18.90, sourceUrl: 'atacadao.com.br' },
      { marketName: 'Assaí Atacadista', price: 19.50, sourceUrl: 'assai.com.br' },
      { marketName: 'Carrefour', price: 23.90, sourceUrl: 'carrefour.com.br' }
    ]
  },
  {
    keywords: ['papel', 'papel higienico', 'papel higiênico'],
    name: 'Papel Higiênico Folha Dupla 12 rolos',
    category: 'Higiene Pessoal',
    unit: 'pacote',
    offers: [
      { marketName: 'Assaí Atacadista', price: 15.90, sourceUrl: 'assai.com.br' },
      { marketName: 'Atacadão', price: 16.50, sourceUrl: 'atacadao.com.br' },
      { marketName: 'Mercado Livre Super', price: 17.90, sourceUrl: 'mercadolivre.com.br' }
    ]
  },
  {
    keywords: ['carne', 'alcatra', 'contra file', 'frango'],
    name: 'Filé de Peito de Frango 1kg',
    category: 'Carnes & Aves',
    unit: 'kg',
    offers: [
      { marketName: 'Atacadão', price: 17.90, sourceUrl: 'atacadao.com.br' },
      { marketName: 'Assaí Atacadista', price: 18.50, sourceUrl: 'assai.com.br' },
      { marketName: 'Carrefour', price: 21.90, sourceUrl: 'carrefour.com.br' }
    ]
  },
  {
    keywords: ['desodorante', 'desodorante aerosol', 'rexona', 'nivea', 'dove desodorante'],
    name: 'Desodorante Aerosol 150ml',
    category: 'Higiene Pessoal',
    unit: 'un',
    offers: [
      { marketName: 'Assaí Atacadista', price: 13.90, sourceUrl: 'assai.com.br' },
      { marketName: 'Atacadão', price: 14.50, sourceUrl: 'atacadao.com.br' },
      { marketName: 'Carrefour', price: 16.90, sourceUrl: 'carrefour.com.br' },
      { marketName: 'Pão de Açúcar', price: 18.50, sourceUrl: 'paodeacucar.com' }
    ]
  },
  {
    keywords: ['sabonete', 'sabonete em barra', 'dove', 'lux', 'palmolive'],
    name: 'Sabonete em Barra 84g (Kit 6)',
    category: 'Higiene Pessoal',
    unit: 'kit',
    offers: [
      { marketName: 'Assaí Atacadista', price: 12.90, sourceUrl: 'assai.com.br' },
      { marketName: 'Atacadão', price: 13.50, sourceUrl: 'atacadao.com.br' },
      { marketName: 'Carrefour', price: 15.90, sourceUrl: 'carrefour.com.br' }
    ]
  },
  {
    keywords: ['shampoo', 'xampu', 'condicionador', 'elseve', 'seda'],
    name: 'Shampoo 325ml',
    category: 'Higiene Pessoal',
    unit: 'un',
    offers: [
      { marketName: 'Atacadão', price: 11.90, sourceUrl: 'atacadao.com.br' },
      { marketName: 'Assaí Atacadista', price: 12.50, sourceUrl: 'assai.com.br' },
      { marketName: 'Carrefour', price: 14.90, sourceUrl: 'carrefour.com.br' }
    ]
  },
  {
    keywords: ['creme dental', 'pasta de dente', 'colgate', 'sorriso'],
    name: 'Creme Dental Colgate 90g (Pack c/ 4)',
    category: 'Higiene Pessoal',
    unit: 'pack',
    offers: [
      { marketName: 'Assaí Atacadista', price: 10.90, sourceUrl: 'assai.com.br' },
      { marketName: 'Atacadão', price: 11.20, sourceUrl: 'atacadao.com.br' },
      { marketName: 'Carrefour', price: 13.50, sourceUrl: 'carrefour.com.br' }
    ]
  },
  {
    keywords: ['refrigerante', 'coca cola', 'coca-cola', 'guarana'],
    name: 'Refrigerante Coca-Cola 2L (Pack 2)',
    category: 'Bebidas',
    unit: 'pack',
    offers: [
      { marketName: 'Assaí Atacadista', price: 16.90, sourceUrl: 'assai.com.br' },
      { marketName: 'Atacadão', price: 17.50, sourceUrl: 'atacadao.com.br' },
      { marketName: 'Carrefour', price: 19.90, sourceUrl: 'carrefour.com.br' }
    ]
  },
  {
    keywords: ['cerveja', 'heineken', 'amstel', 'skol', 'brahma'],
    name: 'Cerveja Heineken 350ml (Lata Pack 12)',
    category: 'Bebidas',
    unit: 'pack',
    offers: [
      { marketName: 'Atacadão', price: 56.90, sourceUrl: 'atacadao.com.br' },
      { marketName: 'Assaí Atacadista', price: 58.50, sourceUrl: 'assai.com.br' },
      { marketName: 'Carrefour', price: 64.90, sourceUrl: 'carrefour.com.br' }
    ]
  },
  {
    keywords: ['biscoito', 'bolacha', 'passatempo', 'nestle'],
    name: 'Biscoito Recheado 130g (Kit c/ 3)',
    category: 'Biscoitos & Snacks',
    unit: 'kit',
    offers: [
      { marketName: 'Assaí Atacadista', price: 7.90, sourceUrl: 'assai.com.br' },
      { marketName: 'Atacadão', price: 8.20, sourceUrl: 'atacadao.com.br' },
      { marketName: 'Carrefour', price: 9.90, sourceUrl: 'carrefour.com.br' }
    ]
  },
  {
    keywords: ['margarina', 'qualy', 'claybom', 'manteiga'],
    name: 'Margarina Qualy c/ Sal 500g',
    category: 'Laticínios',
    unit: 'un',
    offers: [
      { marketName: 'Assaí Atacadista', price: 7.49, sourceUrl: 'assai.com.br' },
      { marketName: 'Atacadão', price: 7.89, sourceUrl: 'atacadao.com.br' },
      { marketName: 'Carrefour', price: 8.90, sourceUrl: 'carrefour.com.br' }
    ]
  },
  {
    keywords: ['requeijao', 'requeijão', 'danone', 'itambé'],
    name: 'Requeijão Cremoso 200g',
    category: 'Laticínios',
    unit: 'un',
    offers: [
      { marketName: 'Assaí Atacadista', price: 6.90, sourceUrl: 'assai.com.br' },
      { marketName: 'Atacadão', price: 7.20, sourceUrl: 'atacadao.com.br' },
      { marketName: 'Carrefour', price: 8.50, sourceUrl: 'carrefour.com.br' }
    ]
  },
  {
    keywords: ['banana', 'maca', 'maçã', 'tomate', 'batata', 'cebola', 'fruta'],
    name: 'Banana Prata 1kg',
    category: 'Hortifrúti',
    unit: 'kg',
    offers: [
      { marketName: 'Assaí Atacadista', price: 5.90, sourceUrl: 'assai.com.br' },
      { marketName: 'Atacadão', price: 6.20, sourceUrl: 'atacadao.com.br' },
      { marketName: 'Carrefour', price: 7.90, sourceUrl: 'carrefour.com.br' }
    ]
  },
  {
    keywords: ['amaciante', 'downy', 'ypê', 'comfort'],
    name: 'Amaciante Concentrado 1.5L',
    category: 'Limpeza',
    unit: 'un',
    offers: [
      { marketName: 'Assaí Atacadista', price: 17.90, sourceUrl: 'assai.com.br' },
      { marketName: 'Atacadão', price: 18.50, sourceUrl: 'atacadao.com.br' },
      { marketName: 'Carrefour', price: 21.90, sourceUrl: 'carrefour.com.br' }
    ]
  }
];

