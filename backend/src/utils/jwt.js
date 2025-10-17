const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'change_this_secret';
function generateToken(payload, expires='7d'){ return jwt.sign(payload, SECRET, { expiresIn: expires }); }
function verifyToken(token){ return jwt.verify(token, SECRET); }
module.exports = { generateToken, verifyToken };
