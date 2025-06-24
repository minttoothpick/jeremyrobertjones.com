---
title: 'Creating proportional, equal-height image rows with CSS, 11ty, and Nunjucks'
date: '2025-06-15'
featureImage:
  url: '/images/row-of-picture-frames.svg'
  alt: 'Three picture frames in a row'
tags: ['technical']
subTags: ['CSS', '11ty', 'Tutorial']
summary: 'How I built an aspect-ratio-respecting image row component and Nunjucks shortcode.'
lede: "Equal-height image layouts seem simple until you try to build one that's truly responsive. This tutorial walks through my solution using flexbox aspect ratios, the Eleventy Image plugin, and a Nunjucks shortcode."
---

A while back I came across an unexpectedly challenging image layout issue in CSS. I wanted to create a fluid, flexible, responsive image row where:

1. The images display in a single horizontal row without wrapping or overflowing,
2. The entire row width is fluid; it expands or shrinks to fill the width of its parent container,
3. Images with various aspect ratios are scaled proportionally to each other and together take up the full width of the row, and
4. All the images display at the same height, with their widths adjusting to maintain the aspect ratios.

Like this:

{% imageRow [
  { src: "fireworks-couch.jpg", alt: "Alt text" },
  { src: "sloop.jpg", alt: "Alt text" },
  { src: "moontuck.jpg", alt: "Alt text" }
], "These images all expand to fit the row width while maintaining equal height!" %}

I thought this would be a _cinch_ with CSS right out of the (flex)box, but after fiddling with combinations of `flex` and `object-fit` values, I realized it was less intuitive than I assumed.

