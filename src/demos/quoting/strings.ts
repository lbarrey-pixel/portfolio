import type { Locale } from '../../i18n/locales';

export interface QuotingStrings {
  frameLabel: string;
  app: string;
  nav: string[];
  step1: string;
  title: string;
  intro: string;
  emailLabel: string;
  process: string;
  processing: string;
  step2: string;
  /** {no} */
  proposal: string;
  client: string;
  columns: { asked: string; found: string; confidence: string; supplier: string; qty: string; cost: string; price: string };
  confidence: { high: string; medium: string; none: string };
  why: Record<string, string>;
  suppliers: string[];
  searching: string;
  byAgent: string;
  margin: string;
  cost: string;
  total: string;
  profit: string;
  export: string;
  back: string;
  toast: string;
  csvLabel: string;
}

export const strings: Record<Locale, QuotingStrings> = {
  'pt-br': {
    frameLabel: 'cabine · nova proposta',
    app: 'Cabine de compras',
    nav: ['Nova proposta', 'Propostas', 'Catálogo', 'Desempenho', 'Agentes'],
    step1: 'Etapa 1 de 3 · Entrada',
    title: 'Nova proposta',
    intro: 'Arraste o e-mail, a planilha ou o print. Aqui já deixamos um e-mail de exemplo.',
    emailLabel: 'E-mail do cliente',
    process: 'Processar e-mail',
    processing: 'Lendo itens e buscando no catálogo…',
    step2: 'Etapa 2 de 3 · Revisão',
    proposal: 'Proposta {no}',
    client: 'Cliente Exemplo Ltda',
    columns: {
      asked: 'Pedido do cliente',
      found: 'Produto encontrado',
      confidence: 'Confiança',
      supplier: 'Fornecedor',
      qty: 'Qtd',
      cost: 'Custo un.',
      price: 'Venda un.',
    },
    confidence: { high: 'alta', medium: 'média', none: 'sem match' },
    why: {
      sameModel: 'modelo e lente iguais',
      quotedBefore: 'já cotado antes',
      samePower: 'potência igual, forma de onda a confirmar',
      sameCategory: 'categoria e metragem iguais',
      notInCatalog: 'não está no catálogo',
      agentFound: 'agente encontrou em 3 lojas, menor preço',
    },
    suppliers: ['Fornecedor A', 'Fornecedor B', 'Fornecedor C', 'Loja on-line X'],
    searching: 'agente pesquisando preço…',
    byAgent: 'pesquisado pelo agente',
    margin: 'Markup',
    cost: 'Custo',
    total: 'Total da proposta',
    profit: 'Lucro',
    export: 'Exportar para o ERP',
    back: 'Voltar ao e-mail',
    toast: 'Proposta R-2041 pronta para importar no ERP. Etapa 3 de 3 concluída.',
    csvLabel: 'Arquivo para o ERP',
  },
  en: {
    frameLabel: 'quoting desk · new proposal',
    app: 'Quoting desk',
    nav: ['New proposal', 'Proposals', 'Catalog', 'Performance', 'Agents'],
    step1: 'Step 1 of 3 · Input',
    title: 'New proposal',
    intro: "Drop in the email, spreadsheet or screenshot. We've left a sample email here (a Brazilian client, so it's in Portuguese).",
    emailLabel: "Client's email",
    process: 'Process email',
    processing: 'Reading the items and searching the catalog…',
    step2: 'Step 2 of 3 · Review',
    proposal: 'Proposal {no}',
    client: 'Cliente Exemplo Ltda',
    columns: {
      asked: 'Client asked for',
      found: 'Product found',
      confidence: 'Confidence',
      supplier: 'Supplier',
      qty: 'Qty',
      cost: 'Unit cost',
      price: 'Unit price',
    },
    confidence: { high: 'high', medium: 'medium', none: 'no match' },
    why: {
      sameModel: 'same model and lens',
      quotedBefore: 'quoted before',
      samePower: 'same power, waveform to confirm',
      sameCategory: 'same category and length',
      notInCatalog: 'not in the catalog',
      agentFound: 'agent found it in 3 stores, lowest price',
    },
    suppliers: ['Supplier A', 'Supplier B', 'Supplier C', 'Online store X'],
    searching: 'agent looking up the price…',
    byAgent: 'researched by the agent',
    margin: 'Markup',
    cost: 'Cost',
    total: 'Proposal total',
    profit: 'Profit',
    export: 'Export to the ERP',
    back: 'Back to the email',
    toast: 'Proposal R-2041 is ready to import into the ERP. Step 3 of 3 done.',
    csvLabel: 'File for the ERP',
  },
};
