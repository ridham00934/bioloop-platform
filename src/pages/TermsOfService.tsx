import { BioLoopNav } from '@/components/BioLoopNav';
import { motion } from 'framer-motion';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background text-foreground px-4 py-12 sm:px-6 lg:px-8">
      <BioLoopNav />
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-12"
        >
          <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
          <p className="mt-3 text-muted-foreground">
            Conditions for using BioLoop.
          </p>
        </motion.div>

        <div className="flex flex-col gap-6 text-sm text-foreground leading-relaxed">
          <p>
            By using BioLoop, you agree to use the platform in accordance with its policies and to provide
            accurate information about organisations, feedstocks, listings, and transactions.
          </p>
          <p>
            BioLoop is a sourcing, quotation, order, and traceability coordination platform. It does not
            guarantee that any feedstock is scientifically compatible with a given application, that any price
            is current, that any calculation is a guaranteed profit, or that any environmental claim is
            verified.
          </p>
          <p>
            Users are responsible for the data they submit. BioLoop separates supplier-declared information from
            documents, reviewed certificates, and laboratory-tested results, and it displays evidence levels
            accordingly.
          </p>
          <p>
            BioLoop coordinates quotes and orders but does not process payments unless a payment provider confirms
            a transaction through a verified server-side response or webhook.
          </p>
        </div>

        <div className="mt-10 border-t pt-6 text-sm text-muted-foreground">
          <p>
            These terms are a product summary. They should be reviewed and adapted to the applicable legal
            requirements before use in production.
          </p>
        </div>
      </div>
    </div>
  );
}
