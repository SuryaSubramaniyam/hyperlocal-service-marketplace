import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../services/api";
import ServiceCard from "../components/cards/ServiceCard";
import { useAuth } from "../context/AuthContext";

export default function ProviderProfile() {
  const { providerId } = useParams();
  const { user } = useAuth();
  const [provider, setProvider] = useState(null);
  const [services, setServices] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [providerRes, servicesRes] = await Promise.all([
          API.get(`/providers/${providerId}`),
          API.get(`/services?provider=${providerId}`),
        ]);

        setProvider(providerRes.data);
        setServices(servicesRes.data);
      } catch (err) {
        console.error("Error fetching provider or services:", err);
      }
    }

    fetchData();
  }, [providerId]);

  if (!provider) return <p className="p-6">Loading provider...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <img
            src={provider.profileImage || "/default-avatar.png"}
            alt="Provider"
            className="w-32 h-32 rounded-full object-cover border-4 border-indigo-500"
          />
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold text-indigo-600 mb-1">
              {provider.name}
            </h1>
            <p className="text-gray-600">{provider.email}</p>
            <p className="text-gray-500 text-sm">
              📞 {provider.phone || "No phone"}
            </p>

            {user &&
              (String(user._id) === String(provider._id) ||
                user.role === "admin") && (
                <Link
                  to={`/provider/${provider._id}/edit`}
                  className="mt-4 inline-block bg-indigo-600 text-white text-sm px-4 py-2 rounded hover:bg-indigo-700 transition"
                >
                  Edit Profile
                </Link>
              )}
          </div>
        </div>

        {/* Divider */}
        <hr className="my-8 border-t border-gray-200" />

        {/* Services */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Services Offered
          </h2>

          {services.length === 0 ? (
            <p className="text-gray-500 italic">No services found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {services.map((svc) => (
                <ServiceCard key={svc._id} {...svc} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
