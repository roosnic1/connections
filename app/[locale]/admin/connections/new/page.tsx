import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ConnectionForm from "../../_components/connection-form";

export default async function NewConnectionPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="w-11/12 md:w-3/4 lg:w-7/12 mx-auto mt-14">
      <h1 className="text-black text-4xl font-semibold mb-6">New Connection</h1>
      <div className="bg-gray-100 rounded-lg p-6">
        <ConnectionForm />
      </div>
    </div>
  );
}
