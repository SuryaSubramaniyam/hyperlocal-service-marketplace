import { useCart } from "../context/CartContext";
import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function PaymentPage() {
  const { cart } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: "",
    paymentMethod: "razorpay",
  });

  const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCODBooking = async () => {
    try {
      const bookingData = {
        services: cart.map((s) => s._id),
        address: form.address,
        phone: form.phone,
        paymentMethod: "cod",
      };

      await API.post("/bookings", bookingData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Booking placed with Cash on Delivery!");
      navigate("/dashboard/user");
    } catch (err) {
      toast.error(err.response?.data?.message || "COD booking failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !token) return navigate("/login");
    if (cart.length === 0) return toast.error("Your cart is empty");

    if (form.paymentMethod === "cod") {
      return handleCODBooking();
    }

    // 🔁 Razorpay flow
    try {
      const razorpayLoaded = await loadRazorpayScript();
      if (!razorpayLoaded) {
        return toast.error("Razorpay SDK failed to load. Please try again.");
      }

      const { data: order } = await API.post(
        "/payment/razorpay-order",
        { amount: totalAmount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const razorpay = new window.Razorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Hyperlocal Service",
        description: "Service Booking Payment",
        image: "https://yourdomain.com/logo.svg", // Replace with your deployed domain

        order_id: order.id,
        handler: async function (response) {
          try {
            await API.post(
              "/bookings",
              {
                services: cart.map((s) => s._id),
                address: form.address,
                phone: form.phone,
                paymentMethod: "razorpay",
                paymentInfo: response,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Payment successful! Booking confirmed.");
            navigate("/dashboard/user");
          } catch (err) {
            toast.error(err.response?.data?.message || "Booking failed");
          }
        },
        prefill: {
          name: form.name,
          email: user?.email,
          contact: form.phone,
        },
        theme: {
          color: "#6366f1",
        },
      });

      razorpay.on("payment.failed", function (response) {
        console.error("Payment failed:", response.error);
        toast.error("Payment failed. Please try again.");
      });

      razorpay.open();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Payment failed to initialize"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 py-10 px-4">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 bg-white rounded-2xl shadow-lg p-6">
        {/* 🧾 Booking Form */}
        <div className="md:col-span-2 space-y-5">
          <h2 className="text-2xl font-bold text-indigo-700 mb-4">
            Confirm Your Booking
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full border border-gray-300 p-3 rounded-md"
              required
            />
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full border border-gray-300 p-3 rounded-md"
              required
            />
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              rows={3}
              placeholder="Address"
              className="w-full border border-gray-300 p-3 rounded-md"
              required
            />

            {/* 💳 Payment Method */}
            <div className="mt-4">
              <p className="font-semibold mb-2">Select Payment Method</p>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="razorpay"
                    checked={form.paymentMethod === "razorpay"}
                    onChange={handleChange}
                  />
                  <span className="flex items-center gap-2">
                    <img
                      src="/razorpay-logo.svg"
                      alt="Razorpay"
                      className="w-5 h-5"
                    />
                    Pay with Razorpay
                  </span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={form.paymentMethod === "cod"}
                    onChange={handleChange}
                  />
                  <span className="flex items-center gap-2">
                    <img src="/cash-icon.svg" alt="COD" className="w-5 h-5" />
                    Cash on Delivery
                  </span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-md mt-6 font-medium"
            >
              Confirm Booking
            </button>
          </form>
        </div>

        {/* 🛒 Cart Summary */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <h3 className="text-xl font-bold mb-4 text-gray-700">Your Cart</h3>
          {cart.length === 0 ? (
            <p className="text-gray-500 text-sm">Your cart is empty.</p>
          ) : (
            <ul className="space-y-3">
              {cart.map((item) => (
                <li
                  key={item._id}
                  className="flex justify-between text-sm text-gray-700"
                >
                  <span>{item.title}</span>
                  <span>₹{item.price}</span>
                </li>
              ))}
            </ul>
          )}
          <hr className="my-4" />
          <div className="flex justify-between font-semibold text-lg text-gray-800">
            <span>Total</span>
            <span>₹{totalAmount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
