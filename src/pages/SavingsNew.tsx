import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
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
import {
  Plus,
  Target,
  Trash2,
  TrendingUp,
  PiggyBank,
  AlertTriangle,
} from 'lucide-react';

export default function Savings() {
  const {
    savingsGoal,
    setSavingsGoal,
    addSavingsContribution,
    savingsContributions,
    deleteSavingsContribution,
  } = useStore();
  const [isGoalOpen, setIsGoalOpen] = useState(false);
  const [isContributeOpen, setIsContributeOpen] = useState(false);
  const [showClearAll, setShowClearAll] = useState(false);
  const [contributionToDelete, setContributionToDelete] = useState<
    string | null
  >(null);
  const [goalAmount, setGoalAmount] = useState(savingsGoal.targetAmount);
  const [contributionAmount, setContributionAmount] = useState(0);

  // Smart month/year selection for savings - defaults to current month
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  const handleSetGoal = (e: React.FormEvent) => {
    e.preventDefault();
    setSavingsGoal(goalAmount);
    setIsGoalOpen(false);
  };

  const handleContribute = (e: React.FormEvent) => {
    e.preventDefault();
    // Create date as 1st of selected month/year
    const date = new Date(selectedYear, selectedMonth, 1);
    const month = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}`;
    addSavingsContribution(contributionAmount, month, date.toISOString());
    setIsContributeOpen(false);
    setContributionAmount(0);
    // Reset to current month
    setSelectedMonth(currentDate.getMonth());
    setSelectedYear(currentDate.getFullYear());
  };

  const handleClearAll = () => {
    savingsContributions.forEach(contribution => {
      deleteSavingsContribution(contribution.id);
    });
    setShowClearAll(false);
  };

  const progress =
    savingsGoal.targetAmount > 0
      ? Math.min(
          (savingsGoal.currentAmount / savingsGoal.targetAmount) * 100,
          100
        )
      : 0;

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
            Savings
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your savings goal and contributions
          </p>
        </div>
        {savingsContributions.length > 0 && (
          <Button
            variant="outline"
            className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
            onClick={() => setShowClearAll(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Clear All Savings
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Savings Goal Card */}
        <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle>Savings Goal</CardTitle>
                <CardDescription>
                  Track your progress towards your target
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-muted-foreground">Current Amount</span>
                <span className="text-purple-600 dark:text-purple-400 text-lg font-bold">
                  $
                  {savingsGoal.currentAmount.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span className="text-muted-foreground">Target Amount</span>
                <span className="text-lg font-bold">
                  $
                  {savingsGoal.targetAmount.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{progress.toFixed(1)}% Complete</span>
                <span>
                  $
                  {(
                    savingsGoal.targetAmount - savingsGoal.currentAmount
                  ).toLocaleString('en-US', { minimumFractionDigits: 2 })}{' '}
                  remaining
                </span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>
            <div className="flex gap-2 pt-2">
              <Dialog open={isGoalOpen} onOpenChange={setIsGoalOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Target className="mr-2 h-4 w-4" /> Set Goal
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Set Savings Goal</DialogTitle>
                    <DialogDescription>
                      Define your savings target amount
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSetGoal} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="goal">Target Amount ($)</Label>
                      <Input
                        id="goal"
                        type="number"
                        step="0.01"
                        placeholder="50000.00"
                        value={goalAmount || ''}
                        onChange={e =>
                          setGoalAmount(parseFloat(e.target.value) || 0)
                        }
                        required
                      />
                    </div>
                    <DialogFooter className="gap-2 sm:gap-0">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsGoalOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">Save Goal</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              <Dialog
                open={isContributeOpen}
                onOpenChange={setIsContributeOpen}
              >
                <DialogTrigger asChild>
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    <Plus className="mr-2 h-4 w-4" /> Add Savings
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Savings Contribution</DialogTitle>
                    <DialogDescription>
                      Select the month this savings belongs to. It will be
                      deducted from that month's balance.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleContribute} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="contribution">Amount ($)</Label>
                      <Input
                        id="contribution"
                        type="number"
                        step="0.01"
                        placeholder="1000.00"
                        value={contributionAmount || ''}
                        onChange={e =>
                          setContributionAmount(parseFloat(e.target.value) || 0)
                        }
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="month">Month</Label>
                        <select
                          id="month"
                          value={selectedMonth}
                          onChange={e =>
                            setSelectedMonth(parseInt(e.target.value))
                          }
                          className="flex h-11 w-full rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                        >
                          {[
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
                          ].map((month, index) => (
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

                      <div className="space-y-2">
                        <Label htmlFor="year">Year</Label>
                        <select
                          id="year"
                          value={selectedYear}
                          onChange={e =>
                            setSelectedYear(parseInt(e.target.value))
                          }
                          className="flex h-11 w-full rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                        >
                          <option
                            value={currentDate.getFullYear()}
                            className="bg-background text-foreground py-2 px-4 hover:bg-accent"
                            style={{
                              padding: '0.75rem 1rem',
                              fontSize: '0.9375rem',
                              fontWeight: '500',
                            }}
                          >
                            {currentDate.getFullYear()}
                          </option>
                          <option
                            value={currentDate.getFullYear() - 1}
                            className="bg-background text-foreground py-2 px-4 hover:bg-accent"
                            style={{
                              padding: '0.75rem 1rem',
                              fontSize: '0.9375rem',
                              fontWeight: '500',
                            }}
                          >
                            {currentDate.getFullYear() - 1}
                          </option>
                        </select>
                      </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsContributeOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="bg-gradient-to-r from-purple-600 to-pink-600"
                      >
                        Add Savings
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Summary */}
        <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center shadow-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle>Summary</CardTitle>
                <CardDescription>Your savings overview</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <p className="text-sm text-muted-foreground">
                  Total Contributions
                </p>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-1">
                  {savingsContributions.length}
                </p>
                <p className="text-xs text-muted-foreground mt-1">All time</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
                  <PiggyBank className="h-5 w-5 text-green-600 dark:text-green-400 mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">Total Saved</p>
                  <p className="text-sm font-bold text-green-700 dark:text-green-400">
                    ${savingsGoal.currentAmount.toFixed(2)}
                  </p>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
                  <Target className="h-5 w-5 text-blue-600 dark:text-blue-400 mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">Remaining</p>
                  <p className="text-sm font-bold text-blue-700 dark:text-blue-400">
                    $
                    {(
                      savingsGoal.targetAmount - savingsGoal.currentAmount
                    ).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contributions History */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-8 w-1 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
            All Savings Contributions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {savingsContributions.length === 0 ? (
              <div className="text-center py-12">
                <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <PiggyBank className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground font-medium">
                  No savings contributions yet.
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Click "Add Savings" to get started
                </p>
              </div>
            ) : (
              savingsContributions
                .slice()
                .sort(
                  (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                )
                .map(contribution => (
                  <div
                    key={contribution.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center">
                        <PiggyBank className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="font-semibold">Savings Contribution</p>
                        <p className="text-sm text-muted-foreground">
                          {format(
                            new Date(contribution.date),
                            'MMM d, yyyy • h:mm a'
                          )}{' '}
                          •{' '}
                          {format(
                            new Date(contribution.month + '-01'),
                            'MMMM yyyy'
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-lg text-green-600 dark:text-green-400">
                        +${contribution.amount.toFixed(2)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        onClick={() => setContributionToDelete(contribution.id)}
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
        open={!!contributionToDelete}
        onOpenChange={() => setContributionToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Contribution</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this savings contribution? This
              will reduce your total savings and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setContributionToDelete(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (contributionToDelete) {
                  deleteSavingsContribution(contributionToDelete);
                  setContributionToDelete(null);
                }
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Clear All Savings Dialog */}
      <Dialog open={showClearAll} onOpenChange={setShowClearAll}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Clear All Savings
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete ALL {savingsContributions.length}{' '}
              savings contributions? This will reset your total savings to $0.00
              and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <p className="text-sm font-semibold text-red-900 dark:text-red-100">
              You will lose ${savingsGoal.currentAmount.toFixed(2)} in savings
            </p>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowClearAll(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleClearAll}>
              <Trash2 className="mr-2 h-4 w-4" />
              Yes, Clear All Savings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
