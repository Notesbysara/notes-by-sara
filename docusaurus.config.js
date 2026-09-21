// @ts-check
import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Notes by Sara',
  tagline: 'A personal finance notebook, made public',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://notesbysara.org',
  baseUrl: '/',

  // TODO: replace with your GitHub username and repo name before deploying
  organizationName: 'your-github-username',
  projectName: 'notes-by-sara',

  onBrokenLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: 'docs',
          sidebarPath: './sidebars.js',
          editUrl: undefined,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/docusaurus-social-card.jpg',
      colorMode: {
        defaultMode: 'light',
        disableSwitch: true,
        respectPrefersColorScheme: false,
      },
      navbar: {
        title: 'Notes by Sara',
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'notesSidebar',
            position: 'left',
            label: 'Subjects',
          },
          {to: '/about', label: 'About', position: 'left'},
          {href: 'mailto:support@notesbysara.org', label: 'Contact', position: 'left'},
          {
            href: 'https://notesbysara.org/login',
            label: 'Log in',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Site',
            items: [
              {label: 'About', to: '/about'},
              {label: 'Subjects', to: '/docs/corporate-finance/time-value-of-money'},
            ],
          },
          {
            title: 'Contact & Legal',
            items: [
              {label: 'support@notesbysara.org', href: 'mailto:support@notesbysara.org'},
              {label: 'Privacy Policy', to: '/privacy'},
              {label: 'Terms & Conditions', to: '/terms'},
            ],
          },
        ],
        copyright: `© ${new Date().getFullYear()} Notes by Sara`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
