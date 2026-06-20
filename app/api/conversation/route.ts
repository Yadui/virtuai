// app/api/convo/route.ts
import { NextResponse } from "next/server";
import { incrementApiLimit, checkApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";
import { getCurrentUserId } from "@/lib/auth";

export async function POST(request: Request) {
  const { prompt } = await request.json();
  const userId = await getCurrentUserId();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const freeTrial = await checkApiLimit();
  const isPro = await checkSubscription();

  if (!freeTrial && !isPro) {
    return new NextResponse("Free Trial has expired", { status: 403 });
  }
  // Make the API request to Pollination (replace with the actual endpoint)
  const response = await fetch(
    `https://text.pollinations.ai/${encodeURIComponent(prompt)}`
  );
  if (!response) {
    return new NextResponse("Messages are required", { status: 400 });
  }

  if (!response.ok) {
    return NextResponse.json(
      { error: "Failed to fetch data from Pollination API" },
      { status: 500 }
    );
  }

  // Since the response is plain text, we read it as text.
  const data = await response.text();
  if (response && !isPro) {
    await incrementApiLimit();
  }
  // Return the plain text response to the frontend
  return NextResponse.json({ reply: data });
}
