import type { SiteContent } from './types';

const ptBr: SiteContent = {
  meta: {
    title: 'Leonardo Barrey · Sistemas e automações com IA',
    description:
      'Sistemas e automações com IA em uso por empresas reais. Veja os projetos e prove as demonstrações.',
  },

  nav: {
    work: 'Projetos',
    pains: 'Soluções',
    method: 'Método',
    tryIt: 'Degustação',
    contact: 'Contato',
    switchLabel: 'View in English',
  },

  hero: {
    tag: 'Automações e sistemas com IA',
    headline: ['Menos planilha,', 'menos retrabalho,'],
    accent: 'mais venda.',
    lead:
      'Sou o Leonardo. Construo aplicativos, integrações e automações com IA que tiram o processo do papel, da planilha e do WhatsApp. Antes de programar, escrevo com você como o sistema vai se comportar, com os dados do seu negócio. Você aprova, e cada cenário vira teste.',
    ctaPrimary: 'Falar no WhatsApp',
    ctaSecondary: 'Ver os projetos',
    mapLog: [
      '→ e-mail recebido de comprador@cliente',
      '→ 12 itens extraídos',
      '→ 12/12 casados no catálogo',
      '→ custo de fornecedor encontrado para 11 itens',
      '✓ proposta #1043 exportada para o ERP',
    ],
  },

  stack: [
    'Python',
    'FastAPI',
    'Node.js',
    'React',
    'TypeScript',
    'PWA',
    'PostgreSQL',
    'Supabase',
    'LLMs',
    'Agentes de IA',
    'Busca semântica',
    'n8n',
    'GitHub Actions',
    'ERP',
    'Pix',
    'SEFAZ',
    'APIs de transportadora',
    'APIs REST',
  ],

  pains: {
    eyebrow: 'Dores que eu resolvo',
    title: 'Onde o seu negócio perde dinheiro sem perceber',
    lead:
      'Problemas comerciais e operacionais que aparecem em empresas de todo tamanho, e o que um sistema bem feito muda em cada um.',
    items: [
      {
        title: 'Comissão de marketplace comendo a margem',
        problem: 'Cada pedido que entra pelo app de delivery deixa uma fatia grande na plataforma.',
        answerLabel: 'Canal próprio',
        answer: 'loja no celular do cliente, com Pix e entrega calculada, sem comissão.',
        demo: 'bakery',
        linkLabel: 'Degustar a loja',
      },
      {
        title: 'Cotação manual que demora e perde venda',
        problem:
          'O cliente pede preço por e-mail e a resposta sai no dia seguinte, quando ele já comprou de outro.',
        answerLabel: 'Proposta em minutos',
        answer: 'a IA lê o pedido, acha os produtos e o preço, e a proposta sai pronta para o ERP.',
        demo: 'quoting',
        linkLabel: 'Degustar a cabine',
      },
      {
        title: 'Lead que esfria por falta de follow-up',
        problem:
          'A lista de contatos existe, mas ninguém tem tempo de escrever, cobrar resposta e lembrar do próximo passo.',
        answerLabel: 'Agente de prospecção',
        answer: 'envia a cadência, lê as respostas e entrega ao vendedor só quem tem interesse.',
        demo: 'crm',
        linkLabel: 'Degustar o CRM',
      },
      {
        title: 'Operação no papel e erro na expedição',
        problem:
          'Mercadoria sai sem conferência, com volume errado, e o frete cobrado ninguém confere.',
        answerLabel: 'App do operador',
        answer: 'recebimento, separação e expedição pelo celular, com frete cotado contra o CT-e.',
        demo: 'warehouse',
        linkLabel: 'Degustar a operação',
      },
      {
        title: 'Planilhas que não conversam com o ERP',
        problem: 'A mesma informação é digitada duas, três vezes, e cada cópia tem um erro diferente.',
        answerLabel: 'Integração',
        answer: 'os sistemas trocam dados sozinhos, com registro de tudo o que passou.',
      },
      {
        title: 'Depender de alguém para cada ajuste',
        problem: 'Uma mudança pequena vira semanas de espera e orçamento novo.',
        answerLabel: 'Chamados com agente',
        answer:
          'você pede pelo próprio sistema e a correção volta testada, com a versão anterior guardada.',
      },
    ],
  },

  work: {
    eyebrow: 'Projetos',
    title: 'Todo sistema é um fluxo',
    lead:
      'Quatro sistemas em uso, construídos para problemas reais. Siga os dados de cada um, passo a passo. Nomes de clientes, empresas e valores foram trocados por dados fictícios nas imagens e nas demonstrações.',
    progressHint: 'Role para seguir o fluxo',
    projects: [
      {
        id: 'quoting',
        tab: 'Cabine de compras',
        kind: 'Cabine de compras · distribuidora B2B',
        title: 'Do e-mail do cliente à proposta pronta no ERP',
        bullets: [
          { label: 'Entrada', text: 'o cotador arrasta o e-mail, a planilha ou o print do pedido.' },
          { label: 'IA', text: 'identifica cada item e encontra o produto certo entre cerca de 5.000 do catálogo.' },
          {
            label: 'Preço',
            text: 'um agente pesquisa fornecedor e custo; 65% das sugestões entram sem correção.',
          },
          { label: 'Resultado', text: '224 propostas no último mês, exportadas no formato do ERP.' },
        ],
        tags: ['IA aplicada', 'Match semântico', 'ERP', 'FastAPI', 'React'],
        status: 'Em uso',
        summary:
          'O cotador arrasta o pedido do cliente e a IA monta a proposta: itens identificados, produtos casados no catálogo, custo pesquisado e arquivo pronto para o ERP.',
        steps: [
          { code: '01 · ENTRADA', title: 'E-mail do cliente', tech: 'React' },
          { code: '02 · IA', title: 'IA extrai os itens', tech: 'LLMs' },
          { code: '03 · MATCH', title: 'Match entre cerca de 5.000 produtos', tech: 'Busca semântica' },
          { code: '04 · AGENTE', title: 'Agente pesquisa o custo', tech: 'Agentes' },
          { code: '05 · SAÍDA', title: 'Proposta no ERP', tech: 'ERP' },
        ],
        metrics: [
          { value: 224, label: 'propostas no último mês' },
          { value: 65, suffix: '%', label: 'das sugestões de preço entram sem correção' },
          { value: 5000, prefix: '~', label: 'produtos no catálogo' },
        ],
        images: [
          {
            file: 'cabine-2.jpg',
            caption: 'Propostas',
            alt: 'Lista de propostas comerciais geradas pelo sistema',
          },
        ],
        tryLabel: 'Provar a cabine',
      },
      {
        id: 'bakery',
        tab: 'App de pedidos',
        kind: 'App de pedidos · confeitaria',
        title: 'Canal próprio de pedidos com Pix, sem comissão de marketplace',
        bullets: [
          {
            label: 'Cliente',
            text: 'pede pelo celular, informa o CEP, vê a taxa pela distância real e paga por Pix.',
          },
          {
            label: 'Dono',
            text: 'painel com pedidos, produção, estoque em dois locais e encomendas agendadas.',
          },
          { label: 'Manutenção', text: 'o dono abre um chamado e um agente de IA corrige, testa e publica.' },
          { label: 'Resultado', text: 'mais de 60 versões em 3 dias a partir dos pedidos dos donos.' },
        ],
        tags: ['PWA', 'Pix', 'Python', 'React', 'PostgreSQL', 'Agente de IA'],
        status: 'Em uso',
        summary:
          'Uma loja própria no celular do cliente, com taxa de entrega pela distância real e pagamento por Pix. O dono acompanha tudo num painel e pede ajustes por chamado.',
        steps: [
          { code: '01 · ENTRADA', title: 'Cliente pede pelo celular', tech: 'PWA' },
          { code: '02 · TAXA', title: 'Taxa pela distância real', tech: 'Python' },
          { code: '03 · PIX', title: 'Paga por Pix', tech: 'Pix' },
          { code: '04 · PAINEL', title: 'Painel do dono', tech: 'React · PostgreSQL' },
          { code: '05 · AGENTE', title: 'Agente publica as correções', tech: 'Agentes' },
        ],
        metrics: [
          { value: 60, suffix: '+', label: 'versões em 3 dias' },
          { value: 0, suffix: '%', label: 'de comissão de marketplace' },
          { value: 2, label: 'locais de estoque' },
        ],
        images: [
          {
            file: 'pudim-2.jpg',
            caption: 'Pedidos',
            alt: 'Painel de pedidos da confeitaria com pedidos pagos e em produção',
          },
          { file: 'pudim-3.jpg', caption: 'Estoque', alt: 'Tela de estoque do painel da confeitaria' },
          { file: 'pudim-4.jpg', caption: 'Chamados', alt: 'Tela de chamados de ajuste abertos pelo dono' },
          {
            file: 'pudim-5.jpg',
            caption: 'Simulador de gateway',
            alt: 'Simulador de gateway de pagamento do app de pedidos',
          },
        ],
        tryLabel: 'Provar a loja',
      },
      {
        id: 'crm',
        tab: 'CRM com agente',
        kind: 'CRM de prospecção · equipe comercial',
        title: 'Um agente de IA que conduz os leads sozinho',
        bullets: [
          { label: 'Cadência', text: 'o agente envia os e-mails, lê as respostas e marca o próximo passo.' },
          { label: 'Funil', text: 'painel com kanban, carteira por vendedor e atividade do agente.' },
          {
            label: 'Rotina',
            text: 'tarefas automáticas no n8n; o agente executa, adia ou recusa com motivo.',
          },
          { label: 'Resultado', text: '347 empresas abordadas no último mês, 16% de retorno.' },
        ],
        tags: ['Agente de IA', 'n8n', 'CRM', 'PostgreSQL'],
        status: 'Em uso',
        summary:
          'O agente envia a cadência, lê as respostas e marca o próximo passo. O vendedor recebe só quem tem interesse.',
        steps: [
          { code: '01 · ENTRADA', title: 'Lista de leads', tech: 'PostgreSQL' },
          { code: '02 · AGENTE', title: 'Agente envia a cadência', tech: 'Agentes' },
          { code: '03 · LEITURA', title: 'Lê as respostas', tech: 'LLMs' },
          { code: '04 · ROTINA', title: 'Agenda o próximo passo', tech: 'n8n' },
          { code: '05 · SAÍDA', title: 'Lead quente para o vendedor', tech: 'React' },
        ],
        metrics: [
          { value: 347, label: 'empresas abordadas no último mês' },
          { value: 16, suffix: '%', label: 'de retorno' },
        ],
        images: [
          {
            file: 'crm-2.jpg',
            caption: 'Board de prospecção',
            alt: 'Board de prospecção com indicadores de e-mails, respostas e funil',
          },
        ],
        tryLabel: 'Provar o CRM',
      },
      {
        id: 'warehouse',
        tab: 'Centro de distribuição',
        kind: 'Operação logística · centro de distribuição',
        title: 'Recebimento, separação e expedição no celular do operador',
        bullets: [
          {
            label: 'Operador',
            text: 'recebe lendo a DANFE, separa com medidas, peso e foto, expede com o DACTE.',
          },
          { label: 'IA', text: 'casa o que chegou no CD com o item do pedido de venda.' },
          { label: 'Gestão', text: 'painel por pedido e frete cotado na transportadora contra o CT-e.' },
          { label: 'Resultado', text: 'nada é expedido sem nota conferida e volumetria registrada.' },
        ],
        tags: ['App operacional', 'ERP', 'API de transportadora', 'TypeScript'],
        status: 'Em uso',
        summary:
          'O operador recebe, separa e expede pelo celular, com cada nota conferida. O gestor acompanha cada pedido e confere o frete contra o CT-e.',
        steps: [
          { code: '01 · ENTRADA', title: 'Lê a DANFE', tech: 'SEFAZ' },
          { code: '02 · IA', title: 'IA casa os itens', tech: 'LLMs' },
          { code: '03 · SEPARAÇÃO', title: 'Separa com medidas e foto', tech: 'TypeScript' },
          { code: '04 · EXPEDIÇÃO', title: 'Lê o DACTE', tech: 'ERP' },
          { code: '05 · FRETE', title: 'Frete x CT-e', tech: 'APIs de transportadora' },
        ],
        metrics: [
          { value: 6, label: 'etapas acompanhadas por pedido' },
          { value: 3, label: 'documentos fiscais conferidos (DANFE, NF-e, DACTE)' },
        ],
        images: [
          {
            file: 'tlp-2.jpg',
            caption: 'Painel',
            alt: 'Painel do centro de distribuição com pedidos e etapas',
          },
          {
            file: 'tlp-3.jpg',
            caption: 'Casamento com IA',
            alt: 'Tela em que a IA casa os itens recebidos com o pedido de venda',
          },
          { file: 'tlp-4.jpg', caption: 'App do operador', alt: 'App do operador no celular' },
          {
            file: 'tlp-5.jpg',
            caption: 'Frete cotado x realizado',
            alt: 'Comparação entre o frete cotado e o frete realizado',
          },
        ],
        tryLabel: 'Provar a operação',
      },
    ],
  },

  tryIt: {
    eyebrow: 'Degustação',
    title: 'Deguste alguns dos sistemas',
    lead:
      'Amostras curtas e navegáveis de alguns projetos, com dados fictícios. Clique, preencha e veja o que acontece. Nada aqui é enviado a lugar nenhum.',
    fakeNote: {
      quoting: 'Itens, fornecedores e preços fictícios.',
      bakery: 'Preços e endereço de exemplo. Pix fictício, não paga nada.',
      crm: 'Empresas e conversas fictícias.',
      warehouse: 'Notas, pedidos e clientes de demonstração.',
    },
    hints: {
      quoting: [
        'Clique em Processar e-mail e veja a IA ler o pedido',
        'Mude o markup e acompanhe o total',
        'Exporte para ver o arquivo que vai para o ERP',
      ],
      bakery: [
        'Adicione dois ou três pudins',
        'No pedido, use o CEP de exemplo e calcule a entrega',
        'Gere o Pix e simule o pagamento',
      ],
      crm: [
        'Toque em um lead para ver o histórico do agente',
        'Use Próximo passo do agente e veja o lead andar no funil',
      ],
      warehouse: [
        'No celular, leia a nota e confira os itens',
        'Valide a sugestão da IA, separe e registre o volume',
        'Leia o DACTE e veja o painel do gestor atualizar',
      ],
    },
    reset: 'Recomeçar',
  },

  method: {
    eyebrow: 'Método',
    title: 'Você sabe o que vai receber antes de pagar pela construção',
    lead: 'O mesmo processo em todo projeto, do primeiro contato até a manutenção.',
    steps: [
      {
        title: 'Entrevista por texto',
        text: 'Perguntas objetivas, no seu tempo, sem reunião longa. Você responde com o jeito que o negócio funciona hoje.',
      },
      {
        title: 'Cenários aprovados',
        text: 'Escrevo cada comportamento como um cenário com os seus dados reais. Você aprova cenários, não documentos técnicos.',
      },
      {
        title: 'Construção com testes',
        text: 'Cada cenário vira um teste automático. Nada vai ao ar sem passar em todos.',
      },
      {
        title: 'Entrega documentada',
        text: 'Manual em vídeo, código e contas no seu nome desde o primeiro dia. Sem mensalidade escondida.',
      },
      {
        title: 'Evolução com chamados',
        text: 'Você pede mudanças por chamado. O agente prepara, testa e guarda a versão anterior para voltar se precisar.',
      },
    ],
    scenarioTitle: 'Como é um cenário',
    scenarioLead:
      'Este é um cenário do app da confeitaria, aprovado pelo dono antes da construção. Ele vira o teste que garante a regra para sempre.',
    scenario: [
      { kw: 'Dado', text: 'um pedido para entrega a 4,2 km da loja' },
      { kw: 'E', text: 'a faixa de 3 a 5 km custa R$ 14,00' },
      { kw: 'Quando', text: 'o cliente informa o CEP e calcula a entrega' },
      { kw: 'Então', text: 'o resumo mostra "Entrega R$ 14,00"' },
      { kw: 'E', text: 'o total soma itens e entrega' },
    ],
  },

  about: {
    eyebrow: 'Sobre',
    text: 'Sou Leonardo Barrey, desenvolvedor em Florianópolis. Construo sistemas e automações com IA para empresas, e escrevo os cenários com você antes de programar.',
    photoAlt: 'Retrato de Leonardo Barrey',
  },

  contact: {
    eyebrow: 'Contato',
    title: 'Tem um processo que ainda depende de planilha ou de WhatsApp?',
    text: 'Me conte como ele funciona hoje. Eu respondo com o que dá para automatizar, quanto custa e em quanto tempo fica pronto.',
    marquee: ['Vamos construir', 'Do papel ao sistema'],
    whatsapp: 'Falar no WhatsApp',
    whatsappMessage: 'Oi Leonardo, vi seu portfólio',
    email: 'Enviar e-mail',
    copy: 'Copiar número',
    copied: 'Número copiado.',
  },

  footer: { note: 'Imagens e demonstrações com dados fictícios.' },

  lightbox: { close: 'Fechar', prev: 'Anterior', next: 'Próxima', of: 'de' },
};

export default ptBr;
