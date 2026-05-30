"use client";

import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import presets from "@/app/_data/presets.json";

export const FONTS = [
  { id: "sans", label: "System", css: "ui-sans-serif, system-ui, sans-serif" },
  { id: "playfair", label: "Playfair", css: '"Playfair Display", serif' },
  { id: "space-grotesk", label: "Space", css: '"Space Grotesk", sans-serif' },
  { id: "dm-sans", label: "DM Sans", css: '"DM Sans", sans-serif' },
  { id: "lora", label: "Lora", css: '"Lora", serif' },
  { id: "syne", label: "Syne", css: '"Syne", sans-serif' },
  { id: "bricolage", label: "Bricolage", css: '"Bricolage Grotesque", sans-serif' },
];

export const ANIMATIONS = [
  { id: "none", label: "Static", symbol: "—" },
  { id: "float", label: "Float", symbol: "↕" },
  { id: "bounce", label: "Bounce", symbol: "⬆" },
  { id: "spin", label: "Spin", symbol: "↻" },
  { id: "pulse", label: "Pulse", symbol: "◎" },
  { id: "shake", label: "Shake", symbol: "↔" },
  { id: "wobble", label: "Wobble", symbol: "〜" },
];

export const PAGE_TYPES = [
  { id: "404", label: "404", desc: "Not Found" },
  { id: "500", label: "500", desc: "Server Error" },
  { id: "503", label: "503", desc: "Maintenance" },
  { id: "401", label: "401", desc: "Unauthorized" },
  { id: "coming-soon", label: "Soon", desc: "Coming Soon" },
  { id: "offline", label: "Offline", desc: "No Connection" },
];

export type PageTemplate = {
  title: string;
  message: string;
  emoji: string;
  bgColor: string;
  buttonText: string;
  animationType: string;
};

export const PAGE_TYPE_TEMPLATES: Record<string, PageTemplate> = {
  "404": {
    title: "You've Found a Secret Place!",
    message: "This page doesn't exist, but at least you found this cool unicorn 🦄",
    emoji: "🦄",
    bgColor: "bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100",
    buttonText: "Back to Reality",
    animationType: "float",
  },
  "500": {
    title: "Something Went Wrong",
    message: "Our servers hit a snag. We're on it — please try again in a moment.",
    emoji: "🔥",
    bgColor: "bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50",
    buttonText: "Try Again",
    animationType: "shake",
  },
  "503": {
    title: "We'll Be Back Soon",
    message: "We're doing some maintenance. Grab a coffee — this won't take long ☕",
    emoji: "🚧",
    bgColor: "bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50",
    buttonText: "Check Status",
    animationType: "pulse",
  },
  "401": {
    title: "Access Denied",
    message: "You need to be logged in to view this page. Don't worry, it happens.",
    emoji: "🔒",
    bgColor: "bg-gradient-to-br from-slate-100 via-gray-100 to-zinc-100",
    buttonText: "Sign In",
    animationType: "wobble",
  },
  "coming-soon": {
    title: "Something Exciting is Coming",
    message: "We're building something great. Stay tuned and be the first to know!",
    emoji: "🚀",
    bgColor: "bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100",
    buttonText: "Notify Me",
    animationType: "bounce",
  },
  "offline": {
    title: "You're Offline",
    message: "It looks like you've lost your internet connection. Check your network and try again.",
    emoji: "📡",
    bgColor: "bg-gradient-to-br from-gray-100 via-slate-100 to-blue-50",
    buttonText: "Retry",
    animationType: "wobble",
  },
};

interface BuilderSidebarProps {
  title: string;
  setTitle: (v: string) => void;
  message: string;
  setMessage: (v: string) => void;
  setEmoji: (v: string) => void;
  background: string;
  setBackground: (v: string) => void;
  showButton: boolean;
  setShowButton: (v: boolean) => void;
  buttonText: string;
  setButtonText: (v: string) => void;
  pageType: string;
  setPageType: (v: string) => void;
  animationType: string;
  setAnimationType: (v: string) => void;
  fontFamily: string;
  setFontFamily: (v: string) => void;
  onCommitHistory: () => void;
  onApplyTemplate: (t: PageTemplate) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onReset: () => void;
}

