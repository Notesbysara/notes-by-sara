/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */

// Topics that are not published yet show as "Coming soon".
// When a topic is published, replace its soon(...) line with its doc id.
const soon = (n, title) => ({
  type: 'html',
  value: `<span class="nbs-soon">${n}. ${title}<em>Coming soon</em></span>`,
  defaultStyle: false,
});

const sidebars = {
  notesSidebar: [
    {
      type: 'category',
      label: 'Foundations',
      collapsed: false,
      collapsible: false,
      items: [
        {type: 'html', value: '<p class="nbs-course">Financial Data-to-Insight</p>', defaultStyle: false},
        'foundations/from-raw-numbers-to-decisions',
        'foundations/know-your-data',
        'foundations/clean-your-data',
        'foundations/ask-a-question-worth-answering',
        soon(5, 'Vanity metrics vs metrics that matter'),
        soon(6, 'Ratios and trends'),
        soon(7, 'Variance and valuation'),
        soon(8, 'Pick the right chart'),
        soon(9, 'Honest charts'),
        soon(10, 'The “So what?”'),
        soon(11, 'Prompting AI for analysis'),
        soon(12, 'The whole pipeline'),
      ],
    },
  ],
};

export default sidebars;
