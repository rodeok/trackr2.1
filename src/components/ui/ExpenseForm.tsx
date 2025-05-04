import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { format } from 'date-fns';
import { getExpenseCategories } from '../../firebase/expenses';

interface ExpenseFormProps {
  onSubmit: (data: ExpenseFormData) => void;
  initialData?: Partial<ExpenseFormData>;
  isEditing?: boolean;
}

export interface ExpenseFormData {
  amount: number;
  category: string;
  description: string;
  date: string;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ 
  onSubmit, 
  initialData = {}, 
  isEditing = false 
}) => {
  const categories = getExpenseCategories();
  const today = format(new Date(), 'yyyy-MM-dd');
  
  const { 
    register, 
    handleSubmit, 
    control,
    formState: { errors, isSubmitting }
  } = useForm<ExpenseFormData>({
    defaultValues: {
      amount: initialData.amount || 0,
      category: initialData.category || categories[0],
      description: initialData.description || '',
      date: initialData.date || today,
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
          Amount
        </label>
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">$</span>
          </div>
          <input
            type="number"
            id="amount"
            step="0.01"
            className={`block w-full pl-7 pr-12 py-2 rounded-md border ${
              errors.amount ? 'border-red-300' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
            placeholder="0.00"
            {...register('amount', { 
              required: 'Amount is required',
              min: { value: 0.01, message: 'Amount must be greater than 0' },
              valueAsNumber: true,
            })}
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">USD</span>
          </div>
        </div>
        {errors.amount && (
          <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <Controller
          control={control}
          name="category"
          rules={{ required: 'Category is required' }}
          render={({ field }) => (
            <select
              id="category"
              className={`block w-full px-3 py-2 rounded-md border ${
                errors.category ? 'border-red-300' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
              {...field}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          )}
        />
        {errors.category && (
          <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <input
          type="text"
          id="description"
          className={`block w-full px-3 py-2 rounded-md border ${
            errors.description ? 'border-red-300' : 'border-gray-300'
          } focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
          placeholder="What did you spend on?"
          {...register('description', { 
            required: 'Description is required',
            maxLength: { value: 100, message: 'Description is too long' }
          })}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
          Date
        </label>
        <input
          type="date"
          id="date"
          className={`block w-full px-3 py-2 rounded-md border ${
            errors.date ? 'border-red-300' : 'border-gray-300'
          } focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
          {...register('date', { required: 'Date is required' })}
        />
        {errors.date && (
          <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
        )}
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            isEditing ? 'Update Expense' : 'Add Expense'
          )}
        </button>
      </div>
    </form>
  );
};

export default ExpenseForm;