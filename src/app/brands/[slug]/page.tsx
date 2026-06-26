
import BrandDetailsClient from '@/components/brand-details-client';

type BrandPageProps = {
  params: {
    slug: string;
  };
};

export default function BrandPage({ params }: BrandPageProps) {
  return <BrandDetailsClient slug={params.slug} />;
}
