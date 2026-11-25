// One list that drives the Learning path (and the Notes library, when it comes back).
// To publish a new note, add it to the `notes` array of its subject.
// The counts, the "Next up" card, the progress bar and the library all update on their own.

// Courses: hands-on courses, published at /courses. The first one is the "Start here" step on the Learning path.
export const COURSES = [
  {
    slug: 'financial-data-to-insight',
    name: 'Financial Data-to-Insight',
    to: '/courses/financial-data-to-insight',
    blurb:
      "Turn a company's numbers into a clear answer, in twelve short lessons and one real-company project. Free, no account needed.",
    covers: [
      ['Start here', 'Excel and statistics toolkits'],
      ['12 lessons', 'One six-step method'],
      ['Project 01', 'Walmart vs Target'],
    ],
    lessons: [
    {
      slug: "excel-for-this-course",
      title: "Excel for this course",
      to: '/courses/financial-data-to-insight/excel-for-this-course',
      meta: "Start here, toolkit A",
      blurb:
        "The dozen Excel skills the course uses, taught on the shop's sales table, with a self-checking practice workbook to download.",
    },
    {
      slug: "numbers-and-statistics",
      title: "Numbers and statistics",
      to: '/courses/financial-data-to-insight/numbers-and-statistics',
      meta: "Start here, toolkit B",
      blurb:
        "Percent change done right, which average to use, spread and outliers, histograms, and why correlation isn't causation.",
    },
    {
      slug: "from-raw-numbers-to-decisions",
      title: "Read a business through its numbers",
      to: '/courses/financial-data-to-insight/from-raw-numbers-to-decisions',
      meta: "Financial Data-to-Insight, topic 1 of 12",
      blurb:
        "The three financial statements, why a profitable business can run short of cash, and the six-step method the whole course uses.",
    },
    {
      slug: "know-your-data",
      title: "Know your data",
      to: '/courses/financial-data-to-insight/know-your-data',
      meta: "Financial Data-to-Insight, topic 2 of 12",
      blurb:
        "Five questions to ask any dataset, including where it came from and which unit and period it uses.",
    },
    {
      slug: "clean-your-data",
      title: "Clean and check your data",
      to: '/courses/financial-data-to-insight/clean-your-data',
      meta: "Financial Data-to-Insight, topic 3 of 12",
      blurb:
        "Nine checks to run before you trust a spreadsheet, and how to decide whether to fix, flag or remove each problem.",
    },
    {
      slug: "ask-a-question-worth-answering",
      title: "Ask a question worth answering",
      to: '/courses/financial-data-to-insight/ask-a-question-worth-answering',
      meta: "Financial Data-to-Insight, topic 4 of 12",
      blurb:
        "Turn a vague request into a sharp question, build a hypothesis tree, and define every metric before you start.",
    },
    {
      slug: "vanity-metrics-vs-metrics-that-matter",
      title: "Vanity metrics vs metrics that matter",
      to: '/courses/financial-data-to-insight/vanity-metrics-vs-metrics-that-matter',
      meta: "Financial Data-to-Insight, topic 5 of 12",
      blurb:
        "Spot numbers that look good but don't help, and replace them with metrics that support a decision.",
    },
    {
      slug: "ratios-and-trends",
      title: "Ratios and trends",
      to: '/courses/financial-data-to-insight/ratios-and-trends',
      meta: "Financial Data-to-Insight, topic 6 of 12",
      blurb:
        "The four families of ratios, growth over one and several years, and how to look behind every number.",
    },
    {
      slug: "variance-and-valuation",
      title: "Variance and valuation",
      to: '/courses/financial-data-to-insight/variance-and-valuation',
      meta: "Financial Data-to-Insight, topic 7 of 12",
      blurb:
        "Variances against budget, break-even and forecasts, and how to value future cash and test an investment.",
    },
    {
      slug: "pick-the-right-chart",
      title: "Pick the right chart",
      to: '/courses/financial-data-to-insight/pick-the-right-chart',
      meta: "Financial Data-to-Insight, topic 8 of 12",
      blurb:
        "Match the chart to the question, five rules for a clear chart, and when a table works better.",
    },
    {
      slug: "waterfalls-heatmaps-and-honest-charts",
      title: "Waterfalls, heatmaps and honest charts",
      to: '/courses/financial-data-to-insight/waterfalls-heatmaps-and-honest-charts',
      meta: "Financial Data-to-Insight, topic 9 of 12",
      blurb:
        "Build waterfalls and heatmaps, and spot the five most common ways charts mislead.",
    },
    {
      slug: "the-so-what",
      title: "The \u201cSo what?\u201d",
      to: '/courses/financial-data-to-insight/the-so-what',
      meta: "Financial Data-to-Insight, topic 10 of 12",
      blurb:
        "Finding, Why, So what, Now what, and a one-page executive summary that leads with the answer.",
    },
    {
      slug: "prompting-ai-for-financial-analysis",
      title: "Prompting AI for analysis",
      to: '/courses/financial-data-to-insight/prompting-ai-for-financial-analysis',
      meta: "Financial Data-to-Insight, topic 11 of 12",
      blurb:
        "Protect the data, write a six-part prompt, and check AI answers before you trust them.",
    },
    {
      slug: "the-whole-pipeline",
      title: "The whole pipeline",
      to: '/courses/financial-data-to-insight/the-whole-pipeline',
      meta: "Financial Data-to-Insight, topic 12 of 12",
      blurb:
        "All six steps on one question, from a vague worry to a clear decision, and a checklist for your first project.",
    },
    {
      slug: "project-01-walmart-vs-target",
      title: "Project 01: Walmart vs Target",
      to: '/courses/financial-data-to-insight/project-01-walmart-vs-target',
      meta: "Practice project",
      blurb:
        "Run all six steps on Walmart's and Target's real results, with a self-checking starter workbook and an answer workbook.",
    },
  ],
  },
];

