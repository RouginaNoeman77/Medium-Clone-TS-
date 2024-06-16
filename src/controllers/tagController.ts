import { Request, Response } from 'express';
import Tag from '../models/Tag';

export const getPopularTags = async (req: Request, res: Response): Promise<void> => {
  try {
    const tags = await Tag.find().sort({ articleCount: -1 }).limit(10);
    res.json(tags);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tags', error });
  }
};

export const getMostVisitedTags = async (req: Request, res: Response): Promise<void> => {
  try {
    const tags = await Tag.find().sort({ visitCount: -1 }).limit(10);
    res.json(tags);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tags', error });
  }
};
