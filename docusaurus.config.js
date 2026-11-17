// @ts-check
import {themes as prismThemes} from 'prism-react-renderer';

const SITE_URL = 'https://notesbysara.org';
const SITE_DESCRIPTION =
  'Structured finance notes that take you from working with financial data to valuation, markets and derivatives, with clear explanations and worked examples.';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Notes by Sara',
  tagline: 'Finance, explained in order',
  favicon: 'img/favicon.png',

  future: {
    v4: true,
  },

  url: SITE_URL,
  baseUrl: '/',
  trailingSlash: false,

  organizationName: 'Notesbysara',
  projectName: 'notes-by-sara',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  // Site-wide structured data so search engines understand who runs the site.
  headTags: [
    {
      tagName: 'script',
      attributes: {type: 'application/ld+json'},
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Notes by Sara',
        url: SITE_URL,
        description: SITE_DESCRIPTION,
        inLanguage: 'en',
        publisher: {
          '@type': 'Organization',
          name: 'Notes by Sara',
          url: SITE_URL,
          logo: `${SITE_URL}/img/favicon.png`,
          email: 'support@notesbysara.org',
        },
      }),
    },
  ],

  // Financial Dictionary (adds /dictionary and one page per term)
  // Start every new page at the top (see src/clientModules/scrollTop.js).
  clientModules: ['./src/clientModules/scrollTop.js'],

  plugins: [
    './plugins/dictionary',
    // Formula Library (adds /formula-library and one page per formula)
    './plugins/formulas',
    // Courses (Financial Data-to-Insight and later ones), published at /courses.
    // Lessons are plain MDX files in /courses/<course>/, with their own sidebar.
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'courses',
        path: 'courses',
        routeBasePath: 'courses',
        sidebarPath: './sidebarsCourses.js',
        breadcrumbs: true,
      },
    ],
  ],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        // Notes are plain Markdown files in /docs, published at /notes.
        // They are built into static pages, so they are public, fast,
        // and readable by search engines.
        docs: {
          routeBasePath: 'notes',
          sidebarPath: './sidebars.js',
          breadcrumbs: true,
        },
        blog: false,
        theme: {
          customCss: ['./src/css/custom.css', './src/css/notes.css'],
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
          ignorePatterns: ['/notes/foundations/time-value-of-money', '/course', '/notes-library', '/free-pdf'],
          filename: 'sitemap.xml',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/social-card.png',
      metadata: [
        {name: 'description', content: SITE_DESCRIPTION},
        {
          name: 'keywords',
          content:
            'finance notes, learn finance, financial data analysis, financial analysis for beginners, corporate finance, valuation, finance for students',
        },
        {name: 'author', content: 'Sara'},
        {name: 'twitter:card', content: 'summary_large_image'},
      ],
      colorMode: {
        defaultMode: 'light',
        disableSwitch: true,
        respectPrefersColorScheme: false,
      },
      docs: {
        sidebar: {
          hideable: true,
        },
      },
      navbar: {
        title: 'Notes by Sara',
        logo: {
          alt: 'Notes by Sara',
          src: 'img/favicon.png',
        },
        items: [
          {to: '/notes', label: 'Learning path', position: 'left', activeBaseRegex: '^/notes'},
          {to: '/courses', label: 'Courses', position: 'left', activeBaseRegex: '^/courses'},
          {to: '/dictionary', label: 'Dictionary', position: 'left'},
          {to: '/formula-library',  label: 'Formulas',  position: 'left',},
          {to: '/about', label: 'About', position: 'left'},
          {to: '/contact', label: 'Contact', position: 'right'},
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Learn',
            items: [
              {label: 'Learning path', to: '/notes'},
              {label: 'Courses', to: '/courses'},
              {label: 'Financial Dictionary', to: '/dictionary'},
              {label: 'Formulas', to: '/formula-library',},
            ],
          },
          {
            title: 'Notes by Sara',
            items: [
              {label: 'About', to: '/about'},
              {label: 'Contact', to: '/contact'},
              {label: 'YouTube', href: 'https://www.youtube.com/@notes-by-sara'},
            ],
          },
          {
            title: 'Legal',
            items: [
              {label: 'Privacy Policy', to: '/privacy'},
              {label: 'Terms & Conditions', to: '/terms'},
            ],
          },
        ],
        copyright: `© ${new Date().getFullYear()} Notes by Sara. Educational content only, not financial advice.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
