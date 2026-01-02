// app/api/models/[id]/route.ts
// API for updating and deleting specific user models
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prismadb";

// GET - Get a single model (with API key for editing)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const model = await prisma.userModel.findFirst({
      where: { id, userId },
    });

    if (!model) {
      return new NextResponse("Model not found", { status: 404 });
    }

    return NextResponse.json(model);
  } catch (error) {
    console.error("[MODEL_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// PUT - Update a model
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { name, provider, apiUrl, apiKey, deploymentName, isDefault } = body;

    // Check if model belongs to user
    const existingModel = await prisma.userModel.findFirst({
      where: { id, userId },
    });

    if (!existingModel) {
      return new NextResponse("Model not found", { status: 404 });
    }

    // If this model is set as default, unset other defaults
    if (isDefault) {
      await prisma.userModel.updateMany({
        where: { userId, isDefault: true, NOT: { id } },
        data: { isDefault: false },
      });
    }

    const model = await prisma.userModel.update({
      where: { id },
      data: {
        name: name || existingModel.name,
        provider: provider || existingModel.provider,
        apiUrl: apiUrl || existingModel.apiUrl,
        apiKey: apiKey || existingModel.apiKey,
        deploymentName: deploymentName !== undefined ? deploymentName : existingModel.deploymentName,
        isDefault: isDefault !== undefined ? isDefault : existingModel.isDefault,
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
    console.error("[MODEL_PUT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// DELETE - Delete a model
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if model belongs to user
    const existingModel = await prisma.userModel.findFirst({
      where: { id, userId },
    });

    if (!existingModel) {
      return new NextResponse("Model not found", { status: 404 });
    }

    await prisma.userModel.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[MODEL_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
