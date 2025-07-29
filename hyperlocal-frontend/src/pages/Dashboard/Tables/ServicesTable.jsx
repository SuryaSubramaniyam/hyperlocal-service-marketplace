import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";
import { FaCheckCircle, FaTimesCircle, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";

export default function ServicesTable() {
  const { token } = useAuth();
  const qc = useQueryClient();

  // 🔍 Fetch all services
  const {
    data = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["admin-services"],
    queryFn: () =>
      API.get("/admin/services", {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => res.data),
  });

  // ✅ Approve / Unapprove
  const approve = useMutation({
    mutationFn: ({ id, approved }) =>
      API.patch(
        `/admin/services/${id}/approve`,
        { approved },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      ),
    onSuccess: (_, { approved }) => {
      toast.success(
        `Service ${approved ? "approved" : "unapproved"} successfully`
      );
      refetch(); // ✅ ensures UI reflects correct status
    },
    onError: () => {
      toast.error("Failed to update service status");
    },
  });

  // 🗑️ Delete
  const remove = useMutation({
    mutationFn: (id) =>
      API.delete(`/admin/services/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    onSuccess: () => {
      toast.success("Service deleted successfully");
      qc.invalidateQueries(["admin-services"]);
    },
    onError: () => {
      toast.error("Failed to delete service");
    },
  });

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">📦 All Services</h1>

      {isLoading ? (
        <p className="text-gray-500">Loading services…</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-100 text-gray-600 uppercase text-left">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th>Provider</th>
                <th>Price</th>
                <th>Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {data.map((svc) => (
                <tr key={svc._id} className="hover:bg-indigo-50 transition">
                  <td className="px-4 py-3 text-gray-800 font-medium">
                    {svc.title}
                  </td>
                  <td className="px-4 py-3">{svc.provider?.name || "—"}</td>
                  <td className="px-4 py-3">₹{svc.price}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                        svc.approved
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {svc.approved ? "Approved" : "Pending"}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-2 justify-center">
                    {/* Approve / Unapprove */}
                    <button
                      onClick={() =>
                        approve.mutate({
                          id: svc._id,
                          approved: !svc.approved,
                        })
                      }
                      className={`p-2 rounded-full text-white ${
                        svc.approved ? "bg-yellow-500" : "bg-green-600"
                      } hover:scale-105 transition`}
                      title={svc.approved ? "Unapprove" : "Approve"}
                    >
                      {svc.approved ? <FaTimesCircle /> : <FaCheckCircle />}
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => remove.mutate(svc._id)}
                      className="p-2 rounded-full bg-red-600 text-white hover:scale-105 transition"
                      title="Delete"
                    >
                      <FaTrash />
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
