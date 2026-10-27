import { BioLoopShell } from '@/components/BioLoopShell';
import { RequireAdmin } from '@/components/RequireAdmin';
import { ProtectedStub } from '@/pages/ProtectedStub';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { User, Building, Shield, Mail, Phone } from 'lucide-react';
import { useState } from 'react';

export default function AdminUsers() {
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteOrg, setInviteOrg] = useState('');
  const [inviteRole, setInviteRole] = useState('supplier');

  return (
    <BioLoopShell>
      <RequireAdmin>
        <ProtectedStub
          title="Users & organisations"
          description="Manage platform users, organisations, memberships, and roles."
        >
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex flex-col gap-4">
            <Card className="border-border/70 bg-card shadow-none">
              <CardHeader>
                <CardTitle className="text-base font-semibold tracking-tight">Invite a user</CardTitle>
                <CardDescription>
                  Send an invitation to join a BioLoop organisation.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="colleague@example.com" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="org">Organisation</Label>
                    <Input id="org" value={inviteOrg} onChange={(e) => setInviteOrg(e.target.value)} placeholder="My organisation" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="role">Role</Label>
                  <Select value={inviteRole} onValueChange={setInviteRole}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="supplier">Supplier</SelectItem>
                      <SelectItem value="buyer">Buyer</SelectItem>
                      <SelectItem value="processor">Processor</SelectItem>
                      <SelectItem value="logistics">Logistics partner</SelectItem>
                      <SelectItem value="admin">Administrator</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Administrator access is provisioned by platform operators, not by public registration.</p>
                </div>
                <div className="flex justify-end">
                  <Button variant="outline" size="sm" className="shadow-none" disabled={!inviteEmail}>
                    <Mail className="mr-2 h-4 w-4" /> Send invitation
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Separator />

            <Card className="border-border/70 bg-card shadow-none">
              <CardHeader>
                <CardTitle className="text-base font-semibold tracking-tight">Organisations</CardTitle>
                <CardDescription>
                  List and manage platform organisations and verification status.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>Organisations will appear here once they are created.</p>
              </CardContent>
            </Card>

            <Card className="border-border/70 bg-card shadow-none">
              <CardHeader>
                <CardTitle className="text-base font-semibold tracking-tight">Roles and permissions</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="flex-1 font-medium">Supplier</span>
                  <Badge variant="secondary" className="border-0 bg-muted">manages listings</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="flex-1 font-medium">Buyer</span>
                  <Badge variant="secondary" className="border-0 bg-muted">creates RFQs</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="flex-1 font-medium">Processor</span>
                  <Badge variant="secondary" className="border-0 bg-muted">processing services</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="flex-1 font-medium">Logistics partner</span>
                  <Badge variant="secondary" className="border-0 bg-muted">manages shipments</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <span className="flex-1 font-medium">Administrator</span>
                  <Badge variant="outline" className="border-dashed text-primary">provisioned by admins</Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </ProtectedStub>
      </RequireAdmin>
    </BioLoopShell>
  );
}
