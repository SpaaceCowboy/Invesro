'use client';

import { useAuth } from '@/context/AuthContext';
import LoginForm from '@/components/LoginForm';
import RegisterForm from '@/components/RegisterForm';
import Dashboard from '@/components/Dashboard';
import { useState } from 'react';

export default function Home() {
  const { user, isLoading } = useAuth();
  const [showLogin, setShowLogin] = useState(true);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (user) {
    return <Dashboard />;
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
            {showLogin ? 'Login' : 'Register'}
          </h1>
          
          {showLogin ? <LoginForm /> : <RegisterForm />}
          
          <div className="mt-6 text-center">
            <button
              onClick={() => setShowLogin(!showLogin)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              {showLogin 
                ? "Don't have an account? Register" 
                : 'Already have an account? Login'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
