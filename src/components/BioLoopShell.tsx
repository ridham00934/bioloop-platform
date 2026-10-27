import { Link, NavLink, useLocation, useNavigate } from 'react-router';
import { BioLoopLogo } from '@/components/BioLoopLogo';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarInset, SidebarProvider, SidebarTrigger, SidebarMenuButton } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Separator,
} from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useAuth } from '@/hooks/use-auth';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type IconComponent = React.ComponentType<{ className?: string }>;

interface SidebarLink {
  to: string;
  label: string;
  icon: IconComponent;
  roles: string[];
}

const ORG_ROUTE_NAMES: SidebarLink[] = [
  { to: '/dashboard', label: 'Overview', icon: BarChart3, roles: ['supplier', 'buyer', 'processor', 'logistics', 'admin'] },
  { to: '/marketplace', label: 'Marketplace', icon: Search, roles: ['supplier', 'buyer', 'processor', 'logistics', 'admin'] },
  { to: '/listings', label: 'My Listings', icon: ListIcon, roles: ['supplier', 'admin'] },
  { to: '/rfqs', label: 'Requests for Quotation', icon: FileQuestion, roles: ['buyer', 'supplier', 'admin'] },
  { to: '/quotes', label: 'Quotes', icon: Receipt, roles: ['buyer', 'supplier', 'admin'] },
  { to: '/orders', label: 'Orders', icon: Graduation, roles: ['supplier', 'buyer', 'processor', 'logistics', 'admin'] },
  { to: '/shipments', label: 'Shipments', icon: Truck, roles: ['supplier', 'buyer', 'logistics', 'admin'] },
  { to: '/messages', label: 'Messages', icon: MessageSquare, roles: ['supplier', 'buyer', 'processor', 'logistics', 'admin'] },
  { to: '/saved-materials', label: 'Saved Materials', icon: Heart, roles: ['supplier', 'buyer', 'admin'] },
  { to: '/passports', label: 'BioPassports', icon: Shield, roles: ['supplier', 'buyer', 'processor', 'logistics', 'admin'] },
  { to: '/biovalue-calculator', label: 'BioValue Calculator', icon: Calculator, roles: ['supplier', 'buyer', 'processor', 'logistics', 'admin'] },
  { to: '/smart-matcher', label: 'Smart Matcher', icon: HelpCircle, roles: ['buyer', 'processor', 'admin'] },
  { to: '/bioroute', label: 'BioRoute', icon: Truck, roles: ['logistics', 'supplier', 'buyer', 'admin'] },
  { to: '/impact-ledger', label: 'Impact Ledger', icon: LineChart, roles: ['supplier', 'buyer', 'processor', 'logistics', 'admin'] },
  { to: '/notifications', label: 'Notifications', icon: Bell, roles: ['supplier', 'buyer', 'processor', 'logistics', 'admin'] },
  { to: '/settings/organisation', label: 'Organisation', icon: Building, roles: ['supplier', 'buyer', 'processor', 'logistics', 'admin'] },
  { to: '/settings/profile', label: 'Profile', icon: User, roles: ['supplier', 'buyer', 'processor', 'logistics', 'admin'] },
  { to: '/ai-assistant', label: 'AI Assistant', icon: Sparkles, roles: ['supplier', 'buyer', 'processor', 'logistics', 'admin'] },
];

const ADMIN_ROUTE_NAMES: SidebarLink[] = [
  { to: '/admin', label: 'Admin overview', icon: Shield, roles: ['admin'] },
  { to: '/admin/verification', label: 'Verification queue', icon: Check, roles: ['admin'] },
  { to: '/admin/users', label: 'Users & organisations', icon: User, roles: ['admin'] },
  { to: '/admin/taxonomy', label: 'Feedstock taxonomy', icon: Leaf, roles: ['admin'] },
  { to: '/admin/disputes', label: 'Disputes', icon: AlertTriangle, roles: ['admin'] },
  { to: '/admin/audit', label: 'Audit logs', icon: FileText, roles: ['admin'] },
  { to: '/admin/integrations', label: 'Integration health', icon: Cpu, roles: ['admin'] },
  { to: '/admin/data-quality', label: 'Data quality', icon: Magnet, roles: ['admin'] },
];

function ListIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.8">
      <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  );
}

function Heart({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.8">
      <path d="M12 21s-7-5.5-7-11a3 3 0 0 1 5.5-2.5A3 3 0 0 1 12 4a3 3 0 0 1 2.5 2.5C15.5 6.5 20 11 20 15c0 2-1 4.5-3 6.5A3 3 0 0 1 12 21Z" />
    </svg>
  );
}

