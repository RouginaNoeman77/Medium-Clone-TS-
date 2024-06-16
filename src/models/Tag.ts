import mongoose, { Document, Schema } from 'mongoose';

export interface ITag extends Document {
  name: string;
  articleCount: number;
  visitCount: number;
}

const tagSchema: Schema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  articleCount: { type: Number, default: 0 },
  visitCount: { type: Number, default: 0 },
});

const Tag = mongoose.model<ITag>('Tag', tagSchema);

export default Tag;
