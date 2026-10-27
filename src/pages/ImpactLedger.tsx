import { BioLoopShell } from '@/components/BioLoopShell';
import { ProtectedStub } from '@/pages/ProtectedStub';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { TrendingUp, Leaf, Package, DollarSign, BarChart3 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function ImpactLedger() {
  return (
    <BioLoopShell>
      <ProtectedStub
        title="Impact Ledger"
        description="Measured activity and documented estimates from completed transactions."
      >
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex flex-col gap-4">
          <div className="flex items-start gap-3 rounded-md border bg-muted/50 p-4 text-sm">
            <Leaf className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <div className="text-muted-foreground">
              <p>BioLoop does not automatically treat all sold biomass as waste prevented. Environmental outcomes
              depend on what would otherwise have happened to that material. Impact estimates are shown only with
              a documented methodology, relevant factors, and calculation boundaries.</p>
            </div>
          </div>

          <Card className="border-border/70 bg-card shadow-none">
            <CardHeader>
              <CardTitle className="text-base font-semibold tracking-tight">Period filters</CardTitle>
              <CardDescription>
                All impact figures come from persisted records, documented calculations, or clearly labelled demo
                data.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex flex-wrap gap-2">
                <Select>
                  <SelectTrigger className="w-[180px]"><SelectValue placeholder="This year" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="this_year">This year</SelectItem>
                    <SelectItem value="last_year">Last year</SelectItem>
                    <SelectItem value="all_time">All time</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-[180px]"><SelectValue placeholder="All feedstocks" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All feedstocks</SelectItem>
                    <SelectItem value="rice_husk">Rice husk</SelectItem>
                    <SelectItem value="bagasse">Sugarcane bagasse</SelectItem>
                    <SelectItem value="wheat_straw">Wheat straw</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-[160px]"><SelectValue placeholder="All regions" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All regions</SelectItem>
                    <SelectItem value="punjab">Punjab</SelectItem>
                    <SelectItem value="sindh">Sindh</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-md border bg-card p-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Package className="h-4 w-4" />
                    <span className="text-xs font-medium">Biomass recovered</span>
                  </div>
                  <p className="mt-1 text-xl font-semibold tabular-nums">Not enough verified data to calculate this impact yet.</p>
                </div>
                <div className="rounded-md border bg-card p-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-xs font-medium">Completed order value</span>
                  </div>
                  <p className="mt-1 text-xl font-semibold tabular-nums">Not enough verified data to calculate this impact yet.</p>
                </div>
              </div>

              <div className="rounded-md border bg-card p-4 text-sm">
                <p className="font-medium">Why this says "not enough verified data"</p>
                <p className="mt-1 text-muted-foreground">
                  The Impact Ledger reports completed transactions only. Until an order is completed in BioLoop,
                  there is no verified transaction to aggregate. Quoted or ordered value is not counted as
                  completed value.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card shadow-none">
            <CardHeader>
              <CardTitle className="text-base font-semibold tracking-tight">Reported vs estimated vs verified</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <ul className="list-disc pl-5">
                <li>Measured activity comes from completed or delivered orders.</li>
                <li>Estimated outcomes use documented formulas and stated assumptions.</li>
                <li>Verified environmental claims appear only where evidence supports them.</li>
              </ul>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button variant="outline" size="sm" className="shadow-none" onClick={() => {}}>
              <BarChart3 className="mr-2 h-4 w-4" /> View by organisation
            </Button>
          </div>
        </motion.div>
      </ProtectedStub>
    </BioLoopShell>
  );
}
