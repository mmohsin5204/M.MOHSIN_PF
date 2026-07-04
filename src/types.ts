export interface Project {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  case_study_content: string; // JSON String representing detailed case study
  tech_stack: string; // JSON array or comma-separated string
  image_urls: string; // JSON array or comma-separated string
  project_url: string | null;
  github_url: string | null;
  is_featured: number; // 1 or 0
  display_order: number;
  created_at: string;
}

export interface CaseStudy {
  problem: string;
  approach: string;
  my_role: string;
  results: string;
}

export interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  message: string;
  status: string; // 'pending', 'reviewed'
  created_at: string;
}

export interface Experience {
  id: number;
  role: string;
  company: string;
  duration: string;
  description: string;
  tags: string[];
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  text: string;
  avatar: string;
}
