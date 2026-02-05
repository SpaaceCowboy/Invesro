'use client';

import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';

interface EndpointTestResult {
  loading: boolean;     
  success: boolean;     
  message: string;       
  error: string | null;  
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function Dashboard() {

  const { user, token, logout } = useAuth();

  const [userEndpoint, setUserEndpoint] = useState<EndpointTestResult>({
    loading: true,   
    success: false,
    message: '',
    error: null,
  });

  const [moderatorEndpoint, setModeratorEndpoint] = useState<EndpointTestResult>({
    loading: true,
    success: false,
    message: '',
    error: null,
  });

  const [adminEndpoint, setAdminEndpoint] = useState<EndpointTestResult>({
    loading: true,
    success: false,
    message: '',
    error: null,
  });

  const callProtectedEndpoint = async (
    endpoint: string,
    setResult: React.Dispatch<React.SetStateAction<EndpointTestResult>>
  ) => {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          // THIS IS THE KEY LINE - sending our JWT token!
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setResult({
          loading: false,
          success: true,
          message: data.message, 
          error: null,
        });
      } else if (response.status === 401) {
        setResult({
          loading: false,
          success: false,
          message: '',
          error: `401 Unauthorized: ${data.message}`,
        });
      } else if (response.status === 403) {
        setResult({
          loading: false,
          success: false,
          message: '',
          error: `403 Forbidden: ${data.message}`,
        });
      } else {
        setResult({
          loading: false,
          success: false,
          message: '',
          error: `Error ${response.status}: ${data.message || 'Something went wrong'}`,
        });
      }
    } catch (error) {
      console.error('API call failed:', error);
      setResult({
        loading: false,
        success: false,
        message: '',
        error: 'Network error: Could not connect to server. Is the backend running?',
      });
    }
  };
  useEffect(() => {
    if (token) {
      callProtectedEndpoint('/protected/user', setUserEndpoint);
      callProtectedEndpoint('/protected/moderator', setModeratorEndpoint);
      callProtectedEndpoint('/protected/admin', setAdminEndpoint);
    }
  }, [token]);
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'moderator':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const renderEndpointStatus = (
    result: EndpointTestResult,
    endpointName: string,
    description: string
  ) => {

    if (result.loading) {
      return (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            {/* Spinning loader animation */}
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <div>
              <p className="font-medium text-gray-700">{endpointName}</p>
              <p className="text-sm text-gray-500">Testing access...</p>
            </div>
          </div>
        </div>
      );
    }

    if (result.error) {
      return (
        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <p className="font-medium text-red-800">{endpointName}</p>
              <p className="text-sm text-gray-600 mb-2">{description}</p>
              {/* The actual error message from the API */}
              <p className="text-sm text-red-600 bg-red-100 p-2 rounded">
                {result.error}
              </p>
            </div>
          </div>
        </div>
      );
    }
    if (result.success) {
      return (
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <p className="font-medium text-green-800">{endpointName}</p>
              <p className="text-sm text-gray-600 mb-2">{description}</p>
              <p className="text-sm text-green-600 bg-green-100 p-2 rounded">
                {result.message}
              </p>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          
          {/* Header with user greeting */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 text-white">
            <h1 className="text-2xl font-bold">Welcome, {user?.name}!</h1>
            <p className="mt-1 text-blue-100">{user?.email}</p>
            <div className="mt-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getRoleBadgeColor(user?.role || 'user')}`}>
                {user?.role?.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Main content */}
          <div className="p-6 space-y-6">
            <div className="border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
              </h2>

              <div className="space-y-4">
                {renderEndpointStatus(
                  userEndpoint,
                  'GET /api/protected/user',
                  'Requires: Any authenticated user (user, moderator, or admin)'
                )}
                {renderEndpointStatus(
                  moderatorEndpoint,
                  'GET /api/protected/moderator',
                  'Requires: moderator or admin role'
                )}
                {renderEndpointStatus(
                  adminEndpoint,
                  'GET /api/protected/admin',
                  'Requires: admin role only'
                )}
              </div>
            </div>

            <div className="border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Account Information</h2>
              <dl className="space-y-2">
                <div className="flex">
                  <dt className="w-24 text-gray-500">ID:</dt>
                  <dd className="text-gray-800 font-mono text-sm">{user?.id}</dd>
                </div>
                <div className="flex">
                  <dt className="w-24 text-gray-500">Name:</dt>
                  <dd className="text-gray-800">{user?.name}</dd>
                </div>
                <div className="flex">
                  <dt className="w-24 text-gray-500">Email:</dt>
                  <dd className="text-gray-800">{user?.email}</dd>
                </div>
                <div className="flex">
                  <dt className="w-24 text-gray-500">Role:</dt>
                  <dd className="text-gray-800 capitalize">{user?.role}</dd>
                </div>
              </dl>
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="w-full bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}