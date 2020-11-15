const moment = require('moment');

const m = moment();
m.add(2, 'days');
console.log(m.format());
console.log(m.format('YYYY-MM-DD'));

const u = moment()
console.log(u.format())
console.log(u.utc().format())

console.log(moment.months());
console.log(moment.weekdays());

