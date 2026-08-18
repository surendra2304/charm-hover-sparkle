import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronDown, Menu, MessageSquare, Mic, X } from "lucide-react";
import { BotOrb } from "./BotOrb";
import { ChatPreview, VoicePreview } from "./NavPreview";
import { cn } from "@/lib/utils";


const products = [
  {
    to: "/products/chat-agent",
    label: "Chat Employees",
    icon: MessageSquare,
    body: "An employee that answers every visitor and qualifies them live.",
    preview: [
      "Hi! Are you looking for a quote today?",
      "Yes — for a 3-bed rewire.",
      "Got it. What postcode are you in?",
    ],
  },
  {
    to: "/products/voice-agent",
    label: "Voice Employees",
    icon: Mic,
    body: "Picks up your phone number on the first ring, day or night.",
    preview: [
      "Thanks for calling — how can I help?",
      "Do you handle emergency leaks tonight?",
      "Yes, a crew is on call until 11pm.",
    ],
  },
] as const;



const links = [
  { to: "/product", label: "Platform" },
  { to: "/pricing", label: "Pricing" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [hover, setHover] = useState(-1);
  

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 24);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-[padding] duration-500 ease-out",
        scrolled ? "pt-3 pb-1" : "pt-0",
      )}
    >
      <nav
        className={cn(
          "mx-auto flex items-center justify-between border backdrop-blur-xl",
          "transition-all duration-500 ease-out will-change-transform",
          scrolled
            ? "h-14 max-w-5xl rounded-full border-border/70 bg-background/90 px-4 shadow-[0_18px_40px_-24px_oklch(0_0_0/0.45)]"
            : "h-16 max-w-6xl rounded-none border-x-transparent border-t-transparent border-b-border/60 bg-background/80 px-5",
        )}
      >

        <Link to="/" className="flex items-center gap-2.5">
          <BotOrb size={26} reach={5} />
          <span className="font-display text-[17px] font-semibold tracking-tight">
            KaliGan AI
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <div
            className="relative"
            onMouseEnter={() => setMenu(true)}
            onMouseLeave={() => {
              setMenu(false);
              setHover(-1);
            }}
          >
            <button
              type="button"
              aria-expanded={menu}
              onClick={(e) => {
                const touch = (e.nativeEvent as PointerEvent).pointerType !== "mouse";
                setMenu(touch ? !menu : true);
              }}
              className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Products
              <ChevronDown
                className={`size-3.5 transition-transform ${menu ? "rotate-180" : ""}`}
              />
            </button>


            <div
              className={cn(
                "absolute top-full left-1/2 w-[42rem] -translate-x-1/2 pt-4",
                "origin-top transition-all duration-300 ease-[cubic-bezier(.22,1,.36,1)]",
                menu
                  ? "pointer-events-auto translate-y-0 scale-100 opacity-100 blur-0"
                  : "pointer-events-none -translate-y-1.5 scale-[0.98] opacity-0 blur-[2px]",
              )}
              aria-hidden={!menu}
            >
              <div className="nav-panel grid grid-cols-[0.85fr_1.15fr] gap-6 p-3">
                <div
                  className="relative flex flex-col"
                  onMouseLeave={() => setHover(-1)}
                >
                  {/* sliding hover highlight */}
                  <span
                    className={cn(
                      "pointer-events-none absolute inset-x-0 h-[calc(50%-0.25rem)] rounded-xl bg-muted/70",
                      "transition-all duration-300 ease-[cubic-bezier(.22,1,.36,1)]",
                      hover < 0 ? "opacity-0" : "opacity-100",
                    )}
                    style={{
                      transform: `translateY(calc(${Math.max(hover, 0)} * (100% + 0.5rem)))`,
                    }}
                  />
                  {products.map((p, i) => (
                    <Link
                      key={p.to}
                      to={p.to}
                      onClick={() => setMenu(false)}
                      onMouseEnter={() => setHover(i)}
                      className="group relative block flex-1 rounded-xl px-4 py-3.5"
                    >
                      <span
                        className={cn(
                          "font-display block text-[17px] font-medium tracking-tight transition-all duration-300",
                          i === hover
                            ? "translate-x-0.5 text-foreground"
                            : "text-foreground/70",
                        )}
                      >
                        {p.label}
                      </span>
                      <span
                        className={cn(
                          "mt-1 block text-[13px] leading-snug transition-all duration-300",
                          i === hover
                            ? "translate-x-0.5 text-muted-foreground"
                            : "text-muted-foreground/70",
                        )}
                      >
                        {p.body}
                      </span>
                    </Link>
                  ))}
                </div>

                <div className="relative h-[17rem]">
                  {[0, 1].map((i) => (
                    <div
                      key={i}
                      className={cn(
                        "absolute inset-0 transition-all duration-350 ease-[cubic-bezier(.22,1,.36,1)]",
                        (hover === 1 ? 1 : 0) === i
                          ? "translate-y-0 scale-100 opacity-100"
                          : "pointer-events-none translate-y-1.5 scale-[0.985] opacity-0",
                      )}
                    >
                      {i === 1 ? (
                        <VoicePreview playKey={`v-${menu}`} />
                      ) : (
                        <ChatPreview playKey={`c-${menu}`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>


          </div>

          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Link to="/contact" className="pill-ghost">
            Talk to sales
          </Link>
          <Link to="/pricing" className="pill-solid">
            Start free
          </Link>
        </div>

        <button
          className="pill-ghost px-3 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </nav>

      {open && (
        <div className="fade-up mx-auto mt-2 max-w-6xl rounded-2xl border border-border/60 bg-background/95 px-5 py-4 backdrop-blur-xl md:hidden">

          <div className="flex flex-col gap-3">
            <span className="text-xs tracking-[0.16em] text-muted-foreground">
              PRODUCTS
            </span>
            {products.map((p) => (
              <Link
                key={p.to}
                to={p.to}
                onClick={() => setOpen(false)}
                className="text-sm"
              >
                {p.label}
              </Link>
            ))}
            <span className="mt-2 text-xs tracking-[0.16em] text-muted-foreground">
              COMPANY
            </span>
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="text-sm text-muted-foreground"
              >
                {l.label}
              </Link>
            ))}
            <Link to="/pricing" className="pill-solid mt-2 justify-center">
              Start free
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
