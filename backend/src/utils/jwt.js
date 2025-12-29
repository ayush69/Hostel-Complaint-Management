import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'change_this_secret';

export function generateToken(payload, expires='7d'){ 
  return jwt.sign(payload, SECRET, { expiresIn: expires }); 
}

export function verifyToken(token){ 
  return jwt.verify(token, SECRET); 
}
