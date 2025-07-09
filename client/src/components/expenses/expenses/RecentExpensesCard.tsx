
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Receipt, Trash2 } from 'lucide-react';
import { useDriverSession, type Expense } from '@/contexts/DriverSessionContext';
import { useToast } from '@/hooks/use-toast';

export default function RecentExpensesCard() {
  const { state, removeExpense } = useDriverSession();
  const { toast } = useToast();

  const handleDeleteExpense = (expenseId: string) => {
    try {
      removeExpense(expenseId);
      toast({
        title: "Expense Deleted",
        description: "Expense removed from your records",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete expense",
        variant: "destructive",
      });
    }
  };

  const totalExpenses = state.currentExpenses.reduce((sum: number, expense: any) => sum + expense.amount, 0);
  const expenseCount = state.currentExpenses.length;

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-destructive/10 border border-destructive/20">
            <Receipt className="h-5 w-5 text-destructive" />
          </div>
          <div>
            <CardTitle className="text-lg text-card-foreground">
              Recent Expenses
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              View and manage your expense history
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {state.currentExpenses.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-card-foreground mb-2">No expenses recorded yet</h3>
            <p className="text-sm">Log new expenses from the "Add New" tab.</p>
          </div>
        ) : (
          <>
            {/* Expense List */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-card-foreground">
                Expense History ({expenseCount} items)
              </h4>
              
              {[...state.currentExpenses].reverse().map((expense: Expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-card-foreground">
                          {expense.description}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">
                            {expense.category}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(expense.timestamp || Date.now()).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-destructive">
                          -${expense.amount.toFixed(2)}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteExpense(expense.id)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Summary */}
            <div className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-card-foreground">
                    Total Expenses
                  </span>
                  <p className="text-xs text-muted-foreground">
                    {expenseCount} items recorded
                  </p>
                </div>
                <span className="text-xl font-bold text-destructive">
                  -${totalExpenses.toFixed(2)}
                </span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
