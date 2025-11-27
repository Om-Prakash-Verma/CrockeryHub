
'use client';

import Image from 'next/image';
import Link from 'next/link';
import ProductCard from '@/components/product-card';
import { Button } from '@/components/ui/button';
import {
  useCollection,
  useDoc,
  useFirestore,
  useMemoFirebase,
} from '@/firebase';
import type { AppSettings, Product } from '@/lib/types';
import { collection, doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import ContactForm from '@/components/contact-form';

export default function HomeClient() {
  const firestore = useFirestore();

  const settingsDocRef = useMemoFirebase(
    () => (firestore ? doc(firestore, 'settings', 'app-configuration') : null),
    [firestore]
  );
  const { data: settings, isLoading: isLoadingSettings } =
    useDoc<AppSettings>(settingsDocRef);

  const productsCollection = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'products');
  }, [firestore]);
  const { data: products, isLoading: isLoadingProducts } =
    useCollection<Product>(productsCollection);

  const heroImage = {
      imageUrl: '/hero.jpg',
      description: 'A beautiful arrangement of handmade pottery and crockery on a dark surface.'
  };

  const isLoading = isLoadingProducts || isLoadingSettings;
  
  const featuredProducts = products?.filter(p => p.featured).slice(0, 4) || [];

  const showHero = settings?.showHeroSection !== false;
  const showProducts = settings?.showProductsSection !== false;
  const aboutUsContent = process.env.NEXT_PUBLIC_ABOUT_US_CONTENT;
  const aboutUsImageUrl = settings?.aboutUsImageUrl;
  const heroHeadline = process.env.NEXT_PUBLIC_HERO_HEADLINE || 'Artistry in Every Piece';
  const heroSubheading = process.env.NEXT_PUBLIC_HERO_SUBHEADING || 'Discover our exclusive collection of handcrafted crockery, where timeless design meets modern elegance.';
  const productsSubheading = process.env.NEXT_PUBLIC_PRODUCTS_SUBHEADING || "Discover stylish crockery, durable kitchen appliances, and smart home essentials.
We bring you quality products that enhance your cooking and dining experience.";

  return (
    <div className="flex flex-col">
      {showHero && (
        <section className="relative w-full text-white">
          <div className="relative w-full">
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              width={1920}
              height={1080}
              className="w-full h-auto object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center p-4">
              <h1 className="font-headline text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                {heroHeadline}
              </h1>
              <p className="mt-2 sm:mt-4 max-w-xs sm:max-w-2xl text-sm sm:text-lg md:text-xl text-primary-foreground/90">
                {heroSubheading}
              </p>
              <Button
                asChild
                size="sm"
                className="mt-4 sm:mt-8 bg-accent text-accent-foreground hover:bg-accent/90 text-base px-6 py-4 sm:px-8 sm:py-6"
              >
                <Link href="#products" prefetch={false}>Explore Collection</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {aboutUsContent && (
        <section className="py-16 md:py-24 bg-card">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col-reverse md:flex-row gap-8 md:gap-12 items-center">
              <div className="text-center md:text-left md:w-1/2">
                <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary">
                  About Us
                </h2>
                <p className="mt-4 text-lg text-muted-foreground whitespace-pre-line">
                  {aboutUsContent}
                </p>
              </div>
              {aboutUsImageUrl && (
                 <div className="relative w-full md:w-1/2 h-80 rounded-lg overflow-hidden shadow-lg">
                    <Image
                      src={aboutUsImageUrl}
                      alt="About CrockeryHub"
                      fill
                      className="object-cover"
                    />
                 </div>
              )}
            </div>
          </div>
        </section>
      )}

      {showProducts && (
        <section id="products" className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary">
                Our Products
              </h2>
              <p className="mt-2 text-lg text-muted-foreground max-w-xl mx-auto">
                {productsSubheading}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {isLoading &&
                Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={`product-skeleton-${i}`}
                    className="flex flex-col space-y-3"
                  >
                    <Skeleton className="h-[300px] w-full rounded-md bg-muted" />
                    <Skeleton className="h-6 w-3/4 rounded-md bg-muted" />
                    <Skeleton className="h-4 w-1/2 rounded-md bg-muted" />
                  </div>
                ))}
              {featuredProducts.map(product => (
                <div key={product.id} className="h-full">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
                <Button asChild size="lg" variant="outline">
                    <Link href="/products" prefetch={false}>See All Products</Link>
                </Button>
            </div>

            {!isLoading && featuredProducts.length === 0 && (
              <div className="text-center text-muted-foreground mt-8">
                No featured products found. Add some in the admin panel to see them
                here.
              </div>
            )}
          </div>
        </section>
      )}

      <section id="contact" className="py-16 md:py-24 bg-card">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary">
              Get in Touch
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Have a question or a special request? We'd love to hear from
              you.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
