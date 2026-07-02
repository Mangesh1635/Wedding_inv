import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

import coupleHero from "@/assets/couple_hero.png";
import bridePortrait from "@/assets/bride.png";
import groomPortrait from "@/assets/groom.png";
import g1 from "@/assets/g1.jpg";
import g2 from "@/assets/g2.jpg";
import g3 from "@/assets/g3.jpg";
import g4 from "@/assets/g4.jpg";

export const Route = createFileRoute("/")({
  component: WeddingPage,
});

// Wedding date — 15 फेब्रुवारी २०२६
const WEDDING_DATE = new Date("2026-07-04T12:35:00+05:30");

/* ---------- Decorative SVGs ---------- */

const Mandala = ({ className = "", size = 240 }: { className?: string; size?: number }) => (
  <svg
    viewBox="0 0 200 200"
    width={size}
    height={size}
    className={className}
    aria-hidden="true"
  >
    <g fill="none" stroke="currentColor" strokeWidth="0.6">
      <circle cx="100" cy="100" r="96" />
      <circle cx="100" cy="100" r="80" />
      <circle cx="100" cy="100" r="64" strokeDasharray="1 2" />
      <circle cx="100" cy="100" r="48" />
      <circle cx="100" cy="100" r="28" />
      {Array.from({ length: 24 }).map((_, i) => (
        <line
          key={i}
          x1="100"
          y1="4"
          x2="100"
          y2="28"
          transform={`rotate(${i * 15} 100 100)`}
        />
      ))}
      {Array.from({ length: 12 }).map((_, i) => (
        <path
          key={i}
          d="M100 40 C112 60 112 80 100 100 C88 80 88 60 100 40 Z"
          transform={`rotate(${i * 30} 100 100)`}
        />
      ))}
      {Array.from({ length: 8 }).map((_, i) => (
        <circle
          key={i}
          cx="100"
          cy="16"
          r="1.6"
          fill="currentColor"
          transform={`rotate(${i * 45} 100 100)`}
        />
      ))}
    </g>
  </svg>
);

const OrnamentDivider = ({ tone = "gold" }: { tone?: "gold" | "burgundy" }) => (
  <div className="flex items-center justify-center gap-4 my-8">
    <span className={`h-px w-16 sm:w-32 bg-gradient-to-r from-transparent ${tone === "gold" ? "via-gold" : "via-burgundy"} to-transparent`} />
    <svg width="60" height="20" viewBox="0 0 60 20" className={tone === "gold" ? "text-gold" : "text-burgundy"} aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M0 10 L20 10" />
        <path d="M40 10 L60 10" />
        <path d="M30 2 C25 6 25 14 30 18 C35 14 35 6 30 2 Z" fill="currentColor" fillOpacity="0.3" />
        <circle cx="30" cy="10" r="2" fill="currentColor" />
      </g>
    </svg>
    <span className={`h-px w-16 sm:w-32 bg-gradient-to-l from-transparent ${tone === "gold" ? "via-gold" : "via-burgundy"} to-transparent`} />
  </div>
);

const Ganesha = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
    <g fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
      <circle cx="60" cy="60" r="58" strokeDasharray="2 3" />
      <circle cx="60" cy="60" r="46" />
      {/* stylized Om */}
      <path d="M40 70 c0 -12 10 -20 20 -20 c10 0 18 6 18 16 c0 8 -6 14 -14 14 c-6 0 -10 -4 -10 -8" />
      <path d="M52 82 c-4 4 -12 4 -12 -2 c0 -4 4 -6 8 -6" />
      <circle cx="80" cy="34" r="3" />
      <path d="M74 42 c4 -4 10 -4 12 0" />
    </g>
  </svg>
);

const Lotus = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 80 60" className={className} aria-hidden="true">
    <g fill="currentColor" fillOpacity="0.9">
      <path d="M40 55 C20 45 12 30 18 20 C24 30 32 38 40 45 Z" />
      <path d="M40 55 C60 45 68 30 62 20 C56 30 48 38 40 45 Z" />
      <path d="M40 55 C30 40 30 22 40 8 C50 22 50 40 40 55 Z" fillOpacity="0.7" />
    </g>
  </svg>
);

const Kalash = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 60 90" className={className} aria-hidden="true">
    <g fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M30 8 C24 14 24 22 30 26 C36 22 36 14 30 8 Z" fill="currentColor" fillOpacity="0.7"/>
      <path d="M30 26 L30 32" />
      <path d="M18 34 L42 34" />
      <path d="M14 40 C14 60 20 78 30 84 C40 78 46 60 46 40 C40 36 20 36 14 40 Z" />
      <path d="M20 46 C25 50 35 50 40 46" />
    </g>
  </svg>
);

