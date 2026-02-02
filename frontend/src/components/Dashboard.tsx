'use client';

import { useAuth } from '@/context/AuthContext';

export default function Dashboard() {
  const { user, logout } = useAuth();

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

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'admin':
        return 'You have full administrative access to all features and can manage users.';
      case 'moderator':
        return 'You have moderator privileges and can access moderator-level features.';
      default:
        return 'You have standard user access to the application.';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 text-white">
            <h1 className="text-2xl font-bold">Welcome, {user?.name}!</h1>
            <p className="mt-1 text-blue-100">{user?.email}</p>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Role Section */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Role</h2>
              
              <div className="flex items-center gap-4">
                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getRoleBadgeColor(user?.role || 'user')}`}>
                  {user?.role?.toUpperCase()}
                </span>
              </div>
              
              <p className="mt-4 text-gray-600">
                {getRoleDescription(user?.role || 'user')}
              </p>
            </div>

            {/* Role-based Content */}
            <div className="border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Role-based Access</h2>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                  <span className="text-gray-700">User Features</span>
                  <span className="text-green-600 text-sm font-medium">✓ Accessible</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className={`w-3 h-3 rounded-full ${['admin', 'moderator'].includes(user?.role || '') ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span className="text-gray-700">Moderator Features</span>
                  <span className={`text-sm font-medium ${['admin', 'moderator'].includes(user?.role || '') ? 'text-green-600' : 'text-red-600'}`}>
                    {['admin', 'moderator'].includes(user?.role || '') ? '✓ Accessible' : '✗ Restricted'}
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className={`w-3 h-3 rounded-full ${user?.role === 'admin' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span className="text-gray-700">Admin Features</span>
                  <span className={`text-sm font-medium ${user?.role === 'admin' ? 'text-green-600' : 'text-red-600'}`}>
                    {user?.role === 'admin' ? '✓ Accessible' : '✗ Restricted'}
                  </span>
                </div>
              </div>
            </div>

            {/* User Info */}
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
