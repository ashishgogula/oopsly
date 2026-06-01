"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface ExportPanelProps {
  title: string;
  message: string;
  emoji: string;
  animate: boolean;
  background: string;
  showButton: boolean;
  buttonText: string;
}

export default function ExportPanel({
  title,
  message,
  emoji,
  animate,
  background,
  showButton,
  buttonText,
}: ExportPanelProps) {
  const [jsxBlockCode, setJsxBlockCode] = useState("");
  const [jsxComponentCode, setJsxComponentCode] = useState("");
  const [copied, setCopied] = useState<null | 'block' | 'component'>(null);

  useEffect(() => {
    const isCustomColor = background.startsWith("#");
    const bgStyle = isCustomColor ? `style={{ backgroundColor: "${background}" }}` : "";
    const bgClass = !isCustomColor ? ` ${background}` : "";

    const buttonHtml = showButton
      ? `\n    <a href="/" className="mt-6 bg-black text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-colors shadow-md">\n      ${buttonText}\n    </a>`
      : "";

    const blockCode = `
<div className="min-h-screen flex flex-col items-center justify-center text-center p-4${bgClass}" ${bgStyle}>
  <div className="text-7xl ${animate ? "animate-bounce" : ""}">${emoji}</div>
  <h1 className="text-3xl font-bold mt-4">${title}</h1>
  <p className="text-lg text-gray-600 mt-2">${message}</p>${buttonHtml}
</div>
`.trim();

    const componentCode = `
import React from 'react';

export default function NotFoundPage() {
  return (
    ${blockCode.replace(/\n/g, '\n    ')}
  );
}
    `.trim();

    setJsxBlockCode(blockCode);
    setJsxComponentCode(componentCode);
  }, [title, message, emoji, animate, background, showButton, buttonText]);

  const handleCopy = (type: 'block' | 'component') => {
    const codeToCopy = type === 'block' ? jsxBlockCode : jsxComponentCode;
    navigator.clipboard.writeText(codeToCopy).then(() => {
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className="mt-6 border-t pt-4 px-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.p variants={itemVariants} className="text-sm font-semibold text-gray-800 mb-2">Export Code</motion.p>
      <motion.pre variants={itemVariants} className="bg-gray-100 rounded-md p-3 text-xs overflow-x-auto whitespace-pre-wrap">
        {jsxComponentCode}
      </motion.pre>
      <motion.div variants={itemVariants} className="flex justify-end items-center mt-4 gap-3">
        <button
          onClick={() => handleCopy('block')}
          className="text-sm px-4 py-2 rounded-lg border hover:bg-gray-50 transition-colors"
        >
          {copied === 'block' ? "Copied!" : "Copy Code"}
        </button>
        <button
          onClick={() => handleCopy('component')}
          className="text-sm px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition-colors"
        >
          {copied === 'component' ? "Copied!" : "Copy Component"}
        </button>
      </motion.div>
    </motion.div>
  );
}
