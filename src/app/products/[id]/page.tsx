
import type { Metadata, ResolvingMetadata } from 'next';
import { collection, query, where, limit, getDocs, getFirestore } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApp, getApps } from 'firebase/app';
import ProductDetailsClient from '@/components/product-details-client';
import type { Product } from '@/lib/types';


type ProductPageProps = {
  params: {
    id: string; // This is now a slug
  };
};

// Helper to get Firestore instance on the server for metadata generation
function getFirestoreInstance() {
    if (!getApps().length) {
        return getFirestore(initializeApp(firebaseConfig));
    }
    return getFirestore(getApp());
}

export async function generateMetadata(
  { params }: ProductPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = params.id;
  const firestore = getFirestoreInstance();

  const productQuery = query(collection(firestore, 'products'), where('slug', '==', slug), limit(1));
  const productSnapshot = await getDocs(productQuery);
  
  if (productSnapshot.empty) {
    return {
      title: 'Product Not Found',
    }
  }

  const product = productSnapshot.docs[0].data() as Product;

  // Recommended: Use the parent metadata to resolve the base URL.
  const previousOpenGraph = (await parent).openGraph;
  const siteUrl = previousOpenGraph?.url || process.env.NEXT_PUBLIC_SITE_URL || '';

  const pageTitle = product.name;
  const pageDescription = product.shortDescription;
  const pageUrl = `${siteUrl.toString().replace(/\/$/, '')}/products/${product.slug}`;
  const imageUrl = product.images[0]?.imageUrl || `${siteUrl}/hero.jpg`;

  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.images.map(img => img.imageUrl),
    "description": product.description,
    "sku": product.id,
    "brand": {
      "@type": "Brand",
      "name": product.brand || (process.env.NEXT_PUBLIC_SITE_TITLE || 'CrockeryHub')
    },
    ...(product.price && {
      "offers": {
        "@type": "Offer",
        "url": pageUrl,
        "priceCurrency": "INR",
        "price": product.price,
        "availability": "https://schema.org/InStock"
      }
    })
  };

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: [product.name, product.category, product.brand || '', 'crockery', 'pottery'],
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: pageUrl,
      images: [
        {
          url: imageUrl,
          width: 600,
          height: 600,
          alt: product.name,
        }
      ],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: [imageUrl],
    },
    other: {
        'script[type="application/ld+json"]': JSON.stringify(productSchema),
    }
  };
}


// Note: Page props must be destructured for the component, not the promise.
export default function ProductPage({ params }: { params: { id: string } }) {
  return <ProductDetailsClient slug={params.id} />;
}
