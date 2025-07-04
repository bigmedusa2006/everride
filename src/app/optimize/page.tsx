
'use client';

import { useState } from 'react';
import { AppShell } from '@/components/app-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { OptimizeForm } from './optimize-form';
import { OptimizeResult, type OptimizeResultData } from './optimize-result';

export default function OptimizePage() {
  const [result, setResult] = useState<OptimizeResultData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <AppShell title="Target Optimization">
      <div className="flex-1 space-y-8 p-4 sm:p-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="font-headline text-xl">Optimize Your Daily Target</CardTitle>
              <CardDescription>
                Provide your historical data and desired income to get an AI-powered optimal driving target.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OptimizeForm onResult={setResult} setIsLoading={setIsLoading} isLoading={isLoading} />
            </CardContent>
          </Card>
          <div className="lg:sticky lg:top-24">
            <OptimizeResult result={result} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
