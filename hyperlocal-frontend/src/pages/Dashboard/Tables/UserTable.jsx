import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";
import { FaUserShield, FaBan, FaUnlock } from "react-icons/fa";

export default function UserTable() {
  const { token } = useAuth();
  const qc = useQueryClient();

  /* Fetch Users */
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () =>
      API.get("/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.data),
  });

  /* Block / Unblock */
  const toggleBlock = useMutation({
    mutationFn: (id) =>
      API.patch(
        `/admin/users/${id}/toggle`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      ),
    onSuccess: () => qc.invalidateQueries(["admin-users"]),
  });

  /* Promote to Provider */
  const promote = useMutation({
    mutationFn: (id) =>
      API.patch(
        `/admin/users/${id}/promote`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      ),
    onSuccess: () => qc.invalidateQueries(["admin-users"]),
  });

  return (
    <div className="p-6 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        👤 User Management
      </h1>

      {isLoading ? (
        <p className="text-gray-500">Loading users…</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-100 text-left text-gray-600 uppercase tracking-wider">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {data.map((u) => (
                <tr
                  key={u._id}
                  className="hover:bg-indigo-50 transition duration-150"
                >
                  <td className="p-3 font-medium text-gray-800">{u.name}</td>
                  <td className="p-3 text-gray-600">{u.email}</td>
                  <td className="p-3">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                        u.blocked
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {u.blocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td className="p-3 flex items-center justify-center gap-2">
                    <button
                      onClick={() => toggleBlock.mutate(u._id)}
                      className={`flex items-center gap-1 px-3 py-1 rounded text-sm font-medium transition ${
                        u.blocked
                          ? "bg-green-500 text-white hover:bg-green-600"
                          : "bg-red-500 text-white hover:bg-red-600"
                      }`}
                    >
                      {u.blocked ? <FaUnlock /> : <FaBan />}
                      {u.blocked ? "Unblock" : "Block"}
                    </button>

                    {u.role === "user" && (
                      <button
                        onClick={() => promote.mutate(u._id)}
                        className="flex items-center gap-1 px-3 py-1 bg-indigo-600 text-white text-sm font-medium rounded hover:bg-indigo-700 transition"
                      >
                        <FaUserShield />
                        Promote
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
