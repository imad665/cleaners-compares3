// components/llm-response/text.tsx
import React from 'react';
import { cn } from '@/lib/utils';

export interface TextProps {
  children: React.ReactNode;
  className?: string;
}

export function Text({ children, className }: TextProps) {
  return (
    <p className={cn('text-sm', className)}>
      {children}
    </p>
  );
}

export default Text;