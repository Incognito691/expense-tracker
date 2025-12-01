import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useStore } from '@/store/useStore';
import { getUser, StoredUser } from '@/lib/userStorage';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  User,
  Mail,
  LogOut,
  Shield,
  Wallet,
  TrendingDown,
  PiggyBank,
  Calendar,
  DollarSign,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, logout } = useAuth();
  const { expenses, incomes, savingsGoal } = useStore();
  const navigate = useNavigate();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [storedUser, setStoredUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    if (user?.email) {
      const userData = getUser(user.email);
      setStoredUser(userData || null);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const totalIncome = incomes.reduce((acc, curr) => acc + curr.amount, 0);
  const accountAge = storedUser?.createdAt
    ? Math.floor(
        (Date.now() - new Date(storedUser.createdAt).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  return (
    <div className="space-y-6 max-w-6xl pb-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
          Profile
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your account settings and view your financial statistics
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* User Information */}
        <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Your account details</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="flex items-center gap-2 text-sm font-medium"
              >
                <User className="h-4 w-4 text-purple-600" />
                Full Name
              </Label>
              <Input
                id="name"
                value={user?.name || ''}
                disabled
                className="bg-muted/50 font-medium"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="flex items-center gap-2 text-sm font-medium"
              >
                <Mail className="h-4 w-4 text-purple-600" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={user?.email || ''}
                disabled
                className="bg-muted/50 font-medium"
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Calendar className="h-4 w-4 text-purple-600" />
                Member Since
              </Label>
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <p className="text-sm font-semibold">
                  {storedUser?.createdAt
                    ? new Date(storedUser.createdAt).toLocaleDateString(
                        'en-US',
                        {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        }
                      )
                    : new Date().toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {accountAge} {accountAge === 1 ? 'day' : 'days'} ago
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center shadow-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle>Security</CardTitle>
                <CardDescription>Account security status</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <Shield className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-green-900 dark:text-green-100">
                    OTP Verification Active
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                    Your account is secured with email OTP verification
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">Status</p>
                  <p className="text-sm font-bold text-blue-700 dark:text-blue-400 mt-1">
                    Verified
                  </p>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">
                    Security Level
                  </p>
                  <p className="text-sm font-bold text-purple-700 dark:text-purple-400 mt-1">
                    High
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => setShowLogoutDialog(true)}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout from Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Statistics */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
            <div>
              <CardTitle>Financial Overview</CardTitle>
              <CardDescription>
                Your expense tracking statistics
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 bg-green-100 dark:bg-green-900/40 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Income
                </p>
              </div>
              <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                $
                {totalIncome.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                })}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {incomes.length} {incomes.length === 1 ? 'entry' : 'entries'}
              </p>
            </div>

            <div className="p-5 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl border border-red-200 dark:border-red-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 bg-red-100 dark:bg-red-900/40 rounded-lg flex items-center justify-center">
                  <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Expenses
                </p>
              </div>
              <p className="text-2xl font-bold text-red-700 dark:text-red-400">
                $
                {totalExpenses.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                })}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {expenses.length}{' '}
                {expenses.length === 1 ? 'transaction' : 'transactions'}
              </p>
            </div>

            <div className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 bg-purple-100 dark:bg-purple-900/40 rounded-lg flex items-center justify-center">
                  <PiggyBank className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  Savings Goal
                </p>
              </div>
              <p className="text-2xl font-bold text-purple-700 dark:text-purple-400">
                $
                {savingsGoal.targetAmount.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                })}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                ${savingsGoal.currentAmount.toFixed(2)} saved
              </p>
            </div>

            <div className="p-5 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center">
                  <Wallet className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  Net Balance
                </p>
              </div>
              <p
                className={`text-2xl font-bold ${
                  totalIncome - totalExpenses >= 0
                    ? 'text-blue-700 dark:text-blue-400'
                    : 'text-red-700 dark:text-red-400'
                }`}
              >
                $
                {Math.abs(totalIncome - totalExpenses).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                })}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {totalIncome - totalExpenses >= 0 ? 'Surplus' : 'Deficit'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logout Confirmation Dialog */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to logout? You'll need to sign in again to
              access your account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowLogoutDialog(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Yes, Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
