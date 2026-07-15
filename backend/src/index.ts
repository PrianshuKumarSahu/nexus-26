import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import chatRoutes from './routes/chatRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Security Middlewares
app.use(helmet()); // Sets 15+ secure HTTP headers
app.use(cors());
app.use(express.json());

// Rate Limiting to prevent DDoS / brute-force on Gemini API
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use('/api/', apiLimiter);

// Routes
app.use('/api/chat', chatRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'FIFA 26 Smart Assist API is running' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
