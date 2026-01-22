import React, { useEffect, useState } from "react";

const Following = () => {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:8000/api/following", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then(res => res.json())
      .then(data => {
        // ✅ đảm bảo users LUÔN là array
        if (Array.isArray(data)) {
          setUsers(data);
        } else if (Array.isArray(data.data)) {
          setUsers(data.data);
        } else {
          setUsers([]);
        }
      })
      .catch(() => setUsers([]));
  }, [token]);

  return (
    <div className="container mt-4">
      <h4>Đang theo dõi</h4>

      {users.length === 0 && (
        <p className="text-muted">Chưa theo dõi ai</p>
      )}

      {users.map(u => (
        <div key={u.id} className="d-flex align-items-center mb-2">
          <img
            src={u.avatar || "https://i.pravatar.cc/40"}
            alt=""
            className="rounded-circle me-2"
            width={40}
            height={40}
          />
          <span>{u.username}</span>
        </div>
      ))}
    </div>
  );
};

export default Following;
