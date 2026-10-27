import { useParams, useNavigate } from 'react-router';
import { BioLoopShell } from '@/components/BioLoopShell';
import { ProtectedStub } from '@/pages/ProtectedStub';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Clock } from 'lucide-react';

export default function QuoteDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <BioLoopShell>
      <ProtectedStub
        title={id ? `Quote ${id.slice(0, 8)}` : 'Quote'}
        description="Temporary placeholder while quote details are implemented."
      >
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex flex-col gap-4">
          <Link to="/quotes" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to quotes
          </Link>

          <Card className="border-border/70 bg-card shadow-none">
            <CardHeader>
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle className="text-lg font-semibold tracking-tight">Supplier quote response</CardTitle>
                <Badge variant="secondary" className="border-0 bg-muted">Demo</Badge>
                <Badge variant="secondary" className="border-0 bg-muted">Pending your response</Badge>
              </div>
              <CardDescription>
                Example placeholder quote. Real quote details will come from the database.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>Offered quantity, price, validity, lead time, and delivery terms would appear here.</p>
            </CardContent>
          </Card>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="shadow-none">
              <Clock className="mr-2 h-4 w-4" /> Request clarification
            </Button>
            <Button size="sm" className="bg-primary text-primary-foreground shadow-none hover:bg-primary/90">
              <Check className="mr-2 h-4 w-4" /> Accept this quote
            </Button>
          </div>
        </motion.div>
      </ProtectedStub>
    </BioLoopShell>
  );
}
