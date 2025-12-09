import "../../globals.css";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen w-screen overflow-hidden overflow-y-scroll min-h-screen">
      <main className="flex-1 relative grid grid-cols-1 lg:grid-cols-2">
        {/* Background animation */}
        {children}
      </main>
    </div>
  );
}
