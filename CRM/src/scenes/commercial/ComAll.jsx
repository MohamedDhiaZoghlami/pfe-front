import React from "react";
import Topbar from "../global/Topbar";
import ComSidebar from "./ComSideBar";
import { Outlet } from "react-router-dom";

const ComAll = () => {
  return (
    <div className="app">
      <ComSidebar />
      <main className="content">
        <Topbar />
        <Outlet />
      </main>
    </div>
  );
};

export default ComAll;
