"use client";

import { authClient } from "@/lib/auth-client";
import { useTranslations } from "next-intl";

export default function AdminLoginPage() {
  const t = useTranslations();

  const handleLogin = () => {
    authClient.signIn.oauth2({
      providerId: "keycloak",
      callbackURL: "/admin",
    });
  };

  return (
    <div className="flex flex-col items-center w-11/12 md:w-3/4 lg:w-7/12 mx-auto mt-14">
      <h1 className="text-black text-4xl font-semibold my-4">
        {t("admin_loginTitle")}
      </h1>
      <button
        onClick={handleLogin}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        {t("admin_signInWithKeycloak")}
      </button>
    </div>
  );
}
