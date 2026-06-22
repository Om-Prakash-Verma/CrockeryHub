
import BrandDetailsClient from '@/components/brand-details-client';
export const runtime = 'edge';
type BrandPageProps = {
  params: {
    slug: string;
  };
};

export default function BrandPage({ params }: BrandPageProps) {
  return <BrandDetailsClient slug={params.slug} />;
}