// Prerequisites: the Toolkit subjects, published as static lesson pages in static/lessons.
// The hub is /lessons/ and each subject has its own page. Progress is kept in this browser.
export const PREREQS = [
  {group: 'mathematics', name: 'Mathematics for Finance', to: '/lessons/mathematics/index.html', lessons: 26, sections: 5, desc: 'Numbers, growth, calculus and matrices'},
  {group: 'statistics', name: 'Statistics for Finance', to: '/lessons/statistics/index.html', lessons: 22, sections: 4, desc: 'Data, probability, relationships and inference'},
  {group: 'accounting', name: 'Financial Accounting', to: '/lessons/accounting/index.html', lessons: 19, sections: 4, desc: 'The three statements and the key accounts'},
  {group: 'economics', name: 'Economics for Finance', to: '/lessons/economics/index.html', lessons: 5, sections: 2, desc: 'Markets, the economy, money and policy'},
];

export const SUBJECTS = [
  {
    name: 'Foundations',
    covers: ['Money and markets', 'Time value of money', 'Risk and return', 'Ethics and trust'],
    notes: [],
    // Published as static lesson pages in static/lessons/foundations. Progress is kept in this browser.
    page: '/lessons/foundations/index.html',
    group: 'foundations',
    sections: [
      {name: 'Money and markets', count: 5},
      {name: 'Time value of money', count: 8},
      {name: 'Risk and return', count: 5},
      {name: 'Ethics and trust', count: 3},
    ],
    lessons: [
      ['what-finance-is', 'What finance is and how the system works'],
      ['financial-assets', 'Financial assets'],
      ['financial-markets', 'Financial markets'],
      ['what-an-interest-rate-is', 'What an interest rate is'],
      ['what-sets-interest-rates', 'What sets interest rates'],
      ['future-value-and-compounding', 'Future value and compounding'],
      ['present-value-and-discounting', 'Present value and discounting'],
      ['annuities-and-loan-payments', 'Annuities and loan payments'],
      ['perpetuities', 'Perpetuities and growing perpetuities'],
      ['stated-vs-effective-rates', 'Stated vs effective rates'],
      ['uneven-and-growing-cash-flows', 'Uneven and growing cash flows'],
      ['net-present-value', 'Net present value'],
      ['irr-and-payback', 'IRR and payback'],
      ['risk-and-return', 'The risk and return trade-off'],
      ['measuring-return', 'Measuring return'],
      ['measuring-risk', 'Measuring risk'],
      ['diversification', 'Diversification'],
      ['arbitrage', 'Arbitrage and the law of one price'],
      ['why-trust-matters', 'Why trust holds the system together'],
      ['conflicts-of-interest', 'Conflicts of interest and fiduciary duty'],
      ['professional-standards', 'Professional standards, inside information and gray areas'],
    ],
  },
  {
    name: 'Personal Finance',
    covers: ['Budgeting', 'Credit and debt', 'Mortgages', 'Insurance', 'Retirement accounts', 'Investing basics'],
    notes: [],
  },
  {
    name: 'Financial Statement Analysis',
    covers: ['Ratio analysis', 'Earnings quality', 'Red flags'],
    notes: [],
  },
  {
    name: 'Corporate Finance',
    covers: ['Capital budgeting', 'Cost of capital', 'Capital structure', 'Payout policy', 'Raising capital', 'M&A'],
    notes: [],
  },
  {
    name: 'Valuation',
    covers: ['DCF', 'Dividend discount models', 'Multiples', 'LBOs', 'Financial modelling'],
    notes: [],
  },
  {
    name: 'Investments & Portfolio Theory',
    covers: ['Portfolio theory', 'Market efficiency', 'Performance measurement'],
    notes: [],
  },
  {
    name: 'Equity Markets',
    covers: ['Stocks', 'Exchanges', 'Order types', 'Funds and ETFs', 'Investing styles'],
    notes: [],
  },
  {
    name: 'Fixed Income',
    covers: ['Bond pricing', 'Yields', 'Duration', 'Securitised products'],
    notes: [],
  },
  {
    name: 'Derivatives',
    covers: ['Forwards', 'Futures', 'Swaps', 'Options'],
    notes: [],
  },
];

// The number or letter shown beside a note: A and B for the toolkits, 1 to 12 for topics, P for a project.
export function noteLabel(n, j) {
  const m = /topic (\d+) of/i.exec(n.meta || '');
  if (m) return m[1];
  if (/toolkit a/i.test(n.meta || '')) return 'A';
  if (/toolkit b/i.test(n.meta || '')) return 'B';
  if (/project/i.test(n.meta || '')) return 'P';
  return String(j + 1);
}

export const ALL_NOTES = SUBJECTS.flatMap((s, i) =>
  s.notes.map((n, j) => ({ ...n, subject: s.name, subjectIndex: i, order: j + 1, label: noteLabel(n, j) }))
);
