import React, { useContext, useEffect } from "react";
import Topbar from "./global/Topbar";
import Sidebar from "./global/Sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const AllInOne = () => {
  const { roles } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (roles[0] !== "ROLE_ADMIN") {
      navigate("/login");
    }
  }, []);
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
