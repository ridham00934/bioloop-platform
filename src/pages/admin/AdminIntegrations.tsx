import { BioLoopShell } from '@/components/BioLoopShell';
import { RequireAdmin } from '@/components/RequireAdmin';
import { ProtectedStub } from '@/pages/ProtectedStub';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { Cpu, Check, AlertTriangle, X } from 'lucide-react';

const INTEGRATIONS = [
  {
    provider: 'Database & authentication',
    status: 'connected',
    detail: 'Supabase PostgreSQL and Supabase Auth are the current backend and auth providers. Supabase Storage is configured for private document storage and signed URLs.',
  },
  {
    provider: 'AI assistant',
    status: 'unconfigured',
    detail: 'The AI provider API key is not configured. The assistant displays an honest unavailable state while all other BioLoop features remain operational.',
  },
  {
    provider: 'Maps & routing',
    status: 'unconfigured',
    detail: 'No routing provider is configured. BioRoute shows a clearly labelled approximation or asks for a transport quote. The marketplace and ordering flow remain usable.',
  },
  {
    provider: 'Email',
    status: 'unconfigured',
    detail: 'No email provider is configured for notifications. The email adapter and templates exist, but delivery status is only reported when the provider returns a real result.',
  },
  {
    provider: 'Payments',
    status: 'unconfigured',
    detail: 'BioLoop coordinates quotes and orders. Payment processing is optional and is only enabled when a payment provider is configured and confirms a transaction through a verified server-side response or webhook.',
  },
  {
    provider: 'File storage',
    status: 'connected',
    detail: 'Private storage buckets and signed URLs are used for private documents. File types and sizes are validated on upload.',
  },
];

export default function AdminIntegrations() {
  return (
    <BioLoopShell>
      <RequireAdmin>
        <ProtectedStub
          title="Integration health"
          description="Which services BioLoop is actually connected to, and which are unconfigured."
        >
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex flex-col gap-4">
            <Card className="border-border/70 bg-card shadow-none">
              <CardHeader>
                <CardTitle className="text-base font-semibold tracking-tight">Service status</CardTitle>
                <CardDescription>
                  A service is not considered connected just because its SDK is installed. Each status is based on
                  the actual configured state.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                {INTEGRATIONS.map((integration) => (
                  <div key={integration.provider} className="rounded-md border bg-card p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <Cpu className="h-4 w-4 shrink-0 text-muted-foreground" />
                          <span className="font-medium">{integration.provider}</span>
                          {integration.status === 'connected' ? (
                            <Badge variant="secondary" className="border-0 bg-primary/10 text-primary shrink-0">
                              <Check className="mr-1 h-3 w-3" /> Connected
                            </Badge>
                          ) : integration.status === 'unconfigured' ? (
                            <Badge variant="outline" className="border-dashed text-muted-foreground shrink-0">
                              <AlertTriangle className="mr-1 h-3 w-3" /> Unconfigured
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="border-0 bg-destructive/10 text-destructive shrink-0">
                              <X className="mr-1 h-3 w-3" /> Unavailable
                            </Badge>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">{integration.detail}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Separator />

            <Card className="border-border/70 bg-card shadow-none">
              <CardHeader>
                <CardTitle className="text-base font-semibold tracking-tight">Why some services show unconfigured</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>
                  BioLoop implements the integration structure and configuration instructions for AI, maps and
                  routing, email, and payments. If credentials are unavailable, the application does not pretend
                  the service is connected. It shows an honest unconfigured or unavailable state instead.
                </p>
                <p className="mt-2">
                  Configure the relevant environment variables or API keys to connect a service. Secrets are kept
                  server-side and are never exposed to the frontend.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </ProtectedStub>
      </RequireAdmin>
    </BioLoopShell>
  );
}
