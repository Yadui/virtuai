"use client";

import Link from "next/link";
import Image from "next/image";
import { Montserrat } from "next/font/google";
import {
  MessageSquare,
  Settings,
  Plus,
  Trash2,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FreeCounter } from "@/components/SubscriptionModel/free-counter";
import { cn } from "@/lib/utils";

const poppins = Montserrat({
  weight: "600",
  subsets: ["latin"],
});

interface Conversation {
  id: string;
  title: string;
  updatedAt: string;
  _count: { messages: number };
}

interface SidebarProps {
  apiLimitCount: number;
  isPro: boolean;
  onLinkClick?: () => void;
}

export const Sidebar = ({
  apiLimitCount = 0,
  isPro = false,
  onLinkClick,
}: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  // Get current conversation ID from URL
  const currentConversationId = pathname.startsWith("/dashboard/")
    ? pathname.split("/dashboard/")[1]
    : null;

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await fetch("/api/conversations");
      if (response.ok) {
        const data = await response.json();
        setConversations(data);
      }
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    router.push("/dashboard");
    onLinkClick?.();
  };

  const handleDeleteConversation = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const response = await fetch(`/api/conversations/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setConversations((prev) => prev.filter((c) => c.id !== id));
        if (currentConversationId === id) {
          router.push("/dashboard");
        }
      }
    } catch (error) {
      console.error("Failed to delete conversation:", error);
    }
  };

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-zinc-900 text-white">
      <div className="px-3 py-2 flex-1 flex flex-col overflow-hidden">
        <Link href="/dashboard" className="flex items-center pl-3 mb-6">
          <div className="relative h-8 w-8 mr-4">
            <Image fill alt="Logo" src="/logo.png" />
          </div>
          <h1 className={cn("text-2xl font-bold", poppins.className)}>
            VirtuAI
          </h1>
        </Link>

        {/* New Chat Button */}
        <button
          onClick={handleNewChat}
          className="flex items-center gap-2 w-full px-3 py-2 mb-4 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:from-purple-700 hover:to-pink-700 transition"
        >
          <Plus className="h-4 w-4" />
          New Chat
        </button>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto space-y-1 mb-4">
          {loading ? (
            <div className="text-xs text-zinc-500 px-3 py-2">Loading...</div>
          ) : conversations.length === 0 ? (
            <div className="text-xs text-zinc-500 px-3 py-2">No conversations yet</div>
          ) : (
            conversations.map((conversation) => (
              <Link
                key={conversation.id}
                href={`/dashboard/${conversation.id}`}
                onClick={onLinkClick}
                className={cn(
                  "group flex items-center justify-between text-sm p-3 w-full rounded-lg transition",
                  currentConversationId === conversation.id
                    ? "text-white bg-white/10"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                )}
              >
                <div className="flex items-center flex-1 min-w-0">
                  <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{conversation.title}</span>
                </div>
                <button
                  onClick={(e) => handleDeleteConversation(e, conversation.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </Link>
            ))
          )}
        </div>

        {/* Settings Link */}
        <Link
          href="/settings"
          onClick={onLinkClick}
          className={cn(
            "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
            pathname === "/settings"
              ? "text-white "
              : "text-white/70"
          )}
        >
          <div className="flex items-center flex-1">
            <Settings className="h-5 w-5 mr-3" />
            Settings
          </div>
        </Link>
      </div>

      <FreeCounter isPro={isPro} apiLimitCount={apiLimitCount} />
    </div>
  );
};
