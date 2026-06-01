"use client";

import { useState, use } from "react";
import Emoji404 from "@/app/components/Emoji404";
import { notFound } from "next/navigation";

interface PreviewPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function Preview({ searchParams }: PreviewPageProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const resolvedSearchParams = use(searchParams);

  const id = typeof resolvedSearchParams.id === 'string' ? resolvedSearchParams.id : null;

  if (!id) {
    return notFound();
  }

  try {
    const decoded = decodeURIComponent(id);
    const { title, message, layout, emoji, emojiAnim, bgColor } = JSON.parse(decoded);

    switch (layout) {
      case "emoji":
        return (
          <div className="relative min-h-screen">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="absolute top-4 right-4 z-50 bg-black text-white px-3 py-1 text-sm rounded-md hover:bg-gray-800"
            >
              {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            </button>

            <div
              className={`transition-all duration-300 ${
                isFullscreen
                  ? "fixed inset-0 z-40 w-screen h-screen rounded-none"
                  : "rounded-xl mx-auto max-w-4xl mt-8"
              }`}
            >
              <Emoji404
                emoji={emoji}
                title={title}
                message={message}
                emojiAnim={emojiAnim}
                bgColor={bgColor}
              />
            </div>
          </div>
        );
    }
  } catch (e) {
    console.log(e)
    return notFound();
  }
}