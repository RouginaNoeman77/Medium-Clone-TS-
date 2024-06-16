import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IArticle extends Document {
  title: string;
  summary: string;
  body: string;
  tags: string[];
  author: Types.ObjectId | string; 
  viewers: number;
  likes: number;
  createdAt: Date;
}

const articleSchema: Schema = new mongoose.Schema({
  title: { type: String, required: true },
  summary: { type: String, required: true },
  body: { type: String, required: true },
  tags: [{ type: String }],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  viewers: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const Article = mongoose.model<IArticle>('Article', articleSchema);

export default Article;
