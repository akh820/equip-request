import { Outlet } from "react-router";
import Footer from "./Footer";
import Header from "./Header";

export default function BasicLayout() {
  return (
    <div className="bg-neutral-100 text-neutral-700 min-h-screen flex flex-col text-sm">
      <Header />

      {/* Body */}
      <main className="flex-1 bg-neutral-100">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
