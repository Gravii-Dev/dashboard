"use client";

import { useTambo, useTamboThreadInput } from "@tambo-ai/react";
import { cx } from "@/lib/utils";
import s from "./BotWidget.module.css";

export default function TamboChat({ isCampaignMode }: { isCampaignMode?: boolean }) {
  const { messages, isStreaming } = useTambo();
  const { value, setValue, submit, isPending } = useTamboThreadInput();

  const mode = isCampaignMode
    ? { name: "Launch Assistant", label: "Campaign Builder", modeCls: s.modeCampaign, placeholder: "Describe your campaign in plain English" }
    : { name: "Gravii Insights", label: "Data Insights", modeCls: s.modeInsights, placeholder: "Ask about your users' data" };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim() || isPending) return;
    await submit();
  };

  return (
    <div className={s.wrapper}>
      <div className={s.header}>
        <div className={s.label}>{mode.name}</div>
        <span className={cx(s.mode, mode.modeCls)}>{mode.label}</span>
      </div>
      <div className={cx(s.box, isCampaignMode && s.boxCampaign)}>
        <div className={s.messages}>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {(messages as any[]).map((msg: any) => (
            <div key={msg.id} className={cx(s.message, msg.role === "user" ? s.userMsg : s.assistantMsg)}>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {(msg.content as any[]).map((c: any, i: number) => {
                if (c.type === "text" && c.text) {
                  return <p key={i} className={s.msgText}>{c.text}</p>;
                }
                if (c.type === "component" && c.component) {
                  const Component = c.component;
                  return <div key={c.id ?? i} className={s.msgComponent}><Component {...(c.props ?? {})} /></div>;
                }
                return null;
              })}
            </div>
          ))}
          {isStreaming && <div className={s.streaming}>Thinking...</div>}
        </div>
        <form onSubmit={handleSubmit} className={s.inputWrap}>
          <input
            className={s.chatInput}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={mode.placeholder}
            disabled={isPending}
          />
          <button type="submit" className={s.send} disabled={isPending}>
            {"->"}
          </button>
        </form>
      </div>
    </div>
  );
}
