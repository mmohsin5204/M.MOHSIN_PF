import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  id?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export default function MagneticButton({
  children,
  className = '',
  onClick,
  id,
  type = 'button',
  disabled = false,
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = buttonRef.current;
    if (!button) return;

    const { clientX, clientY } = e;
    const { left, top, width, height } = button.getBoundingClientRect();
    
    // Find centers
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    // Calculate distance from center
    const x = clientX - centerX;
    const y = clientY - centerY;

    // Pull intensity factor (subtle 30% pull)
    setPosition({ x: x * 0.35, y: y * 0.35 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={buttonRef}
      id={id}
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative ${className}`}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 180, damping: 15, mass: 0.8 }}
      data-cursor="pointer"
    >
      {/* Background or inner button can follow a layered look */}
      <span className="relative z-10 flex items-center justify-center gap-[inherit] pointer-events-none">{children}</span>
    </motion.button>
  );
}
