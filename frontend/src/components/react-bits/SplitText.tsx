import { useEffect, useRef } from "react";
import gsap from "gsap";

type SplitTextProps = {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
};

export default function SplitText({ text, className = "", delay = 0.03, duration = 0.65 }: SplitTextProps) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const chars = el.querySelectorAll("span");
    const ctx = gsap.context(() => {
      gsap.fromTo(
        chars,
        { y: 18, opacity: 0, filter: "blur(8px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration,
          stagger: delay,
          ease: "power3.out"
        }
      );
    }, el);
    return () => ctx.revert();
  }, [text, delay, duration]);

  return (
    <h1 ref={ref} className={className} aria-label={text}>
      {text.split("").map((char, index) => (
        <span key={`${char}-${index}`} style={{ display: "inline-block", whiteSpace: char === " " ? "pre" : "normal" }}>
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </h1>
  );
}
