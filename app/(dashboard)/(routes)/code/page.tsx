"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // GitHub Flavored Markdown plugin
import { BotAvatar } from "@/components/GeneralUI/bot-avatar";
import { UserAvatar } from "@/components/GeneralUI/user-avatar";
import { Empty } from "@/components/GeneralUI/empty";
import { Loader } from "@/components/GeneralUI/loader";
import { Heading } from "@/components/Header/heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { MessageSquare } from "lucide-react";

interface Message {
  role: "user" | "bot";
  content: string;
}

const ConvoPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleMessageSend = async () => {
    if (!newMessage.trim()) return;

    // Add user's message to the conversation
    setMessages((prev) => [...prev, { role: "user", content: newMessage }]);
    setNewMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: newMessage }),
      });

      const data = await res.json();
      const reply = data.reply || "No response received";

      // Add bot's response to the conversation
      setMessages((prev) => [...prev, { role: "bot", content: reply }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "Error occurred while fetching the response" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-[#f7f7f4] text-[#26251e]">
      <Heading
        title="Conversation"
        description="Chat with the bot using natural language."
        icon={MessageSquare}
        iconColor="text-[#26251e]"
        bgColor="bg-white"
      />

      <div className="px-4 py-6 lg:px-8">
        <div className="mb-4 w-full rounded-xl border border-[#e6e5e0] bg-white p-4">
          <div className="flex items-center gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Ask the bot something..."
              disabled={loading}
              className="flex-1"
            />
            <Button
              onClick={handleMessageSend}
              disabled={loading}
              variant="default"
            >
              Send
            </Button>
          </div>
        </div>

        <div className="space-y-4 mt-4">
          {loading && (
            <div className="flex w-full items-center justify-center rounded-xl border border-[#e6e5e0] bg-white p-8">
              <Loader />
            </div>
          )}

          {messages.length === 0 && !loading && (
            <Empty label="No conversation started." />
          )}

          <div className="flex flex-col-reverse gap-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "rounded-xl border p-4 text-sm leading-6",
                  message.role === "user"
                    ? "border-[#26251e] bg-[#26251e] text-[#f7f7f4]"
                    : "border-[#e6e5e0] bg-white text-[#5a5852]"
                )}
              >
                {message.role === "bot" && <BotAvatar />}
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]} // Enable Markdown table support
                  components={{
                    table: ({ node, ...props }) => (
                      <div className="overflow-x-auto my-4">
                        <table className="w-full table-auto border-collapse border border-[#e6e5e0] text-left text-sm">
                          {props.children}
                        </table>
                      </div>
                    ),
                    thead: ({ node, ...props }) => (
                      <thead className="bg-[#fafaf7]">{props.children}</thead>
                    ),
                    tr: ({ node, ...props }) => (
                      <tr className="border-b border-[#e6e5e0]">
                        {props.children}
                      </tr>
                    ),
                    th: ({ node, ...props }) => (
                      <th className="border border-[#e6e5e0] px-4 py-2 font-semibold">
                        {props.children}
                      </th>
                    ),
                    td: ({ node, ...props }) => (
                      <td className="border border-[#e6e5e0] px-4 py-2">
                        {props.children}
                      </td>
                    ),
                    code: ({ node, ...props }) => (
                      <code
                        className="rounded-md bg-[#efeee8] px-2 py-1 font-mono text-sm text-[#26251e]"
                        {...props}
                      />
                    ),
                  }}
                >
                  {message.content || ""}
                </ReactMarkdown>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConvoPage;
