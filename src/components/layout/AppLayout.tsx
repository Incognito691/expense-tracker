import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Wallet,
  PiggyBank,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

const Sidebar = ({
  className,
  onClose,
}: {
  className?: string;
  onClose?: () => void;
}) => {
  const { pathname } = useLocation();
  const { logout } = useAuth();

  const links = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/expenses', label: 'Expenses', icon: Wallet },
    { href: '/savings', label: 'Savings', icon: PiggyBank },
  ];

  return (
    <div
      className={cn(
        'pb-12 min-h-screen border-r bg-card flex flex-col justify-between',
        className
      )}
    >
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            ExpenseTracker
          </h2>
          <div className="space-y-1">
            {links.map(link => (
              <Link key={link.href} to={link.href} onClick={onClose}>
                <Button
                  variant={pathname === link.href ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                >
                  <link.icon className="mr-2 h-4 w-4" />
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="px-3 py-2 mb-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20"
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default function AppLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-background text-foreground">
      {/* Desktop Sidebar */}
      <Sidebar className="hidden md:flex w-64 shrink-0" />

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b bg-card">
        <span className="font-bold text-lg">ExpenseTracker</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </Button>
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
        <div className="max-w-5xl mx-auto pb-20 md:pb-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
