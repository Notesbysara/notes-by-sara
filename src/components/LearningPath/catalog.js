// One list that drives both the Learning path and the Notes library.
// To publish a new note, add it to the `notes` array of its subject.
// The counts, the "Next up" card, the progress bar and the library all update on their own.

export const SUBJECTS = [
  {
    name: 'Foundations',
    covers: ['Financial Data-to-Insight course (12 topics)', 'Financial math', 'Statistics for finance', 'Accounting basics'],
    notes: [
      {
        slug: 'from-raw-numbers-to-decisions',
        title: 'From raw numbers to decisions',
        to: '/notes/foundations/from-raw-numbers-to-decisions',
        meta: 'Financial Data-to-Insight, topic 1 of 12',
        blurb:
          'Six steps that take you from a spreadsheet full of numbers to a clear decision: Assess, Inquire, Analyze, Visualize, Interpret and Prompt.',
      },
      {
        slug: 'know-your-data',
        title: 'Know your data',
        to: '/notes/foundations/know-your-data',
        meta: 'Financial Data-to-Insight, topic 2 of 12',
        blurb:
          'The four questions to ask any dataset: what type each column is, what shape the data is, what one row stands for, and which unit and year it uses.',
      },
      {
        slug: 'clean-your-data',
        title: 'Clean your data',
        to: '/notes/foundations/clean-your-data',
        meta: 'Financial Data-to-Insight, topic 3 of 12',
        blurb:
          'Nine checks to run before you trust a spreadsheet, from duplicates and missing values to outliers, plus three habits that keep cleaning safe.',
      },
      {
        slug: 'ask-a-question-worth-answering',
        title: 'Ask a question worth answering',
        to: '/notes/foundations/ask-a-question-worth-answering',
        meta: 'Financial Data-to-Insight, topic 4 of 12',
        blurb:
          'How to turn a vague request into a sharp business question, and break a big question into a hypothesis tree.',
      },
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

export const ALL_NOTES = SUBJECTS.flatMap((s, i) =>
  s.notes.map((n, j) => ({ ...n, subject: s.name, subjectIndex: i, order: j + 1 }))
);
