/* Plugins */
const rssPlugin = require('@11ty/eleventy-plugin-rss');
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');

/* Filters */
const dateFilter = require('./src/filters/date-filter.js');
const dateFilterW3 = require('./src/filters/date-filter-w3.js');
const endsWith = require('./src/filters/ends-with.js');

/* Shortcodes */
const imageRow = require('./src/shortcodes/imageRow');
const imageSingle = require('./src/shortcodes/imageSingle.js');

/* Data */
const resume = require('./src/_data/resumeConfig');

module.exports = (eleventyConfig) => {
  /**
   * Collections
   */
  // Returns a collection of blog posts in reverse date order
  eleventyConfig.addCollection('blog', (collection) => {
    return [...collection.getFilteredByGlob('./src/blog/*.md')].reverse();
  });

  /**
   * Plugins
   */
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(rssPlugin);

  /**
   * Filters
   */
  eleventyConfig.addFilter('dateFilter', dateFilter);
  eleventyConfig.addFilter('dateFilterW3', dateFilterW3);
  eleventyConfig.addFilter('endsWith', endsWith);
  eleventyConfig.addNunjucksFilter('limit', (arr, limit) =>
    arr.slice(0, limit)
  );

  /**
   * Shortcodes
   */
  eleventyConfig.addNunjucksAsyncShortcode('imageRow', imageRow);
  eleventyConfig.addNunjucksAsyncShortcode('imageSingle', imageSingle);

  /**
   * Drafts
   * https://www.11ty.dev/docs/config-preprocessors/#example-drafts
   */

  eleventyConfig.addPreprocessor('drafts', '*', (data, content) => {
    if (data.draft && process.env.ELEVENTY_ENV === 'prod') {
      return false;
    }
  });

  /**
   * Misc.
   */

  eleventyConfig.addPassthroughCopy('src/css');
  eleventyConfig.addPassthroughCopy('src/images');
  eleventyConfig.addPassthroughCopy({
    'src/images/favicon/*': '/',
  });
  eleventyConfig.addPassthroughCopy({
    [resume.sourcePath]: resume.publicPath,
  });

  return {
    markdownTemplateEngine: 'njk',
    dataTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    dir: {
      input: 'src',
      output: 'dist',
    },
  };
};
