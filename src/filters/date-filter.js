const moment = require('moment');

module.exports = (value) => {
  // "15th of June 2025"
  // const dateObject = moment(value);
  // return `${dateObject.format('Do')} of ${dateObject.format('MMMM YYYY')}`;

  // "June 15, 2025"
  return moment(value).format('MMMM D, YYYY');
};
