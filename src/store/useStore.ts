import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string; // ISO string
}

export interface Income {
  id: string;
  amount: number;
  source: string;
  description: string;
  date: string; // ISO string
  month: string; // Format: "YYYY-MM"
}

export interface SavingsGoal {
  targetAmount: number;
  currentAmount: number;
}

export interface SavingsContribution {
  id: string;
  amount: number;
  date: string;
  month: string; // Format: "YYYY-MM"
}

interface AppState {
  monthlyIncome: number;
  setMonthlyIncome: (amount: number) => void;

  incomes: Income[];
  addIncome: (income: Omit<Income, 'id' | 'month'>) => void;
  deleteIncome: (id: string) => void;
  getIncomeForMonth: (month: string) => number;

  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;
  editExpense: (id: string, updatedExpense: Partial<Expense>) => void;

  savingsGoal: SavingsGoal;
  setSavingsGoal: (goal: number) => void;

  savingsContributions: SavingsContribution[];
  addSavingsContribution: (amount: number, month: string, date: string) => void;
  deleteSavingsContribution: (id: string) => void;
  getSavingsForMonth: (month: string) => number;
}

export const useStore = create<AppState>()(
  persist(
    set => ({
      monthlyIncome: 0,
      setMonthlyIncome: amount => set({ monthlyIncome: amount }),

      incomes: [],
      addIncome: income => {
        const date = new Date(income.date);
        const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        set(state => ({
          incomes: [
            ...state.incomes,
            { ...income, id: crypto.randomUUID(), month },
          ],
        }));
      },
      deleteIncome: id =>
        set(state => ({
          incomes: state.incomes.filter(i => i.id !== id),
        })),
      getIncomeForMonth: (month: string) => {
        const state = useStore.getState() as AppState;
        return state.incomes
          .filter(income => income.month === month)
          .reduce((total, income) => total + income.amount, 0);
      },

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
      addSavingsContribution: (amount, month, date) => {
        set(state => ({
          savingsContributions: [
            ...state.savingsContributions,
            { id: crypto.randomUUID(), amount, date, month },
          ],
          savingsGoal: {
            ...state.savingsGoal,
            currentAmount: state.savingsGoal.currentAmount + amount,
          },
        }));
      },
      deleteSavingsContribution: id =>
        set(state => {
          const contribution = state.savingsContributions.find(
            c => c.id === id
          );
          return {
            savingsContributions: state.savingsContributions.filter(
              c => c.id !== id
            ),
            savingsGoal: {
              ...state.savingsGoal,
              currentAmount:
                state.savingsGoal.currentAmount - (contribution?.amount || 0),
            },
          };
        }),
      getSavingsForMonth: (month: string) => {
        const state = useStore.getState() as AppState;
        return state.savingsContributions
          .filter(contribution => contribution.month === month)
          .reduce((total, contribution) => total + contribution.amount, 0);
      },
    }),
    {
      name: 'expense-tracker-storage',
    }
  )
);
