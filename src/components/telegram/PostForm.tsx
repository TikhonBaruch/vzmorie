"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import {
  Camera,
  Mic,
  Send,
  MapPin,
  X,
  Loader2,
  CheckCircle,
} from "lucide-react";

interface PostFormData {
  title: string;
  content: string;
  type: string;
  tags: string[];
  location: string;
  fishType: string;
  weight: string;
  images: File[];
}

export function PostForm() {
  const [formData, setFormData] = useState<PostFormData>({
    title: "",
    content: "",
    type: "CATCH",
    tags: [],
    location: "",
    fishType: "",
    weight: "",
    images: [],
  });
  const [isRecording, setIsRecording] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const createPost = trpc.post.create.useMutation({
    onSuccess: () => {
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
      setFormData({
        title: "",
        content: "",
        type: "CATCH",
        tags: [],
        location: "",
        fishType: "",
        weight: "",
        images: [],
      });
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files].slice(0, 5),
    }));
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const addTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
    }
  };

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Upload images first
    const uploadedUrls: string[] = [];
    for (const image of formData.images) {
      try {
        const response = await fetch("/api/upload/presign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filename: image.name,
            contentType: image.type,
            folder: "posts",
          }),
        });
        const { uploadUrl, publicUrl } = await response.json();

        await fetch(uploadUrl, {
          method: "PUT",
          body: image,
          headers: { "Content-Type": image.type },
        });

        uploadedUrls.push(publicUrl);
      } catch (error) {
        console.error("Upload failed:", error);
      }
    }

    // Create post
    createPost.mutate({
      title: formData.title || "Новый пост",
      slug: `post-${Date.now()}`,
      content: formData.content,
      type: formData.type as any,
      tags: formData.tags,
      location: formData.location,
      fishType: formData.fishType || undefined,
      weight: formData.weight ? parseFloat(formData.weight) : undefined,
      coverImage: uploadedUrls[0] || undefined,
    });

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Success message */}
      {isSuccess && (
        <div className="flex items-center gap-2 rounded-xl bg-green-900/30 p-4 text-green-300">
          <CheckCircle className="h-5 w-5" />
          Публикация отправлена на модерацию!
        </div>
      )}

      {/* Title */}
      <div>
        <input
          type="text"
          placeholder="Заголовок (необязательно)"
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
          className="w-full rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3 text-slate-100 placeholder-slate-500 focus:border-terracotta-500 focus:outline-none"
        />
      </div>

      {/* Content */}
      <div>
        <textarea
          placeholder="Опишите улов, погоду, условия..."
          value={formData.content}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, content: e.target.value }))
          }
          rows={4}
          className="w-full rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3 text-slate-100 placeholder-slate-500 focus:border-terracotta-500 focus:outline-none resize-none"
        />
      </div>

      {/* Type selector */}
      <div>
        <select
          value={formData.type}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, type: e.target.value }))
          }
          className="w-full rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3 text-slate-100 focus:border-terracotta-500 focus:outline-none"
        >
          <option value="CATCH">🐟 Улов</option>
          <option value="WEATHER">🌤 Погода</option>
          <option value="WATER_LEVEL">🌊 Уровень воды</option>
          <option value="EVENT">📅 Событие</option>
          <option value="PROMO">🎉 Акция</option>
          <option value="NEWS">📰 Новость</option>
        </select>
      </div>

      {/* Fish type and weight (for catches) */}
      {formData.type === "CATCH" && (
        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Вид рыбы"
            value={formData.fishType}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, fishType: e.target.value }))
            }
            className="rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3 text-slate-100 placeholder-slate-500 focus:border-terracotta-500 focus:outline-none"
          />
          <input
            type="number"
            placeholder="Вес (кг)"
            value={formData.weight}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, weight: e.target.value }))
            }
            className="rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3 text-slate-100 placeholder-slate-500 focus:border-terracotta-500 focus:outline-none"
          />
        </div>
      )}

      {/* Location */}
      <div>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Место (необязательно)"
            value={formData.location}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, location: e.target.value }))
            }
            className="w-full rounded-xl border border-slate-800 bg-slate-900/50 py-3 pl-10 pr-4 text-slate-100 placeholder-slate-500 focus:border-terracotta-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Tags */}
      <div>
        <div className="flex flex-wrap gap-2">
          {formData.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-200"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          <input
            type="text"
            placeholder="Добавить тег"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag((e.target as HTMLInputElement).value);
                (e.target as HTMLInputElement).value = "";
              }
            }}
            className="w-24 rounded-full border border-slate-800 bg-slate-900/50 px-3 py-1 text-xs text-slate-100 placeholder-slate-500 focus:border-terracotta-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Image upload */}
      <div>
        <div className="flex flex-wrap gap-2">
          {formData.images.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={URL.createObjectURL(image)}
                alt=""
                className="h-20 w-20 rounded-xl object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -right-1 -top-1 rounded-full bg-slate-900 p-0.5 text-slate-400 hover:text-slate-200"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {formData.images.length < 5 && (
            <label className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-xl border border-dashed border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200">
              <Camera className="h-5 w-5" />
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>

      {/* Submit buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setIsRecording(!isRecording)}
          className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition ${
            isRecording
              ? "bg-red-600 text-white"
              : "border border-slate-800 bg-slate-900/50 text-slate-200 hover:bg-slate-800"
          }`}
        >
          <Mic className="h-4 w-4" />
          {isRecording ? "Стоп" : "Голос"}
        </button>

        <button
          type="submit"
          disabled={isSubmitting || (!formData.content && !formData.title)}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-terracotta-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-terracotta-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          {isSubmitting ? "Отправка..." : "Отправить"}
        </button>
      </div>
    </form>
  );
}
