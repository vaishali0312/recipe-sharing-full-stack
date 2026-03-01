import { useState, useEffect } from "react";
import API from "../services/api";
import { useToast } from "../components/Toast";

export default function RecipeCollaboration({ recipeId, currentUser }) {
  const { addToast } = useToast();
  const [collaborators, setCollaborators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCollaborator, setNewCollaborator] = useState({ email: "", role: "editor" });

  useEffect(() => {
    fetchCollaborators();
  }, [recipeId]);

  const fetchCollaborators = async () => {
    try {
      const res = await API.get(`/collaboration/recipes/${recipeId}/collaborators`);
      setCollaborators(res.data?.data || []);
    } catch (err) {
      console.error("Error fetching collaborators:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCollaborator = async (e) => {
    e.preventDefault();
    try {
      // In a real app, you'd lookup user by email first
      // For now, we'll use the email as a placeholder user ID
      const userId = newCollaborator.email.split("@")[0];
      
      await API.post(`/collaboration/recipes/${recipeId}/collaborators`, {
        userId: userId,
        role: newCollaborator.role
      });
      
      addToast("Collaborator added successfully!", "success");
      setShowAddForm(false);
      setNewCollaborator({ email: "", role: "editor" });
      fetchCollaborators();
    } catch (err) {
      console.error("Error adding collaborator:", err);
      addToast(err.response?.data?.message || "Failed to add collaborator", "error");
    }
  };

  const handleRemoveCollaborator = async (collabId) => {
    if (!confirm("Are you sure you want to remove this collaborator?")) return;
    
    try {
      await API.delete(`/collaboration/recipes/${recipeId}/collaborators/${collabId}`);
      addToast("Collaborator removed successfully!", "success");
      fetchCollaborators();
    } catch (err) {
      console.error("Error removing collaborator:", err);
      addToast("Failed to remove collaborator", "error");
    }
  };

  const handleUpdateRole = async (collabId, newRole) => {
    try {
      await API.put(`/collaboration/recipes/${recipeId}/collaborators/${collabId}`, {
        role: newRole
      });
      addToast("Role updated successfully!", "success");
      fetchCollaborators();
    } catch (err) {
      console.error("Error updating role:", err);
      addToast("Failed to update role", "error");
    }
  };

  if (!currentUser) {
    return null; // Only show for logged-in users
  }

  return (
    <div className="mt-8 border-t pt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Recipe Collaboration</h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-3 py-1 bg-orange-500 text-white text-sm rounded hover:bg-orange-600"
        >
          + Add Collaborator
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddCollaborator} className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                Collaborator Email
              </label>
              <input
                type="email"
                placeholder="collaborator@example.com"
                className="input"
                value={newCollaborator.email}
                onChange={(e) => setNewCollaborator({ ...newCollaborator, email: e.target.value })}
                required
              />
            </div>
            <div className="w-32">
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                Role
              </label>
              <select
                className="input"
                value={newCollaborator.role}
                onChange={(e) => setNewCollaborator({ ...newCollaborator, role: e.target.value })}
              >
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-gray-500">Loading collaborators...</p>
      ) : collaborators.length === 0 ? (
        <p className="text-gray-500 text-sm">No collaborators yet. Add someone to collaborate on this recipe!</p>
      ) : (
        <div className="space-y-2">
          {collaborators.map((collab) => (
            <div
              key={collab.id}
              className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border"
            >
              <div>
                <p className="font-medium">{collab.userId || collab.email || "Unknown User"}</p>
                <p className="text-sm text-gray-500">
                  Role: 
                  <select
                    value={collab.role}
                    onChange={(e) => handleUpdateRole(collab.id, e.target.value)}
                    className="ml-1 text-sm bg-transparent border-none cursor-pointer"
                  >
                    <option value="editor">Editor</option>
                    <option value="viewer">Viewer</option>
                    <option value="owner">Owner</option>
                  </select>
                </p>
              </div>
              <button
                onClick={() => handleRemoveCollaborator(collab.id)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
