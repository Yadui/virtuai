import { Code, ImageIcon, MessageSquare, Music, VideoIcon } from "lucide-react";

export const MAX_FREE_COUNTS = 9999;

export const tools = [
  {
    label: "Conversation",
    icon: MessageSquare,
    href: "/conversation",
    color: "text-[#26251e]",
    bgColor: "bg-white",
  },
  {
    label: "Music Generation",
    icon: Music,
    href: "/music",
    color: "text-[#26251e]",
    bgColor: "bg-white",
  },
  {
    label: "Image Generation",
    icon: ImageIcon,
    color: "text-[#26251e]",
    bgColor: "bg-white",
    href: "/image",
  },
  {
    label: "Video Generation",
    icon: VideoIcon,
    color: "text-[#26251e]",
    bgColor: "bg-white",
    href: "/video",
  },
  {
    label: "Code Generation",
    icon: Code,
    color: "text-[#26251e]",
    bgColor: "bg-white",
    href: "/code",
  },
];
