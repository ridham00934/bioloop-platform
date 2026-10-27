import { BioLoopNav } from '@/components/BioLoopNav';
import { motion } from 'framer-motion';

export default function AboutBioLoop() {
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
          <h1 className="text-3xl font-bold tracking-tight">About BioLoop</h1>
          <p className="mt-3 text-muted-foreground">
            BioLoop is a circular-bioeconomy platform that makes agricultural and organic biomass feedstocks
            discoverable, comparable, traceable, and commercially actionable.
          </p>
        </motion.div>

        <div className="flex flex-col gap-6 text-sm text-foreground leading-relaxed">
          <p>
            Biomass supply is often fragmented, inconsistent, difficult to assess, and expensive to transport.
            BioLoop helps suppliers, buyers, processors, logistics partners, and administrators work from a
            shared set of structured records.
          </p>
          <p>
            The platform includes a marketplace, a Smart Waste-to-Material Matcher, a BioValue calculator, a
            BioPassport traceability system, a BioRoute logistics module, and an Impact Ledger. Every dashboard
            number comes from persisted application data, a documented calculation, or clearly labelled demo
            data.
          </p>
          <p>
            BioLoop is a trustworthy, data-driven biomaterials operations platform. It prioritises correctness,
            explainability, accessibility, and a coherent user experience over decorative effects.
          </p>
        </div>

        <div className="mt-10 border-t pt-6 text-sm text-muted-foreground">
          <p>
            BioLoop does not imply government certification or third-party endorsement unless the appropriate
            evidence actually exists.
          </p>
        </div>
      </div>
    </div>
  );
}
