import router from '../lib/async-router.js'
import UserController from '../controllers/user-controller.js';

const userController = new UserController();

router.postAsync('/', userController.createUser);
router.getAsync('/:id', userController.getUserById);
router.putAsync('/:id', userController.updateUser);
router.deleteAsync('/:id', userController.deleteUser);

export default router;
