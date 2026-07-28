import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { decrypt, getSessionCookieValue } from "@/lib/session";

export const verifySession = cache(async () => {
  const cookie = await getSessionCookieValue();
  const session = await decrypt(cookie);

  if (!session?.userId) {
    redirect("/admin/login");
  }

  return session;
});
