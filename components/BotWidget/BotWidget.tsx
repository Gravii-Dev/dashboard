"use client";

import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import { cx } from "@/lib/utils";
import s from "./BotWidget.module.css";

const TAMBO_API_KEY = process.env.NEXT_PUBLIC_TAMBO_API_KEY ?? "";

const TamboChat = dynamic(() => import("./TamboChat"), { ssr: false });

function FallbackChat({ isCampaignMode }: { isCampaignMode?: boolean }) {
  const [inputText, setInputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const mode = isCampaignMode
    ? {
        name: "Launch Assistant",
        label: "Campaign Builder",
        modeCls: s.modeCampaign,
        placeholder: "Describe your campaign in plain English",
        hint: 'Fill in the form yourself, or type here and we\'ll set it up.<br><br>e.g. "Yield boost for top 5% stakers on Ethereum"',
      }
    : {
        name: "Gravii Insights",
        label: "Data Insights",
        modeCls: s.modeInsights,
        placeholder: "Ask about your users' data",
        hint: 'Explore the dashboard, or type a question here.<br><br>e.g. "Which segment has the highest retention?"',
      };

  const handleSend = () => {
    if (!inputText.trim() || isProcessing) return;
    setIsProcessing(true);

    setInputText("Processing...");
    if (textareaRef.current) textareaRef.current.style.color = "var(--accent-blue)";

    setTimeout(() => {
      setInputText("AI assistant will be available when connected to Tambo API.");
      if (textareaRef.current) textareaRef.current.style.color = "var(--text-muted)";
      setTimeout(() => {
        setIsProcessing(false);
        setInputText("");
        if (textareaRef.current) textareaRef.current.style.color = "";
      }, 3000);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={s.wrapper}>
      <div className={s.header}>
        <div className={s.label}>{mode.name}</div>
        <span className={cx(s.mode, mode.modeCls)}>{mode.label}</span>
      </div>
      <div className={cx(s.box, isCampaignMode && s.boxCampaign)}>
        <div className={s.inputWrap}>
          <textarea
            ref={textareaRef}
            className={s.input}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={mode.placeholder}
            disabled={isProcessing}
          />
          <button className={s.send} onClick={handleSend} disabled={isProcessing}>
            {"->"}
          </button>
        </div>
        <div className={s.hint} dangerouslySetInnerHTML={{ __html: mode.hint }} />
      </div>
    </div>
  );
}

export default function BotWidget({ isCampaignMode }: { isCampaignMode?: boolean }) {
  if (TAMBO_API_KEY) {
    return <TamboChat isCampaignMode={isCampaignMode} />;
  }
  return <FallbackChat isCampaignMode={isCampaignMode} />;
}
