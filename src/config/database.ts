import mongoose from "mongoose";

export const connectDB = async () : Promise<void> => {
  try {
   const mongoURI = process.env['MONGODB_URI'] || "mongodb://localhost:27017/mydatabase";


   if(!mongoURI) {
    throw new Error("MongoDB connection string is not defined in environment variables");
  }
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB");
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log("MongoDB connection closed due to app termination");
      process.exit(0);
    });
}
  catch (error) {
    throw new Error(`Failed to connect to MongoDB: ${error}`);
  }
};

export const disconnectDB = async () : Promise<void> => {
  try {
    await mongoose.connection.close();
    console.log("Disconnected from MongoDB");
    } catch (error) {
        throw new Error(`Failed to disconnect from MongoDB: ${error}`);
    }
};