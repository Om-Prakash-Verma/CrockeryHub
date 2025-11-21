
'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { submitContactForm, type FormState } from '@/app/contact/actions';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { CustomFormField } from '@/lib/types';
import { Skeleton } from './ui/skeleton';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
    >
      {pending ? 'Sending...' : 'Send Message'}
    </Button>
  );
}

function DynamicField({ field }: { field: CustomFormField }) {
    if (field.type === 'textarea') {
        return (
             <div className="space-y-2">
              <Label htmlFor={field.name}>{field.label}</Label>
              <Textarea id={field.name} name={field.name} placeholder={field.label} required={field.required} />
            </div>
        )
    }
    return (
        <div className="space-y-2">
            <Label htmlFor={field.name}>{field.label}</Label>
            <Input id={field.name} name={field.name} placeholder={field.label} required={field.required} />
        </div>
    )
}

function ContactFormSkeleton() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
            </div>
             <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
            </div>
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-full" />
        </div>
    )
}

export default function ContactForm() {
  const initialState: FormState = { message: '', status: 'idle' };
  const [state, formAction] = useActionState(submitContactForm, initialState);
  const { toast } = useToast();

  const firestore = useFirestore();
  const customFieldsCollection = useMemoFirebase(() => (firestore ? collection(firestore, 'custom_form_fields') : null), [firestore]);
  const { data: customFields, isLoading } = useCollection<CustomFormField>(customFieldsCollection);

  useEffect(() => {
    if (state.status === 'success') {
      toast({
        title: 'Success!',
        description: state.message,
      });
    } else if (state.status === 'error') {
      toast({
        title: 'Error',
        description: state.message,
        variant: 'destructive',
      });
    }
  }, [state, toast]);

  return (
    <Card>
      <CardContent className="p-6 md:p-8">
        {isLoading ? <ContactFormSkeleton /> : (
            <form action={formAction} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" placeholder="Your Name" required />
                </div>
                <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    required
                />
                </div>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="(123) 456-7890"
                />
                </div>
                <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select name="subject" required>
                    <SelectTrigger id="subject">
                    <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="General Inquiry">General Inquiry</SelectItem>
                    <SelectItem value="Product Question">Product Question</SelectItem>
                    <SelectItem value="Special Order">Special Order</SelectItem>
                    <SelectItem value="Feedback">Feedback</SelectItem>
                    </SelectContent>
                </Select>
                </div>
            </div>
            {customFields?.map(field => (
                <DynamicField key={field.id} field={field} />
            ))}
            <div className="space-y-2">
                <Label htmlFor="message">Message (Optional)</Label>
                <Textarea
                id="message"
                name="message"
                placeholder="Your message..."
                rows={5}
                />
            </div>
            <SubmitButton />
            </form>
        )}
      </CardContent>
    </Card>
  );
}
