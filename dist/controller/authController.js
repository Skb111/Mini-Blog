"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = __importDefault(require("../model/User"));
async function register(req, res) {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email, and password are required" });
        }
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Email already in use" });
        }
        const saltRounds = 10;
        const passwordHash = await bcrypt_1.default.hash(password, saltRounds);
        const newUser = new User_1.default({ name, email, passwordHash });
        const secret = process.env["JWT_SECRET"] || "default_secret";
        const options = { expiresIn: process.env["JWT_EXPIRES_IN"] || "7d" };
        const token = jsonwebtoken_1.default.sign({ id: newUser._id }, secret, options);
        await newUser.save();
        return res.status(201).json({
            token,
            user: { id: newUser._id, name: newUser.name, email: newUser.email },
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", error });
    }
}
// login a user
async function login(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const passwordMatch = await bcrypt_1.default.compare(password, user.passwordHash);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const secret = process.env["JWT_SECRET"] || "default_secret";
        const options = { expiresIn: process.env["JWT_EXPIRES_IN"] || "7d" };
        const token = jsonwebtoken_1.default.sign({ id: user._id }, secret, options);
        return res.status(200).json({
            token,
            user: { id: user._id, name: user.name, email: user.email },
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Login failed", error });
    }
}
;
exports.default = { register, login };
