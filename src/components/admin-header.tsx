'use client';
import {
  LayoutDashboard,
  ShoppingBag,
  Tag,
  Building,
  Settings,
  Menu,
  ListPlus,
  Mail,
  Home,
  LogOut,
} from 'lucide-react';
import Link from 'next/link';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/firebase';

export default function AdminHeader() {
  const auth = useAuth();
  const siteTitle = process.env.NEXT_PUBLIC_SITE_TITLE || 'CrockeryHub';

  const handleLogout = () => {
    auth.signOut();
  };

  const navItems = [
    {
      href: '/',
      label: 'Home',
      icon: Home,
    },
    {
      href: '/admin',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      href: '/admin/products',
      label: 'Products',
      icon: ShoppingBag,
    },
    {
      href: '/admin/submissions',
      label: 'Submissions',
      icon: Mail,
    },
    {
      href: '/admin/categories',
      label: 'Categories',
      icon: Tag,
    },
    {
      href: '/admin/brands',
      label: 'Brands',
      icon: Building,
    },
    {
      href: '/admin/custom-fields',
      label: 'Form Fields',
      icon: ListPlus,
    },
    {
      href: '/admin/settings',
      label: 'Settings',
      icon: Settings,
    },
  ];

  return (
    <header className="sticky top-0 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 md:px-6 md:justify-start z-50">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
          prefetch={false}
        >
          <span className="sr-only">{siteTitle}</span>
        </Link>
        {navItems.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="text-muted-foreground transition-colors hover:text-foreground"
            prefetch={false}
          >
            {label}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-2 ml-auto">
        <div className="md:hidden">
            <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left">
                <SheetHeader>
                <SheetTitle className="sr-only">Admin Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 pt-8">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-lg font-semibold"
                    prefetch={false}
                >
                    <span className="font-headline">{siteTitle}</span>
                </Link>
                {navItems.map(({ href, label, icon: Icon }) => (
                    <Link
                    key={href}
                    href={href}
                    className="text-muted-foreground transition-colors hover:text-foreground flex items-center gap-2 text-lg"
                    prefetch={false}
                    >
                    <Icon className="h-5 w-5" />
                    {label}
                    </Link>
                ))}
                </div>
            </SheetContent>
            </Sheet>
        </div>
        <div className="md:hidden">
            <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold"
            prefetch={false}
            >
            <span className="sr-only">{siteTitle}</span>
            </Link>
        </div>
         <Button
            variant="outline"
            size="icon"
            onClick={handleLogout}
            aria-label="Logout"
            >
            <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
