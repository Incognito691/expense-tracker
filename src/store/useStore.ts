import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string; // ISO string
}

export interface SavingsGoal {
  targetAmount: number;
  currentAmount: number;
}

export interface SavingsContribution {
  id: string;
  amount: number;
  date: string;
}

interface AppState {
  monthlyIncome: number;
  setMonthlyIncome: (amount: number) => void;

  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;
  editExpense: (id: string, updatedExpense: Partial<Expense>) => void;

  savingsGoal: SavingsGoal;
  setSavingsGoal: (goal: number) => void;

  savingsContributions: SavingsContribution[];
  addSavingsContribution: (amount: number) => void;
}

export const useStore = create<AppState>()(
  persist(
    set => ({
      monthlyIncome: 0,
      setMonthlyIncome: amount => set({ monthlyIncome: amount }),

      expenses: [],
      addExpense: expense =>
        set(state => ({
          expenses: [
            ...state.expenses,
            { ...expense, id: crypto.randomUUID() },
          ],
        })),
      deleteExpense: id =>
        set(state => ({
          expenses: state.expenses.filter(e => e.id !== id),
        })),
      editExpense: (id, updatedExpense) =>
        set(state => ({
          expenses: state.expenses.map(e =>
            e.id === id ? { ...e, ...updatedExpense } : e
          ),
        })),

      savingsGoal: { targetAmount: 0, currentAmount: 0 },
      setSavingsGoal: goal =>
        set(state => ({
          savingsGoal: { ...state.savingsGoal, targetAmount: goal },
        })),

      savingsContributions: [],
      addSavingsContribution: amount =>
        set(state => ({
          savingsContributions: [
            ...state.savingsContributions,
            { id: crypto.randomUUID(), amount, date: new Date().toISOString() },
          ],
          savingsGoal: {
            ...state.savingsGoal,
            currentAmount: state.savingsGoal.currentAmount + amount,
          },
        })),
    }),
    {
      name: 'expense-tracker-storage',
    }
  )
);
