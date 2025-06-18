const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');

module.exports = (eleventyConfig) => {

  /**
   * Collections
   */

  // Returns a collection of blog posts in reverse date order
  config.addCollection('blog', (collection) => {
    return [...collection.getFilteredByGlob('./src/blog/*.md')].reverse();
  });

  /**
   * Plugins
   */

  eleventyConfig.addPlugin(syntaxHighlight);

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