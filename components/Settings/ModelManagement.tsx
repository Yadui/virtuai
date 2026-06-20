"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Settings, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Model {
  id: string;
  name: string;
  provider: string;
  apiUrl: string;
  apiKey?: string;
  deploymentName?: string;
  isDefault: boolean;
}

interface ModelFormProps {
  model?: Model | null;
  onSave: () => void;
  onCancel: () => void;
}

const PROVIDERS = [
  { value: "azure", label: "Azure OpenAI" },
  { value: "openai", label: "OpenAI" },
  { value: "github-copilot", label: "GitHub Copilot" },
  { value: "openrouter", label: "OpenRouter" },
  { value: "anthropic", label: "Anthropic" },
  { value: "custom", label: "Custom API" },
];

const MODEL_NAME_PROVIDERS = [
  "azure",
  "openai",
  "github-copilot",
  "openrouter",
  "anthropic",
];

const getApiKeyPlaceholder = (provider: string) => {
  switch (provider) {
    case "github-copilot":
      return "github_pat_...";
    case "anthropic":
      return "sk-ant-...";
    case "openrouter":
      return "sk-or-...";
    default:
      return "sk-...";
  }
};

const getApiKeyLabel = (provider: string) => {
  if (provider === "github-copilot") return "GitHub Token";

  return "API Key";
};

const getModelNamePlaceholder = (provider: string) => {
  switch (provider) {
    case "azure":
      return "gpt-4o";
    case "github-copilot":
      return "openai/gpt-4.1";
    case "openrouter":
      return "openai/gpt-4o or anthropic/claude-3-opus";
    case "anthropic":
      return "claude-3-5-sonnet-20241022";
    default:
      return "gpt-4o-mini";
  }
};

