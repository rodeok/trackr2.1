import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from './config';

export interface Expense {
  id?: string;
  userId: string;
  amount: number;
  category: string;
  description: string;
  date: Date | Timestamp;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Add a new expense
export const addExpense = async (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const expenseData = {
      ...expense,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    const docRef = await addDoc(collection(db, 'expenses'), expenseData);
    return { id: docRef.id, ...expenseData };
  } catch (error) {
    console.error("Error adding expense:", error);
    throw error;
  }
};

// Update an expense
export const updateExpense = async (id: string, expenseData: Partial<Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>>) => {
  try {
    const expenseRef = doc(db, 'expenses', id);
    await updateDoc(expenseRef, {
      ...expenseData,
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error("Error updating expense:", error);
    throw error;
  }
};

// Delete an expense
export const deleteExpense = async (id: string) => {
  try {
    const expenseRef = doc(db, 'expenses', id);
    await deleteDoc(expenseRef);
    return true;
  } catch (error) {
    console.error("Error deleting expense:", error);
    throw error;
  }
};

// Get all expenses for a user
export const getUserExpenses = async (userId: string) => {
  try {
    const q = query(
      collection(db, 'expenses'),
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const expenses: Expense[] = [];
    
    querySnapshot.forEach((doc) => {
      expenses.push({ id: doc.id, ...doc.data() } as Expense);
    });
    
    return expenses;
  } catch (error) {
    console.error("Error getting expenses:", error);
    throw error;
  }
};

// Get expense by ID
export const getExpenseById = async (id: string) => {
  try {
    const expenseRef = doc(db, 'expenses', id);
    const expenseSnap = await getDoc(expenseRef);
    
    if (expenseSnap.exists()) {
      return { id: expenseSnap.id, ...expenseSnap.data() } as Expense;
    }
    
    return null;
  } catch (error) {
    console.error("Error getting expense:", error);
    throw error;
  }
};

// Get expense categories
export const getExpenseCategories = () => {
  return [
    'Food', 
    'Shopping', 
    'Transportation', 
    'Entertainment', 
    'Housing', 
    'Utilities', 
    'Healthcare', 
    'Education', 
    'Travel', 
    'Other'
  ];
};