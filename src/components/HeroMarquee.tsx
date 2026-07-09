import { motion } from 'motion/react';

interface HeroMarqueeProps {
  items: string[];
  speed?: number; // duration of animation
}

export default function HeroMarquee({ items, speed = 25 }: HeroMarqueeProps) {
  // We duplicate the items to make the list continuous and seamless
  const duplicatedItems = [...items, ...items, ...items, ...items];

  return (
    <div className="relative w-full overflow-hidden py-3 border-y border-stone-200/10 dark:border-stone-800/60 bg-black select-none">
      <div className="flex w-max items-center">
        {/* Infinite Row Animation */}
        <motion.div
          className="flex whitespace-nowrap gap-12 text-sm md:text-lg font-mono tracking-widest uppercase font-medium text-white items-center"
          animate={{ x: [0, -1000] }}
          transition={{
            ease: 'linear',
            duration: speed,
            repeat: Infinity,
          }}
        >
          {duplicatedItems.map((item, index) => (
            <div key={index} className="flex items-center gap-12">
              <span>{item}</span>
              {/* Elegant Accent Dot */}
              <span className="w-2 h-2 rounded-full bg-blue-500/60" />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
