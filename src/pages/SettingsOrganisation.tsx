import { BioLoopShell } from '@/components/BioLoopShell';
import { ProtectedStub } from '@/pages/ProtectedStub';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { Building } from 'lucide-react';

export default function SettingsOrganisation() {
  return (
    <BioLoopShell>
      <ProtectedStub
        title="Organisation"
        description="Manage your organisation, role, and verification."
      >
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex flex-col gap-4">
          <Card className="border-border/70 bg-card shadow-none">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-base font-semibold tracking-tight">Organisation details</CardTitle>
              </div>
              <CardDescription>
                Update your organisation name and contact details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="space-y-1.5">
                <Label htmlFor="orgName">Organisation name</Label>
                <Input id="orgName" placeholder="Acme Biomass Ltd." />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="region">Primary region</Label>
                  <Input id="region" placeholder="Punjab, Pakistan" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="contactEmail">Contact email</Label>
                  <Input id="contactEmail" type="email" placeholder="contact@example.com" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" className="shadow-none">Cancel</Button>
                <Button size="sm" className="bg-primary text-primary-foreground shadow-none hover:bg-primary/90">Save</Button>
              </div>
            </CardContent>
          </Card>

          <Separator />

          <Card className="border-border/70 bg-card shadow-none">
            <CardHeader>
              <CardTitle className="text-base font-semibold tracking-tight">Role</CardTitle>
              <CardDescription>
                Your role determines access across the platform.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>Current role: <span className="font-semibold">Supplier</span></p>
              <Select>
                <SelectTrigger><SelectValue placeholder="Role is managed by invitations" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="supplier">Supplier</SelectItem>
                  <SelectItem value="buyer">Buyer</SelectItem>
                  <SelectItem value="processor">Processor</SelectItem>
                  <SelectItem value="logistics">Logistics partner</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Role changes are managed through organisation invitations and admin actions.</p>
            </CardContent>
          </Card>

          <Separator />

          <Card className="border-border/70 bg-card shadow-none">
            <CardHeader>
              <CardTitle className="text-base font-semibold tracking-tight">Verification</CardTitle>
              <CardDescription>
                Verification status and documents submitted for review.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-3">
              <div className="rounded-md border bg-muted/50 p-4">
                <p>Verification state: <Badge variant="secondary" className="border-0 bg-muted">Unsubmitted</Badge></p>
                <p className="mt-1">Your organisation has not yet been submitted for verification.</p>
                <div className="mt-2">
                  <Button variant="outline" size="sm" className="shadow-none">Submit for verification</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <p className="text-xs text-muted-foreground">
            Real organisation settings will persist to the database and be enforced through memberships and
            organisation-level permissions.
          </p>
        </motion.div>
      </ProtectedStub>
    </BioLoopShell>
  );
}
