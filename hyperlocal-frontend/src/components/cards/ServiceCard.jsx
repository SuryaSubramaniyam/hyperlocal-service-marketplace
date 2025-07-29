import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
// import toast from "react-hot-toast";

export default function ServiceCard({
  _id,
  image,
  title,
  name,
  price = 0,
  rating = 0,
  provider,
}) {
  const navigate = useNavigate();
  const displayTitle = title || name;
  const rounded = Math.round(rating * 2) / 2;
  const stars = Array.from({ length: 5 }, (_, i) =>
    i + 1 <= rounded ? "★" : i + 0.5 === rounded ? "☆" : "☆"
  );

  const { addToCart, cart } = useCart();
  const isInCart = cart.some((item) => item._id === _id);

  const handleCardClick = () => {
    navigate(`/services/${_id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation(); // prevent card click
    addToCart({ _id, image, title: displayTitle, price });
    // toast.success("Service added to cart!");
  };

  return (
    <div
      onClick={handleCardClick}
      className="card bg-base-100 shadow-xl hover:shadow-2xl cursor-pointer transition"
    >
      <figure>
        <img
          src={image || "/placeholder-service.jpg"}
          alt={displayTitle}
          className="h-48 w-full object-cover"
        />
      </figure>
      <div className="card-body p-4">
        <h2 className="card-title text-lg font-semibold text-gray-800">
          {displayTitle}
        </h2>

        <div className="flex justify-between items-center text-sm text-gray-600">
          <span className="font-bold text-primary">₹{price}</span>
          <span className="text-yellow-500">
            {stars.join("")}{" "}
            <span className="text-gray-400 ml-1">({rating})</span>
          </span>
        </div>

        <div className="mt-3">
          <button
            onClick={handleAddToCart}
            disabled={isInCart}
            className={`btn btn-sm w-full ${
              isInCart
                ? "btn-disabled bg-gray-400 text-white"
                : "btn-primary text-white"
            }`}
          >
            {isInCart ? "In Cart" : "Add to Cart"}
          </button>
        </div>

        {provider?._id && (
          <Link
            to={`/provider/${provider._id}`}
            onClick={(e) => e.stopPropagation()}
            className="mt-2 text-center text-sm text-indigo-500 hover:underline"
          >
            View Provider Profile
          </Link>
        )}
      </div>
    </div>
  );
}