[Here's a Codepen of the closest I got to a solution.](https://codepen.io/minttoothpick/pen/gbOvyvP) In this example, the images maintain their aspect ratios, but because I set an explicit `height` on each image, they don't fluidly expand to fill the row container.

So what's missing? It involves aspect ratios, of course!

## The solution: using aspect ratios as flex values

Eventually, I found this [Codepen by Pat McKenna](https://codepen.io/blimpage/pen/obWdgp) demonstrating a [technique by Kartik Prabhu](https://web.archive.org/web/20171029140328/https://kartikprabhu.com/articles/equal-height-images-flexbox) that was the key to solving this puzzle. (The concept is also explained well by [Oliver Pattison in their article](https://web.archive.org/web/20210510190400/https://olivermak.es/2017/01/fluid-grid/).)

The key is **using each image's aspect ratio as its `flex` value**:

```css
.fluid-row > img {
  flex: calc(width / height);
}
```

Here's a basic implementation:

```html
<figure class="fluid-row">
  <img
    src="landscape.jpg"
    alt="Landscape image"
    style="--aspect-ratio: 1.5;"
  />
  <img
    src="portrait.jpg"
    alt="Portrait image"
    style="--aspect-ratio: 0.8;"
  />
  <!-- more images... -->
</figure>
```

```css
.fluid-row {
  display: flex;
}

.fluid-row > img {
  width: 100%;
  flex: var(--aspect-ratio);
}
```

See [Equal-height flexible image row 2: solution](https://codepen.io/minttoothpick/pen/NPWwBBb) on Codepen.

## How the CSS works

Why/how does this work? Lemme review some flexbox basics. The `flex` property controls how much an item will grow or shrink _relative to other items_. By setting it to the aspect ratio (width divided by height in this case), I'm telling the browser to allocate space proportionally to the width the image needs to maintain its aspect ratio at a consistent height.

For example:

- A square image (1:1 ratio) would get a flex value of 1.
- A landscape image (e.g., 16:9 ratio) would get a flex value of 1.78.
- A portrait image (e.g., 3:4 ratio) would get a flex value of 0.75.

What's happening with the rule `flex: var(--aspect-ratio)`? Setting the shorthand `flex` rule with a single value expands it to this:

```css
flex-grow: [aspect-ratio];
flex-shrink: [aspect-ratio];
flex-basis: 0%;
```

Here's a summary of what each rule does:

- `flex-basis: 0%` tells the browser to start from zero width; don't consider the content or its intrinsic size.
- `flex-grow: [aspect-ratio]` tells the browser to grow this item proportionally to its aspect ratio. If one item has an aspect ratio of 2, and another has 1, the first one will take up twice as much horizontal space.
- `flex-shrink: [aspect-ratio]` - since `flex-basis` is 0% and the container isn't overflowing, this rule doesn't actually do anything in this case.

## Making it responsive with lazysizes

Okay, so this is nifty, but how the heck do I make it responsive?

Using `srcset` and `sizes` lets the browser choose the appropriate image size, but I need to know approximately what size the image will display at ahead of time so that I can set `sizes` appropriately.

With the flexbox technique I'm using, an image's width is dependent on the size of its neighbors, so I can't predict if a given image will be 50% of the viewport, or 10%, or any other value.

This is where the [**lazysizes** JavaScript library](https://github.com/aFarkas/lazysizes) comes to the rescue. It offers a handy feature: `data-sizes="auto"`.

After generating a few different sizes for each image and adding them to the `data-srcset` attribute, lazysizes can calculate the `sizes` attribute based on the current display width of the image. The browser can then select the best image from the `srcset`. Woohoo!

Here's a basic implementation with lazysizes:

```html
<div class="fluid-row">
  <img
    data-srcset="image-300.jpg 300w, image-600.jpg 600w, image-900.jpg 900w"
    data-sizes="auto"
    class="lazyload"
    style="--aspect-ratio: 1.5;"
    src="image-tiny.jpg"
    alt="My image"
  />
  <!-- more images... -->
</div>
```

## Automating with Eleventy and Nunjucks

Sweet. Now, another issue: there is no way I am going to manually calculate and hardcode the aspect ratio for each image. Let's put this all together and automate it with Eleventy!

We will create a Nunjucks shortcode that:

1. Accepts any number of images and their `alt` text.
2. Optionally accepts a caption for the containing `figure` element.
3. Uses the Eleventy Image plugin to:
   - Get each image's dimensions,
   - Calculate the aspect ratio,
   - Generate multiple sizes of each image, and
   - Create the proper `srcset` values.

The shortcode looks like this:

```liquid
{% raw %}{% imageRow [
  { src: "one.jpg", alt: "Alt text" },
  { src: "two.jpg", alt: "Alt text" },
  { src: "three.jpg", alt: "Alt text" }
], "Optional caption." %}{% endraw %}
```

## Building the shortcode

Here's what I have in my `.eleventy.js` file:

```js
eleventyConfig.addNunjucksAsyncShortcode(
  'imageRow',
  async function (images, caption = '') {
    const srcDir = 'src/images/';
    const outputDir = 'dist/images/';
    const imgUrlPath = '/images/';

    try {
      const imageData = await Promise.all(
        images.map(async (image) => {
          const fullImagePath = `${srcDir}${image.src}`;

          const metadata = await Image(fullImagePath, {
            widths: [300, 600, 900, 1200],
            formats: ['jpeg'],
            outputDir: outputDir,
            urlPath: imgUrlPath,
            filenameFormat: (id, src, width, format) => {
              const filename = path.basename(src, path.extname(src));
              return `${filename}-${width}w.${format}`;
            },
          });

          const data = metadata.jpeg;
          const largestImage = data[data.length - 1];
          return {
            srcset: data
              .map((entry) => `${entry.url} ${entry.width}w`)
              .join(', '),
            placeholder: data[0].url,
            aspectRatio: largestImage.width / largestImage.height,
            alt: image.alt || '',
          };
        })
      );

      const captionHtml = caption
        ? `<figcaption class="text-small">${caption}</figcaption>`
        : '';

      return `<figure><div class="image-row">
        ${imageData
          .map(
            (img) =>
              `<img src="${img.placeholder}"
                    data-srcset="${img.srcset}"
                    data-sizes="auto"
                    decoding="async"
                    class="lazyload"
                    style="--aspect-ratio: ${img.aspectRatio}"
                    loading="lazy"
                    alt="${img.alt}">`
          )
          .join('')}
      </div>
      ${captionHtml}
    </figure>`;
    } catch (error) {
      console.error('Error processing image row: ', error);
      return `<div class="error">Image could not be displayed.</div>`;
    }
  }
);
```

Let's walk through this bit by bit.

### Include plugins

```js
const Image = require('@11ty/eleventy-img');
const path = require('path');
```

Include the Eleventy Image plugin and `path` (this is available by default through Node; it provides utilities for working with file and directory paths). Put these two lines at the very top of `.eleventy.js`.

### Define the shortcode and path variables

```js
eleventyConfig.addNunjucksAsyncShortcode(
  "imageRow",
  async function (images, caption = "") {
    const srcDir = "src/images/";
    const outputDir = "dist/images/";
    const imgUrlPath = "/images/";
```

This registers the shortcode for use in Nunjucks templates. The parameters accept an array of image objects (each of these will contain a `src` and `alt` property), and an optional string to use for the `figcaption` on the entire row.

I'm also declaring variables to define where my source images are stored, where processed images will be saved, and the URL path to use in the generated HTML. You'll want to adjust these to match your project's directory structure.

### Process each image asynchronously

```js
const imageData = await Promise.all(
  images.map(async (image) => {
    const fullImagePath = `${srcDir}${image.src}`;
```

For each image, we construct the full path to the source file.

### Use Eleventy Image plugin to process the images

```js
const metadata = await Image(fullImagePath, {
  widths: [300, 600, 900, 1200],
  formats: ['jpeg'],
  outputDir: outputDir,
  urlPath: imgUrlPath,
  filenameFormat: (id, src, width, format) => {
    const filename = path.basename(src, path.extname(src));
    return `${filename}-${width}w.${format}`;
  },
});
```

Here, we choose the different pixel widths and formats to generate for each image, set the paths, and rename them in a human-readable filename format.

### Collect image metadata

```js
const data = metadata.jpeg;
const largestImage = data[data.length - 1];
return {
  srcset: data.map((entry) => `${entry.url} ${entry.width}w`).join(', '),
  placeholder: data[0].url,
  aspectRatio: largestImage.width / largestImage.height,
  alt: image.alt || '',
};
```

This constructs the `srcset`, uses the dimensions of the largest source image to calculate the aspect ratio, and sets the smallest image as our placeholder.

### Build the HTML output

```js
const captionHtml = caption
  ? `<figcaption class="text-small">${caption}</figcaption>`
  : '';

return `<figure><div class="image-row">
  ${imageData
    .map(
      (img) =>
        `<img src="${img.placeholder}"
              data-srcset="${img.srcset}"
              data-sizes="auto"
              decoding="async"
              class="lazyload"
              style="--aspect-ratio: ${img.aspectRatio}"
              loading="lazy"
              alt="${img.alt}">`
    )
    .join('')}
</div>
${captionHtml}
</figure>`;
```

Construct the HTML, including the attributes for lazysizes.

### Handle errors

```js
} catch (error) {
  console.error("Error processing image row: ", error);
  return `<div class="error">Image could not be displayed.</div>`;
}
```

Return an error in the console and HTML if we run into any issues.

## Wrapping up

**And that's it!** You now have a flexible, responsive image row component that automatically calculates aspect ratios and generates optimized images. The shortcode handles all the heavy lifting - just pass in your images and an optional caption. Good times.

You can [view the code on GitHub](https://github.com/minttoothpick/jeremyrobertjones.com/blob/main/src/shortcodes/imageRow.js) if you want to adapt it for your own project!

<script src="https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js" async></script>
