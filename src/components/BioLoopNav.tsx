import { Link, useLocation } from 'react-router';
import { BioLoopLogo } from '@/components/BioLoopLogo';
import { Button } from '@/components/ui/button';
import { NavigationMenu, NavigationMenuLink, NavigationMenuItem, NavigationMenuList, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { useAuth } from '@/hooks/use-auth';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { to: '/marketplace', label: 'Marketplace' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/material-library', label: 'Material Library' },
  { to: '/impact-methodology', label: 'Impact Methodology' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export function BioLoopNav() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b rule bg-card/90 backdrop-blur supports-[backdrop-filter]:bg-card/70">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8" aria-label="Primary navigation">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 group" aria-label="BioLoop home">
            <BioLoopLogo className="h-7 w-7 text-foreground transition-colors group-hover:text-primary" />
            <span className="text-sm font-semibold tracking-tight text-foreground">BioLoop</span>
          </Link>

          <NavigationMenu>
            <NavigationMenuList className="flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <NavigationMenuItem key={link.to}>
                  <NavigationMenuLink
                    asChild
                  >
                    <Link
                      to={link.to}
                      className={cn(
                        navigationMenuTriggerStyle(),
                        'text-sm font-medium text-foreground/80 transition-colors',
                        location === link.to ? 'text-foreground font-semibold' : '',
                      )}
                    >
                      {link.label}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <Badge variant="secondary" className="border-0 bg-primary/10 text-primary text-xs font-medium px-3 py-1">
              BioLoop
            </Badge>
          ) : (
            <>
              <Link to="/auth">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  Sign in
                </Button>
              </Link>
              <Link to="/auth?returnTo=/dashboard">
                <Button size="sm" className="bg-primary text-primary-foreground shadow-none">
                  Get started
                </Button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
