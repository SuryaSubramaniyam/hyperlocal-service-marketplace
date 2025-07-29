// src/pages/Dashboard/DashboardHome.jsx
import { Link } from "react-router-dom";

export default function DashboardHome() {
  return (
    <div className="space-y-10">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl p-8 shadow-md">
        <h1 className="text-3xl font-bold">📊 Welcome, Admin!</h1>
        <p className="mt-2 text-sm text-indigo-100">
          Manage users, providers, services, and track business metrics in real
          time.
        </p>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-5 shadow hover:shadow-md transition">
          <h2 className="text-sm text-gray-500">New Users Today</h2>
          <p className="text-2xl font-bold text-indigo-600">+18</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow hover:shadow-md transition">
          <h2 className="text-sm text-gray-500">New Providers</h2>
          <p className="text-2xl font-bold text-green-600">+4</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow hover:shadow-md transition">
          <h2 className="text-sm text-gray-500">Today’s Revenue</h2>
          <p className="text-2xl font-bold text-emerald-600">₹12,000</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow hover:shadow-md transition">
          <h2 className="text-sm text-gray-500">Pending Approvals</h2>
          <p className="text-2xl font-bold text-red-500">3</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          to="/dashboard/admin/categories"
          className="block p-6 rounded-xl bg-indigo-100 hover:bg-indigo-200 transition"
        >
          <h3 className="text-lg font-semibold text-indigo-800 mb-1">
            🗂 Manage Categories
          </h3>
          <p className="text-sm text-indigo-600">
            Create, edit, or delete service categories.
          </p>
        </Link>
        <Link
          to="/dashboard/admin/providers"
          className="block p-6 rounded-xl bg-green-100 hover:bg-green-200 transition"
        >
          <h3 className="text-lg font-semibold text-green-800 mb-1">
            🛠 Review Providers
          </h3>
          <p className="text-sm text-green-600">
            Approve or reject service provider profiles.
          </p>
        </Link>
        <Link
          to="/dashboard/admin/services"
          className="block p-6 rounded-xl bg-yellow-100 hover:bg-yellow-200 transition"
        >
          <h3 className="text-lg font-semibold text-yellow-800 mb-1">
            📦 Review Services
          </h3>
          <p className="text-sm text-yellow-600">
            View and moderate posted services.
          </p>
        </Link>
        <Link
          to="/dashboard/admin/bookings"
          className="block p-6 rounded-xl bg-pink-100 hover:bg-pink-200 transition"
        >
          <h3 className="text-lg font-semibold text-pink-800 mb-1">
            📅 View Bookings
          </h3>
          <p className="text-sm text-pink-600">
            Track user and provider bookings.
          </p>
        </Link>
      </div>

      {/* Recent Activity Placeholder */}
      <div className="mt-6 bg-white p-6 rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">
          📌 Recent Activity
        </h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>✅ User JohnDoe123 registered as Provider</li>
          <li>📦 New Service “Home Cleaning” submitted for review</li>
          <li>💰 ₹2,000 payment received from booking #12345</li>
        </ul>
      </div>
    </div>
  );
}
