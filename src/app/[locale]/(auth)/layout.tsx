import "../../globals.css";
import LoginBackground from "@/components/layout/login/bg";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontozugang | Econelo",
  description: "Login und Registrierung bei Econelo.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen w-screen overflow-hidden overflow-y-scroll min-h-screen">
      <main className="flex-1 relative">
        <div className="[&>a]:hidden!">
          {/* Background animation */}
          <LoginBackground />
          {children}
        </div>
      </main>
    </div>
  );
}
