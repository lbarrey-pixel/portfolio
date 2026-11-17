import type { Locale } from '../../i18n/locales';

export interface MenuItem {
  id: string;
  name: string;
  detail: string;
  price: number;
  /** which drawing of the flan to use */
  tone: '' | 'b' | 'c' | 'd';
}

export interface BakeryStrings {
  menu: MenuItem[];
  shop: string;
  open: string;
  section: string;
  /** {name} */
  add: string;
  /** {n} */
  viewOrderOne: string;
  /** {n} */
  viewOrderMany: string;
  back: string;
  yourOrder: string;
  cepLabel: string;
  cepPlaceholder: string;
  useExample: string;
  exampleCep: string;
  street: string;
  district: string;
  /** {km} */
  distance: string;
  numberLabel: string;
  numberPlaceholder: string;
  noNumber: string;
  calc: string;
  items: string;
  delivery: string;
  calcAbove: string;
  total: string;
  plusDelivery: string;
  cepMessage: string;
  pay: string;
  pixTitle: string;
  orderNo: string;
  qrLabel: string;
  pixHelp: string;
  simulate: string;
  waiting: string;
  paidTitle: string;
  paidText: string;
  ownerIntro: string;
  paidPill: string;
  customer: string;
  newOrder: string;
}

// Prices are the same in both languages (BRL); only the words change.
const PRICES = { ch: 19.9, dl: 19.9, lc: 17.9, pn: 21.9, fa: 89.9 } as const;

export const strings: Record<Locale, BakeryStrings> = {
  'pt-br': {
    menu: [
      { id: 'ch', name: 'Pudim de Churros', detail: 'Individual · 130 g', price: PRICES.ch, tone: '' },
      { id: 'dl', name: 'Pudim de Doce de Leite', detail: 'Individual · 130 g', price: PRICES.dl, tone: 'b' },
      { id: 'lc', name: 'Pudim de Leite Condensado', detail: 'Individual · 130 g', price: PRICES.lc, tone: 'c' },
      { id: 'pn', name: 'Pudim de Panetone', detail: 'Individual · edição de Natal', price: PRICES.pn, tone: 'd' },
      { id: 'fa', name: 'Pudim Família', detail: 'Inteiro · serve 8', price: PRICES.fa, tone: 'c' },
    ],
    shop: 'Confeitaria Artesanal',
    open: '● Aberto até meia-noite',
    section: 'Pudins',
    add: 'Adicionar {name}',
    viewOrderOne: 'Ver pedido ({n} item)',
    viewOrderMany: 'Ver pedido ({n} itens)',
    back: '← Cardápio',
    yourOrder: 'Seu pedido',
    cepLabel: 'CEP para entrega',
    cepPlaceholder: '00000-000',
    useExample: 'Usar CEP de exemplo',
    exampleCep: '88010-000',
    street: 'Rua das Flores (exemplo)',
    district: 'Centro',
    distance: '{km} km da loja',
    numberLabel: 'Número',
    numberPlaceholder: 'Ex.: 120',
    noNumber: 's/n',
    calc: 'Calcular entrega',
    items: 'Itens',
    delivery: 'Entrega',
    calcAbove: 'calcule acima',
    total: 'Total',
    plusDelivery: ' + entrega',
    cepMessage: 'Digite os 8 números do CEP ou use o de exemplo.',
    pay: 'Fazer pedido e pagar com Pix',
    pixTitle: 'Pague com Pix',
    orderNo: 'Pedido nº 13',
    qrLabel: 'QR Code de exemplo',
    pixHelp: 'Copie o código ou leia o QR no app do banco. O pedido confirma sozinho.',
    simulate: 'Simular pagamento',
    waiting: 'Aguardando o banco…',
    paidTitle: 'Pagamento confirmado.',
    paidText: 'Seu pedido já está na cozinha. Entrega a partir das 19:40.',
    ownerIntro: 'Assim ele aparece no painel do dono:',
    paidPill: 'Pago',
    customer: 'Cliente de exemplo · (00) 90000-0000',
    newOrder: 'Fazer outro pedido',
  },
  en: {
    menu: [
      { id: 'ch', name: 'Churros Flan', detail: 'Single · 130 g', price: PRICES.ch, tone: '' },
      { id: 'dl', name: 'Dulce de Leche Flan', detail: 'Single · 130 g', price: PRICES.dl, tone: 'b' },
      { id: 'lc', name: 'Condensed Milk Flan', detail: 'Single · 130 g', price: PRICES.lc, tone: 'c' },
      { id: 'pn', name: 'Panettone Flan', detail: 'Single · Christmas edition', price: PRICES.pn, tone: 'd' },
      { id: 'fa', name: 'Family Flan', detail: 'Whole · serves 8', price: PRICES.fa, tone: 'c' },
    ],
    shop: 'Artisan Bakery',
    open: '● Open until midnight',
    section: 'Flans',
    add: 'Add {name}',
    viewOrderOne: 'View order ({n} item)',
    viewOrderMany: 'View order ({n} items)',
    back: '← Menu',
    yourOrder: 'Your order',
    cepLabel: 'Postal code (CEP) for delivery',
    cepPlaceholder: '00000-000',
    useExample: 'Use the sample postal code',
    exampleCep: '88010-000',
    street: 'Rua das Flores (sample)',
    district: 'Centro',
    distance: '{km} km from the store',
    numberLabel: 'Street number',
    numberPlaceholder: 'e.g. 120',
    noNumber: 'no number',
    calc: 'Calculate delivery',
    items: 'Items',
    delivery: 'Delivery',
    calcAbove: 'calculate above',
    total: 'Total',
    plusDelivery: ' + delivery',
    cepMessage: 'Enter all 8 digits of the postal code, or use the sample one.',
    pay: 'Place order and pay by Pix',
    pixTitle: 'Pay by Pix',
    orderNo: 'Order no. 13',
    qrLabel: 'Sample QR code',
    pixHelp: 'Copy the code or scan the QR in your banking app. The order confirms by itself.',
    simulate: 'Simulate payment',
    waiting: 'Waiting for the bank…',
    paidTitle: 'Payment confirmed.',
    paidText: 'Your order is already in the kitchen. Delivery from 7:40 pm.',
    ownerIntro: "This is how it shows up on the owner's dashboard:",
    paidPill: 'Paid',
    customer: 'Sample customer · (00) 90000-0000',
    newOrder: 'Place another order',
  },
};
