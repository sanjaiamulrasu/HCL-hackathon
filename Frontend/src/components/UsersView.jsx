import React from 'react';

// NOTE: The backend does not expose a /api/users endpoint.
// This view is a placeholder for future implementation (e.g. after adding a UserController).
// Roles defined in backend: USER, ADMIN, HOTEL_MANAGER

export default function UsersView() {
  return (
    <div className="animate-fade-in pb-12">
      <div className="mb-6 px-2 flex justify-between items-end">
        <h2 className="text-xl font-bold tracking-tight text-primary">System Users</h2>
      </div>

      <div className="pill-card p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">🔒</span>
        </div>
        <h3 className="text-lg font-bold text-primary mb-2">User Management — Coming Soon</h3>
        <p className="text-gray-500 max-w-sm mx-auto text-sm">
          A user management API endpoint is not yet available on the backend.
          Once <code className="bg-gray-100 px-1 rounded text-xs">/api/admin/users</code> is added
          to the backend, this view will display all platform users with their roles:
          <span className="font-semibold"> ADMIN</span>,
          <span className="font-semibold"> HOTEL_MANAGER</span>,
          <span className="font-semibold"> USER</span>.
        </p>
      </div>
    </div>
  );
}
