import * as express from 'express';
import { createArticle, getArticleById, likeArticle, getUserFeed } from '../controllers/articleController';
import protect from '../middlewares/auth';

const router = express.Router();

router.post('/', protect, createArticle);
router.get('/feed', protect, getUserFeed);
router.get('/:id', getArticleById);
router.post('/:id/like', protect, likeArticle);

export default router;
