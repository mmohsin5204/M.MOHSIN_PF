import type { VercelRequest, VercelResponse } from '@vercel/node';
import { all, initDb } from './_db.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await initDb();

    const projects = await all<any>('SELECT * FROM projects ORDER BY display_order ASC');
    const parsedProjects = projects.map((project) => ({
      ...project,
      case_study_content: typeof project.case_study_content === 'string'
        ? JSON.parse(project.case_study_content)
        : project.case_study_content,
      tech_stack: typeof project.tech_stack === 'string'
        ? JSON.parse(project.tech_stack)
        : project.tech_stack,
      image_urls: typeof project.image_urls === 'string'
        ? JSON.parse(project.image_urls)
        : project.image_urls,
    }));

    res.status(200).json(parsedProjects);
  } catch (error: any) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to retrieve projects from database' });
  }
}
