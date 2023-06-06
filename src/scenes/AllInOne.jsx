import React from "react";
import Topbar from "./global/Topbar";
import Sidebar from "./global/Sidebar";
import { Outlet } from "react-router-dom";

const AllInOne = () => {
  return (
    <div className="app">
      <Sidebar />
      <main className="content">
        <Topbar />
        <Outlet />
      </main>
    </div>
  );
};

export default AllInOne;
