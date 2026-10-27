import { BioLoopShell } from '@/components/BioLoopShell';
import { ProtectedStub } from '@/pages/ProtectedStub';
import { RequireAdmin } from '@/components/RequireAdmin';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, Search, Phone, Cpu, Magnet } from 'lucide-react';
import { Link, useNavigate } from 'react-router';

export default function AdminOverview() {
  const navigate = useNavigate();

  return (
    <BioLoopShell>
      <RequireAdmin>
        <ProtectedStub
          title="Administration"
          description="Platform operations: verification, users, taxonomy, disputes, audit, and integration health."
        >
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="border-border/70 bg-card shadow-none hover:border-primary/40 transition-colors">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold tracking-tight">Reference</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span className="flex-1">Verification queue</span>
                    <Badge variant="secondary" className="border-0 bg-muted">0 pending</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    <span className="flex-1">Open disputes</span>
                    <Badge variant="secondary" className="border-0 bg-muted">0 open</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <span className="flex-1">Flagged listings</span>
                    <Badge variant="secondary" className="border-0 bg-muted">0 flagged</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-muted-foreground" />
                    <span className="flex-1">Integration health</span>
                    <Badge variant="outline" className="border-dashed text-muted-foreground">unconfigured</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Magnet className="h-4 w-4 text-muted-foreground" />
                    <span className="flex-1">Data quality warnings</span>
                    <Badge variant="secondary" className="border-0 bg-muted">0 warnings</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/70 bg-card shadow-none sm:col-span-2 lg:col-span-3">
                <CardHeader>
                  <CardTitle className="text-base font-semibold tracking-tight">Recent admin activity</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>No admin actions have been recorded yet.</p>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link to="/admin/verification">
                <Button variant="outline" size="sm" className="shadow-none">
                  <Shield className="mr-2 h-4 w-4" /> Verification queue
                </Button>
              </Link>
              <Link to="/admin/users">
                <Button variant="outline" size="sm" className="shadow-none">
                  <Phone className="mr-2 h-4 w-4" /> Users & organisations
                </Button>
              </Link>
              <Link to="/admin/taxonomy">
                <Button variant="outline" size="sm" className="shadow-none">
                  <Search className="mr-2 h-4 w-4" /> Feedstock taxonomy
                </Button>
              </Link>
              <Link to="/admin/disputes">
                <Button variant="outline" size="sm" className="shadow-none">
                  <AlertTriangle className="mr-2 h-4 w-4" /> Disputes
                </Button>
              </Link>
              <Link to="/admin/audit">
                <Button variant="outline" size="sm" className="shadow-none">
                  Audit logs
                </Button>
              </Link>
              <Link to="/admin/integrations">
                <Button variant="outline" size="sm" className="shadow-none">
                  <Cpu className="mr-2 h-4 w-4" /> Integration health
                </Button>
              </Link>
              <Link to="/admin/data-quality">
                <Button variant="outline" size="sm" className="shadow-none">
                  <Magnet className="mr-2 h-4 w-4" /> Data quality
                </Button>
              </Link>
            </div>
          </motion.div>
        </ProtectedStub>
      </RequireAdmin>
    </BioLoopShell>
  );
}
