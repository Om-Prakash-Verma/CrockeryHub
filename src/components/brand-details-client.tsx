'use client';

import { collection, query, where, limit } from 'firebase/firestore';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import type { Brand, Product } from '@/lib/types';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import ProductCard from '@/components/product-card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

function BrandPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center text-center">
        <Skeleton className="h-32 w-32 rounded-full" />
        <Skeleton className="mt-6 h-10 w-1/2" />
        <Skeleton className="mt-4 h-16 w-3/4" />
      </div>
      <div className="mt-16">
        <Skeleton className="h-8 w-1/4 mb-8" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="h-[300px] w-full rounded-md bg-muted" />
              <Skeleton className="h-6 w-3/4 rounded-md bg-muted" />
              <Skeleton className="h-4 w-1/2 rounded-md bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function BrandDetailsClient({ slug }: { slug: string }) {
  const firestore = useFirestore();

  const brandQuery = useMemoFirebase(() => {
    if (!firestore || !slug) return null;
    return query(collection(firestore, 'brands'), where('slug', '==', slug), limit(1));
  }, [firestore, slug]);

  const { data: brands, isLoading: isLoadingBrand } = useCollection<Brand>(brandQuery);
  const brand = brands?.[0];

  const productsQuery = useMemoFirebase(() => {
    if (!firestore || !brand) return null;
    return query(collection(firestore, 'products'), where('brand', '==', brand.name));
  }, [firestore, brand]);

  const { data: products, isLoading: isLoadingProducts } = useCollection<Product>(productsQuery);

  const isLoading = isLoadingBrand || isLoadingProducts;

  if (isLoading) {
    return <BrandPageSkeleton />;
  }

  if (!brand) {
    return (
       <div className="container mx-auto flex h-96 items-center justify-center text-center">
        <div>
          <h1 className="text-3xl font-bold">Brand not found</h1>
          <p className="text-muted-foreground">
            Sorry, we couldn't find the brand you're looking for.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {brand.logoUrl && (
            <div className="relative h-32 w-32 rounded-full border p-2">
              <Image
                src={brand.logoUrl}
                alt={`${brand.name} Logo`}
                fill
                className="object-contain"
              />
            </div>
          )}
          <h1 className="mt-6 text-4xl font-headline font-bold text-primary sm:text-5xl">
            {brand.name}
          </h1>
          {brand.description && (
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              {brand.description}
            </p>
          )}
        </div>
      </div>

      <section id="products" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary">
              Products by {brand.name}
            </h2>
          </div>
          {products && products.length > 0 ? (
             <Carousel
                opts={{
                  align: 'start',
                  loop: products && products.length > 4,
                }}
                className="w-full"
            >
                <CarouselContent>
                {products.map(product => (
                    <CarouselItem key={product.id} className="sm:basis-1/2 lg:basis-1/4">
                    <div className="p-1 h-full">
                        <ProductCard product={product} />
                    </div>
                    </CarouselItem>
                ))}
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex" />
                <CarouselNext className="hidden md:flex" />
            </Carousel>
          ) : (
            <div className="text-center text-muted-foreground mt-8">
              No products found for this brand yet.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
