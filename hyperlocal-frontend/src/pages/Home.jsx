import { useNavigate } from "react-router-dom";
import OfferBanner from "../components/OfferBanner";
import MostBookedServices from "../components/MostBookedServices";
const categories = [
  { name: "Plumber", icon: "🛠️", slug: "plumber" },
  { name: "Electrician", icon: "💡", slug: "electrician" },
  { name: "AC Repair", icon: "❄️", slug: "ac-repair" },
  { name: "Cleaner", icon: "🧹", slug: "cleaning" },
  { name: "Carpenter", icon: "🪚", slug: "carpenter" },
  { name: "Painter", icon: "🎨", slug: "painter" },
];

export default function Home() {
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const query = e.target.elements.query.value.trim();
    if (query) navigate(`/services?search=${query}`);
  };

  return (
    <div className="bg-base-100">
      {/* Hero Section */}
      <div className="hero min-h-[60vh] bg-gradient-to-br from-indigo-100 to-white">
        <div className="hero-content text-center max-w-3xl mx-auto">
          <div>
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              Book Trusted Home Services Near You
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Plumbers, electricians, cleaners & more at your doorstep.
            </p>

            <form
              onSubmit={handleSearch}
              className="flex flex-col sm:flex-row justify-center items-center gap-3"
            >
              <input
                name="query"
                type="text"
                placeholder="Search for services..."
                className="input input-bordered w-full sm:w-80"
              />
              <button type="submit" className="btn btn-primary">
                Search
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Popular Services Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
          Popular Services
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.slug}
              onClick={() => navigate(`/services?category=${cat.slug}`)}
              className="cursor-pointer card bg-base-100 shadow hover:shadow-xl transition"
            >
              <div className="card-body items-center text-center">
                <div className="text-5xl">{cat.icon}</div>
                <h3 className="card-title text-lg">{cat.name}</h3>
              </div>
            </div>
          ))}
        </div>
        <div className="px-6 sm:px-10 py-10">
          <OfferBanner />
          <MostBookedServices />
        </div>
        <div className="flex flex-col items-center justify-center text-center space-y-2">
          <h1 className="md:text-4xl text-2xl font-semibold">
            Never Miss a Deal!
          </h1>
          <p className="md:text-lg text-gray-500/70 pb-8">
            Subscribe to get the latest offers, new arrivals, and exclusive
            discounts
          </p>
          <form className="flex items-center justify-between max-w-2xl w-full md:h-13 h-12">
            <input
              className="border border-gray-300 rounded-md h-full border-r-0 outline-none w-full rounded-r-none px-3 text-gray-500"
              type="text"
              placeholder="Enter your email id"
              required
            />
            <button
              type="submit"
              className="md:px-12 px-8 h-full text-white bg-indigo-500 hover:bg-indigo-600 transition-all cursor-pointer rounded-md rounded-l-none"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
