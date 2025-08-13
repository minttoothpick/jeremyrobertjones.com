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
  eleventyComputed: {
    schemaorg: (data) => ({
      '@graph': [
        {
          '@type': 'Article',
          '@id': constructID(data.page.url, data.site.url, '#article'),
          name: data.title || data.site.name,
          headline: data.title || data.site.name,
          description: data.meta?.desc || data.site.desc,
          url: constructID(data.page.url, data.site.url),
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': constructID(data.page.url, data.site.url, '#webpage'),
          },
          author: {
            '@type': 'Person',
            '@id': `${data.site.url}/#person_jeremy_robert_jones`,
          },
        },
      ],
    }),
  },
};
