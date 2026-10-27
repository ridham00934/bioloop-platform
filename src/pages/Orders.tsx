import { BioLoopShell } from '@/components/BioLoopShell';
import { ProtectedStub } from '@/pages/ProtectedStub';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

export default function Orders() {
  return (
    <BioLoopShell>
      <ProtectedStub
        title="Orders"
        description="Track orders you have placed or fulfilled."
      >
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex flex-col gap-4">
          <Card className="border-border/70 bg-card shadow-none">
            <CardHeader>
              <CardTitle className="text-base font-semibold tracking-tight">No orders yet</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>Orders appear here once a quote is accepted and an order is created.</p>
            </CardContent>
          </Card>
        </motion.div>
      </ProtectedStub>
    </BioLoopShell>
  );
}
