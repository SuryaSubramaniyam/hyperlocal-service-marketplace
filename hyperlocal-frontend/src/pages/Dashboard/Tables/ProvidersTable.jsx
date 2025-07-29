import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import toast from "react-hot-toast";

export default function ProvidersTable() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  // ✅ Get all providers
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin-providers"],
    queryFn: () =>
      API.get("/admin/providers", {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => res.data),
  });

  const toggleActive = useMutation({
    mutationFn: (id) =>
      API.patch(
        `/admin/providers/${id}/toggle`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      ),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["admin-providers"]);
      const updatedStatus = data?.data?.active ? "approved" : "deactivated";
      toast.success(`Provider successfully ${updatedStatus}`);
    },
    onError: (err) => {
      console.error("Toggle failed:", err);
      toast.error("Failed to update provider status");
    },
  });

  return (
    <div className="p-6 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        🛠 Provider Management
      </h1>

      {isLoading ? (
        <p className="text-gray-500">Loading providers…</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm divide-y divide-gray-200">
            <thead className="bg-gray-100 text-gray-600 uppercase text-left tracking-wide">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {data.map((provider) => (
                <tr
                  key={provider._id}
                  className="hover:bg-indigo-50 transition duration-150"
                >
                  <td className="p-3 font-medium text-gray-800">
                    {provider.name}
                  </td>
                  <td className="p-3 text-gray-600">{provider.email}</td>
                  <td className="p-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${
                        provider.active
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {provider.active ? (
                        <>
                          <FaCheckCircle />
                          Approved
                        </>
                      ) : (
                        <>
                          <FaTimesCircle />
                          Pending
                        </>
                      )}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => toggleActive.mutate(provider._id)}
                      className={`px-4 py-1 text-sm font-medium rounded-md text-white transition duration-150 ${
                        provider.active
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {provider.active ? "Deactivate" : "Approve"}
                    </button>
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
