import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useRef, useEffect } from "react";
import { Transition } from "@headlessui/react";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";
export default function Navbar() {
  const { cart } = useCart();
  const { user, token, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [ddOpen, setDdOpen] = useState(false);
  const ddRef = useRef(null);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  useEffect(() => {
    const fn = (e) => {
      if (ddRef.current && !ddRef.current.contains(e.target)) setDdOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/services?search=${search}`);
  };

  return (
    <header className="bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 shadow-md sticky top-0 z-50 text-white">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold">
          UrbanLite
        </Link>

        <nav className="hidden md:flex items-center gap-6 font-medium">
          <Link to="/" className="hover:text-gray-200">
            Home
          </Link>
          <Link to="/services" className="hover:text-gray-200">
            Services
          </Link>
          <Link to="/about" className="hover:text-indigo-600">
            About
          </Link>
          <Link to="/contact" className="hover:text-indigo-600">
            Contact
          </Link>
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center bg-white rounded-md overflow-hidden"
          >
            <input
              type="text"
              placeholder="Search services…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-1 text-black focus:outline-none"
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white px-3 hover:bg-indigo-700"
            >
              Go
            </button>
          </form>

          <Link to="/cart" className="relative">
            <FaShoppingCart className="text-xl" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-3 bg-red-600 text-white text-xs px-1.5 rounded-full">
                {cart.length}
              </span>
            )}
          </Link>

          {!token ? (
            <>
              <Link to="/login" className="hover:text-gray-200">
                Login
              </Link>
              <Link to="/register" className="hover:text-gray-200">
                Register
              </Link>
            </>
          ) : (
            <div className="relative" ref={ddRef}>
              <button
                onClick={() => setDdOpen((o) => !o)}
                className="flex items-center gap-2"
              >
                <img
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                  alt="avatar"
                  className="w-8 h-8 rounded-full"
                />
                <span>{user.name}</span>
              </button>

              <Transition
                show={ddOpen}
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-in"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
              >
                <div className="absolute right-0 mt-2 w-44 bg-white text-black rounded shadow-lg">
                  <Link
                    to={`/dashboard/${user.role}`}
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setDdOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </Transition>
            </div>
          )}
        </nav>

        <button
          className="md:hidden text-white text-xl"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? "✖" : "☰"}
        </button>
      </div>

      <Transition
        show={mobileOpen}
        enter="transition ease-out duration-200"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-150"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <nav className="md:hidden bg-white text-black px-6 pb-4 space-y-3">
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center bg-gray-100 rounded overflow-hidden"
          >
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-2 w-full focus:outline-none"
            />
            <button type="submit" className="bg-indigo-500 text-white px-4">
              Go
            </button>
          </form>
          <Link to="/" onClick={() => setMobileOpen(false)}>
            Home
          </Link>
          <Link to="/services" onClick={() => setMobileOpen(false)}>
            Services
          </Link>
          <Link to="/about" className="hover:text-indigo-600">
            About
          </Link>
          <Link to="/contact" className="hover:text-indigo-600">
            Contact
          </Link>

          <Link to="/cart" className="relative">
            Cart
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-3 bg-red-500 text-white text-xs px-1 rounded-full">
                {cart.length}
              </span>
            )}
          </Link>

          {!token ? (
            <>
              <Link to="/login" onClick={() => setMobileOpen(false)}>
                Login
              </Link>
              <Link to="/register" onClick={() => setMobileOpen(false)}>
                Register
              </Link>
            </>
          ) : (
            <>
              <Link
                to={`/dashboard/${user.role}`}
                onClick={() => setMobileOpen(false)}
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileOpen(false);
                }}
                className="block text-left w-full text-red-600"
              >
                Logout
              </button>
            </>
          )}
        </nav>
      </Transition>
    </header>
  );
}
