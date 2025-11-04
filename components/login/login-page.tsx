import LoginBackground from "./bg";
import LoginFormTransparent from "./login-form";

export default function LoginPage() {
  return (
    <section className="relative flex items-center justify-center min-h-screen overflow-hidden login-form">
      {/* Background animation */}
      <LoginBackground />

      {/* Login form */}
      <LoginFormTransparent />
    </section>
  );
}
