import prisma from "@/lib/prismadb";

export const getUserByEmail = async (email: string) => {
  return prisma.user.findFirst({
    where: { email },
  });
};
