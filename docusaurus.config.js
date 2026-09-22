// @ts-check
import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Notes by Sara',
  tagline: 'A personal finance notebook, made public',
  favicon: 'img/favicon.png',

  future: {
    v4: true,
  },

  url: 'https://notesbysara.org',
  baseUrl: '/',
  trailingSlash: false,

  // TODO: replace with your GitHub username and repo name before deploying
  organizationName: 'Notesbysara',
  projectName: 'notes-by-sara',

  onBrokenLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  plugins: ['./plugins/notes-routes'],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: false,
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
          {to: '/notes', label: 'Subjects', position: 'left'},
          {to: '/about', label: 'About', position: 'left'},
          {href: 'mailto:support@notesbysara.org', label: 'Contact', position: 'left'},
          {
            to: '/login',
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
              {label: 'Subjects', to: '/notes'},
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
