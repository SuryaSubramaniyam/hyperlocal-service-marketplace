export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-8">
        <h1 className="text-3xl font-bold text-indigo-600 mb-6">
          Privacy Policy
        </h1>

        <p className="text-gray-700 mb-4">
          At UrbanLite, we value your privacy. This policy outlines what data we
          collect, how we use it, and your rights.
        </p>

        <h2 className="text-lg font-semibold mt-6">Information We Collect</h2>
        <ul className="list-disc pl-6 text-gray-600 mt-2 space-y-1">
          <li>Your name, email, and contact details during registration</li>
          <li>Booking and service preferences</li>
          <li>Reviews and feedback you submit</li>
        </ul>

        <h2 className="text-lg font-semibold mt-6">How We Use Your Data</h2>
        <ul className="list-disc pl-6 text-gray-600 mt-2 space-y-1">
          <li>To provide and improve our services</li>
          <li>To communicate with you regarding bookings and support</li>
          <li>To personalize your experience</li>
        </ul>

        <h2 className="text-lg font-semibold mt-6">Your Rights</h2>
        <p className="text-gray-600 mt-2">
          You can update your data anytime, or request deletion by contacting us
          at{" "}
          <a
            href="mailto:support@urbanlite.com"
            className="text-indigo-500 underline"
          >
            support@urbanlite.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}
