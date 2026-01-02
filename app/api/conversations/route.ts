// app/api/conversations/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prismadb";

// GET - List user's conversations (only those with at least 2 messages)
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const conversations = await prisma.conversation.findMany({
      where: { userId },
      include: {
        _count: {
          select: { messages: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    // Filter to only include conversations with at least 2 messages (1 user + 1 bot)
    const filteredConversations = conversations.filter(
      (conv) => conv._count.messages >= 2
    );

    return NextResponse.json(filteredConversations);
  } catch (error) {
    console.error("[CONVERSATIONS_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 }
    );
  }
}

// POST - Create a new conversation
export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { title } = body;

    const conversation = await prisma.conversation.create({
      data: {
        userId,
        title: title || "New Chat",
      },
    });

    return NextResponse.json(conversation);
  } catch (error) {
    console.error("[CONVERSATIONS_POST]", error);
    return NextResponse.json(
      { error: "Failed to create conversation" },
      { status: 500 }
    );
  }
}
