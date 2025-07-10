const path = require('path');
const Image = require('@11ty/eleventy-img');

module.exports = async function imageRow(images, caption = '') {
  const srcDir = 'src/images/';
  const outputDir = 'dist/images/';
  const imgUrlPath = '/images/';

  try {
    const imageData = await Promise.all(
      images.map(async (image) => {
        const fullImagePath = `${srcDir}${image.src}`;

        const metadata = await Image(fullImagePath, {
          widths: [300, 600, 900, 1200],
          formats: ['avif', 'webp', 'jpeg'],
          outputDir: outputDir,
          urlPath: imgUrlPath,
          filenameFormat: (id, src, width, format) => {
            const filename = path.basename(src, path.extname(src));
            return `${filename}-${width}w.${format}`;
          },
        });

        const jpegData = metadata.jpeg;
        const webpData = metadata.webp;
        const avifData = metadata.avif;
        const largestJpeg = jpegData[jpegData.length - 1];

        return {
          avifSrcset: avifData
            .map((entry) => `${entry.url} ${entry.width}w`)
            .join(', '),
          webpSrcset: webpData
            .map((entry) => `${entry.url} ${entry.width}w`)
            .join(', '),
          jpegSrcset: jpegData
            .map((entry) => `${entry.url} ${entry.width}w`)
            .join(', '),
          placeholder: jpegData[0].url,
          aspectRatio: largestJpeg.width / largestJpeg.height,
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
            `<div class="image-row__item" style="--aspect-ratio: ${img.aspectRatio}">
              <picture>
                <source type="image/avif" data-srcset="${img.avifSrcset}" data-sizes="auto">
                <source type="image/webp" data-srcset="${img.webpSrcset}" data-sizes="auto">
                <img src="${img.placeholder}"
                     data-srcset="${img.jpegSrcset}"
                     data-sizes="auto"
                     decoding="async"
                     class="lazyload"
                     alt="${img.alt}"
                >
              </picture>
            </div>`
        )
        .join('')}
      </div>
      ${captionHtml}
    </figure>`;
  } catch (error) {
    console.error('Error processing image row: ', error);
    return `<div class="error">Image could not be displayed.</div>`;
  }
};
