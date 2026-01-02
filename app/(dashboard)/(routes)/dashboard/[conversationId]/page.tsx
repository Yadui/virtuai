"use client";

import { useState, useRef, useEffect, use } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Send, Download, ChevronDown, Sparkles } from "lucide-react";
import { UserAvatar } from "@/components/GeneralUI/user-avatar";
import { Loader } from "@/components/GeneralUI/loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "bot";
  content: string;
  type?: "text" | "image" | "code";
  images?: string[];
}

interface Model {
  id: string;
  name: string;
  provider: string;
  isDefault: boolean;
}

interface ConversationPageProps {
  params: Promise<{ conversationId: string }>;
}

const ConversationPage = ({ params }: ConversationPageProps) => {
  const { conversationId } = use(params);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingConversation, setLoadingConversation] = useState<boolean>(true);
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch conversation on mount
  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const response = await fetch(`/api/conversations/${conversationId}`);
        if (response.ok) {
          const data = await response.json();
          setMessages(
            data.messages.map((msg: { role: string; content: string; type?: string; images?: string[] }) => ({
              role: msg.role as "user" | "bot",
              content: msg.content,
              type: msg.type as "text" | "image" | "code" | undefined,
              images: msg.images,
            }))
          );
        }
      } catch (error) {
        console.error("Failed to fetch conversation:", error);
      } finally {
        setLoadingConversation(false);
      }
    };
    fetchConversation();
  }, [conversationId]);

  // Fetch user's models on mount
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch("/api/models");
        if (response.ok) {
          const data = await response.json();
          setModels(data);
          const defaultModel = data.find((m: Model) => m.isDefault);
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

  const handleMessageSend = async () => {
    if (!newMessage.trim()) return;

    const userMessage = newMessage;
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setNewMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: userMessage,
          modelId: selectedModelId,
          conversationId,
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
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "Error occurred while fetching the response", type: "text" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleMessageSend();
    }
  };

  const selectedModel = models.find((m) => m.id === selectedModelId);

  const ModelSelector = () => (
    <div className="flex justify-center py-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Sparkles className="h-4 w-4" />
            {selectedModel?.name || "VirtuAI Default"}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center">
          <DropdownMenuItem
            onClick={() => setSelectedModelId(null)}
            className={cn(!selectedModelId && "bg-accent")}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            VirtuAI Default
          </DropdownMenuItem>
          {models.map((model) => (
            <DropdownMenuItem
              key={model.id}
              onClick={() => setSelectedModelId(model.id)}
              className={cn(selectedModelId === model.id && "bg-accent")}
            >
              {model.name}
              <span className="ml-2 text-xs text-muted-foreground">
                {model.provider}
              </span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  if (loadingConversation) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col relative">
      {models.length > 0 && <ModelSelector />}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto w-full px-4 py-6 space-y-6">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                "flex gap-3",
                message.role === "user" ? "flex-row-reverse" : "flex-row"
              )}
            >
              {message.role === "user" && <UserAvatar />}
              <div
                className={cn(
                  "rounded-2xl px-4 py-3 max-w-[80%]",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                {message.type === "image" && message.images ? (
                  <div className="space-y-3">
                    <p className="text-sm mb-2">{message.content}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {message.images.map((img, imgIndex) => (
                        <div key={imgIndex} className="relative group">
                          <img
                            src={img}
                            alt={`Generated image ${imgIndex + 1}`}
                            className="rounded-lg w-full"
                          />
                          <a
                            href={img}
                            download={`virtuai-image-${Date.now()}-${imgIndex}.jpg`}
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 text-white p-2 rounded-lg"
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
                          <code className="bg-black/10 dark:bg-white/10 rounded px-1.5 py-0.5 text-sm">
                            {children}
                          </code>
                        ) : (
                          <code className="block bg-black/10 dark:bg-white/10 rounded-lg p-3 text-sm overflow-x-auto my-2">
                            {children}
                          </code>
                        );
                      },
                      table: ({ children }) => (
                        <div className="overflow-x-auto my-2">
                          <table className="border-collapse border border-border w-full text-sm">
                            {children}
                          </table>
                        </div>
                      ),
                      th: ({ children }) => (
                        <th className="border border-border px-3 py-2 bg-muted font-semibold text-left">
                          {children}
                        </th>
                      ),
                      td: ({ children }) => (
                        <td className="border border-border px-3 py-2">{children}</td>
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
            <div className="flex gap-3">
              <div className="bg-muted rounded-2xl px-4 py-3">
                <Loader />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Bottom Input */}
      <div className="border-t bg-background p-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 bg-muted rounded-xl px-4 py-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message VirtuAI..."
              disabled={loading}
              className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Button
              onClick={handleMessageSend}
              disabled={loading || !newMessage.trim()}
              size="icon"
              className="rounded-lg"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationPage;
