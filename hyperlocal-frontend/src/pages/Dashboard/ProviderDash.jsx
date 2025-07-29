import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

export default function ProviderDash() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const { data = [], isLoading } = useQuery({
    queryKey: ["provider-bookings"],
    queryFn: () =>
      API.get("/bookings/provider", {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => res.data),
  });

  const mutation = useMutation({
    mutationFn: ({ id, status }) =>
      API.patch(
        `/bookings/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      ),
    onSuccess: () => queryClient.invalidateQueries(["provider-bookings"]),
    onError: (err) => console.error("Update booking error:", err),
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-indigo-700 mb-8">
          📦 Your Service Bookings
        </h1>

        <div className="flex justify-end mb-6">
          <Link
            to="/dashboard/provider/create"
            className="bg-indigo-600 text-white px-5 py-2 rounded shadow hover:bg-indigo-700 transition"
          >
            ➕ Create New Service
          </Link>
        </div>

        {isLoading ? (
          <p className="text-center text-gray-600 text-lg">Loading bookings…</p>
        ) : data.length === 0 ? (
          <p className="text-center text-gray-500 italic">No bookings yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.map((b) => (
              <div
                key={b._id}
                className="bg-white p-6 rounded-xl border shadow hover:shadow-lg transition"
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="font-semibold text-indigo-600">
                    📄 Booking ID: {b._id.slice(-6).toUpperCase()}
                  </p>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      b.status === "scheduled"
                        ? "bg-yellow-100 text-yellow-700"
                        : b.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {b.status}
                  </span>
                </div>

                <p className="text-sm text-gray-700">🧑‍💼 User: {b.user?.name}</p>
                <p className="text-sm text-gray-500 mb-2">
                  📅 {new Date(b.createdAt).toLocaleDateString()}
                </p>

                <div className="mb-3">
                  <p className="font-semibold">🧰 Services:</p>
                  <ul className="list-disc ml-5 text-sm mt-1 text-gray-700">
                    {b.services?.map((s) => (
                      <li key={s._id}>
                        {s.name} - ₹{s.price}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="text-sm text-gray-600 mb-2">
                  📍 Address: {b.address} <br />
                  📞 Phone: {b.phone} <br />
                  💳 Payment: {b.paymentMethod?.toUpperCase()}
                </div>

                {b.status === "scheduled" && (
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() =>
                        mutation.mutate({ id: b._id, status: "completed" })
                      }
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded"
                    >
                      ✅ Mark Completed
                    </button>
                    <button
                      onClick={() =>
                        mutation.mutate({ id: b._id, status: "cancelled" })
                      }
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
                    >
                      ❌ Cancel Booking
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
