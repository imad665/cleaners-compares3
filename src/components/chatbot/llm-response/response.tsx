// components/llm-response/response.tsx
import React from 'react';
import { cn } from '@/lib/utils';

export interface ResponseProps {
  children: React.ReactNode;
  className?: string;
}

export function Response({ children, className }: ResponseProps) {
  return (
    <div className={cn('w-full space-y-3', className)}>
      {children}
    </div>
  );
}

export default Response;