function Check({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.8">
      <path d="M9 12.75L11.25 15 15 9.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AlertTriangle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.8">
      <path d="M12 9v3.75m0-3.75a3 3 0 116 0 3 3 0 01-6 0zM12 17.25H3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FileText({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.8">
      <path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  );
}

function Cpu({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.8">
      <path d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 01-3 0M15 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 01-3 0M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  );
}

function Magnet({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.8">
      <path d="M12 6v7m0 0V6m0 0a6 6 0 00-6 6v1.5m12-6v7m0 0V6m0 0a6 6 0 00-6 6v1.5M6 6h.008v.008H6V6ZM19.992 6H20v.008V6Z" />
    </svg>
  );
}

function Sparkles({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.8">
      <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
    </svg>
  );
}

function Calculator({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.8">
      <path d="M14.25 12H18m-13.5 0a9 9 0 1118 0v2.25a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 14.25V12m13.5-2.25A9 9 0 012.25 12v2.25m13.5 0V16.5c0 .621-.504 1.125-1.125 1.125H6.75c-.621 0-1.125-.504-1.125-1.125V12m13.5 2.25H18" />
    </svg>
  );
}

function Leaf({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.8">
      <path d="M11.35 3.836c-2.361 0-4.245.508-5.674 1.414-1.474.926-2.317 2.28-2.317 4.027 0 1.747.843 3.064 2.317 4.027 1.429.906 3.313 1.414 5.674 1.414 2.361 0 4.245-.508 5.674-1.414 1.474-.926 2.317-2.28 2.317-4.027 0-1.747-.843-3.064-2.317-4.027-1.429-.906-3.313-1.414-5.674-1.414z" />
      <path d="M3.836 11.35c0-2.361.508-4.245 1.414-5.674.926-1.474 2.28-2.317 4.027-2.317 1.747 0 3.064.843 4.027 2.317 1.414.906 2.317 2.28 2.317 4.027 0 2.361-.508 4.245-1.414 5.674-.926 1.474-2.28 2.317-4.027 2.317-1.747 0-3.064-.843-4.027-2.317-1.414-.906-2.317-2.28-2.317-4.027z" />
      <path d="M12 21a9 9 0 109-9 9 9 0 00-9 9z" />
    </svg>
  );
}

function Truck({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.8">
      <path d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 01-3 0M15 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 01-3 0M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  );
}

function BarChart3({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.8">
      <path d="M3 3v18h18M18.75 9.75a3 3 0 01-3 3m-5.25-3a3 3 0 01-3 3m4.5 3a3 3 0 01-3 3M9 15l3 3 3-3M12 18v-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Search({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.8">
      <circle cx="11.25" cy="11.25" r="6.75" />
      <path d="M21 21l-3.75-3.75" strokeLinecap="round" />
    </svg>
  );
}

function Shield({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.8">
      <path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  );
}

function Bell({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.8">
      <path d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
    </svg>
  );
}

function Building({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.8">
      <path d="M3.75 21h16.5M4.5 3h15M6 6h12M6 12h12M6 18h12" strokeLinecap="round" />
    </svg>
  );
}

function User({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.8">
      <circle cx="9" cy="7" r="4" />
      <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
      <circle cx="17" cy="7" r="3.5" />
      <path d="M21 21v-2a3.5 3.5 0 00-3.5-3.5H15.5A3.5 3.5 0 0012 15.5V21" />
    </svg>
  );
}

function MessageSquare({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.8">
      <path d="M4 14.832A7.968 7.968 0 018.5 9a7.968 7.968 0 014.5-3.168A7.968 7.968 0 0116.5 9c.895 0 1.76.202 2.5.568V21l4-4H4z" />
    </svg>
  );
}

function LineChart({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.8">
      <path d="M3 3v18h18M9.75 15.75a3 3 0 01-3-3m3 3a3 3 0 003-3m-3 3v3m0 0v3m0-3h3m-3 0H6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FileQuestion({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.8">
      <path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z" />
      <path d="M14 2v6h6M9.5 12.5a2.121 2.121 0 013 3L12 17l-3.5 1.5a2.121 2.121 0 01-3-3V12.5z" />
    </svg>
  );
}

function Receipt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.8">
      <path d="M9 12h6m-6 4h6m2 5H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-1v4.5A2.5 2.5 0 0019 19H6a2.5 2.5 0 00-2.5-2.5V21z" />
    </svg>
  );
}

