import { Router } from 'express';
import userRoutes from './user-routes.js';
import authRoutes from './auth-routes.js';
import projectRoutes from './project-routes.js';

const router = Router();

// API ROUTES
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/projects', projectRoutes);

export default router;
