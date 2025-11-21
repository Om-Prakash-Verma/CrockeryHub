'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { addDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Trash } from 'lucide-react';
import Image from 'next/image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import type { Brand, Category, Product } from '@/lib/types';
import { useEffect } from 'react';
import { Switch } from './ui/switch';

const imageSchema = z.object({
  imageUrl: z.string().min(1, { message: 'Please enter a valid image path.' }),
  description: z.string().min(1, { message: 'Description is required.'}),
});

const productSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  price: z.coerce.number().positive({ message: 'Price must be a positive number.' }).optional().or(z.literal('')),
  category: z.string().min(1, { message: 'Please select a category.' }),
  brand: z.string().optional(),
  featured: z.boolean(),
  shortDescription: z.string().min(10, { message: 'Short description must be at least 10 characters.' }),
  description: z.string().min(20, { message: 'Description must be at least 20 characters.' }),
  specifications: z.object({
    material: z.string().optional(),
    dimensions: z.string().optional(),
    origin: z.string().optional(),
  }),
  images: z.array(imageSchema).min(1, { message: 'At least one image is required.' }),
});

type ProductFormValues = z.infer<typeof productSchema>;

const createSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

interface ProductFormProps {
  onSave: () => void;
  product?: Product | null;
}

export function ProductForm({ onSave, product }: ProductFormProps) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const isEditMode = !!product;

  const categoriesCollection = useMemoFirebase(() => firestore ? collection(firestore, 'categories') : null, [firestore]);
  const { data: categories } = useCollection<Category>(categoriesCollection);
  
  const brandsCollection = useMemoFirebase(() => firestore ? collection(firestore, 'brands') : null, [firestore]);
  const { data: brands } = useCollection<Brand>(brandsCollection);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      price: '',
      category: '',
      brand: '',
      featured: false,
      shortDescription: '',
      description: '',
      specifications: {
        material: '',
        dimensions: '',
        origin: '',
      },
      images: [{ imageUrl: '', description: '' }],
    },
  });

  useEffect(() => {
    if (isEditMode && product) {
      form.reset({
        ...product,
        price: product.price || '',
        brand: product.brand || '', // Ensure brand is a string
        featured: product.featured || false,
        images: product.images.map(img => ({...img }))
      });
    } else {
      form.reset({
        name: '',
        price: '',
        category: '',
        brand: '',
        featured: false,
        shortDescription: '',
        description: '',
        specifications: { material: '', dimensions: '', origin: '' },
        images: [{ imageUrl: '', description: '' }],
      });
    }
  }, [product, isEditMode, form]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'images',
  });
  
  const watchedImages = form.watch('images');

  async function onSubmit(data: ProductFormValues) {
    if (!firestore) return;
    
    const slug = createSlug(data.name);

    if (isEditMode && product) {
      const productDoc = doc(firestore, 'products', product.id);
      setDocumentNonBlocking(productDoc, { ...data, slug }, { merge: true });
      toast({
        title: 'Product Update Initiated',
        description: `"${data.name}" is being updated.`,
      });
    } else {
      const productsCollection = collection(firestore, 'products');
      addDocumentNonBlocking(productsCollection, { ...data, slug });
      toast({
        title: 'Product Addition Initiated',
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
          name="featured"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Featured Product</FormLabel>
                <FormDescription>
                  Show this product on the homepage. (Max 4)
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Rustic Ceramic Mug" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Price (Optional)</FormLabel>
                <FormControl>
                    <Input type="number" placeholder="25.00" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                   <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories?.map(category => (
                        <SelectItem key={category.id} value={category.name}>{category.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand (Optional)</FormLabel>
                  <Select onValueChange={(value) => field.onChange(value === 'none' ? '' : value)} value={field.value || 'none'}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a brand" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                       <SelectItem value="none">None</SelectItem>
                       {brands?.map(brand => (
                        <SelectItem key={brand.id} value={brand.name}>{brand.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>
        <FormField
          control={form.control}
          name="shortDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short Description</FormLabel>
              <FormControl>
                <Textarea placeholder="A brief, catchy description." {...field} />
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
              <FormLabel>Full Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Detailed product description." {...field} rows={4} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <FormField
            control={form.control}
            name="specifications.material"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Material (Optional)</FormLabel>
                <FormControl>
                    <Input placeholder="Stoneware" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="specifications.dimensions"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Dimensions (Optional)</FormLabel>
                <FormControl>
                    <Input placeholder="4' H x 3.5' W" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="specifications.origin"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Origin (Optional)</FormLabel>
                <FormControl>
                    <Input placeholder="Portugal" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <div>
          <FormLabel>Images</FormLabel>
          <div className="space-y-4 pt-2">
            {fields.map((field, index) => {
              const imageUrl = watchedImages?.[index]?.imageUrl;
              return (
                <div key={field.id} className="space-y-2 rounded-md border p-4 relative">
                  <FormField
                    control={form.control}
                    name={`images.${index}.imageUrl`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image Path</FormLabel>
                        <FormControl>
                          <Input placeholder="/my-product-image.jpg" {...field} />
                        </FormControl>
                         <FormDescription>
                            Path to an image in the 'public' folder. e.g. /product.jpg
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {imageUrl && imageUrl.startsWith('/') && (
                    <div className="relative w-32 h-32 mt-2">
                      <Image
                        src={imageUrl}
                        alt="Image preview"
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                  )}
                   <FormField
                    control={form.control}
                    name={`images.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. A rustic ceramic mug with a handle." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 text-destructive hover:bg-destructive/10"
                      onClick={() => remove(index)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              );
            })}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ imageUrl: '', description: '' })}
            >
              Add Another Image
            </Button>
          </div>
        </div>

        <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
          {form.formState.isSubmitting ? 'Saving...' : `Save ${isEditMode ? 'Changes' : 'Product'}`}
        </Button>
      </form>
    </Form>
  );
}
