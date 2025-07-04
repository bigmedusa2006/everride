'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Car,
  Calendar,
  Fuel,
  LayoutDashboard,
  Menu,
  Settings,
  Bot,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from '@/components/ui/sheet';
import { UserNav } from '@/components/user-nav';

const navItems = [
  {
    href: '/',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/trips',
    label: 'Trips',
    icon: Car,
  },
  {
    href: '/expenses',
    label: 'Expenses',
    icon: Fuel,
  },
  {
    href: '/bookings',
    label: 'Bookings',
    icon: Calendar,
  },
  {
    href: '/optimize',
    label: 'Optimize Target',
    icon: Bot,
  },
  {
    href: '/settings',
    label: 'Settings',
    icon: Settings,
  },
];

interface AppShellProps {
  children: React.ReactNode;
  title: string;
}

export function AppShell({ children, title }: AppShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-60 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <Link
            href="/"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <Car className="h-5 w-5 transition-all group-hover:scale-110" />
            <span className="sr-only">Prime Time</span>
          </Link>
          <div className="flex-1 w-full">
            {navItems.map((item) => (
              <NavItem key={item.href} {...item} />
            ))}
          </div>
        </nav>
      </aside>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-60">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <SheetHeader>
                <Link
                  href="/"
                  className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
                >
                  <Car className="h-5 w-5 transition-all group-hover:scale-110" />
                  <span className="sr-only">Prime Time</span>
                </Link>
              </SheetHeader>
              <nav className="grid gap-6 text-lg font-medium mt-8">
                {navItems.map((item) => (
                   <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
           <h1 className="text-xl md:text-2xl font-bold font-headline">{title}</h1>
          <div className="relative ml-auto flex-1 md:grow-0">
            {/* Search can go here */}
          </div>
          <UserNav />
        </header>
        <main className="flex-1 bg-background rounded-lg shadow-inner-soft">
          {children}
        </main>
      </div>
    </div>
  );
}

interface NavItemProps {
  href: string;
  label: string;
  icon: React.ElementType;
}

function NavItem({ href, label, icon: Icon }: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        'flex items-center justify-start gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
        isActive && 'bg-accent text-accent-foreground font-semibold'
      )}
    >
      <Icon className="h-5 w-5" />
      <span className="inline">{label}</span>
    </Link>
  );
}
