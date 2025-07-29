import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function CartPage() {
  const { user } = useAuth();
  const { cart, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  if (!user || user.role !== "user") {
    return <p className="text-center mt-10 text-red-500">Unauthorized</p>;
  }

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const handleProceedToPayment = () => {
    navigate("/payment");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white bg-opacity-80 backdrop-blur-md shadow-2xl rounded-2xl p-6">
        <h1 className="text-3xl font-bold text-indigo-700 mb-6 text-center">
          🛒 Your Cart
        </h1>

        {cart.length === 0 ? (
          <p className="text-center text-gray-600">
            Your cart is empty.{" "}
            <Link to="/" className="text-indigo-600 underline font-medium">
              Browse Services
            </Link>
          </p>
        ) : (
          <>
            <ul className="divide-y divide-gray-300">
              {cart.map((item) => (
                <li
                  key={item._id}
                  className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image || "/placeholder-service.jpg"}
                      alt={item.title}
                      className="w-20 h-20 object-cover rounded-lg shadow"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        {item.title}
                      </h4>
                      <p className="text-sm text-gray-500">₹{item.price}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-sm text-red-600 hover:text-red-800 bg-red-100 px-3 py-1 rounded-md transition"
                  >
                    ✖ Remove
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-8 border-t pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Total: ₹{total}
              </h2>
              <div className="space-x-4">
                <button
                  onClick={clearCart}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow-sm transition"
                >
                  Clear Cart
                </button>
                <button
                  onClick={handleProceedToPayment}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow-sm transition"
                >
                  Proceed to Payment →
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
