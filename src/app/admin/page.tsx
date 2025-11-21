'use client';
import { collection } from 'firebase/firestore';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ShoppingBag, Mail, Tag, Building } from 'lucide-react';
import React from 'react';
import type { Product, Category, Brand } from '@/lib/types';

function StatCard({
  title,
  value,
  icon: Icon,
  isLoading,
}: {
  title: string;
  value: number | string;
  icon: React.ElementType;
  isLoading: boolean;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-8 w-1/4 animate-pulse rounded-md bg-muted" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
      </CardContent>
    </Card>
  );
}

export default function AdminDashboardPage() {
  const firestore = useFirestore();

  const submissionsCollection = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'contact_form_submissions');
  }, [firestore]);

  const productsCollection = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'products');
  }, [firestore]);

  const categoriesCollection = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'categories');
  }, [firestore]);

  const brandsCollection = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'brands');
  }, [firestore]);
  
  const { data: submissions, isLoading: isLoadingSubmissions } = useCollection(submissionsCollection);
  const { data: products, isLoading: isLoadingProducts } = useCollection<Product>(productsCollection);
  const { data: categories, isLoading: isLoadingCategories } = useCollection<Category>(categoriesCollection);
  const { data: brands, isLoading: isLoadingBrands } = useCollection<Brand>(brandsCollection);

  return (
    <div>
      <h1 className="text-3xl font-headline font-bold mb-8 text-primary">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Products"
          value={products?.length ?? 0}
          icon={ShoppingBag}
          isLoading={isLoadingProducts}
        />
        <StatCard
          title="Contact Submissions"
          value={submissions?.length ?? 0}
          icon={Mail}
          isLoading={isLoadingSubmissions}
        />
        <StatCard
            title="Total Categories"
            value={categories?.length ?? 0}
            icon={Tag}
            isLoading={isLoadingCategories}
        />
        <StatCard
            title="Total Brands"
            value={brands?.length ?? 0}
            icon={Building}
            isLoading={isLoadingBrands}
        />
      </div>
    </div>
  );
}