/* ---------- Petal Rain ---------- */
const Petals = ({ count = 22 }: { count?: number }) => {
  const petals = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 12,
        duration: 12 + Math.random() * 14,
        size: 8 + Math.random() * 10,
        rotate: Math.random() * 360,
        opacity: 0.4 + Math.random() * 0.5,
        hue: i % 3,
      })),
    [count],
  );
  const colors = ["#d4586a", "#e7cf7a", "#c46a2a"];
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {petals.map((p, i) => (
        <span
          key={i}
          className="petal absolute -top-10 block"
          style={{
            left: `${p.left}%`,
            animationDelay: `-${p.delay}s`,
            animationDuration: `${p.duration}s`,
            opacity: p.opacity,
            transform: `rotate(${p.rotate}deg)`,
          }}
        >
          <svg width={p.size} height={p.size * 1.4} viewBox="0 0 10 14">
            <path
              d="M5 0 C8 4 8 10 5 14 C2 10 2 4 5 0 Z"
              fill={colors[p.hue]}
              opacity="0.85"
            />
          </svg>
        </span>
      ))}
    </div>
  );
};

/* ---------- Countdown ---------- */
function useCountdown(target: Date) {
  const [now, setNow] = useState<number>(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target.getTime() - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff / 3600000) % 24);
  const minutes = Math.floor((diff / 60000) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

const toMr = (n: number) => n.toLocaleString("mr-IN");

const CountdownUnit = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center">
    <div className="relative">
      <div className="absolute inset-0 rounded-full shimmer opacity-40" />
      <div className="relative flex h-20 w-20 sm:h-28 sm:w-28 items-center justify-center rounded-full border-gold glass-dark">
        <span className="text-3xl sm:text-4xl font-display text-gold-gradient">
          {toMr(value).padStart(2, "०")}
        </span>
      </div>
    </div>
    <span className="mt-3 text-xs sm:text-sm tracking-widest text-cream/80">{label}</span>
  </div>
);

const Countdown = () => {
  const t = useCountdown(WEDDING_DATE);
  return (
    <div className="grid grid-cols-4 gap-3 sm:gap-8 justify-items-center">
      <CountdownUnit value={t.days} label="दिवस" />
      <CountdownUnit value={t.hours} label="तास" />
      <CountdownUnit value={t.minutes} label="मिनिटे" />
      <CountdownUnit value={t.seconds} label="सेकंद" />
    </div>
  );
};

