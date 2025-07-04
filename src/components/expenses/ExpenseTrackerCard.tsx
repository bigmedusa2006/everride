
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDriverSession } from '@/contexts/DriverSessionContext';
import { useToast } from '@/hooks/use-toast';
import { DollarSign, Tag, MessageSquare, PlusCircle } from 'lucide-react';

export function ExpenseTrackerCard() {
  const { state, dispatch } = useDriverSession();
  const { toast } = useToast();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Fuel');
  const [description, setDescription] = useState('');

  const handleAddExpense = () => {
    const expenseAmount = parseFloat(amount);
    if (!expenseAmount || expenseAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid expense amount.",
        variant: "destructive",
      });
      return;
    }
    if (!description) {
        toast({
            title: "Missing Description",
            description: "Please provide a description for the expense.",
            variant: "destructive",
        });
        return;
    }

    dispatch({
      type: 'ADD_EXPENSE',
      payload: {
        id: crypto.randomUUID(),
        amount: expenseAmount,
        category,
        description,
        timestamp: Date.now(),
      },
    });

    toast({
      title: "Expense Added",
      description: `${category} expense of $${expenseAmount.toFixed(2)} logged.`,
    });

    setAmount('');
    setDescription('');
    setCategory('Fuel');
  };
  
  const expenseCategories = ['Fuel', 'Maintenance', 'Insurance', 'Food', 'Car Wash', 'Other'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Expense</CardTitle>
        <CardDescription>Log your work-related expenses here.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="description" className="flex items-center gap-2"><MessageSquare className="h-4 w-4"/>Description</Label>
          <Input 
            id="description" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Gas fill-up, Oil change"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="amount" className="flex items-center gap-2"><DollarSign className="h-4 w-4"/>Amount</Label>
          <Input 
            id="amount" 
            type="number" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00" 
          />
        </div>
        <div className="space-y-2">
          <Label className="flex items-center gap-2"><Tag className="h-4 w-4"/>Category</Label>
          <div className="grid grid-cols-3 gap-2">
            {expenseCategories.map(cat => (
              <Button 
                key={cat} 
                variant={category === cat ? "default" : "outline"}
                onClick={() => setCategory(cat)}
                className="text-xs h-9"
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>
        <Button onClick={handleAddExpense} disabled={!state.isShiftActive} className="w-full mt-4">
          <PlusCircle className="mr-2 h-4 w-4"/>
          {state.isShiftActive ? "Log Expense" : "Start a shift to log expenses"}
        </Button>
      </CardContent>
    </Card>
  );
}
