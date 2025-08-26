import { Router } from 'express';
import userRoutes from './user-routes.js';

const router = Router();

// API ROUTES
router.use('/users', userRoutes);

export default router;
