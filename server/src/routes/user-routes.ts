import router from '../lib/async-router.js'
import UserController from '../controllers/user-controller.js';
import { checkUserAuth } from '../lib/jwt.js';

const userController = new UserController();

router.postAsync('/', userController.createUser);
router.getAsync('/profile', checkUserAuth, userController.getProfile);
router.postAsync('/change-password', checkUserAuth, userController.changePassword);
router.getAsync('/:id', checkUserAuth, userController.getUserById);
router.putAsync('/:id', userController.updateUser);
router.deleteAsync('/:id', userController.deleteUser);

export default router;
