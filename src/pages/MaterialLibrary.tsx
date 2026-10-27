import { BioLoopNav } from '@/components/BioLoopNav';
import { motion } from 'framer-motion';

const GROUPS = [
  {
    title: 'Agricultural residues',
    description:
      'Straw, husks, stalks, and other crop residues available after harvest.',
  },
  {
    title: 'Sugar-industry residues',
    description:
      'Bagasse, molasses, filter mud, and other sugar-processing by-products.',
  },
  {
    title: 'Fruit and vegetable residues',
    description:
      'Pomace, peel, pulp, and other post-harvest or processing residues.',
  },
  {
    title: 'Forestry by-products',
    description:
      'Sawdust, chips, bark, and other forest-industry by-products.',
  },
  {
    title: 'Food-processing by-products',
    description:
      'Spent grains, whey, oilseed meals, and other food-industry residues.',
  },
];

export default function MaterialLibrary() {
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
          <h1 className="text-3xl font-bold tracking-tight">Material library</h1>
          <p className="mt-3 text-muted-foreground">
            An overview of feedstock categories currently represented in BioLoop.
          </p>
        </motion.div>

        <ul className="flex flex-col gap-4">
          {GROUPS.map((group) => (
            <li key={group.title} className="rounded-md border bg-card p-4">
              <h2 className="text-base font-semibold tracking-tight">{group.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{group.description}</p>
            </li>
          ))}
        </ul>

        <div className="mt-10 border-t pt-6 text-sm text-muted-foreground">
          <p>
            This library is a taxonomy overview. See the individual listings in the marketplace for
            current availability, pricing, and quality data.
          </p>
        </div>
      </div>
    </div>
  );
}
