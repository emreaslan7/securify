import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, circleUserId } = body;

    if (!email || !password || !name || !circleUserId) {
      return new NextResponse("Missing credentials", { status: 400 });
    }

    const userAlreadyExists = await prisma.user.findFirst({
      where: { email },
    });

    if (userAlreadyExists) {
      return new NextResponse("User already exist!", { status: 404 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await prisma.user.create({
      data: {
        name,
        circleUserId,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(newUser);
  } catch (error: any) {
    return new NextResponse(error, { status: 500 });
  }
}
