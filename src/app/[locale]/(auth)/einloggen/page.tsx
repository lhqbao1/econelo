import LoginFormTransparent from "@/components/layout/login/login-form";

const LoginPage = () => {
  return (
    <section className="relative flex items-center justify-center min-h-screen overflow-hidden login-form">
      {/* Login form */}
      <LoginFormTransparent />
    </section>
  );
};

export default LoginPage;
