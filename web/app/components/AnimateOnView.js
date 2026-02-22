"use client";

import { useEffect, useRef } from "react";

/**
 * Wraps children and fades/slides them in when they enter the viewport.
 * direction: "up" | "left" | "right" | "scale"
 */
export default function AnimateOnView({
  children,
  className = "",
  delay = 0,
  direction = "up",
  as: Tag = "div",
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.transitionDelay = `${delay}ms`;
          el.classList.add("aov-visible");
          observer.unobserve(el);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -48px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  const dirClass =
    direction === "left"
      ? "aov-left"
      : direction === "right"
        ? "aov-right"
        : direction === "scale"
          ? "aov-scale"
          : "";

  return (
    <Tag ref={ref} className={`aov-hidden ${dirClass} ${className}`}>
      {children}
    </Tag>
  );
}
