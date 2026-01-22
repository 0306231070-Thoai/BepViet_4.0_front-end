import React, { useEffect, useState } from "react";
import RecipeCard from "../../components/Recipe/RecipeCard";

function MyRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Token cố định để test
  const token = "YiTJ3oZgIt";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/recipes/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setRecipes(data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const handleDeleteFromList = (id) => {
    setRecipes((prev) => prev.filter((recipe) => recipe.id !== id));
  };

  return (
    <div className="container py-4">
      <h3 className="fw-bold mb-4 text-center">🍳 Bếp của tôi</h3>

      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "200px" }}>
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      ) : recipes.length === 0 ? (
        <p className="text-muted text-center">Bạn chưa có công thức nào.</p>
      ) : (
        <div className="row g-3">
          {recipes.map((recipe) => (
            <div className="col-12 col-md-6 col-lg-4" key={recipe.id}>
              <RecipeCard {...recipe} onDelete={handleDeleteFromList} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyRecipes;
