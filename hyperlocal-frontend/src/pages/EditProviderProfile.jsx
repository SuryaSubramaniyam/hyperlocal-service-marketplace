import { useEffect, useState } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";

export default function EditProviderProfile() {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    profileImage: "",
  });

  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const res = await API.get(`/providers/${providerId}`);
        const { name, email, phone, profileImage } = res.data;
        setFormData({ name, email, phone, profileImage });

        if (user?._id !== providerId && user?.role !== "admin") {
          setUnauthorized(true);
        }
      } catch (err) {
        console.error("Failed to fetch provider:", err);
        setUnauthorized(true);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchProvider();
  }, [providerId, user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/providers/${providerId}`, formData);
      navigate(`/provider/${providerId}`);
    } catch (err) {
      console.error("Update failed:", err);
      alert("Update failed. Check console.");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (unauthorized) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 py-10 px-4">
      <div className="max-w-xl mx-auto bg-white shadow-xl rounded-xl p-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-center text-indigo-700 mb-8">
          ✏️ Edit Profile
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Profile Image Preview */}
          {formData.profileImage && (
            <div className="flex justify-center">
              <img
                src={formData.profileImage}
                alt="Preview"
                className="w-24 h-24 rounded-full border-2 border-indigo-500 object-cover mb-2"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Full Name
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@example.com"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Phone Number
            </label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Profile Image URL
            </label>
            <input
              name="profileImage"
              value={formData.profileImage}
              onChange={handleChange}
              placeholder="https://image-link.jpg"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="text-center pt-4">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition shadow-md"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
