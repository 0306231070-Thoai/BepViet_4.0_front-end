import React, { useEffect, useState } from "react";

const Following = () => {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");

  /* ================= FETCH FOLLOWING ================= */
  useEffect(() => {
    fetch("http://localhost:8000/api/following", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          setUsers([]);
        }
      })
      .catch(() => setUsers([]));
  }, [token]);

  /* ================= UNFOLLOW ================= */
  const handleUnfollow = async (userId) => {
    if (!window.confirm("Huỷ theo dõi người này?")) return;

    try {
      const res = await fetch(
        `http://localhost:8000/api/follow/${userId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      const data = await res.json();

      // nếu đã unfollow thì xoá khỏi list
      if (data.isFollowing === false) {
        setUsers(prev => prev.filter(u => u.id !== userId));
      }
    } catch (err) {
      console.error("Unfollow error:", err);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="container mt-4">
      <h4>Đang theo dõi</h4>

      {users.length === 0 && (
        <p className="text-muted">Bạn chưa theo dõi ai</p>
      )}

      {users.map(u => (
        <div
          key={u.id}
          className="d-flex align-items-center border-bottom py-2"
        >
          <img
            src={u.avatar || "https://i.pravatar.cc/40"}
            alt=""
            className="rounded-circle me-3"
            width={40}
            height={40}
          />

          <strong>{u.username}</strong>

          <button
            className="btn btn-outline-danger btn-sm ms-auto"
            onClick={() => handleUnfollow(u.id)}
          >
            Huỷ theo dõi
          </button>
        </div>
      ))}
    </div>
  );
};

export default Following;
