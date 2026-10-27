import { useNavigate } from 'react-router';
import { BioLoopShell } from '@/components/BioLoopShell';
import { ProtectedStub } from '@/pages/ProtectedStub';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { ArrowLeft, Save } from 'lucide-react';
import { Link } from 'react-router';

export default function CreateListing() {
  const navigate = useNavigate();

  return (
    <BioLoopShell>
      <ProtectedStub
        title="Create listing"
        description="Publish a new biomass listing to the marketplace."
      >
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex flex-col gap-4">
          <Link to="/listings" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to listings
          </Link>

          <Card className="border-border/70 bg-card shadow-none">
            <CardHeader>
              <CardTitle className="text-base font-semibold tracking-tight">Listing details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" placeholder="Rice husk, available after harvest" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="feedstock">Feedstock</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select feedstock" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rice_husk">Rice husk</SelectItem>
                      <SelectItem value="wheat_straw">Wheat straw</SelectItem>
                      <SelectItem value="sugarcane_bagasse">Sugarcane bagasse</SelectItem>
                      <SelectItem value="sawdust">Sawdust</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="agricultural_residues">Agricultural residues</SelectItem>
                      <SelectItem value="sugar_industry_residues">Sugar-industry residues</SelectItem>
                      <SelectItem value="forestry_byproducts">Forestry by-products</SelectItem>
                      <SelectItem value="food_processing_byproducts">Food-processing by-products</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="region">Region</Label>
                  <Input id="region" placeholder="Punjab, Pakistan" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="quantity">Available quantity</Label>
                  <Input id="quantity" type="number" placeholder="40" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="unit">Unit</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select unit" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tonnes">Tonnes</SelectItem>
                      <SelectItem value="kilograms">Kilograms</SelectItem>
                      <SelectItem value="cubic_meters">Cubic meters</SelectItem>
                      <SelectItem value="bales">Bales</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="price">Price per unit</Label>
                  <Input id="price" type="number" placeholder="2.5" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="currency">Currency</Label>
                  <Input id="currency" value="USD" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" rows={4} placeholder="Describe the material, quality, and any known conditions." />
              </div>

              <div className="flex justify-end gap-2">
                <Link to="/listings">
                  <Button variant="ghost" size="sm" className="shadow-none">Cancel</Button>
                </Link>
                <Button size="sm" className="bg-primary text-primary-foreground shadow-none hover:bg-primary/90">
                  <Save className="mr-2 h-4 w-4" /> Save draft
                </Button>
              </div>
            </CardContent>
          </Card>

          <p className="text-xs text-muted-foreground">
            This form is a placeholder. Real listing creation will be built with backend validation and
            organisation-scoped permissions.
          </p>
        </motion.div>
      </ProtectedStub>
    </BioLoopShell>
  );
}
