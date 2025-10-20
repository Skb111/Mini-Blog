import { Request, Response } from "express";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../model/User";

export async function register(req: Request, res: Response) {
    try {
        const { name, email, password } = req.body as {
            name: string;
            email: string;
            password: string;
        };

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email, and password are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Email already in use" });
        }

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const newUser = new User({ name, email, passwordHash });

        const secret: Secret = process.env["JWT_SECRET"] || "default_secret";
        const options: SignOptions = { expiresIn: process.env["JWT_EXPIRES_IN"] as SignOptions["expiresIn"] || "7d" };

        const token = jwt.sign({ id: newUser._id }, secret, options);

        await newUser.save();

        return res.status(201).json({
            token,
            user: { id: newUser._id, name: newUser.name, email: newUser.email },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", error });
    }
}


// login a user
export async function login(req: Request, res: Response) {
    try {
        const { email, password } = req.body as {
            email: string;
            password: string;
        };
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const passwordMatch = await bcrypt.compare(password, user.passwordHash);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const secret: Secret = process.env["JWT_SECRET"] || "default_secret";
        const options: SignOptions = { expiresIn: process.env["JWT_EXPIRES_IN"] as SignOptions["expiresIn"] || "7d" };
        const token = jwt.sign({ id: user._id }, secret, options);
        return res.status(200).json({
            token,
            user: { id: user._id, name: user.name, email: user.email },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Login failed", error });
    }
};

export default { register, login };