import { BioLoopShell } from '@/components/BioLoopShell';
import { ProtectedStub } from '@/pages/ProtectedStub';
import { useAuth } from '@/hooks/use-auth';
import { useNavigate } from 'react-router';
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';

export default function MarketplaceListings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const profile = useQuery(api.listings.listMarketplaceListings, { limit: 20 }) as unknown as ReturnType<typeof api.listings.listMarketplaceListings> extends Promise<infer U> ? U : never[] | undefined;

  return (
    <BioLoopShell>
      <ProtectedStub
        title="Available listings"
        description="Browse biomass feedstock available from suppliers on BioLoop."
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <Input placeholder="Search material, supplier, or region" className="max-w-sm" />
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="agricultural_residues">Agricultural residues</SelectItem>
                <SelectItem value="sugar_industry_residues">Sugar-industry residues</SelectItem>
                <SelectItem value="fruit_vegetable_residues">Fruit & vegetable residues</SelectItem>
                <SelectItem value="forestry_byproducts">Forestry by-products</SelectItem>
                <SelectItem value="food_processing_byproducts">Food-processing by-products</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="shadow-none" onClick={() => navigate('/smart-matcher')}>
              Smart Matcher
            </Button>
          </div>

          {profile === undefined ? (
            <div className="flex justify-center py-12">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : (profile ?? []).length === 0 ? (
            <Card className="border-border/70 bg-card shadow-none">
              <CardHeader>
                <CardTitle className="text-base font-semibold tracking-tight">No listings yet</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>BioLoop does not have published listings yet.</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link to="/listings/new">
                    <Button variant="outline" size="sm" className="shadow-none">
                      Create a listing
                    </Button>
                  </Link>
                  <Link to="/rfqs/new">
                    <Button variant="outline" size="sm" className="shadow-none">
                      Post a RFQ
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col gap-3">
              {(profile ?? []).map((listing: any) => (
                <Link key={listing._id} to={`/listings/${listing._id}`} className="block">
                  <Card className="border-border/70 bg-card shadow-none hover:border-primary/40 transition-colors">
                    <CardHeader className="flex flex-row items-start gap-3 pb-2">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <CardTitle className="text-base font-semibold tracking-tight">{listing.title}</CardTitle>
                          <Badge variant="secondary" className="border-0 bg-muted">
                            {listing.category}
                          </Badge>
                          {listing.isDemo ? (
                            <Badge variant="outline" className="border-dashed text-muted-foreground">Demo</Badge>
                          ) : null}
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground line-clamp-1">{listing.description}</p>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0 text-sm">
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-muted-foreground">
                        <span>Available: {listing.availableQuantity}{' '}{listing.unit}</span>
                        {listing.pricePerUnit ? (
                          <span>{listing.currency} {listing.pricePerUnit} / {listing.unit}</span>
                        ) : (
                          <span>Pricing: {listing.pricing}</span>
                        )}
                        <span>{listing.region}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </ProtectedStub>
    </BioLoopShell>
  );
}
