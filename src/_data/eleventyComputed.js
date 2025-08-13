const { URL } = require('url');

function constructID(relativeUrl, base, fragment) {
  const baseUrl = new URL(base);
  let relative = relativeUrl.startsWith('/')
    ? relativeUrl.slice(1)
    : relativeUrl;
  let fullUrl = new URL(relative, baseUrl);
  if (fragment) {
    fullUrl.hash = fragment;
  }
  return fullUrl.href;
}

module.exports = {
  schemaorg: (data) => ({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${data.site.url}/#website`,
        name: 'Jeremy Robert Jones',
        description:
          'Hi, I’m Jeremy. I build things on the web and share what I learn on my blog.',
        url: data.site.url,
        publisher: {
          '@type': 'Person',
          '@id': `${data.site.url}/#person_jeremy_robert_jones`,
        },
      },
      {
        '@type': 'Person',
        '@id': `${data.site.url}/#person_jeremy_robert_jones`,
        name: 'Jeremy Robert Jones',
        url: data.site.url,
        givenName: 'Jeremy',
        familyName: 'Jones',
        jobTitle: 'Web Developer',
        sameAs: [
          'https://github.com/minttoothpick',
          'https://pixelfed.social/minttoothpick',
          'https://bsky.app/profile/minttoothpick.bsky.social',
          'https://mastodon.social/@minttoothpick',
          'https://www.linkedin.com/in/jeremy-robert-jones/',
        ],
      },
      {
        '@type': 'WebPage',
        '@id': constructID(data.page.url, data.site.url, '#webpage'),
        name: data.title || data.site.name,
        description: data.meta?.desc || data.site.desc,
        url: constructID(data.page.url, data.site.url),
        isPartOf: {
          '@type': 'WebSite',
          '@id': `${data.site.url}/#website`,
        },
        author: {
          '@type': 'Person',
          '@id': `${data.site.url}/#person_jeremy_robert_jones`,
        },
      },
    ],
  }),
};
