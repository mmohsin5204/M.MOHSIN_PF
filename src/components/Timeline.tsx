import { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import { Briefcase, Milestone, Sparkles, Terminal } from 'lucide-react';
import { Experience } from '../types.ts';

const FREELANCE_TIMELINE: Experience[] = [
  {
    id: 1,
    role: 'Aptech Certified ADSE',
    company: 'Aptech Computer Education, Pakistan',
    duration: '2024 - Ongoing',
    description: 'Advanced Diploma in Software Engineering covering Web Dev, Database, and Programming.',
    tags: ['Web Dev', 'Database', 'Programming', 'Software Eng']
  },
  {
    id: 2,
    role: 'Bachelor of Commerce (B.COM)',
    company: 'Allama Iqbal Open University',
    duration: '2024 - Ongoing',
    description: 'Higher education focusing on business and commerce fundamentals.',
    tags: ['Commerce', 'Business', 'Fundamentals', 'Accounting']
  },
  {
    id: 3,
    role: 'Intermediate (Commerce)',
    company: 'Govt. Islamia Commerce College',
    duration: '2021 - 2023',
    description: 'Pre-university education with a focus on commercial studies.',
    tags: ['Commerce', 'College', 'Economics', 'Banking']
  },
  {
    id: 4,
    role: 'Matriculation (Computer)',
    company: 'QJ Public School',
    duration: '2019 - 2020',
    description: 'Foundational education with a specialization in computer science.',
    tags: ['Computer Science', 'Matric', 'School', 'Foundations']
  }
];

export default function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Hook scroll progress inside this section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end end']
  });

  // Smooth the scroll progress line using spring
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div ref={containerRef} className="relative w-full max-w-5xl mx-auto py-16 px-3 sm:px-4 md:px-6">
      {/* Scroll-Linked Progress Line (Center line for all widths) */}
      <div className="absolute left-1/2 top-4 bottom-4 w-[1px] bg-stone-200 -translate-x-1/2 z-20">
        {/* Filled scroll indicator */}
        <motion.div
          className="absolute top-0 left-0 bottom-0 w-full bg-blue-500 origin-top z-20"
          style={{ scaleY }}
        />
      </div>

      {/* Timeline Milestones list */}
      <div className="space-y-10 sm:space-y-12 md:space-y-14 lg:space-y-16">
        {FREELANCE_TIMELINE.map((item, index) => {
          const isEven = index % 2 === 0;

          return (
            <div
              key={item.id}
              className={`relative w-full flex items-start ${
                isEven ? 'justify-start' : 'justify-end'
              }`}
            >
              {/* Central Interactive Node */}
              <div className="absolute left-1/2 top-4 w-6 h-6 rounded-full bg-stone-100 border-2 border-stone-300 flex items-center justify-center -translate-x-1/2 z-10">
                <motion.div
                  initial={{ scale: 0.8 }}
                  whileInView={{ scale: [0.8, 1.2, 0.8] }}
                  viewport={{ once: false }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                  className="w-2.5 h-2.5 rounded-full bg-blue-500"
                />
              </div>

              {/* Box container */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, type: 'spring', damping: 20 }}
                className={`w-[48%] sm:w-[48%] md:w-[48%] lg:w-[48%] xl:w-[50%] max-w-[260px] lg:max-w-none min-w-0 ml-0 ${
                  isEven ? 'lg:ml-4 xl:ml-6' : 'lg:mr-4 xl:mr-6 lg:ml-0'
                } p-4 sm:p-4 md:p-5 lg:px-7 lg:py-7 xl:px-8 xl:py-8 rounded-2xl border border-stone-200 bg-white/80 backdrop-blur-sm relative group hover:border-blue-500/30 transition-all duration-300 shadow-xl`}
              >
                {/* Visual side highlights */}
                <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="flex items-center justify-between gap-4 mb-3">
                  <span className="font-mono text-[10px] sm:text-[11px] md:text-xs lg:text-sm xl:text-[13px] text-blue-500 font-semibold tracking-wide uppercase">
                    {item.duration}
                  </span>
                  
                  {index % 2 === 0 ? (
                    <Briefcase className="w-4 h-4 text-stone-500" />
                  ) : (
                    <Terminal className="w-4 h-4 text-stone-500" />
                  )}
                </div>

                <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-[1.35rem] font-display font-bold text-stone-900 group-hover:text-blue-500 transition-colors">
                  {item.role}
                </h3>
                
                <h4 className="text-[11px] sm:text-sm md:text-[13px] lg:text-[14px] xl:text-base font-sans text-stone-500 font-medium mb-4">
                  {item.company}
                </h4>

                <p className="text-[12px] sm:text-sm md:text-[13px] lg:text-[14px] xl:text-[15px] text-stone-600 leading-relaxed font-light mb-6">
                  {item.description}
                </p>

                {/* Tech tags */}
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 text-[10px] lg:px-3 lg:py-1.5 lg:text-[11px] xl:text-[12px] font-mono tracking-wider rounded bg-stone-100 border border-stone-200 text-stone-600 uppercase"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
