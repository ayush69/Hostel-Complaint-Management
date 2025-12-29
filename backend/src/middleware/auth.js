import { verifyToken } from '../utils/jwt.js';

export const authenticate = (req,res,next)=>{
	const auth = req.headers.authorization;
	if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({message:'No token'});
	const token = auth.split(' ')[1];
	try { 
		req.user = verifyToken(token);
		next(); 
	} catch(e){ 
		return res.status(401).json({message:'Invalid or expired token'}); 
	}
};

export const requireRole = (role) => (req,res,next)=>{
	if (req.user && req.user.role === role) return next();
	return res.status(403).json({message:'Forbidden - role required: '+role});
};
