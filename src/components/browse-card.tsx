import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type BrowseCardProps = {
  name: string;
  image?: string;
  altText: string;
  href: string;
};

export const BrowseCard = ({ name, image, altText, href }: BrowseCardProps) => {
  return (
    <Link href={href} className="group block" prefetch={false}>
      <Card className="overflow-hidden h-full transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
        <CardHeader className="p-0">
          <div className="relative aspect-square w-full">
            {image ? (
              <Image
                src={image}
                alt={altText}
                fill
                className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              />
            ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground text-sm">No Image</span>
                </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <CardTitle className="font-headline text-lg text-center">{name}</CardTitle>
        </CardContent>
      </Card>
    </Link>
  );
};
