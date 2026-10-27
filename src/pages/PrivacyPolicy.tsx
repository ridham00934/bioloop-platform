import { BioLoopNav } from '@/components/BioLoopNav';
import { motion } from 'framer-motion';

export default function PrivacyPolicy() {
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
          <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="mt-3 text-muted-foreground">
            How BioLoop handles personal and business data.
          </p>
        </motion.div>

        <div className="flex flex-col gap-6 text-sm text-foreground leading-relaxed">
          <p>
            BioLoop is a multi-organisation business application. It stores account information, organisation
            membership, marketplace data, order data, traceability records, messages, notifications, and
            related metadata necessary to operate the platform.
          </p>
          <p>
            Access to records is restricted by organisation and role. Where a user is entitled to see a record,
            BioLoop displays it; otherwise the record remains private.
          </p>
          <p>
            BioLoop does not process payments, and it does not store payment credentials. Where an external
            service is used, the integration is configured server-side and its status is reported honestly.
          </p>
          <p>
            Users should review BioLoop&apos;s data access and deletion workflows in the account and organisation
            settings. Sensitive data such as passwords, tokens, and API keys are not stored in client-visible
            storage.
          </p>
        </div>

        <div className="mt-10 border-t pt-6 text-sm text-muted-foreground">
          <p>
            This notice is a product privacy summary. It should be reviewed and adapted to the applicable legal
            requirements and the organisation&apos;s own policies.
          </p>
        </div>
      </div>
    </div>
  );
}
