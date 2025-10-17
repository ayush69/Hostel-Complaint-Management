const bcrypt = require('bcryptjs');
const SALT = 10;
module.exports.hashPassword = (p) => bcrypt.hash(p, SALT);
module.exports.comparePassword = (p,h) => bcrypt.compare(p,h);
