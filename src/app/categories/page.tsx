
'use client';

import { collection } from 'firebase/firestore';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import type { Category, Product } from '@/lib/types';
import { useMemo } from 'react';
import { BrowseCard } from '@/components/browse-card';
import { Skeleton } from '@/components/ui/skeleton';

export default function CategoriesPage() {
  const firestore = useFirestore();

  const categoriesCollection = useMemoFirebase(
    () => (firestore ? collection(firestore, 'categories') : null),
    [firestore]
  );
  const productsCollection = useMemoFirebase(
    () => (firestore ? collection(firestore, 'products') : null),
    [firestore]
  );

  const { data: categories, isLoading: isLoadingCategories } = useCollection<Category>(categoriesCollection);
  const { data: products, isLoading: isLoadingProducts } = useCollection<Product>(productsCollection);

  const categoryImages = useMemo(() => {
    if (!products) return new Map<string, { imageUrl?: string }>();

    const imageMap = new Map<string, { imageUrl?: string }>();
    products.forEach(product => {
      if (product.category && !imageMap.has(product.category) && product.images?.[0]) {
        imageMap.set(product.category, { 
            imageUrl: product.images[0].imageUrl,
        });
      }
    });
    return imageMap;
  }, [products]);

  const isLoading = isLoadingCategories || isLoadingProducts;

  return (
    <div className="bg-background py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">
            Browse by Category
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
            Discover our collection, thoughtfully organized into categories to help you find the perfect piece.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {isLoading && Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="h-[200px] w-full rounded-md bg-muted" />
              <Skeleton className="h-6 w-3/4 rounded-md bg-muted" />
            </div>
          ))}
          {categories?.map(category => {
            const imageInfo = categoryImages.get(category.name);
            return (
                <BrowseCard
                  key={category.id}
                  name={category.name}
                  image={imageInfo?.imageUrl}
                  altText={`Browse ${category.name} category`}
                  href={`/products?category=${category.name}`}
                />
            );
          })}
        </div>

        {!isLoading && categories?.length === 0 && (
            <div className="text-center text-muted-foreground mt-8 col-span-full">
              No categories found.
            </div>
        )}
      </div>
    </div>
  );
}
