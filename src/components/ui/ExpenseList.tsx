import React from 'react';
import { format, parseISO } from 'date-fns';
import { Edit, Trash2 } from 'lucide-react';
import { Expense } from '../../firebase/expenses';

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onEdit, onDelete }) => {
  if (expenses.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No expenses yet. Add your first expense!</p>
      </div>
    );
  }

  const getCategoryColor = (category: string): string => {
    const colorMap: Record<string, string> = {
      'Food': 'bg-red-100 text-red-800',
      'Shopping': 'bg-blue-100 text-blue-800',
      'Transportation': 'bg-green-100 text-green-800',
      'Entertainment': 'bg-purple-100 text-purple-800',
      'Housing': 'bg-yellow-100 text-yellow-800',
      'Utilities': 'bg-indigo-100 text-indigo-800',
      'Healthcare': 'bg-pink-100 text-pink-800',
      'Education': 'bg-teal-100 text-teal-800',
      'Travel': 'bg-orange-100 text-orange-800',
    };

    return colorMap[category] || 'bg-gray-100 text-gray-800';
  };

  // Format date from Firebase Timestamp or Date
  const formatDate = (date: any) => {
    if (!date) return '';
    
    // If it's a Firebase Timestamp
    if (date.toDate) {
      return format(date.toDate(), 'MMM dd, yyyy');
    }
    
    // If it's a ISO string
    if (typeof date === 'string') {
      return format(parseISO(date), 'MMM dd, yyyy');
    }
    
    // If it's a JavaScript Date
    if (date instanceof Date) {
      return format(date, 'MMM dd, yyyy');
    }
    
    return '';
  };

  return (
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
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {expenses.map((expense) => (
            <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(expense.date)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {expense.description}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getCategoryColor(expense.category)}`}>
                  {expense.category}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                ${expense.amount.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button 
                  onClick={() => onEdit(expense)}
                  className="text-primary-600 hover:text-primary-900 mr-4"
                >
                  <Edit size={16} />
                </button>
                <button 
                  onClick={() => onDelete(expense.id!)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseList;