export default function Contact() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-3xl font-bold text-indigo-600 mb-4">Contact Us</h1>
        <p className="text-gray-600 mb-6">
          Have questions, feedback, or need support? Reach out to us using the
          form below or email us at:
          <br />
          <a
            href="mailto:support@urbanlite.com"
            className="text-indigo-500 underline"
          >
            support@urbanlite.com
          </a>
        </p>

        <form className="space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full border rounded-lg px-4 py-2"
          />
          <input
            type="email"
            placeholder="Your Email"
            className="w-full border rounded-lg px-4 py-2"
          />
          <textarea
            placeholder="Your Message"
            rows="5"
            className="w-full border rounded-lg px-4 py-2"
          ></textarea>

          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
