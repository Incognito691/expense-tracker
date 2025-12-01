import { useState, useMemo } from 'react';
import { useStore, Expense } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import { Trash2, Plus, Calendar, DollarSign, Tag } from 'lucide-react';
import MonthSelector from '@/components/ui/month-selector';

export default function Expenses() {
  const { expenses, addExpense, deleteExpense } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);
  const [newExpense, setNewExpense] = useState<Omit<Expense, 'id'>>({
    description: '',
    amount: 0,
    category: 'General',
    date: new Date().toISOString().split('T')[0],
  });

  // Monthly navigation state
  const currentDate = new Date();
  const initialMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
  const [selectedMonth, setSelectedMonth] = useState(initialMonth);

  // Filter expenses by selected month
  const monthlyExpenses = useMemo(() => {
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      const expenseMonth = `${expenseDate.getFullYear()}-${String(expenseDate.getMonth() + 1).padStart(2, '0')}`;
      return expenseMonth === selectedMonth;
    });
  }, [expenses, selectedMonth]);

  const totalMonthlyExpenses = monthlyExpenses.reduce(
    (acc, curr) => acc + curr.amount,
    0
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addExpense(newExpense);
    setIsOpen(false);
    setNewExpense({
      description: '',
      amount: 0,
      category: 'General',
      date: new Date().toISOString().split('T')[0],
    });
  };

  const categories = [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Education',
    'General',
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-400 dark:to-orange-400 bg-clip-text text-transparent">
            Expenses
          </h1>
          <p className="text-muted-foreground mt-1">
            Track and manage your expenses
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <MonthSelector
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
          />
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/30">
                <Plus className="mr-2 h-4 w-4" /> Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="text-2xl">Add New Expense</DialogTitle>
                <DialogDescription>
                  The expense will be automatically categorized by the date you
                  select
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-5 mt-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="description"
                    className="flex items-center gap-2"
                  >
                    <Tag className="h-4 w-4" />
                    Description
                  </Label>
                  <Input
                    id="description"
                    placeholder="e.g., Groceries, Dinner, Gas"
                    value={newExpense.description}
                    onChange={e =>
                      setNewExpense({
                        ...newExpense,
                        description: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount" className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Amount
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={newExpense.amount || ''}
                    onChange={e =>
                      setNewExpense({
                        ...newExpense,
                        amount: parseFloat(e.target.value) || 0,
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={newExpense.category}
                    onChange={e =>
                      setNewExpense({ ...newExpense, category: e.target.value })
                    }
                    className="flex h-11 w-full rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                    required
                  >
                    {categories.map(cat => (
                      <option
                        key={cat}
                        value={cat}
                        className="bg-background text-foreground py-2 px-4 hover:bg-accent"
                        style={{
                          padding: '0.75rem 1rem',
                          fontSize: '0.9375rem',
                          fontWeight: '500',
                        }}
                      >
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={newExpense.date}
                    onChange={e =>
                      setNewExpense({ ...newExpense, date: e.target.value })
                    }
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    This will determine which month the expense belongs to
                  </p>
                </div>
                <DialogFooter className="gap-2 sm:gap-0">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 to-purple-600"
                  >
                    Save Expense
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Card */}
      <Card className="border-l-4 border-l-red-500 hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Monthly Summary</span>
            <span className="text-2xl font-bold text-red-600 dark:text-red-400">
              $
              {totalMonthlyExpenses.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {monthlyExpenses.length}{' '}
            {monthlyExpenses.length === 1 ? 'transaction' : 'transactions'} in{' '}
            {format(new Date(selectedMonth + '-01'), 'MMMM yyyy')}
          </p>
        </CardContent>
      </Card>

      {/* Expense List */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-8 w-1 bg-gradient-to-b from-red-500 to-orange-500 rounded-full"></div>
            Expense History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {monthlyExpenses.length === 0 ? (
              <div className="text-center py-12">
                <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground font-medium">
                  No expenses recorded for this month.
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Click "Add Expense" to get started
                </p>
              </div>
            ) : (
              monthlyExpenses
                .slice()
                .sort(
                  (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                )
                .map(expense => (
                  <div
                    key={expense.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 flex items-center justify-center">
                        <span className="text-lg font-bold text-red-600 dark:text-red-400">
                          {expense.category.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <p className="font-semibold text-base">
                          {expense.description}
                        </p>
                        <div className="flex items-center text-sm text-muted-foreground gap-2">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {format(new Date(expense.date), 'MMM d, yyyy')}
                          </span>
                          <span>•</span>
                          <Tag className="h-3 w-3" />
                          <span>{expense.category}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-lg text-red-600 dark:text-red-400">
                        -${expense.amount.toFixed(2)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        onClick={() => setExpenseToDelete(expense.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!expenseToDelete}
        onOpenChange={() => setExpenseToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Expense</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this expense? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setExpenseToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (expenseToDelete) {
                  deleteExpense(expenseToDelete);
                  setExpenseToDelete(null);
                }
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
