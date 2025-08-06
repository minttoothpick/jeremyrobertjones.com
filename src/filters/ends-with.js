module.exports = function endsWith(str, suffix) {
  if (typeof str !== 'string' || typeof suffix !== 'string') {
    return false;
  }
  return str.toLowerCase().endsWith(suffix.toLowerCase());
};
