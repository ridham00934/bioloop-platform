import { BioLoopNav } from '@/components/BioLoopNav';
import { motion } from 'framer-motion';

const SECTIONS = [
  {
    title: 'What BioLoop measures',
    body: (
      <>
        <p>
          BioLoop reports activity that actually happened in the platform: biomass quantities that moved
          through completed or delivered orders, supplier transaction value, and completed order value.
        </p>
        <p>
          It separates quoted, ordered, and completed values. A quote is not a sale. An order is not yet
          a completed transaction. Only records with a real status are counted as completed.
        </p>
      </>
    ),
  },
  {
    title: 'Measured activity, estimated outcomes, verified claims',
    body: (
      <>
        <p>
          Every impact record on BioLoop belongs to one of three levels:
        </p>
        <ul className="mt-2 list-disc pl-5 text-sm text-foreground">
          <li>
            <strong className="text-foreground">Measured activity</strong> — quantities and values taken
            directly from persisted transactions.
          </li>
          <li>
            <strong className="text-foreground">Estimated outcomes</strong> — values derived from a
            documented formula, clear inputs, and stated assumptions.
          </li>
          <li>
            <strong className="text-foreground">Independently verified claims</strong> — shown only where a
            verification record supports the claim.
          </li>
        </ul>
        <p>
          When evidence is insufficient, BioLoop says so rather than inventing a result.
        </p>
      </>
    ),
  },
  {
    title: 'How BioValue is calculated',
    body: (
      <>
        <p>
          The BioValue calculator estimates the potential economic value of a biomass lot using
          transparent formulas.
        </p>
        <p>Usable mass:</p>
        <p className="font-mono text-sm bg-muted px-3 py-2 rounded">
          Usable mass = Gross mass × Usable fraction
        </p>
        <p>Estimated sale value:</p>
        <p className="font-mono text-sm bg-muted px-3 py-2 rounded">
          Estimated sale value = Usable mass × Assumed unit price
        </p>
        <p>Estimated net value before tax and overhead:</p>
        <p className="font-mono text-sm bg-muted px-3 py-2 rounded">
          Estimated net value = Sale value − Known processing costs − Known handling costs − Known transport
          costs
        </p>
        <p>
          Moisture reduction and contamination losses are not double-counted. If the usable fraction already
          accounts for those factors, the calculator does not apply them again.
        </p>
      </>
    ),
  },
  {
    title: 'Transport and routing estimates',
    body: (
      <>
        <p>
          BioRoute estimates travel distance and duration through a configurable routing provider adapter.
          If no provider is configured, BioLoop shows a clearly labelled approximation or requests a
          transport quote.
        </p>
        <p>
          BioLoop does not invent exact distances, delivery times, or live vehicle positions.
        </p>
      </>
    ),
  },
  {
    title: 'Traceability and evidence levels',
    body: (
      <>
        <p>
          Every batch in BioLoop has a BioPassport with a unique identity and an append-only traceability
          timeline. Evidence is shown at the appropriate level:
        </p>
        <ul className="mt-2 list-disc pl-5 text-sm text-foreground">
          <li>Supplier declared</li>
          <li>Supporting document provided</li>
          <li>Document reviewed</li>
          <li>Sample tested by an identified laboratory</li>
          <li>Independently audited, where evidence supports the claim</li>
        </ul>
        <p>
          BioLoop does not display a verified badge without an actual approved verification record.
        </p>
      </>
    ),
  },
  {
    title: 'What BioLoop does not claim',
    body: (
      <>
        <p>
          BioLoop does not claim that every biomass type is suitable for every biomaterial application.
          Technical suitability depends on the material&apos;s properties, processing requirements, and
          appropriate testing.
        </p>
        <p>
          BioLoop does not claim carbon savings, trees saved, or other environmental benefits using
          unsupported conversion factors.
        </p>
        <p>
          BioLoop does not claim blockchain immutability. An auditable database-backed traceability history
          is what it provides.
        </p>
        <p>
          BioLoop coordinates quotes and orders. It does not process payments unless a payment provider
          confirms a transaction through a verified server-side response or webhook.
        </p>
      </>
    ),
  },
];

export default function ImpactMethodology() {
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
          <h1 className="text-3xl font-bold tracking-tight">Impact methodology</h1>
          <p className="mt-3 text-muted-foreground">
            How BioLoop measures activity, estimates outcomes, and explains trust.
          </p>
        </motion.div>

        <div className="flex flex-col gap-8">
          {SECTIONS.map((section) => (
            <section key={section.title} className="rounded-md border bg-card p-5">
              <h2 className="text-lg font-semibold tracking-tight">{section.title}</h2>
              <div className="mt-3 text-sm text-foreground leading-relaxed">{section.body}</div>
            </section>
          ))}
        </div>

        <div className="mt-10 border-t pt-6 text-sm text-muted-foreground">
          <p>
            BioLoop&apos;s impact dashboard reports numbers that come from persisted records, documented
            calculations, or clearly labelled demo data.
          </p>
        </div>
      </div>
    </div>
  );
}
