import React from "react";
import Topbar from "../global/Topbar";
import SecretarySidebar from "./SecretarySidebar";
import { Outlet } from "react-router-dom";

const SecretaryAll = () => {
  return (
    <div className="app">
      <SecretarySidebar />
      <main className="content">
        <Topbar />
        <Outlet />
      </main>
    </div>
  );
};

export default SecretaryAll;
