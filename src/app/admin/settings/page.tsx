
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
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import type { AppSettings } from '@/lib/types';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Undo2 } from 'lucide-react';

const SETTINGS_DOC_ID = 'app-configuration';

const hslColorRegex = /^\d{1,3}\s\d{1,3}%\s\d{1,3}%$/;

const settingsSchema = z.object({
  whatsappNumber: z.string().regex(/^[0-9]+$/, { message: 'Please enter a valid phone number with country code, without spaces or symbols.' }).min(10, { message: 'Number must be at least 10 digits.' }),
  aboutUsImageUrl: z.string().url({ message: 'Please enter a valid URL.' }).optional().or(z.literal('')),
  showHeroSection: z.boolean(),
  showProductsSection: z.boolean(),
  themeForeground: z.string().regex(hslColorRegex, { message: 'Invalid HSL format.'}),
  themeMutedForeground: z.string().regex(hslColorRegex, { message: 'Invalid HSL format.'}),
  themePrimary: z.string().regex(hslColorRegex, { message: 'Invalid HSL format.'}),
  themeAccent: z.string().regex(hslColorRegex, { message: 'Invalid HSL format.'}),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

const defaultThemeColors = {
  themeForeground: '25 55% 15%',
  themeMutedForeground: '25 55% 15%',
  themePrimary: '25 55% 15%',
  themeAccent: '30 48% 64%',
};


function hexToHsl(hex: string): string | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return null;

    let r = parseInt(result[1], 16) / 255;
    let g = parseInt(result[2], 16) / 255;
    let b = parseInt(result[3], 16) / 255;

    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);

    return `${h} ${s}% ${l}%`;
}


function hslToHex(hsl: string): string {
    if (!hsl || typeof hsl !== 'string' || hsl.split(' ').length < 3) return '#000000';
    const [h, s, l] = hsl.split(' ').map((val, i) => {
        return parseInt(val.replace('%', ''), 10) / (i > 0 ? 100 : 1);
    });

    if (s === 0) return `#${Math.round(l*255).toString(16).padStart(2, '0').repeat(3)}`;

    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) =>
        l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
    
    const toHex = (n: number) => Math.round(n * 255).toString(16).padStart(2, '0');
    
    return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
}


function ColorPicker({
    field,
    label,
    description,
}: {
    field: any;
    label: string;
    description: string;
}) {
    return (
        <FormItem>
            <FormLabel>{label}</FormLabel>
            <div className="flex items-center gap-4">
                <FormControl>
                    <Input 
                        type="color" 
                        className="w-12 h-10 p-1"
                        value={field.value ? hslToHex(field.value) : '#000000'}
                        onChange={(e) => {
                            const hsl = hexToHsl(e.target.value);
                            if (hsl) {
                                field.onChange(hsl);
                            }
                        }}
                    />
                </FormControl>
                <div className="w-full">
                  <Input 
                      placeholder="e.g. 25 55% 15%" 
                      {...field}
                  />
                  <FormDescription className="mt-2">{description}</FormDescription>
                </div>
            </div>
            <FormMessage />
        </FormItem>
    );
}

function SettingsFormSkeleton() {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-24" />
        </div>
    )
}


