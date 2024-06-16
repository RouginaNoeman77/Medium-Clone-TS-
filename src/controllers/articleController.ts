import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Article, { IArticle } from '../models/Article';
import User from '../models/User';
import Tag from '../models/Tag';

interface AuthRequest extends Request {
  user?: any;
}

export const createArticle = async (req: AuthRequest, res: Response): Promise<void> => {
  const { title, summary, body, tags } = req.body;

  if (!req.user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const article = new Article({
    title,
    summary,
    body,
    tags,
    author: req.user._id, // Save the ObjectId of the user
  });

  try {
    await article.save();

    // Ensure tags are added to the Tag collection
    for (const tagName of tags) {
      let tag = await Tag.findOne({ name: tagName });
      if (!tag) {
        tag = new Tag({ name: tagName, articleCount: 1 });
      } else {
        tag.articleCount += 1;
      }
      await tag.save();
    }

    res.status(201).json(article);
  } catch (error) {
    res.status(400).json({ message: 'Error creating article', error });
  }
};

export const getArticleById = async (req: Request, res: Response): Promise<void> => {
  try {
    const article = await Article.findById(req.params.id).populate('author', 'username');
    if (article) {
      article.viewers += 1;
      await article.save();

      // Increment visit count for each tag associated with the article
      for (const tagName of article.tags) {
        const tag = await Tag.findOne({ name: tagName });
        if (tag) {
          tag.visitCount += 1;
          await tag.save();
        }
      }

      res.json(article);
    } else {
      res.status(404).json({ message: 'Article not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching article', error });
  }
};

export const likeArticle = async (req: Request, res: Response): Promise<void> => {
  try {
    const article = await Article.findById(req.params.id);
    if (article) {
      article.likes += 1;
      await article.save();
      res.json(article);
    } else {
      res.status(404).json({ message: 'Article not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error liking article', error });
  }
};

export const getUserFeed = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id);
    if (user) {
      const followedTags = user.followedTags;
      const followedPublishers = user.followedPublishers;

      const articles = await Article.find({
        $or: [
          { tags: { $in: followedTags } },
          { author: { $in: followedPublishers } }, // Compare ObjectId
        ],
      }).sort({ createdAt: -1 }).populate('author', 'username');

      res.json(articles);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching feed', error });
  }
};