const palettes = [
  "bg-white",
  "bg-gray-100",
  "bg-yellow-100",
  "bg-blue-100",
  "bg-pink-100",
  "bg-green-100",
  "bg-purple-100",
  "bg-red-100",
  "bg-indigo-100",
  "bg-orange-100",
  "bg-teal-100",
  "bg-lime-100",
  "bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100",
  "bg-gradient-to-r from-yellow-100 via-red-100 to-pink-100",
  "bg-gradient-to-bl from-indigo-100 via-blue-100 to-teal-100",
];

const errorEmojis = ["😿", "🤖", "🧐", "🔍", "🤔", "🚧", "🤷", "🧭", "❓", "💔", "⚠️", "🚨"];

const EASE_OUT = [0.23, 1, 0.32, 1] as [number, number, number, number];

const sectionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: EASE_OUT } },
};

export default function BuilderSidebar({
  title,
  setTitle,
  message,
  setMessage,
  setEmoji,
  background,
  setBackground,
  showButton,
  setShowButton,
  buttonText,
  setButtonText,
  pageType,
  setPageType,
  animationType,
  setAnimationType,
  fontFamily,
  setFontFamily,
  onCommitHistory,
  onApplyTemplate,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onReset,
}: BuilderSidebarProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  return (
    <motion.aside
      className="w-full max-w-sm bg-white p-4 space-y-5"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
    >
      {/* Undo / Redo / Reset row */}
      <motion.div variants={sectionVariants} className="flex items-center gap-2 pt-1">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo (⌘Z)"
          className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-md border border-black/20 hover:border-black hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150 active:scale-95"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 5H8a3 3 0 0 1 0 6H5" />
            <path d="M2 5L4.5 2.5M2 5L4.5 7.5" />
          </svg>
          Undo
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo (⌘⇧Z)"
          className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-md border border-black/20 hover:border-black hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150 active:scale-95"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 5H4a3 3 0 0 0 0 6h3" />
            <path d="M10 5L7.5 2.5M10 5L7.5 7.5" />
          </svg>
          Redo
        </button>
        <button
          onClick={onReset}
          className="ml-auto text-xs px-2.5 py-1.5 rounded-md border border-black/20 hover:border-black hover:bg-gray-50 text-gray-500 transition-all duration-150 active:scale-95"
        >
          Reset
        </button>
      </motion.div>

      {/* Page Type */}
      <motion.div variants={sectionVariants}>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Page Type</label>
        <div className="grid grid-cols-3 gap-1.5">
          {PAGE_TYPES.map((pt) => (
            <button
              key={pt.id}
              onClick={() => {
                setPageType(pt.id);
                const tpl = PAGE_TYPE_TEMPLATES[pt.id];
                if (tpl) onApplyTemplate(tpl);
              }}
              className={`flex flex-col items-center py-2 px-1 rounded-lg border text-center transition-all duration-150 active:scale-95 ${
                pageType === pt.id
                  ? "border-black bg-black text-white"
                  : "border-black/20 hover:border-black/60 hover:bg-gray-50"
              }`}
            >
              <span className="text-xs font-bold leading-none">{pt.label}</span>
              <span className={`text-[10px] mt-0.5 leading-none ${pageType === pt.id ? "text-white/70" : "text-gray-400"}`}>{pt.desc}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Presets */}
      <motion.div variants={sectionVariants}>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Preset</label>
        <div className="relative">
          <select
            onChange={(e) => {
              const selected = presets.find((p) => p.id === e.target.value);
              if (selected) {
                setTitle(selected.title);
                setMessage(selected.message);
                setEmoji(selected.emoji);
                setBackground(selected.background);
                setShowButton(selected.showButton);
                setButtonText(selected.buttonText);
              }
            }}
            defaultValue=""
            className="w-full p-2.5 pr-10 border border-black rounded-lg bg-white text-sm appearance-none cursor-pointer focus:ring-2 focus:ring-black/20 transition-all"
          >
            <option value="" disabled>Choose a preset…</option>
            {presets.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.emoji} {preset.name}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </motion.div>

      {/* Title */}
      <motion.div variants={sectionVariants}>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={onCommitHistory}
          placeholder="Enter your page title…"
          className="w-full p-2.5 border border-black rounded-lg text-sm focus:ring-2 focus:ring-black/20 focus:border-black transition-all"
        />
        <div className="text-[11px] text-gray-400 mt-1 text-right">{title.length}/60</div>
      </motion.div>

      {/* Message */}
      <motion.div variants={sectionVariants}>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onBlur={onCommitHistory}
          placeholder="Describe what happened…"
          rows={3}
          className="w-full p-2.5 border border-black rounded-lg text-sm focus:ring-2 focus:ring-black/20 focus:border-black transition-all resize-none"
        />
        <div className="text-[11px] text-gray-400 text-right">{message.length}/200</div>
      </motion.div>

      {/* Emoji */}
      <motion.div variants={sectionVariants}>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Emoji</label>
        <div className="grid grid-cols-6 gap-1.5 mb-2">
          {errorEmojis.map((e) => (
            <button
              key={e}
              onClick={() => setEmoji(e)}
              className="text-xl p-1.5 rounded-lg hover:bg-gray-100 transition-all duration-150 active:scale-90"
            >
              {e}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="w-full p-2 text-xs font-medium border border-black/30 rounded-lg hover:bg-gray-50 hover:border-black transition-all duration-150 active:scale-[0.98]"
        >
          {showEmojiPicker ? "↑ Close picker" : "Browse all emojis →"}
        </button>
        <AnimatePresence>
          {showEmojiPicker && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
              className="mt-2 border border-black rounded-lg overflow-hidden"
            >
              <Picker
                data={data}
                onEmojiSelect={(e: { native: string }) => {
                  setEmoji(e.native);
                  setShowEmojiPicker(false);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Emoji Animation */}
      <motion.div variants={sectionVariants}>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Emoji Animation</label>
        <div className="grid grid-cols-4 gap-1.5">
          {ANIMATIONS.map((anim) => (
            <button
              key={anim.id}
              onClick={() => setAnimationType(anim.id)}
              className={`flex flex-col items-center gap-0.5 py-2 px-1 rounded-lg border text-center transition-all duration-150 active:scale-95 ${
                animationType === anim.id
                  ? "border-black bg-black text-white"
                  : "border-black/20 hover:border-black/60 hover:bg-gray-50"
              }`}
            >
              <span className="text-base leading-none">{anim.symbol}</span>
              <span className={`text-[10px] leading-none mt-0.5 ${animationType === anim.id ? "text-white/70" : "text-gray-400"}`}>{anim.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Font */}
      <motion.div variants={sectionVariants}>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Font</label>
        <div className="grid grid-cols-2 gap-1.5">
          {FONTS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFontFamily(f.id)}
              style={{ fontFamily: f.css }}
              className={`py-2 px-3 rounded-lg border text-sm text-left transition-all duration-150 active:scale-[0.97] ${
                fontFamily === f.id
                  ? "border-black bg-black text-white"
                  : "border-black/20 hover:border-black/60 hover:bg-gray-50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Button */}
      <motion.div variants={sectionVariants}>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">CTA Button</label>
        <div className="space-y-2">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={showButton}
              onChange={() => setShowButton(!showButton)}
              className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer"
            />
            <span className="text-sm text-gray-700">Show call-to-action button</span>
          </label>
          <AnimatePresence>
            {showButton && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              >
                <input
                  value={buttonText}
                  onChange={(e) => setButtonText(e.target.value)}
                  onBlur={onCommitHistory}
                  placeholder="Button text…"
                  className="w-full p-2.5 border border-black rounded-lg text-sm focus:ring-2 focus:ring-black/20 focus:border-black transition-all"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Background */}
      <motion.div variants={sectionVariants} className="pb-4">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Background</label>
        <div className="grid grid-cols-6 gap-2">
          {palettes.map((p) => (
            <div
              key={p}
              onClick={() => setBackground(p)}
              className={`w-8 h-8 rounded-lg cursor-pointer border-2 hover:scale-110 transition-transform duration-150 ${
                p.includes("gradient") ? p : p
              } ${background === p ? "border-black ring-2 ring-black ring-offset-1" : "border-black/20"}`}
            />
          ))}
        </div>
      </motion.div>
    </motion.aside>
  );
}
