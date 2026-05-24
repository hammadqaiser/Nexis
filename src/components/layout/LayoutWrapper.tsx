"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <>
      {!isAdmin && <Header />}
      <main style={!isAdmin ? { marginTop: "80px", flex: "1 0 auto", display: "flex", flexDirection: "column" } : { height: "100vh", margin: 0 }}>
        {children}
      </main>
      {!isAdmin && <Footer />}
    </>
  );
}
