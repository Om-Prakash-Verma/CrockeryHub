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
import type { Category } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  parentId: z.string().optional().nullable(),
});

type FormValues = z.infer<typeof formSchema>;

interface CategoryFormProps {
  category?: Category | null;
  categories: Category[];
  onSave: () => void;
}

export function CategoryForm({ category, categories, onSave }: CategoryFormProps) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const isEditMode = !!category;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      parentId: null,
    },
  });

  useEffect(() => {
    if (isEditMode && category) {
      form.reset({
        name: category.name,
        parentId: category.parentId || null,
      });
    } else {
      form.reset({
        name: '',
        parentId: null,
      });
    }
  }, [category, isEditMode, form]);

  async function onSubmit(data: FormValues) {
    if (!firestore) return;
    
    const categoryData = {
        name: data.name,
        parentId: data.parentId || null,
    };

    if (isEditMode && category) {
      if (category.id === data.parentId) {
        toast({
            variant: 'destructive',
            title: 'Invalid Parent Category',
            description: 'A category cannot be its own parent.',
        });
        return;
      }
      const itemDoc = doc(firestore, 'categories', category.id);
      setDocumentNonBlocking(itemDoc, categoryData, { merge: true });
      toast({
        title: `Category Update Initiated`,
        description: `"${data.name}" is being updated.`,
      });
    } else {
      const formCollection = collection(firestore, 'categories');
      addDocumentNonBlocking(formCollection, categoryData);
      toast({
        title: `Category Addition Initiated`,
        description: `"${data.name}" is being added.`,
      });
    }

    onSave();
  }

  const availableParents = categories.filter(c => c.id !== category?.id);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Dinnerware" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="parentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parent Category</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(value === 'none' ? null : value)}
                value={field.value || 'none'}
                defaultValue={field.value || 'none'}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a parent category (optional)" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">None (Top-level)</SelectItem>
                  {availableParents.map((parent) => (
                    <SelectItem key={parent.id} value={parent.id}>
                      {parent.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
          {form.formState.isSubmitting ? 'Saving...' : `Save ${isEditMode ? 'Changes' : 'Category'}`}
        </Button>
      </form>
    </Form>
  );
}
