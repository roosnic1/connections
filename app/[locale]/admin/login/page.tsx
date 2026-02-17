"use client";

import { authClient } from "@/lib/auth-client";

export default function AdminLoginPage() {
  const handleLogin = () => {
    authClient.signIn.oauth2({
      providerId: "keycloak",
      callbackURL: "/admin",
    });
  };

  return (
    <div className="flex flex-col items-center w-11/12 md:w-3/4 lg:w-7/12 mx-auto mt-14">
      <h1 className="text-black text-4xl font-semibold my-4">Admin Login</h1>
      <button
        onClick={handleLogin}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Sign in with Keycloak
      </button>
    </div>
  );
}
