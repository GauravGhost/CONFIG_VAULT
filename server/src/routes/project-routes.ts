import router from '../lib/async-router.js'
import { checkUserAuth } from '../lib/jwt.js';
import ProjectController from '../controllers/project-controller.js';

const projectController = new ProjectController();

router.postAsync('/', checkUserAuth, projectController.createProject);
router.getAsync('/:id', checkUserAuth, projectController.getProjectById);
router.putAsync('/:id', checkUserAuth, projectController.updateProject);
router.deleteAsync('/:id', checkUserAuth, projectController.deleteProject);

export default router;