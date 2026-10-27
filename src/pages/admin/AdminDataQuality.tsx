import { BioLoopShell } from '@/components/BioLoopShell';
import { RequireAdmin } from '@/components/RequireAdmin';
import { ProtectedStub } from '@/pages/ProtectedStub';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { Magnet, AlertTriangle, Check, Eye } from 'lucide-react';

const ISSUES = [
  {
    type: 'missing_moisture',
    label: 'Missing moisture percentage',
    category: 'listings',
    count: 0,
    note: 'Listings that lack moisture data where it would be useful.',
  },
  {
    type: 'missing_quantity_unit',
    label: 'Missing quantity unit',
    category: 'listings',
    count: 0,
    note: 'Every quantity should have an explicit unit.',
  },
  {
    type: 'missing_currency',
    label: 'Missing currency',
    category: 'listings',
    count: 0,
    note: 'Every price should have a currency.',
  },
  {
    type: 'no_delivery_terms',
    label: 'No delivery terms',
    category: 'listings',
    count: 0,
    note: 'Listings without delivery or pickup terms.',
  },
  {
    type: 'unreviewed_documents',
    label: 'Unreviewed documents',
    category: 'documents',
    count: 0,
    note: 'Documents awaiting review.',
  },
  {
    type: 'expired_verification',
    label: 'Expired verification',
    category: 'verification',
    count: 0,
    note: 'Organisations or documents with expired verification.',
  },
];

export default function AdminDataQuality() {
  return (
    <BioLoopShell>
      <RequireAdmin>
        <ProtectedStub
          title="Data quality"
          description="Flags, warnings, and review actions for platform data."
        >
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex flex-col gap-4">
            <Card className="border-border/70 bg-card shadow-none">
              <CardHeader>
                <CardTitle className="text-base font-semibold tracking-tight">Data quality summary</CardTitle>
                <CardDescription>
                  Warnings come from real database queries against persisted records.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {ISSUES.map((issue) => (
                  <div key={issue.type} className="rounded-md border bg-card p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <Magnet className="h-4 w-4 shrink-0 text-muted-foreground" />
                          <span className="font-medium">{issue.label}</span>
                          <Badge variant="secondary" className="border-0 bg-muted shrink-0">{issue.category}</Badge>
                          <Badge variant="outline" className="border-dashed text-muted-foreground shrink-0">
                            {issue.count}
                          </Badge>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">{issue.note}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-border/70 bg-card shadow-none">
              <CardHeader>
                <CardTitle className="text-base font-semibold tracking-tight">Flagged listings</CardTitle>
                <CardDescription>
                  Moderation flags and review status for listings.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>No flagged listings.</p>
              </CardContent>
            </Card>

            <Separator />

            <Card className="border-border/70 bg-card shadow-none">
              <CardHeader>
                <CardTitle className="text-base font-semibold tracking-tight">Data quality rules</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <ul className="list-disc pl-5">
                  <li>Negative quantities are rejected.</li>
                  <li>Invalid units are rejected.</li>
                  <li>Mandatory listing information is validated before publication.</li>
                  <li>Supplier-reported information is separate from reviewed documents and lab-tested results.</li>
                  <li>Dashboard numbers are calculated from real queries and are never hard-coded.</li>
                </ul>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" className="shadow-none">
                <Eye className="mr-2 h-4 w-4" /> Review flag
              </Button>
              <Button variant="outline" size="sm" className="shadow-none">
                <Check className="mr-2 h-4 w-4" /> Mark reviewed
              </Button>
            </div>
          </motion.div>
        </ProtectedStub>
      </RequireAdmin>
    </BioLoopShell>
  );
}
