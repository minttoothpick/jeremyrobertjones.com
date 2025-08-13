import fs from 'fs';
import crypto from 'crypto';
import resume from './resumeConfig.js';

export default async function () {
  const buffer = fs.readFileSync(resume.sourcePath);
  const hash = crypto.createHash('md5').update(buffer).digest('hex');
  return {
    resumePdf: hash,
  };
}
