import "../../globals.css";
import LoginBackground from "@/components/layout/login/bg";

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
