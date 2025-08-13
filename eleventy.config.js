/* Plugins */
import rssPlugin from '@11ty/eleventy-plugin-rss';
import syntaxHighlight from '@11ty/eleventy-plugin-syntaxhighlight';

/* Filters */
import dateFilter from './src/filters/date-filter.js';
import dateFilterW3 from './src/filters/date-filter-w3.js';
import endsWith from './src/filters/ends-with.js';

/* Shortcodes */
import imageRow from './src/shortcodes/imageRow.js';
import imageSingle from './src/shortcodes/imageSingle.js';

/* Data */
import resume from './src/_data/resumeConfig.js';

export default function (eleventyConfig) {
  /**
   * Collections
   */
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
}
