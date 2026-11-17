// Sample pages for the Formula Cheat Sheet book on /formula-free-pdf.
// Each one is a real formula from the Formula Library: name, level, what it finds, the formula.
export const FORMULA_BOOK = {
  boxLabel: 'Formula',
  coverTitle: 'Financial Formulas',
  coverSub: 'Cheat Sheet',
  coverFoot: '522 formulas by subject',
  lastTitle: 'And 512 more',
  lastText: 'Every formula shows what it finds, and its name opens a calculator on the site.',
  pages: [
    ['Simple Interest', 'Beginner', 'Interest paid only on the original amount, never on interest already earned.', 'I = P × r × t'],
    ['Future Value', 'Beginner', 'What one amount grows to when interest is added each period.', 'FV = PV × (1 + r)ⁿ'],
    ['Rule of 72', 'Beginner', 'A quick way to find how many years it takes money to double.', 'Years to double = 72 ÷ r'],
    ['Current Ratio', 'Beginner', 'Whether current assets cover the bills due within a year.', 'Current assets ÷ Current liabilities'],
    ['Earnings per Share', 'Beginner', 'The profit that belongs to each ordinary share.', 'EPS = (Net income − Preferred dividends) ÷ Shares'],
    ['Return on Equity', 'Beginner', "The return earned on shareholders' money.", 'ROE = (Net income − Preferred dividends) ÷ Average equity'],
    ['Sharpe Ratio', 'Beginner', 'Return for each unit of total risk taken.', '(Return − Risk-free rate) ÷ Standard deviation'],
    ['Net Present Value', 'Intermediate', "Whether a project adds value, in today's money. Above zero means it does.", 'NPV = Σ CFₜ ÷ (1 + r)ᵗ'],
    ['Loan Payment', 'Intermediate', 'The regular payment that pays off a loan over its term.', 'PMT = P × r ÷ (1 − (1 + r)⁻ⁿ)'],
    ['Cost of Equity (CAPM)', 'Intermediate', "The return shareholders require for the share's risk.", 'Risk-free rate + Beta × Equity risk premium'],
  ],
};
