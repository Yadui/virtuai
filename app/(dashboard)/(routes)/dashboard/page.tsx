"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Download } from "lucide-react";
import { ChatComposer, type ChatModel } from "@/components/Chat/chat-composer";
import { UserAvatar } from "@/components/GeneralUI/user-avatar";
import { Loader } from "@/components/GeneralUI/loader";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "bot";
  content: string;
  type?: "text" | "image" | "code";
  images?: string[];
}

const DashboardPage = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [models, setModels] = useState<ChatModel[]>([]);
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const [inputDocked, setInputDocked] = useState(false);
  const [inputDocking, setInputDocking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dockTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hasMessages = messages.length > 0 || loading || inputDocked;

  // Fetch user's models on mount
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch("/api/models");
        if (response.ok) {
          const data = await response.json();
          setModels(data);
          // Set default model if available
          const defaultModel = data.find((m: ChatModel) => m.isDefault);
          if (defaultModel) {
            setSelectedModelId(defaultModel.id);
          }
        }
      } catch (error) {
        console.error("Failed to fetch models:", error);
      }
    };
    fetchModels();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    return () => {
      if (dockTimeoutRef.current) {
        clearTimeout(dockTimeoutRef.current);
      }
    };
  }, []);

  const handleMessageSend = async () => {
    if (!newMessage.trim()) return;

    const userMessage = newMessage;
    const shouldDockInput = !inputDocked;

    if (shouldDockInput) {
      setInputDocking(true);
      dockTimeoutRef.current = setTimeout(() => {
        setInputDocked(true);
        setInputDocking(false);
      }, 220);
    }

    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setNewMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt: userMessage,
          modelId: selectedModelId 
        }),
      });

      const data = await res.json();
      
      if (data.error) {
        setMessages((prev) => [
          ...prev,
          { role: "bot", content: data.error, type: "text" },
        ]);
      } else if (data.type === "image" && data.images) {
        setMessages((prev) => [
          ...prev,
          { role: "bot", content: "Here are your generated images:", type: "image", images: data.images },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "bot", content: data.reply || "No response received", type: data.type || "text" },
        ]);
      }

      // Redirect to conversation page with the new conversation ID
      if (data.conversationId) {
        router.push(`/dashboard/${data.conversationId}`);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "Error occurred while fetching the response", type: "text" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-0 flex-1 flex-col bg-[#f7f7f4] text-[#26251e]">
      {!hasMessages || inputDocking ? (
        /* Welcome state */
        <div
          className={cn(
            "flex min-h-0 flex-1 flex-col items-center justify-center px-4 transition-opacity duration-200 ease-out",
            inputDocking ? "opacity-0" : "opacity-100"
          )}
        >
          <div className="mb-8 max-w-2xl space-y-3 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#807d72]">
              AI workspace
            </p>
            <h1 className="text-4xl font-normal tracking-normal text-[#26251e] md:text-5xl">
              Welcome to VirtuAI
            </h1>
            <p className="mx-auto max-w-md text-base leading-7 text-[#5a5852]">
              Start a project trail for chat, image, code, music, and video generation.
            </p>
          </div>
          <div className="w-full max-w-2xl">
            <ChatComposer
              value={newMessage}
              onChange={setNewMessage}
              onSubmit={handleMessageSend}
              disabled={loading}
              models={models}
              selectedModelId={selectedModelId}
              onModelSelect={setSelectedModelId}
              inputClassName="text-base"
            />
          </div>
        </div>
      ) : (
        /* Active chat state */
        <div className="flex min-h-0 flex-1 flex-col animate-in fade-in-0 duration-300">
          {/* Messages */}
          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-3xl space-y-4 px-4 py-6">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-start gap-3",
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  {message.role === "user" && <UserAvatar />}
                  <div
                    className={cn(
                      "max-w-[78%] rounded-xl px-4 py-3 text-sm leading-6",
                      message.role === "user"
                        ? "bg-[#26251e] text-[#f7f7f4]"
                        : "border border-[#e6e5e0] bg-white text-[#5a5852] shadow-sm"
                    )}
                  >
                    {message.type === "image" && message.images ? (
                      <div className="space-y-3">
                        <p className="mb-2 text-sm">{message.content}</p>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          {message.images.map((img, imgIndex) => (
                            <div key={imgIndex} className="group relative">
                              <img
                                src={img}
                                alt={`Generated image ${imgIndex + 1}`}
                                className="w-full rounded-lg border border-[#e6e5e0]"
                              />
                              <a
                                href={img}
                                download={`virtuai-image-${Date.now()}-${imgIndex}.jpg`}
                                className="absolute right-2 top-2 rounded-md bg-[#26251e] p-2 text-white opacity-0 transition-opacity group-hover:opacity-100"
                              >
                                <Download className="h-4 w-4" />
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                          code: ({ children, className }) => {
                            const isInline = !className;
                            return isInline ? (
                              <code className="rounded bg-[#efeee8] px-1.5 py-0.5 font-mono text-[13px] text-[#26251e]">
                                {children}
                              </code>
                            ) : (
                              <code className="my-2 block overflow-x-auto rounded-lg border border-[#e6e5e0] bg-[#fafaf7] p-3 font-mono text-[13px] leading-5 text-[#26251e]">
                                {children}
                              </code>
                            );
                          },
                          table: ({ children }) => (
                            <div className="my-2 overflow-x-auto">
                              <table className="w-full border-collapse border border-[#e6e5e0] text-sm">
                                {children}
                              </table>
                            </div>
                          ),
                          th: ({ children }) => (
                            <th className="border border-[#e6e5e0] bg-[#fafaf7] px-3 py-2 text-left font-semibold">
                              {children}
                            </th>
                          ),
                          td: ({ children }) => (
                            <td className="border border-[#e6e5e0] px-3 py-2">{children}</td>
                          ),
                        }}
                      >
                        {message.content || ""}
                      </ReactMarkdown>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-start gap-3">
                  <div className="rounded-xl border border-[#e6e5e0] bg-white px-4 py-3 shadow-sm">
                    <Loader />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Composer */}
          <div className="shrink-0 border-t border-[#e6e5e0] bg-[#fafaf7] p-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
            <div className="mx-auto max-w-3xl">
              <ChatComposer
                value={newMessage}
                onChange={setNewMessage}
                onSubmit={handleMessageSend}
                disabled={loading}
                models={models}
                selectedModelId={selectedModelId}
                onModelSelect={setSelectedModelId}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;

