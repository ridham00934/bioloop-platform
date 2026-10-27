import { Navigate, useLocation } from 'react-router';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Loader2 } from 'lucide-react';
import type { ReactNode } from 'react';

export function RequireAdmin({ children }: { children: ReactNode }) {
  const location = useLocation();
  const profile = useQuery(api.profiles.profile);

  if (profile == null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Admin access is determined by the current membership role.
  if (profile.role !== 'admin') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background p-6">
        <div className="max-w-md text-center">
          <p className="text-sm font-semibold">Admin access required</p>
          <p className="mt-1 text-sm text-muted-foreground">
            This area is only available to platform administrators.
          </p>
          <Navigate to="/dashboard" replace state={{ from: location }} />
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
