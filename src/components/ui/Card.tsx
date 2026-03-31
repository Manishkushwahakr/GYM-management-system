import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: string;
}

export default function Card({ children, className = '', glow }: CardProps) {
  return (
    <div
      className={`relative bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-xl p-6 ${className}`}
      style={
        glow
          ? {
              boxShadow: `0 0 30px -5px ${glow}20, inset 0 1px 0 0 ${glow}10`,
            }
          : undefined
      }
    >
      {children}
    </div>
  );
}
