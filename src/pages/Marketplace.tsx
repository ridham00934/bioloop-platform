import { Link } from 'react-router';
import { BioLoopNav } from '@/components/BioLoopNav';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';

export default function Marketplace() {
  const { isAuthenticated } = useAuth();
  return (
    <div className="min-h-screen bg-background text-foreground px-4 py-12 sm:px-6 lg:px-8">
      <BioLoopNav />
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold tracking-tight">Biomass Marketplace</h1>
          <p className="mt-3 text-muted-foreground">
            Discover agricultural and organic biomass feedstocks from verified suppliers.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 justify-center">
            {isAuthenticated ? (
              <>
                <Link to="/marketplace/listings">
                  <Button size="lg" className="bg-primary text-primary-foreground shadow-none hover:bg-primary/90">
                    Browse listings
                  </Button>
                </Link>
                <Link to="/smart-matcher">
                  <Button variant="outline" size="lg" className="shadow-none">
                    Smart Matcher
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/auth?returnTo=/dashboard">
                  <Button size="lg" className="bg-primary text-primary-foreground shadow-none hover:bg-primary/90">
                    Sign in to explore
                  </Button>
                </Link>
                <Link to="/sign-up">
                  <Button variant="outline" size="lg" className="shadow-none">
                    Create a supplier account
                  </Button>
                </Link>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
