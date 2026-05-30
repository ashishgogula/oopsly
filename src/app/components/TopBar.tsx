"use client";

import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { FONTS } from "./BuilderSidebar";

interface TopBarProps {
  title: string;
  message: string;
  emoji: string;
  background: string;
  isFullscreen: boolean;
  setIsFullscreen: (value: boolean) => void;
  showButton: boolean;
  buttonText: string;
  pageType: string;
  animationType: string;
  fontFamily: string;
}

type ExportTab = "react" | "html" | "vue" | "astro";

const REACT_FILENAMES: Record<string, string> = {
  "404": "not-found.tsx",
  "500": "error.tsx",
  "503": "maintenance.tsx",
  "401": "unauthorized.tsx",
  "coming-soon": "coming-soon.tsx",
  "offline": "offline.tsx",
};

const BASE_FILENAMES: Record<string, string> = {
  "404": "404",
  "500": "500",
  "503": "503",
  "401": "401",
  "coming-soon": "coming-soon",
  "offline": "offline",
};

const VUE_COMPONENT_NAMES: Record<string, string> = {
  "404": "NotFound",
  "500": "ServerError",
  "503": "Maintenance",
  "401": "Unauthorized",
  "coming-soon": "ComingSoon",
  "offline": "Offline",
};

function getTabMeta(pageType: string): Record<ExportTab, { label: string; filename: string; lang: string }> {
  const base = BASE_FILENAMES[pageType] ?? "404";
  const vueName = VUE_COMPONENT_NAMES[pageType] ?? "NotFound";
  return {
    react: { label: "React",  filename: REACT_FILENAMES[pageType] ?? "not-found.tsx", lang: "tsx"   },
    html:  { label: "HTML",   filename: `${base}.html`,                                lang: "html"  },
    vue:   { label: "Vue",    filename: `${vueName}.vue`,                              lang: "vue"   },
    astro: { label: "Astro",  filename: `${base}.astro`,                               lang: "astro" },
  };
}

