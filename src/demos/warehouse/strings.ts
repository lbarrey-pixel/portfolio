import type { Locale } from '../../i18n/locales';

export interface WarehouseStrings {
  app: string;
  appSub: string;
  exit: string;
  nav: [string, string, string];
  recTitle: string;
  recText: string;
  readDanfe: string;
  sefaz: string;
  nfTitle: string;
  nfText: string;
  /** {code} */
  code: string;
  receiveDone: string;
  matchTitle: string;
  aiTitle: string;
  arrived: string;
  ordered: string;
  aiWhy: string;
  validate: string;
  pickTitle: string;
  pickText: string;
  /** {loc} */
  loc: string;
  volume: string;
  length: string;
  width: string;
  height: string;
  weight: string;
  pickDone: string;
  shipTitle: string;
  shipText: string;
  readDacte: string;
  linking: string;
  doneTitle: string;
  doneText: string;
  again: string;
  panelTitle: string;
  stages: [string, string, string, string, string, string];
  kpiUnits: string;
  kpiCubage: string;
  kpiFreight: string;
  logLabel: string;
  logWaiting: string;
  logRead: string;
  logReceived: string;
  logMatched: string;
  /** {c} {l} {a} {p} */
  logConsolidated: string;
  logInvoiced: string;
  logShipped: string;
}

export const strings: Record<Locale, WarehouseStrings> = {
  'pt-br': {
    app: 'Sistema CD',
    appSub: 'App do operador',
    exit: 'Sair',
    nav: ['Recebimento', 'Separação', 'Expedição'],
    recTitle: 'Recebimento',
    recText: 'Aponte a câmera para o código de barras da DANFE. A nota oficial vem da SEFAZ.',
    readDanfe: 'Ler DANFE de exemplo',
    sefaz: 'Consultando a SEFAZ…',
    nfTitle: 'NF 48213 · Loja Exemplo Ferramentas',
    nfText: 'Confira e fotografe cada item que chegou.',
    code: 'cód. {code}',
    receiveDone: 'Concluir recebimento',
    matchTitle: 'Itens aguardando casamento',
    aiTitle: 'Sugestão da IA · confiança média',
    arrived: 'Chegou:',
    ordered: 'Pedido #1871:',
    aiWhy: 'mesma medida e cor; fornecedor descreve diferente',
    validate: 'Validar casamento',
    pickTitle: 'Separação · Pedido #1871',
    pickText: 'Marque cada item separado.',
    loc: 'local {loc}',
    volume: 'Volume 1',
    length: 'Compr. cm',
    width: 'Larg. cm',
    height: 'Alt. cm',
    weight: 'Peso kg',
    pickDone: 'Concluir consolidação',
    shipTitle: 'Expedição',
    shipText: 'NF de venda 51877 já conferida. Leia o código de barras do DACTE para vincular o transporte.',
    readDacte: 'Ler DACTE de exemplo',
    linking: 'Vinculando DACTE…',
    doneTitle: 'Pedido #1871 expedido',
    doneText: 'Segue no rastreio da transportadora. O gestor já vê no painel.',
    again: 'Recomeçar',
    panelTitle: 'Painel do gestor · Pedido #1871',
    stages: ['Recebido', 'Casado', 'Consolidado', 'Faturado', 'Expedido', 'Entregue'],
    kpiUnits: 'un. recebidas',
    kpiCubage: 'm³ cubagem',
    kpiFreight: 'frete cotado',
    logLabel: 'Registro do pedido',
    logWaiting: 'Pedido #1871 · Cliente Demo Indústria aguardando recebimento',
    logRead: 'NF 48213 lida · 3 itens',
    logReceived: 'Recebimento concluído com fotos',
    logMatched: 'Casamento validado pelo operador (sugestão da IA)',
    logConsolidated: 'Consolidado: 1 volume {c}x{l}x{a} cm, {p} kg',
    logInvoiced: 'NF de venda 51877 emitida no ERP',
    logShipped: 'DACTE vinculado · pedido expedido',
  },
  en: {
    app: 'DC System',
    appSub: 'Operator app',
    exit: 'Sign out',
    nav: ['Receiving', 'Picking', 'Shipping'],
    recTitle: 'Receiving',
    recText: "Point the camera at the barcode on the DANFE (the printed invoice). The official invoice comes from SEFAZ, the tax authority.",
    readDanfe: 'Scan the sample DANFE',
    sefaz: 'Checking with SEFAZ…',
    nfTitle: 'Invoice 48213 · Loja Exemplo Ferramentas',
    nfText: 'Check and photograph each item that arrived.',
    code: 'code {code}',
    receiveDone: 'Finish receiving',
    matchTitle: 'Items waiting to be matched',
    aiTitle: 'AI suggestion · medium confidence',
    arrived: 'Arrived:',
    ordered: 'Order #1871:',
    aiWhy: 'same size and color; the supplier describes it differently',
    validate: 'Confirm the match',
    pickTitle: 'Picking · Order #1871',
    pickText: 'Tick each item as you pick it.',
    loc: 'location {loc}',
    volume: 'Package 1',
    length: 'Length cm',
    width: 'Width cm',
    height: 'Height cm',
    weight: 'Weight kg',
    pickDone: 'Finish packing',
    shipTitle: 'Shipping',
    shipText: 'Sales invoice 51877 is already checked. Scan the barcode on the DACTE (the freight document) to link the carrier.',
    readDacte: 'Scan the sample DACTE',
    linking: 'Linking the DACTE…',
    doneTitle: 'Order #1871 shipped',
    doneText: "It is now on the carrier's tracking. The manager already sees it on the dashboard.",
    again: 'Start over',
    panelTitle: "Manager's dashboard · Order #1871",
    stages: ['Received', 'Matched', 'Packed', 'Invoiced', 'Shipped', 'Delivered'],
    kpiUnits: 'units received',
    kpiCubage: 'm³ volume',
    kpiFreight: 'freight quoted',
    logLabel: 'Order log',
    logWaiting: 'Order #1871 · Cliente Demo Indústria waiting to be received',
    logRead: 'Invoice 48213 scanned · 3 items',
    logReceived: 'Receiving finished, with photos',
    logMatched: 'Match confirmed by the operator (AI suggestion)',
    logConsolidated: 'Packed: 1 package {c}x{l}x{a} cm, {p} kg',
    logInvoiced: 'Sales invoice 51877 issued in the ERP',
    logShipped: 'DACTE linked · order shipped',
  },
};
