
'use client';

import { collection, query, where, limit, doc } from 'firebase/firestore';
import { useCollection, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import type { AppSettings, Product } from '@/lib/types';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const WhatsAppIcon = ({ className }: { className?: string }) => (
    <i className={cn('bi bi-whatsapp', className)}></i>
);


function ProductDetailsSkeleton() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="grid gap-8 md:grid-cols-2 lg:gap-16">
        <div>
          <Skeleton className="aspect-square w-full rounded-xl" />
          <div className="mt-4 grid grid-cols-5 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square w-full rounded-md" />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-20 w-full" />
          <div>
            <Skeleton className="mb-4 h-8 w-1/3" />
            <div className="space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const SETTINGS_DOC_ID = 'app-configuration';


export default function ProductDetailsClient({ slug }: { slug: string }) {
  const firestore = useFirestore();
  
  const productQuery = useMemoFirebase(() => {
    if (!firestore || !slug) return null;
    const productsCollection = collection(firestore, 'products');
    return query(productsCollection, where('slug', '==', slug), limit(1));
  }, [firestore, slug]);

  const settingsDocRef = useMemoFirebase(() => 
    firestore ? doc(firestore, 'settings', SETTINGS_DOC_ID) : null
  , [firestore]);

  const { data: products, isLoading: isLoadingProduct } = useCollection<Product>(productQuery);
  const { data: settings, isLoading: isLoadingSettings } = useDoc<AppSettings>(settingsDocRef);
  
  const product = products?.[0];
  const isLoading = isLoadingProduct || isLoadingSettings;

  if (isLoading) {
    return <ProductDetailsSkeleton />;
  }

  if (!product) {
    return (
      <div className="container mx-auto flex h-96 items-center justify-center text-center">
        <div>
          <h1 className="text-3xl font-bold">Product not found</h1>
          <p className="text-muted-foreground">
            Sorry, we couldn't find the product you're looking for.
          </p>
        </div>
      </div>
    );
  }
  
  const whatsappNumber = settings?.whatsappNumber || ""; 
  const message = `Hello, I'm interested in buying the product: ${product.name}`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  const hasSpecifications = product.specifications && (product.specifications.material || product.specifications.dimensions || product.specifications.origin);

  return (
      <div className="bg-card">
        <div className="container mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
            <div className="flex flex-col gap-4">
              <Carousel className="w-full">
                <CarouselContent>
                  {product.images.map((image, index) => (
                    <CarouselItem key={index}>
                      <Card className="overflow-hidden rounded-xl">
                        <CardContent className="p-0">
                          <Image
                            src={image.imageUrl}
                            alt={`${product.name} - image ${index + 1}`}
                            width={600}
                            height={600}
                            className="aspect-square w-full object-cover"
                          />
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </Carousel>
            </div>

            <div className="flex flex-col gap-y-6">
              <div>
                  <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                  {product.name}
                  </h1>

                  {product.price && product.price > 0 && (
                      <div className="mt-3">
                          <p className="text-3xl text-foreground">Rs. {product.price.toFixed(2)}</p>
                      </div>
                  )}
              </div>
              
              <div>
                {whatsappNumber ? (
                  <Button asChild size="lg" className="w-full bg-green-600 text-white hover:bg-green-700">
                    <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer" prefetch={false}>
                      <WhatsAppIcon className="mr-2 text-xl" />
                      Buy via WhatsApp
                    </Link>
                  </Button>
                ) : (
                  <Button size="lg" className="w-full" disabled>
                      Contact information unavailable
                  </Button>
                )}
              </div>


              <div className="space-y-4 text-base text-muted-foreground">
                <p>{product.description}</p>
              </div>

              {hasSpecifications && (
                <div>
                  <h3 className="text-xl font-bold text-primary">Specifications</h3>
                  <div className="mt-4 space-y-2 text-muted-foreground">
                    {product.specifications.material && (
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium">Material</span>
                        <span>{product.specifications.material}</span>
                      </div>
                    )}
                    {product.specifications.dimensions && (
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium">Dimensions</span>
                        <span>{product.specifications.dimensions}</span>
                      </div>
                    )}
                    {product.specifications.origin && (
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium">Origin</span>
                        <span>{product.specifications.origin}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
  );
}
