import swaggerUi  from 'swagger-ui-express';
import swaggerSpec from './config/swagger';
import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import { connectDB } from './config/database';
import morgan from 'morgan';  
import cors from 'cors';

dotenv.config();
dotenv.config();

console.log("Loaded Mongo URI:", process.env['MONGODB_URI']);


const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
const PORT = process.env['PORT'];

app.get('/', (req, res) => {
  res.status(200).json({message: "Hello, Mini Blog!"});
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

connectDB().catch((error) => {
  console.log("Failed to connect to the database:", error);
//   process.exit(1);
});
