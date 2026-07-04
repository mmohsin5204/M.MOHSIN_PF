import type { VercelRequest, VercelResponse } from '@vercel/node';
import { get, initDb } from '../_db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const slug = Array.isArray(req.query.slug) ? req.query.slug[0] : req.query.slug;

  if (!slug) {
    res.status(400).json({ error: 'Project slug is required' });
    return;
  }

  try {
    await initDb();

    const project = await get<any>('SELECT * FROM projects WHERE slug = ?', [slug]);

    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    const parsedProject = {
      ...project,
      case_study_content: JSON.parse(project.case_study_content),
      tech_stack: JSON.parse(project.tech_stack),
      image_urls: JSON.parse(project.image_urls),
    };

    res.status(200).json(parsedProject);
  } catch (error: any) {
    console.error(`Error fetching project ${slug}:`, error);
    res.status(500).json({ error: 'Failed to retrieve project details' });
  }
}
