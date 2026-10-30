// @ts-check
import {themes as prismThemes} from 'prism-react-renderer';

const SITE_URL = 'https://notesbysara.org';
const SITE_DESCRIPTION =
  'Structured finance notes that take you from the time value of money to valuation, markets and derivatives, with clear explanations and worked examples.';

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
  plugins: ['./plugins/dictionary'],

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
          customCss: './src/css/custom.css',
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
          ignorePatterns: ['/login', '/signup', '/forgot-password', '/reset-password'],
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
            'finance notes, learn finance, time value of money, corporate finance, valuation, financial math, finance for students',
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
          hideable: false,
        },
      },
      navbar: {
        title: 'Notes by Sara',
        logo: {
          alt: 'Notes by Sara',
          src: 'img/favicon.png',
        },
        items: [
          {to: '/notes', label: 'Learning path', position: 'left', activeBaseRegex: '^/notes/?$'},
          {to: '/notes/foundations/time-value-of-money', label: 'Notes', position: 'left', activeBaseRegex: '^/notes/.+'},
          {to: '/dictionary', label: 'Dictionary', position: 'left'},
          {to: '/about', label: 'About', position: 'left'},
          {href: 'mailto:support@notesbysara.org', label: 'Contact', position: 'right'},
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Learn',
            items: [
              {label: 'Learning path', to: '/notes'},
              {label: 'Notes', to: '/notes/foundations/time-value-of-money'},
              {label: 'Financial Dictionary', to: '/dictionary'},
            ],
          },
          {
            title: 'Notes by Sara',
            items: [
              {label: 'About', to: '/about'},
              {label: 'Contact', href: 'mailto:support@notesbysara.org'},
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
