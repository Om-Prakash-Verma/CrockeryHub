'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useFirestore } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { addDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useEffect } from 'react';
import type { Brand } from '@/lib/types';
import { Textarea } from './ui/textarea';
import Image from 'next/image';

const createSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  description: z.string().optional(),
  logoUrl: z.string().url({ message: 'Please enter a valid URL.' }).optional().or(z.literal('')),
});

type FormValues = z.infer<typeof formSchema>;

interface BrandFormProps {
  brand?: Brand | null;
  onSave: () => void;
}

export function BrandForm({ brand, onSave }: BrandFormProps) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const isEditMode = !!brand;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      logoUrl: '',
    },
  });
  
  const watchedLogoUrl = form.watch('logoUrl');

  useEffect(() => {
    if (isEditMode && brand) {
      form.reset({
        name: brand.name,
        description: brand.description || '',
        logoUrl: brand.logoUrl || '',
      });
    } else {
      form.reset({
        name: '',
        description: '',
        logoUrl: '',
      });
    }
  }, [brand, isEditMode, form]);

  async function onSubmit(data: FormValues) {
    if (!firestore) return;

    const slug = createSlug(data.name);
    const brandData = { ...data, slug };

    if (isEditMode && brand) {
        const itemDoc = doc(firestore, 'brands', brand.id);
        setDocumentNonBlocking(itemDoc, brandData, { merge: true });
        toast({
            title: `Brand Update Initiated`,
            description: `"${data.name}" is being updated.`,
        });
    } else {
        const formCollection = collection(firestore, 'brands');
        addDocumentNonBlocking(formCollection, brandData);
        toast({
            title: `Brand Addition Initiated`,
            description: `"${data.name}" is being added.`,
        });
    }

    onSave();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brand Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Artisan Collective" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="A short description of the brand." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="logoUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Logo URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/logo.png" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {watchedLogoUrl && watchedLogoUrl.startsWith('http') && (
            <div className="relative w-32 h-32 mt-2">
                <Image
                src={watchedLogoUrl}
                alt="Logo preview"
                fill
                className="object-contain rounded-md border p-1"
                />
            </div>
        )}
        <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
          {form.formState.isSubmitting ? 'Saving...' : `Save ${isEditMode ? 'Changes' : 'Brand'}`}
        </Button>
      </form>
    </Form>
  );
}
