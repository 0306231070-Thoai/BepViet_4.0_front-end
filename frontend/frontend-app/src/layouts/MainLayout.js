
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Layout/Sidebar';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/footer';

const MainLayout = () => {
    // 1. Khai báo state: Sidebar có đang đóng không?
  const [isToggled, setIsToggled] = useState(false);

  // 2. Hàm đảo trạng thái (True -> False và ngược lại)
  const handleToggleSidebar = () => {
    setIsToggled(!isToggled);
  };
  return (
    // 3. Dựa vào state để thêm class "toggled" vào div wrapper
    <div id="wrapper" className={isToggled ? "toggled" : ""}>
      
      {/* Truyền hàm toggle vào Sidebar để nút 3 gạch bên trong gọi được */}
      <Sidebar onToggle={handleToggleSidebar} />

      <div id="page-content-wrapper">
        {/* Truyền hàm toggle vào Navbar (nếu mobile menu nằm ở navbar) */}
        <Navbar onToggle={handleToggleSidebar} /> 
        
        <div className="container-fluid px-0 flex-grow-1">
          <Outlet /> 
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;