/* ---------- Opening Invitation ---------- */
const Opening = ({ onEnter }: { onEnter: () => void }) => {
  const [opened, setOpened] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2 }}
      className="fixed inset-0 z-[100] bg-royal flex items-center justify-center overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 opacity-30 text-gold">
        <Mandala className="absolute -top-40 -left-40 slow-spin" size={520} />
        <Mandala className="absolute -bottom-40 -right-40 slow-spin-reverse" size={520} />
      </div>

      <div className="relative w-[92%] max-w-xl">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative rounded-2xl border-gold glass-dark shadow-royal p-8 sm:p-12 text-center"
        >
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-gold">
            <Ganesha className="w-20 h-20 float-y" />
          </div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="mt-6 font-display text-2xl sm:text-3xl text-gold-gradient"
          >
            ॥ श्री गणेशाय नमः ॥
          </motion.p>

          <OrnamentDivider />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: opened ? 1 : 0.9 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="font-display text-cream/90 text-base sm:text-lg leading-relaxed"
          >
            आपणांस आमच्या विवाह सोहळ्यास <br />
            सहकुटुंब सहपरिवार उपस्थित <br /> राहण्याचे सस्नेह निमंत्रण
          </motion.p>

          <AnimatePresence>
            {opened && (
              <motion.div
                initial={{ opacity: 0, y: 20, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                transition={{ duration: 0.9 }}
                className="overflow-hidden"
              >
                <OrnamentDivider />
                <p className="font-display text-3xl sm:text-4xl text-gold-gradient py-3">
                  कीर्ती <span className="text-cream/70 text-2xl">❁</span> विशाल
                </p>
                <p className="mt-3 text-cream/70 text-sm tracking-widest">
                  4 जुलै २०२६ • परभणी
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8">
            {!opened ? (
              <button
                onClick={() => setOpened(true)}
                className="group relative inline-flex items-center gap-2 rounded-full border-gold px-6 py-3 text-cream/90 hover:text-gold transition"
              >
                <span className="absolute inset-0 rounded-full shimmer opacity-30" />
                <span className="relative">निमंत्रण उघडा</span>
              </button>
            ) : (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                onClick={onEnter}
                className="group relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#b8892b] via-[#e7cf7a] to-[#b8892b] px-8 py-3 text-midnight font-medium shadow-royal hover:brightness-110 transition"
              >
                सोहळ्यात प्रवेश करा →
              </motion.button>
            )}
          </div>

          <div className="pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 text-gold/70">
            <Lotus className="w-16 h-12" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

/* ---------- Navigation ---------- */
const NAV = [
  { id: "hero", label: "मुख्यपृष्ठ" },
  { id: "couple", label: "वधू-वर" },
  { id: "family", label: "कुटुंब" },
  { id: "events", label: "कार्यक्रम" },
//   { id: "gallery", label: "गॅलरी" },
  { id: "venue", label: "स्थळ" },
//   { id: "wishes", label: "शुभेच्छा" },
  { id: "contact", label: "संपर्क" },
];

const Nav = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "backdrop-blur-md bg-midnight/70 border-b border-gold/20" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-5 py-4 flex items-center justify-between">
        <a href="#hero" className="flex items-center gap-2 text-cream">
          <span className="text-gold"><Lotus className="w-6 h-5" /></span>
          <span className="font-display text-lg text-gold-gradient">कीर्ती ❁ विशाल</span>
        </a>
        <nav className="hidden lg:flex items-center gap-8 text-sm text-cream/80">
          {NAV.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              className="relative hover:text-gold transition after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-gold after:transition-all hover:after:w-full"
            >
              {n.label}
            </a>
          ))}
        </nav>
        <button
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden rounded-md border border-gold/40 p-2 text-cream"
          aria-label="मेनू"
        >
          <div className="w-5 space-y-1">
            <span className="block h-px bg-current" />
            <span className="block h-px bg-current" />
            <span className="block h-px bg-current" />
          </div>
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-midnight/95 border-t border-gold/20 overflow-hidden"
          >
            <div className="px-6 py-4 grid gap-3 text-cream/90">
              {NAV.map((n) => (
                <a
                  key={n.id}
                  href={`#${n.id}`}
                  onClick={() => setOpen(false)}
                  className="py-1"
                >
                  {n.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

/* ---------- Section header ---------- */
const SectionHeader = ({
  eyebrow,
  title,
  subtitle,
  dark = false,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  dark?: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.8 }}
    className="text-center max-w-2xl mx-auto"
  >
    <p className={`text-xs tracking-[0.35em] ${dark ? "text-gold" : "text-burgundy"}`}>
      {eyebrow}
    </p>
    <h2
      className={`mt-3 font-display text-4xl sm:text-5xl leading-tight ${
        dark ? "text-gold-gradient" : "text-burgundy"
      }`}
    >
      {title}
    </h2>
    <OrnamentDivider tone={dark ? "gold" : "burgundy"} />
    {subtitle && (
      <p className={`text-base sm:text-lg ${dark ? "text-cream/80" : "text-midnight/70"}`}>
        {subtitle}
      </p>
    )}
  </motion.div>
);

/* ---------- Hero ---------- */
const Hero = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const yFg = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section id="hero" ref={ref} className="relative min-h-screen bg-royal overflow-hidden">
      <motion.div style={{ y: yBg }} className="pointer-events-none absolute inset-0 opacity-25 text-gold">
        <Mandala className="absolute -top-40 -left-40 slow-spin" size={600} />
        <Mandala className="absolute -bottom-56 -right-56 slow-spin-reverse" size={700} />
      </motion.div>

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#0e0d15_85%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-5 pt-28 pb-16 grid lg:grid-cols-2 gap-10 items-center min-h-screen">
        <motion.div style={{ y: yFg, opacity }} className="text-center lg:text-left">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gold tracking-[0.4em] text-xs sm:text-sm"
          >
            ॥ शुभ विवाह ॥
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="mt-4 font-display text-6xl sm:text-7xl lg:text-8xl leading-[0.95] text-gold-gradient py-5"
          >
            कीर्ती
            <span className="block text-cream/80 text-3xl sm:text-4xl my-2 font-body italic">
              आणि

            </span>
            विशाल
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="mt-6 max-w-lg mx-auto lg:mx-0 text-cream/70 text-base sm:text-lg leading-relaxed"
          >
            दोन कुळांचा संगम, दोन हृदयांचा शुभारंभ — आपल्या स्नेहमय
            उपस्थितीने आमचा विवाहसोहळा अधिक अविस्मरणीय होईल.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-3"
          >
            <div className="glass-dark border-gold rounded-full px-5 py-2 text-cream/90">
              <span className="text-gold">📅</span>&nbsp; 
शनिवार, 4 जुलै २०२६ 
            </div>
            <div className="glass-dark border-gold rounded-full px-5 py-2 text-cream/90">
              <span className="text-gold">📍</span>&nbsp; परभणी 
            </div>
          </motion.div>

          <motion.a
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            href="#events"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#b8892b] via-[#e7cf7a] to-[#b8892b] px-7 py-3 text-midnight font-medium shadow-royal hover:brightness-110 transition"
          >
            कार्यक्रम पहा <span>→</span>
          </motion.a>
        </motion.div>

        {/* Couple sticker */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 1.2 }}
          className="relative flex items-end justify-center"
        >
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-gold/25">
            <Mandala size={520} className="slow-spin" />
          </div>
          <div className="pointer-events-none absolute -inset-6 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.25),transparent_60%)]" />
          <motion.img
            src={coupleHero}
            alt="वधू आणि वर"
            width={896}
            height={1280}
            className="relative z-10 w-[78%] sm:w-[62%] lg:w-[85%] max-w-md object-contain drop-shadow-[0_25px_40px_rgba(0,0,0,0.6)] float-y"
          />
          <div className="absolute top-8 left-4 text-gold/70 hidden sm:block">
            <Lotus className="w-12 h-10 float-y" />
          </div>
          <div className="absolute bottom-16 right-2 text-gold/70 hidden sm:block">
            <Kalash className="w-10 h-14 float-y" />
          </div>
        </motion.div>
      </div>

      {/* countdown strip */}
      <div className="relative z-10 pb-12">
        <div className="mx-auto max-w-4xl px-5">
          <Countdown />
        </div>
      </div>
    </section>
  );
};

/* ---------- Couple Section ---------- */
const Couple = () => (
  <section id="couple" className="relative bg-parchment py-24 overflow-hidden">
    <div className="pointer-events-none absolute -top-20 -left-20 text-burgundy/10">
      <Mandala size={340} className="slow-spin-reverse" />
    </div>
    <div className="pointer-events-none absolute -bottom-20 -right-20 text-sage/20">
      <Mandala size={340} className="slow-spin" />
    </div>

    <div className="relative mx-auto max-w-6xl px-5">
      <SectionHeader
        eyebrow="वधू आणि वर"
        title="दोन हृदयांची कहाणी"
        subtitle="एक भेट, एक हास्य, आणि आयुष्यभरासाठी एक वचन — त्यांच्या प्रवासाची सुरुवात."
      />

      <div className="mt-16 grid md:grid-cols-2 gap-10">
        {[
            {
            img: groomPortrait,
            side: "वर",
            name: "चि. विशाल",
            family: "गरुड कुटुंबीय",
            note: "B.Tech(Ele)",
          },
          {
            img: bridePortrait,
            side: "वधू",
            name: "चि.सौ.कां. कीर्ती",
            family: "यादव कुटुंबीय",
            note: "B.Tech(Mech)",
          }
        ].map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: i * 0.15 }}
            className="relative"
          >
            <div className="relative rounded-3xl bg-white/60 backdrop-blur-md border-gold p-8 shadow-royal">
              <div className="pointer-events-none absolute inset-4 rounded-2xl border border-gold/30" />
              
              <div className="pointer-events-none absolute top-2 left-1/2 -translate-x-1/2 text-gold/60">
                <Lotus className="w-10 h-8" />
              </div>
              <p className="mt-6 text-center text-xs tracking-[0.35em] text-burgundy">
                {p.side}
              </p>
              <h3 className="mt-2 text-center font-display text-3xl text-burgundy">
                {p.name}
              </h3>
              <p className="mt-1 text-center text-sm text-sage">{p.family}</p>
              <OrnamentDivider tone="burgundy" />
              <p className="text-center text-midnight/70 leading-relaxed">{p.note}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* ---------- Family ---------- */
const Family = () => (
  <section id="family" className="relative bg-[#efece0] py-24 overflow-hidden">
    <div className="mx-auto max-w-6xl px-5">
      <SectionHeader
        eyebrow="कुटुंबीय"
        title="आमचे आशीर्वादी"
        subtitle="ज्यांच्या स्नेहाने आणि आशीर्वादाने हा शुभ प्रसंग सजला आहे."
      />

      <div className="mt-16 grid md:grid-cols-2 gap-8">
  {[
    {
      side: "वर पक्ष",
      house: "गरुड परिवार",
      parents: "श्री विठ्ठलराव सीतारामजी गरुड",
      note: "मूळ गाव — पिंगळी, सद्य वास्तव्य परभणी",
      members: [
        "आजोबा — श्री. सीतारामजी विठ्ठलराव गरुड",
        "काका-काकू, आत्या-मामा व सर्व आप्तेष्ट",
      ],
    },
    {
      side: "वधू पक्ष",
      house: "यादव परिवार",
      parents: "कै. केशवराव माणिकराव यादव",
      note: "मूळ गाव — रामपुरी",
      members: [
        "आजोबा — श्री. माणिकराव विठ्ठलराव यादव",
        "काका-काकू, मामा-मामी व सर्व आप्तेष्ट",
      ],
    },
  ].map((f, i) => (
    <motion.div
      key={f.side}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: i * 0.1 }}
      className="group relative rounded-3xl bg-cream border-gold shadow-royal p-8 text-center flex flex-col items-center"
    >
      {/* Kalash Icon */}
      <div className="mb-4 text-burgundy/30">
        <Kalash className="w-10 h-14" />
      </div>

      {/* Side */}
      <p className="text-xs tracking-[0.35em] text-sage uppercase">
        {f.side}
      </p>

      {/* Family Name */}
      <h3 className="mt-2 font-display text-3xl text-burgundy">
        {f.house}
      </h3>

      {/* Divider */}
      <div className="w-full flex justify-center">
        <OrnamentDivider tone="burgundy" />
      </div>

      {/* Parents */}
      <p className="font-display text-lg text-midnight mt-2">
        {f.parents}
      </p>

      {/* Note */}
      <p className="text-sm text-midnight/60 mt-2">
        {f.note}
      </p>

      {/* Members */}
      <ul className="mt-6 space-y-3 text-midnight/80 flex flex-col items-center">
        {f.members.map((m) => (
          <li
            key={m}
            className="flex items-center justify-center gap-2 text-center"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
            <span>{m}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  ))}
</div>
    </div>
  </section>
);

/* ---------- Events ---------- */
const EVENTS = [
  {
    name: "हळद समारंभ",
    date: "३ जुलै २०२६",
    time: "संध्याकाळी ६:०० वा.",
    venue: "राहते घर",
    dress: "पिवळा",
    desc: "हळदीच्या सुगंधात नववधू व वराचे शुद्धीकरण, कुटुंबाच्या शुभेच्छांचे मुद्रांकन.",
    icon: <Kalash className="w-8 h-10" />,
  },
  {
    name: "देवकार्य",
    date: "३ जुलै २०२६",
    time: "संध्याकाळी ६:०० वा.",
    venue: "राहते घर",
    dress: "सोयीनुसार",
    desc: "श्री गणेशाची पूजा, कुलदेवतेला वंदन आणि विवाहाच्या शुभारंभाची प्रार्थना.",
    icon: <Ganesha className="w-10 h-10" />,
  },
  {
    name: "विवाह सोहळा",
    date: "४ जुलै २०२६",
    time: "दुपारी १२:३५ वा. (मुहूर्त)",
    venue: "वरद मंगल कार्यालय, वसमत रोड, परभणी",
    dress: "पारंपरिक महाराष्ट्रीय",
    desc: "अंतरपाट, मंगलाष्टके आणि सप्तपदी — दोन आत्म्यांचा शुभ संगम.",
    icon: <Kalash className="w-8 h-10" />,
  },
];

const Events = () => (
  <section id="events" className="relative bg-royal py-24 overflow-hidden">
    <div className="pointer-events-none absolute inset-0 opacity-20 text-gold">
      <Mandala className="absolute -top-40 right-1/4 slow-spin" size={500} />
    </div>
    <div className="relative mx-auto max-w-6xl px-5">
      <SectionHeader
        dark
        eyebrow="विवाह मंगलमय"
        title="कार्यक्रम पत्रिका"
        subtitle="प्रत्येक विधी, प्रत्येक क्षण — तुमच्या स्नेहमय उपस्थितीची प्रतीक्षा."
      />

      <div className="mt-16 relative">
        <div className="pointer-events-none absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold/60 to-transparent" />

        <div className="space-y-12">
          {EVENTS.map((e, i) => {
            const left = i % 2 === 0;
            return (
              <motion.div
                key={e.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7 }}
                className={`relative md:grid md:grid-cols-2 md:gap-10 items-center ${
                  left ? "" : "md:[&>*:first-child]:order-2"
                }`}
              >
                <div className={`hidden md:block ${left ? "text-right pr-10" : "text-left pl-10"}`}>
                  <p className="text-gold text-sm tracking-[0.3em]">क्रमांक {toMr(i + 1)}</p>
                  <h3 className="mt-1 font-display text-3xl text-gold-gradient">{e.name}</h3>
                </div>

                <div className="relative pl-14 md:pl-10">
                  {/* timeline dot */}
                  <div className="absolute left-2 md:left-auto md:-translate-x-1/2 md:left-0 top-4 z-10">
                    <div className="relative flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-[#e7cf7a] to-[#b8892b] shadow-royal">
                      <div className="absolute inset-0 rounded-full animate-ping bg-gold/30" />
                      <div className="h-2 w-2 rounded-full bg-midnight" />
                    </div>
                  </div>

                  <div className="glass-dark border-gold rounded-2xl p-6 shadow-royal">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="md:hidden text-gold text-xs tracking-[0.3em]">
                          क्रमांक {toMr(i + 1)}
                        </p>
                        <h4 className="md:hidden mt-1 font-display text-2xl text-gold-gradient">
                          {e.name}
                        </h4>
                      </div>
                      <div className="text-gold shrink-0">{e.icon}</div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-cream/85">
                      <div>
                        <p className="text-gold/70 text-xs">दिनांक</p>
                        <p>{e.date}</p>
                      </div>
                      <div>
                        <p className="text-gold/70 text-xs">वेळ</p>
                        <p>{e.time}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-gold/70 text-xs">स्थळ</p>
                        <p>{e.venue}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-gold/70 text-xs">पेहराव</p>
                        <p>{e.dress}</p>
                      </div>
                    </div>

                    <p className="mt-4 text-cream/70 leading-relaxed border-t border-gold/20 pt-4">
                      {e.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  </section>
);

/* ---------- Gallery ---------- */
// const GALLERY = [
//   { src: g1, span: "row-span-2", alt: "विवाहसोहळा" },
//   { src: g2, span: "", alt: "हळद समारंभ" },
//   { src: g4, span: "", alt: "मंडप" },
//   { src: g3, span: "row-span-2", alt: "मेहेंदी" },
//   { src: g2, span: "", alt: "हळद" },
//   { src: g4, span: "", alt: "मंडप विधी" },
// ];

// const Gallery = () => {
//   const [lightbox, setLightbox] = useState<string | null>(null);
//   return (
//     <section id="gallery" className="relative bg-parchment py-24 overflow-hidden">
//       <div className="mx-auto max-w-7xl px-5">
//         <SectionHeader
//           eyebrow="स्मरणपटल"
//           title="आठवणींचा अल्बम"
//           subtitle="प्रत्येक चित्रात दडलेला एक कोमल क्षण, एक हास्य, एक आठवण."
//         />

//         <div className="mt-16 grid grid-cols-2 md:grid-cols-3 auto-rows-[180px] sm:auto-rows-[220px] gap-4">
//           {GALLERY.map((g, i) => (
//             <motion.button
//               key={i}
//               initial={{ opacity: 0, scale: 0.95 }}
//               whileInView={{ opacity: 1, scale: 1 }}
//               viewport={{ once: true, margin: "-40px" }}
//               transition={{ duration: 0.6, delay: (i % 3) * 0.1 }}
//               onClick={() => setLightbox(g.src)}
//               className={`group relative overflow-hidden rounded-2xl border-gold shadow-royal ${g.span}`}
//             >
//               <img
//                 src={g.src}
//                 alt={g.alt}
//                 loading="lazy"
//                 className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-midnight/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />
//               <span className="absolute bottom-3 left-3 text-cream text-sm opacity-0 group-hover:opacity-100 transition">
//                 {g.alt}
//               </span>
//             </motion.button>
//           ))}
//         </div>
//       </div>

//       <AnimatePresence>
//         {lightbox && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             onClick={() => setLightbox(null)}
//             className="fixed inset-0 z-[90] bg-midnight/90 backdrop-blur-sm flex items-center justify-center p-6 cursor-zoom-out"
//           >
//             <motion.img
//               initial={{ scale: 0.9, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.9, opacity: 0 }}
//               src={lightbox}
//               alt=""
//               className="max-h-[90vh] max-w-[90vw] rounded-xl border-gold shadow-royal object-contain"
//             />
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </section>
//   );
// };

/* ---------- Venue ---------- */
const Venue = () => (
  <section id="venue" className="relative bg-[#efece0] py-24 overflow-hidden">
    <div className="mx-auto max-w-6xl px-5">
      <SectionHeader
        eyebrow="स्थळ माहिती"
        title="वरद मंगल कार्यालय, वसमत रोड, परभणी"
        // subtitle="श्रीमंत लॉन्स — निसर्गाच्या सान्निध्यात, राजेशाही थाटात."
      />
      <div className="mt-16 grid lg:grid-cols-2 gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="rounded-3xl overflow-hidden border-gold shadow-royal aspect-[4/3]"
        >
          <iframe
            title="मंडप स्थळ"
            src="https://maps.google.com/maps?q=19.267869,76.825766&z=15&output=embed"
            className="w-full h-full"
            loading="lazy"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="rounded-3xl bg-cream border-gold shadow-royal text-center p-8"
        >
          <p className="text-xs tracking-[0.35em] text-sage">विवाह स्थळ</p>
          <h3 className="mt-2 font-display text-3xl text-burgundy">वरद मंगल कार्यालय</h3>
          <p className="text-midnight/70 mt-1"> वसमत रोड, परभणी — ४३१४०१</p>
          <OrnamentDivider tone="burgundy" />

          {/* <ul className=" space-y-4 text-midnight/80">
            <li className="flex gap-3">
              <span className="text-burgundy">◈</span>
              <div>
                <p className="font-medium text-midnight">जवळचे खुणा</p>
                <p className="text-sm text-midnight/60">बालाजी मंदिरापासून ५ मिनिटे • रेल्वे स्टेशन — ८ किमी</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-burgundy">◈</span>
              <div>
                <p className="font-medium text-midnight">निवासाची व्यवस्था</p>
                <p className="text-sm text-midnight/60">हॉटेल रॉयल हेरिटेज व हॉटेल श्रीराम रेसिडेन्सी — विशेष दर</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-burgundy">◈</span>
              <div>
                <p className="font-medium text-midnight">पार्किंग</p>
                <p className="text-sm text-midnight/60">विनामूल्य वॅले पार्किंग उपलब्ध</p>
              </div>
            </li>
          </ul> */}

          <a
                href="https://www.google.com/maps/search/?api=1&query=Varad+Garden+Mangal+Karyalay+Vasmat+Road+Parbhani"
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-burgundy text-cream px-6 py-3 hover:opacity-90 transition"
                >
                दिशादर्शन उघडा →
            </a>
        </motion.div>
      </div>
    </div>
  </section>
);

/* ---------- Wishes ---------- */
// const INITIAL_WISHES = [
//   { name: "काकू सुनीता", msg: "दोघांनाही सुखी दांपत्यजीवनाच्या असंख्य शुभेच्छा! 💐" },
//   { name: "मित्र सिद्धार्थ", msg: "तुमचा प्रवास प्रेम, हास्य आणि आठवणींनी भरून जावो." },
//   { name: "आजी", msg: "आयुष्यभर एकमेकांच्या साथीने आनंदाने रहा, हीच माझी आशीर्वाद." },
// ];

// const Wishes = () => {
//   const [wishes, setWishes] = useState(INITIAL_WISHES);
//   const [name, setName] = useState("");
//   const [msg, setMsg] = useState("");

//   const submit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!name.trim() || !msg.trim()) return;
//     setWishes((w) => [{ name: name.trim(), msg: msg.trim() }, ...w]);
//     setName("");
//     setMsg("");
//   };

//   return (
//     <section id="wishes" className="relative bg-parchment py-24 overflow-hidden">
//       <div className="mx-auto max-w-6xl px-5">
//         <SectionHeader
//           eyebrow="अतिथी"
//           title="शुभेच्छांची ओंजळ"
//           subtitle="आपल्या स्नेहमय शब्दांनी हा प्रसंग अधिक स्मरणीय होईल."
//         />

//         <div className="mt-16 grid lg:grid-cols-[1fr_1.4fr] gap-10">
//           <motion.form
//             onSubmit={submit}
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.7 }}
//             className="rounded-3xl bg-cream border-gold shadow-royal p-8 h-fit"
//           >
//             <h3 className="font-display text-2xl text-burgundy">आपली शुभेच्छा नोंदवा</h3>
//             <p className="text-sm text-midnight/60 mt-1">आपले शब्द आम्हाला खूप मोलाचे आहेत.</p>
//             <OrnamentDivider tone="burgundy" />
//             <label className="block text-sm text-midnight/70">आपले नाव</label>
//             <input
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className="mt-1 w-full rounded-lg border border-rose/40 bg-white/70 px-4 py-3 outline-none focus:border-gold focus:ring-2 focus:ring-gold/30 text-midnight"
//               placeholder="उदा. सौ. अनुजा"
//             />
//             <label className="mt-4 block text-sm text-midnight/70">आपला संदेश</label>
//             <textarea
//               value={msg}
//               onChange={(e) => setMsg(e.target.value)}
//               rows={4}
//               className="mt-1 w-full rounded-lg border border-rose/40 bg-white/70 px-4 py-3 outline-none focus:border-gold focus:ring-2 focus:ring-gold/30 text-midnight"
//               placeholder="आपल्या मनातील शुभेच्छा लिहा..."
//             />
//             <button
//               type="submit"
//               className="mt-5 inline-flex items-center gap-2 rounded-full bg-burgundy text-cream px-6 py-3 hover:opacity-90 transition"
//             >
//               शुभेच्छा पाठवा →
//             </button>
//           </motion.form>

//           <div className="grid sm:grid-cols-2 gap-5 content-start">
//             {wishes.map((w, i) => (
//               <motion.div
//                 key={`${w.name}-${i}`}
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true, margin: "-40px" }}
//                 transition={{ duration: 0.6, delay: (i % 4) * 0.05 }}
//                 className="relative rounded-2xl bg-white/70 backdrop-blur border-gold p-6 shadow-royal"
//               >
//                 <div className="pointer-events-none absolute -top-3 -left-3 text-gold/60">
//                   <Lotus className="w-8 h-6" />
//                 </div>
//                 <p className="text-midnight/80 leading-relaxed">“{w.msg}”</p>
//                 <p className="mt-4 text-sm text-burgundy font-medium">— {w.name}</p>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

/* ---------- Countdown Section ---------- */
const CountdownSection = () => (
  <section className="relative bg-royal py-24 overflow-hidden">
    <div className="pointer-events-none absolute inset-0 opacity-20 text-gold">
      <Mandala className="absolute top-10 left-1/2 -translate-x-1/2 slow-spin" size={600} />
    </div>
    <div className="relative mx-auto max-w-4xl px-5 text-center">
      <SectionHeader
        dark
        eyebrow="मुहूर्ताच्या दिशेने"
        title="शुभ क्षणाची प्रतीक्षा"
        subtitle="४ जुलै २०२६ • दुपारी १२:३५ वा."
      />
      <div className="mt-14">
        <Countdown />
      </div>
    </div>
  </section>
);

/* ---------- Contact ---------- */
const Contact = () => (
  <section id="contact" className="relative bg-parchment py-24 overflow-hidden">
    <div className="mx-auto max-w-6xl px-5">
      <SectionHeader
        eyebrow="संपर्क"
        title="आमच्याशी संपर्क साधा"
        subtitle="कोणत्याही चौकशीसाठी कृपया मोकळेपणाने संपर्क करा."
      />

      <div className="mt-16 flex justify-center">
  {[
    {
      side: "वर पक्ष",
      people: [
        { name: "श्री विठ्ठलराव गरुड", phone: "+91 9421461253" },
        { name: "चि विशाल गरुड", phone: "+91 9673905773" },
      ],
    },
  ].map((c, i) => (
    <motion.div
      key={c.side}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: i * 0.1 }}
      className="w-full max-w-2xl rounded-3xl bg-cream border-gold shadow-royal p-8"
    >
      {/* Header */}
      <div className="text-center">
        <p className="text-xs tracking-[0.35em] text-sage">
          {c.side}
        </p>

        <h3 className="mt-2 font-display text-2xl text-burgundy">
          कुटुंब संपर्क
        </h3>

        <div className="flex justify-center">
          <OrnamentDivider tone="burgundy" />
        </div>
      </div>

      {/* Contacts */}
      <ul className="space-y-5 mt-8">
        {c.people.map((p) => (
          <li
            key={p.phone}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-2xl bg-white/50"
          >
            <div className="text-center sm:text-left">
              <p className="font-medium text-midnight">
                {p.name}
              </p>

              <p className="text-sm text-midnight/60 mt-1">
                {p.phone}
              </p>
            </div>

            <div className="flex justify-center sm:justify-end gap-2">
              <a
                href={`tel:${p.phone.replace(/\s/g, "")}`}
                className="rounded-full bg-burgundy text-cream px-4 py-2 text-sm hover:opacity-90 transition"
              >
                📞 कॉल
              </a>

              <a
                href={`https://wa.me/${p.phone.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-sage text-cream px-4 py-2 text-sm hover:opacity-90 transition"
              >
                WhatsApp
              </a>
            </div>
          </li>
        ))}
      </ul>
    </motion.div>
  ))}
</div>
    </div>
  </section>
);

/* ---------- Footer ---------- */
const Footer = () => (
  <footer className="relative bg-midnight text-cream py-14 overflow-hidden">
    <div className="pointer-events-none absolute inset-0 opacity-10 text-gold">
      <Mandala className="absolute -top-20 -right-20 slow-spin" size={300} />
    </div>
    <div className="relative mx-auto max-w-6xl px-5 text-center">
      <div className="text-gold flex justify-center">
        <Ganesha className="w-14 h-14" />
      </div>
      <p className="mt-4 font-display text-2xl text-gold-gradient">
        ॥ धन्यवाद ॥
      </p>
      <p className="mt-2 text-cream/70 max-w-xl mx-auto">
        आपल्या आशीर्वादांसाठी आणि स्नेहमय उपस्थितीसाठी मनःपूर्वक आभार.
      </p>
      <OrnamentDivider />
      <p className="text-sm text-cream/60">
        Wedding Website Designed by{" "}
        <span className="text-gold-gradient font-medium">Mangesh</span>
      </p>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm">
        <a href="https://wa.me/9146683698" target="_blank" rel="noreferrer" className="hover:text-gold transition">
          WhatsApp
        </a>
        <span className="text-cream/30">•</span>
        <a href="https://www.instagram.com/mangesh_1635/" target="_blank" rel="noreferrer" className="hover:text-gold transition">
          Instagram
        </a>
        
      </div>
      <p className="mt-6 text-xs text-cream/40">
        © २०२६ कीर्ती ❁ विशाल — सर्व हक्क राखीव
      </p>
    </div>
  </footer>
);

/* ---------- Page ---------- */
function WeddingPage() {
  const [showOpening, setShowOpening] = useState(true);

  return (
    <div className="relative bg-cream text-midnight">
      <AnimatePresence>
        {showOpening && <Opening onEnter={() => setShowOpening(false)} />}
      </AnimatePresence>

      {!showOpening && <Petals count={18} />}

      <Nav />
      <main className="relative z-10">
        <Hero />
        <Couple />
        <Family />
        <Events />
        {/* <Gallery /> */}
        <Venue />
        <CountdownSection />
        {/* <Wishes /> */}
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
