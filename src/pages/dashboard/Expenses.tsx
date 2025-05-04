import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getUserExpenses, Expense, addExpense, updateExpense, deleteExpense } from '../../firebase/expenses';
import ExpenseList from '../../components/ui/ExpenseList';
import ExpenseForm, { ExpenseFormData } from '../../components/ui/ExpenseForm';
import { format } from 'date-fns';

const Expenses: React.FC = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Load user expenses
  useEffect(() => {
    const loadExpenses = async () => {
      if (user) {
        try {
          setIsLoading(true);
          const userExpenses = await getUserExpenses(user.uid);
          setExpenses(userExpenses);
        } catch (error) {
          console.error('Error loading expenses:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadExpenses();
  }, [user]);

  // Handle adding a new expense
  const handleAddExpense = async (data: ExpenseFormData) => {
    if (!user) return;
    
    try {
      setIsSubmitting(true);
      
      // Convert form data to Expense type
      const newExpense = {
        userId: user.uid,
        amount: data.amount,
        category: data.category,
        description: data.description,
        date: new Date(data.date),
      };
      
      // Add expense to Firestore
      await addExpense(newExpense);
      
      // Refresh expenses
      const userExpenses = await getUserExpenses(user.uid);
      setExpenses(userExpenses);
      
      // Close the form
      setShowForm(false);
    } catch (error) {
      console.error('Error adding expense:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle updating an expense
  const handleUpdateExpense = async (data: ExpenseFormData) => {
    if (!user || !editingExpense?.id) return;
    
    try {
      setIsSubmitting(true);
      
      // Convert form data to Expense type
      const updatedExpense = {
        amount: data.amount,
        category: data.category,
        description: data.description,
        date: new Date(data.date),
      };
      
      // Update expense in Firestore
      await updateExpense(editingExpense.id, updatedExpense);
      
      // Refresh expenses
      const userExpenses = await getUserExpenses(user.uid);
      setExpenses(userExpenses);
      
      // Close the form and reset editing state
      setShowForm(false);
      setEditingExpense(null);
    } catch (error) {
      console.error('Error updating expense:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle deleting an expense
  const handleDeleteExpense = async (id: string) => {
    if (!user) return;
    
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await deleteExpense(id);
        
        // Refresh expenses
        const userExpenses = await getUserExpenses(user.uid);
        setExpenses(userExpenses);
      } catch (error) {
        console.error('Error deleting expense:', error);
      }
    }
  };

  // Handle edit button click
  const handleEditClick = (expense: Expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  // Format date for form initial value
  const formatDateForInput = (date: any): string => {
    if (!date) return '';
    
    try {
      // If it's a Firebase Timestamp
      if (date.toDate) {
        return format(date.toDate(), 'yyyy-MM-dd');
      }
      
      // If it's a JavaScript Date
      if (date instanceof Date) {
        return format(date, 'yyyy-MM-dd');
      }
      
      return '';
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  // Get initial form data for editing
  const getInitialFormData = (): Partial<ExpenseFormData> => {
    if (!editingExpense) return {};
    
    return {
      amount: editingExpense.amount,
      category: editingExpense.category,
      description: editingExpense.description,
      date: formatDateForInput(editingExpense.date),
    };
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
          <p className="text-gray-600">Manage and track your expenses</p>
        </div>
        <button
          onClick={() => {
            setEditingExpense(null);
            setShowForm(!showForm);
          }}
          className="mt-4 md:mt-0 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          {showForm && !editingExpense ? 'Cancel' : 'Add Expense'}
        </button>
      </div>

      {/* Form for adding/editing expense */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 animate-slideUp">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {editingExpense ? 'Edit Expense' : 'Add New Expense'}
          </h2>
          <ExpenseForm 
            onSubmit={editingExpense ? handleUpdateExpense : handleAddExpense} 
            initialData={getInitialFormData()}
            isEditing={!!editingExpense}
          />
        </div>
      )}

      {/* Expenses List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">All Expenses</h2>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <ExpenseList 
            expenses={expenses} 
            onEdit={handleEditClick} 
            onDelete={handleDeleteExpense} 
          />
        )}
      </div>
    </div>
  );
};

export default Expenses;