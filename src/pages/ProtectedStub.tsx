import type { ReactNode } from 'react';
import { BioLoopShell } from '@/components/BioLoopShell';
import { motion } from 'framer-motion';

export function ProtectedStub({ title, description, children }: {
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <BioLoopShell>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-auto max-w-5xl"
      >
        <div className="flex flex-col gap-3">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
          {children}
        </div>
      </motion.div>
    </BioLoopShell>
  );
}
