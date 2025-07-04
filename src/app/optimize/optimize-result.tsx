'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Hourglass, Target, FileText, Bot } from 'lucide-react';
import type { OptimizeDrivingTargetOutput } from '@/ai/flows/optimize-driving-target';

export type OptimizeResultData = OptimizeDrivingTargetOutput;

type OptimizeResultProps = {
  result: OptimizeResultData | null;
  isLoading: boolean;
};

export function OptimizeResult({ result, isLoading }: OptimizeResultProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card className="flex flex-col items-center justify-center min-h-[400px] border-dashed shadow-none">
        <CardContent className="text-center p-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
            <Bot className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground font-headline">Awaiting Input</h3>
          <p className="text-sm text-muted-foreground mt-1">Your AI-optimized target will appear here.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-card to-muted/20 shadow-sm">
      <CardHeader>
        <CardTitle className="font-headline text-xl">Your Optimized Target</CardTitle>
        <CardDescription>Based on your data, here is our AI suggestion.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="p-4 flex flex-col items-center justify-center text-center">
            <Target className="h-8 w-8 text-primary mb-2" />
            <p className="text-sm text-muted-foreground">Suggested Target</p>
            <p className="text-3xl font-bold font-headline text-primary">${result.suggestedTarget.toFixed(2)}</p>
          </Card>
          <Card className="p-4 flex flex-col items-center justify-center text-center">
             <Hourglass className="h-8 w-8 text-accent mb-2" />
             <p className="text-sm text-muted-foreground">Estimated Hours</p>
            <p className="text-3xl font-bold font-headline text-accent">{result.estimatedWorkHours.toFixed(1)}h</p>
          </Card>
        </div>
        
        <div>
          <h4 className="font-semibold mb-2 flex items-center gap-2"><FileText className="h-4 w-4" /> AI Reasoning</h4>
          <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md border">{result.reasoning}</p>
        </div>
      </CardContent>
    </Card>
  );
}
