import path from 'path';
import Image from '@11ty/eleventy-img';

export default async function imageSingle(
  image,
  imgClasses = 'post__feature-image',
  formats = ['avif', 'webp', 'png'],
  widths = [300, 600, 900, 1200, 1600, 1900, 2200]
) {
  const srcDir = 'src/images/';
  const outputDir = 'dist/images/';
  const imgUrlPath = '/images/';

  try {
    const fullImagePath = `${srcDir}${image.src}`;

    const metadata = await Image(fullImagePath, {
      widths: widths,
      formats: formats,
      outputDir: outputDir,
      urlPath: imgUrlPath,
      filenameFormat: (id, src, width, format) => {
        const filename = path.basename(src, path.extname(src));
        return `${filename}-${width}w.${format}`;
      },
    });

    // Use 'png' as fallback/base format
    const imgData = metadata.png;
    const largestImg = imgData[imgData.length - 1];

    const aspectRatio = largestImg.width / largestImg.height;
    const alt = image.alt || '';
    const url = largestImg.url;

    // Build sources for <picture>
    const sources = formats
      .filter((f) => metadata[f])
      .map((format) => {
        const srcset = metadata[format]
          .map((entry) => `${entry.url} ${entry.width}w`)
          .join(', ');
        return `<source type="image/${format}" srcset="${srcset}" sizes="(max-width: 950px) 90vw, 950px">`;
      })
      .join('\n');

    return `<picture>
    ${sources}
    <img
      class="${imgClasses}"
      src="${
        imgData.find((img) => img.width === 900)?.url ||
        imgData[Math.floor(imgData.length / 2)].url
      }"
      srcset="${imgData.map((e) => `${e.url} ${e.width}w`).join(', ')}"
      sizes="(max-width: 950px) 90vw, 950px"
      alt="${alt}"
      style="aspect-ratio: ${largestImg.width} / ${largestImg.height};"
      loading="eager"
      fetchpriority="high"
      decoding="async"
    >
  </picture>`;
  } catch (error) {
    console.error('Error processing single image: ', error);
    return `<div class="error">Image could not be displayed.</div>`;
  }
}
