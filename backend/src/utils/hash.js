import bcrypt from 'bcryptjs';

const SALT = 10;

export const hashPassword = (p) => bcrypt.hash(p, SALT);
export const comparePassword = (p,h) => bcrypt.compare(p,h);
