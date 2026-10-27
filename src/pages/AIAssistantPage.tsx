import { useState } from 'react';
import { BioLoopShell } from '@/components/BioLoopShell';
import { ProtectedStub } from '@/pages/ProtectedStub';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { MessageSquare, AlertCircle, Sparkles, Send } from 'lucide-react';

const SUGGESTIONS = [
  'Find rice husk suppliers in my region',
  'Compare these two biomass batches',
  'Draft an RFQ for two tonnes of sugarcane bagasse',
  'Explain the assumptions behind this BioValue estimate',
  'What information is missing from this BioPassport?',
  'Summarise my open orders',
];

export default function AIAssistantPage() {
  const [message, setMessage] = useState('');
  const [unconfigured, setUnconfigured] = useState(false);

  return (
    <BioLoopShell>
      <ProtectedStub
        title="BioLoop Assistant"
        description="Ask about listings, matches, BioPassports, RFQs, orders, and guidance — grounded in real records."
      >
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex flex-col gap-4">
          <div className="flex items-start gap-3 rounded-md border bg-muted/50 p-4 text-sm">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <div className="text-muted-foreground">
              <p>The BioLoop Assistant answers questions using validated server-side tools. It does not invent
              technical compatibility, market prices, guaranteed profit, carbon savings, or certification claims.</p>
            </div>
          </div>

          {unconfigured ? (
            <Card className="border border-dashed border-muted-foreground/40 bg-card shadow-none">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-base font-semibold tracking-tight">Assistant unavailable</CardTitle>
                </div>
                <CardDescription>
                  The AI provider is not configured or became unavailable. Other BioLoop features continue to
                  work.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>Configure the AI provider API key in the project environment variables, then enable the
                assistant. The model and provider are configurable server-side.</p>
                <Button variant="outline" size="sm" className="mt-3 shadow-none" onClick={() => setUnconfigured(false)}>
                  Go back
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card className="border-border/70 bg-card shadow-none">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-muted-foreground" />
                    <CardTitle className="text-base font-semibold tracking-tight">Chat</CardTitle>
                  </div>
                  <CardDescription>
                    Ask a question or choose a suggestion to get started.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTIONS.map((suggestion) => (
                      <Button
                        key={suggestion}
                        variant="outline"
                        size="sm"
                        className="shadow-none text-xs"
                        onClick={() => setMessage(suggestion)}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>

                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask the BioLoop Assistant..."
                    rows={4}
                  />

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" className="shadow-none" disabled={!message.trim()}>
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      className="bg-primary text-primary-foreground shadow-none hover:bg-primary/90"
                      disabled={!message.trim()}
                      onClick={() => {}}
                    >
                      <Send className="mr-2 h-4 w-4" /> Send
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Separator />

              <Card className="border-border/70 bg-card shadow-none">
                <CardHeader>
                  <CardTitle className="text-base font-semibold tracking-tight">Example prompts</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-1.5">
                  <p>“Find rice husk suppliers within my delivery region.”</p>
                  <p>“Compare these two biomass batches.”</p>
                  <p>“Draft an RFQ for two tonnes of sugarcane bagasse.”</p>
                  <p>“Explain the assumptions behind this BioValue estimate.”</p>
                  <p>“What information is missing from this BioPassport?”</p>
                  <p>“Summarise my open orders.”</p>
                </CardContent>
              </Card>
            </>
          )}
        </motion.div>
      </ProtectedStub>
    </BioLoopShell>
  );
}
