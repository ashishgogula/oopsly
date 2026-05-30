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

type ExportTab = 'react' | 'middleware' | 'json';

export default function ExportPanel({
  title,
  message,
  emoji,
  animate,
  background,
  showButton,
  buttonText,
}: ExportPanelProps) {
  const [activeTab, setActiveTab] = useState<ExportTab>('react');
  const [jsxComponentCode, setJsxComponentCode] = useState("");
  const [middlewareCode, setMiddlewareCode] = useState("");
  const [jsonCode, setJsonCode] = useState("");
  const [copied, setCopied] = useState<boolean>(false);

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

    const edgeMiddleware = `
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Edge-native analytics tracking for broken links
  if (request.nextUrl.pathname.startsWith('/')) {
    console.log('[Oopsly Edge Analytics] Broken link hit:', request.nextUrl.pathname);
    // You can forward this data to ClickHouse, Mixpanel, etc.
  }
  return NextResponse.next();
}

export const config = {
  matcher: '/:path*',
};
    `.trim();

    const astJson = JSON.stringify({
      schemaVersion: "1.0.0",
      page: {
        title,
        message,
        emoji: {
          icon: emoji,
          animation: animate ? "bounce" : "none"
        },
        styles: {
          background
        },
        actions: showButton ? [
          {
            type: "link",
            href: "/",
            label: buttonText,
            style: "primary"
          }
        ] : []
      }
    }, null, 2);

    setJsxComponentCode(componentCode);
    setMiddlewareCode(edgeMiddleware);
    setJsonCode(astJson);
  }, [title, message, emoji, animate, background, showButton, buttonText]);

  const handleCopy = () => {
    let codeToCopy = "";
    if (activeTab === 'react') codeToCopy = jsxComponentCode;
    if (activeTab === 'middleware') codeToCopy = middlewareCode;
    if (activeTab === 'json') codeToCopy = jsonCode;

    navigator.clipboard.writeText(codeToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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
      className="mt-6 border-t pt-4 px-4 pb-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="flex justify-between items-center mb-3">
        <p className="text-sm font-semibold text-gray-800">Production Export</p>
      </motion.div>
      
      <motion.div variants={itemVariants} className="flex space-x-2 mb-3 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('react')}
          className={`flex-1 text-xs py-1.5 rounded-md transition-colors ${activeTab === 'react' ? 'bg-white shadow-sm font-medium text-black' : 'text-gray-500 hover:text-black'}`}
        >
          React
        </button>
        <button
          onClick={() => setActiveTab('middleware')}
          className={`flex-1 text-xs py-1.5 rounded-md transition-colors ${activeTab === 'middleware' ? 'bg-white shadow-sm font-medium text-black' : 'text-gray-500 hover:text-black'}`}
        >
          Next.js Edge
        </button>
        <button
          onClick={() => setActiveTab('json')}
          className={`flex-1 text-xs py-1.5 rounded-md transition-colors ${activeTab === 'json' ? 'bg-white shadow-sm font-medium text-black' : 'text-gray-500 hover:text-black'}`}
        >
          JSON AST
        </button>
      </motion.div>

      <motion.div variants={itemVariants} className="relative group">
        <pre className="bg-gray-900 text-gray-100 rounded-md p-4 text-xs overflow-x-auto whitespace-pre-wrap max-h-64">
          {activeTab === 'react' && jsxComponentCode}
          {activeTab === 'middleware' && middlewareCode}
          {activeTab === 'json' && jsonCode}
        </pre>
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 bg-white/10 hover:bg-white/20 text-white text-xs px-3 py-1.5 rounded-md transition-colors backdrop-blur-sm"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </motion.div>
    </motion.div>
  );
}
