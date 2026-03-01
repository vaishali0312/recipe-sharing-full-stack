import { useState, useEffect, useContext } from "react";
import { getForumPosts, createForumPost, deleteForumPost, replyToPost, likePost } from "../services/recipeService";
import { AuthContext } from "../context/AuthContext";

export default function Forum() {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("General");
  const [loading, setLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");

  const categories = ["General", "Tips & Tricks", "Questions", "Recipes", "Cooking Help"];

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await getForumPosts();
      setPosts(res.data || []);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      await createForumPost({ title, content, category });
      setTitle("");
      setContent("");
      fetchPosts();
    } catch (err) {
      console.error("Error creating post:", err);
      alert("Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    
    try {
      await deleteForumPost(postId);
      fetchPosts();
      alert("Post deleted successfully!");
    } catch (err) {
      console.error("Error deleting post:", err);
      alert(err.response?.data?.message || "Failed to delete post");
    }
  };

  const handleReply = async (postId) => {
    if (!replyContent.trim()) return;
    
    try {
      await replyToPost(postId, { content: replyContent });
      setReplyingTo(null);
      setReplyContent("");
      fetchPosts();
    } catch (err) {
      console.error("Error replying:", err);
      alert("Failed to add reply");
    }
  };

  const handleLike = async (postId) => {
    try {
      await likePost(postId);
      fetchPosts();
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const canDelete = (post) => {
    // Can delete if user is the post owner
    return user && post.userId === user.id;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Community Forum</h1>

      {/* Create Post Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Create a New Post</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title (optional)"
            className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg mb-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          
          <select
            className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg mb-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          
          <textarea
            className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg mb-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Share tips, ask questions, or start a discussion..."
            rows="4"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold px-6 py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </form>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8 bg-white dark:bg-gray-800 rounded-lg p-6">No posts yet. Be the first to start a discussion!</p>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <span className="text-xs bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 px-2 py-1 rounded font-medium">
                    {post.category}
                  </span>
                  <h3 className="text-lg font-semibold mt-2 text-gray-900 dark:text-white">
                    {post.title || "Discussion"}
                  </h3>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleLike(post.id)}
                    className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition"
                  >
                    <span>❤️</span>
                    <span className="text-sm">{post.likes || 0}</span>
                  </button>
                  {canDelete(post) && (
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition p-1"
                      title="Delete post"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 mb-3 whitespace-pre-wrap">{post.content}</p>
              
              <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                <span className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {post.userName || "Anonymous"}
                </span>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>

              {/* Replies */}
              {post.replies && post.replies.length > 0 && (
                <div className="ml-4 pl-4 border-l-2 border-orange-200 dark:border-orange-800 space-y-3 mb-4">
                  {post.replies.map((reply) => (
                    <div key={reply.id} className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                      <p className="text-sm text-gray-700 dark:text-gray-300">{reply.content}</p>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {reply.userName || "Anonymous"} • {new Date(reply.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Button/Form */}
              {replyingTo === post.id ? (
                <div className="mt-2">
                  <textarea
                    className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Write a reply..."
                    rows="2"
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleReply(post.id)}
                      className="bg-orange-500 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-orange-600 transition shadow-sm"
                    >
                      Reply
                    </button>
                    <button
                      onClick={() => { setReplyingTo(null); setReplyContent(""); }}
                      className="text-gray-500 dark:text-gray-400 px-4 py-1.5 text-sm hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setReplyingTo(post.id)}
                  className="text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 text-sm font-medium"
                >
                  Reply to this post
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
