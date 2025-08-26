import { Router } from 'express';
import UserController from '../controllers/user-controller.js';

const router = Router();
const userController = new UserController();

// User routes
router.post('/', userController.createUser);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

export default router;
