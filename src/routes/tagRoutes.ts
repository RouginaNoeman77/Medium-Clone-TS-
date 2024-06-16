import * as express from 'express';
import { getPopularTags, getMostVisitedTags } from '../controllers/tagController';

const router = express.Router();

router.get('/popular', getPopularTags);
router.get('/most-visited', getMostVisitedTags);

export default router;
