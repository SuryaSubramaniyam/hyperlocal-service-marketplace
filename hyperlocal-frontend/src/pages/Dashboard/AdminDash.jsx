import { Link, Outlet, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const StatCard = ({ icon, label, value }) => (
  <div className="flex items-center gap-4 bg-gradient-to-br from-indigo-100 to-purple-100 p-6 rounded-2xl shadow hover:shadow-md transition-all duration-200">
    <div className="text-4xl">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

export default function AdminDash() {
  const { token } = useAuth();
  const location = useLocation();

  const { data = {}, isLoading } = useQuery({
    enabled: !!token,
    queryKey: ["admin-stats"],
    queryFn: () =>
      API.get("/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.data),
  });

  const isDashboardHome =
    location.pathname === "/dashboard/admin" ||
    location.pathname === "/dashboard/admin/";

  const navLinks = [
    { to: ".", label: "Dashboard", icon: "📊" },
    { to: "categories", label: "Categories", icon: "🗂" },
    { to: "user", label: "Users", icon: "👤" },
    { to: "providers", label: "Providers", icon: "🛠" },
    { to: "services", label: "Services", icon: "📦" },
    { to: "bookings", label: "Bookings", icon: "📅" },
  ];

  return (
    <div className="min-h-screen flex font-inter bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-gray-200 p-6 space-y-6 shadow-xl">
        <h2 className="text-2xl font-bold text-indigo-400 tracking-wide">
          Admin Panel
        </h2>
        <nav className="flex flex-col space-y-2">
          {navLinks.map((link) => {
            const isActive =
              location.pathname === `/dashboard/admin/${link.to}` ||
              (link.to === "." && location.pathname === "/dashboard/admin");
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-indigo-600 hover:text-white transition ${
                  isActive ? "bg-indigo-600 text-white" : "text-gray-300"
                }`}
              >
                <span>{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="flex-1 p-8 overflow-auto">
        <Outlet />

        {isDashboardHome && (
          <>
            {isLoading ? (
              <p className="text-gray-600">Loading stats…</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                <StatCard icon="👤" label="Users" value={data.users} />
                <StatCard icon="🛠️" label="Providers" value={data.providers} />
                <StatCard icon="📦" label="Services" value={data.services} />
                <StatCard
                  icon="💰"
                  label="Revenue (₹)"
                  value={data.revenue
                    ?.reduce((a, c) => a + c.total, 0)
                    .toLocaleString()}
                />
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
