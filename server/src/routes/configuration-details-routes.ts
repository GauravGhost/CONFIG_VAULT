import createRouter from '../lib/async-router.js'
import { checkUserAuth } from '../lib/jwt.js';
import ConfigurationController from '../controllers/configuration-controller.js';

const router = createRouter();
const configurationDetialsController = new ConfigurationController();

router.postAsync('/', checkUserAuth, configurationDetialsController.createConfigurationDetail);
router.putAsync('/:id', checkUserAuth, configurationDetialsController.updateConfigurationDetail);
router.deleteAsync('/:id', checkUserAuth, configurationDetialsController.deleteConfigurationDetail);

export default router;