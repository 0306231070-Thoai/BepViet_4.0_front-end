import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Tạo Context
const AuthContext = createContext();

// 2. Tạo Provider (người cung cấp dữ liệu)
export const AuthProvider = ({ children }) => {
  // Trạng thái đăng nhập (mặc định lấy từ localStorage xem có chưa)
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

  // Hàm Đăng nhập
  const login = () => {
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
    alert("Đăng nhập thành công! (Giả lập)");
  };

  // Hàm Đăng xuất
  const logout = () => {
    setIsLoggedIn(false);
    localStorage.setItem("isLoggedIn", "false");
    alert("Đã đăng xuất.");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);