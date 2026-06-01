"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FONTS } from "./BuilderSidebar";

interface StatusPreviewProps {
  title: string;
  message: string;
  emoji: string;
  showButton: boolean;
  buttonText: string;
  animationType: string;
  fontFamily: string;
}

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

type AnimProps = {
  animate: Record<string, number | number[]>;
  transition: Record<string, unknown>;
};

function getEmojiAnim(type: string): AnimProps {
  switch (type) {
    case "float":
      return {
        animate: { y: [-8, 8, -8] },
        transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
      };
    case "bounce":
      return {
        animate: { y: [0, -24, 0] },
        transition: { duration: 0.7, repeat: Infinity, ease: [0.23, 1, 0.32, 1] },
      };
    case "spin":
      return {
        animate: { rotate: [0, 360] },
        transition: { duration: 2, repeat: Infinity, ease: "linear" },
      };
    case "pulse":
      return {
        animate: { scale: [1, 1.18, 1] },
        transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
      };
    case "shake":
      return {
        animate: { x: [-5, 5, -5, 5, 0] },
        transition: { duration: 0.5, repeat: Infinity, repeatDelay: 2 },
      };
    case "wobble":
      return {
        animate: { rotate: [-12, 12, -8, 8, 0] },
        transition: { duration: 0.7, repeat: Infinity, repeatDelay: 1.5 },
      };
    default:
      return { animate: {}, transition: {} };
  }
}

export default function StatusPreview({
  title,
  message,
  emoji,
  showButton,
  buttonText,
  animationType,
  fontFamily,
}: StatusPreviewProps) {
  const fontDef = FONTS.find((f) => f.id === fontFamily) ?? FONTS[0];
  const { animate, transition } = getEmojiAnim(animationType);

  return (
    <div className="flex-1 flex items-center justify-center p-4 w-full">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: EASE_OUT }}
        className="w-full max-w-md text-center"
        style={{ fontFamily: fontDef.css }}
      >
        {/* Emoji with swappable animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={emoji + animationType}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, ...animate }}
            exit={{ scale: 0.6, opacity: 0 }}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            transition={{ scale: { duration: 0.25, ease: EASE_OUT }, opacity: { duration: 0.2 }, ...(transition as any) }}
            className="text-8xl md:text-9xl mb-6 inline-block select-none"
          >
            {emoji}
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.h1
            key={title + fontFamily}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: EASE_OUT }}
            className="text-3xl font-bold text-slate-800"
          >
            {title}
          </motion.h1>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.p
            key={message + fontFamily}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, delay: 0.04, ease: EASE_OUT }}
            className="text-lg text-slate-600 mt-2"
          >
            {message}
          </motion.p>
        </AnimatePresence>

        <AnimatePresence>
          {showButton && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2, ease: EASE_OUT }}
            >
              <button
                className="mt-8 bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 shadow-md active:scale-[0.97] transition-[transform,background-color] duration-100"
                style={{ fontFamily: fontDef.css }}
              >
                {buttonText}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
