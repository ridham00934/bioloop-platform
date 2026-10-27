import { useParams } from 'react-router';
import { BioLoopShell } from '@/components/BioLoopShell';
import { ProtectedStub } from '@/pages/ProtectedStub';
import { useAuth } from '@/hooks/use-auth';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { Loader2, MapPin, Package, Scale, Clock, Eye } from 'lucide-react';

export default function ListingDetails() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();

  return (
    <BioLoopShell>
      <ProtectedStub
        title={id ? `Listing ${id.slice(0, 8)}` : 'Listing'}
        description="Temporary placeholder while listing backend and detail views are built."
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col gap-4"
        >
          <Card className="border-border/70 bg-card shadow-none">
            <CardHeader>
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle className="text-lg font-semibold tracking-tight">Rice husk</CardTitle>
                <Badge variant="secondary" className="border-0 bg-muted">Agricultural residues</Badge>
                <Badge variant="secondary" className="border-0 bg-muted">Demo</Badge>
              </div>
              <CardDescription>
                Example placeholder listing. Real listing detail pages will come from the database.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Package className="h-4 w-4" /> Available: 40 tonnes
                </span>
                <span className="flex items-center gap-1.5">
                  <Scale className="h-4 w-4" /> 2.5 USD / tonne
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" /> Punjab, Pakistan
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" /> Collection window: Oct–Nov
                </span>
              </div>
              <Separator />
              <div className="flex justify-end gap-2">
                {isAuthenticated ? (
                  <>
                    <Link to="/rfqs/new">
                      <Button variant="outline" size="sm" className="shadow-none">
                        Request a quote
                      </Button>
                    </Link>
                    <Link to="/smart-matcher">
                      <Button size="sm" className="bg-primary text-primary-foreground shadow-none hover:bg-primary/90">
                        Run Smart Matcher
                      </Button>
                    </Link>
                  </>
                ) : (
                  <Link to="/auth?returnTo=/dashboard">
                    <Button size="sm" className="bg-primary text-primary-foreground shadow-none hover:bg-primary/90">
                      Sign in to inquire
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card shadow-none">
            <CardHeader>
              <CardTitle className="text-base font-semibold tracking-tight">Data confidence</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>This is a demo placeholder. Real listings show supplier-declared, document-provided,
              document-reviewed, sample-tested, and independently-audited evidence levels where applicable.</p>
              {isAuthenticated && (
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link to={`/listings/${id}/edit`}>
                    <Button variant="outline" size="sm" className="shadow-none">
                      Edit listing
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" className="shadow-none">
                    <Eye className="mr-2 h-4 w-4" /> View BioPassport
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </ProtectedStub>
    </BioLoopShell>
  );
}
