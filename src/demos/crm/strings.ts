import type { Locale } from '../../i18n/locales';

export interface CrmStrings {
  frameLabel: string;
  kpi: { emails: string; replies: string; qualified: string; proposals: string };
  columns: [string, string, string, string];
  /** one per funnel step: what happened, and the detail under it */
  steps: { event: string; detail: string }[];
  chipAgent: string;
  chipReplied: string;
  /** {who} */
  portfolio: string;
  next: string;
  working: string;
  end: string;
  boardLabel: string;
}

export const strings: Record<Locale, CrmStrings> = {
  'pt-br': {
    frameLabel: 'crm · board de prospecção',
    kpi: { emails: 'e-mails no mês', replies: 'respostas', qualified: 'qualificados', proposals: 'propostas' },
    columns: ['Frio', 'Respondeu', 'Qualificado', 'Proposta'],
    steps: [
      { event: 'E-mail 1 enviado pelo agente', detail: 'apresentação curta, focada no segmento da empresa' },
      { event: 'E-mail 2 enviado (follow-up)', detail: '4 dias sem resposta; agente mudou o assunto' },
      { event: 'Resposta recebida', detail: '"Temos interesse, podem mandar catálogo?"' },
      { event: 'Agente qualificou o lead', detail: 'pediu catálogo e informou volume; próximo passo marcado' },
      { event: 'Proposta enviada', detail: 'vendedor revisou e enviou; follow-up em 3 dias' },
    ],
    chipAgent: 'agente',
    chipReplied: 'respondeu',
    portfolio: 'carteira de {who}',
    next: 'Próximo passo do agente',
    working: 'agente trabalhando…',
    end: 'Lead no fim do funil',
    boardLabel: 'Board de prospecção',
  },
  en: {
    frameLabel: 'crm · prospecting board',
    kpi: { emails: 'emails this month', replies: 'replies', qualified: 'qualified', proposals: 'proposals' },
    columns: ['Cold', 'Replied', 'Qualified', 'Proposal'],
    steps: [
      { event: 'Email 1 sent by the agent', detail: "short introduction, focused on the company's segment" },
      { event: 'Email 2 sent (follow-up)', detail: '4 days with no reply; the agent changed the subject line' },
      { event: 'Reply received', detail: '"We\'re interested, could you send us the catalog?"' },
      { event: 'Agent qualified the lead', detail: 'asked for the catalog and gave their volume; next step scheduled' },
      { event: 'Proposal sent', detail: 'the seller reviewed and sent it; follow-up in 3 days' },
    ],
    chipAgent: 'agent',
    chipReplied: 'replied',
    portfolio: "{who}'s accounts",
    next: "Agent's next step",
    working: 'agent working…',
    end: 'Lead at the end of the funnel',
    boardLabel: 'Prospecting board',
  },
};
