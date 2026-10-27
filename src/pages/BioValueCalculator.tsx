import { BioLoopShell } from '@/components/BioLoopShell';
import { ProtectedStub } from '@/pages/ProtectedStub';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';

export default function BioValueCalculator() {
  return (
    <BioLoopShell>
      <ProtectedStub
        title="BioValue calculator"
        description="Estimate the potential economic value of a biomass lot."
      >
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex flex-col gap-4">
          <Card className="border-border/70 bg-card shadow-none">
            <CardHeader>
              <CardTitle className="text-base font-semibold tracking-tight">Inputs</CardTitle>
              <CardDescription>
                All results use documented formulas and persist inputs, assumptions, and formula version.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="grossMass">Gross biomass mass</Label>
                  <Input id="grossMass" type="number" placeholder="100" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="unit">Unit</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select unit" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tonnes">Tonnes</SelectItem>
                      <SelectItem value="kilograms">Kilograms</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="feedstock">Feedstock type</Label>
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
                <div className="space-y-1.5">
                  <Label htmlFor="usableFraction">Usable fraction (decimal)</Label>
                  <Input id="usableFraction" type="number" step="0.01" placeholder="0.85" />
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="unitPrice">Assumed unit sale price</Label>
                  <Input id="unitPrice" type="number" step="0.01" placeholder="2.50" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="currency">Currency</Label>
                  <Input id="currency" value="USD" />
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="processingCost">Known processing cost</Label>
                  <Input id="processingCost" type="number" step="0.01" placeholder="0" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="handlingCost">Known handling cost</Label>
                  <Input id="handlingCost" type="number" step="0.01" placeholder="0" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="transportCost">Known transport cost</Label>
                  <Input id="transportCost" type="number" step="0.01" placeholder="0" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="contaminationNote">Contamination / loss note</Label>
                  <Input id="contaminationNote" placeholder="e.g. 2%" />
                </div>
              </div>

              <Separator />

              <div className="rounded-md border bg-muted/50 p-4 text-xs text-muted-foreground">
                <p className="font-medium">Formula used</p>
                <p className="mt-1">Usable mass = Gross mass × Usable fraction</p>
                <p>Estimated sale value = Usable mass × Assumed unit price</p>
                <p>Estimated net value = Sale value − Known processing costs − Known handling costs − Known
                transport costs</p>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" className="shadow-none">
                  Clear
                </Button>
                <Button size="sm" className="bg-primary text-primary-foreground shadow-none hover:bg-primary/90">
                  Calculate
                </Button>
              </div>
            </CardContent>
          </Card>

          <p className="text-xs text-muted-foreground">
            This calculator is a placeholder. Real BioValue calculations will persist their inputs, outputs,
            assumptions, and formula version, and will show ranges when inputs are uncertain.
          </p>
        </motion.div>
      </ProtectedStub>
    </BioLoopShell>
  );
}
