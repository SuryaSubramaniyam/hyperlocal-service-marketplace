import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";
import { FaEdit, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";

export default function CategoriesTable() {
  const { token } = useAuth();
  const qc = useQueryClient();

  const [name, setName] = useState("");
  const [editing, setEditing] = useState(null);

  // 🔍 Fetch categories
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: () =>
      API.get("/admin/categories", {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => res.data),
  });

  // ➕ Create category
  const create = useMutation({
    mutationFn: (newName) =>
      API.post(
        "/admin/categories",
        { name: newName },
        { headers: { Authorization: `Bearer ${token}` } }
      ),
    onSuccess: () => {
      setName("");
      toast.success("Category created successfully!");
      qc.invalidateQueries(["admin-categories"]);
    },
    onError: () => {
      toast.error("Failed to create category");
    },
  });

  // ✏️ Update category
  const update = useMutation({
    mutationFn: ({ id, name }) =>
      API.put(
        `/admin/categories/${id}`,
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      ),
    onSuccess: () => {
      setEditing(null);
      toast.success("Category updated successfully!");
      setName("");
      qc.invalidateQueries(["admin-categories"]);
    },
    onError: () => {
      toast.error("Failed to update category");
    },
  });

  // 🗑 Delete category
  const remove = useMutation({
    mutationFn: (id) =>
      API.delete(`/admin/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    onSuccess: () => {
      toast.success("Category deleted successfully!");
      qc.invalidateQueries(["admin-categories"]);
    },
    onError: () => {
      toast.error("Failed to delete category");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editing) {
      update.mutate({ id: editing, name });
    } else {
      create.mutate(name);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        🗂 Service Categories
      </h1>

      {/* Category Form */}
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 mb-8">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category name"
          className="px-4 py-2 border border-gray-300 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition"
        >
          {editing ? "Update" : "Add"}
        </button>
        {editing && (
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setName("");
            }}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition"
          >
            Cancel
          </button>
        )}
      </form>

      {/* Category Table */}
      {isLoading ? (
        <p className="text-gray-500">Loading categories…</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-100 text-gray-600 uppercase text-left">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {categories.map((cat) => (
                <tr key={cat._id} className="hover:bg-indigo-50 transition">
                  <td className="px-4 py-3 text-gray-800">{cat.name}</td>
                  <td className="px-4 py-3 flex justify-center items-center gap-3">
                    <button
                      onClick={() => {
                        setEditing(cat._id);
                        setName(cat.name);
                      }}
                      className="text-yellow-500 hover:text-yellow-600"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => remove.mutate(cat._id)}
                      className="text-red-600 hover:text-red-700"
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
