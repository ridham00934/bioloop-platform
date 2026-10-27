import { useState } from 'react';
import { BioLoopShell } from '@/components/BioLoopShell';
import { ProtectedStub } from '@/pages/ProtectedStub';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { Info, Truck, MapPin, Clock } from 'lucide-react';

export default function BioRoutePage() {
  const [pickupAddress, setPickupAddress] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [pickupWindow, setPickupWindow] = useState('');
  const [logisticsPartner, setLogisticsPartner] = useState('');

  return (
    <BioLoopShell>
      <ProtectedStub
        title="BioRoute"
        description="Plan biomass pickup and delivery, request collection, and obtain logistics quotes."
      >
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex flex-col gap-4">
          <div className="flex items-start gap-3 rounded-md border bg-muted/50 p-4 text-sm">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <div className="text-muted-foreground">
              <p>BioRoute uses a configured routing provider for distance and duration estimates. If no provider
              is configured, BioLoop shows a clearly labelled approximation or asks for a transport quote.</p>
            </div>
          </div>

          <Card className="border-border/70 bg-card shadow-none">
            <CardHeader>
              <CardTitle className="text-base font-semibold tracking-tight">Collection or delivery request</CardTitle>
              <CardDescription>
                Provide pickup and delivery addresses, available pickup windows, and optional logistics partner
                preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="pickupAddress">Pickup address</Label>
                  <Input id="pickupAddress" value={pickupAddress} onChange={(e) => setPickupAddress(e.target.value)} placeholder="Farm gate, Punjab, Pakistan" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pickupPostcode">Pickup postcode</Label>
                  <Input id="pickupPostcode" placeholder="Optional" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="deliveryAddress">Delivery address</Label>
                  <Input id="deliveryAddress" value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} placeholder="Bioplastic plant, Lahore, Pakistan" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="deliveryPostcode">Delivery postcode</Label>
                  <Input id="deliveryPostcode" placeholder="Optional" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="pickupWindow">Available pickup window</Label>
                  <Input id="pickupWindow" type="datetime-local" value={pickupWindow} onChange={(e) => setPickupWindow(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="logisticsPartner">Preferred logistics partner</Label>
                  <Select value={logisticsPartner} onValueChange={setLogisticsPartner}>
                    <SelectTrigger><SelectValue placeholder="Any available partner" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any available partner</SelectItem>
                      <SelectItem value="partner_a">Green Logistics Co.</SelectItem>
                      <SelectItem value="partner_b">AgriTrans Services</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  <Label className="font-normal">Collection aggregation</Label>
                </div>
                <p className="text-xs text-muted-foreground">Group smaller nearby lots when timing, quantity, and pickup conditions are compatible.</p>
              </div>

              <Separator />

              <div className="rounded-md border bg-muted/50 p-4 text-xs text-muted-foreground">
                <p className="font-medium">Routing provider status</p>
                <p className="mt-1">Routing provider: <span className="font-semibold">Not configured</span></p>
                <p>BioLoop cannot estimate exact distance or duration until a routing provider is configured. The
                marketplace and ordering flow remain usable.</p>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" className="shadow-none">
                  Estimate transport quote
                </Button>
                <Button size="sm" className="bg-primary text-primary-foreground shadow-none hover:bg-primary/90" onClick={() => {}}>
                  <MapPin className="mr-2 h-4 w-4" /> Request collection
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card shadow-none">
            <CardHeader>
              <CardTitle className="text-base font-semibold tracking-tight">Upcoming shipments</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>No shipments yet. Created shipments will show status, pickup windows, delivery cost estimates, and
              proof of delivery.</p>
            </CardContent>
          </Card>
        </motion.div>
      </ProtectedStub>
    </BioLoopShell>
  );
}