const ANIM_CSS: Record<string, string> = {
  none: "",
  float: `@keyframes oopsly-float{0%,100%{transform:translateY(-8px)}50%{transform:translateY(8px)}}.oopsly-emoji{animation:oopsly-float 3s ease-in-out infinite}`,
  bounce: `@keyframes oopsly-bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-24px)}}.oopsly-emoji{animation:oopsly-bounce 0.7s cubic-bezier(0.23,1,0.32,1) infinite}`,
  spin: `@keyframes oopsly-spin{to{transform:rotate(360deg)}}.oopsly-emoji{animation:oopsly-spin 2s linear infinite}`,
  pulse: `@keyframes oopsly-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.18)}}.oopsly-emoji{animation:oopsly-pulse 1.5s ease-in-out infinite}`,
  shake: `@keyframes oopsly-shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}.oopsly-emoji{animation:oopsly-shake 0.5s ease infinite;animation-delay:2s}`,
  wobble: `@keyframes oopsly-wobble{0%,100%{transform:rotate(0)}25%{transform:rotate(-12deg)}75%{transform:rotate(12deg)}}.oopsly-emoji{animation:oopsly-wobble 0.7s ease infinite;animation-delay:1.5s}`,
};

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2 7L5.5 10.5L12 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="4" y="4" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2 10V2.5A.5.5 0 0 1 2.5 2H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M9 1L13 5L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 5H5a3 3 0 0 0-3 3v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function TopBar({
  title,
  message,
  emoji,
  background,
  isFullscreen,
  setIsFullscreen,
  showButton,
  buttonText,
  pageType,
  animationType,
  fontFamily,
}: TopBarProps) {
  const [activeTab, setActiveTab] = useState<ExportTab>("react");
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [open, setOpen] = useState(false);
  const tabMeta = getTabMeta(pageType);

  const codes = useMemo(() => {
    const isCustomColor = background.startsWith("#");
    const bgStyle = isCustomColor ? ` style="background-color:${background}"` : "";
    const bgClass = !isCustomColor ? ` ${background}` : "";
    const fontDef = FONTS.find((f) => f.id === fontFamily) ?? FONTS[0];
    const fontImport = fontFamily !== "sans"
      ? `@import url('https://fonts.googleapis.com/css2?family=${fontDef.label.replace(/ /g, "+")}:wght@400;700&display=swap');\n`
      : "";
    const fontStyle = fontFamily !== "sans" ? ` font-family: ${fontDef.css};` : "";
    const animCss = ANIM_CSS[animationType] ?? "";
    const emojiClass = animationType !== "none" ? ` oopsly-emoji` : "";

    const buttonHtml = showButton
      ? `\n  <a href="/" class="mt-8 inline-block bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors shadow-md">${buttonText}</a>`
      : "";

    // React
    const reactButtonJsx = showButton
      ? `\n      <a\n        href="/"\n        className="mt-8 inline-block bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors shadow-md"\n      >\n        ${buttonText}\n      </a>`
      : "";
    const reactFontImport = fontFamily !== "sans"
      ? `import { ${fontDef.label.replace(/ /g, "_")} } from "next/font/google";\n\nconst font = ${fontDef.label.replace(/ /g, "_")}({ subsets: ["latin"], weight: ["400", "700"] });\n\n`
      : "";
    const reactFontClass = fontFamily !== "sans" ? ` \${font.className}` : "";
    const reactAnimStyle = animCss
      ? `\n      <style>{String.raw\`${animCss}\`}</style>`
      : "";
    const react = `import React from "react";\n${reactFontImport}export default function ${pageType === "coming-soon" ? "ComingSoon" : "NotFoundPage"}() {\n  return (\n    <div\n      className={\`min-h-screen flex flex-col items-center justify-center text-center p-4${bgClass}${reactFontClass}\`}${isCustomColor ? `\n      style={{ backgroundColor: "${background}" }}` : ""}\n    >${reactAnimStyle}\n      <div className="text-8xl md:text-9xl mb-6${emojiClass}">${emoji}</div>\n      <h1 className="text-3xl font-bold mt-4">${title}</h1>\n      <p className="text-lg text-gray-600 mt-2">${message}</p>${reactButtonJsx}\n    </div>\n  );\n}`;

    // HTML
    const html = `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8" />\n  <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n  <title>${pageType === "coming-soon" ? "Coming Soon" : pageType} – ${title}</title>\n  <script src="https://cdn.tailwindcss.com"></script>\n  <style>\n    ${fontImport}body {${fontStyle} }\n    ${animCss}\n  </style>\n</head>\n<body class="min-h-screen flex flex-col items-center justify-center text-center p-4${bgClass}"${bgStyle}>\n  <div class="text-8xl md:text-9xl mb-6${emojiClass}">${emoji}</div>\n  <h1 class="text-3xl font-bold mt-4">${title}</h1>\n  <p class="text-lg text-gray-600 mt-2">${message}</p>${buttonHtml}\n</body>\n</html>`;

    // Vue
    const vueButton = showButton
      ? `\n    <a href="/" class="mt-8 inline-block bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors shadow-md">${buttonText}</a>`
      : "";
    const vue = `<template>\n  <div\n    class="min-h-screen flex flex-col items-center justify-center text-center p-4${bgClass}"${bgStyle ? `\n    ${bgStyle.trim()}` : ""}\n  >\n    <div class="text-8xl md:text-9xl mb-6${emojiClass}">${emoji}</div>\n    <h1 class="text-3xl font-bold mt-4">${title}</h1>\n    <p class="text-lg text-gray-600 mt-2">${message}</p>${vueButton}\n  </div>\n</template>\n\n<script setup lang="ts">\n// No dynamic data — this is a static ${pageType} page\n</script>\n\n<style scoped>\n${fontImport}${animCss ? animCss + "\n" : ""}${fontStyle ? `div { ${fontStyle} }` : ""}\n</style>`;

    // Astro
    const astroButton = showButton
      ? `\n  <a href="/" class="mt-8 inline-block bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors shadow-md">${buttonText}</a>`
      : "";
    const astro = `---\n// ${pageType === "coming-soon" ? "ComingSoon" : "NotFound"}.astro\n---\n\n<style>\n  ${fontImport}${animCss ? animCss + "\n  " : ""}${fontStyle ? `main { ${fontStyle} }` : ""}\n</style>\n\n<main class="min-h-screen flex flex-col items-center justify-center text-center p-4${bgClass}"${bgStyle}>\n  <div class="text-8xl md:text-9xl mb-6${emojiClass}">${emoji}</div>\n  <h1 class="text-3xl font-bold mt-4">${title}</h1>\n  <p class="text-lg text-gray-600 mt-2">${message}</p>${astroButton}\n</main>`;

    return { react, html, vue, astro } as Record<ExportTab, string>;
  }, [title, message, emoji, background, showButton, buttonText, pageType, animationType, fontFamily]);

  const activeCode = codes[activeTab];
  const lineCount = activeCode.split("\n").length;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    });
  };

  return (
    <header className="w-full px-4 py-3 border-b border-black flex items-center justify-between bg-white rounded-t-2xl">
      <Link href="/" className="text-lg font-semibold hover:opacity-70 transition-opacity">
        Oopsly
      </Link>

      <div className="flex gap-2 items-center">
        <Link href="/about" className="text-sm px-3 py-1.5 rounded-md border border-black/20 hover:border-black hover:bg-gray-50 transition-all duration-150 hidden sm:flex items-center">
          About
        </Link>
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="text-sm px-3 py-1.5 rounded-md border border-black/20 hover:border-black hover:bg-gray-50 transition-all duration-150 active:scale-[0.97]"
        >
          {isFullscreen ? "Exit" : "Fullscreen"}
        </button>

        {/* Share button */}
        <button
          onClick={handleShare}
          className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-md border transition-all duration-150 active:scale-[0.97] ${
            shared
              ? "border-green-500 bg-green-50 text-green-700"
              : "border-black/20 hover:border-black hover:bg-gray-50"
          }`}
        >
          {shared ? <CheckIcon /> : <ShareIcon />}
          <span>{shared ? "Copied!" : "Share"}</span>
        </button>

        {/* Export dialog */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="text-sm px-3 py-1.5 rounded-md bg-black text-white hover:bg-gray-800 transition-all duration-150 active:scale-[0.97]">
              Export
            </button>
          </DialogTrigger>
          <AnimatePresence>
            {open && (
              <DialogContent className="w-[85vw] max-w-[900px] h-[80vh] p-0 overflow-hidden rounded-xl border border-gray-200 shadow-2xl gap-0 flex flex-col">
                {/* Header */}
                <div className="px-6 pt-5 pb-4 border-b border-gray-100 shrink-0">
                  <DialogHeader>
                    <DialogTitle className="text-base font-semibold text-gray-900">Export code</DialogTitle>
                  </DialogHeader>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Copy into your project. Requires Tailwind CSS (except HTML which includes the CDN).
                  </p>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
                  className="px-6 py-4 flex flex-col gap-4 flex-1 overflow-hidden min-h-0"
                >
                  {/* Tab bar */}
                  <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit shrink-0">
                    {(Object.keys(tabMeta) as ExportTab[]).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`relative text-xs px-3 py-1.5 rounded-md font-medium transition-all duration-150 ${
                          activeTab === tab
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        {tabMeta[tab].label}
                      </button>
                    ))}
                  </div>

                  {/* Code block */}
                  <div className="rounded-lg overflow-hidden border border-gray-800 bg-gray-950 flex flex-col flex-1 min-h-0">
                    {/* Code block header */}
                    <div className="flex items-center justify-between px-4 py-2.5 bg-gray-900 border-b border-gray-800 shrink-0">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs font-mono text-gray-400">{tabMeta[activeTab].filename}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-500 font-mono uppercase tracking-wide">
                          {tabMeta[activeTab].lang}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] text-gray-600 tabular-nums">{lineCount} lines</span>
                        <button
                          onClick={handleCopy}
                          className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md transition-all duration-150 active:scale-95 ${
                            copied
                              ? "bg-green-500/15 text-green-400"
                              : "bg-white/8 text-gray-400 hover:text-white hover:bg-white/12"
                          }`}
                        >
                          {copied ? <CheckIcon /> : <CopyIcon />}
                          {copied ? "Copied" : "Copy"}
                        </button>
                      </div>
                    </div>

                    {/* Code */}
                    <pre className="text-gray-200 text-xs font-mono p-4 overflow-auto flex-1 leading-relaxed">
                      <code>{activeCode}</code>
                    </pre>
                  </div>
                </motion.div>
              </DialogContent>
            )}
          </AnimatePresence>
        </Dialog>
      </div>
    </header>
  );
}
