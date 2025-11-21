'use client';

import { collection } from 'firebase/firestore';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import type { Brand, Product } from '@/lib/types';
import { useMemo } from 'react';
import { BrowseCard } from '@/components/browse-card';
import { Skeleton } from '@/components/ui/skeleton';

export default function BrandsPage() {
  const firestore = useFirestore();

  const brandsCollection = useMemoFirebase(
    () => (firestore ? collection(firestore, 'brands') : null),
    [firestore]
  );
  
  const { data: brands, isLoading: isLoadingBrands } = useCollection<Brand>(brandsCollection);

  const isLoading = isLoadingBrands;

  return (
    <div className="bg-background py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">
            Browse by Brand
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
            Discover our collection from talented artisans and renowned brands.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {isLoading && Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="h-[200px] w-full rounded-md bg-muted" />
              <Skeleton className="h-6 w-3/4 rounded-md bg-muted" />
            </div>
          ))}
          {brands?.map(brand => {
            return (
                <BrowseCard
                  key={brand.id}
                  name={brand.name}
                  image={brand.logoUrl}
                  imageHint={brand.name}
                  altText={`Browse ${brand.name} brand`}
                  href={`/brands/${brand.slug}`}
                />
            );
          })}
        </div>

        {!isLoading && brands?.length === 0 && (
            <div className="text-center text-muted-foreground mt-8 col-span-full">
              No brands found.
            </div>
        )}
      </div>
    </div>
  );
}
