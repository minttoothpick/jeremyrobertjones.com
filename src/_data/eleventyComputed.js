// _data/eleventyComputed.js
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
    ],
  }),
};
