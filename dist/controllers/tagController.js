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
exports.getMostVisitedTags = exports.getPopularTags = void 0;
const Tag_1 = __importDefault(require("../models/Tag"));
const getPopularTags = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tags = yield Tag_1.default.find().sort({ articleCount: -1 }).limit(10);
        res.json(tags);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching tags', error });
    }
});
exports.getPopularTags = getPopularTags;
const getMostVisitedTags = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tags = yield Tag_1.default.find().sort({ visitCount: -1 }).limit(10);
        res.json(tags);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching tags', error });
    }
});
exports.getMostVisitedTags = getMostVisitedTags;
