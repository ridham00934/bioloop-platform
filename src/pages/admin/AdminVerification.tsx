import { BioLoopShell } from '@/components/BioLoopShell';
import { RequireAdmin } from '@/components/RequireAdmin';
import { ProtectedStub } from '@/pages/ProtectedStub';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { Shield, Check, X, Clock } from 'lucide-react';
import { Link } from 'react-router';

export default function AdminVerification() {
  return (
    <BioLoopShell>
      <RequireAdmin>
        <ProtectedStub
          title="Verification queue"
          description="Review organisation verification requests and document reviews."
        >
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex flex-col gap-4">
            <Card className="border-border/70 bg-card shadow-none">
              <CardHeader>
                <CardTitle className="text-base font-semibold tracking-tight">Pending verification requests</CardTitle>
                <CardDescription>
                  Only authorised reviewers may change verification status. Every decision records the actor,
                  timestamp, reason, and supporting evidence.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>No pending requests.</p>
              </CardContent>
            </Card>

            <Card className="border-border/70 bg-card shadow-none">
              <CardHeader>
                <CardTitle className="text-base font-semibold tracking-tight">Verification states</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <div className="flex items-center gap-2">
                  <Unsubmitted className="h-4 w-4 text-muted-foreground" />
                  <span>Unsubmitted</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Pending</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Approved</span>
                </div>
                <div className="flex items-center gap-2">
                  <X className="h-4 w-4 text-muted-foreground" />
                  <span>Rejected</span>
                </div>
                <div className="flex items-center gap-2">
                  <X className="h-4 w-4 text-muted-foreground" />
                  <span>Expired</span>
                </div>
              </CardContent>
            </Card>

            <Separator />

            <p className="text-xs text-muted-foreground">
              Verification badges are shown only when an approved and valid verification record exists. Admin
              verification will be built as a real workflow with document review and audit events.
            </p>
          </motion.div>
        </ProtectedStub>
      </RequireAdmin>
    </BioLoopShell>
  );
}

function Unsubmitted({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
    </svg>
  );
}
