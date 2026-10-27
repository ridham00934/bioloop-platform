import { useParams } from 'react-router';
import { BioLoopShell } from '@/components/BioLoopShell';
import { ProtectedStub } from '@/pages/ProtectedStub';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { Shield, MapPin, Package, Clock, CheckCircle, FileText } from 'lucide-react';

export default function BioPassportPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <BioLoopShell>
      <ProtectedStub
        title={id ? `BioPassport ${id.slice(0, 8)}` : 'BioPassport'}
        description="Temporary placeholder while BioPassport detail views are implemented."
      >
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex flex-col gap-4">
          <Card className="border-border/70 bg-card shadow-none">
            <CardHeader>
              <div className="flex flex-wrap items-center gap-2">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-lg font-semibold tracking-tight">BioPassport</CardTitle>
                <Badge variant="secondary" className="border-0 bg-muted">Demo</Badge>
              </div>
              <CardDescription>
                A privacy-safe batch identity page. QR codes open a limited public view that does not expose
                confidential prices or private contact details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Package className="h-4 w-4" /> Rice husk, 40 tonnes
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" /> Punjab, Pakistan
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" /> Collected 2026-09-15
                </span>
              </div>
              <Separator />
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Evidence levels</p>
                <div className="flex flex-wrap gap-3 text-xs">
                  <span className="inline-flex items-center gap-1 rounded-md border bg-muted px-2 py-1">
                    <CheckCircle className="h-3.5 w-3.5 text-primary" /> Supplier declared
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-md border bg-muted px-2 py-1">
                    <FileText className="h-3.5 w-3.5 text-muted-foreground" /> Document provided
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card shadow-none">
            <CardHeader>
              <CardTitle className="text-base font-semibold tracking-tight">Traceability timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>Created by supplier organisation</span>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <span>Collection window: Oct–Nov 2026</span>
              </div>
            </CardContent>
          </Card>

          <p className="text-xs text-muted-foreground">
            Real BioPassports will include an append-only event log, stored documents with evidence levels,
            and a public QR view that omits confidential data.
          </p>
        </motion.div>
      </ProtectedStub>
    </BioLoopShell>
  );
}
