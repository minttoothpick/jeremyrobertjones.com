/**
 * I have no idea why Kaj's version
 * (https://github.com/KajKandler/eleventy-base-blog-with-schema/blob/main/_data/eleventyComputed.js)
 * works differently.
 */

import nunjucks from 'nunjucks';
import { HtmlBasePlugin } from '@11ty/eleventy';
import metadata from './metadata.js';

const env = new nunjucks.Environment();

env.addFilter('constructID', function (relative_url, base, fragment) {
  var u = new URL(
    HtmlBasePlugin.applyBaseToUrl(fragment, base, {
      pathPrefix: '',
      pageUrl: relative_url,
    })
  );
  return u.href;
});

export default {
  schemaorg: (data) => ({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': env.renderString(
          '{{ "/" | constructID(metadata.url, "#website") }}',
          { ...data, metadata }
        ),
        name: data.metadata.title,
        description: data.metadata.description,
        url: env.renderString('{{ "/" | constructID(metadata.url, "") }}', {
          ...data,
          metadata,
        }),
        publisher: {
          '@type': 'Person',
          '@id': env.renderString(
            '{{ "/" | constructID(metadata.url, "#person_jeremy_robert_jones") }}',
            { ...data, metadata }
          ),
        },
      },
      {
        '@type': 'Person',
        '@id': env.renderString(
          '{{ "/" | constructID(metadata.url, "#person_jeremy_robert_jones") }}',
          { ...data, metadata }
        ),
        name: data.metadata.authorName,
        url: data.metadata.url,
        givenName: 'Jeremy',
        familyName: 'Jones',
        jobTitle: 'Web Developer',
        sameAs: [
          'https://github.com/minttoothpick',
          'https://pixelfed.social/minttoothpick',
          'https://bsky.app/profile/minttoothpick.bsky.social',
          'https://mastodon.social/@minttoothpick',
          'https://www.linkedin.com/in/jeremy-robert-jones/',
          'https://minttoothpick.com/',
        ],
      },
    ],
  }),
};
