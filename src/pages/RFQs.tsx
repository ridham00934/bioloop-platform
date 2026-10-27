import { useNavigate } from 'react-router';
import { BioLoopShell } from '@/components/BioLoopShell';
import { ProtectedStub } from '@/pages/ProtectedStub';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

export default function RFQs() {
  const navigate = useNavigate();

  return (
    <BioLoopShell>
      <ProtectedStub
        title="Requests for Quotation"
        description="Create and review RFQs with suppliers."
      >
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex flex-col gap-4">
          <div className="flex justify-end">
            <Button size="sm" className="bg-primary text-primary-foreground shadow-none hover:bg-primary/90" onClick={() => navigate('/rfqs/new')}>
              <Plus className="mr-2 h-4 w-4" /> New RFQ
            </Button>
          </div>

          <Card className="border-border/70 bg-card shadow-none">
            <CardHeader>
              <CardTitle className="text-base font-semibold tracking-tight">No RFQs yet</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>Create your first request for quotation to invite supplier responses.</p>
              <div className="mt-3">
                <Button variant="outline" size="sm" className="shadow-none" onClick={() => navigate('/rfqs/new')}>
                  Create a RFQ
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </ProtectedStub>
    </BioLoopShell>
  );
}
