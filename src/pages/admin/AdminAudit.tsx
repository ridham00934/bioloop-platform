import { BioLoopShell } from '@/components/BioLoopShell';
import { RequireAdmin } from '@/components/RequireAdmin';
import { ProtectedStub } from '@/pages/ProtectedStub';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { FileText, Shield } from 'lucide-react';

const ACTIONS = [
  { action: 'role_change', label: 'Role change', categories: ['users', ' organisations'] },
  { action: 'verification_decision', label: 'Verification decision', categories: ['verification'] },
  { action: 'quote_acceptance', label: 'Quote acceptance', categories: ['orders'] },
  { action: 'order_transition', label: 'Order transition', categories: ['orders'] },
  { action: 'listing_publish', label: 'Listing published', categories: ['marketplace'] },
  { action: 'admin_action', label: 'Admin action', categories: ['admin'] },
];

export default function AdminAudit() {
  return (
    <BioLoopShell>
      <RequireAdmin>
        <ProtectedStub
          title="Audit logs"
          description="Sensitive operations recorded for review and traceability."
        >
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex flex-col gap-4">
            <Card className="border-border/70 bg-card shadow-none">
              <CardHeader>
                <CardTitle className="text-base font-semibold tracking-tight">Audit events</CardTitle>
                <CardDescription>
                  Sensitive operations such as role changes, verification decisions, quote acceptance, order
                  transitions, and administrator actions are recorded.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>No audit events yet.</p>
              </CardContent>
            </Card>

            <Card className="border-border/70 bg-card shadow-none">
              <CardHeader>
                <CardTitle className="text-base font-semibold tracking-tight">Filter by action</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <Select>
                  <SelectTrigger><SelectValue placeholder="All actions" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All actions</SelectItem>
                    {ACTIONS.map((a) => (
                      <SelectItem key={a.action} value={a.action}>{a.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Separator />
                <p className="text-xs text-muted-foreground">
                  Each audit record stores the actor, target resource type, before and after state, reason, and
                  timestamp.
                </p>
              </CardContent>
            </Card>

            <Separator />

            <p className="text-xs text-muted-foreground">
              Audit logs are retained for security and accountability. Real audit events will come from the
              database.
            </p>
          </motion.div>
        </ProtectedStub>
      </RequireAdmin>
    </BioLoopShell>
  );
}
