import { Link, useNavigate } from 'react-router';
import { BioLoopLogo } from '@/components/BioLoopLogo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

export default function SignInPage() {
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
            <CardTitle className="text-xl">Sign in to BioLoop</CardTitle>
            <CardDescription>
              Enter your email to log in or create an account.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Link to="/auth">
              <Button className="w-full bg-primary text-primary-foreground shadow-none hover:bg-primary/90">
                Continue with email
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button
              variant="outline"
              className="w-full shadow-none"
              onClick={() => navigate('/auth')}
            >
              Email sign-in
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
