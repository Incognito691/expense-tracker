import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface MonthSelectorProps {
  selectedMonth: string; // Format: "YYYY-MM"
  onMonthChange: (month: string) => void;
}

export default function MonthSelector({
  selectedMonth,
  onMonthChange,
}: MonthSelectorProps) {
  const currentDate = new Date();
  const [year, month] = selectedMonth.split('-').map(Number);
  const selectedDate = new Date(year, month - 1);

  const handlePrevMonth = () => {
    const newDate = new Date(year, month - 2); // month - 1 for 0-index, -1 more for previous
    const newMonth = `${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, '0')}`;
    onMonthChange(newMonth);
  };

  const handleNextMonth = () => {
    const newDate = new Date(year, month); // month - 1 + 1 = month
    const newMonth = `${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, '0')}`;
    onMonthChange(newMonth);
  };

  const handleCurrentMonth = () => {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    onMonthChange(currentMonth);
  };

  const isCurrentMonth =
    selectedMonth ===
    `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={handlePrevMonth}
        className="h-9 w-9"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="flex items-center gap-2 min-w-[180px] justify-center">
        <span className="text-lg font-semibold">
          {format(selectedDate, 'MMMM yyyy')}
        </span>
        {!isCurrentMonth && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCurrentMonth}
            className="h-7 text-xs"
          >
            Today
          </Button>
        )}
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={handleNextMonth}
        className="h-9 w-9"
        disabled={isCurrentMonth}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
