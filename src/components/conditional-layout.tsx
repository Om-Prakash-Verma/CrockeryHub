'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { useRef, useEffect } from 'react';

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');
  const containerRef = useRef(null);

  useEffect(() => {
    if (isAdminPage || !containerRef.current) return;
    
    let scroll: any;
    import('locomotive-scroll').then((locomotiveModule) => {
        scroll = new locomotiveModule.default({
            el: containerRef.current as any,
            smooth: true,
            multiplier: 1,
            lerp: 0.1
        });
    });

    return () => {
        if(scroll) {
            scroll.destroy();
        }
    }
  }, [pathname, isAdminPage]);


  if (isAdminPage) {
    return <>{children}</>;
  }

  return (
    <div ref={containerRef} data-scroll-container>
      <Header />
      <main className="min-h-[calc(100vh-10rem)]">{children}</main>
      <Footer />
    </div>
  );
}
