const path = require("path");
const Image = require("@11ty/eleventy-img");

module.exports = async function imageRow(images, caption = "") {
  const srcDir = "src/images/";
  const outputDir = "dist/images/";
  const imgUrlPath = "/images/";

  try {
    const imageData = await Promise.all(
      images.map(async (image) => {
        const fullImagePath = `${srcDir}${image.src}`;

        const metadata = await Image(fullImagePath, {
          widths: [300, 600, 900, 1200],
          formats: ["jpeg"],
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
            .join(", "),
          placeholder: data[0].url,
          aspectRatio: largestImage.width / largestImage.height,
          alt: image.alt || "",
        };
      })
    );

    const captionHtml = caption
      ? `<figcaption class="text-small">${caption}</figcaption>`
      : "";

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
        .join("")}
    </div>
    ${captionHtml}
  </figure>`;
  } catch (error) {
    console.error("Error processing image row: ", error);
    return `<div class="error">Image could not be displayed.</div>`;
  }
};
