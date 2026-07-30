"use client";

import { useEffect, useRef } from "react";

// React never executes plain <script> tags it renders client-side, and the
// widget itself relies on document.currentScript, which dynamically inserted
// scripts only get when explicitly marked non-async (see MDN).
export function DemoWidgetEmbed({ slug }: { slug: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (mountedRef.current || !containerRef.current) return;
    mountedRef.current = true;

    const script = document.createElement("script");
    script.src = "/widget.js";
    script.dataset.calculator = slug;
    script.async = false;
    containerRef.current.appendChild(script);
  }, [slug]);

  return <div ref={containerRef} />;
}
