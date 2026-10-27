import { Link, useNavigate } from 'react-router';
import { BioLoopLogo } from '@/components/BioLoopLogo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowRight, Shield } from 'lucide-react';

export default function SignUpPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b px-4 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2 group">
            <BioLoopLogo className="h-7 w-7 text-foreground transition-colors group-hover:text-primary" />
            <span className="text-sm font-semibold tracking-tight">BioLoop</span>
          </Link>
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center px-4">
        <Card className="min-w-[360px] border shadow-none">
          <CardHeader className="text-center">
            <div className="flex justify-center">
              <BioLoopLogo className="h-9 w-9 text-foreground" />
            </div>
            <CardTitle className="text-xl">Create a BioLoop account</CardTitle>
            <CardDescription>
              Join as a supplier, buyer, processor, or logistics partner.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Alert>
              <Shield className="h-4 w-4 shrink-0" />
              <AlertDescription className="text-xs">
                Administrator access is not available during public sign-up. Platform operators provision
                admin accounts separately.
              </AlertDescription>
            </Alert>
            <Link to="/auth">
              <Button className="w-full bg-primary text-primary-foreground shadow-none hover:bg-primary/90">
                Create account with email
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button
              variant="outline"
              className="w-full shadow-none"
              onClick={() => navigate('/auth')}
            >
              Sign up with email
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
