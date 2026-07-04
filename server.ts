import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { body } from 'express-validator';
import rateLimit from 'express-rate-limit';
import { initDb } from './src/db.ts';

import {
  getProjects,
  getProjectBySlug,
  submitContactForm
} from './src/controllers/portfolioController.ts';

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));

  // JSON and URL-encoded body parsers
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Initialize relational SQLite database tables & indexes on boot
  try {
    await initDb();
  } catch (error) {
    console.error('CRITICAL: Database schema initialization failed:', error);
    process.exit(1);
  }

  // Rate limiter for contact submissions to prevent spam (max 10 submissions in 15 mins)
  const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    message: { error: 'Too many messages sent from this IP. Please wait 15 minutes before retrying.' },
    standardHeaders: true,
    legacyHeaders: false,
  });

  // Validation rules for contact form
  const contactValidation = [
    body('name')
      .trim()
      .notEmpty().withMessage('Name is required')
      .isLength({ max: 50 }).withMessage('Name cannot exceed 50 characters'),
    body('email')
      .trim()
      .isEmail().withMessage('A valid email address is required'),
    body('message')
      .trim()
      .notEmpty().withMessage('Message content is required')
      .isLength({ max: 2000 }).withMessage('Message cannot exceed 2000 characters')
  ];

  // --- API ROUTING REGISTRY ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Fetch all projects (dynamically loaded from database)
  app.get('/api/projects', getProjects);

  // Fetch project details by slug
  app.get('/api/projects/:slug', getProjectBySlug);

  // Securely Submit Contact Form with spam rate-limiting and validation
  app.post('/api/contact', contactLimiter, contactValidation, submitContactForm);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Application server running on: http://0.0.0.0:${PORT}`);
  });
}

startServer();
