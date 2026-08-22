export const site = {
  name: 'CNplus',
  url: 'https://cnplus.org',
  version: '0.7.2',
  links: {
    home: '/',
    quickStart: 'https://wiki.cnplus.org/快速开始',
    wiki: 'https://wiki.cnplus.org/',
    forum: 'https://forum.cnplus.org/',
    news: 'https://forum.cnplus.org/category/2',
    github: 'https://github.com/CNplus/CNplus-lang',
  },
} as const;

export const navigation = [
  ['首页', site.links.home], ['快速开始', site.links.quickStart],
  ['Wiki', site.links.wiki], ['论坛', site.links.forum],
  ['动态', site.links.news], ['GitHub', site.links.github],
] as const;
