import { useState } from "react";
import API from "../../services/api";
import { toast } from "react-hot-toast";

export default function ReviewForm({ serviceId, onSubmit }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post(`/reviews/${serviceId}`, { rating, comment });
      toast.success("Review submitted");
      onSubmit({ ...res.data, createdAt: new Date() }); // Ensure createdAt exists
      setComment("");
      setRating(5);
      document.getElementById("review_modal").close();
    } catch (err) {
      console.error(err.response || err);
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1 font-medium">Rating</label>
        <div className="flex space-x-2">
          {[1, 2, 3, 4, 5].map((r) => (
            <span
              key={r}
              onClick={() => setRating(r)}
              className={`cursor-pointer text-2xl ${
                r <= rating ? "text-yellow-400" : "text-gray-300"
              }`}
            >
              ★
            </span>
          ))}
        </div>
      </div>

      <div>
        <label className="block mb-1 font-medium">Comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows="3"
          className="textarea textarea-bordered w-full"
          placeholder="Write your feedback…"
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
