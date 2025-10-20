"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectDB = exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        const mongoURI = process.env['MONGODB_URI'] || "mongodb://localhost:27017/mydatabase";
        if (!mongoURI) {
            throw new Error("MongoDB connection string is not defined in environment variables");
        }
        await mongoose_1.default.connect(mongoURI);
        console.log("Connected to MongoDB");
        process.on('SIGINT', async () => {
            await mongoose_1.default.connection.close();
            console.log("MongoDB connection closed due to app termination");
            process.exit(0);
        });
    }
    catch (error) {
        throw new Error(`Failed to connect to MongoDB: ${error}`);
    }
};
exports.connectDB = connectDB;
const disconnectDB = async () => {
    try {
        await mongoose_1.default.connection.close();
        console.log("Disconnected from MongoDB");
    }
    catch (error) {
        throw new Error(`Failed to disconnect from MongoDB: ${error}`);
    }
};
exports.disconnectDB = disconnectDB;
