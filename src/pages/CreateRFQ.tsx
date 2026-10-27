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
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';

export default function CreateRFQ() {
  const navigate = useNavigate();

  return (
    <BioLoopShell>
      <ProtectedStub
        title="Create request for quotation"
        description="Ask suppliers to quote on a biomass requirement."
      >
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex flex-col gap-4">
          <Link to="/rfqs" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to RFQs
          </Link>

          <Card className="border-border/70 bg-card shadow-none">
            <CardHeader>
              <CardTitle className="text-base font-semibold tracking-tight">RFQ details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" placeholder="2 tonnes of rice husk for biodegradable film" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="feedstock">Feedstock</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select feedstock" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rice_husk">Rice husk</SelectItem>
                      <SelectItem value="sugarcane_bagasse">Sugarcane bagasse</SelectItem>
                      <SelectItem value="wheat_straw">Wheat straw</SelectItem>
                      <SelectItem value="sawdust">Sawdust</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description">Description and specifications</Label>
                <Textarea id="description" rows={4} placeholder="Describe the intended application, quality requirements, moisture limits, and any processing needs." />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <Label htmlFor="quantity">Required quantity</Label>
                  <Input id="quantity" type="number" placeholder="2" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="unit">Unit</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select unit" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tonnes">Tonnes</SelectItem>
                      <SelectItem value="kilograms">Kilograms</SelectItem>
                      <SelectItem value="cubic_meters">Cubic meters</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="region">Delivery region</Label>
                  <Input id="region" placeholder="Punjab, Pakistan" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="requiredBy">Required by date</Label>
                  <Input id="requiredBy" type="date" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="visibility">Visibility</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select visibility" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="restricted">Restricted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Link to="/rfqs">
                  <Button variant="ghost" size="sm" className="shadow-none">Cancel</Button>
                </Link>
                <Button size="sm" className="bg-primary text-primary-foreground shadow-none hover:bg-primary/90">
                  Save draft
                </Button>
              </div>
            </CardContent>
          </Card>

          <p className="text-xs text-muted-foreground">
            This form is a placeholder. Real RFQ creation will be built with backend validation,
            visibility controls, and organisation-scoped permissions.
          </p>
        </motion.div>
      </ProtectedStub>
    </BioLoopShell>
  );
}
