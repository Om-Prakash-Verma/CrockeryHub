
import type { Metadata } from 'next';
import HomeClient from '@/components/home-client';

const siteTitle = process.env.NEXT_PUBLIC_SITE_TITLE;
const siteDescription = "Shree Enterprises offers a curated collection of modern crockery that complements every home. Sleek, durable, and effortlessly stylish — our range is designed to make everyday dining feel beautiful and effortless.";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yourwebsite.com";
const heroImageUrl = `${siteUrl}/hero.jpg`;

export const metadata: Metadata = {
  title: {
    absolute: `${siteTitle} - Kitchenware,Dinnerware,Kitchen Appliances`,
  },
  description: siteDescription,
  keywords: ['crockery', 'kitchenware', 'dinnerware', 'stylish dinnerware', 'modern plates', 'Kitchen appliances'],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: 'website',
    url: siteUrl,
    title: `${siteTitle} - Kitchenware,Dinnerware,Kitchen Appliances`,
    description: siteDescription,
    images: [
      {
        url: heroImageUrl,
        width: 1920,
        height: 1080,
        alt: 'A beautiful arrangement of handmade pottery and crockery on a dark surface.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteTitle} - Kitchenware,Dinnerware,Kitchen Appliances`,
    description: siteDescription,
    images: [heroImageUrl],
  },
};

export default function Home() {
  return <HomeClient />;
}
