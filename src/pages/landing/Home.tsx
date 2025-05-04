import React from 'react';
import { Link } from 'react-router-dom';
import { PieChart, BarChartBig, Settings, CreditCard, TrendingUp, LineChart, Shield, Fingerprint } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-20 lg:pt-28 lg:pb-28 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-900 text-white">
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="h-full w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiPjxwYXRoIGQ9Ik0zNiAxOGMxLjIgMCAyLjEgMS4xIDIuMSAyLjNWNDJjMCAxLjItLjkgMi4zLTIuMSAyLjNIMjRjLTEuMiAwLTIuMS0xLjEtMi4xLTIuM1YyMC4zYzAtMS4yLjktMi4zIDIuMS0yLjNoMTJ6TTI0IDE1Yy0yLjggMC01LjEgMi40LTUuMSA1LjNWNDJjMCAyLjkgMi4zIDUuMyA1LjEgNS4zaDEyYzIuOCAwIDUuMS0yLjQgNS4xLTUuM1YyMC4zYzAtMi45LTIuMy01LjMtNS4xLTUuM0gyNHoiLz48cGF0aCBkPSJNNTQgMThjMS4xIDAgMiAuOSAyIDJWNDJjMCAxLjEtLjkgMi0yIDJINDJjLTEuMSAwLTItLjktMi0yVjIwYzAtMS4xLjktMiAyLTJoMTJ6bTAtM0g0MmMtMi44IDAtNSAyLjItNSA1VjQyYzAgMi44IDIuMiA1IDUgNWgxMmMyLjggMCA1LTIuMiA1LTVWMjBjMC0yLjgtMi4yLTUtNS01ek0xOCAxOGMxLjEgMCAyIC45IDIgMlY0MmMwIDEuMS0uOSAyLTIgMkg2Yy0xLjEgMC0yLS45LTItMlYyMGMwLTEuMS45LTIgMi0yaDF6bTAtM0g2Yy0yLjggMC01IDIuMi01IDVWNDJjMCAyLjggMi4yIDUgNSA1aDEyYzIuOCAwIDUtMi4yIDUtNVYyMGMwLTIuOC0yLjItNS01LTV6Ii8+PC9nPjwvZz48L3N2Zz4=')] repeat"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-10 lg:mb-0">
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Take Control of Your <span className="text-accent-400">Financial Future</span>
              </h1>
              <p className="text-xl mb-8 text-white/90 max-w-lg">
                Track your expenses, visualize spending patterns, and make smarter financial decisions with our intuitive expense tracker.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  to={user ? "/dashboard" : "/signup"}
                  className="px-8 py-3 bg-white text-primary-700 rounded-lg font-medium hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl"
                >
                  {user ? "Go to Dashboard" : "Get Started"}
                </Link>
                <Link
                  to="/features"
                  className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-medium hover:bg-white/10 transition-colors"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2 flex justify-center lg:justify-end">
              <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md transform rotate-2 transition-transform hover:rotate-0 duration-300">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">Monthly Overview</h3>
                  <div className="text-sm text-gray-500">April 2025</div>
                </div>
                <div className="bg-gray-100 rounded-lg p-4 mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Total Spent</span>
                    <span className="font-semibold text-gray-800">$2,450.85</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Budget</span>
                    <span className="font-semibold text-gray-800">$3,000.00</span>
                  </div>
                  <div className="mt-4 h-3 bg-gray-300 rounded-full">
                    <div className="h-full w-4/5 bg-primary-500 rounded-full"></div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                    <div className="bg-purple-100 p-2 rounded-md mr-3">
                      <CreditCard className="text-primary-600" size={20} />
                    </div>
                    <div className="flex-grow">
                      <div className="text-sm text-gray-600">Groceries</div>
                      <div className="text-gray-800 font-medium">$350.50</div>
                    </div>
                    <div className="text-xs font-medium px-2 py-1 bg-primary-100 text-primary-700 rounded-full">
                      14.3%
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-teal-50 rounded-lg">
                    <div className="bg-teal-100 p-2 rounded-md mr-3">
                      <Settings className="text-teal-600" size={20} />
                    </div>
                    <div className="flex-grow">
                      <div className="text-sm text-gray-600">Utilities</div>
                      <div className="text-gray-800 font-medium">$245.80</div>
                    </div>
                    <div className="text-xs font-medium px-2 py-1 bg-teal-100 text-teal-700 rounded-full">
                      10.0%
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-amber-50 rounded-lg">
                    <div className="bg-amber-100 p-2 rounded-md mr-3">
                      <TrendingUp className="text-amber-600" size={20} />
                    </div>
                    <div className="flex-grow">
                      <div className="text-sm text-gray-600">Investments</div>
                      <div className="text-gray-800 font-medium">$500.00</div>
                    </div>
                    <div className="text-xs font-medium px-2 py-1 bg-amber-100 text-amber-700 rounded-full">
                      20.4%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Financial Management
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our expense tracker provides all the tools you need to manage your finances effectively.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl p-6 shadow-card hover:shadow-lg transition-shadow duration-300">
              <div className="bg-primary-100 w-14 h-14 rounded-lg flex items-center justify-center mb-5">
                <BarChartBig className="text-primary-600" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Expense Tracking</h3>
              <p className="text-gray-600 mb-4">
                Easily log your expenses, categorize them, and keep track of where your money is going.
              </p>
              <Link to="/features" className="text-primary-600 font-medium hover:text-primary-800 inline-flex items-center">
                Learn more
                <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </Link>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white rounded-xl p-6 shadow-card hover:shadow-lg transition-shadow duration-300">
              <div className="bg-secondary-100 w-14 h-14 rounded-lg flex items-center justify-center mb-5">
                <PieChart className="text-secondary-600" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Visual Analytics</h3>
              <p className="text-gray-600 mb-4">
                Visualize your spending with intuitive charts and graphs to better understand your financial habits.
              </p>
              <Link to="/features" className="text-secondary-600 font-medium hover:text-secondary-800 inline-flex items-center">
                Learn more
                <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </Link>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white rounded-xl p-6 shadow-card hover:shadow-lg transition-shadow duration-300">
              <div className="bg-accent-100 w-14 h-14 rounded-lg flex items-center justify-center mb-5">
                <LineChart className="text-accent-600" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Budget Planning</h3>
              <p className="text-gray-600 mb-4">
                Set budgets for different categories and receive alerts when you're approaching your limits.
              </p>
              <Link to="/features" className="text-accent-600 font-medium hover:text-accent-800 inline-flex items-center">
                Learn more
                <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </Link>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-white rounded-xl p-6 shadow-card hover:shadow-lg transition-shadow duration-300">
              <div className="bg-purple-100 w-14 h-14 rounded-lg flex items-center justify-center mb-5">
                <Settings className="text-purple-600" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Customizable Categories</h3>
              <p className="text-gray-600 mb-4">
                Create and customize expense categories that match your unique spending habits and lifestyle.
              </p>
              <Link to="/features" className="text-purple-600 font-medium hover:text-purple-800 inline-flex items-center">
                Learn more
                <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </Link>
            </div>
            
            {/* Feature 5 */}
            <div className="bg-white rounded-xl p-6 shadow-card hover:shadow-lg transition-shadow duration-300">
              <div className="bg-indigo-100 w-14 h-14 rounded-lg flex items-center justify-center mb-5">
                <Shield className="text-indigo-600" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Secure Data</h3>
              <p className="text-gray-600 mb-4">
                Your financial data is encrypted and securely stored with enterprise-grade security measures.
              </p>
              <Link to="/features" className="text-indigo-600 font-medium hover:text-indigo-800 inline-flex items-center">
                Learn more
                <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </Link>
            </div>
            
            {/* Feature 6 */}
            <div className="bg-white rounded-xl p-6 shadow-card hover:shadow-lg transition-shadow duration-300">
              <div className="bg-green-100 w-14 h-14 rounded-lg flex items-center justify-center mb-5">
                <Fingerprint className="text-green-600" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Multi-platform Access</h3>
              <p className="text-gray-600 mb-4">
                Access your expense data from any device, anytime, with seamless synchronization across platforms.
              </p>
              <Link to="/features" className="text-green-600 font-medium hover:text-green-800 inline-flex items-center">
                Learn more
                <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-10 text-white shadow-xl">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">
                Ready to take control of your finances?
              </h2>
              <p className="text-xl mb-8 text-white/90">
                Join thousands of users who have transformed their financial habits with ExpenseTracker.
              </p>
              <Link
                to={user ? "/dashboard" : "/signup"}
                className="inline-block px-8 py-3 bg-white text-primary-700 rounded-lg font-medium text-lg hover:bg-gray-100 transition-colors shadow-lg"
              >
                {user ? "Go to Dashboard" : "Get Started for Free"}
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Home;