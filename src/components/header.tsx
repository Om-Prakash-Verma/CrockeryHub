

'use client';

import Link from 'next/link';
import { Menu, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal
} from '@/components/ui/dropdown-menu';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useCollection, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import type { AppSettings, Category, Brand } from '@/lib/types';
import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import type { NestedCategory } from '@/lib/types';


const WhatsAppIcon = ({ className }: { className?: string }) => (
    <i className={cn('bi bi-whatsapp', className)}></i>
);

const InstagramIcon = ({ className }: { className?: string }) => (
    <i className={cn('bi bi-instagram', className)}></i>
);


const Header = () => {
    const [isCategoriesMenuOpen, setIsCategoriesMenuOpen] = useState(false);
    const [isBrandsMenuOpen, setIsBrandsMenuOpen] = useState(false);
    const firestore = useFirestore();

    const categoriesCollection = useMemoFirebase(
        () => (firestore ? collection(firestore, 'categories') : null),
        [firestore]
    );
    const { data: categories } = useCollection<Category>(categoriesCollection);

    const brandsCollection = useMemoFirebase(
        () => (firestore ? collection(firestore, 'brands') : null),
        [firestore]
    );
    const { data: brands } = useCollection<Brand>(brandsCollection);
    
    const settingsDocRef = useMemoFirebase(() => 
        firestore ? doc(firestore, 'settings', 'app-configuration') : null
    , [firestore]);
    const { data: settings } = useDoc<AppSettings>(settingsDocRef);


    const nestedCategories = useMemo(() => {
        if (!categories) return [];
        const categoryMap = new Map<string, NestedCategory>();
        const topLevelCategories: NestedCategory[] = [];

        categories.forEach(cat => {
            categoryMap.set(cat.id, { ...cat, children: [] });
        });

        categories.forEach(cat => {
            const categoryNode = categoryMap.get(cat.id);
            if (cat.parentId && categoryMap.has(cat.parentId)) {
                const parentNode = categoryMap.get(cat.parentId);
                parentNode?.children.push(categoryNode!);
            } else {
                topLevelCategories.push(categoryNode!);
            }
        });

        return topLevelCategories;
    }, [categories]);


  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/contact', label: 'Contact' },
  ];

  const siteTitle = process.env.NEXT_PUBLIC_SITE_TITLE || 'CrockeryHub';
  const whatsappNumber = settings?.whatsappNumber || "";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hello! I'm interested in your products.")}`;
  const instagramId = process.env.NEXT_PUBLIC_INSTAGRAM_ID;
  const instagramUrl = instagramId ? `https://instagram.com/${instagramId}` : '#';



  return (
    <header className="bg-card shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary transition-opacity hover:opacity-80" prefetch={false}>
            <img src="/logo.png" alt="Logo" className="h-13 w-auto object-contain"/>
          </Link>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex gap-4 items-center">
                <Link href="/" className="font-headline text-lg text-foreground/80 hover:text-primary transition-colors" prefetch={false}>
                    Home
                </Link>
                <DropdownMenu open={isCategoriesMenuOpen} onOpenChange={setIsCategoriesMenuOpen}>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="font-headline text-lg text-foreground/80 hover:text-primary transition-colors flex items-center gap-1 px-2"
                            onMouseEnter={() => setIsCategoriesMenuOpen(true)}
                            onMouseLeave={() => setIsCategoriesMenuOpen(false)}
                        >
                            <Link href="/categories" prefetch={false}>Categories</Link>
                            <ChevronDown className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                        align="start" 
                        className="w-56"
                        onMouseEnter={() => setIsCategoriesMenuOpen(true)}
                        onMouseLeave={() => setIsCategoriesMenuOpen(false)}
                    >
                        {nestedCategories.map((category) =>
                            category.children.length > 0 ? (
                            <DropdownMenuSub key={category.id}>
                                <DropdownMenuSubTrigger>
                                    <span>{category.name}</span>
                                </DropdownMenuSubTrigger>
                                <DropdownMenuPortal>
                                    <DropdownMenuSubContent>
                                        {category.children.map((subCategory) => (
                                        <DropdownMenuItem key={subCategory.id} asChild>
                                            <Link href={`/products?category=${encodeURIComponent(subCategory.name)}`} prefetch={false}>
                                                {subCategory.name}
                                            </Link>
                                        </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                            </DropdownMenuSub>
                            ) : (
                            <DropdownMenuItem key={category.id} asChild>
                                <Link href={`/products?category=${encodeURIComponent(category.name)}`} prefetch={false}>{category.name}</Link>
                            </DropdownMenuItem>
                            )
                        )}
                        {nestedCategories.length === 0 && (
                            <DropdownMenuItem disabled>No categories found.</DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu open={isBrandsMenuOpen} onOpenChange={setIsBrandsMenuOpen}>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="font-headline text-lg text-foreground/80 hover:text-primary transition-colors flex items-center gap-1 px-2"
                            onMouseEnter={() => setIsBrandsMenuOpen(true)}
                            onMouseLeave={() => setIsBrandsMenuOpen(false)}
                        >
                            <Link href="/brands" prefetch={false}>Brands</Link>
                            <ChevronDown className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                        align="start" 
                        className="w-56"
                        onMouseEnter={() => setIsBrandsMenuOpen(true)}
                        onMouseLeave={() => setIsBrandsMenuOpen(false)}
                    >
                        {brands?.map((brand) => (
                            <DropdownMenuItem key={brand.id} asChild>
                                <Link href={`/brands/${brand.slug}`} prefetch={false}>{brand.name}</Link>
                            </DropdownMenuItem>
                        ))}
                        {brands?.length === 0 && (
                            <DropdownMenuItem disabled>No brands found.</DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>

                {navItems.slice(1).map((item) => (
                <Link key={item.label} href={item.href} className="font-headline text-lg text-foreground/80 hover:text-primary transition-colors" prefetch={false}>
                    {item.label}
                </Link>
                ))}
                 <Button asChild size="sm" className="ml-2 text-white bg-[radial-gradient(circle_at_30%_107%,#fdf497_0%,#fdf497_5%,#fd5949_45%,#d6249f_60%,#285aeb_90%)] hover:opacity-90">
                    <a href={instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                        <InstagramIcon className="text-lg" />
                    </a>
                </Button>
                {whatsappNumber && (
                    <Button asChild size="sm" className="ml-2 bg-green-600 text-white hover:bg-green-700">
                        <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer" prefetch={false}>
                            <WhatsAppIcon className="text-lg" />
                        </Link>
                    </Button>
                )}
            </nav>
            <div className="md:hidden">
                <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="right">
                     <SheetHeader>
                        <SheetTitle className="sr-only">Main Menu</SheetTitle>
                        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary transition-opacity hover:opacity-80" prefetch={false}>
                            <span className="font-headline">{siteTitle}</span>
                        </Link>
                    </SheetHeader>
                    <div className="flex flex-col gap-2 pt-8">
                    <Link href="/" className="font-headline text-xl py-2 text-foreground hover:text-primary transition-colors" prefetch={false}>Home</Link>
                    
                    <Accordion type="multiple" className="w-full">
                        <AccordionItem value="categories">
                            <AccordionTrigger className="font-headline text-xl py-2 text-foreground hover:text-primary transition-colors hover:no-underline">
                            <Link href="/categories" prefetch={false}>Categories</Link>
                            </AccordionTrigger>
                            <AccordionContent>
                            <div className="flex flex-col gap-2 pl-4">
                                {nestedCategories.map((category) => (
                                    <div key={category.id}>
                                    <Link href={`/products?category=${encodeURIComponent(category.name)}`} className="font-headline text-lg py-1 text-foreground/80 hover:text-primary transition-colors block" prefetch={false}>{category.name}</Link>
                                    {category.children.length > 0 && (
                                        <div className="flex flex-col gap-1 mt-1 pl-4">
                                            {category.children.map((sub) => (
                                                <Link key={sub.id} href={`/products?category=${encodeURIComponent(sub.name)}`} className="font-headline text-base text-muted-foreground hover:text-primary transition-colors block" prefetch={false}>{sub.name}</Link>
                                            ))}
                                        </div>
                                    )}
                                    </div>
                                ))}
                                {nestedCategories.length === 0 && <span className="text-sm text-muted-foreground">No categories.</span>}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="brands">
                            <AccordionTrigger className="font-headline text-xl py-2 text-foreground hover:text-primary transition-colors hover:no-underline">
                            <Link href="/brands" prefetch={false}>Brands</Link>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="flex flex-col gap-2 pl-4">
                                    {brands?.map((brand) => (
                                        <Link key={brand.id} href={`/brands/${brand.slug}`} className="font-headline text-lg py-1 text-foreground/80 hover:text-primary transition-colors block" prefetch={false}>{brand.name}</Link>
                                    ))}
                                    {brands?.length === 0 && <span className="text-sm text-muted-foreground">No brands.</span>}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>

                        {navItems.slice(1).map((item) => (
                            <Link key={item.label} href={item.href} className="font-headline text-xl py-2 text-foreground hover:text-primary transition-colors" prefetch={false}>
                            {item.label}
                            </Link>
                        ))}
                         <Button asChild size="lg" className="mt-4 text-white bg-[radial-gradient(circle_at_30%_107%,#fdf497_0%,#fdf497_5%,#fd5949_45%,#d6249f_60%,#285aeb_90%)] hover:opacity-90">
                            <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                <InstagramIcon className="text-2xl" />
                                Instagram
                            </a>
                        </Button>
                        {whatsappNumber && (
                             <Button asChild size="lg" className="mt-4 bg-green-600 text-white hover:bg-green-700">
                                <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer" prefetch={false}>
                                    <WhatsAppIcon className="mr-2 text-lg" />
                                    Contact via WhatsApp
                                </Link>
                            </Button>
                        )}
                    </div>
                </SheetContent>
                </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;

