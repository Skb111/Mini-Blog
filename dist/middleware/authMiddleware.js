"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function requireAuth(req, res, next) {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authorization header missing or malformed' });
        }
        const token = authHeader.slice("Bearer".length);
        const secret = process.env['JWT_SECRET'];
        if (!secret) {
            return res.status(500).json({ message: 'JWT secret is missing' });
        }
        const payload = jsonwebtoken_1.default.verify(token, secret);
        req.userId = payload.id;
        next();
        return;
    }
    catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}
exports.default = requireAuth;
