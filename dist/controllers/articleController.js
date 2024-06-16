"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserFeed = exports.likeArticle = exports.getArticleById = exports.createArticle = void 0;
const Article_1 = __importDefault(require("../models/Article"));
const User_1 = __importDefault(require("../models/User"));
const Tag_1 = __importDefault(require("../models/Tag"));
const createArticle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, summary, body, tags } = req.body;
    if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    const article = new Article_1.default({
        title,
        summary,
        body,
        tags,
        author: req.user._id, // Save the ObjectId of the user
    });
    try {
        yield article.save();
        // Ensure tags are added to the Tag collection
        for (const tagName of tags) {
            let tag = yield Tag_1.default.findOne({ name: tagName });
            if (!tag) {
                tag = new Tag_1.default({ name: tagName, articleCount: 1 });
            }
            else {
                tag.articleCount += 1;
            }
            yield tag.save();
        }
        res.status(201).json(article);
    }
    catch (error) {
        res.status(400).json({ message: 'Error creating article', error });
    }
});
exports.createArticle = createArticle;
const getArticleById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const article = yield Article_1.default.findById(req.params.id).populate('author', 'username');
        if (article) {
            article.viewers += 1;
            yield article.save();
            // Increment visit count for each tag associated with the article
            for (const tagName of article.tags) {
                const tag = yield Tag_1.default.findOne({ name: tagName });
                if (tag) {
                    tag.visitCount += 1;
                    yield tag.save();
                }
            }
            res.json(article);
        }
        else {
            res.status(404).json({ message: 'Article not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching article', error });
    }
});
exports.getArticleById = getArticleById;
const likeArticle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const article = yield Article_1.default.findById(req.params.id);
        if (article) {
            article.likes += 1;
            yield article.save();
            res.json(article);
        }
        else {
            res.status(404).json({ message: 'Article not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error liking article', error });
    }
});
exports.likeArticle = likeArticle;
const getUserFeed = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = yield User_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
        if (user) {
            const followedTags = user.followedTags;
            const followedPublishers = user.followedPublishers;
            const articles = yield Article_1.default.find({
                $or: [
                    { tags: { $in: followedTags } },
                    { author: { $in: followedPublishers } }, // Compare ObjectId
                ],
            }).sort({ createdAt: -1 }).populate('author', 'username');
            res.json(articles);
        }
        else {
            res.status(404).json({ message: 'User not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching feed', error });
    }
});
exports.getUserFeed = getUserFeed;
