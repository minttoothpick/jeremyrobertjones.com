const fs = require("fs");
const crypto = require("crypto");

module.exports = async () => {
  const pdfPath = "./src/docs/Jeremy_Jones_Web_Manager_Resume.pdf";
  const pdfBuffer = fs.readFileSync(pdfPath);
  const hash = crypto.createHash("md5").update(pdfBuffer).digest("hex");
  return {
    resumePdf: hash,
  };
};
