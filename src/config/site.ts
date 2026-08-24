export const site = {
  name: 'CNplus',
  url: 'https://cnplus.org',
  version: '0.8.1',
  links: {
    home: '/',
    download: '/download',
    quickStart: 'https://wiki.cnplus.org/快速开始',
    wiki: 'https://wiki.cnplus.org/',
    forum: 'https://forum.cnplus.org/',
    news: 'https://forum.cnplus.org/category/2',
    github: 'https://github.com/CNplus/CNplus-lang',
    releases: 'https://github.com/CNplus/CNplus-lang/releases',
    vsix: 'https://github.com/CNplus/CNplus-lang/releases/download/v0.8.1/cnplus-0.8.1.vsix',
    contact: 'contact@cnplus.org',
    forumHelp: 'https://forum.cnplus.org/category/5',
    forumFeedback: 'https://forum.cnplus.org/category/10',
  },
} as const;

export const navigation = [
  ['首页', site.links.home], ['快速开始', site.links.quickStart],
  ['Wiki', site.links.wiki], ['论坛', site.links.forum],
  ['动态', site.links.news], ['GitHub', site.links.github],
] as const;
