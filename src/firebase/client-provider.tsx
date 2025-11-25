
'use client';

import { useMemo, type ReactNode } from 'react';
import { FirebaseProvider, useFirestore, useMemoFirebase } from '@/firebase/provider';
import { initializeFirebase, useDoc } from '@/firebase';
import type { AppSettings } from '@/lib/types';
import { doc } from 'firebase/firestore';
import ConditionalLayout from '@/components/conditional-layout';
import Head from 'next/head';


function DynamicThemeStyle({ settings }: { settings: AppSettings | null }) {
    const css = `
:root {
  ${settings?.themeForeground ? `--foreground: ${settings.themeForeground};` : ''}
  ${settings?.themeMutedForeground ? `--muted-foreground: ${settings.themeMutedForeground};` : ''}
  ${settings?.themePrimary ? `--primary: ${settings.themePrimary};` : ''}
  ${settings?.themeAccent ? `--accent: ${settings.themeAccent};` : ''}
}
    `.trim();

    if (!css.includes('--')) {
        return null;
    }

    return <style>{css}</style>;
}


function ThemedLayout({ children }: { children: ReactNode }) {
    const firestore = useFirestore();
    const settingsDocRef = useMemoFirebase(() =>
        firestore ? doc(firestore, 'settings', 'app-configuration') : null,
    [firestore]);
    const { data: settings } = useDoc<AppSettings>(settingsDocRef);

    return (
        <>
            <Head>
                <DynamicThemeStyle settings={settings} />
            </Head>
            <ConditionalLayout>{children}</ConditionalLayout>
        </>
    );
}


export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const firebaseServices = useMemo(() => {
    return initializeFirebase();
  }, []);

  return (
    <FirebaseProvider
      firebaseApp={firebaseServices.firebaseApp}
      auth={firebaseServices.auth}
      firestore={firebaseServices.firestore}
    >
      <ThemedLayout>
        {children}
      </ThemedLayout>
    </FirebaseProvider>
  );
}