function ModelForm({ model, onSave, onCancel }: ModelFormProps) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(model?.name || "");
  const [provider, setProvider] = useState(model?.provider || "openai");
  const [apiUrl, setApiUrl] = useState(model?.apiUrl || "");
  const [apiKey, setApiKey] = useState(model?.apiKey || "");
  const [deploymentName, setDeploymentName] = useState(model?.deploymentName || "");
  const [isDefault, setIsDefault] = useState(model?.isDefault || false);

  // Set default URLs based on provider
  useEffect(() => {
    if (!model) {
      switch (provider) {
        case "openai":
          setApiUrl("https://api.openai.com/v1/chat/completions");
          break;
        case "github-copilot":
          setApiUrl("https://models.github.ai/inference/chat/completions");
          break;
        case "openrouter":
          setApiUrl("https://openrouter.ai/api/v1/chat/completions");
          break;
        case "anthropic":
          setApiUrl("https://api.anthropic.com/v1/messages");
          break;
        case "azure":
          setApiUrl("");
          break;
        default:
          setApiUrl("");
      }
    }
  }, [provider, model]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = model ? `/api/models/${model.id}` : "/api/models";
      const method = model ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          provider,
          apiUrl,
          apiKey,
          deploymentName: MODEL_NAME_PROVIDERS.includes(provider) ? deploymentName : null,
          isDefault,
        }),
      });

      if (response.ok) {
        onSave();
      }
    } catch (error) {
      console.error("Failed to save model:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">
          Model Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="My Custom Model"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="provider">
          Provider <span className="text-red-500">*</span>
        </Label>
        <Select value={provider} onValueChange={setProvider}>
          <SelectTrigger>
            <SelectValue placeholder="Select provider" />
          </SelectTrigger>
          <SelectContent>
            {PROVIDERS.map((p) => (
              <SelectItem key={p.value} value={p.value}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="apiUrl">API URL</Label>
        <Input
          id="apiUrl"
          value={apiUrl}
          onChange={(e) => setApiUrl(e.target.value)}
          placeholder={
            provider === "azure" ? "https://your-resource.openai.azure.com/..." :
            provider === "github-copilot" ? "https://models.github.ai/inference/chat/completions" :
            "API endpoint URL"
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="apiKey">
          {getApiKeyLabel(provider)} <span className="text-red-500">*</span>
        </Label>
        <Input
          id="apiKey"
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder={model ? "Leave empty to keep existing" : getApiKeyPlaceholder(provider)}
          required={!model}
        />
        <p className="text-xs text-muted-foreground">
          Your credential is stored with the model configuration.
        </p>
      </div>

      {MODEL_NAME_PROVIDERS.includes(provider) && (
        <div className="space-y-2">
          <Label htmlFor="deploymentName">
            {provider === "azure" ? "Deployment Name" : "Model Name"}
            {provider === "azure" && <span className="text-red-500"> *</span>}
          </Label>
          <Input
            id="deploymentName"
            value={deploymentName}
            onChange={(e) => setDeploymentName(e.target.value)}
            placeholder={getModelNamePlaceholder(provider)}
            required={provider === "azure"}
          />
          {provider === "github-copilot" && (
            <p className="text-xs text-muted-foreground">
              Use a GitHub Models id available to your token, for example openai/gpt-4.1.
            </p>
          )}
          {provider === "openrouter" && (
            <p className="text-xs text-muted-foreground">
              Use format: provider/model (e.g., openai/gpt-4o, anthropic/claude-3-opus)
            </p>
          )}
        </div>
      )}

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isDefault"
          checked={isDefault}
          onChange={(e) => setIsDefault(e.target.checked)}
          className="rounded border-gray-300"
        />
        <Label htmlFor="isDefault" className="font-normal">
          Set as default model
        </Label>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {model ? "Update" : "Add"} Model
        </Button>
      </div>
    </form>
  );
}

export function ModelManagement() {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<Model | null>(null);

  const fetchModels = async () => {
    try {
      const response = await fetch("/api/models");
      if (response.ok) {
        const data = await response.json();
        setModels(data);
      }
    } catch (error) {
      console.error("Failed to fetch models:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const handleEdit = async (model: Model) => {
    // Fetch full model data including API key
    try {
      const response = await fetch(`/api/models/${model.id}`);
      if (response.ok) {
        const fullModel = await response.json();
        setEditingModel(fullModel);
        setDialogOpen(true);
      }
    } catch (error) {
      console.error("Failed to fetch model:", error);
    }
  };

  const handleDelete = async (modelId: string) => {
    if (!confirm("Are you sure you want to delete this model?")) return;

    try {
      const response = await fetch(`/api/models/${modelId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchModels();
      }
    } catch (error) {
      console.error("Failed to delete model:", error);
    }
  };

  const handleSave = () => {
    setDialogOpen(false);
    setEditingModel(null);
    fetchModels();
  };

  const handleCancel = () => {
    setDialogOpen(false);
    setEditingModel(null);
  };

  const handleAddNew = () => {
    setEditingModel(null);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[#26251e]">Models</h3>
          <p className="text-sm text-[#5a5852]">
            Chat uses the free model automatically until you attach a custom model
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Model
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingModel ? "Edit Model" : "Add New Model"}
              </DialogTitle>
              <DialogDescription>
                Configure your AI model connection settings
              </DialogDescription>
            </DialogHeader>
            <ModelForm
              model={editingModel}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-xl border border-[#e6e5e0] bg-white p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-[#e6e5e0] bg-[#fafaf7] text-[#f54e00]">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium text-[#26251e]">VirtuAI Free Model</span>
              <span className="rounded-full bg-[#e6e5e0] px-2 py-0.5 text-xs text-[#26251e]">
                Active fallback
              </span>
            </div>
            <p className="mt-1 text-sm leading-6 text-[#5a5852]">
              Powered by Pollinations. No API key is required, and it is used whenever no custom model is selected.
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : models.length === 0 ? (
        <div className="rounded-xl border border-[#e6e5e0] bg-white py-10 text-center text-[#807d72]">
          <Settings className="mx-auto mb-2 h-10 w-10 opacity-60" />
          <p className="text-[#26251e]">No custom models attached</p>
          <p className="text-sm">VirtuAI will keep using the free model for chat responses.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {models.map((model) => (
            <div
              key={model.id}
              className="flex items-center justify-between rounded-xl border border-[#e6e5e0] bg-white p-4"
            >
              <div className="flex items-center gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[#26251e]">{model.name}</span>
                    {model.isDefault && (
                      <span className="rounded-full bg-[#e6e5e0] px-2 py-0.5 text-xs text-[#26251e]">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-[#807d72]">
                    {PROVIDERS.find((p) => p.value === model.provider)?.label || model.provider}
                    {model.deploymentName && ` • ${model.deploymentName}`}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(model)}
                  className="text-[#807d72] hover:text-[#26251e]"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(model.id)}
                  className="text-[#cf2d56] hover:text-[#a61f43]"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
