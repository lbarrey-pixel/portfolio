import type { SiteContent } from './types';

const en: SiteContent = {
  meta: {
    title: 'Leonardo Barrey · AI systems & automation',
    description:
      'AI systems and automations in use at real companies. See the work, then try the demos yourself.',
  },

  nav: {
    work: 'Work',
    pains: 'Problems',
    method: 'Method',
    tryIt: 'Try it',
    contact: 'Contact',
    switchLabel: 'Ver em português',
  },

  hero: {
    tag: 'AI systems & automation',
    headline: ['Fewer spreadsheets.', 'Less rework.'],
    accent: 'More sales.',
    lead:
      "I'm Leonardo. I build apps, integrations and AI automations that get your operation off paper, spreadsheets and WhatsApp threads. Before I write any code, we spell out together how the system should behave, using your own business data. You sign off, and every scenario becomes a test.",
    ctaPrimary: 'Message me on WhatsApp',
    ctaSecondary: 'See the work',
    mapLog: [
      '→ email received from buyer@client',
      '→ 12 items extracted',
      '→ 12/12 matched in catalog',
      '→ supplier cost found for 11 items',
      '✓ proposal #1043 exported to ERP',
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
    'AI agents',
    'Semantic search',
    'n8n',
    'GitHub Actions',
    'ERP',
    'Pix',
    'SEFAZ',
    'Carrier APIs',
    'REST APIs',
  ],

  pains: {
    eyebrow: 'Problems I solve',
    title: 'Where your business quietly loses money',
    lead:
      'Sales and operations problems that show up in companies of every size, and what a well-built system changes in each one.',
    items: [
      {
        title: 'Marketplace fees eating your margin',
        problem: 'Every order that comes in through a delivery app leaves a big slice with the platform.',
        answerLabel: 'Your own channel',
        answer: "a store on the customer's phone, with Pix payments and the delivery fee calculated for you. No commission.",
        demo: 'bakery',
        linkLabel: 'Try the store',
      },
      {
        title: 'Slow manual quotes that lose the sale',
        problem:
          "A client asks for a price by email and the answer goes out the next day, after they've already bought elsewhere.",
        answerLabel: 'Quotes in minutes',
        answer: 'AI reads the request, finds the products and prices, and the proposal comes out ready for your ERP.',
        demo: 'quoting',
        linkLabel: 'Try the quoting desk',
      },
      {
        title: 'Leads going cold for lack of follow-up',
        problem:
          'The contact list exists, but nobody has time to write, chase replies and remember the next step.',
        answerLabel: 'Prospecting agent',
        answer: 'it sends the sequence, reads the replies and hands your sales team only the people who are interested.',
        demo: 'crm',
        linkLabel: 'Try the CRM',
      },
      {
        title: 'Paper-based operations and shipping errors',
        problem:
          'Goods leave unchecked, with the wrong measurements, and nobody checks the freight you get billed.',
        answerLabel: 'Operator app',
        answer: 'receiving, picking and shipping from a phone, with freight quotes checked against the CT-e.',
        demo: 'warehouse',
        linkLabel: 'Try the warehouse app',
      },
      {
        title: "Spreadsheets that don't talk to your ERP",
        problem: 'The same data gets typed in two or three times, and every copy has a different mistake.',
        answerLabel: 'Integration',
        answer: 'your systems exchange data on their own, with a log of everything that went through.',
      },
      {
        title: 'Waiting on someone for every small change',
        problem: 'A minor tweak turns into weeks of waiting and a new quote.',
        answerLabel: 'Agent-handled tickets',
        answer:
          'you ask from inside the system, and the fix comes back tested, with the previous version kept.',
      },
    ],
  },

  work: {
    eyebrow: 'Work',
    title: 'Every system is a flow',
    lead:
      'Four systems in use, built for real problems. Follow the data through each one, step by step. Client names, companies and figures in the screenshots and demos have been replaced with fictitious data.',
    progressHint: 'Scroll to follow the flow',
    projects: [
      {
        id: 'quoting',
        tab: 'Quoting desk',
        kind: 'Quoting desk · B2B distributor',
        title: "From a client's email to a finished proposal in the ERP",
        bullets: [
          { label: 'Input', text: 'the quoting team drops in the email, spreadsheet or screenshot of the order.' },
          { label: 'AI', text: 'identifies each item and finds the right product among 4,680 in the catalog.' },
          {
            label: 'Pricing',
            text: 'an agent looks up supplier and cost; 65% of its suggestions go through without correction.',
          },
          { label: 'Result', text: "224 proposals last month, exported in the ERP's own format." },
        ],
        tags: ['Applied AI', 'Semantic matching', 'ERP', 'FastAPI', 'React'],
        status: 'In use',
        summary:
          "The quoting team drops in a client's request and AI builds the proposal: items identified, products matched in the catalog, costs looked up, and a file ready for the ERP.",
        steps: [
          { code: '01 · IN', title: 'Client email', tech: 'React' },
          { code: '02 · AI', title: 'AI extracts the items', tech: 'LLMs' },
          { code: '03 · MATCH', title: 'Match among 4,680 products', tech: 'Semantic search' },
          { code: '04 · AGENT', title: 'Agent finds the cost', tech: 'Agents' },
          { code: '05 · OUT', title: 'Proposal in the ERP', tech: 'ERP' },
        ],
        metrics: [
          { value: 224, label: 'proposals last month' },
          { value: 65, suffix: '%', label: 'of price suggestions accepted without correction' },
          { value: 4680, label: 'products in the catalog' },
        ],
        images: [
          {
            file: 'cabine-2.jpg',
            caption: 'Proposals',
            alt: 'List of sales proposals generated by the system',
          },
        ],
        tryLabel: 'Try the quoting desk',
      },
      {
        id: 'bakery',
        tab: 'Ordering app',
        kind: 'Ordering app · bakery',
        title: 'A direct ordering channel with Pix, and no marketplace commission',
        bullets: [
          {
            label: 'Customer',
            text: 'orders on their phone, enters a postal code, sees the fee for the real distance and pays by Pix.',
          },
          {
            label: 'Owner',
            text: 'a dashboard for orders, production, stock across two locations and scheduled orders.',
          },
          { label: 'Maintenance', text: 'the owner opens a ticket, and an AI agent fixes, tests and ships the change.' },
          { label: 'Result', text: "60+ versions in 3 days, all from the owners' requests." },
        ],
        tags: ['PWA', 'Pix', 'Python', 'React', 'PostgreSQL', 'AI agent'],
        status: 'In use',
        summary:
          "The bakery's own store on the customer's phone, with delivery priced by real distance and payment by Pix. The owner runs everything from one dashboard and asks for changes by ticket.",
        steps: [
          { code: '01 · IN', title: 'Customer orders on their phone', tech: 'PWA' },
          { code: '02 · FEE', title: 'Fee by real distance', tech: 'Python' },
          { code: '03 · PIX', title: 'Pays by Pix', tech: 'Pix' },
          { code: '04 · PANEL', title: "Owner's dashboard", tech: 'React · PostgreSQL' },
          { code: '05 · AGENT', title: 'Agent ships the fixes', tech: 'Agents' },
        ],
        metrics: [
          { value: 60, suffix: '+', label: 'versions in 3 days' },
          { value: 0, suffix: '%', label: 'marketplace commission' },
          { value: 2, label: 'stock locations' },
        ],
        images: [
          {
            file: 'pudim-2.jpg',
            caption: 'Orders',
            alt: "The bakery's order dashboard, with paid orders and orders in production",
          },
          { file: 'pudim-3.jpg', caption: 'Stock', alt: "Stock screen in the bakery's dashboard" },
          { file: 'pudim-4.jpg', caption: 'Tickets', alt: 'Change requests opened by the owner' },
          {
            file: 'pudim-5.jpg',
            caption: 'Payment gateway simulator',
            alt: "The ordering app's payment gateway simulator",
          },
        ],
        tryLabel: 'Try the store',
      },
      {
        id: 'crm',
        tab: 'Agent-run CRM',
        kind: 'Prospecting CRM · sales team',
        title: 'An AI agent that works the leads on its own',
        bullets: [
          { label: 'Sequence', text: 'the agent sends the emails, reads the replies and sets the next step.' },
          { label: 'Pipeline', text: "a dashboard with a kanban board, accounts per rep and the agent's activity." },
          {
            label: 'Routines',
            text: 'automated tasks in n8n; the agent carries them out, postpones them or declines with a reason.',
          },
          { label: 'Result', text: '347 companies reached last month, with a 16% reply rate.' },
        ],
        tags: ['AI agent', 'n8n', 'CRM', 'PostgreSQL'],
        status: 'In use',
        summary:
          'The agent sends the sequence, reads the replies and sets the next step. Sales reps only get the people who are interested.',
        steps: [
          { code: '01 · IN', title: 'Lead list', tech: 'PostgreSQL' },
          { code: '02 · AGENT', title: 'Agent sends the sequence', tech: 'Agents' },
          { code: '03 · READ', title: 'Reads the replies', tech: 'LLMs' },
          { code: '04 · ROUTINE', title: 'Schedules the next step', tech: 'n8n' },
          { code: '05 · OUT', title: 'Warm lead to a sales rep', tech: 'React' },
        ],
        metrics: [
          { value: 347, label: 'companies reached last month' },
          { value: 16, suffix: '%', label: 'reply rate' },
        ],
        images: [
          {
            file: 'crm-2.jpg',
            caption: 'Prospecting board',
            alt: 'Prospecting board with email, reply and pipeline indicators',
          },
        ],
        tryLabel: 'Try the CRM',
      },
      {
        id: 'warehouse',
        tab: 'Distribution center',
        kind: 'Logistics · distribution center',
        title: "Receiving, picking and shipping from the operator's phone",
        bullets: [
          {
            label: 'Operator',
            text: 'receives by scanning the DANFE, picks with dimensions, weight and photo, ships with the DACTE.',
          },
          { label: 'AI', text: 'matches what arrived at the warehouse with the item on the sales order.' },
          { label: 'Management', text: 'a dashboard per order, with carrier freight quotes checked against the CT-e.' },
          { label: 'Result', text: 'nothing ships without a checked invoice and recorded measurements.' },
        ],
        tags: ['Operations app', 'ERP', 'Carrier API', 'TypeScript'],
        status: 'In use',
        summary:
          'Operators receive, pick and ship from their phones, with every invoice checked. Managers follow each order and check the freight against the CT-e.',
        steps: [
          { code: '01 · IN', title: 'Scan the DANFE', tech: 'SEFAZ' },
          { code: '02 · AI', title: 'AI matches the items', tech: 'LLMs' },
          { code: '03 · PICK', title: 'Pick with measures & photo', tech: 'TypeScript' },
          { code: '04 · SHIP', title: 'Scan the DACTE', tech: 'ERP' },
          { code: '05 · FREIGHT', title: 'Freight vs CT-e', tech: 'Carrier APIs' },
        ],
        metrics: [
          { value: 6, label: 'pipeline stages tracked per order' },
          { value: 3, label: 'fiscal documents checked (DANFE, NF-e, DACTE)' },
        ],
        images: [
          {
            file: 'tlp-2.jpg',
            caption: 'Dashboard',
            alt: 'Distribution center dashboard with orders and their stages',
          },
          {
            file: 'tlp-3.jpg',
            caption: 'AI matching',
            alt: 'Screen where AI matches received items with the sales order',
          },
          { file: 'tlp-4.jpg', caption: 'Operator app', alt: 'The operator app on a phone' },
          {
            file: 'tlp-5.jpg',
            caption: 'Quoted vs actual freight',
            alt: 'Comparison of quoted and actual freight',
          },
        ],
        tryLabel: 'Try the warehouse app',
      },
    ],
  },

  tryIt: {
    eyebrow: 'Try it',
    title: 'Try the systems yourself',
    lead:
      'Short, clickable samples of a few projects, running on fictitious data. Click, fill things in and see what happens. Nothing here is sent anywhere.',
    fakeNote: {
      quoting: 'Items, suppliers and prices are fictitious.',
      bakery: 'Sample prices and address. The Pix code is fake and charges nothing.',
      crm: 'Companies and conversations are fictitious.',
      warehouse: 'Invoices, orders and customers are demo data.',
    },
    hints: {
      quoting: [
        'Click Process email and watch the AI read the order',
        'Change the markup and watch the total update',
        'Export to see the file that goes to the ERP',
      ],
      bakery: [
        'Add two or three flans',
        'At checkout, use the sample postal code and calculate delivery',
        'Generate the Pix code and simulate the payment',
      ],
      crm: [
        "Tap a lead to see the agent's history",
        "Use the agent's Next step and watch the lead move down the pipeline",
      ],
      warehouse: [
        'On the phone, scan the invoice and check the items',
        "Confirm the AI's suggestion, pick, and record the package",
        "Scan the DACTE and watch the manager's dashboard update",
      ],
    },
    reset: 'Start over',
  },

  method: {
    eyebrow: 'Method',
    title: "You know what you're getting before you pay for the build",
    lead: 'The same process on every project, from the first message to maintenance.',
    steps: [
      {
        title: 'Written interview',
        text: 'Straight questions, answered in your own time, no long meetings. You tell me how the business actually runs today.',
      },
      {
        title: 'Approved scenarios',
        text: 'I write each behavior as a scenario, using your real data. You approve scenarios, not technical documents.',
      },
      {
        title: 'Built with tests',
        text: 'Every scenario becomes an automated test. Nothing goes live until it passes all of them.',
      },
      {
        title: 'Documented handover',
        text: 'Video manual, code and accounts in your name from day one. No hidden monthly fees.',
      },
      {
        title: 'Changes by ticket',
        text: 'You request changes through a ticket. The agent prepares and tests them, and keeps the previous version in case you need to roll back.',
      },
    ],
    scenarioTitle: 'What a scenario looks like',
    scenarioLead:
      'This one comes from the bakery app, approved by the owner before anything was built. It becomes the test that keeps the rule true for good.',
    scenario: [
      { kw: 'Given', text: 'an order for delivery 4.2 km from the store' },
      { kw: 'And', text: 'the 3 to 5 km band costs R$ 14.00' },
      { kw: 'When', text: 'the customer enters their postal code and calculates delivery' },
      { kw: 'Then', text: 'the summary shows "Delivery R$ 14.00"' },
      { kw: 'And', text: 'the total adds up the items and delivery' },
    ],
  },

  about: {
    eyebrow: 'About',
    text: "I'm Leonardo Barrey, a developer based in Florianópolis, Brazil. I build AI systems and automations for businesses, and I write the scenarios with you before I write any code.",
    photoAlt: 'Portrait of Leonardo Barrey',
  },

  contact: {
    eyebrow: 'Contact',
    title: 'Got a process that still runs on spreadsheets or WhatsApp?',
    text: "Tell me how it works today. I'll come back with what can be automated, what it costs and how long it takes.",
    marquee: ["Let's build it", 'From paper to system'],
    whatsapp: 'Message me on WhatsApp',
    whatsappMessage: 'Hi Leonardo, I saw your portfolio',
    email: 'Send an email',
    copy: 'Copy number',
    copied: 'Number copied.',
  },

  footer: { note: 'Screenshots and demos use fictitious data.' },

  lightbox: { close: 'Close', prev: 'Previous', next: 'Next', of: 'of' },
};

export default en;
