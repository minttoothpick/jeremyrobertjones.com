const rssPlugin = require('@11ty/eleventy-plugin-rss');
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const dateFilter = require('./src/filters/date-filter.js');
const dateFilterW3 = require('./src/filters/date-filter-w3.js');

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

  /**
   * Misc.
   */

  eleventyConfig.addPassthroughCopy('src/css');
  eleventyConfig.addPassthroughCopy('src/images');

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