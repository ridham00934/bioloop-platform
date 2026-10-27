import { BioLoopShell } from '@/components/BioLoopShell';
import { RequireAdmin } from '@/components/RequireAdmin';
import { ProtectedStub } from '@/pages/ProtectedStub';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { AlertTriangle, Check, X, Clock, MessageSquare } from 'lucide-react';

export default function AdminDisputes() {
  return (
    <BioLoopShell>
      <RequireAdmin>
        <ProtectedStub
          title="Disputes"
          description="Review and resolve disputes with evidence and an audit trail."
        >
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex flex-col gap-4">
            <Card className="border-border/70 bg-card shadow-none">
              <CardHeader>
                <CardTitle className="text-base font-semibold tracking-tight">Open disputes</CardTitle>
                <CardDescription>
                  Disputes support evidence uploads, restricted internal notes, resolution, and an audit trail.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>No open disputes.</p>
              </CardContent>
            </Card>

            <Card className="border-border/70 bg-card shadow-none">
              <CardHeader>
                <CardTitle className="text-base font-semibold tracking-tight">Dispute states</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  <span>Open</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Under review</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Resolved</span>
                </div>
                <div className="flex items-center gap-2">
                  <X className="h-4 w-4 text-muted-foreground" />
                  <span>Closed</span>
                </div>
              </CardContent>
            </Card>

            <Separator />

            <Card className="border-border/70 bg-card shadow-none">
              <CardHeader>
                <CardTitle className="text-base font-semibold tracking-tight">Dispute workflow</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <ul className="list-disc pl-5">
                  <li>Evidence uploads with file type and size validation.</li>
                  <li>Restricted internal notes visible only to authorised reviewers.</li>
                  <li>Resolution recorded with actor, timestamp, and reason.</li>
                  <li>Full audit trail retained for sensitive operations.</li>
                </ul>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" className="shadow-none">
                <MessageSquare className="mr-2 h-4 w-4" /> View dispute details
              </Button>
            </div>
          </motion.div>
        </ProtectedStub>
      </RequireAdmin>
    </BioLoopShell>
  );
}
