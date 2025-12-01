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
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import { Plus, Target } from 'lucide-react';

export default function Savings() {
  const {
    savingsGoal,
    setSavingsGoal,
    addSavingsContribution,
    savingsContributions,
  } = useStore();
  const [isGoalOpen, setIsGoalOpen] = useState(false);
  const [isContributeOpen, setIsContributeOpen] = useState(false);
  const [goalAmount, setGoalAmount] = useState(savingsGoal.targetAmount);
  const [contributionAmount, setContributionAmount] = useState(0);

  const handleSetGoal = (e: React.FormEvent) => {
    e.preventDefault();
    setSavingsGoal(goalAmount);
    setIsGoalOpen(false);
  };

  const handleContribute = (e: React.FormEvent) => {
    e.preventDefault();
    addSavingsContribution(contributionAmount);
    setIsContributeOpen(false);
    setContributionAmount(0);
  };

  const progress =
    savingsGoal.targetAmount > 0
      ? Math.min(
          (savingsGoal.currentAmount / savingsGoal.targetAmount) * 100,
          100
        )
      : 0;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Savings</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Savings Goal</CardTitle>
            <CardDescription>
              Track your progress towards your target.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Current: ${savingsGoal.currentAmount.toFixed(2)}</span>
              <span>Target: ${savingsGoal.targetAmount.toFixed(2)}</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex gap-2">
              <Dialog open={isGoalOpen} onOpenChange={setIsGoalOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Target className="mr-2 h-4 w-4" /> Set Goal
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Set Savings Goal</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSetGoal} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="goal">Target Amount</Label>
                      <Input
                        id="goal"
                        type="number"
                        value={goalAmount}
                        onChange={e =>
                          setGoalAmount(parseFloat(e.target.value))
                        }
                        required
                      />
                    </div>
                    <DialogFooter>
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
                  <Button className="w-full">
                    <Plus className="mr-2 h-4 w-4" /> Add Savings
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Contribution</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleContribute} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="contribution">Amount</Label>
                      <Input
                        id="contribution"
                        type="number"
                        value={contributionAmount}
                        onChange={e =>
                          setContributionAmount(parseFloat(e.target.value))
                        }
                        required
                      />
                    </div>
                    <DialogFooter>
                      <Button type="submit">Add Savings</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Contributions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {savingsContributions.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  No contributions yet.
                </p>
              ) : (
                savingsContributions
                  .slice()
                  .reverse()
                  .slice(0, 5)
                  .map(contribution => (
                    <div
                      key={contribution.id}
                      className="flex items-center justify-between p-2 border-b last:border-0"
                    >
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(contribution.date), 'MMM d, yyyy')}
                      </span>
                      <span className="font-bold text-green-500">
                        +${contribution.amount.toFixed(2)}
                      </span>
                    </div>
                  ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
