

export type ImagePlaceholder = {
  description: string;
  imageUrl: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  price?: number;
  category: string;
  brand?: string;
  featured?: boolean;
  specifications: {
    material?: string;
    dimensions?: string;
    origin?: string;
  };
  images: Omit<ImagePlaceholder, 'id'>[];
};

export type Category = {
    id: string;
    name: string;
    parentId?: string | null;
};

export type NestedCategory = Category & { children: NestedCategory[] };


export type Brand = {
    id: string;
    slug: string;
    name: string;
    description?: string;
    logoUrl?: string;
};

export type AppSettings = {
    id: string;
    whatsappNumber: string;
    aboutUsImageUrl?: string;
    showHeroSection?: boolean;
    showProductsSection?: boolean;
    themeName?: string;
    themeForeground?: string;
    themeMutedForeground?: string;
    themePrimary?: string;
    themeAccent?: string;
};

export type CustomFormField = {
    id: string;
    name: string;
    label: string;
    type: 'text' | 'textarea';
    required: boolean;
}

export type ContactFormSubmission = {
    id: string;
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message?: string;
    submissionDate: string;
    customFields?: Record<string, string>;
}
