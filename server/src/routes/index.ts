import { Router } from 'express';
import userRoutes from './user-routes.js';
import authRoutes from './auth-routes.js';
import projectRoutes from './project-routes.js';
import configurationRoutes from './configuration-routes.js';
import configurationDetailsRoutes from './configuration-details-routes.js'
const router = Router();

// API ROUTES
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/projects', projectRoutes);
router.use('/configurations', configurationRoutes);
router.use('/configuration-details', configurationDetailsRoutes);

export default router;
