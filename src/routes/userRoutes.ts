import * as express from 'express';
import { signUp, signIn, followTag, followPublisher } from '../controllers/userController';
import protect from '../middlewares/auth';

const router = express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/follow-tag', protect, followTag);
router.post('/follow-publisher', protect, followPublisher);

export default router;
