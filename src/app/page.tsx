'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid,
  Calendar,
  ReceiptText,
  HelpCircle,
  Settings,
  Clock,
  GitFork,
  Target,
  DollarSign,
  Power,
  Car,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const topNavItems = [
  { href: '/', label: 'Dashboard', icon: LayoutGrid },
  { href: '/bookings', label: 'Reservations', icon: Calendar },
  { href: '/expenses', label: 'Expenses', icon: ReceiptText },
  { href: '/manual', label: 'Manual', icon: HelpCircle },
  { href: '/settings', label: 'Settings', icon: Settings },
];

const bottomNavItems = [
  { href: '/clock', label: 'Clock', icon: Clock },
  { href: '/trips', label: 'Trips', icon: GitFork },
  { href: '/optimize', label: 'Target', icon: Target },
  { href: '/history', label: 'History', icon: DollarSign },
];

const NavButton = ({ item }: { item: { href: string; label: string; icon: React.ElementType } }) => {
  const pathname = usePathname();
  const isActive = pathname === item.href;

  return (
    <Link href={item.href} passHref>
      <div className="flex flex-col items-center justify-center p-1 rounded-lg cursor-pointer w-20 h-16 space-y-1 text-center hover:bg-muted">
        <item.icon className={cn('h-6 w-6', isActive ? 'text-primary' : 'text-muted-foreground')} />
        <span className={cn('text-xs font-medium',  isActive ? 'text-primary' : 'text-muted-foreground')}>{item.label}</span>
      </div>
    </Link>
  );
};

export default function DashboardPage() {
  const [isShiftOn, setIsShiftOn] = useState(false);

  const toggleShift = () => {
    setIsShiftOn(!isShiftOn);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40">
      <div className="w-full max-w-xs space-y-2">
        <Card className="shadow-sm">
          <CardContent className="p-2 flex justify-around">
            {topNavItems.map((item) => (
              <NavButton key={item.label} item={item} />
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-2 flex justify-around">
            {bottomNavItems.map((item) => (
              <NavButton key={item.label} item={item} />
            ))}
          </CardContent>
        </Card>

        <Card className="text-center shadow-lg">
          <CardContent className="p-6 space-y-6">
            <h2 className="text-2xl font-bold font-headline">Prime Rides™</h2>
            <Button
              variant={isShiftOn ? 'outline' : 'destructive'}
              className="w-24 mx-auto rounded-full flex items-center justify-center gap-2"
              onClick={toggleShift}
            >
              <Power className="h-4 w-4" />
              <span>{isShiftOn ? 'On' : 'Off'}</span>
            </Button>
            <Button size="lg" className="w-full" onClick={toggleShift}>
              <Car className="mr-2 h-5 w-5" />
              {isShiftOn ? 'End Shift' : 'Start Shift'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
