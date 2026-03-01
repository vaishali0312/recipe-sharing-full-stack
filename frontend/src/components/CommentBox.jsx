import { useState } from "react";

export default function CommentBox({ onSubmit }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    
    setLoading(true);
    try {
      await onSubmit(text);
      setText("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 border-t pt-4">
      <h3 className="font-semibold text-lg mb-2">Comments</h3>
      <textarea
        className="w-full border p-3 rounded-lg dark:bg-gray-700 dark:border-gray-600"
        rows="3"
        placeholder="Write a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        disabled={loading || !text.trim()}
        className="mt-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Posting..." : "Post Comment"}
      </button>
    </div>
  );
}
