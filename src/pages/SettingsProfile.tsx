import { BioLoopShell } from '@/components/BioLoopShell';
import { ProtectedStub } from '@/pages/ProtectedStub';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';

export default function SettingsProfile() {
  return (
    <BioLoopShell>
      <ProtectedStub
        title="Profile"
        description="Manage your account details."
      >
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex flex-col gap-4">
          <Card className="border-border/70 bg-card shadow-none">
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-base font-semibold tracking-tight">Profile details</CardTitle>
              </div>
              <CardDescription>
                Update your display name, phone, and job title.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="space-y-1.5">
                <Label htmlFor="displayName">Display name</Label>
                <Input id="displayName" placeholder="Your name" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="+1 555 000 0000" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="jobTitle">Job title</Label>
                <Input id="jobTitle" placeholder="Operations manager" />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" className="shadow-none">Cancel</Button>
                <Button size="sm" className="bg-primary text-primary-foreground shadow-none hover:bg-primary/90">Save</Button>
              </div>
            </CardContent>
          </Card>

          <p className="text-xs text-muted-foreground">
            Real profile settings will persist to the database and be scoped to your current membership.
          </p>
        </motion.div>
      </ProtectedStub>
    </BioLoopShell>
  );
}
