import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Plus, TrendingUp, TrendingDown, Wallet, DollarSign } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getUserExpenses, Expense } from '../../firebase/expenses';
import ExpenseChart from '../../components/ui/ExpenseChart';
import ExpenseForm, { ExpenseFormData } from '../../components/ui/ExpenseForm';
import { addExpense } from '../../firebase/expenses';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showAddExpense, setShowAddExpense] = useState<boolean>(false);
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

  // Calculate summary data
  const calculateSummary = () => {
    if (!expenses.length) {
      return {
        totalSpent: 0,
        avgPerDay: 0,
        highestExpense: 0,
        recentExpense: 0,
      };
    }

    const totalSpent = expenses.reduce((total, expense) => total + expense.amount, 0);
    const avgPerDay = totalSpent / 30; // Assuming monthly view
    const highestExpense = Math.max(...expenses.map(expense => expense.amount));
    const recentExpense = expenses[0]?.amount || 0; // Assuming sorted by date desc

    return {
      totalSpent,
      avgPerDay,
      highestExpense,
      recentExpense,
    };
  };

  const summary = calculateSummary();

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

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
      setShowAddExpense(false);
    } catch (error) {
      console.error('Error adding expense:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentDate = format(new Date(), 'MMMM yyyy');

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">{currentDate}</p>
        </div>
        <button
          onClick={() => setShowAddExpense(!showAddExpense)}
          className="mt-4 md:mt-0 flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus size={18} className="mr-2" />
          Add Expense
        </button>
      </div>

      {showAddExpense && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 animate-slideUp">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Expense</h2>
          <ExpenseForm onSubmit={handleAddExpense} />
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
          <div className="bg-primary-100 p-3 rounded-full mr-4">
            <Wallet className="text-primary-600" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Spent</p>
            <p className="text-xl font-semibold text-gray-800">{formatCurrency(summary.totalSpent)}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
          <div className="bg-secondary-100 p-3 rounded-full mr-4">
            <DollarSign className="text-secondary-600" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Average per day</p>
            <p className="text-xl font-semibold text-gray-800">{formatCurrency(summary.avgPerDay)}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
          <div className="bg-accent-100 p-3 rounded-full mr-4">
            <TrendingUp className="text-accent-600" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Highest Expense</p>
            <p className="text-xl font-semibold text-gray-800">{formatCurrency(summary.highestExpense)}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
          <div className="bg-purple-100 p-3 rounded-full mr-4">
            <TrendingDown className="text-purple-600" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Recent Expense</p>
            <p className="text-xl font-semibold text-gray-800">{formatCurrency(summary.recentExpense)}</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Expense by Category</h2>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <ExpenseChart expenses={expenses} type="pie" />
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Expense Breakdown</h2>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <ExpenseChart expenses={expenses} type="bar" />
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Transactions</h2>
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : expenses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {expenses.slice(0, 5).map((expense) => {
                  // Format date from Firebase Timestamp or Date
                  let formattedDate = '';
                  if (expense.date) {
                    if (expense.date.toDate) { // Firebase Timestamp
                      formattedDate = format(expense.date.toDate(), 'MMM dd, yyyy');
                    } else if (expense.date instanceof Date) { // JavaScript Date
                      formattedDate = format(expense.date, 'MMM dd, yyyy');
                    }
                  }
                  
                  return (
                    <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formattedDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {expense.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-100 text-primary-800">
                          {expense.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(expense.amount)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">No expenses recorded yet. Start by adding your first expense!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;