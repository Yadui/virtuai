import prisma from "@/lib/prismadb";

interface UpsertUserParams {
  email: string;
  name?: string | null;
  image?: string | null;
  provider?: string;
  providerAccountId?: string;
}

export const getOrCreateUser = async ({
  email,
  name,
  image,
}: UpsertUserParams) => {
  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        name: name ?? null,
        image: image ?? null,
      },
    });
  } else if (name || image) {
    user = await prisma.user.update({
      where: { email },
      data: {
        ...(name ? { name } : {}),
        ...(image ? { image } : {}),
      },
    });
  }

  return user;
};
