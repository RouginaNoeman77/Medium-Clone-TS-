import { Request, Response } from 'express';
import mongoose, { Types } from 'mongoose';
import User, { IUser } from '../models/User';
import Article from '../models/Article';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();

interface AuthRequest extends Request {
  user?: IUser;
}

const generateToken = (id: Types.ObjectId): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: '30d' });
};

export const signUp = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400).json({ message: 'User already exists' });
    return;
  }

  const user = await User.create({ username, email, password });

  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id as Types.ObjectId),
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

export const signIn = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id as Types.ObjectId),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

export const followTag = async (req: AuthRequest, res: Response): Promise<void> => {
  const { tag } = req.body;

  try {
    const user = await User.findById(req.user?._id);
    if (user && !user.followedTags.includes(tag)) {
      user.followedTags.push(tag);
      await user.save();
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error following tag', error });
  }
};

export const followPublisher = async (req: AuthRequest, res: Response): Promise<void> => {
  const { publisherId } = req.body;

  try {
    const publisher = await User.findById(publisherId);
    if (!publisher) {
      res.status(404).json({ message: 'Publisher not found' });
      return;
    }

    const articles = await Article.find({ author: publisherId });
    if (articles.length === 0) {
      res.status(400).json({ message: 'User is not a publisher' });
      return;
    }

    const user = await User.findById(req.user?._id);
    if (user && !user.followedPublishers.includes(publisherId)) {
      user.followedPublishers.push(publisherId as unknown as Types.ObjectId);
      await user.save();
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error following publisher', error });
  }
};
