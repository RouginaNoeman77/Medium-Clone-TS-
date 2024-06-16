"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.followPublisher = exports.followTag = exports.signIn = exports.signUp = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("../models/User"));
const Article_1 = __importDefault(require("../models/Article"));
const jwt = __importStar(require("jsonwebtoken"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    const userExists = yield User_1.default.findOne({ email });
    if (userExists) {
        res.status(400).json({ message: 'User already exists' });
        return;
    }
    const user = yield User_1.default.create({ username, email, password });
    if (user) {
        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id),
        });
    }
    else {
        res.status(400).json({ message: 'Invalid user data' });
    }
});
exports.signUp = signUp;
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield User_1.default.findOne({ email });
    if (user && (yield user.matchPassword(password))) {
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id),
        });
    }
    else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
});
exports.signIn = signIn;
const followTag = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { tag } = req.body;
    try {
        const user = yield User_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
        if (user && !user.followedTags.includes(tag)) {
            user.followedTags.push(tag);
            yield user.save();
        }
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Error following tag', error });
    }
});
exports.followTag = followTag;
const followPublisher = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { publisherId } = req.body;
    try {
        const publisher = yield User_1.default.findById(publisherId);
        if (!publisher) {
            res.status(404).json({ message: 'Publisher not found' });
            return;
        }
        const articles = yield Article_1.default.find({ author: publisherId });
        if (articles.length === 0) {
            res.status(400).json({ message: 'User is not a publisher' });
            return;
        }
        const user = yield User_1.default.findById((_b = req.user) === null || _b === void 0 ? void 0 : _b._id);
        if (user && !user.followedPublishers.includes(new mongoose_1.default.Types.ObjectId(publisherId))) {
            user.followedPublishers.push(new mongoose_1.default.Types.ObjectId(publisherId));
            yield user.save();
        }
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Error following publisher', error });
    }
});
exports.followPublisher = followPublisher;
