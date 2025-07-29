export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-xl p-8">
        <h1 className="text-4xl font-bold text-indigo-600 mb-6">
          About UrbanLite
        </h1>

        <p className="text-gray-700 text-lg mb-6">
          UrbanLite is a modern hyperlocal service marketplace connecting users
          with trusted service providers near them. Whether you need a plumber,
          cleaner, electrician, or any home service — we've got you covered.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div>
            <h2 className="text-2xl font-semibold text-indigo-500 mb-2">
              🌟 Our Mission
            </h2>
            <p className="text-gray-600">
              To simplify your daily life by providing reliable, on-demand home
              services through technology and local talent. We aim to empower
              service professionals while making home maintenance hassle-free
              for customers.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-indigo-500 mb-2">
              🤝 Why Choose Us
            </h2>
            <ul className="list-disc pl-5 text-gray-600 space-y-1">
              <li>Verified and trained service professionals</li>
              <li>Real-time booking and secure payments</li>
              <li>Transparent pricing with no hidden fees</li>
              <li>24/7 customer support</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 text-center">
          <h2 className="text-2xl font-semibold text-indigo-500 mb-2">
            💼 Meet Our Team
          </h2>
          <p className="text-gray-600">
            We're a passionate group of developers, designers, and entrepreneurs
            working to revolutionize how local services work — one booking at a
            time.
          </p>
        </div>
      </div>
    </div>
  );
}
