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

interface TopBarProps {
  title: string;
  message: string;
  emoji: string;
  background: string;
  isFullscreen: boolean;
  setIsFullscreen: (value: boolean) => void;
  showButton: boolean;
  buttonText: string;
}

type ExportTab = "component" | "block";

const TAB_META: Record<ExportTab, { label: string; filename: string; lang: string }> = {
  component: { label: "React Component", filename: "not-found.tsx", lang: "tsx" },
  block:     { label: "JSX Block",        filename: "snippet.jsx",   lang: "jsx" },
};

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 7L5.5 10.5L12 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2 10V2.5A.5.5 0 0 1 2.5 2H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
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
}: TopBarProps) {
  const [activeTab, setActiveTab] = useState<ExportTab>("component");
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const codes = useMemo(() => {
    const isCustomColor = background.startsWith("#");
    const bgStyle = isCustomColor ? ` style={{ backgroundColor: "${background}" }}` : "";
    const bgClass = !isCustomColor ? ` ${background}` : "";

    const buttonHtml = showButton
      ? `\n  <a\n    href="/"\n    className="mt-8 bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors shadow-md"\n  >\n    ${buttonText}\n  </a>`
      : "";

    const block = `<div\n  className="min-h-screen flex flex-col items-center justify-center text-center p-4${bgClass}"${bgStyle}\n>\n  <div className="text-8xl md:text-9xl mb-6">${emoji}</div>\n  <h1 className="text-3xl font-bold mt-4">${title}</h1>\n  <p className="text-lg text-gray-600 mt-2">${message}</p>${buttonHtml}\n</div>`;

    const component = `import React from "react";\n\nexport default function NotFoundPage() {\n  return (\n    ${block.replace(/\n/g, "\n    ")}\n  );\n}`;

    return { component, block } as Record<ExportTab, string>;
  }, [title, message, emoji, background, showButton, buttonText]);

  const activeCode = codes[activeTab];
  const lineCount = activeCode.split("\n").length;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <header className="w-full px-4 py-3 border-b border-black flex items-center justify-between bg-white rounded-t-2xl">
      <h1 className="text-xl font-semibold">Oopsly Builder</h1>

      <div className="flex gap-3">
        <Link href="/" className="text-sm px-3 py-1 rounded-md border border-black hover:bg-gray-100 flex items-center">
          Home
        </Link>
        <Link href="/about" className="text-sm px-3 py-1 rounded-md border border-black hover:bg-gray-100 flex items-center">
          About
        </Link>
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="text-sm px-3 py-1 rounded-md border border-black hover:bg-gray-100"
        >
          {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        </button>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="text-sm px-3 py-1 rounded-md bg-black text-white hover:bg-gray-800">
              Export
            </button>
          </DialogTrigger>
          <AnimatePresence>
            {open && (
              <DialogContent className="w-[80vw] max-w-[80vw] h-[80vh] p-0 overflow-hidden rounded-xl border border-gray-200 shadow-xl gap-0 flex flex-col">
                {/* Header */}
                <div className="px-6 pt-6 pb-4 border-b border-gray-100">
                  <DialogHeader>
                    <DialogTitle className="text-base font-semibold text-gray-900">Export</DialogTitle>
                  </DialogHeader>
                  <p className="text-sm text-gray-500 mt-1">
                    Drop this into your Next.js project. Requires Tailwind CSS.
                  </p>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="px-6 py-4 flex flex-col gap-4 flex-1 overflow-hidden"
                >
                  {/* Tab bar */}
                  <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
                    {(Object.keys(TAB_META) as ExportTab[]).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`relative text-xs px-3 py-1.5 rounded-md font-medium transition-all duration-150 ${
                          activeTab === tab
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        {TAB_META[tab].label}
                      </button>
                    ))}
                  </div>

                  {/* Code block */}
                  <div className="rounded-lg overflow-hidden border border-gray-800 bg-gray-950 flex flex-col flex-1 min-h-0">
                    {/* Code block header */}
                    <div className="flex items-center justify-between px-4 py-2.5 bg-gray-900 border-b border-gray-800">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs font-mono text-gray-400">
                          {TAB_META[activeTab].filename}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-500 font-mono uppercase tracking-wide">
                          {TAB_META[activeTab].lang}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] text-gray-600 tabular-nums">
                          {lineCount} lines
                        </span>
                        <button
                          onClick={handleCopy}
                          className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md transition-all duration-150 ${
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

                    {/* Code content */}
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
