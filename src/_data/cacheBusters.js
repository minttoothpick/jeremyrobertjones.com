const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const resume = require('./resumeConfig');

module.exports = async () => {
  const buffer = fs.readFileSync(resume.sourcePath);
  const hash = crypto.createHash('md5').update(buffer).digest('hex');
  return {
    resumePdf: hash,
  };
};
