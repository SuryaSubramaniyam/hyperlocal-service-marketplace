// components/StarRating.jsx
export default function StarRating({ rating = 0, outOf = 5 }) {
  return (
    <div className="flex items-center space-x-1">
      {Array.from({ length: outOf }).map((_, i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${
            i < rating ? "text-yellow-400" : "text-gray-300"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.562-.955L10 0l2.95 5.955 6.562.955-4.756 4.635 1.122 6.545z" />
        </svg>
      ))}
    </div>
  );
}
