import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

type ProductCardProps = {
  product: Product;
};

const ProductCard = ({ product }: ProductCardProps) => {
  const primaryImage = product.images[0];

  return (
    <Link href={`/products/${product.slug}`} className="group block h-full" prefetch={false}>
      <Card className="overflow-hidden h-full transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 flex flex-col">
        <CardHeader className="p-0">
          <div className="relative aspect-square w-full">
            {primaryImage && (
              <Image
                src={primaryImage.imageUrl}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            )}
          </div>
        </CardHeader>
        <CardContent className="p-6 flex flex-col flex-grow">
          <CardTitle className="font-headline text-xl mb-2">{product.name}</CardTitle>
          <p className="text-muted-foreground mb-4 flex-grow">{product.shortDescription}</p>
          <div className="flex items-center text-accent font-semibold mt-auto">
            View Details
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductCard;
