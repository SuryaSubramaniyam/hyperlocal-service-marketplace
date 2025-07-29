import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import ReviewForm from "../components/forms/ReviewForm";

export default function ServiceDetails() {
  const { id } = useParams();
  const { User } = useAuth();
  const { addToCart, cart } = useCart();

  const {
    data: svc,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["service", id],
    queryFn: () => API.get(`/services/${id}`).then((r) => r.data),
  });

  const isInCart = cart.some((item) => item._id === id);

  const handleAddToCart = () => {
    if (svc) {
      addToCart({
        _id: svc._id,
        image: svc.image,
        title: svc.title || svc.name,
        price: svc.price,
      });
    }
  };

  if (isLoading) return <p className="p-6">Loading…</p>;
  if (isError)
    return <p className="p-6 text-red-500">Error loading service.</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid lg:grid-cols-2 gap-10 items-start">
        {/* Left - Image */}
        <figure className="w-full h-full">
          <img
            src={svc.image || "/placeholder-service.jpg"}
            alt={svc.title || svc.name}
            className="w-full h-[400px] object-cover rounded-2xl shadow"
          />
        </figure>

        {/* Right - Info Card */}
        <div className="card bg-base-100 shadow-xl p-6 space-y-4">
          <div>
            <h2 className="text-3xl font-bold">{svc.title || svc.name}</h2>
            <p className="text-lg text-primary font-semibold mt-1">
              ₹{svc.price}
            </p>
            <div className="text-yellow-500 mt-1">
              {"★".repeat(Math.round(svc.rating))}{" "}
              <span className="text-sm text-gray-500">({svc.rating})</span>
            </div>
          </div>

          <p className="text-gray-600">{svc.description}</p>

          {/* Provider Info */}
          <div className="flex items-center gap-4 mt-4">
            <div className="avatar">
              <div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${svc.provider.name}`}
                  alt="provider"
                />
              </div>
            </div>
            <div>
              <p className="font-medium">{svc.provider.name}</p>
              <p className="text-xs text-gray-500">{svc.provider.city}</p>
            </div>
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={isInCart}
            className={`btn mt-6 w-full ${
              isInCart ? "btn-disabled" : "btn-primary"
            }`}
          >
            {isInCart ? "In Cart" : "Add to Cart"}
          </button>
        </div>
      </div>
      {/* Leave Review Button */}
      <div className="mt-8">
        <button
          onClick={() => document.getElementById("review_modal").showModal()}
          className="btn btn-outline btn-primary"
        >
          Leave a Review
        </button>

        {/* Modal for Review Form */}
        <dialog id="review_modal" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Leave a Review</h3>
            <ReviewForm
              serviceId={svc._id}
              onSubmit={(newReview) => {
                // 👇 Update service reviews locally
                setService({
                  ...svc,
                  reviews: [newReview, ...svc.reviews],
                });
                document.getElementById("review_modal").close();
              }}
            />
            <div className="modal-action">
              <form method="dialog">
                <button className="btn">Close</button>
              </form>
            </div>
          </div>
        </dialog>
      </div>

      {/* Reviews */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Customer Reviews</h2>

        {svc.reviews?.length > 0 ? (
          <div className="space-y-4">
            {svc.reviews.map((review, idx) => (
              <div key={idx} className="flex gap-4 border-b pb-4">
                {/* Avatar */}
                <div className="avatar">
                  <div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${
                        review.user?.name || "User"
                      }`}
                      alt={review.user?.name || "User"}
                    />
                  </div>
                </div>

                {/* Review Content */}
                <div className="flex-1">
                  <p className="font-medium text-gray-800">
                    {review.user?.name || "Anonymous"}
                  </p>
                  <p className="text-yellow-500">
                    {"★".repeat(review.rating)}{" "}
                    <span className="text-gray-400">({review.rating})</span>
                  </p>
                  <p className="text-gray-700 mt-1">{review.comment}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(review.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="italic text-gray-500">No reviews yet.</p>
        )}
      </div>
    </div>
  );
}
