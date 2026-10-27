import { BioLoopShell } from '@/components/BioLoopShell';
import { ProtectedStub } from '@/pages/ProtectedStub';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

export default function Shipments() {
  return (
    <BioLoopShell>
      <ProtectedStub
        title="Shipments"
        description="Plan pickups and deliveries with BioRoute."
      >
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex flex-col gap-4">
          <Card className="border-border/70 bg-card shadow-none">
            <CardHeader>
              <CardTitle className="text-base font-semibold tracking-tight">No shipments yet</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>Shipments appear here once you create a BioRoute collection or delivery request.</p>
            </CardContent>
          </Card>
        </motion.div>
      </ProtectedStub>
    </BioLoopShell>
  );
}
