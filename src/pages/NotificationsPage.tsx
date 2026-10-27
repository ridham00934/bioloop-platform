import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { BioLoopShell } from '@/components/BioLoopShell';
import { ProtectedStub } from '@/pages/ProtectedStub';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Bell, Check } from 'lucide-react';

export default function NotificationsPage() {
  const notifications = useQuery(api.notifications.list, { limit: 50, unreadOnly: false });

  return (
    <BioLoopShell>
      <ProtectedStub
        title="Notifications"
        description="Activity from real application events."
      >
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex flex-col gap-4">
          <div className="flex justify-end">
            <Button variant="outline" size="sm" className="shadow-none" disabled={notifications === undefined || (notifications ?? []).length === 0}>
              <Check className="mr-2 h-4 w-4" /> Mark all read
            </Button>
          </div>

          <Card className="border-border/70 bg-card shadow-none">
            <CardHeader>
              <CardTitle className="text-base font-semibold tracking-tight">Recent notifications</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>Notifications appear here from events such as new quotes, RFQ responses, order status changes,
              shipment delays, and verification decisions.</p>
            </CardContent>
          </Card>

          {notifications === undefined ? (
            <div className="flex justify-center py-12">
              <Bell className="h-8 w-8 text-muted-foreground animate-pulse" />
            </div>
          ) : (notifications ?? []).length === 0 ? (
            <Card className="border-border/70 bg-card shadow-none">
              <CardHeader>
                <CardTitle className="text-base font-semibold tracking-tight">No notifications yet</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>You will see notifications here as activity happens in BioLoop.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col gap-2">
              {(notifications ?? []).map((n) => (
                <Card key={n._id} className={`border-border/70 bg-card shadow-none ${n.read ? 'opacity-70' : ''}`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-wrap gap-2">
                        <Badge variant={n.read ? 'secondary' : 'outline'} className="border-0 bg-muted">
                          {n.type}
                        </Badge>
                        <CardTitle className="text-base font-semibold tracking-tight">{n.title}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground pt-0">
                    <p>{n.body}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </motion.div>
      </ProtectedStub>
    </BioLoopShell>
  );
}
