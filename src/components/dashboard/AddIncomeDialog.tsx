import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useStore } from '@/store/useStore';

interface AddIncomeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddIncomeDialog({
  open,
  onOpenChange,
}: AddIncomeDialogProps) {
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState('');
  const [description, setDescription] = useState('');

  // Smart month/year selection - defaults to current month
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  const addIncome = useStore(state => state.addIncome);

  // Generate month options
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  // Generate year options (current year and previous year)
  const years = [currentDate.getFullYear(), currentDate.getFullYear() - 1];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !source) return;

    // Create date for the first day of selected month/year
    const incomeDate = new Date(selectedYear, selectedMonth, 1);

    addIncome({
      amount: parseFloat(amount),
      source,
      description,
      date: incomeDate.toISOString(),
    });

    // Reset form
    setAmount('');
    setSource('');
    setDescription('');
    setSelectedMonth(currentDate.getMonth());
    setSelectedYear(currentDate.getFullYear());
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl">Add Income</DialogTitle>
            <DialogDescription>
              Record your income. Select the month you received it.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-5 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="month" className="text-sm font-medium">
                  Month
                </Label>
                <select
                  id="month"
                  value={selectedMonth}
                  onChange={e => setSelectedMonth(parseInt(e.target.value))}
                  className="flex h-11 w-full rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                  required
                >
                  {months.map((month, index) => (
                    <option
                      key={month}
                      value={index}
                      className="bg-background text-foreground py-2 px-4 hover:bg-accent"
                      style={{
                        padding: '0.75rem 1rem',
                        fontSize: '0.9375rem',
                        fontWeight: '500',
                      }}
                    >
                      {month}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="year" className="text-sm font-medium">
                  Year
                </Label>
                <select
                  id="year"
                  value={selectedYear}
                  onChange={e => setSelectedYear(parseInt(e.target.value))}
                  className="flex h-11 w-full rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                  required
                >
                  {years.map(year => (
                    <option
                      key={year}
                      value={year}
                      className="bg-background text-foreground py-2 px-4 hover:bg-accent"
                      style={{
                        padding: '0.75rem 1rem',
                        fontSize: '0.9375rem',
                        fontWeight: '500',
                      }}
                    >
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amount" className="text-sm font-medium">
                Amount ($)
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="5000.00"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                required
                className="text-lg"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="source" className="text-sm font-medium">
                Source
              </Label>
              <Input
                id="source"
                placeholder="Salary, Freelance, Bonus, etc."
                value={source}
                onChange={e => setSource(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description (Optional)
              </Label>
              <Input
                id="description"
                placeholder="Monthly salary payment"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              Add Income
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
