import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import API from "../../services/api";
import StarRating from "../../components/StarRating";

export default function UserDash() {
  const { token } = useAuth();

  const { data = [], isLoading } = useQuery({
    queryKey: ["user-bookings"],
    queryFn: () =>
      API.get("/bookings/user", {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => res.data),
  });

  const grouped = {
    scheduled: data.filter((b) => b.status === "scheduled"),
    completed: data.filter((b) => b.status === "completed"),
    cancelled: data.filter((b) => b.status === "cancelled"),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-indigo-700 mb-10">
          🧾 Your Bookings
        </h1>

        {isLoading && (
          <p className="text-center text-gray-500 text-lg">Loading bookings…</p>
        )}

        {["scheduled", "completed", "cancelled"].map((status) => (
          <section key={status} className="mb-12">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-500 px-5 py-2 inline-block rounded shadow">
                {status.charAt(0).toUpperCase() + status.slice(1)} Bookings (
                {grouped[status].length})
              </h2>
            </div>

            {grouped[status].length === 0 ? (
              <p className="text-center italic text-gray-500">
                No {status} bookings.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {grouped[status].map((b) => (
                  <div
                    key={b._id}
                    className="bg-white p-6 rounded-xl shadow-lg hover:shadow-indigo-200 transition duration-300 border border-gray-100"
                  >
                    <h3 className="text-lg font-semibold text-indigo-700">
                      {b.services?.map((s) => s.name).join(", ")}
                    </h3>

                    <p className="text-sm text-gray-600 mt-1">
                      📅 {new Date(b.date).toLocaleDateString()}{" "}
                      {b.time && `at ${b.time}`}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">📍 {b.address}</p>

                    <p className="mt-3">
                      Status:{" "}
                      <span
                        className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                          status === "scheduled"
                            ? "bg-yellow-100 text-yellow-700"
                            : status === "completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {b.status}
                      </span>
                    </p>

                    {/* ⭐ Show rating if completed */}
                    {status === "completed" && (
                      <div className="mt-3">
                        <StarRating booking={b} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
