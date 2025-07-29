import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Services from "./pages/Services";
import ProtectedRoute from "./routes/ProtectedRoute";
import UserDash from "./pages/Dashboard/UserDash";
import ProviderDash from "./pages/Dashboard/ProviderDash";
import AdminDash from "./pages/Dashboard/AdminDash";
import Navbar from "./components/Navbar";
import ServiceDetails from "./pages/ServiceDetails";
import CreateService from "./pages/Provider/CreateService";
import UserTable from "./pages/Dashboard/Tables/UserTable";
import ProvidersTable from "./pages/Dashboard/Tables/ProvidersTable";
import ServicesTable from "./pages/Dashboard/Tables/ServicesTable";
import BookingsTable from "./pages/Dashboard/Tables/BookingsTable";
import CategoriesTable from "./pages/Dashboard/Tables/CategoriesTable";
import ProviderProfile from "./pages/ProviderProfile";
import EditProviderProfile from "./pages/EditProviderProfile";
import DashboardHome from "./pages/Dashboard/DashboardHome";
import CartPage from "./pages/CartPage";
import PaymentPage from "./pages/PaymentPage";
import Footer from "./components/Footer";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import About from "./pages/About";
import { Toaster } from "react-hot-toast";
import "./index.css"; // or './App.css'
import PaymentFailure from "./pages/PaymentFailure";
import PaymentSuccess from "./pages/PaymentSuccess";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:id" element={<ServiceDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-failure" element={<PaymentFailure />} />
        {/* Provider routes */}
        <Route
          path="/dashboard/provider"
          element={
            <ProtectedRoute allowedRoles={["provider"]}>
              <ProviderDash />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/provider/create"
          element={
            <ProtectedRoute allowedRoles={["provider"]}>
              <CreateService />
            </ProtectedRoute>
          }
        />
        <Route
          path="/provider/:providerId/edit"
          element={
            <ProtectedRoute allowedRoles={["provider", "admin"]}>
              <EditProviderProfile />
            </ProtectedRoute>
          }
        />
        <Route path="/provider/:providerId" element={<ProviderProfile />} />

        {/* User dashboard */}
        <Route
          path="/dashboard/user"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserDash />
            </ProtectedRoute>
          }
        />

        {/* Admin dashboard */}
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDash />
            </ProtectedRoute>
          }
        >
          {/* all admin routes are children */}
          <Route index element={<DashboardHome />} />
          <Route path="user" element={<UserTable />} />
          <Route path="providers" element={<ProvidersTable />} />
          <Route path="services" element={<ServicesTable />} />
          <Route path="bookings" element={<BookingsTable />} />
          <Route path="categories" element={<CategoriesTable />} />
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
