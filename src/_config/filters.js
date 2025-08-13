import { HtmlBasePlugin } from '@11ty/eleventy';
import moment from 'moment';

export default function (eleventyConfig) {
  eleventyConfig.addFilter('constructID', (relative_url, base, fragment) => {
    var u = new URL(
      HtmlBasePlugin.applyBaseToUrl(fragment, base, {
        pathPrefix: eleventyConfig.pathPrefix || '',
        pageUrl: relative_url,
      })
    );
    return u.href;
  });

  eleventyConfig.addNunjucksFilter('limit', (arr, limit) =>
    arr.slice(0, limit)
  );

  eleventyConfig.addFilter('dateFilterW3', (value) => {
    const dateObject = new Date(value);
    return dateObject.toISOString();
  });

  eleventyConfig.addFilter('dateFilter', (value) => {
    return moment(value).format('MMMM D, YYYY');
  });

  eleventyConfig.addFilter('endsWith', (str, suffix) => {
    if (typeof str !== 'string' || typeof suffix !== 'string') {
      return false;
    }
    return str.toLowerCase().endsWith(suffix.toLowerCase());
  });
}
