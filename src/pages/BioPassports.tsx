import { BioLoopShell } from '@/components/BioLoopShell';
import { ProtectedStub } from '@/pages/ProtectedStub';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

export default function BioPassports() {
  return (
    <BioLoopShell>
      <ProtectedStub
        title="BioPassports"
        description="Digital identities and traceability histories for your batches."
      >
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex flex-col gap-4">
          <Card className="border-border/70 bg-card shadow-none">
            <CardHeader>
              <CardTitle className="text-base font-semibold tracking-tight">No batches yet</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>BioPassports are created for batches when you record a collection or process event.</p>
            </CardContent>
          </Card>
        </motion.div>
      </ProtectedStub>
    </BioLoopShell>
  );
}
