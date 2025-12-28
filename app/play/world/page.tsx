"use client";
import { useEffect, useRef } from "react";
import { startEngine } from "@/lib/engine";

export default function Play({ params }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`/Worlds/${params.world}/world.mw`)
      .then(r => r.text())
      .then(t => startEngine(ref.current!, JSON.parse(t)));
  }, []);

  return <div ref={ref}></div>;
}
