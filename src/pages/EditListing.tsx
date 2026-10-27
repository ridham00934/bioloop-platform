import { useParams, useNavigate } from 'react-router';
import { BioLoopShell } from '@/components/BioLoopShell';
import { ProtectedStub } from '@/pages/ProtectedStub';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';

export default function EditListing() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <BioLoopShell>
      <ProtectedStub
        title={id ? `Edit listing ${id.slice(0, 8)}` : 'Edit listing'}
        description="Temporary placeholder while listing editing is implemented."
      >
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex flex-col gap-4">
          <Link to={`/listings/${id}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to listing
          </Link>

          <Card className="border-border/70 bg-card shadow-none">
            <CardHeader>
              <CardTitle className="text-base font-semibold tracking-tight">Editing placeholder</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>Real listing editing will use backend validation, image handling, and organisation-scoped
              permissions.</p>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Link to={`/listings/${id}`}>
              <Button variant="ghost" size="sm" className="shadow-none">Cancel</Button>
            </Link>
            <Button size="sm" className="bg-primary text-primary-foreground shadow-none hover:bg-primary/90">
              Save changes
            </Button>
          </div>
        </motion.div>
      </ProtectedStub>
    </BioLoopShell>
  );
}
