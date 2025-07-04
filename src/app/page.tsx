'use client';
import { useState } from 'react';
import Image from 'next/image';
import {
  Car,
  DollarSign,
  Fuel,
  TrendingUp,
  Zap,
  Clock,
  PlusCircle,
  List,
} from 'lucide-react';
import { AppShell } from '@/components/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Badge } from '@/components/ui/badge';

const earningsData = [
  { name: 'Mon', earnings: 220 },
  { name: 'Tue', earnings: 180 },
  { name: 'Wed', earnings: 250 },
  { name: 'Thu', earnings: 210 },
  { name: 'Fri', earnings: 320 },
  { name: 'Sat', earnings: 380 },
  { name: 'Sun', earnings: 350 },
];

const recentActivities = [
  {
    type: 'Trip',
    description: 'Airport run',
    amount: 45.5,
    time: '10m ago',
  },
  {
    type: 'Expense',
    description: 'Gasoline',
    amount: -55.2,
    time: '1h ago',
  },
  {
    type: 'Trip',
    description: 'Downtown to Uptown',
    amount: 22.0,
    time: '2h ago',
  },
  {
    type: 'Booking',
    description: 'Pick up J. Doe',
    amount: 0,
    time: 'Tomorrow at 9am',
  },
];

export default function DashboardPage() {
  const [target, setTarget] = useState(250);
  const [current, setCurrent] = useState(175);

  const handleSuggestTarget = () => {
    // In a real app, this would call the GenAI flow
    const suggested = Math.floor(Math.random() * 100) + 200;
    setTarget(suggested);
  };

  return (
    <AppShell title="Dashboard">
      <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-headline">$4,231.89</div>
              <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Trips Today</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-headline">12</div>
              <p className="text-xs text-muted-foreground">+3 since last hour</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Expenses Today
              </CardTitle>
              <Fuel className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-headline">$78.43</div>
              <p className="text-xs text-muted-foreground">Mainly fuel</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hourly Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-headline">$35.21</div>
              <p className="text-xs text-muted-foreground">
                Average for today
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 lg:grid-cols-7">
          <Card className="lg:col-span-4 shadow-sm">
            <CardHeader>
              <CardTitle className="font-headline">Weekly Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={earningsData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip
                    cursor={{ fill: 'hsl(var(--muted))' }}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 'var(--radius)',
                    }}
                  />
                  <Bar
                    dataKey="earnings"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <div className="lg:col-span-3 flex flex-col gap-4">
            <Card className="flex-grow flex flex-col shadow-sm">
              <CardHeader>
                <CardTitle className="font-headline">Shift Status</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col items-center justify-center gap-4">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path
                      className="text-muted"
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      className="text-primary"
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeDasharray="75, 100"
                      strokeDashoffset="25"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold font-headline text-primary">
                      6h 15m
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Active
                    </span>
                  </div>
                </div>
                <Button size="lg" className="w-full font-bold">
                  <Clock className="mr-2 h-5 w-5" /> End Shift
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="font-headline text-lg">
                  Daily Target
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <Progress value={(current / target) * 100} />
                <div className="flex justify-between items-baseline">
                  <span className="text-2xl font-bold text-primary font-headline">
                    ${current.toFixed(2)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Target: ${target.toFixed(2)}
                  </span>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleSuggestTarget}
                >
                  <Zap className="mr-2 h-4 w-4" /> Get AI Suggestion
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4 shadow-sm">
            <CardHeader>
              <CardTitle className="font-headline">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentActivities.map((activity, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Badge
                          variant={
                            activity.type === 'Trip'
                              ? 'default'
                              : activity.type === 'Expense'
                              ? 'destructive'
                              : 'secondary'
                          }
                          className="bg-opacity-20 text-opacity-100 border-none"
                        >
                          {activity.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{activity.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.time}
                        </p>
                      </TableCell>
                      <TableCell
                        className={`text-right font-medium ${
                          activity.amount > 0 ? 'text-green-500' : 'text-red-500'
                        }`}
                      >
                        {activity.amount !== 0 &&
                          `${activity.amount > 0 ? '+' : ''}$${Math.abs(
                            activity.amount
                          ).toFixed(2)}`}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card className="lg:col-span-3 shadow-sm">
            <CardHeader>
              <CardTitle className="font-headline">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-20 flex-col gap-2">
                <PlusCircle className="h-6 w-6" />
                <span>Log Trip</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Fuel className="h-6 w-6" />
                <span>Log Expense</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <List className="h-6 w-6" />
                <span>View Bookings</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Image
                  src="https://placehold.co/24x24.png"
                  data-ai-hint="qr code"
                  alt="QR Code"
                  width={24}
                  height={24}
                />
                <span>Share QR</span>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
