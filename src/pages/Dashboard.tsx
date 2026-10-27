import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { BioLoopShell } from '@/components/BioLoopShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { BarChart3, Search, FileQuestion, Receipt, GraduationCap, Loader2, Plus, TrendingUp } from 'lucide-react';


const QUICK_ACTIONS = [
  { label: 'Create listing', to: '/listings/new', icon: Plus, roles: ['supplier', 'admin'] },
  { label: 'Post a RFQ', to: '/rfqs/new', icon: FileQuestion, roles: ['buyer', 'admin'] },
  { label: 'Open marketplace', to: '/marketplace/listings', icon: Search, roles: ['supplier', 'buyer', 'processor', 'logistics', 'admin'] },
  { label: 'Run Smart Matcher', to: '/smart-matcher', icon: TrendingUp, roles: ['buyer', 'processor', 'admin'] },
];

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const profile = useQuery(api.profiles.profile ?? (() => null));

  if (profile == null) {
    return (
      <BioLoopShell>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      </BioLoopShell>
    );
  }

  const role = profile.role || 'member';

  return (
    <BioLoopShell>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-auto max-w-5xl"
      >
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Hello, {user?.name || user?.email?.split('@')[0] || 'there'}.
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight">
              {role === 'admin' ? 'Platform overview' : `${role === 'member' ? 'Workspace' : role} dashboard`}
            </h1>
          </div>
          <div className="flex flex-wrap gap-2">
            {QUICK_ACTIONS.filter((a) => a.roles.includes(role)).map((action) => (
              <Button
                key={action.to}
                variant="outline"
                size="sm"
                className="shadow-none"
                onClick={() => navigate(action.to)}
              >
                <action.icon className="mr-2 h-4 w-4" />
                {action.label}
              </Button>
            ))}
          </div>
        </header>

        <p className="mt-2 text-sm text-muted-foreground">
          This dashboard will reflect real records once you create listings, RFQs, quotes, or orders.
          For now it shows your current role and workspace.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {KPI_CARDS.filter((card) => card.roles.includes(role)).map((card) => (
            <Card key={card.title} className="border-border/70 bg-card shadow-none">
              <CardHeader className="flex flex-row items-start gap-3 pb-2">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/8 text-primary">
                  <card.icon className="h-4 w-4" />
                </div>
                <CardTitle className="text-base font-semibold tracking-tight">{card.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-2xl font-semibold tabular-nums">{card.value}</p>
                <p className="text-xs text-muted-foreground">{card.note}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-6 border-border/70 bg-card shadow-none">
          <CardHeader>
            <CardTitle className="text-base font-semibold tracking-tight">Recent guidance</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <ul className="flex flex-col gap-2 list-disc pl-5">
              <li>Start by creating an organisation if you do not have one.</li>
              <li>Suppliers: create your first listing in the marketplace.</li>
              <li>Buyers: post a RFQ or try the Smart Matcher.</li>
              <li>Admins: review the verification queue and integration health.</li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </BioLoopShell>
  );
}

const KPI_CARDS = [
  { title: 'Active listings', value: '—', note: 'Created and published listings', icon: Search, roles: ['supplier', 'admin'] },
  { title: 'Available quantity', value: '—', note: 'Across your published lots', icon: GraduationCap, roles: ['supplier', 'admin'] },
  { title: 'Incoming RFQs', value: '—', note: 'Awaiting response or review', icon: FileQuestion, roles: ['buyer', 'supplier', 'admin'] },
  { title: 'Pending quotes', value: '—', note: 'Awaiting acceptance or expiry', icon: Receipt, roles: ['buyer', 'supplier', 'admin'] },
  { title: 'Orders in progress', value: '—', note: 'Confirmed and not completed', icon: GraduationCap, roles: ['supplier', 'buyer', 'processor', 'logistics', 'admin'] },
  { title: 'Saved searches', value: '—', note: 'Tracked by your organisation', icon: TrendingUp, roles: ['buyer', 'admin'] },
];
