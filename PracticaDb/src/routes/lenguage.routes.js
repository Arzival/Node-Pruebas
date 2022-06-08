import {Router} from 'express';
import { methods as lenguageController } from '../controllers/lenguage.controller';

const router = Router();

router.get('/api/lenguages', lenguageController.getLenguage);
router.post('/api/lenguages', lenguageController.createLenguage);
router.put('/api/lenguages/:id', lenguageController.updateLenguage);

export default router;