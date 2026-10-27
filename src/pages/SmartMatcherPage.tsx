import { useState } from 'react';
import { BioLoopShell } from '@/components/BioLoopShell';
import { ProtectedStub } from '@/pages/ProtectedStub';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Search, Info } from 'lucide-react';

export default function SmartMatcherPage() {
  const [application, setApplication] = useState('');
  const [feedstock, setFeedstock] = useState('');
  const [quantity, setQuantity] = useState('');
  const [region, setRegion] = useState('');
  const [maxDistance, setMaxDistance] = useState('');
  const [moistureRequirement, setMoistureRequirement] = useState('');
  const [requiredByDate, setRequiredByDate] = useState('');
  const [priceCeiling, setPriceCeiling] = useState('');
  const [allowSplitOrders, setAllowSplitOrders] = useState(false);

  return (
    <BioLoopShell>
      <ProtectedStub
        title="Smart Waste-to-Material Matcher"
        description="Find potentially suitable feedstocks based on your requirements."
      >
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex flex-col gap-4">
          <div className="flex items-start gap-3 rounded-md border bg-muted/50 p-4 text-sm">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <div className="text-muted-foreground">
              <p>A match score is a preliminary sourcing aid. It is not proof of scientific compatibility or
              certification. Ask suppliers for the details behind any result.</p>
            </div>
          </div>

          <Card className="border-border/70 bg-card shadow-none">
            <CardHeader>
              <CardTitle className="text-base font-semibold tracking-tight">Your requirements</CardTitle>
              <CardDescription>
                The matcher applies hard filters first (where possible), then ranks with a configurable weighted
                score.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="feedstock">Preferred feedstock</Label>
                  <Select value={feedstock} onValueChange={setFeedstock}>
                    <SelectTrigger><SelectValue placeholder="Any feedstock" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rice_husk">Rice husk</SelectItem>
                      <SelectItem value="sugarcane_bagasse">Sugarcane bagasse</SelectItem>
                      <SelectItem value="wheat_straw">Wheat straw</SelectItem>
                      <SelectItem value="sawdust">Sawdust</SelectItem>
                      <SelectItem value="any">Any feedstock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="region">Delivery region</Label>
                  <Input id="region" value={region} onChange={(e) => setRegion(e.target.value)} placeholder="Punjab, Pakistan" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="quantity">Required quantity</Label>
                  <Input id="quantity" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="2" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="unit">Unit</Label>
                  <Select value="tonnes" onValueChange={() => {}}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tonnes">Tonnes</SelectItem>
                      <SelectItem value="kilograms">Kilograms</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="maxDistance">Maximum delivery distance (km)</Label>
                  <Input id="maxDistance" type="number" value={maxDistance} onChange={(e) => setMaxDistance(e.target.value)} placeholder="200" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="priceCeiling">Maximum price ceiling</Label>
                  <Input id="priceCeiling" type="number" step="0.01" value={priceCeiling} onChange={(e) => setPriceCeiling(e.target.value)} placeholder="2.50" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="moisture">Moisture requirement</Label>
                  <Input id="moisture" value={moistureRequirement} onChange={(e) => setMoistureRequirement(e.target.value)} placeholder="e.g. below 15%" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="requiredBy">Required by date</Label>
                  <Input id="requiredBy" type="date" value={requiredByDate} onChange={(e) => setRequiredByDate(e.target.value)} />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="application">Intended application</Label>
                <Textarea id="application" rows={3} value={application} onChange={(e) => setApplication(e.target.value)} placeholder="e.g. biodegradable packaging film" />
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Switch id="allowSplit" checked={allowSplitOrders} onCheckedChange={setAllowSplitOrders} />
                  <Label htmlFor="allowSplit" className="font-normal">Allow split orders</Label>
                </div>
                <p className="text-xs text-muted-foreground">If off, the matcher requires suppliers to meet the full quantity.</p>
              </div>

              <Separator />

              <div className="rounded-md border bg-muted/50 p-4 text-xs text-muted-foreground">
                <p className="font-medium">Current scoring weights</p>
                <ul className="mt-1 list-disc pl-5">
                  <li>Application compatibility: 30%</li>
                  <li>Quantity fit: 20%</li>
                  <li>Quality-data fit: 15%</li>
                  <li>Delivery feasibility: 15%</li>
                  <li>Availability timing: 10%</li>
                  <li>Commercial fit: 10%</li>
                </ul>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" className="shadow-none">
                  Reset
                </Button>
                <Button size="sm" className="bg-primary text-primary-foreground shadow-none hover:bg-primary/90" onClick={() => {}}>
                  <Search className="mr-2 h-4 w-4" /> Run matcher
                </Button>
              </div>
            </CardContent>
          </Card>

          {false && (
            <Card className="border-border/70 bg-card shadow-none">
              <CardHeader>
                <CardTitle className="text-base font-semibold tracking-tight">Results</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>Match results will appear here with fit scores, reasons, missing information, and known
                mismatches.</p>
              </CardContent>
            </Card>
          )}

          <p className="text-xs text-muted-foreground">
            The real matcher will query permitted listings, store match runs with the rules version used, and
            explain each result.
          </p>
        </motion.div>
      </ProtectedStub>
    </BioLoopShell>
  );
}
