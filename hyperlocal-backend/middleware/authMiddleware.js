// import jwt from 'jsonwebtoken';
// import { JWT_SECRET } from '../config.js';
// import { User } from '../models/User.js';

// const authenticate = (req, res, next)=> {
//     const authHeader = req.headers.authorization;

//     if(!authHeader || !authHeader.startsWith('Bearer'))
//         return res.status(400).json({message: 'Unauthorized'})
//     const token = authHeader.split(' ')[1];

//     try{
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded;
//         next();
//     }catch(err){
//         console.log(err.name, err.message);
//         return res.status(403).json({message: 'Invalid token'});
//     }
// };

// export const Authorize =(...allowedRoles)=> {
//     return(req, res, next)=>{
//         if(!allowedRoles.includes(req.user.allowedRoles))
//             return res.status(403).json({message: 'Access deined insurance'})
//         next();
//     };
// };

// export default authenticate;
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';
import { User } from '../models/User.js';

// Fallback if JWT_SECRET isn\'t exported from config
const SECRET = JWT_SECRET || process.env.JWT_SECRET;

/**
 * authenticate middleware
 * -----------------------
 * Verifies the access‑token sent in the `Authorization: Bearer <token>` header.
 * Attaches the full (sanitised) user document to `req.user` so downstream
 * handlers can trust role / id information without a second DB call.
 */
export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization || '';

  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET);

    // optional: pull a fresh copy of the user so role / status is up‑to‑date
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user; // 
    return next();
  } catch (err) {
    console.error(err.name, err.message);
    const msg = err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token';
    return res.status(401).json({ message: msg });
  }
};

/**
 * Authorize middleware
 * --------------------
 * Usage: `Authorize('admin')`, `Authorize('provider', 'admin')`, etc.
 * Accepts one or many roles and compares them with `req.user.role`.
 */
export const Authorize = (...allowedRoles) => {
    
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthenticated' });
    }

    if (!allowedRoles.includes(req.user.role)) {
        console.log("ROLE:", req.user.role); // add this line

      return res.status(403).json({ message: 'Access denied' });
    }

    return next();
  };
};

// Allow both named and default import patterns
export default authenticate;
