import { ThemeChoice } from '../../core/theme/theme.model';

export const en = {
  meta: {
    title: 'Diea Ikhlayel | Portfolio',
    description:
      'Portfolio of Diea Ikhlayel, a full-stack web developer with IT support experience and cybersecurity knowledge.',
  },
  a11y: {
    skipToContent: 'Skip to main content',
  },
  site: {
    name: 'Diea Ikhlayel',
  },
  home: {
    photo: {
      alt: 'AI-generated portrait of Diea Ikhlayel',
    },
    hero: {
      role: 'Full-stack web developer with IT support and cybersecurity skills',
      intro:
        'I develop web applications using frontend and backend technologies, and I have IT support experience and knowledge of cybersecurity fundamentals. I enjoy solving technical problems, troubleshooting, and building secure, reliable and easy-to-use solutions. Browse my projects or get in touch.',
      viewProjects: 'View projects',
      contactMe: 'Contact me',
    },
    skills: {
      title: 'Skills',
      intro: 'Technologies I have worked with in my projects and training.',
      groups: {
        frontend: 'Frontend',
        backend: 'Backend',
        security: 'Networking and security',
        support: 'IT support and service',
        systems: 'Systems',
        tools: 'Data and tools',
      },
    },
  },
  about: {
    sections: {
      education: 'Education',
      experience: 'Experience',
      certificates: 'Certificates',
      languages: 'Languages',
    },
  },

  contact: {
    intro:
      'Have a question or want to work together? Email is the best way to reach me. You can also find me on LinkedIn and GitHub.',
    email: 'Email',
    phone: 'Phone',
  },
  notFound: {
    title: 'Page not found',
    message: 'The page you are looking for does not exist or has moved.',
    home: 'Back to the home page',
  },
  projects: {
    intro: 'A selection of what I have built. Each project links to its source code.',
    featured: 'Featured',
    more: 'More projects',
    repo: 'Source code',
    live: 'Live demo',
    note: 'Note',
  },
  theme: {
    label: 'Theme',
    options: {
      system: 'System',
      light: 'Paper (light)',
      dark: 'Charcoal (dark)',
      midnight: 'Midnight',
      forest: 'Forest',
      ember: 'Ember',
      violet: 'Violet',
      contrast: 'High contrast',
      sand: 'Sand',
      ocean: 'Ocean',
      rose: 'Rose',
    } satisfies Record<ThemeChoice, string>,
  },
  language: {
    switchTo: 'Switch language',
  },
  nav: {
    primary: 'Primary',
    menu: 'Menu',
    projects: 'Projects',
    about: 'About',
    contact: 'Contact',
  },
  pages: {
    comingSoon: 'This page is coming soon.',
  },
  footer: {
    email: 'Email',
    note: 'Built with Angular.',
  },
};

export type Translations = typeof en;
