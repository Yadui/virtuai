// app/api/models/route.ts
// API for listing and creating user models
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prismadb";

// GET - List all models for the current user
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const models = await prisma.userModel.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        provider: true,
        apiUrl: true,
        deploymentName: true,
        isDefault: true,
        createdAt: true,
        // Note: apiKey is intentionally excluded for security
      },
    });

    return NextResponse.json(models);
  } catch (error) {
    console.error("[MODELS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// POST - Create a new model
export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { name, provider, apiUrl, apiKey, deploymentName, isDefault } = body;

    if (!name || !provider || !apiUrl || !apiKey) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // If this model is set as default, unset other defaults
    if (isDefault) {
      await prisma.userModel.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    const model = await prisma.userModel.create({
      data: {
        userId,
        name,
        provider,
        apiUrl,
        apiKey,
        deploymentName: deploymentName || null,
        isDefault: isDefault || false,
      },
    });

    return NextResponse.json({
      id: model.id,
      name: model.name,
      provider: model.provider,
      apiUrl: model.apiUrl,
      deploymentName: model.deploymentName,
      isDefault: model.isDefault,
    });
  } catch (error) {
    console.error("[MODELS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
