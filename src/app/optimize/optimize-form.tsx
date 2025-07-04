'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { optimizeDrivingTarget } from '@/ai/flows/optimize-driving-target';
import type { OptimizeDrivingTargetOutput } from '@/ai/flows/optimize-driving-target';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Bot, Loader2 } from 'lucide-react';

const formSchema = z.object({
  pastTripData: z.string().min(50, { message: 'Please provide at least 50 characters of trip data for a good analysis.' }),
  pastExpenseData: z.string().min(20, { message: 'Please provide at least 20 characters of expense data.' }),
  desiredIncome: z.coerce.number().positive({ message: 'Desired income must be a positive number.' }).min(1),
  desiredWorkHours: z.coerce.number().positive({ message: 'Desired work hours must be a positive number.' }).min(1).max(24),
});

type OptimizeFormProps = {
  onResult: (result: OptimizeDrivingTargetOutput | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  isLoading: boolean;
};

export function OptimizeForm({ onResult, setIsLoading, isLoading }: OptimizeFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pastTripData: '',
      pastExpenseData: '',
      desiredIncome: 200,
      desiredWorkHours: 8,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    onResult(null);
    try {
      const result = await optimizeDrivingTarget(values);
      onResult(result);
    } catch (error) {
      console.error('Optimization Error:', error);
      toast({
        variant: 'destructive',
        title: 'Optimization Failed',
        description: 'The AI model could not generate a suggestion. Please check your inputs or try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="pastTripData"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Past Trip Data</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., 2024-05-20, 09:00, Downtown to Airport, $45.50&#10;2024-05-20, 10:30, City Center, $22.00..."
                  className="h-32"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Paste your trip history. Include date, time, location, and earnings for best results.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="pastExpenseData"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Past Expense Data</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., 2024-05-20, Fuel, $55.20&#10;2024-05-18, Car Wash, $15.00..."
                  className="h-24"
                  {...field}
                />
              </FormControl>
               <FormDescription>
                Paste your expense history. Include date, category, and amount.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="desiredIncome"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Desired Daily Income</FormLabel>
                <FormControl>
                    <Input type="number" placeholder="e.g., 250" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="desiredWorkHours"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Desired Daily Hours</FormLabel>
                <FormControl>
                    <Input type="number" placeholder="e.g., 8" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <Button type="submit" disabled={isLoading} className="w-full !mt-8">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Bot className="mr-2 h-4 w-4" />
          )}
          Optimize My Target
        </Button>
      </form>
    </Form>
  );
}
