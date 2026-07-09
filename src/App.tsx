import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  ArrowDown,
  Moon,
  Sun,
  Menu,
  X,
  ExternalLink,
  Laptop,
  CheckCircle,
  FolderKanban,
  UserCheck,
  ChevronRight,
  ShieldAlert,
  Loader2,
  Download,
  Check
} from 'lucide-react';
import { Project } from './types.ts';
import { getProjectImage } from './utils/projectImages.ts';
import { API_URL } from './config.ts';

// Component imports
import CustomCursor from './components/CustomCursor.tsx';
import MagneticButton from './components/MagneticButton.tsx';
import CanvasParticleField from './components/CanvasParticleField.tsx';
import HeroMarquee from './components/HeroMarquee.tsx';
import ProjectCaseStudy from './components/ProjectCaseStudy.tsx';
import Timeline from './components/Timeline.tsx';
import ContactForm from './components/ContactForm.tsx';

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  
  // Custom navigation
  const navigate = (to: string) => {
    window.history.pushState(null, '', to);
    setCurrentPath(to);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Listen for browser forward/back buttons
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // Fetch projects dynamically from the database
  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await fetch(`${API_URL}/api/projects`);
        const data = await res.json();
        if (res.ok) {
          setProjects(data);
        }
      } catch (err) {
        console.error('Failed to load projects from Express API:', err);
      } finally {
        setLoadingProjects(false);
      }
    }
    loadProjects();
  }, []);

  // ROUTER GATEWAY
  if (currentPath !== '/' && currentPath !== '') {
    // 404 Page fallback
    return <Custom404Page onGoHome={() => navigate('/')} />;
  }

  return <PortfolioMain projects={projects} loadingProjects={loadingProjects} />;
}

// -------------------------------------------------------------
// MAIN PORTFOLIO SCREEN
// -------------------------------------------------------------
interface PortfolioMainProps {
  projects: Project[];
  loadingProjects: boolean;
}

