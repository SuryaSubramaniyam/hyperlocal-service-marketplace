import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import successAnim from "../assets/animations/success.json"; // download a Lottie animation

export default function Success() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/dashboard/user");
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center bg-white px-4">
      <Lottie
        animationData={successAnim}
        loop={false}
        style={{ height: 250 }}
      />
      <h1 className="text-3xl font-bold text-green-600 mt-4">Thank You!</h1>
      <p className="text-gray-600 mt-2">Your booking has been confirmed.</p>
    </div>
  );
}
