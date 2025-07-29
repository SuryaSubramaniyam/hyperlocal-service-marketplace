import { Link } from "react-router-dom";
import bannerBathroom from "../assets/services/banner-bathroom.jpg";

export default function OfferBanner() {
  return (
    <div className="relative bg-indigo-100 rounded-xl overflow-hidden p-6 flex items-center justify-between mb-8">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-indigo-700">
          🔥 Flat 30% Off
        </h2>
        <p className="text-gray-700 mt-1">
          On bathroom & home cleaning services
        </p>
        <Link
          to="/services"
          className="mt-4 inline-block px-5 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
        >
          Explore now
        </Link>
      </div>
      <img
        src={bannerBathroom}
        alt="Offer"
        className="w-40 sm:w-56 lg:w-64 drop-shadow-md"
      />
    </div>
  );
}