export default function AdminSettingsPage() {
  const firestore = useFirestore();
  const { toast } = useToast();

  const settingsDocRef = useMemoFirebase(() => 
    firestore ? doc(firestore, 'settings', SETTINGS_DOC_ID) : null
  , [firestore]);

  const { data: settings, isLoading } = useDoc<AppSettings>(settingsDocRef);
  
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      whatsappNumber: '',
      aboutUsImageUrl: '',
      showHeroSection: true,
      showProductsSection: true,
      ...defaultThemeColors,
    },
  });
  
  const watchedColors = form.watch(['themeForeground', 'themePrimary', 'themeAccent', 'themeMutedForeground']);

  useEffect(() => {
    if (settings) {
      form.reset({ 
          whatsappNumber: settings.whatsappNumber || '',
          aboutUsImageUrl: settings.aboutUsImageUrl || '',
          showHeroSection: settings.showHeroSection !== false,
          showProductsSection: settings.showProductsSection !== false,
          themeForeground: settings.themeForeground || defaultThemeColors.themeForeground,
          themeMutedForeground: settings.themeMutedForeground || defaultThemeColors.themeMutedForeground,
          themePrimary: settings.themePrimary || defaultThemeColors.themePrimary,
          themeAccent: settings.themeAccent || defaultThemeColors.themeAccent,
      });
    }
  }, [settings, form]);


  function onSubmit(data: SettingsFormValues) {
    if (!firestore || !settingsDocRef) return;
    setDocumentNonBlocking(settingsDocRef, data, { merge: true });
    
    toast({
      title: 'Settings Update Initiated',
      description: 'Your settings are being updated. It may take a moment for theme changes to apply.',
    });
  }

  function handleResetColors() {
    form.setValue('themeForeground', defaultThemeColors.themeForeground);
    form.setValue('themeMutedForeground', defaultThemeColors.themeMutedForeground);
    form.setValue('themePrimary', defaultThemeColors.themePrimary);
    form.setValue('themeAccent', defaultThemeColors.themeAccent);
    toast({
      title: 'Colors Reset',
      description: 'Theme colors have been reset to their default values.',
    });
  }

  return (
    <div>
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-headline font-bold text-primary">Settings</h1>
        </div>
        <Card className="max-w-2xl">
            <CardHeader>
                <CardTitle>Application Settings</CardTitle>
                <CardDescription>Manage general settings for your application.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? <SettingsFormSkeleton /> : (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-4">
                            <FormField
                            control={form.control}
                            name="whatsappNumber"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>WhatsApp Number</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. 15551234567" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormField
                            control={form.control}
                            name="aboutUsImageUrl"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>About Us Image URL</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://example.com/image.jpg" {...field} />
                                </FormControl>
                                 <FormDescription>
                                    The image displayed in the 'About Us' section on the homepage.
                                </FormDescription>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        </div>
                        
                        <Separator />

                        <div>
                            <h3 className="text-lg font-medium">Theme</h3>
                            <p className="text-sm text-muted-foreground">
                                Customize the main colors of your site.
                            </p>
                        </div>
                         <div className="space-y-6">
                            <FormField
                                control={form.control}
                                name="themeForeground"
                                render={({ field }) => (
                                    <ColorPicker 
                                        field={field} 
                                        label="Foreground Color" 
                                        description="The main text color for your site." 
                                    />
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="themeMutedForeground"
                                render={({ field }) => (
                                    <ColorPicker 
                                        field={field} 
                                        label="Muted Text Color" 
                                        description="For secondary text, like descriptions." 
                                    />
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="themePrimary"
                                render={({ field }) => (
                                    <ColorPicker 
                                        field={field} 
                                        label="Primary Color" 
                                        description="Used for headings, links, and important buttons." 
                                    />
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="themeAccent"
                                render={({ field }) => (
                                    <ColorPicker 
                                        field={field} 
                                        label="Accent Color" 
                                        description="Used for highlights and secondary calls-to-action." 
                                    />
                                )}
                            />
                        </div>

                        <Separator />
                        
                        <div>
                            <h3 className="text-lg font-medium">Live Preview</h3>
                             <Card className="mt-4 p-6">
                                <h4
                                    className="font-headline text-2xl font-bold"
                                    style={{ color: `hsl(${watchedColors[1]})`}}
                                >
                                    This is a Primary Heading
                                </h4>
                                <p
                                    className="mt-2 text-base"
                                    style={{ color: `hsl(${watchedColors[0]})`}}
                                >
                                    This is a sample paragraph showing the main foreground text color. It will update as you pick a new color.
                                </p>
                                <p
                                    className="mt-2 text-sm"
                                    style={{ color: `hsl(${watchedColors[3]})`}}
                                >
                                    This is muted text, used for descriptions and secondary information.
                                </p>
                                <div className="mt-4">
                                    <span 
                                        className="py-1 px-2 rounded-md"
                                        style={{ 
                                            backgroundColor: `hsl(${watchedColors[2]})`,
                                            color: `hsl(${watchedColors[0]})`
                                        }}
                                    >
                                        Accent Color
                                    </span>
                                </div>
                            </Card>
                        </div>


                        <Separator />

                        <div>
                            <h3 className="text-lg font-medium">Homepage Sections</h3>
                            <p className="text-sm text-muted-foreground">
                                Control which sections are visible on your homepage.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <FormField
                            control={form.control}
                            name="showHeroSection"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                <div className="space-y-0.5">
                                    <FormLabel>Hero Section</FormLabel>
                                    <FormDescription>
                                     Show the main hero banner at the top of the page.
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
                            name="showProductsSection"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                <div className="space-y-0.5">
                                    <FormLabel>Products Section</FormLabel>
                                    <FormDescription>
                                     Show the "Our Products" product grid.
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
                        </div>

                        <div className="flex flex-col-reverse sm:flex-row gap-2">
                            <Button type="submit" disabled={form.formState.isSubmitting} className="w-full sm:w-auto">
                            {form.formState.isSubmitting ? 'Saving...' : 'Save Settings'}
                            </Button>
                             <Button type="button" variant="outline" onClick={handleResetColors} className="w-full sm:w-auto">
                                <Undo2 className="mr-2 h-4 w-4" />
                                Reset Colors
                            </Button>
                        </div>
                    </form>
                </Form>
                )}
            </CardContent>
        </Card>
    </div>
  );
}
