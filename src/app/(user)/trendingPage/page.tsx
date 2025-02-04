"use client";
import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";

const TrendingPage = () => {
  const { user, logout } = useContext(AuthContext) ?? {};

  return (
    <div>
      {user ? (
        <>
          <h2>Xin chào, {user.name}!</h2>
          <button onClick={logout}>Đăng xuất</button>
        </>
      ) : (
        <p>Bạn chưa đăng nhập</p>
      )}
    </div>
  );
};

export default TrendingPage;