function Graduation({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.8">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}

function HelpCircle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LogOut({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.8">
      <path d="M9 15l6-6m0 0l6 6m-6-6v12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Loader2({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.8">
      <path d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SidebarLink({
  item,
  currentRole,
  className,
}: {
  item: SidebarLink;
  currentRole?: string;
  className?: string;
}) {
  const allowed = item.roles.includes(currentRole ?? '');
  const isActive = allowed && location.pathname.startsWith(item.to);

  if (!allowed) {
    return null;
  }

  const content = (
    <NavLink
      to={item.to}
      className={cn(
        'group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
        isActive ? 'bg-primary/10 text-primary' : 'text-foreground/70 hover:bg-muted hover:text-foreground',
        className,
      )}
    >
      <SidebarMenuButton
        className={cn(
          'h-8 w-8 shrink-0 rounded-md border border-transparent flex items-center justify-center text-base transition-colors',
          isActive ? 'bg-primary/10 text-primary' : 'text-foreground/50 group-hover:text-foreground',
        )}
      >
        <item.icon className="h-4 w-4" />
      </SidebarMenuButton>
      {item.label}
    </NavLink>
  );

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right" className="flex items-center gap-2">
          {item.label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function AccountMenu() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const name = user?.name || user?.email?.split('@')[0] || 'Account';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative gap-2 h-9 w-[150px] lg:w-auto justify-start text-left">
          <Avatar className="h-7 w-7">
            <AvatarFallback className="bg-muted text-foreground text-xs font-medium">
              {name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="hidden lg:inline text-sm font-medium text-foreground">{name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex items-center gap-2 px-2 py-1.5">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-muted text-foreground text-xs font-medium">{name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-medium text-foreground">{name}</p>
            <p className="text-xs text-muted-foreground">{user?.email || 'No account'}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link to="/settings/profile" className="text-foreground">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link to="/settings/organisation" className="text-foreground">
            <Building className="mr-2 h-4 w-4" />
            Organisation
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive" onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function NotifBadge({ count }: { count: number }) {
  return count > 0 ? (
    <span className="absolute -right-1 -top-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground ring-2 ring-background">
      {count > 99 ? '99+' : count}
    </span>
  ) : null;
}

export function BioLoopShell({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const profile = useQuery(api.profiles.profile);
  const notifications = useQuery(api.notifications.list, { limit: 10 });
  const unreadCount = notifications?.reduce((acc, n) => acc + (n.read === false ? 1 : 0), 0) ?? 0;

  const currentRole = profile?.role;

  if (isLoading || user === undefined || profile == null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const orgSlug = profile.organisationSlug;
  const roleLabel = typeof currentRole === 'string' ? currentRole : 'member';

  return (
    <SidebarProvider>
      <TooltipProvider delayDuration={0}>
        <div className="flex min-h-screen bg-background">
          {/* Sidebar */}
          <Sidebar side="left" className="border-r">
            <SidebarHeader className="flex items-center gap-2 border-b px-4 py-3">
              <BioLoopLogo className="h-6 w-6" />
              <span className="text-sm font-semibold tracking-tight">BioLoop</span>
              <SidebarTrigger className="ml-auto" />
            </SidebarHeader>

            <SidebarContent className="px-2 py-2">
              <nav className="flex flex-col gap-1">
                <div className="px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {orgSlug || 'Workspace'}
                </div>
                <Separator className="my-1" />

                {ORG_ROUTE_NAMES.map((item) => (
                  <SidebarLink key={item.to} item={item} currentRole={roleLabel} />
                ))}

                {currentRole === 'admin' && (
                  <>
                    <div className="mt-4 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                      Administration
                    </div>
                    <Separator className="my-1" />
                    {ADMIN_ROUTE_NAMES.map((item) => (
                      <SidebarLink key={item.to} item={item} currentRole={roleLabel} />
                    ))}
                  </>
                )}
              </nav>
            </SidebarContent>

            <SidebarFooter className="border-t p-2">
              <AccountMenu />
            </SidebarFooter>
          </Sidebar>

          {/* Main */}
          <SidebarInset className="flex flex-col min-h-screen">
            {/* Top bar */}
            <header className="sticky top-0 z-20 flex items-center justify-between border-b bg-card/80 px-4 py-3 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3">
                <SidebarTrigger className="-ml-1 hidden lg:flex" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-medium text-muted-foreground">
                    {orgSlug ? orgSlug : 'Your workspace'}
                  </span>
                  <span className="text-sm font-semibold tracking-tight">
                    {(roleLabel.charAt(0).toUpperCase() + roleLabel.slice(1))} view
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link to="/notifications" className="relative" aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Bell className="h-4 w-4" />
                  </Button>
                  <NotifBadge count={unreadCount} />
                </Link>
              </div>
            </header>

            <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
              {children}
            </main>
          </SidebarInset>
        </div>
      </TooltipProvider>
    </SidebarProvider>
  );
}
