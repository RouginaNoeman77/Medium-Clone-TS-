"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const articleSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    summary: { type: String, required: true },
    body: { type: String, required: true },
    tags: [{ type: String }],
    author: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true }, // Ref to User model
    viewers: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
});
const Article = mongoose_1.default.model('Article', articleSchema);
exports.default = Article;
