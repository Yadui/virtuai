import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export const getSession = () => getServerSession(authOptions);

export const getCurrentUserId = async (): Promise<string | null> => {
  const session = await getSession();
  return session?.user?.id ?? null;
};

export const getCurrentUser = async () => {
  const session = await getSession();
  return session?.user ?? null;
};
