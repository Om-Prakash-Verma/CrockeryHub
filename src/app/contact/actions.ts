
'use server';

import { z } from 'zod';
import { collection, getDocs, getFirestore, addDoc } from 'firebase/firestore';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { firebaseConfig } from '@/firebase/config';
import type { CustomFormField } from '@/lib/types';

const contactSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  phone: z.string().optional(),
  subject: z.string().min(1, { message: 'Please select a subject.' }),
  message: z.string().optional(),
});

export type FormState = {
  message: string;
  status: 'success' | 'error' | 'idle';
};

// Helper function to initialize Firebase on the server
function getFirestoreInstance() {
    if (!getApps().length) {
        const app = initializeApp(firebaseConfig);
        return getFirestore(app);
    }
    return getFirestore(getApp());
}


export async function submitContactForm(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const firestore = getFirestoreInstance();

  // Fetch custom fields to build dynamic schema
  const customFieldsCollection = collection(firestore, 'custom_form_fields');
  const customFieldsSnapshot = await getDocs(customFieldsCollection);
  const customFields = customFieldsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CustomFormField));

  let dynamicSchema = contactSchema;
  const customFieldValues: Record<string, any> = {};

  // Extend schema and collect values
  const rawFormData = Object.fromEntries(formData.entries());
  for (const field of customFields) {
      const value = rawFormData[field.name];
      const fieldSchema = field.required
        ? z.string().min(1, { message: `${field.label} is required.` })
        : z.string().optional();

      dynamicSchema = dynamicSchema.extend({
          [field.name]: fieldSchema,
      });

      if (value) {
        customFieldValues[field.name] = value;
      }
  }


  const validatedFields = dynamicSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.errors
        .map(err => err.message)
        .join(', '),
      status: 'error',
    };
  }

  try {
    const submissionsCollection = collection(
      firestore,
      'contact_form_submissions'
    );
    
    const { name, email, phone, subject, message, ...rest } = validatedFields.data;

    await addDoc(submissionsCollection, {
      name,
      email,
      phone,
      subject,
      message,
      customFields: rest,
      submissionDate: new Date().toISOString(),
    });

    return {
      message: 'Thank you for your message! We will get back to you shortly.',
      status: 'success',
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unexpected error occurred.';
    return {
      message: `An unexpected error occurred. Please try again. ${errorMessage}`,
      status: 'error',
    };
  }
}
