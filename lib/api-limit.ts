import prismadb from "@/lib/prismadb";
import { MAX_FREE_COUNTS } from "@/constants";
import { getCurrentUserId } from "@/lib/auth";

export const incrementApiLimit = async () => {
  const userId = await getCurrentUserId();

  if (!userId) {
    return;
  }

  try {
    const userApiLimit = await prismadb.userApiLimit.findUnique({
      where: { userId: userId },
    });

    if (userApiLimit) {
      await prismadb.userApiLimit.update({
        where: { userId: userId },
        data: { count: userApiLimit.count + 1 },
      });
    } else {
      await prismadb.userApiLimit.create({
        data: { userId: userId, count: 1 },
      });
    }
  } catch {
    console.warn("[API_LIMIT_INCREMENT_FALLBACK] Usage data unavailable; skipping increment.");
  }
};

export const checkApiLimit = async () => {
  const userId = await getCurrentUserId();

  if (!userId) {
    return false;
  }

  try {
    const userApiLimit = await prismadb.userApiLimit.findUnique({
      where: { userId: userId },
    });

    if (!userApiLimit || userApiLimit.count < MAX_FREE_COUNTS) {
      return true;
    } else {
      return false;
    }
  } catch {
    console.warn("[API_LIMIT_CHECK_FALLBACK] Usage data unavailable; allowing local request.");
    return true;
  }
};

export const getApiLimitCount = async () => {
  const userId = await getCurrentUserId();

  if (!userId) {
    return 0;
  }

  try {
    const userApiLimit = await prismadb.userApiLimit.findUnique({
      where: {
        userId,
      },
    });

    if (!userApiLimit) {
      return 0;
    }

    return userApiLimit.count;
  } catch {
    console.warn("[API_LIMIT_COUNT_FALLBACK] Usage data unavailable; defaulting to 0.");
    return 0;
  }
};
