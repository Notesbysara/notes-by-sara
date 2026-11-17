/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */

// One sidebar per course. Lessons live in /courses/<course>/ and are published at /courses/<course>/<slug>.
const label = (text) => ({type: 'html', value: `<p class="nbs-course">${text}</p>`, defaultStyle: false});

const sidebars = {
  fdiSidebar: [
    {
      type: 'category',
      label: 'Financial Data-to-Insight',
      collapsed: false,
      collapsible: false,
      items: [
        {type: 'link', label: 'About the course', href: '/courses/financial-data-to-insight'},
        label('Start here (optional)'),
        'financial-data-to-insight/excel-for-this-course',
        'financial-data-to-insight/numbers-and-statistics',
        label('Lessons'),
        'financial-data-to-insight/from-raw-numbers-to-decisions',
        'financial-data-to-insight/know-your-data',
        'financial-data-to-insight/clean-your-data',
        'financial-data-to-insight/ask-a-question-worth-answering',
        'financial-data-to-insight/vanity-metrics-vs-metrics-that-matter',
        'financial-data-to-insight/ratios-and-trends',
        'financial-data-to-insight/variance-and-valuation',
        'financial-data-to-insight/pick-the-right-chart',
        'financial-data-to-insight/waterfalls-heatmaps-and-honest-charts',
        'financial-data-to-insight/the-so-what',
        'financial-data-to-insight/prompting-ai-for-financial-analysis',
        'financial-data-to-insight/the-whole-pipeline',
        label('Practice project'),
        'financial-data-to-insight/project-01-walmart-vs-target',
      ],
    },
  ],
};

export default sidebars;
