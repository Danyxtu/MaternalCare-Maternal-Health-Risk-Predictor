import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAuth } from "../context/AuthContext";

const Layout = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="flex min-h-screen bg-[#e2e8f0] font-sans text-slate-900">
      <Sidebar />
      <main className="flex-1 ml-[230px] p-[32px_32px_32px_28px] flex flex-col gap-[24px]">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
