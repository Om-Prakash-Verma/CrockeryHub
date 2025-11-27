'use client';

import { useSearchParams } from 'next/navigation';
import { collection, query, where } from 'firebase/firestore';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import type { Product } from '@/lib/types';
import ProductCard from '@/components/product-card';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductsGrid() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const firestore = useFirestore();

  const productsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    const baseCollection = collection(firestore, 'products');
    if (category) {
      return query(baseCollection, where('category', '==', category));
    }
    return baseCollection;
  }, [firestore, category]);

  const { data: products, isLoading } = useCollection<Product>(productsQuery);

  return (
    <>
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">
          {category ? category : 'Our Products'}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
          {category
            ? `Explore our collection of beautiful ${category.toLowerCase()}.`
            : "From luxury crockery to smart kitchenware & appliances — we bring together quality, innovation, and style."}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading &&
          Array.from({ length: 8 }).map((_, i) => (
            <div
              key={`product-skeleton-${i}`}
              className="flex flex-col space-y-3"
            >
              <Skeleton className="h-[300px] w-full rounded-md bg-muted" />
              <Skeleton className="h-6 w-3/4 rounded-md bg-muted" />
              <Skeleton className="h-4 w-1/2 rounded-md bg-muted" />
            </div>
          ))}
        {products?.map(product => (
          <div key={product.id} className="h-full">
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {!isLoading && products?.length === 0 && (
        <div className="text-center text-muted-foreground mt-8 col-span-full">
          <p>
            No products found {category ? `in the "${category}" category` : ''}.
          </p>
          <p className="text-sm">
            Check back soon or explore other categories.
          </p>
        </div>
      )}
    </>
  );
}
