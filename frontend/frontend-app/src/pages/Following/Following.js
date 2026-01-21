import React, { useEffect, useState } from "react";

const Following = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFollowing();
  }, []);

  const fetchFollowing = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/following", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Lỗi load following", err);
    } finally {
      setLoading(false);
    }
  };

  const avatarUrl = (avatar) =>
    avatar
      ? `http://localhost:8000/storage/${avatar}`
      : "https://via.placeholder.com/80";

  if (loading) {
    return <p className="text-center mt-5">Đang tải...</p>;
  }

  return (
    <div className="container mt-4">
      <h4 className="fw-bold mb-4">Đang theo dõi</h4>

      {users.length === 0 && (
        <p className="text-muted">Bạn chưa theo dõi ai</p>
      )}

      <div className="row">
        {users.map((user) => (
          <div className="col-md-6 mb-3" key={user.id}>
            <div className="card shadow-sm border-0 p-3 d-flex flex-row align-items-center">
              <img
                src={avatarUrl(user.avatar)}
                alt={user.username}
                className="rounded-circle me-3"
                width="60"
                height="60"
              />
              <div>
                <h6 className="mb-0 fw-bold">{user.username}</h6>
                <small className="text-muted">Đang theo dõi</small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Following;
