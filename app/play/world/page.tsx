"use client";

import { useRef, useEffect, useState } from "react";
import { startEngine } from "@/lib/engine";
import { loadWorld } from "@/lib/mw";

type PlayProps = {
  params: { world: string };
};

export default function Play({ params }: PlayProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [worldData, setWorldData] = useState<any>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/world?name=${params.world}`);
        if (!res.ok) throw new Error("Failed to load world");

        const data = await res.json();
        const world = loadWorld(data.world);
        setWorldData(world);

        if (ref.current) {
          startEngine(ref.current, world);
        }
      } catch (err) {
        console.error("Error loading world:", err);
      }
    }

    load();
  }, [params.world]);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <div
        ref={ref}
        style={{
          width: "100%",
          height: "100%",
          border: "1px solid #ccc",
          background: "#111",
        }}
      ></div>
    </div>
  );
}
