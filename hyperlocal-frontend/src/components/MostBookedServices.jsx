import { Link } from "react-router-dom";
import painting from "../assets/services/painting.jpg";
import pestKitchen from "../assets/services/pest-kitchen.jpg";
import acFoam from "../assets/services/ac-foam.jpg";
import bathroom from "../assets/services/bathroom.jpg";

const services = [
  { name: "Full Home Painting", img: painting, rating: "4.8", price: "₹49" },
  {
    name: "Pest Control (Kitchen)",
    img: pestKitchen,
    rating: "4.7",
    price: "₹1,098",
  },
  { name: "Foam Jet AC Service", img: acFoam, rating: "4.9", price: "₹799" },
  {
    name: "Deep Bathroom Cleaning",
    img: bathroom,
    rating: "4.8",
    price: "₹999",
  },
];

export default function MostBookedServices() {
  return (
    <div className="mb-10">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Most Booked Services
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {services.map((s, i) => (
          <Link
            to="/services"
            key={i}
            className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition"
          >
            <img
              src={s.img}
              alt={s.name}
              className="h-44 w-full object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800">{s.name}</h3>
              <p className="text-sm text-gray-500 mt-1">⭐ {s.rating}</p>
              <p className="text-indigo-600 font-bold mt-1">{s.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
