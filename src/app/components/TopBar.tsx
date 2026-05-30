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
  bounce: "",
  spin: "",
  pulse: "",
  shake: `@keyframes oopsly-shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}.oopsly-emoji{animation:oopsly-shake 0.5s ease infinite;animation-delay:2s}`,
  wobble: `@keyframes oopsly-wobble{0%,100%{transform:rotate(0)}25%{transform:rotate(-12deg)}75%{transform:rotate(12deg)}}.oopsly-emoji{animation:oopsly-wobble 0.7s ease infinite;animation-delay:1.5s}`,
};

const ANIM_TAILWIND_CLASS: Record<string, string> = {
  none: "",
  float: "",
  bounce: "animate-bounce",
  spin: "animate-spin",
  pulse: "animate-pulse",
  shake: "",
  wobble: "",
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

const REACT_COMPONENT_NAMES: Record<string, string> = {
  "404": "NotFoundPage",
  "500": "ServerErrorPage",
  "503": "MaintenancePage",
  "401": "UnauthorizedPage",
  "coming-soon": "ComingSoonPage",
  "offline": "OfflinePage",
};

const PAGE_TYPE_TITLES: Record<string, string> = {
  "404": "Not Found",
  "500": "Server Error",
  "503": "Maintenance",
  "401": "Unauthorized",
  "coming-soon": "Coming Soon",
  "offline": "Offline",
};

  const codes = useMemo(() => {
    const isCustomColor = background.startsWith("#");
    const bgStyle = isCustomColor ? ` style="background-color:${background}"` : "";
    const bgClass = !isCustomColor ? ` ${background}` : "";
    const fontDef = FONTS.find((f) => f.id === fontFamily) ?? FONTS[0];

    // Extract the actual font name from fontDef.css (e.g. '"Space Grotesk", sans-serif' -> 'Space Grotesk')
    // This ensures Space Grotesk is not truncated to 'Space' like fontDef.label is.
    const fontNameFromCss = fontDef.css.match(/^"([^"]+)"/)?.[1] ?? fontDef.label;
    // Next.js font/google identifier uses underscores: 'Space Grotesk' -> 'Space_Grotesk'
    const nextjsFontIdentifier = fontNameFromCss.replace(/ /g, "_");
    // Google Fonts URL uses '+': 'Space Grotesk' -> 'Space+Grotesk'
    const googleFontUrlName = fontNameFromCss.replace(/ /g, "+");

    const fontImport = fontFamily !== "sans"
      ? `@import url('https://fonts.googleapis.com/css2?family=${googleFontUrlName}:wght@400;700&display=swap');\n`
      : "";
    const fontStyle = fontFamily !== "sans" ? ` font-family: ${fontDef.css};` : "";
    const animCss = ANIM_CSS[animationType] ?? "";
    // Tailwind utility class for this animation (bounce/spin/pulse), or "" if keyframe-based
    const animTailwindClass = ANIM_TAILWIND_CLASS[animationType] ?? "";
    // For keyframe animations: element gets class "oopsly-emoji" which the injected CSS targets.
    // For Tailwind animations: element gets the Tailwind utility class directly.
    // For "none": no class.
    const emojiClass = animTailwindClass
      ? ` ${animTailwindClass}`
      : animCss
      ? ` oopsly-emoji`
      : "";

    const buttonHtml = showButton
      ? `\n  <a href="/" class="mt-8 inline-block bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors shadow-md">${buttonText}</a>`
      : "";

    // ── React ──────────────────────────────────────────────────────────────────
    const reactButtonJsx = showButton
      ? `\n      <a\n        href="/"\n        className="mt-8 inline-block bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors shadow-md"\n      >\n        ${buttonText}\n      </a>`
      : "";
    // Note: next/font/google is a Next.js-only API. The generated component
    // requires Next.js; it will not work in plain React (CRA/Vite) projects.
    const reactFontImport = fontFamily !== "sans"
      ? `import { ${nextjsFontIdentifier} } from "next/font/google";\n\nconst font = ${nextjsFontIdentifier}({ subsets: ["latin"], weight: ["400", "700"] });\n\n`
      : "";
    const reactFontClass = fontFamily !== "sans" ? ` \${font.className}` : "";
    // Keyframe CSS is injected via a <style> tag inside the component.
    // Tailwind animation classes (animate-bounce etc.) need no style injection.
    const reactAnimStyle = animCss
      ? `\n      <style>{String.raw\`${animCss}\`}</style>`
      : "";
    const reactComponentName = REACT_COMPONENT_NAMES[pageType] ?? "NotFoundPage";
    const react = `import React from "react";\n${reactFontImport}export default function ${reactComponentName}() {\n  return (\n    <div\n      className={\`min-h-screen flex flex-col items-center justify-center text-center p-4${bgClass}${reactFontClass}\`}${isCustomColor ? `\n      style={{ backgroundColor: "${background}" }}` : ""}\n    >${reactAnimStyle}\n      <div className="text-8xl md:text-9xl mb-6${emojiClass}">${emoji}</div>\n      <h1 className="text-3xl font-bold mt-4">${title}</h1>\n      <p className="text-lg text-gray-600 mt-2">${message}</p>${reactButtonJsx}\n    </div>\n  );\n}`;

    // ── HTML ───────────────────────────────────────────────────────────────────
    const htmlPageTitle = PAGE_TYPE_TITLES[pageType] ?? pageType;
    // Only emit the <style> block content that is non-empty
    const htmlStyleContent = [fontImport ? fontImport + "    " : "", `body {${fontStyle} }`, animCss ? `\n    ${animCss}` : ""].join("").trim();
    void htmlStyleContent; // used for reference; actual html template below uses inline expressions
    const html = `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8" />\n  <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n  <title>${htmlPageTitle} – ${title}</title>\n  <script src="https://cdn.tailwindcss.com"><\/script>\n  <style>\n    ${fontImport}body {${fontStyle} }\n    ${animCss}\n  </style>\n</head>\n<body class="min-h-screen flex flex-col items-center justify-center text-center p-4${bgClass}"${bgStyle}>\n  <div class="text-8xl md:text-9xl mb-6${emojiClass}">${emoji}</div>\n  <h1 class="text-3xl font-bold mt-4">${title}</h1>\n  <p class="text-lg text-gray-600 mt-2">${message}</p>${buttonHtml}\n</body>\n</html>`;

    // ── Vue ────────────────────────────────────────────────────────────────────
    // Keyframes must be in a non-scoped <style> block to avoid Vue hashing their
    // names. The font @import and component-level font-family rule go in a
    // separate scoped <style scoped> block so they don't leak globally.
    const vueButton = showButton
      ? `\n    <a href="/" class="mt-8 inline-block bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors shadow-md">${buttonText}</a>`
      : "";
    // Non-scoped block: only keyframe CSS (no font leakage)
    const vueGlobalStyles = animCss;
    // Scoped block: font @import + component font-family rule
    const vueScopedStyles = [
      fontImport,
      fontStyle ? `div { ${fontStyle} }` : "",
    ].filter(Boolean).join("\n");
    const vueGlobalStyleBlock = vueGlobalStyles
      ? `\n\n<style>\n${vueGlobalStyles}\n</style>`
      : "";
    const vueScopedStyleBlock = vueScopedStyles
      ? `\n\n<style scoped>\n${vueScopedStyles}\n</style>`
      : "";
    const vue = `<template>\n  <div\n    class="min-h-screen flex flex-col items-center justify-center text-center p-4${bgClass}"${bgStyle ? `\n    ${bgStyle.trim()}` : ""}\n  >\n    <div class="text-8xl md:text-9xl mb-6${emojiClass}">${emoji}</div>\n    <h1 class="text-3xl font-bold mt-4">${title}</h1>\n    <p class="text-lg text-gray-600 mt-2">${message}</p>${vueButton}\n  </div>\n</template>\n\n<script setup lang="ts">\n// No dynamic data — this is a static ${pageType} page\n</script>${vueGlobalStyleBlock}${vueScopedStyleBlock}`;

    // ── Astro ──────────────────────────────────────────────────────────────────
    // @keyframes must be in <style is:global> because Astro scopes regular
    // <style> blocks (hashing keyframe names breaks animations).
    // @import must also be in <style is:global>: @import inside a scoped Astro
    // <style> block is unreliable across Astro versions.
    const astroButton = showButton
      ? `\n  <a href="/" class="mt-8 inline-block bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors shadow-md">${buttonText}</a>`
      : "";
    // Global block: keyframe CSS + font @import (both must be global)
    const astroGlobalContent = [fontImport, animCss].filter(Boolean).join("\n");
    const astroGlobalStyle = astroGlobalContent
      ? `\n<style is:global>\n  ${astroGlobalContent}\n</style>`
      : "";
    // Scoped block: only the component-level font-family rule
    const astroScopedContent = fontStyle ? `main { ${fontStyle} }` : "";
    const astroLocalStyle = astroScopedContent
      ? `\n<style>\n  ${astroScopedContent}\n</style>\n`
      : "";
    const astro = `---\n// ${BASE_FILENAMES[pageType] ?? "404"}.astro\n---\n${astroGlobalStyle}\n${astroLocalStyle}\n<main class="min-h-screen flex flex-col items-center justify-center text-center p-4${bgClass}"${bgStyle}>\n  <div class="text-8xl md:text-9xl mb-6${emojiClass}">${emoji}</div>\n  <h1 class="text-3xl font-bold mt-4">${title}</h1>\n  <p class="text-lg text-gray-600 mt-2">${message}</p>${astroButton}\n</main>`;

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
        <Link href="/" className="text-sm px-3 py-1.5 rounded-md border border-black/20 hover:border-black hover:bg-gray-50 transition-all duration-150 hidden sm:flex items-center">
          Home
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
