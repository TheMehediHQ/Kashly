"use client";

import { SignUp } from "@clerk/nextjs";

const Register = () => {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-[#0B0F17]">
      <SignUp />
    </div>
  );
};

export default Register;
