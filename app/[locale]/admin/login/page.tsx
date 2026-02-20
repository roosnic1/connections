"use client";

import { authClient } from "@/lib/auth-client";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function AdminLoginPage() {
  const t = useTranslations();
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setError(null);
    try {
      const result = await authClient.signIn.oauth2({
        providerId: "keycloak",
        callbackURL: "/admin",
      });
      if (result?.error) {
        console.error("Login error:", result.error);
        setError(result.error.message ?? t("admin_loginError"));
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(t("admin_loginError"));
    }
  };

  return (
    <div className="flex flex-col items-center w-11/12 md:w-3/4 lg:w-7/12 mx-auto mt-14">
      <h1 className="text-black text-4xl font-semibold my-4">
        {t("admin_loginTitle")}
      </h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <button
        onClick={handleLogin}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        {t("admin_signInWithKeycloak")}
      </button>
    </div>
  );
}
