import { BioLoopShell } from '@/components/BioLoopShell';
import { RequireAdmin } from '@/components/RequireAdmin';
import { ProtectedStub } from '@/pages/ProtectedStub';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { Leaf, Plus } from 'lucide-react';
import { useState } from 'react';

const CATEGORIES = [
  { value: 'agricultural_residues', label: 'Agricultural residues' },
  { value: 'sugar_industry_residues', label: 'Sugar-industry residues' },
  { value: 'fruit_vegetable_residues', label: 'Fruit & vegetable residues' },
  { value: 'forestry_byproducts', label: 'Forestry by-products' },
  { value: 'food_processing_byproducts', label: 'Food-processing by-products' },
  { value: 'fermentation_residues', label: 'Fermentation residues' },
  { value: 'oily_seed_residues', label: 'Oily seed residues' },
];

export default function AdminTaxonomy() {
  const [name, setName] = useState('');
  const [commonNames, setCommonNames] = useState('');
  const [category, setCategory] = useState('agricultural_residues');
  const [description, setDescription] = useState('');

  return (
    <BioLoopShell>
      <RequireAdmin>
        <ProtectedStub
          title="Feedstock taxonomy"
          description="Manage the feedstock types used across marketplace listings and the matcher."
        >
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex flex-col gap-4">
            <Card className="border-border/70 bg-card shadow-none">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold tracking-tight">Feedstock types</CardTitle>
                  <Button variant="outline" size="sm" className="shadow-none">
                    <Plus className="mr-2 h-4 w-4" /> Add feedstock
                  </Button>
                </div>
                <CardDescription>
                  Taxonomy is managed by administrators and used by listings, the matcher, and BioPassports.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>No feedstock types yet.</p>
              </CardContent>
            </Card>

            <Card className="border-border/70 bg-card shadow-none">
              <CardHeader>
                <CardTitle className="text-base font-semibold tracking-tight">Add feedstock type</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Rice husk" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="category">Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((c) => (
                          <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="commonNames">Common names</Label>
                  <Input id="commonNames" value={commonNames} onChange={(e) => setCommonNames(e.target.value)} placeholder="Rice husk, paddy husk" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Moisture and composition notes." />
                </div>
                <div className="flex justify-end">
                  <Button variant="outline" size="sm" className="shadow-none" disabled={!name.trim()}>
                    Cancel
                  </Button>
                  <Button size="sm" className="bg-primary text-primary-foreground shadow-none hover:bg-primary/90" disabled={!name.trim()}>
                    <Leaf className="mr-2 h-4 w-4" /> Save
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Separator />

            <p className="text-xs text-muted-foreground">
              Real taxonomy management will persist to the database and be used by marketplace listings and the
              Smart Matcher.
            </p>
          </motion.div>
        </ProtectedStub>
      </RequireAdmin>
    </BioLoopShell>
  );
}
