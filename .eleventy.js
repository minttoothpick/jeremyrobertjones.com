/* Plugins */
const rssPlugin = require("@11ty/eleventy-plugin-rss");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

/* Filters */
const dateFilter = require("./src/filters/date-filter.js");
const dateFilterW3 = require("./src/filters/date-filter-w3.js");

/* Shortcodes */
const imageRow = require("./src/shortcodes/imageRow");

module.exports = (eleventyConfig) => {
  /**
   * Collections
   */

  // Returns a collection of blog posts in reverse date order
  eleventyConfig.addCollection("blog", (collection) => {
    return [...collection.getFilteredByGlob("./src/blog/*.md")].reverse();
  });

  /**
   * Plugins
   */

  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(rssPlugin);

  /**
   * Filters
   */

  eleventyConfig.addFilter("dateFilter", dateFilter);
  eleventyConfig.addFilter("dateFilterW3", dateFilterW3);
  eleventyConfig.addNunjucksFilter("limit", (arr, limit) =>
    arr.slice(0, limit)
  );

  /**
   * Shortcodes
   */

  eleventyConfig.addNunjucksAsyncShortcode("imageRow", imageRow);

  /**
   * Misc.
   */

  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy({
    "src/images/favicon/*": "/",
  });
  eleventyConfig.addPassthroughCopy({
    "src/docs/Jeremy_Jones_Web_Manager_Resume.pdf": "/resume",
  });

  return {
    markdownTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dir: {
      input: "src",
      output: "dist",
    },
  };
};
