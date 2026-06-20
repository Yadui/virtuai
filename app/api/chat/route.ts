// app/api/chat/route.ts
// Unified chat API that handles text, image, and code generation
import { NextResponse } from "next/server";
import { incrementApiLimit, checkApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";
import prisma from "@/lib/prismadb";
import { getCurrentUserId } from "@/lib/auth";

type RequestType = "text" | "image" | "code";

interface ChatRequest {
  prompt: string;
  type?: RequestType;
  modelId?: string;
  conversationId?: string; // Optional - will create new if not provided
  // Image-specific options
  resolution?: string;
  amount?: number;
}

interface ModelConfig {
  provider: string;
  apiUrl: string;
  apiKey: string;
  deploymentName?: string | null;
}

function detectRequestType(prompt: string): RequestType {
  const lowerPrompt = prompt.toLowerCase();
  
  // Image generation patterns
  const imagePatterns = [
    /^(generate|create|make|draw|design|show me|give me)\s+(an?\s+)?(image|picture|photo|illustration|artwork|visual|graphic)/i,
    /^image:/i,
    /^\/image\s+/i,
  ];
  
  // Code generation patterns
  const codePatterns = [
    /^(write|create|generate|give me|show me)\s+(the\s+)?(code|function|class|script|program)/i,
    /^code:/i,
    /^\/code\s+/i,
    /```/,
    /\b(implement|programming|algorithm|debug|fix this code)\b/i,
  ];

  for (const pattern of imagePatterns) {
    if (pattern.test(lowerPrompt)) return "image";
  }

  for (const pattern of codePatterns) {
    if (pattern.test(lowerPrompt)) return "code";
  }

  return "text";
}

// Default Pollinations handlers
async function handleDefaultTextRequest(prompt: string) {
  const response = await fetch(
    `https://text.pollinations.ai/${encodeURIComponent(prompt)}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch from text API");
  }

  const data = await response.text();
  return { type: "text" as const, reply: data };
}

async function handleDefaultImageRequest(prompt: string, resolution = "512x512", amount = 1) {
  const images: string[] = [];
  
  for (let i = 0; i < Math.min(amount, 4); i++) {
    const randomSeed = Math.floor(Math.random() * 1000000);
    const apiUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?seed=${randomSeed}&resolution=${resolution}`;
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error("Failed to fetch from image API");
    }

    const imageBuffer = await response.arrayBuffer();
    const base64Image = `data:image/jpeg;base64,${Buffer.from(imageBuffer).toString("base64")}`;
    images.push(base64Image);
  }

  return { type: "image" as const, images };
}

// Custom model handler for OpenAI-compatible APIs
async function handleCustomModelRequest(prompt: string, model: ModelConfig) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  let body: Record<string, unknown>;
  let apiUrl = model.apiUrl;

  switch (model.provider) {
    case "azure":
      // Azure OpenAI format
      headers["api-key"] = model.apiKey;
      body = {
        messages: [{ role: "user", content: prompt }],
        max_tokens: 4096,
      };
      // Construct the full Azure OpenAI endpoint URL
      // Expected format: https://{resource}.openai.azure.com/openai/deployments/{deployment}/chat/completions?api-version={version}
      {
        // Remove trailing slash if present
        const baseUrl = model.apiUrl.replace(/\/$/, "");
        const deploymentName = model.deploymentName || "gpt-4o";
        
        // Check if URL already contains the full path
        if (apiUrl.includes("/chat/completions")) {
          // URL already has the endpoint path, just add api-version if missing
          if (!apiUrl.includes("api-version")) {
            apiUrl = `${apiUrl}${apiUrl.includes("?") ? "&" : "?"}api-version=2024-02-15-preview`;
          }
        } else if (apiUrl.includes("/openai/deployments/")) {
          // URL has deployment path but missing /chat/completions
          apiUrl = `${baseUrl}/chat/completions?api-version=2024-02-15-preview`;
        } else {
          // URL is just the base endpoint, construct the full path
          apiUrl = `${baseUrl}/openai/deployments/${deploymentName}/chat/completions?api-version=2024-02-15-preview`;
        }
      }
      break;

    case "openai":
      // OpenAI format
      headers["Authorization"] = `Bearer ${model.apiKey}`;
      body = {
        model: model.deploymentName || "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 4096,
      };
      break;

    case "openrouter":
      // OpenRouter format (OpenAI-compatible with custom headers)
      headers["Authorization"] = `Bearer ${model.apiKey}`;
      headers["HTTP-Referer"] = "https://virtuai.app"; // Site URL for rankings
      headers["X-Title"] = "VirtuAI"; // Site title for rankings
      body = {
        model: model.deploymentName || "openai/gpt-4o", // OpenRouter uses provider/model format
        messages: [{ role: "user", content: prompt }],
        max_tokens: 2048, // Lower limit for free tier compatibility
      };
      // OpenRouter uses a standard endpoint
      if (!apiUrl.includes("/chat/completions")) {
        apiUrl = "https://openrouter.ai/api/v1/chat/completions";
      }
      break;

    case "github-copilot":
      // GitHub Models/Copilot format (OpenAI-compatible inference endpoint)
      headers["Authorization"] = `Bearer ${model.apiKey}`;
      body = {
        model: model.deploymentName || "openai/gpt-4.1",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 4096,
      };
      if (!apiUrl.includes("/chat/completions")) {
        const baseUrl = model.apiUrl.replace(/\/$/, "");
        apiUrl = `${baseUrl}/chat/completions`;
      }
      break;

    case "anthropic":
      // Anthropic format
      headers["x-api-key"] = model.apiKey;
      headers["anthropic-version"] = "2023-06-01";
      body = {
        model: model.deploymentName || "claude-3-sonnet-20240229",
        max_tokens: 4096,
        messages: [{ role: "user", content: prompt }],
      };
      break;

    default:
      // Generic OpenAI-compatible format
      headers["Authorization"] = `Bearer ${model.apiKey}`;
      body = {
        model: model.deploymentName || "default",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 4096,
      };
  }

  // Debug logging
  console.log("[CUSTOM_MODEL_REQUEST] URL:", apiUrl);
  console.log("[CUSTOM_MODEL_REQUEST] Provider:", model.provider);
  console.log("[CUSTOM_MODEL_REQUEST] Headers:", Object.keys(headers));
  console.log("[CUSTOM_MODEL_REQUEST] Body:", JSON.stringify(body, null, 2));

  const response = await fetch(apiUrl, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  // Log response details
  console.log("[CUSTOM_MODEL_RESPONSE] Status:", response.status, response.statusText);
  console.log("[CUSTOM_MODEL_RESPONSE] Headers:", Object.fromEntries(response.headers.entries()));

  if (!response.ok) {
    const errorText = await response.text();
    console.error("[CUSTOM_MODEL_ERROR] Status:", response.status);
    console.error("[CUSTOM_MODEL_ERROR] Body:", errorText);
    throw new Error(`API request failed: ${response.status} - ${errorText}`);
  }

  // Get the raw response text first for debugging
  const responseText = await response.text();
  console.log("[CUSTOM_MODEL_RESPONSE_LENGTH]", responseText.length);
  console.log("[CUSTOM_MODEL_RESPONSE_PREVIEW]", responseText.substring(0, 500));

  if (!responseText || responseText.trim() === "") {
    console.error("[CUSTOM_MODEL_ERROR] Empty response body");
    throw new Error("Empty response from API");
  }

  let data;
  try {
    data = JSON.parse(responseText);
  } catch (parseError) {
    console.error("[CUSTOM_MODEL_JSON_PARSE_ERROR]", parseError);
    console.error("[CUSTOM_MODEL_RAW_RESPONSE]", responseText.substring(0, 1000));
    throw new Error(`Failed to parse API response as JSON: ${parseError}`);
  }

  // Extract content based on provider
  let reply: string;
  if (model.provider === "anthropic") {
    reply = data.content?.[0]?.text || "No response";
  } else {
    reply = data.choices?.[0]?.message?.content || "No response";
  }

  return { type: "text" as const, reply };
}

export async function POST(request: Request) {
  try {
    const body: ChatRequest = await request.json();
    const { prompt, type: requestedType, modelId, conversationId, resolution, amount } = body;
    
    const userId = await getCurrentUserId();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }

    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();

    if (!freeTrial && !isPro) {
      return new NextResponse("Free Trial has expired", { status: 403 });
    }

    // Check if using a custom model. If model lookup is unavailable, continue with the free model.
    let customModel: ModelConfig | null = null;
    if (modelId) {
      try {
        const model = await prisma.userModel.findFirst({
          where: { id: modelId, userId },
        });
        if (model) {
          customModel = {
            provider: model.provider,
            apiUrl: model.apiUrl,
            apiKey: model.apiKey,
            deploymentName: model.deploymentName,
          };
        }
      } catch {
        console.warn("[CHAT_MODEL_LOOKUP_FALLBACK] Custom models unavailable; using Pollinations free model.");
      }
    }

    let result;

    if (customModel) {
      // Use custom model for all text/code requests
      result = await handleCustomModelRequest(prompt, customModel);
    } else {
      // Use default Pollinations handlers
      const messageType = requestedType || detectRequestType(prompt);

      switch (messageType) {
        case "image":
          result = await handleDefaultImageRequest(prompt, resolution, amount);
          break;
        case "code":
          result = await handleDefaultTextRequest(
            `You are a helpful coding assistant. Provide clean, well-commented code with explanations. ${prompt}`
          );
          break;
        default:
          result = await handleDefaultTextRequest(prompt);
      }
    }

    if (!isPro) {
      await incrementApiLimit();
    }

    try {
      // Save messages to conversation when the database is available.
      let activeConversationId = conversationId;

      if (!activeConversationId) {
        let title = prompt.substring(0, 50) + (prompt.length > 50 ? "..." : "");

        try {
          const titleResponse = await fetch("https://text.pollinations.ai/" + encodeURIComponent(
            `Generate a very short title (2-5 words max) that describes this message. Just respond with the title, no quotes, no explanation: "${prompt}"`
          ));
          if (titleResponse.ok) {
            const generatedTitle = await titleResponse.text();
            const cleanTitle = generatedTitle.trim().replace(/['"]/g, '').substring(0, 50);
            if (cleanTitle && cleanTitle.length > 0 && cleanTitle.length <= 50) {
              title = cleanTitle;
            }
          }
        } catch {
          // Keep the default truncated prompt title.
        }

        const newConversation = await prisma.conversation.create({
          data: {
            userId,
            title,
          },
        });
        activeConversationId = newConversation.id;
      }

      await prisma.message.create({
        data: {
          conversationId: activeConversationId,
          role: "user",
          content: prompt,
          type: requestedType || "text",
        },
      });

      const messageType = result.type || "text";
      await prisma.message.create({
        data: {
          conversationId: activeConversationId,
          role: "bot",
          content: result.type === "image" ? "Here are your generated images:" : (result.reply || ""),
          type: messageType,
          images: result.type === "image" && result.images ? result.images : [],
        },
      });

      await prisma.conversation.update({
        where: { id: activeConversationId },
        data: { updatedAt: new Date() },
      });

      return NextResponse.json({ ...result, conversationId: activeConversationId });
    } catch {
      console.warn("[CHAT_PERSISTENCE_FALLBACK] Conversation storage unavailable; returning free model response without saving.");
    }

    return NextResponse.json({ ...result, model: customModel ? "custom" : "pollinations-free" });
  } catch (error) {
    console.error("[CHAT_ERROR]", error);
    return NextResponse.json(
      { error: "Something went wrong processing your request" },
      { status: 500 }
    );
  }
}

