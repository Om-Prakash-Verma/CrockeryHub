
import { Suspense } from 'react';
import type { Metadata } from 'next';
import ProductsGrid from '@/components/products-grid';
import { Skeleton } from '@/components/ui/skeleton';

const siteTitle = process.env.NEXT_PUBLIC_SITE_TITLE || 'CrockeryHub';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { category?: string };
}): Promise<Metadata> {
  const category = searchParams?.category;

  if (category) {
    const pageTitle = category;
    const pageDescription = `Explore our collection of beautiful ${category.toLowerCase()} at ${siteTitle}.`;
    const pageUrl = `${siteUrl}products?category=${encodeURIComponent(category)}`;

    return {
      title: pageTitle,
      description: pageDescription,
      keywords: [category, 'crockery', 'pottery', 'handmade dinnerware'],
      robots: { index: true, follow: true },
      alternates: {
        canonical: pageUrl,
      },
      openGraph: {
        title: pageTitle,
        description: pageDescription,
        url: pageUrl,
        type: 'website',
      },
      twitter: {
        card: 'summary',
        title: pageTitle,
        description: pageDescription,
      },
    };
  }

  const defaultTitle = 'Our Products';
  const defaultDescription = `Browse the full collection of modern, stylish crockery from ${siteTitle}. Each item is a testament to the artisan's skill.`;
  const defaultUrl = `${siteUrl}/products`;

  return {
    title: defaultTitle,
    description: defaultDescription,
    keywords: [
      'all products',
      'crockery collection',
      'pottery shop',
      'ceramic gallery',
    ],
    robots: { index: true, follow: true },
    alternates: {
      canonical: defaultUrl,
    },
    openGraph: {
      title: defaultTitle,
      description: defaultDescription,
      url: defaultUrl,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: defaultTitle,
      description: defaultDescription,
    },
  };
}

function ProductsPageSkeleton() {
  return (
    <>
      <div className="text-center mb-12">
        <Skeleton className="h-12 w-1/2 mx-auto" />
        <Skeleton className="h-6 w-3/4 mx-auto mt-4" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={`product-skeleton-${i}`} className="flex flex-col space-y-3">
            <Skeleton className="h-[300px] w-full rounded-md bg-muted" />
            <Skeleton className="h-6 w-3/4 rounded-md bg-muted" />
            <Skeleton className="h-4 w-1/2 rounded-md bg-muted" />
          </div>
        ))}
      </div>
    </>
  );
}

export default function ProductsPage() {
  return (
    <div className="bg-background py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<ProductsPageSkeleton />}>
          <ProductsGrid />
        </Suspense>
      </div>
    </div>
  );
}
