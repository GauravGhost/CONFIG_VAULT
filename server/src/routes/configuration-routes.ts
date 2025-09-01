import createRouter from '../lib/async-router.js'
import { checkUserAuth } from '../lib/jwt.js';
import ConfigurationController from '../controllers/configuration-controller.js';

const router = createRouter();
const configurationController = new ConfigurationController();

router.getAsync('/:id', checkUserAuth, configurationController.getConfigurationById);
router.getAsync('/project/:projectId', checkUserAuth, configurationController.getConfigurationsByProjectId);
router.getAsync('/:id/details', checkUserAuth, configurationController.getConfigurationByProjectIdWithDetails);
router.postAsync('/', checkUserAuth, configurationController.createConfiguration);
router.getAsync('/:id', checkUserAuth, configurationController.getConfigurationById);
router.putAsync('/:id', checkUserAuth, configurationController.updateConfiguration);
router.deleteAsync('/:id', checkUserAuth, configurationController.deleteConfiguration);

export default router;