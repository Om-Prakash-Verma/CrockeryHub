import Link from "next/link";
import { MapPin } from 'lucide-react';

const Footer = () => {
  const shopAddress = process.env.NEXT_PUBLIC_SHOP_ADDRESS;
  const mapsUrl = shopAddress 
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shopAddress)}`
    : '#';

  return (
    <footer className="bg-card border-t border-border mt-16">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center text-muted-foreground">
          {shopAddress && (
            <div className="mb-4">
              <h3 className="font-headline text-lg text-foreground">Our Location</h3>
                <a 
                    href={mapsUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center justify-center gap-2 mt-2 hover:text-primary transition-colors"
                >
                    <MapPin className="h-4 w-4" />
                    <p>{shopAddress}</p>
                </a>
            </div>
          )}
          <p>&copy; {new Date().getFullYear()} {process.env.NEXT_PUBLIC_SITE_TITLE || 'CrockeryHub'}. All rights reserved.</p>
          <div className="flex justify-center items-center gap-4 mt-4">
             <p className="text-sm font-headline">Premium Products for Perfect Homes</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
export default Footer;
