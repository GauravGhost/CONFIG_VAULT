import router from '../lib/async-router.js'
import AuthController from '../controllers/auth-controller.js';

const authController = new AuthController();

router.postAsync('/login', authController.login);
router.postAsync('/register', authController.register);

export default router;
