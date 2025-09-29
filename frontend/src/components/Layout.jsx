import Header from "./Header";
import Footer from "./Footer";
import { Outlet, useLocation } from "react-router-dom";

export default function Layout() {
  const { pathname } = useLocation();
  const isHomePage = pathname === "/";

  return (
    <>
      <Header />
      {/* Nếu là trang chủ thì không cần container để giữ full width */}
      <div className={isHomePage ? "" : "container mx-auto px-4 py-6"}>
        <Outlet />
      </div>
      <Footer />
    </>
  );
}
