import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export default function CustomCursor() {
  const [cursorType, setCursorType] = useState<'default' | 'pointer' | 'view'>('default');
  const [isVisible, setIsVisible] = useState(false);

  // High performance smooth coordinate binding with motion values
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Eased spring physics for the cursor ring
  const springConfig = { damping: 30, stiffness: 350, mass: 0.5 };
  const springX = useSpring(cursorX, springConfig);
  const springY = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Hide cursor on touch devices completely
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouch) return;

    setIsVisible(true);
    document.body.classList.add('custom-cursor-active');

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Find nearest elements with custom cursor tags
      const viewElement = target.closest('[data-cursor="view"]');
      const pointerElement = target.closest('[data-cursor="pointer"], a, button, input, select, textarea');

      if (viewElement) {
        setCursorType('view');
      } else if (pointerElement) {
        setCursorType('pointer');
      } else {
        setCursorType('default');
      }
    };

    const handleMouseLeaveWindow = () => {
      setIsVisible(false);
    };

    const handleMouseEnterWindow = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseleave', handleMouseLeaveWindow);
    document.addEventListener('mouseenter', handleMouseEnterWindow);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeaveWindow);
      document.removeEventListener('mouseenter', handleMouseEnterWindow);
      document.body.classList.remove('custom-cursor-active');
    };
  }, [cursorX, cursorY]);

  if (!isVisible) return null;

  // Render responsive variations
  return (
    <>
      {/* 1. Precise Inner dot tracker (moves perfectly synchronous with mouse coordinates) */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-blue-500 rounded-full pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 hidden md:block mix-blend-difference"
        style={{ x: cursorX, y: cursorY }}
      />

      {/* 2. Custom Eased Ring that morphs shape/size based on elements */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center font-display text-[10px] uppercase font-bold tracking-widest hidden md:flex"
        style={{ x: springX, y: springY }}
        animate={{
          width: cursorType === 'view' ? 80 : cursorType === 'pointer' ? 48 : 28,
          height: cursorType === 'view' ? 80 : cursorType === 'pointer' ? 48 : 28,
          backgroundColor:
            cursorType === 'view'
              ? 'rgba(59, 130, 246, 0.95)'
              : 'rgba(255, 255, 255, 0)',
          borderColor:
            cursorType === 'view'
              ? 'rgba(59, 130, 246, 1)'
              : cursorType === 'pointer'
              ? 'rgba(59, 130, 246, 0.6)'
              : 'rgba(255, 255, 255, 0.3)',
          borderWidth: cursorType === 'view' ? 0 : 1.5,
          color: cursorType === 'view' ? '#ffffff' : 'rgba(255,255,255,0)',
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      >
        {cursorType === 'view' && (
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            className="text-[10px] text-white"
          >
            View
          </motion.span>
        )}
      </motion.div>
    </>
  );
}
