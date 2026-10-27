import { useParams } from 'react-router';
import { BioLoopShell } from '@/components/BioLoopShell';
import { ProtectedStub } from '@/pages/ProtectedStub';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

export default function OrderDetails() {
  const { id } = useParams<{ id: string }>();

  return (
    <BioLoopShell>
      <ProtectedStub
        title={id ? `Order ${id.slice(0, 8)}` : 'Order'}
        description="Temporary placeholder while order details are implemented."
      >
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex flex-col gap-4">
          <Card className="border-border/70 bg-card shadow-none">
            <CardHeader>
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle className="text-lg font-semibold tracking-tight">Order detail</CardTitle>
                <Badge variant="secondary" className="border-0 bg-muted">Demo</Badge>
                <Badge variant="secondary" className="border-0 bg-muted">Confirmed</Badge>
              </div>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>Order timeline, line items, documents, and status transitions will appear here for authorised
              participants.</p>
            </CardContent>
          </Card>
        </motion.div>
      </ProtectedStub>
    </BioLoopShell>
  );
}
