import { useNavigate } from 'react-router';
import { BioLoopShell } from '@/components/BioLoopShell';
import { ProtectedStub } from '@/pages/ProtectedStub';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

export default function Quotes() {
  const navigate = useNavigate();

  return (
    <BioLoopShell>
      <ProtectedStub
        title="Quotes"
        description="Review supplier quote responses and accept the best fit."
      >
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex flex-col gap-4">
          <Card className="border-border/70 bg-card shadow-none">
            <CardHeader>
              <CardTitle className="text-base font-semibold tracking-tight">No quotes yet</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>Quotes appear here once suppliers respond to your RFQs or you request quotes directly.</p>
            </CardContent>
          </Card>
        </motion.div>
      </ProtectedStub>
    </BioLoopShell>
  );
}
