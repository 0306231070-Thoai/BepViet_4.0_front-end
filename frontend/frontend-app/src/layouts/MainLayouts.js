import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Layout/Sidebar';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/footer';

const MainLayout = () => {
  return (
    <div id="wrapper">
      <Sidebar />
      <div id="page-content-wrapper">
        <Navbar />
        <div className="container-fluid px-0 flex-grow-1">
          {/* Outlet là nơi HomePage hoặc các trang con khác hiển thị */}
          <Outlet /> 
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;