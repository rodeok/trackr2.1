import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getUserExpenses, Expense } from '../../firebase/expenses';
import ExpenseChart from '../../components/ui/ExpenseChart';
import { 
  BarChart4, 
  PieChart, 
  LineChart, 
  CalendarRange, 
  Filter
} from 'lucide-react';
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

const Reports: React.FC = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [timeRange, setTimeRange] = useState<string>('thisMonth');
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Get all categories from expenses
  const getCategories = () => {
    const categories = new Set<string>();
    expenses.forEach(expense => {
      categories.add(expense.category);
    });
    return ['all', ...Array.from(categories)];
  };

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

  // Apply filters when expenses, timeRange, or categoryFilter changes
  useEffect(() => {
    if (!expenses.length) {
      setFilteredExpenses([]);
      return;
    }

    let filtered = [...expenses];

    // Apply time range filter
    const now = new Date();
    let startDate: Date;
    let endDate: Date = now;

    switch (timeRange) {
      case 'thisMonth':
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
        break;
      case 'lastMonth':
        startDate = startOfMonth(subMonths(now, 1));
        endDate = endOfMonth(subMonths(now, 1));
        break;
      case 'last3Months':
        startDate = startOfMonth(subMonths(now, 3));
        break;
      case 'last6Months':
        startDate = startOfMonth(subMonths(now, 6));
        break;
      default:
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
    }

    filtered = filtered.filter(expense => {
      if (!expense.date) return false;
      
      // Convert Firebase Timestamp to Date if needed
      const expenseDate = expense.date.toDate ? expense.date.toDate() : expense.date;
      
      return isWithinInterval(expenseDate, { start: startDate, end: endDate });
    });

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(expense => expense.category === categoryFilter);
    }

    setFilteredExpenses(filtered);
  }, [expenses, timeRange, categoryFilter]);

  // Calculate summary data
  const calculateSummary = () => {
    if (!filteredExpenses.length) {
      return {
        totalSpent: 0,
        avgExpense: 0,
        numTransactions: 0
      };
    }

    const totalSpent = filteredExpenses.reduce((total, expense) => total + expense.amount, 0);
    const avgExpense = totalSpent / filteredExpenses.length;
    const numTransactions = filteredExpenses.length;

    return {
      totalSpent,
      avgExpense,
      numTransactions
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

  // Get time range label for display
  const getTimeRangeLabel = () => {
    const now = new Date();
    
    switch (timeRange) {
      case 'thisMonth':
        return format(now, 'MMMM yyyy');
      case 'lastMonth':
        return format(subMonths(now, 1), 'MMMM yyyy');
      case 'last3Months':
        return `Last 3 Months (${format(subMonths(now, 3), 'MMM yyyy')} - ${format(now, 'MMM yyyy')})`;
      case 'last6Months':
        return `Last 6 Months (${format(subMonths(now, 6), 'MMM yyyy')} - ${format(now, 'MMM yyyy')})`;
      default:
        return format(now, 'MMMM yyyy');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600">Analyze your spending patterns</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 md:mb-0">Filters</h2>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <CalendarRange size={18} className="text-gray-500" />
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="thisMonth">This Month</option>
                <option value="lastMonth">Last Month</option>
                <option value="last3Months">Last 3 Months</option>
                <option value="last6Months">Last 6 Months</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter size={18} className="text-gray-500" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {getCategories().map((category) => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <PieChart size={18} className="text-gray-500" />
              <select
                value={chartType}
                onChange={(e) => setChartType(e.target.value as 'pie' | 'bar')}
                className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="pie">Pie Chart</option>
                <option value="bar">Bar Chart</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Spent</h3>
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(summary.totalSpent)}</p>
          <p className="text-sm text-gray-500 mt-2">{getTimeRangeLabel()}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Average Expense</h3>
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(summary.avgExpense)}</p>
          <p className="text-sm text-gray-500 mt-2">Per transaction</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Transactions</h3>
          <p className="text-3xl font-bold text-gray-900">{summary.numTransactions}</p>
          <p className="text-sm text-gray-500 mt-2">{getTimeRangeLabel()}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Expense {chartType === 'pie' ? 'by Category' : 'Breakdown'}
          </h2>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-80">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredExpenses.length > 0 ? (
          <div className="h-80">
            <ExpenseChart expenses={filteredExpenses} type={chartType} />
          </div>
        ) : (
          <div className="flex justify-center items-center h-80">
            <p className="text-gray-500">No expenses found for the selected filters.</p>
          </div>
        )}
      </div>

      {/* Detailed breakdown */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Expense Details</h2>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredExpenses.length > 0 ? (
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
                {filteredExpenses.map((expense) => {
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
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan={3} className="px-6 py-3 text-right text-sm font-medium text-gray-500">
                    Total
                  </td>
                  <td className="px-6 py-3 text-sm font-medium text-gray-900">
                    {formatCurrency(summary.totalSpent)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">No expenses found for the selected filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;