import { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Wallet,
  PiggyBank,
  LogOut,
  Menu,
  X,
  User,
  ChevronLeft,
  ChevronRight,
  Sun,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import ThemeSwitch from '@/components/ui/theme-switch';

const Sidebar = ({
  className,
  onClose,
  isCollapsed,
  onToggleCollapse,
}: {
  className?: string;
  onClose?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}) => {
  const { pathname } = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const links = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/expenses', label: 'Expenses', icon: Wallet },
    { href: '/savings', label: 'Savings', icon: PiggyBank },
    { href: '/profile', label: 'Profile', icon: User },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
    setShowLogoutDialog(false);
  };

  return (
    <div
      className={cn(
        'pb-12 min-h-screen border-r bg-gradient-to-b from-card to-muted/20 flex flex-col justify-between transition-all duration-300 relative',
        isCollapsed ? 'w-20' : 'w-64',
        className
      )}
    >
      {/* Toggle Button - Desktop Only */}
      {onToggleCollapse && (
        <button
          onClick={onToggleCollapse}
          className="hidden md:flex absolute -right-3 top-6 h-6 w-6 rounded-full border bg-background shadow-md items-center justify-center hover:bg-accent transition-colors z-10"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      )}

      <div className="space-y-4 py-6">
        {/* Logo/Title */}
        <div className="px-3 py-2">
          <div
            className={cn(
              'mb-6 px-4 flex items-center gap-3 transition-all duration-300',
              isCollapsed && 'justify-center px-0'
            )}
          >
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
              <Wallet className="h-6 w-6 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <h2 className="text-lg font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ExpenseTracker
                </h2>
                <p className="text-xs text-muted-foreground">Manage Finances</p>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <div className="space-y-2">
            {links.map(link => (
              <Link key={link.href} to={link.href} onClick={onClose}>
                <Button
                  variant={pathname === link.href ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full transition-all duration-200 hover:translate-x-1',
                    isCollapsed ? 'justify-center px-2' : 'justify-start',
                    pathname === link.href &&
                      'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-l-4 border-l-blue-600'
                  )}
                  title={isCollapsed ? link.label : undefined}
                >
                  <link.icon
                    className={cn('h-5 w-5', !isCollapsed && 'mr-3')}
                  />
                  {!isCollapsed && <span>{link.label}</span>}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="px-3 py-2 mb-4 space-y-3">
        {/* Theme Toggle */}
        {isCollapsed ? (
          <div className="flex justify-center">
            <ThemeSwitch />
          </div>
        ) : (
          <div className="flex items-center justify-between px-4 py-2 rounded-lg hover:bg-accent/50 transition-colors">
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Appearance</span>
            </div>
            <ThemeSwitch />
          </div>
        )}

        {/* Logout Button */}
        <Button
          variant="ghost"
          className={cn(
            'w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200',
            isCollapsed ? 'justify-center px-2' : 'justify-start'
          )}
          onClick={() => setShowLogoutDialog(true)}
          title={isCollapsed ? 'Logout' : undefined}
        >
          <LogOut className={cn('h-5 w-5', !isCollapsed && 'mr-3')} />
          {!isCollapsed && <span>Logout</span>}
        </Button>
      </div>

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
};

export default function AppLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-background text-foreground">
      {/* Desktop Sidebar */}
      <Sidebar
        className="hidden md:flex shrink-0"
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b bg-card shadow-sm">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
            <Wallet className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ExpenseTracker
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeSwitch />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="fixed inset-y-0 left-0 w-3/4 bg-card shadow-lg z-50 flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <span className="font-bold text-lg">Menu</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X />
              </Button>
            </div>
            <Sidebar
              className="border-none flex-1"
              onClose={() => setIsMobileMenuOpen(false)}
            />
          </div>
          <div
            className="absolute inset-0"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen">
        <div className="max-w-7xl mx-auto pb-20 md:pb-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
