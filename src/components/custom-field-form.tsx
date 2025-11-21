'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
import { useFirestore } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { addDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useEffect } from 'react';
import type { CustomFormField } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Switch } from './ui/switch';

const createMachineName = (label: string) => {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '_');
};

const formSchema = z.object({
  label: z.string().min(2, { message: 'Label must be at least 2 characters.' }),
  type: z.enum(['text', 'textarea']),
  required: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

interface CustomFieldFormProps {
  field?: CustomFormField | null;
  onSave: () => void;
}

export function CustomFieldForm({ field, onSave }: CustomFieldFormProps) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const isEditMode = !!field;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      label: '',
      type: 'text',
      required: false,
    },
  });

  useEffect(() => {
    if (isEditMode && field) {
      form.reset({
        label: field.label,
        type: field.type,
        required: field.required,
      });
    } else {
      form.reset({
        label: '',
        type: 'text',
        required: false,
      });
    }
  }, [field, isEditMode, form]);

  async function onSubmit(data: FormValues) {
    if (!firestore) return;
    
    // Generate machine-readable name from label, can't be changed after creation
    const name = isEditMode && field ? field.name : createMachineName(data.label);

    const fieldData = {
        ...data,
        name,
    };

    if (isEditMode && field) {
      const itemDoc = doc(firestore, 'custom_form_fields', field.id);
      setDocumentNonBlocking(itemDoc, fieldData, { merge: true });
      toast({
        title: `Field Update Initiated`,
        description: `"${data.label}" is being updated.`,
      });
    } else {
      const formCollection = collection(firestore, 'custom_form_fields');
      addDocumentNonBlocking(formCollection, fieldData);
      toast({
        title: `Field Addition Initiated`,
        description: `"${data.label}" is being added.`,
      });
    }

    onSave();
  }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Field Label</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Order Number" {...field} />
              </FormControl>
              <FormDescription>
                This is what users will see on the contact form.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Field Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a field type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="text">Text (Single Line)</SelectItem>
                  <SelectItem value="textarea">Text Area (Multi-line)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="required"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Required</FormLabel>
                <FormDescription>
                  Is this field mandatory for submission?
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

        <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
          {form.formState.isSubmitting ? 'Saving...' : `Save ${isEditMode ? 'Changes' : 'Field'}`}
        </Button>
      </form>
    </Form>
  );
}
