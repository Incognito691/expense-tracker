// Simple user storage for demo (in production, use a real database)
const USERS_KEY = 'expense-tracker-users';

export interface StoredUser {
  email: string;
  name: string;
  createdAt: string;
}

export const saveUser = (email: string, name: string) => {
  const users = getUsers();
  const existingUser = users.find(u => u.email === email);

  if (!existingUser) {
    users.push({
      email,
      name,
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
};

export const userExists = (email: string): boolean => {
  const users = getUsers();
  return users.some(u => u.email === email);
};

export const getUser = (email: string): StoredUser | undefined => {
  const users = getUsers();
  return users.find(u => u.email === email);
};

const getUsers = (): StoredUser[] => {
  const stored = localStorage.getItem(USERS_KEY);
  return stored ? JSON.parse(stored) : [];
};
