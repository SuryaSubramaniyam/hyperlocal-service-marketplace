import express from 'express';
import {register, login}  from '../controllers/authControllers.js';
import authenticate, {Authorize} from '../middleware/authMiddleware.js';
import { updateUser } from '../controllers/authControllers.js';
import { updateProviderProfile } from "../controllers/providerController.js";
const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.get('/user', authenticate, (req, res)=>{
    res.json({message: 'Welcome Authenticated User'});
})
router.get('/admin', authenticate, Authorize('admin'),(req, res)=>{
    res.json({message: 'Welcome Admin User'});
})
router.post('/register/provider', async (req, res) => {
  req.body.role = 'provider';
  return register(req, res);         // reuse the same controller
});

router.get("/:id", async (req, res) => {
  const user = await user.findById(req.params.id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});
router.put('/:id', authenticate, updateUser);
router.put("/:id", authenticate, updateProviderProfile);

export default router;