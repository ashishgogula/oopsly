"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import BuilderSidebar from "../components/BuilderSidebar";
import TopBar from "../components/TopBar";
import StatusPreview from "../components/StatusPreview";

export type DesignSnapshot = {
  title: string;
  message: string;
  emoji: string;
  bgColor: string;
  showButton: boolean;
  buttonText: string;
  pageType: string;
  animationType: string;
  fontFamily: string;
};

const DEFAULT_STATE: DesignSnapshot = {
  title: "You've Found a Secret Place!",
  message: "This page doesn't exist, but at least you found this cool unicorn 🦄",
  emoji: "🦄",
  bgColor: "bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100",
  showButton: true,
  buttonText: "Back to Reality",
  pageType: "404",
  animationType: "float",
  fontFamily: "sans",
};

const MAX_HISTORY = 100;

export default function GeneratePage() {
  const [title, setTitle] = useState(DEFAULT_STATE.title);
  const [message, setMessage] = useState(DEFAULT_STATE.message);
  const [emoji, setEmoji] = useState(DEFAULT_STATE.emoji);
  const [bgColor, setBgColor] = useState(DEFAULT_STATE.bgColor);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showButton, setShowButton] = useState(DEFAULT_STATE.showButton);
  const [buttonText, setButtonText] = useState(DEFAULT_STATE.buttonText);
  const [pageType, setPageType] = useState(DEFAULT_STATE.pageType);
  const [animationType, setAnimationType] = useState(DEFAULT_STATE.animationType);
  const [fontFamily, setFontFamily] = useState(DEFAULT_STATE.fontFamily);

  const historyRef = useRef<DesignSnapshot[]>([DEFAULT_STATE]);
  const histIdxRef = useRef(0);
  const [, setHistVer] = useState(0);

  function getSnapshot(): DesignSnapshot {
    return { title, message, emoji, bgColor, showButton, buttonText, pageType, animationType, fontFamily };
  }

  function restoreSnapshot(snap: DesignSnapshot) {
    setTitle(snap.title);
    setMessage(snap.message);
    setEmoji(snap.emoji);
    setBgColor(snap.bgColor);
    setShowButton(snap.showButton);
    setButtonText(snap.buttonText);
    setPageType(snap.pageType);
    setAnimationType(snap.animationType);
    setFontFamily(snap.fontFamily);
  }

  const pushHistory = useCallback((snap: DesignSnapshot) => {
    const last = historyRef.current[histIdxRef.current];
    if (JSON.stringify(last) === JSON.stringify(snap)) return;
    let next = historyRef.current.slice(0, histIdxRef.current + 1);
    next.push(snap);
    if (next.length > MAX_HISTORY) next = next.slice(-MAX_HISTORY);
    historyRef.current = next;
    histIdxRef.current = next.length - 1;
    setHistVer((v) => v + 1);
  }, []);

  function undo() {
    if (histIdxRef.current > 0) {
      histIdxRef.current--;
      restoreSnapshot(historyRef.current[histIdxRef.current]);
      setHistVer((v) => v + 1);
    }
  }

  function redo() {
    if (histIdxRef.current < historyRef.current.length - 1) {
      histIdxRef.current++;
      restoreSnapshot(historyRef.current[histIdxRef.current]);
      setHistVer((v) => v + 1);
    }
  }

  const canUndo = histIdxRef.current > 0;
  const canRedo = histIdxRef.current < historyRef.current.length - 1;

  // Load from URL params on mount, fall back to localStorage
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("t") || params.has("m") || params.has("e")) {
      const snap: DesignSnapshot = {
        title: params.get("t") ? decodeURIComponent(params.get("t")!) : DEFAULT_STATE.title,
        message: params.get("m") ? decodeURIComponent(params.get("m")!) : DEFAULT_STATE.message,
        emoji: params.get("e") ? decodeURIComponent(params.get("e")!) : DEFAULT_STATE.emoji,
        bgColor: params.get("bg") ? decodeURIComponent(params.get("bg")!) : DEFAULT_STATE.bgColor,
        showButton: params.get("sb") !== "0",
        buttonText: params.get("bt") ? decodeURIComponent(params.get("bt")!) : DEFAULT_STATE.buttonText,
        pageType: params.get("pt") || DEFAULT_STATE.pageType,
        animationType: params.get("at") || DEFAULT_STATE.animationType,
        fontFamily: params.get("ff") || DEFAULT_STATE.fontFamily,
      };
      restoreSnapshot(snap);
      historyRef.current = [snap];
      histIdxRef.current = 0;
    } else {
      try {
        const saved = localStorage.getItem("oopsly-design");
        if (saved) {
          const snap = JSON.parse(saved) as DesignSnapshot;
          restoreSnapshot(snap);
          historyRef.current = [snap];
          histIdxRef.current = 0;
        }
      } catch { /* ignore */ }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync URL + localStorage whenever state changes
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("t", encodeURIComponent(title));
    params.set("m", encodeURIComponent(message));
    params.set("e", encodeURIComponent(emoji));
    params.set("bg", encodeURIComponent(bgColor));
    params.set("sb", showButton ? "1" : "0");
    params.set("bt", encodeURIComponent(buttonText));
    params.set("pt", pageType);
    params.set("at", animationType);
    params.set("ff", fontFamily);
    window.history.replaceState(null, "", `?${params.toString()}`);
    try {
      const snap = { title, message, emoji, bgColor, showButton, buttonText, pageType, animationType, fontFamily };
      localStorage.setItem("oopsly-design", JSON.stringify(snap));
    } catch { /* ignore */ }
  }, [title, message, emoji, bgColor, showButton, buttonText, pageType, animationType, fontFamily]);

  // Keyboard shortcuts: ⌘Z / ⌘⇧Z
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key === "z") {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isCustomColor = bgColor.startsWith("#");

  return (
    <div className="min-h-screen bg-slate p-4 md:p-6 flex items-center justify-center">
      <div className="w-full max-w-7xl bg-white/80 backdrop-blur-sm border border-black shadow-[0_8px_30px_rgba(99,102,241,0.3)] flex flex-col h-[90vh]">
        <TopBar
          title={title}
          message={message}
          emoji={emoji}
          background={bgColor}
          isFullscreen={isFullscreen}
          setIsFullscreen={setIsFullscreen}
          showButton={showButton}
          buttonText={buttonText}
          pageType={pageType}
          animationType={animationType}
          fontFamily={fontFamily}
        />

        <div
          className={`flex flex-col md:flex-row flex-1 min-h-0 transition-colors duration-300 ${!isCustomColor ? bgColor : ""}`}
          style={{ backgroundColor: isCustomColor ? bgColor : undefined }}
        >
          <div
            className={`transition-all duration-500 ease-in-out border-r border-black overflow-y-auto bg-white ${
              isFullscreen ? "max-w-0 opacity-0 border-r-0 overflow-hidden" : "w-full md:max-w-sm opacity-100"
            }`}
          >
            <BuilderSidebar
              title={title}
              setTitle={setTitle}
              message={message}
              setMessage={setMessage}
              setEmoji={(v) => { setEmoji(v); pushHistory({ ...getSnapshot(), emoji: v }); }}
              background={bgColor}
              setBackground={(v) => { setBgColor(v); pushHistory({ ...getSnapshot(), bgColor: v }); }}
              showButton={showButton}
              setShowButton={(v) => { setShowButton(v); pushHistory({ ...getSnapshot(), showButton: v }); }}
              buttonText={buttonText}
              setButtonText={setButtonText}
              pageType={pageType}
              setPageType={(v) => { setPageType(v); pushHistory({ ...getSnapshot(), pageType: v }); }}
              animationType={animationType}
              setAnimationType={(v) => { setAnimationType(v); pushHistory({ ...getSnapshot(), animationType: v }); }}
              fontFamily={fontFamily}
              setFontFamily={(v) => { setFontFamily(v); pushHistory({ ...getSnapshot(), fontFamily: v }); }}
              onApplyTemplate={(tpl) => {
                setTitle(tpl.title);
                setMessage(tpl.message);
                setEmoji(tpl.emoji);
                setBgColor(tpl.bgColor);
                setButtonText(tpl.buttonText);
                setAnimationType(tpl.animationType);
                pushHistory({ ...getSnapshot(), title: tpl.title, message: tpl.message, emoji: tpl.emoji, bgColor: tpl.bgColor, buttonText: tpl.buttonText, animationType: tpl.animationType });
              }}
              onCommitHistory={() => pushHistory(getSnapshot())}
              onUndo={undo}
              onRedo={redo}
              canUndo={canUndo}
              canRedo={canRedo}
              onReset={() => { restoreSnapshot(DEFAULT_STATE); pushHistory(DEFAULT_STATE); }}
            />
          </div>

          <div className={`flex-1 flex items-center justify-center p-4 ${isFullscreen ? "h-[80dvh]" : ""}`}>
            <StatusPreview
              title={title}
              message={message}
              emoji={emoji}
              showButton={showButton}
              buttonText={buttonText}
              animationType={animationType}
              fontFamily={fontFamily}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
