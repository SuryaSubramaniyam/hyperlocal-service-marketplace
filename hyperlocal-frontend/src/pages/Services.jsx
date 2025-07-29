import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../services/api";
import ServiceCard from "../components/cards/ServiceCard";

function useQuery() {
  const { search } = useLocation();
  return Object.fromEntries(new URLSearchParams(search));
}

export default function Services() {
  const navigate = useNavigate();
  const queryParams = useQuery();

  const searchTerm = queryParams.search || "";
  const categoryParam = queryParams.category || "";
  const locationParam = queryParams.location || "";

  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState("loading");

  const [search, setSearch] = useState(searchTerm);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [location, setLocation] = useState(locationParam);

  useEffect(() => {
    setStatus("loading");
    API.get("/services", {
      params: {
        search: searchTerm,
        category: categoryParam,
        location: locationParam,
      },
    })
      .then((res) => {
        setServices(res.data);
        setStatus("success");
      })
      .catch((err) => {
        console.error(" /services error", err?.response || err);
        setStatus("error");
      });
  }, [searchTerm, categoryParam, locationParam]);

  useEffect(() => {
    API.get("/admin/categories")
      .then((res) => {
        setCategories(res.data || []);
      })
      .catch((err) => {
        console.error(" Failed to fetch categories", err?.response || err);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const query = new URLSearchParams({
      search,
      category: selectedCategory,
      location,
    }).toString();
    navigate(`/services?${query}`);
  };

  return (
    <div className="min-h-screen bg-base-200 px-4 py-10">
      <div className="max-w-7xl mx-auto">
        {/* 🔍 Filter Form */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-10"
        >
          <input
            type="text"
            placeholder="Search service"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input input-bordered w-full"
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="select select-bordered w-full"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="input input-bordered w-full"
          />

          <button className="btn btn-primary w-full">Apply Filters</button>
        </form>

        {/* Title */}
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          {categoryParam
            ? `${categoryParam.replace(/-/g, " ")} Services`
            : searchTerm
            ? `Results for “${searchTerm}”`
            : "All Services"}
        </h1>

        {/* Loading / Error / Empty */}
        {status === "loading" && (
          <div className="text-center text-gray-500">Loading services...</div>
        )}
        {status === "error" && (
          <div className="text-center text-red-500">
            Failed to load services.
          </div>
        )}
        {status === "success" && services.length === 0 && (
          <div className="text-center text-gray-500">No services found.</div>
        )}

        {/* Cards */}
        {status === "success" && services.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((svc) => (
              <ServiceCard key={svc._id} {...svc} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
