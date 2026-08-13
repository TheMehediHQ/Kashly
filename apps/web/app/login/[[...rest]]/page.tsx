"use client";

import { SignIn } from "@clerk/nextjs";

const Login = () => {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-[#0B0F17]">
      <SignIn />
    </div>
  );
};

export default Login;
