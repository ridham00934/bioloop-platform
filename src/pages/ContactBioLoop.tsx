import { Link } from 'react-router';
import { BioLoopNav } from '@/components/BioLoopNav';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function ContactBioLoop() {
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
          <h1 className="text-3xl font-bold tracking-tight">Contact BioLoop</h1>
          <p className="mt-3 text-muted-foreground">
            For platform inquiries, partnerships, and support.
          </p>
        </motion.div>

        <div className="rounded-md border bg-card p-6 text-sm text-foreground">
          <p className="font-medium">General inquiries</p>
          <p className="mt-1 text-muted-foreground">
            Use the in-app contact flow or reach the BioLoop team through your registered organisation.
          </p>
        </div>

        <div className="mt-8 flex justify-center">
          <Link to="/">
            <Button variant="outline" className="shadow-none">
              Back to home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
