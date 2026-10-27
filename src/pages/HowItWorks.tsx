import { Link } from 'react-router';
import { BioLoopNav } from '@/components/BioLoopNav';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const STEPS = [
  {
    title: 'Find feedstock',
    description:
      'Search the marketplace or use the Smart Matcher to find biomass that fits your application, quantity, and delivery region.',
  },
  {
    title: 'Compare and request',
    description:
      'Review quality data, verification status, and delivery terms. Submit an RFQ or request a quote from a supplier.',
  },
  {
    title: 'Quote and confirm',
    description:
      'Compare supplier responses, accept the quote that fits, and reserve the inventory in a single transaction.',
  },
  {
    title: 'Ship and trace',
    description:
      'Coordinate pickup and delivery with BioRoute, record traceability events, and view each batch in its BioPassport.',
  },
];

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-background text-foreground px-4 py-12 sm:px-6 lg:px-8">
      <BioLoopNav />
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-12"
        >
          <h1 className="text-3xl font-bold tracking-tight">How BioLoop works</h1>
          <p className="mt-3 text-muted-foreground">
            From discovery to delivery, BioLoop keeps biomass sourcing organised, comparable, and traceable.
          </p>
        </motion.div>

        <ol className="flex flex-col gap-6">
          {STEPS.map((step, i) => (
            <li key={step.title} className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-semibold">
                {i + 1}
              </span>
              <div>
                <h2 className="text-lg font-semibold tracking-tight">{step.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex justify-center">
          <Link to="/marketplace">
            <Button className="bg-primary text-primary-foreground shadow-none hover:bg-primary/90">
              Start sourcing
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
