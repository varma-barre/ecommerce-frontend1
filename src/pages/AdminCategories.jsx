import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../config/api";

function AdminCategories() {

  // Get the currently active JWT token
  // from AuthContext
  const { token } = useAuth();

  const [categories, setCategories] = useState([]);

  const [name, setName] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  // Loading state for Create / Update
  const [saving, setSaving] = useState(false);

  // Loading state for Delete
  const [deletingId, setDeletingId] = useState(null);


  // =========================
  // GET CATEGORIES
  // =========================

  const fetchCategories = async () => {

    try {

      setLoading(true);
      setError("");

      const response = await fetch(
       `${API_URL}/api/categories`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch categories"
        );
      }

      setCategories(data.categories || []);

    } catch (error) {

      console.error(
        "Fetch categories error:",
        error
      );

      setError(error.message);

    } finally {

      setLoading(false);

    }
  };


  // =========================
  // LOAD CATEGORIES
  // =========================

  useEffect(() => {

    // Wait until AuthContext
    // provides the token
    if (token) {
      fetchCategories();
    }

  }, [token]);


  // =========================
  // CREATE / UPDATE CATEGORY
  // =========================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");


    // Check category name
    if (!name.trim()) {

      setError(
        "Category name is required"
      );

      return;
    }


    // Check token from AuthContext
    if (!token) {

      setError(
        "Invalid or Expired Token"
      );

      return;
    }


    try {

      setSaving(true);


      const url = editingId
        ? `${API_URL}/api/categories/${editingId}`
        : `${API_URL}/api/categories`;


      const method = editingId
        ? "PUT"
        : "POST";


      const response = await fetch(
        url,
        {
          method: method,

          headers: {
            "Content-Type": "application/json",

            // Send the active JWT token
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify({
            name: name.trim()
          })
        }
      );


      const data = await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Something went wrong"
        );
      }


      // =========================
      // SUCCESS MESSAGE
      // =========================

      if (editingId) {

        setSuccess(
          data.message ||
          "Category updated successfully"
        );

      } else {

        setSuccess(
          data.message ||
          "Category created successfully"
        );

      }


      // Clear form
      setName("");

      setEditingId(null);


      // Refresh categories
      await fetchCategories();


    } catch (error) {

      console.error(
        "Category save error:",
        error
      );

      setError(error.message);

    } finally {

      setSaving(false);

    }
  };


  // =========================
  // EDIT CATEGORY
  // =========================

  const handleEdit = (category) => {

    setName(category.name);

    setEditingId(category._id);

    setError("");

    setSuccess("");
  };


  // =========================
  // CANCEL EDIT
  // =========================

  const handleCancel = () => {

    setName("");

    setEditingId(null);

    setError("");

    setSuccess("");
  };


  // =========================
  // DELETE CATEGORY
  // =========================

  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?"
    );


    if (!confirmDelete) {
      return;
    }


    // Check token from AuthContext
    if (!token) {

      setError(
        "Invalid or Expired Token"
      );

      return;
    }


    try {

      setError("");

      setSuccess("");

      setDeletingId(id);


      const response = await fetch(
        `${API_URL}/api/categories/${id}`,
        {
          method: "DELETE",

          headers: {

            // Send active JWT token
            Authorization: `Bearer ${token}`
          }
        }
      );


      const data = await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to delete category"
        );
      }


      setSuccess(
        data.message ||
        "Category deleted successfully"
      );


      // Refresh categories
      await fetchCategories();


    } catch (error) {

      console.error(
        "Delete category error:",
        error
      );

      setError(error.message);

    } finally {

      setDeletingId(null);

    }
  };


  return (
    <div className="admin-categories">

      <h1>Category Management</h1>


      {/* =========================
          CREATE / EDIT FORM
      ========================= */}

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Enter category name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />


        <button
          type="submit"
          disabled={saving}
        >

          {saving
            ? "Saving..."
            : editingId
            ? "Update Category"
            : "Add Category"}

        </button>


        {editingId && (

          <button
            type="button"
            onClick={handleCancel}
            disabled={saving}
          >
            Cancel
          </button>

        )}

      </form>


      {/* =========================
          ERROR MESSAGE
      ========================= */}

      {error && (

        <p className="error-message">
          {error}
        </p>

      )}


      {/* =========================
          SUCCESS MESSAGE
      ========================= */}

      {success && (

        <p className="success-message">
          {success}
        </p>

      )}


      {/* =========================
          CATEGORY LIST
      ========================= */}

      <h2>Categories</h2>


      {loading ? (

        <p className="loading-message">
          Loading categories...
        </p>

      ) : categories.length === 0 ? (

        <p className="empty-message">
          No categories found.
        </p>

      ) : (

        <div className="category-list">

          {categories.map((category) => (

            <div
              key={category._id}
              className="category-item"
            >

              <span>
                {category.name}
              </span>


              <div>

                {/* EDIT */}

                <button
                  onClick={() =>
                    handleEdit(category)
                  }
                  disabled={
                    saving ||
                    deletingId !== null
                  }
                >
                  Edit
                </button>


                {/* DELETE */}

                <button
                  onClick={() =>
                    handleDelete(category._id)
                  }
                  disabled={
                    deletingId === category._id ||
                    saving
                  }
                >

                  {deletingId === category._id
                    ? "Deleting..."
                    : "Delete"}

                </button>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default AdminCategories;