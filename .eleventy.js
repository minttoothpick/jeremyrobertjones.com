module.exports = (eleventyConfig) => {

  eleventyConfig.addPassthroughCopy("src/css");

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