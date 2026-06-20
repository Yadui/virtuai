"use client";

import Link from "next/link";
import { MessageSquare, Plus, Settings, Trash2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";

import { FreeCounter } from "@/components/SubscriptionModel/free-counter";
import { cn } from "@/lib/utils";

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
        setConversations((prev) => prev.filter((conversation) => conversation.id !== id));
        if (currentConversationId === id) {
          router.push("/dashboard");
        }
      }
    } catch (error) {
      console.error("Failed to delete conversation:", error);
    }
  };

  return (
    <div className="flex h-full flex-col bg-[#fafaf7] text-[#26251e]">
      <div className="flex min-h-0 flex-1 flex-col px-3 py-4">
        <Link href="/dashboard" className="mb-5 flex items-center gap-3 px-2" onClick={onLinkClick}>
          <span className="grid h-8 w-8 place-items-center rounded-md bg-[#f54e00] text-sm font-semibold text-white">
            V
          </span>
          <span className="text-xl font-semibold text-[#f54e00]">VirtuAI</span>
        </Link>

        <button
          onClick={handleNewChat}
          className="mb-5 flex h-10 w-full items-center justify-center gap-2 rounded-md bg-[#f54e00] px-3 text-sm font-medium text-white transition-colors hover:bg-[#d04200]"
        >
          <Plus className="h-4 w-4" />
          New Chat
        </button>

        <div className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#807d72]">
          Conversations
        </div>

        <div className="min-h-0 flex-1 space-y-1 overflow-y-auto pr-1">
          {loading ? (
            <div className="px-2 py-2 text-xs text-[#807d72]">Loading...</div>
          ) : conversations.length === 0 ? (
            <div className="px-2 py-2 text-xs text-[#807d72]">No conversations yet</div>
          ) : (
            conversations.map((conversation) => (
              <Link
                key={conversation.id}
                href={`/dashboard/${conversation.id}`}
                onClick={onLinkClick}
                className={cn(
                  "group flex items-center justify-between rounded-md border px-3 py-2 text-sm transition-colors",
                  currentConversationId === conversation.id
                    ? "border-[#cfcdc4] bg-white text-[#26251e]"
                    : "border-transparent text-[#5a5852] hover:border-[#e6e5e0] hover:bg-white hover:text-[#26251e]"
                )}
              >
                <div className="flex min-w-0 flex-1 items-center">
                  <MessageSquare className="mr-2 h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{conversation.title}</span>
                </div>
                <button
                  onClick={(event) => handleDeleteConversation(event, conversation.id)}
                  className="rounded-md p-1 text-[#a09c92] opacity-0 transition group-hover:opacity-100 hover:bg-[#efeee8] hover:text-[#cf2d56]"
                  aria-label="Delete conversation"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </Link>
            ))
          )}
        </div>

        <div className="mt-4 border-t border-[#e6e5e0] pt-3">
          <Link
            href="/settings"
            onClick={onLinkClick}
            className={cn(
              "flex w-full items-center rounded-md border px-3 py-2 text-sm font-medium transition-colors",
              pathname === "/settings"
                ? "border-[#cfcdc4] bg-white text-[#26251e]"
                : "border-transparent text-[#5a5852] hover:border-[#e6e5e0] hover:bg-white hover:text-[#26251e]"
            )}
          >
            <Settings className="mr-3 h-4 w-4" />
            Settings
          </Link>
        </div>
      </div>

      <FreeCounter isPro={isPro} apiLimitCount={apiLimitCount} />
    </div>
  );
};
