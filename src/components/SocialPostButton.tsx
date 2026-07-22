"use client";

import { useState, useEffect } from "react";
import { Send, MessageCircle, Share2, Check, X, Loader2, ExternalLink } from "lucide-react";

interface SocialPost {
  id: string;
  platform: string;
  status: string;
  sentAt: string | null;
  error: string | null;
}

interface SocialPostButtonProps {
  postId: string;
  postTitle: string;
  postUrl: string;
  postExcerpt?: string;
}

const PLATFORMS = [
  { id: "telegram", name: "Telegram", icon: Send, color: "bg-blue-500 hover:bg-blue-600" },
  { id: "whatsapp", name: "WhatsApp", icon: MessageCircle, color: "bg-green-500 hover:bg-green-600" },
  { id: "vk", name: "VK", icon: Share2, color: "bg-blue-600 hover:bg-blue-700" },
];

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: "Ожидает", color: "text-yellow-400" },
  sent: { label: "Отправлено", color: "text-green-400" },
  failed: { label: "Ошибка", color: "text-red-400" },
};

export function SocialPostButton({
  postId,
  postTitle,
  postUrl,
  postExcerpt,
}: SocialPostButtonProps) {
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([]);
  const [showPanel, setShowPanel] = useState(false);
  const [sending, setSending] = useState<string | null>(null);

  useEffect(() => {
    if (showPanel) {
      fetchSocialPosts();
    }
  }, [showPanel, postId]);

  const fetchSocialPosts = async () => {
    try {
      const res = await fetch(`/api/admin/social?postId=${postId}`);
      if (res.ok) {
        const data = await res.json();
        setSocialPosts(data);
      }
    } catch {}
  };

  const handleSend = async (platform: string) => {
    setSending(platform);
    try {
      // Create social post record
      const createRes = await fetch("/api/admin/social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, platform }),
      });

      if (createRes.status === 409) {
        // Already posted, skip
        setSending(null);
        return;
      }

      if (!createRes.ok) {
        setSending(null);
        return;
      }

      const socialPost = await createRes.json();

      // Build share URL based on platform
      let shareUrl = "";
      const text = `${postTitle}\n\n${postExcerpt || ""}`.trim();
      const encodedUrl = encodeURIComponent(postUrl);
      const encodedText = encodeURIComponent(text);

      switch (platform) {
        case "telegram":
          shareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
          break;
        case "whatsapp":
          shareUrl = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
          break;
        case "vk":
          shareUrl = `https://vk.com/share.php?url=${encodedUrl}&title=${encodedText}`;
          break;
      }

      // Open share window
      if (shareUrl) {
        window.open(shareUrl, "_blank", "width=600,height=400");
      }

      // Mark as sent after a short delay
      await fetch("/api/admin/social", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: socialPost.id, status: "sent" }),
      });

      fetchSocialPosts();
    } catch (err) {
      console.error("Share error:", err);
    } finally {
      setSending(null);
    }
  };

  const getStatusForPlatform = (platform: string) => {
    return socialPosts.find((sp) => sp.platform === platform && sp.status !== "failed");
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="inline-flex items-center gap-1.5 rounded-lg bg-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-600 hover:text-white transition"
      >
        <Share2 className="h-3.5 w-3.5" />
        Поделиться
      </button>

      {showPanel && (
        <div className="absolute right-0 top-full z-50 mt-2 w-72 rounded-xl border border-slate-700 bg-slate-900 p-4 shadow-xl">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-sm font-medium text-slate-100">Поделиться в соцсетях</h4>
            <button
              onClick={() => setShowPanel(false)}
              className="text-slate-400 hover:text-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-2">
            {PLATFORMS.map((platform) => {
              const existing = getStatusForPlatform(platform.id);
              const Icon = platform.icon;

              return (
                <div key={platform.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-300">{platform.name}</span>
                    {existing && (
                      <span className={`text-xs ${STATUS_LABELS[existing.status]?.color || "text-slate-400"}`}>
                        {STATUS_LABELS[existing.status]?.label || existing.status}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleSend(platform.id)}
                    disabled={sending === platform.id || (existing?.status === "sent")}
                    className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium text-white transition disabled:opacity-50 ${
                      existing?.status === "sent"
                        ? "bg-green-800 cursor-default"
                        : platform.color
                    }`}
                  >
                    {sending === platform.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : existing?.status === "sent" ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <ExternalLink className="h-3 w-3" />
                    )}
                    {existing?.status === "sent" ? "Отправлено" : "Отправить"}
                  </button>
                </div>
              );
            })}
          </div>

          {socialPosts.some((sp) => sp.error) && (
            <div className="mt-3 rounded-lg bg-red-900/30 p-2">
              <p className="text-xs text-red-400">
                Ошибки: {socialPosts.filter((sp) => sp.error).map((sp) => `${sp.platform}: ${sp.error}`).join(", ")}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
