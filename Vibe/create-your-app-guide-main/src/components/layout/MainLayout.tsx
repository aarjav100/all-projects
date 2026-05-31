import { ReactNode } from 'react';
import TopHeader from './TopHeader';
import BottomNav from './BottomNav';

interface MainLayoutProps {
  children: ReactNode;
  hideHeader?: boolean;
  hideNav?: boolean;
}

export default function MainLayout({ children, hideHeader = false, hideNav = false }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Subtle background pattern */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>
      
      {!hideHeader && <TopHeader />}
      <main className={`${!hideHeader ? 'pt-20' : ''} ${!hideNav ? 'pb-28' : ''} max-w-lg mx-auto px-4`}>
        {children}
      </main>
      {!hideNav && <BottomNav />}
    </div>
  );
}