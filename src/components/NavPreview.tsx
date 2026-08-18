import { useEffect, useRef, useState } from "react";
import { Check, MessageSquare, Mic, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

/** Frame-driven mini "videos" for the products nav panel. */
function useLoop(steps: number, ms: number, key: string) {
  const [frame, setFrame] = useState(0);
  const ref = useRef(0);
  useEffect(() => {
    ref.current = 0;
    setFrame(0);
    const id = setInterval(() => {
      ref.current = (ref.current + 1) % steps;
      setFrame(ref.current);
    }, ms);
    return () => clearInterval(id);
  }, [steps, ms, key]);
  return frame;
}

const chatScript = [
  { from: "bot", text: "Hey — how can I help today?" },
  { from: "user", text: "I need a quote for a full rewire." },
  { from: "bot", text: "I can sort that. What postcode is the property?" },
  { from: "user", text: "SW9 8LN." },
] as const;

type ChatState = { index: number; typing: boolean; fading: boolean };

export function ChatPreview({ playKey }: { playKey: string }) {
  const [state, setState] = useState<ChatState>({
    index: 0,
    typing: true,
    fading: false,
  });

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    let cancelled = false;

    const run = (index: number) => {
      if (cancelled) return;

      if (index >= chatScript.length) {
        setState({ index, typing: false, fading: false });
        timer = setTimeout(() => {
          if (cancelled) return;
          setState({ index, typing: false, fading: true });
          timer = setTimeout(() => {
            if (cancelled) return;
            setState({ index: 0, typing: true, fading: false });
            run(0);
          }, 520);
        }, 1800);
        return;
      }

      const msg = chatScript[index]!;
      // typing indicator, then the message lands
      setState({ index, typing: true, fading: false });
      timer = setTimeout(
        () => {
          if (cancelled) return;
          setState({ index, typing: false, fading: false });
          timer = setTimeout(
            () => run(index + 1),
            600 + Math.min(msg.text.length * 22, 900),
          );
        },
        msg.from === "user" ? 520 : 760,
      );
    };

    setState({ index: 0, typing: true, fading: false });
    run(0);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [playKey]);

  const settled = chatScript.slice(0, state.index);
  const current = chatScript[state.index];

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-foreground p-4 text-background">
      <div className="flex items-center gap-2 border-b border-background/15 pb-3 text-xs text-background/65">
        <span className="flex size-7 items-center justify-center rounded-full bg-background text-foreground">
          <MessageSquare className="size-3.5" />
        </span>
        <span className="font-medium text-background">Chat employee</span>
        <span className="ml-auto inline-flex items-center gap-1.5">
          <span className="live-dot" /> live
        </span>
      </div>

      <div
        className="mt-3 flex flex-1 flex-col justify-end gap-2 transition-opacity duration-500 ease-out"
        style={{ opacity: state.fading ? 0 : 1 }}
      >
        {settled.map((m) => (
          <div
            key={m.text}
            className={cn(
              "max-w-[88%] rounded-xl px-3.5 py-2 text-[12px] leading-snug",
              m.from === "user"
                ? "ml-auto bg-background text-foreground"
                : "bg-background/10 text-background/80",
            )}
          >
            {m.text}
          </div>
        ))}

        {current && (
          <div
            key={`live-${state.index}`}
            className={cn(
              "chat-bubble-in max-w-[88%] rounded-xl px-3.5 py-2 text-[12px] leading-snug",
              current.from === "user"
                ? "ml-auto bg-background text-foreground"
                : "bg-background/10 text-background/80",
              state.typing && "w-fit max-w-none py-2.5",
            )}
          >
            {state.typing ? (
              <span className="flex items-center gap-1">
                {[0, 1, 2].map((d) => (
                  <span
                    key={d}
                    className="size-1.5 rounded-full bg-background/55"
                    style={{
                      animation: "bounce-dot 1000ms ease-in-out infinite",
                      animationDelay: `${d * 150}ms`,
                    }}
                  />
                ))}
              </span>
            ) : (
              <span className="chat-text-in block">{current.text}</span>
            )}
          </div>
        )}
      </div>
      <div className="mt-3 flex items-center gap-2 border-t border-background/15 pt-3 text-[11px] text-background/55">
        <Check className="size-3" /> Qualifying lead automatically
      </div>
    </div>
  );
}


const voiceLines = [
  "Caller: Do you handle emergency leaks tonight?",
  "KaliGan: Yes — a crew is on call until 11pm.",
  "Caller: Great, can you come out now?",
  "KaliGan: Dispatching to SW9 in 40 minutes.",
] as const;

export function VoicePreview({ playKey }: { playKey: string }) {
  const frame = useLoop(voiceLines.length + 2, 900, playKey);
  const shown = Math.min(frame, voiceLines.length);
  const bars = 34;

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-foreground p-4 text-background">
      <div className="flex items-center gap-2 border-b border-background/15 pb-3 text-xs text-background/65">
        <span className="flex size-7 items-center justify-center rounded-full bg-background text-foreground">
          <Mic className="size-3.5" />
        </span>
        <span className="font-medium text-background">Voice employee</span>
        <span className="ml-auto inline-flex items-center gap-1.5">
          <span className="live-dot" /> 00:0{Math.min(frame, 9)}
        </span>
      </div>

      <div className="mt-3 flex items-center gap-2.5 rounded-xl bg-background/10 px-3.5 py-2.5">
        <Phone className="size-3.5 text-background/60" />
        <span className="text-[12.5px]">+1 415 555 0134</span>
        <span className="ml-auto text-[11px] text-background/55">
          answered 0.4s
        </span>
      </div>

      <div className="mt-3 flex h-10 items-end gap-[3px]">
        {Array.from({ length: bars }).map((_, i) => (
          <span
            key={i}
            className="wave-bar flex-1"
            style={{ animationDelay: `${i * 55}ms` }}
          />
        ))}
      </div>

      <div className="mt-3 flex flex-1 flex-col justify-end gap-1.5">
        {voiceLines.slice(0, shown).map((l, i) => (
          <p
            key={l}
            className={cn(
              "fade-up text-[12.5px] leading-snug",
              l.startsWith("Caller") ? "text-background/55" : "text-background",
            )}
            style={{ animationDelay: `${i * 20}ms` }}
          >
            {l}
          </p>
        ))}
      </div>

      {shown >= voiceLines.length && (
        <div className="fade-up mt-3 flex flex-wrap gap-1.5">
          {["Intent: emergency", "Score 96", "Routed"].map((t) => (
            <span
              key={t}
              className="rounded-full border border-background/20 px-2.5 py-1 text-[11px] text-background/65"
            >
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
