import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { all, get, run } from '../db.ts';
import { Project, ContactSubmission } from '../types.ts';

// 1. Fetch all projects ordered by display_order
export async function getProjects(req: Request, res: Response): Promise<void> {
  try {
    const projects = await all<any>('SELECT * FROM projects ORDER BY display_order ASC');
    
    // Parse JSON strings back to arrays/objects
    const parsedProjects = projects.map(p => ({
      ...p,
      case_study_content: JSON.parse(p.case_study_content),
      tech_stack: JSON.parse(p.tech_stack),
      image_urls: JSON.parse(p.image_urls)
    }));

    res.json(parsedProjects);
  } catch (error: any) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to retrieve projects from database' });
  }
}

// 2. Fetch single project by slug
export async function getProjectBySlug(req: Request, res: Response): Promise<void> {
  const { slug } = req.params;
  try {
    const project = await get<any>('SELECT * FROM projects WHERE slug = ?', [slug]);
    
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    const parsedProject = {
      ...project,
      case_study_content: JSON.parse(project.case_study_content),
      tech_stack: JSON.parse(project.tech_stack),
      image_urls: JSON.parse(project.image_urls)
    };

    res.json(parsedProject);
  } catch (error: any) {
    console.error(`Error fetching project ${slug}:`, error);
    res.status(500).json({ error: 'Failed to retrieve project details' });
  }
}

// 3. Submit contact form (express-validator errors are checked here)
export async function submitContactForm(req: Request, res: Response): Promise<void> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { name, email, message } = req.body;

  try {
    const sql = `
      INSERT INTO contact_submissions (name, email, message, status)
      VALUES (?, ?, ?, 'pending')
    `;
    const result = await run(sql, [name, email, message]);

    res.status(201).json({
      success: true,
      message: 'Your message has been captured successfully.',
      submissionId: result.lastID
    });
  } catch (error: any) {
    console.error('Error saving contact submission:', error);
    res.status(500).json({ error: 'Failed to record your submission in the database' });
  }
}
