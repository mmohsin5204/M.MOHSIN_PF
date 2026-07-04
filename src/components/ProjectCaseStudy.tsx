import { useEffect } from 'react';
import { motion } from 'motion/react';
import { X, ExternalLink, Github, Sparkles, BookOpen, Layers, Award } from 'lucide-react';
import { Project } from '../types.ts';
import MagneticButton from './MagneticButton.tsx';
import { getProjectImage } from '../utils/projectImages.ts';

interface ProjectCaseStudyProps {
  project: Project;
  onClose: () => void;
  darkMode: boolean;
}

export default function ProjectCaseStudy({ project, onClose, darkMode }: ProjectCaseStudyProps) {
  // Lock body scroll when case study is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const { problem, approach, my_role, results } = project.case_study_content ? (
    typeof project.case_study_content === 'string'
      ? JSON.parse(project.case_study_content)
      : project.case_study_content
  ) : { problem: '', approach: '', my_role: '', results: '' };

  const techStack = typeof project.tech_stack === 'string' 
    ? JSON.parse(project.tech_stack) 
    : project.tech_stack;

  const imageUrls = typeof project.image_urls === 'string'
    ? JSON.parse(project.image_urls)
    : project.image_urls;

  const headerImage = getProjectImage(project.slug) || imageUrls?.[0] || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-40 overflow-y-auto bg-stone-950/95 backdrop-blur-md text-stone-100 flex justify-center"
      id="case-study-overlay"
    >
      {/* Background Tactile Noise Overlay */}
      <div className="absolute inset-0 bg-noise pointer-events-none opacity-20 z-0" />

      <div className="relative w-full max-w-5xl px-6 md:px-12 py-12 md:py-24 z-10">
        
        {/* Sticky Close Button */}
        <div className="fixed top-6 right-6 z-50">
          <MagneticButton
            onClick={onClose}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-stone-900/80 border border-stone-800 backdrop-blur-md text-stone-200 hover:text-white hover:border-stone-700 transition-colors shadow-lg"
          >
            <X className="w-5 h-5" />
          </MagneticButton>
        </div>

        {/* Content Container */}
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 120 }}
          className="space-y-16"
        >
          {/* Header metadata */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-xs uppercase tracking-wider"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Project Details
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-7xl font-display font-bold tracking-tight text-white leading-none"
            >
              {project.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-stone-400 font-sans max-w-3xl font-light"
            >
              {project.short_description}
            </motion.p>
          </div>

          {/* Large Full-Bleed Parallax Header Image */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="relative h-[250px] md:h-[500px] w-full rounded-2xl overflow-hidden border border-stone-800/80 shadow-2xl group"
          >
            <img
              src={headerImage}
              alt={project.title}
              className="w-full h-full object-cover transform scale-105 group-hover:scale-100 transition-transform duration-[2s] ease-out"
            />
            {/* Ambient vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent opacity-80" />
            
            {/* Quick Action links */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {techStack?.map((tag: string, i: number) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-md bg-stone-900/85 backdrop-blur-sm border border-stone-800 text-stone-300 font-mono text-xs uppercase"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="flex gap-3">
                {project.project_url && (
                  <a
                    href={project.project_url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-mono text-xs uppercase font-medium transition-colors"
                    data-cursor="pointer"
                  >
                    Live Demo
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-200 hover:text-white border border-stone-800 transition-colors"
                    data-cursor="pointer"
                  >
                    GitHub
                    <Github className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </motion.div>

          {/* Grid Layout Case Study Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-8">
            
            {/* Left Sidebar Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8 lg:border-r lg:border-stone-800/80 lg:pr-8"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-stone-400 font-mono text-xs uppercase tracking-wider">
                  <Award className="w-4 h-4 text-blue-500" />
                  My Role
                </div>
                <p className="text-lg text-stone-200 font-display font-medium">
                  {my_role || 'Lead Creative Technologist'}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-stone-400 font-mono text-xs uppercase tracking-wider">
                  <Layers className="w-4 h-4 text-purple-500" />
                  Technologies Used
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {techStack?.map((tag: string, i: number) => (
                    <span
                      key={i}
                      className="px-2 py-1 rounded bg-stone-900 border border-stone-800/60 text-stone-300 font-mono text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <h4 className="text-stone-300 font-display font-medium text-sm uppercase tracking-wide">
                  Share Case Study
                </h4>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Link copied to clipboard!');
                    }}
                    className="text-xs font-mono px-3 py-1.5 rounded bg-stone-900 border border-stone-800 hover:border-stone-700 transition-colors text-stone-400 hover:text-stone-200"
                    data-cursor="pointer"
                  >
                    Copy URL
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Right Main Column Details */}
            <div className="lg:col-span-2 space-y-12">
              
              {/* Problem Section */}
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2 text-blue-500 font-mono text-xs uppercase tracking-wider">
                  <BookOpen className="w-4 h-4" />
                  The Problem / Objectives
                </div>
                <p className="text-stone-300 font-sans text-base md:text-lg leading-relaxed font-light">
                  {problem}
                </p>
              </motion.section>

              {/* Approach Section */}
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2 text-purple-500 font-mono text-xs uppercase tracking-wider">
                  <Layers className="w-4 h-4" />
                  The Approach & Architecture
                </div>
                <p className="text-stone-300 font-sans text-base md:text-lg leading-relaxed font-light">
                  {approach}
                </p>
              </motion.section>

              {/* Results Section */}
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-4 bg-stone-900/40 border border-stone-800/80 rounded-2xl p-6 md:p-8"
              >
                <div className="flex items-center gap-2 text-green-500 font-mono text-xs uppercase tracking-wider">
                  <Award className="w-4 h-4" />
                  Project Outcomes & Results
                </div>
                <p className="text-stone-200 font-sans text-base md:text-lg leading-relaxed font-light italic">
                  &ldquo;{results}&rdquo;
                </p>
              </motion.section>

            </div>

          </div>

          {/* Bottom Footer Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center justify-between border-t border-stone-800/80 pt-8"
          >
            <div className="text-stone-500 font-mono text-xs mb-4 sm:mb-0">
              Released under MIT License &bull; Creative Technologist
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={onClose}
                className="text-stone-400 hover:text-stone-100 font-mono text-xs uppercase font-medium transition-colors"
                data-cursor="pointer"
              >
                Back to projects
              </button>
              
              {project.project_url && (
                <a
                  href={project.project_url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="px-6 py-2.5 rounded-full bg-blue-500 text-white font-mono text-xs uppercase tracking-wider font-semibold hover:bg-blue-600 transition-all shadow-lg"
                  data-cursor="pointer"
                >
                  Launch App
                </a>
              )}
            </div>
          </motion.div>

        </motion.div>
      </div>
    </motion.div>
  );
}
