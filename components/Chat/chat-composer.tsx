"use client";

import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import {
  Check,
  ChevronDown,
  FileText,
  ImagePlus,
  Search,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export interface ChatModel {
  id: string;
  name: string;
  provider: string;
  isDefault: boolean;
}

interface ChatComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void | Promise<void>;
  disabled?: boolean;
  models: ChatModel[];
  selectedModelId: string | null;
  onModelSelect: (modelId: string | null) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
}

interface ComposerAttachment {
  id: string;
  name: string;
  kind: "photo" | "document";
  size: number;
  previewUrl?: string;
}

const formatFileSize = (size: number) => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

const PROVIDER_LABELS: Record<string, string> = {
  azure: "Azure OpenAI",
  openai: "OpenAI",
  "github-copilot": "GitHub Copilot",
  openrouter: "OpenRouter",
  anthropic: "Anthropic",
  custom: "Custom API",
};

export const ChatComposer = ({
  value,
  onChange,
  onSubmit,
  disabled = false,
  models,
  selectedModelId,
  onModelSelect,
  placeholder = "Message VirtuAI...",
  className,
  inputClassName,
}: ChatComposerProps) => {
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);
  const [attachments, setAttachments] = useState<ComposerAttachment[]>([]);
  const attachmentsRef = useRef<ComposerAttachment[]>([]);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);

  const selectedModel = models.find((model) => model.id === selectedModelId);
  const canSubmit = Boolean(value.trim()) && !disabled;
  const photoCount = attachments.filter((attachment) => attachment.kind === "photo").length;
  const documentCount = attachments.filter((attachment) => attachment.kind === "document").length;

  useEffect(() => {
    attachmentsRef.current = attachments;
  }, [attachments]);

  useEffect(() => {
    return () => {
      attachmentsRef.current.forEach((attachment) => {
        if (attachment.previewUrl) {
          URL.revokeObjectURL(attachment.previewUrl);
        }
      });
    };
  }, []);

  const resetAttachments = () => {
    attachments.forEach((attachment) => {
      if (attachment.previewUrl) {
        URL.revokeObjectURL(attachment.previewUrl);
      }
    });

    setAttachments([]);

    if (photoInputRef.current) {
      photoInputRef.current.value = "";
    }

    if (documentInputRef.current) {
      documentInputRef.current.value = "";
    }
  };

  const handleSubmit = () => {
    if (!canSubmit) return;

    resetAttachments();
    void onSubmit();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);

    if (!files.length) return;

    setAttachments((current) => [
      ...current,
      ...files.map((file, index) => ({
        id: `photo-${file.name}-${file.lastModified}-${file.size}-${Date.now()}-${index}`,
        name: file.name,
        kind: "photo" as const,
        size: file.size,
        previewUrl: URL.createObjectURL(file),
      })),
    ]);

    event.target.value = "";
  };

  const handleDocumentChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);

    if (!files.length) return;

    setAttachments((current) => [
      ...current,
      ...files.map((file, index) => ({
        id: `document-${file.name}-${file.lastModified}-${file.size}-${Date.now()}-${index}`,
        name: file.name,
        kind: "document" as const,
        size: file.size,
      })),
    ]);

    event.target.value = "";
  };

  const removeAttachment = (attachmentId: string) => {
    setAttachments((current) => {
      const attachment = current.find((item) => item.id === attachmentId);

      if (attachment?.previewUrl) {
        URL.revokeObjectURL(attachment.previewUrl);
      }

      return current.filter((item) => item.id !== attachmentId);
    });
  };

  const toolButtonClass =
    "h-8 gap-1.5 rounded-md px-2 text-xs text-[#5a5852] hover:bg-[#efeee8] hover:text-[#26251e]";

  return (
    <div
      className={cn(
        "rounded-xl border border-[#e6e5e0] bg-white px-3 py-2",
        className
      )}
    >
      {attachments.length > 0 && (
        <div className="mb-2 flex max-h-36 flex-wrap items-start gap-2 overflow-y-auto pr-1">
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="group relative flex h-20 w-40 overflow-hidden rounded-lg border border-[#e6e5e0] bg-[#fafaf7]"
            >
              {attachment.kind === "photo" && attachment.previewUrl ? (
                <img
                  src={attachment.previewUrl}
                  alt={attachment.name}
                  className="h-full w-20 shrink-0 object-cover"
                />
              ) : (
                <div className="flex h-full w-20 shrink-0 items-center justify-center bg-[#efeee8] text-[#5a5852]">
                  <FileText className="h-6 w-6" />
                </div>
              )}

              <div className="min-w-0 flex-1 px-2 py-2">
                <p className="truncate text-xs font-medium text-[#26251e]">
                  {attachment.name}
                </p>
                <p className="mt-1 text-[11px] text-[#807d72]">
                  {formatFileSize(attachment.size)}
                </p>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeAttachment(attachment.id)}
                className="absolute right-1 top-1 h-6 w-6 rounded-md bg-white/90 text-[#5a5852] opacity-100 hover:bg-white hover:text-[#26251e] sm:opacity-0 sm:group-hover:opacity-100"
                aria-label={`Remove ${attachment.name}`}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2">
        <Input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "h-9 flex-1 border-0 bg-transparent px-0 focus-visible:ring-0 focus-visible:ring-offset-0",
            inputClassName
          )}
        />

        <Button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          size="icon"
          className="h-9 w-9 rounded-md"
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>

      <TooltipProvider delayDuration={150}>
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                aria-pressed={webSearchEnabled}
                onClick={() => setWebSearchEnabled((current) => !current)}
                className={cn(
                  toolButtonClass,
                  webSearchEnabled && "bg-[#efeee8] text-[#26251e]"
                )}
              >
                <Search className="h-4 w-4" />
                <span className="hidden sm:inline">Web search</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Web search</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => photoInputRef.current?.click()}
                className={toolButtonClass}
              >
                <ImagePlus className="h-4 w-4" />
                <span className="hidden sm:inline">Photo upload</span>
                {photoCount > 0 && (
                  <span className="rounded-sm bg-[#26251e] px-1 text-[10px] leading-4 text-white">
                    {photoCount}
                  </span>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Photo upload</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => documentInputRef.current?.click()}
                className={toolButtonClass}
              >
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Document upload</span>
                {documentCount > 0 && (
                  <span className="rounded-sm bg-[#26251e] px-1 text-[10px] leading-4 text-white">
                    {documentCount}
                  </span>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Document upload</TooltipContent>
          </Tooltip>

          <span className="px-1 text-sm text-[#cfcdc4]" aria-hidden="true">
            |
          </span>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 min-w-0 max-w-full gap-1.5 rounded-md px-2 text-xs text-[#5a5852] hover:bg-[#efeee8] hover:text-[#26251e] sm:max-w-[240px]"
              >
                <Sparkles className="h-4 w-4" />
                <span className="truncate">
                  {selectedModel?.name || "VirtuAI Free Model"}
                </span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-64 border-[#e6e5e0] bg-white text-[#26251e]"
            >
              <DropdownMenuItem
                onClick={() => onModelSelect(null)}
                className={cn(!selectedModelId && "bg-[#efeee8]")}
              >
                <Sparkles className="h-4 w-4 text-[#f54e00]" />
                <div className="min-w-0 flex-1">
                  <span className="block truncate">VirtuAI Free Model</span>
                  <span className="block truncate text-[11px] text-[#807d72]">
                    Pollinations
                  </span>
                </div>
                {!selectedModelId && <Check className="h-4 w-4" />}
              </DropdownMenuItem>

              {models.length > 0 && <DropdownMenuSeparator />}

              {models.map((model) => (
                <DropdownMenuItem
                  key={model.id}
                  onClick={() => onModelSelect(model.id)}
                  className={cn(selectedModelId === model.id && "bg-[#efeee8]")}
                >
                  <div className="min-w-0 flex-1">
                    <span className="block truncate">{model.name}</span>
                    <span className="block truncate text-[11px] text-[#807d72]">
                      {PROVIDER_LABELS[model.provider] || model.provider}
                    </span>
                  </div>
                  {selectedModelId === model.id && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TooltipProvider>

      <input
        ref={photoInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handlePhotoChange}
      />
      <input
        ref={documentInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt,.md,.csv,.json,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,text/markdown,text/csv,application/json"
        multiple
        className="hidden"
        onChange={handleDocumentChange}
      />
    </div>
  );
};