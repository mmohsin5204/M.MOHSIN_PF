import type { VercelRequest, VercelResponse } from '@vercel/node';
import { initDb, run } from './_db.js';

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { name, email, message } = req.body || {};

  if (typeof name !== 'string' || !name.trim()) {
    res.status(400).json({ error: 'Name is required' });
    return;
  }

  if (name.trim().length > 50) {
    res.status(400).json({ error: 'Name cannot exceed 50 characters' });
    return;
  }

  if (typeof email !== 'string' || !isValidEmail(email.trim())) {
    res.status(400).json({ error: 'A valid email address is required' });
    return;
  }

  if (typeof message !== 'string' || !message.trim()) {
    res.status(400).json({ error: 'Message content is required' });
    return;
  }

  if (message.trim().length > 2000) {
    res.status(400).json({ error: 'Message cannot exceed 2000 characters' });
    return;
  }

  try {
    await initDb();

    const result = await run(
      `INSERT INTO contact_submissions (name, email, message, status) VALUES (?, ?, ?, 'pending')`,
      [name.trim(), email.trim(), message.trim()]
    );

    res.status(201).json({
      success: true,
      message: 'Your message has been captured successfully.',
      submissionId: result.lastID,
    });
  } catch (error: any) {
    console.error('Error saving contact submission:', error);
    res.status(500).json({ error: 'Failed to record your submission in the database' });
  }
}
