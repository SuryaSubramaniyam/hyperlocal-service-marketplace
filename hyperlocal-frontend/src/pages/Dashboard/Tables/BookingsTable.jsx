import { useQuery } from "@tanstack/react-query";
import API from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";

export default function BookingsTable() {
  const { token } = useAuth();

  const { data = [], isLoading } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: () =>
      API.get("/admin/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.data),
  });

  const statusColors = {
    scheduled: "bg-yellow-100 text-yellow-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">📅 All Bookings</h1>

      {isLoading ? (
        <p className="text-gray-500">Loading bookings…</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[1100px] w-full text-sm divide-y divide-gray-200">
            <thead className="bg-gray-100 text-gray-600 uppercase text-left">
              <tr>
                <th className="px-4 py-3">Services</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Provider</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Address</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Payment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map((b) => {
                const totalAmount = b.services?.reduce(
                  (sum, s) => sum + Number(s.price || 0),
                  0
                );

                return (
                  <tr key={b._id} className="hover:bg-indigo-50 transition">
                    {/* Services */}
                    <td className="px-4 py-3 align-top">
                      <ul className="list-disc ml-4 text-gray-700 space-y-1">
                        {b.services?.map((s) => (
                          <li key={s._id}>{s.title || "Untitled Service"}</li>
                        ))}
                      </ul>
                    </td>

                    {/* User */}
                    <td className="px-4 py-3 align-top text-gray-800">
                      <p className="font-medium">{b.user?.name || "—"}</p>
                      <p className="text-gray-500 text-xs">{b.user?.email}</p>
                    </td>

                    {/* Provider */}
                    <td className="px-4 py-3 align-top text-gray-800">
                      <p className="font-medium">{b.provider?.name || "—"}</p>
                      <p className="text-gray-500 text-xs">
                        {b.provider?.email}
                      </p>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3 align-top text-gray-700">
                      {new Date(b.createdAt).toLocaleDateString()}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3 align-top">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          statusColors[b.status] || "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="px-4 py-3 align-top font-semibold text-green-700">
                      ₹{totalAmount.toFixed(2)}
                    </td>

                    {/* Address */}
                    <td className="px-4 py-3 align-top text-gray-600 whitespace-pre-wrap max-w-xs">
                      {b.address}
                    </td>

                    {/* Phone */}
                    <td className="px-4 py-3 align-top text-gray-700">
                      {b.phone}
                    </td>

                    {/* Payment Method */}
                    <td className="px-4 py-3 align-top text-gray-800 uppercase font-medium">
                      {b.paymentMethod}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