function PortfolioMain({ projects, loadingProjects }: PortfolioMainProps) {
  const darkMode = false;
  const [preloaderComplete, setPreloaderComplete] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [showHeader, setShowHeader] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [cvDownloading, setCvDownloading] = useState(false);

  const lastScrollY = useRef(0);

  // About 3D Image Tilt Coordinates
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // Floating Interactive Skills List
  const SKILLS = [
    { name: 'React', level: '95%', color: 'text-blue-400' },
    { name: 'TypeScript', level: '92%', color: 'text-blue-500' },
    { name: 'Three.js', level: '85%', color: 'text-purple-400' },
    { name: 'Node.js', level: '90%', color: 'text-green-500' },
    { name: 'MySQL', level: '88%', color: 'text-indigo-400' },
    { name: 'Framer Motion', level: '96%', color: 'text-pink-400' },
    { name: 'Tailwind CSS', level: '98%', color: 'text-cyan-400' },
    { name: 'WebGL Canvas', level: '82%', color: 'text-amber-500' }
  ];

  // Simulated initials animation preloader timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setPreloaderComplete(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Theme Class Synchronizer - permanently remove dark
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('dark');
  }, []);

  // Scroll Behavior: Hide on Scroll-Down, Show on Scroll-Up + Scrollspy Active indicators
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Header state
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setShowHeader(false); // scrolling down
      } else {
        setShowHeader(true); // scrolling up
      }
      lastScrollY.current = currentScrollY;

      // Scrollspy logic
      const sections = ['hero', 'about', 'projects', 'experience', 'skills', 'contact'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 160 && rect.bottom >= 160) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDownloadCV = () => {
    setCvDownloading(true);
    const link = document.createElement('a');
    link.href = '/MOHAMMAD_MOHSIN_CV.pdf';
    link.download = 'MOHAMMAD_MOHSIN_CV.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => {
      setCvDownloading(false);
    }, 2000);
  };

  // About profile photo 3D tilt calculations
  const handleMouseMoveTilt = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const { left, top, width, height } = card.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / (width / 2);
    const y = (e.clientY - top - height / 2) / (height / 2);
    setTilt({ x: x * 15, y: -y * 15 }); // 15 degrees max tilt
  };

  const handleMouseLeaveTilt = () => {
    setTilt({ x: 0, y: 0 });
  };

  const roleTicker = [
    'Mohsin',
    'Freelance Full-Stack Developer',
    'React & Tailwind Specialist',
    'Framer Motion Wizard',
    'Node.js & Express Expert',
    'MySQL & SQLite Architect',
    'Fiverr Freelancer'
  ];

  return (
    <>
      {/* 1. Page Load Initials Animated Preloader */}
      <AnimatePresence>
        {!preloaderComplete && (
          <motion.div
            key="preloader"
            exit={{ y: '-100vh', opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-stone-950 text-white"
          >
            <div className="absolute inset-0 bg-noise pointer-events-none opacity-20" />
            <div className="space-y-6 text-center z-10">
              {/* Initials stagger entry */}
              <motion.div className="flex gap-2 text-4xl md:text-6xl font-display font-bold tracking-widest text-blue-500">
                {['M', '.', 'M', 'o', 'h', 's', 'i', 'n'].map((letter, idx) => (
                  <motion.span
                    key={idx}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      delay: idx * 0.1,
                      type: 'spring',
                      stiffness: 120,
                      damping: 10
                    }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </motion.div>

              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 140 }}
                transition={{ delay: 0.8, duration: 1.2, ease: 'easeInOut' }}
                className="h-[2px] bg-white/20 mx-auto overflow-hidden"
              >
                <div className="h-full bg-blue-500 animate-pulse w-full" />
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                transition={{ delay: 1.4 }}
                className="font-mono text-xs tracking-widest uppercase"
              >
                Loading Portfolio...
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Custom High-Craft Mouse Coordinates Ring */}
      <CustomCursor />

      {/* 3. Base layout canvas */}
      <div className="min-h-screen font-sans bg-noise transition-colors duration-500 bg-stone-50 text-stone-900">
        {/* Background Noise Layer */}
        <div className="fixed inset-0 bg-noise pointer-events-none opacity-20 z-0" />

        {/* 4. Sticky Glassmorphic Navbar */}
        <AnimatePresence>
          {showHeader && (
            <motion.header
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              className="fixed top-0 left-0 right-0 z-30 transition-all duration-300 px-6 py-4"
            >
              <div className="max-w-6xl mx-auto rounded-full border border-stone-200/40 bg-white/40 backdrop-blur-md px-6 py-3 flex items-center justify-between shadow-lg">
                <a
                  href="#hero"
                  className="font-display font-bold text-lg tracking-wider text-stone-900 flex items-center gap-1.5"
                  data-cursor="pointer"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  M.Mohsin
                </a>

                {/* Desktop menu */}
                <nav className="hidden md:flex items-center gap-6">
                  {[
                    { id: 'hero', label: 'Home' },
                    { id: 'about', label: 'About' },
                    { id: 'projects', label: 'Projects' },
                    { id: 'experience', label: 'Education' },
                    { id: 'skills', label: 'Skills' },
                    { id: 'contact', label: 'Contact' }
                  ].map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={`text-xs font-mono tracking-widest uppercase transition-colors relative ${
                        activeSection === item.id
                          ? 'text-blue-500 font-bold'
                          : 'text-stone-500 hover:text-stone-900'
                      }`}
                      data-cursor="pointer"
                    >
                      {item.label}
                      {activeSection === item.id && (
                        <motion.span
                          layoutId="activeDot"
                          className="absolute -bottom-1 left-0 right-0 h-[2px] bg-blue-500 rounded-full"
                        />
                      )}
                    </a>
                  ))}
                </nav>

                <div className="flex items-center gap-3">
                  {/* Mobile burger toggle */}
                  <button
                    onClick={() => setMobileMenuOpen(true)}
                    className="md:hidden w-10 h-10 flex items-center justify-center rounded-full border border-stone-200/50 bg-stone-100/50 text-stone-500 hover:text-blue-500 transition-colors"
                  >
                    <Menu className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.header>
          )}
        </AnimatePresence>

        {/* 5. Mobile Full-screen Overlay Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-stone-950 flex flex-col justify-between p-8 text-white"
            >
              <div className="flex justify-between items-center">
                <span className="font-display font-bold tracking-widest text-blue-500 text-lg">M.Mohsin</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-12 h-12 flex items-center justify-center rounded-full border border-stone-800 bg-stone-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation links staggers */}
              <nav className="flex flex-col gap-6 my-auto text-left pl-4">
                {[
                  { id: 'hero', label: 'Home' },
                  { id: 'about', label: 'About' },
                  { id: 'projects', label: 'Projects' },
                  { id: 'experience', label: 'Education' },
                  { id: 'skills', label: 'Skills' },
                  { id: 'contact', label: 'Contact' }
                ].map((item, idx) => (
                  <motion.a
                    initial={{ x: -40, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-4xl font-display font-bold uppercase tracking-tight hover:text-blue-500 transition-colors"
                  >
                    {item.label}
                  </motion.a>
                ))}
              </nav>

              <div className="text-center font-mono text-[10px] text-stone-500">
                &copy; 2026 Creative Technologist &bull; All Rights Secured
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 6. HERO SECTION */}
        <section
          id="hero"
          className="relative min-h-screen w-full flex flex-col justify-between items-center overflow-hidden pt-32 pb-0 z-10"
        >
          {/* Subtle interactive particle sphere background */}
          <CanvasParticleField />

          <div className="w-full max-w-5xl px-6 flex-1 flex flex-col justify-center text-center space-y-8 z-10">
            {/* Kinetic Type / Split Stagger text entry */}
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-[10px] md:text-xs uppercase tracking-wider"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Available for new projects
              </motion.div>

              <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-display font-bold tracking-tight text-stone-900 leading-none uppercase">
                <span className="block mask-clip">
                  <motion.span
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                    className="inline-block text-blue-500"
                  >
                    CRAFTING
                  </motion.span>
                </span>
                <span className="block mask-clip">
                  <motion.span
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.7, duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                    className="inline-block text-stone-800"
                  >
                    EXPERIENCES
                  </motion.span>
                </span>
              </h1>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="text-sm md:text-base text-stone-500 max-w-xl mx-auto leading-relaxed font-light"
            >
              Freelance Full-Stack Web Developer based in Karachi, Pakistan, crafting premium digital platforms, responsive interactions, and robust database architectures.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 w-full max-w-xs sm:max-w-none mx-auto"
            >
              <MagneticButton
                onClick={() => {
                  const el = document.getElementById('projects');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3.5 rounded-full bg-black text-white font-mono text-xs uppercase tracking-widest font-semibold hover:bg-stone-900 transition-colors flex items-center gap-1.5 shadow-lg"
              >
                Projects
                <ArrowDown className="w-3.5 h-3.5" />
              </MagneticButton>

              <div className="relative">
                <MagneticButton
                  onClick={handleDownloadCV}
                  className="px-6 py-3.5 rounded-full bg-amber-400 text-black font-mono text-xs uppercase tracking-widest font-semibold hover:bg-amber-500 transition-colors flex items-center gap-1.5 shadow-lg"
                >
                  Download CV
                  <Download className="w-3.5 h-3.5" />
                </MagneticButton>

                <AnimatePresence>
                  {cvDownloading && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 5, scale: 0.95 }}
                      className="absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-stone-900 text-white text-[10px] font-mono rounded-md shadow-md flex items-center gap-1 z-10 whitespace-nowrap"
                    >
                      <Check className="w-3 h-3 text-green-400" />
                      <span>Downloading CV...</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Infinitely scrolling ticker strip */}
          <div className="w-full z-10 pt-6 md:pt-10 lg:pt-16 pb-0">
            <HeroMarquee items={roleTicker} />
          </div>
        </section>

        {/* 7. ABOUT SECTION */}
        <section
          id="about"
          className="relative pt-6 md:pt-10 lg:pt-16 pb-24 px-6 md:px-12 w-full max-w-5xl mx-auto border-t border-stone-200/20 z-10"
        >
          <div className="grid grid-cols-2 gap-3 md:grid-cols-12 md:gap-16 items-start">
            
            {/* Split Left: 3D Tilting Image */}
            <div className="col-span-1 md:col-span-5 flex justify-center">
              <motion.div
                onMouseMove={handleMouseMoveTilt}
                onMouseLeave={handleMouseLeaveTilt}
                style={{
                  transformStyle: 'preserve-3d',
                  perspective: 1000
                }}
                animate={{
                  rotateX: tilt.x,
                  rotateY: tilt.y
                }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="relative w-full max-w-[180px] sm:max-w-[220px] h-[220px] sm:h-[260px] md:max-w-[280px] md:h-[360px] rounded-3xl overflow-hidden border border-stone-200/60 shadow-2xl group cursor-help"
                data-cursor="pointer"
              >
                {/* Profile Placeholder Image with elegant canvas gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-900 via-stone-950 to-purple-950 flex items-center justify-center text-white">
                  {/* Subtle portrait mock representation */}
                  <img
                    src="/mohsin.png"
                    alt="Mohsin - Full-Stack Web Developer"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover filter grayscale contrast-125 opacity-70 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  />
                  
                  {/* Glowing halo overlay */}
                  <div className="absolute inset-0 bg-radial-gradient from-blue-500/10 via-transparent to-transparent opacity-60 pointer-events-none" />
                </div>

                <div
                  style={{ transform: 'translateZ(40px)' }}
                  className="absolute bottom-4 sm:bottom-5 md:bottom-6 left-4 sm:left-5 md:left-6 right-4 sm:right-5 md:right-6 p-3 sm:p-4 rounded-2xl bg-stone-900/80 backdrop-blur-md border border-stone-800 text-left"
                >
                  <p className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-semibold font-bold">EST. 2019</p>
                  <h4 className="text-sm font-display font-bold text-white uppercase">CREATIVE CODING LABS</h4>
                </div>
              </motion.div>
            </div>

            {/* Split Right: Text Reveal and Skills display */}
            <div className="col-span-1 md:col-span-7 space-y-5 sm:space-y-6 text-left">
              <div className="space-y-4">
                <h2 className="text-xs font-mono text-blue-500 uppercase tracking-widest font-bold">
                  About Me
                </h2>
                <h3 className="text-lg sm:text-xl md:text-4xl font-display font-bold text-stone-950 tracking-tight">
                  I engineer high-fidelity, scalable web applications with beautiful interfaces.
                </h3>
                <p className="text-stone-500 font-sans font-light leading-relaxed text-[11px] sm:text-[12px] md:text-base">
                  Hi, I&apos;m Mohsin, a Freelance Full-Stack Web Developer based in Karachi, Pakistan. I specialize in building complete digital products on Fiverr using React (Vite), Tailwind CSS, and Framer Motion on the frontend, backed by fast Node.js/Express APIs and secure relational database architectures.
                </p>
              </div>

              {/* Skills grid with micro interactivity */}
              <div className="space-y-4 pt-4">
                <h4 className="text-xs font-mono text-stone-400 uppercase tracking-widest font-semibold">
                  Core Skills
                </h4>
                
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {SKILLS.map((skill, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-stone-50/50 border border-stone-200/50 hover:border-blue-500/30 hover:bg-stone-100/50 transition-all duration-300"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        <span className="text-[9px] sm:text-[10px] font-mono tracking-wide text-stone-700">
                          {skill.name}
                        </span>
                      </div>
                      <span className={`text-[8px] sm:text-[9px] font-mono font-bold ${skill.color}`}>
                        {skill.level}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 8. PROJECTS SECTION */}
        <section
          id="projects"
          className="relative py-24 px-6 md:px-12 w-full max-w-5xl mx-auto border-t border-stone-200/20 z-10"
        >
          <div className="space-y-12">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 text-left">
              <div className="space-y-2">
                <h2 className="text-xs font-mono text-blue-500 uppercase tracking-widest font-bold">
                  PROJECT SHOWCASE
                </h2>
                <h3 className="text-3xl md:text-4xl font-display font-bold text-stone-950 tracking-tight">
                  Recent Work
                </h3>
              </div>
              <p className="text-stone-400 font-mono text-xs">
                Loaded from database
              </p>
            </div>

            {/* Case Studies grid */}
            {loadingProjects ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                <p className="font-mono text-xs text-stone-500">Querying database...</p>
              </div>
            ) : projects.length === 0 ? (
              <div className="p-12 text-center rounded-2xl border border-stone-200 bg-stone-100/10 text-stone-400">
                <p className="text-sm">No portfolio projects loaded.</p>
                <p className="text-xs text-stone-500 mt-1">Check database seeds configuration.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 md:gap-8">
                {projects.map((proj) => {
                  const images = typeof proj.image_urls === 'string'
                    ? JSON.parse(proj.image_urls)
                    : proj.image_urls;
                  const thumb = getProjectImage(proj.slug) || images?.[0] || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80';

                  const tags = typeof proj.tech_stack === 'string'
                    ? JSON.parse(proj.tech_stack)
                    : proj.tech_stack;

                  return (
                    <motion.div
                      key={proj.id}
                      onClick={() => setSelectedProject(proj)}
                      className="group cursor-none rounded-2xl overflow-hidden border border-stone-200/60 bg-white/45 backdrop-blur-sm hover:border-blue-500/30 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between p-3 md:p-4"
                      data-cursor="view"
                    >
                      {/* Image Thumbnail Container */}
                      <div className="relative h-[150px] sm:h-[180px] md:h-[220px] rounded-xl overflow-hidden mb-3 sm:mb-4 bg-stone-100 border border-stone-200/20">
                        <img
                          src={thumb}
                          alt={proj.title}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                        {/* Overlay shadow vignette */}
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 via-transparent to-transparent opacity-60" />
                        
                        {/* Interactive floating badges */}
                        <div className="absolute top-2 left-2 right-2 flex flex-wrap gap-1">
                          {tags?.slice(0, 3).map((tag: string, i: number) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded bg-stone-900/80 backdrop-blur-sm border border-stone-800 text-stone-200 font-mono text-[8px] sm:text-[9px] uppercase tracking-wider"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Project info details */}
                      <div className="space-y-2 text-left flex-1 flex flex-col justify-between min-h-0">
                        <div className="space-y-1.5">
                          <h4 className="text-sm sm:text-base md:text-lg font-display font-bold text-stone-900 group-hover:text-blue-500 transition-colors">
                            {proj.title}
                          </h4>
                          <p className="text-[10px] sm:text-xs text-stone-500 font-sans font-light leading-relaxed line-clamp-3">
                            {proj.short_description}
                          </p>
                        </div>

                        {/* Stagger link action */}
                        <div className="flex items-center gap-1 text-blue-500 font-mono text-[9px] sm:text-xs uppercase font-medium pt-3 group-hover:translate-x-1.5 transition-transform duration-300">
                          View Project
                          <ChevronRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* 9. EXPERIENCE SECTION (TIMELINE) */}
        <section
          id="experience"
          className="relative py-24 px-6 md:px-12 w-full max-w-5xl mx-auto border-t border-stone-200/20 z-10"
        >
          <div className="space-y-12">
            <div className="text-center space-y-2">
              <h2 className="text-xs font-mono text-blue-500 uppercase tracking-widest font-bold">
                EDUCATION TIMELINE
              </h2>
              <h3 className="text-3xl md:text-4xl font-display font-bold text-stone-950 tracking-tight">
                Academic Qualifications & Learning Milestones
              </h3>
            </div>

            <Timeline />
          </div>
        </section>

        {/* 10. SKILLS SECTION */}
        <section
          id="skills"
          className="relative py-24 px-6 md:px-12 w-full max-w-5xl mx-auto border-t border-stone-200/20 z-10"
        >
          <div className="space-y-12">
            <div className="text-center space-y-2">
              <h2 className="text-xs font-mono text-blue-500 uppercase tracking-widest font-bold">
                EXPERTISE & CAPABILITIES
              </h2>
              <h3 className="text-3xl md:text-4xl font-display font-bold text-stone-950 tracking-tight">
                My Professional Skillset
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-2 md:gap-8">
              {/* Card 1: Technical Skills */}
              <div className="p-3 sm:p-4 md:p-6 rounded-2xl border border-stone-200 bg-white/80 backdrop-blur-sm hover:border-blue-500/30 transition-all duration-300 shadow-xl flex flex-col justify-between">
                <div>
                  <h4 className="text-sm sm:text-base md:text-xl font-display font-bold text-stone-900 mb-3 sm:mb-4 border-b border-stone-100 pb-2">Technical Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'HTML5',
                      'CSS3',
                      'JavaScript',
                      'TypeScript',
                      'ReactJS',
                      'Angular (Basics)',
                      'Material UI',
                      'Bootstrap',
                      'jQuery',
                      'PHP',
                      'Laravel',
                      'ASP.NET Core MVC',
                      'RESTful APIs',
                      'C#',
                      'Dart (Basics)',
                      'Flutter (Basics)'
                    ].map((skill, i) => (
                      <span key={i} className="px-2 py-0.5 text-[8px] sm:text-[9px] font-mono tracking-wider rounded bg-stone-100 border border-stone-200 text-stone-700 uppercase">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card 2: Database */}
              <div className="p-3 sm:p-4 md:p-6 rounded-2xl border border-stone-200 bg-white/80 backdrop-blur-sm hover:border-blue-500/30 transition-all duration-300 shadow-xl flex flex-col justify-between">
                <div>
                  <h4 className="text-sm sm:text-base md:text-xl font-display font-bold text-stone-900 mb-3 sm:mb-4 border-b border-stone-100 pb-2">Database</h4>
                  <div className="flex flex-wrap gap-2">
                    {['MySQL', 'SQL Server', 'MongoDB (Basics)'].map((skill, i) => (
                      <span key={i} className="px-2 py-0.5 text-[8px] sm:text-[9px] font-mono tracking-wider rounded bg-stone-100 border border-stone-200 text-stone-700 uppercase">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card 3: Tools */}
              <div className="p-3 sm:p-4 md:p-6 rounded-2xl border border-stone-200 bg-white/80 backdrop-blur-sm hover:border-blue-500/30 transition-all duration-300 shadow-xl flex flex-col justify-between">
                <div>
                  <h4 className="text-sm sm:text-base md:text-xl font-display font-bold text-stone-900 mb-3 sm:mb-4 border-b border-stone-100 pb-2">Tools</h4>
                  <div className="flex flex-wrap gap-2">
                    {['MS Office', 'MS Word', 'MS Excel', 'VS Code', 'Git', 'GitHub', 'Microsoft Azure (Basics)'].map((skill, i) => (
                      <span key={i} className="px-2 py-0.5 text-[8px] sm:text-[9px] font-mono tracking-wider rounded bg-stone-100 border border-stone-200 text-stone-700 uppercase">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card 4: Soft Skills */}
              <div className="p-3 sm:p-4 md:p-6 rounded-2xl border border-stone-200 bg-white/80 backdrop-blur-sm hover:border-blue-500/30 transition-all duration-300 shadow-xl flex flex-col justify-between">
                <div>
                  <h4 className="text-sm sm:text-base md:text-xl font-display font-bold text-stone-900 mb-3 sm:mb-4 border-b border-stone-100 pb-2">Soft Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Active', 'Punctual', 'Good Learner', 'Team Worker', 'Hard Working', 'Motivated', 'Eager to Learn'].map((skill, i) => (
                      <span key={i} className="px-2 py-0.5 text-[8px] sm:text-[9px] font-mono tracking-wider rounded bg-stone-100 border border-stone-200 text-stone-700 uppercase">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 11. CONTACT SECTION */}
        <section
          id="contact"
          className="relative py-24 px-6 md:px-12 w-full max-w-5xl mx-auto border-t border-stone-200/20 z-10"
        >
          <div className="space-y-12">
            <div className="text-center space-y-2">
              <h2 className="text-xs font-mono text-blue-500 uppercase tracking-widest font-bold">
                Contact Me
              </h2>
              <h3 className="text-3xl md:text-4xl font-display font-bold text-stone-950 tracking-tight">
                Ready to discuss your next project?
              </h3>
            </div>

            <ContactForm />
          </div>
        </section>

        {/* 12. IMMERSIVE COMPOSITE FOOTER */}
        <footer className="w-full border-t border-stone-200/20 bg-stone-100/50 backdrop-blur-sm py-12 px-6 z-10 relative">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left space-y-2">
              <h3 className="font-display font-bold text-lg tracking-wider">M.Mohsin</h3>
              <p className="text-xs text-stone-500 font-mono">
                Freelance Full-Stack Developer &amp; Fiverr Specialist
              </p>
            </div>

            <div className="text-xs font-mono text-stone-500">
              &copy; 2026 M.Mohsin &amp; Built with React &amp; Express
            </div>
          </div>
        </footer>
      </div>

      {/* 13. Dynamic Case Study Overlay Panel */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectCaseStudy
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
            darkMode={darkMode}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// -------------------------------------------------------------
// CUSTOM 404 PAGE COMPONENT
// -------------------------------------------------------------
interface Custom404PageProps {
  onGoHome: () => void;
}

function Custom404Page({ onGoHome }: Custom404PageProps) {
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col items-center justify-center p-6 text-center bg-noise">
      <div className="absolute inset-0 bg-noise pointer-events-none opacity-20" />
      <div className="space-y-6 max-w-md z-10">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        
        <h1 className="text-6xl font-display font-bold text-white tracking-tight">404</h1>
        
        <h3 className="text-lg font-mono text-red-500 uppercase tracking-widest">
          Page Not Found
        </h3>
        
        <p className="text-stone-400 text-sm font-sans font-light leading-relaxed">
          The page you are looking for does not exist or has been moved.
        </p>

        <MagneticButton
          onClick={onGoHome}
          className="px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-xs font-mono uppercase tracking-widest font-semibold shadow-lg"
        >
          Go Back Home
        </MagneticButton>
      </div>
    </div>
  );
}
