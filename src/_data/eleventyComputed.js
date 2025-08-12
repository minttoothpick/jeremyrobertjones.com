module.exports = {
  schemaorg: (data) => {
    const website = {
      '@type': 'WebSite',
      '@id': `${data.site.url}#website`,
      name: data.site.name,
      description: data.site.desc,
      url: data.site.url,
      publisher: {
        '@type': 'Person',
        '@id': `${data.site.url}/#person_jeremy_robert_jones`,
      },
    };

    const person = {
      '@type': 'Person',
      '@id': `${data.site.url}/#person_jeremy_robert_jones`,
      name: data.site.authorName,
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
    };

    return {
      '@context': 'https://schema.org',
      '@graph': [website, person],
    };
  },
};
