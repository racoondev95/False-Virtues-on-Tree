import { useEffect, useRef } from "react";
import gsap from "gsap";

type FadeContentProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

export default function FadeContent({ children, className = "", delay = 0 }: FadeContentProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { autoAlpha: 0, y: 16, filter: "blur(8px)" },
        { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.75, delay, ease: "power2.out" }
      );
    }, el);
    return () => ctx.revert();
  }, [delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
