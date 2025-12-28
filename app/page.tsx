"use client";
import { useRef, useState } from "react";
import { startEngine } from "@/lib/engine";
import { saveWorld } from "@/lib/mw";
import { bundle } from "@/lib/bundler";

export default function Home() {
  const ref = useRef<HTMLDivElement>(null);
  const [world, setWorld] = useState<any>(null);

  // Create a new world
  async function create() {
    const res = await fetch("/api/world", {
      method: "POST",
      body: JSON.stringify({ name: "MyWorld" }),
    });
    const { world } = await res.json();
    const parsed = JSON.parse(world);
    setWorld(parsed);
    startEngine(ref.current!, parsed);
  }

  // Upload a mod (zip) with assets, bundle JS, and apply
  async function uploadMod(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    const file = e.target.files[0];
    const form = new FormData();
    form.append("file", file);

    const res = await fetch("/api/mod", { method: "POST", body: form });
    const { code, assets } = await res.json();

    const newWorld = {
      ...world,
      mods: [...world.mods, { code, assets }],
    };
    setWorld(newWorld);
    startEngine(ref.current!, newWorld);
  }

  // Publish world to Vercel Blob including assets
  async function publish() {
    if (!world) return alert("Create a world first!");

    // Bundle all mods into a single JS file
    let fullBundle = "";
    for (const mod of world.mods) {
      fullBundle += await bundle(mod.code);
    }

    const res = await fetch("/api/publish", {
      method: "POST",
      body: JSON.stringify({
        name: world.name,
        world: saveWorld(world),
        bundle: fullBundle,
      }),
    });

    const { url } = await res.json();
    alert("World published!\n" + url);
  }

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={create} style={{ marginRight: "10px" }}>
        Create World
      </button>
      <input type="file" onChange={uploadMod} style={{ marginRight: "10px" }} />
      <button onClick={publish}>Publish World</button>
      <div
        ref={ref}
        style={{
          width: "600px",
          height: "400px",
          marginTop: "20px",
          border: "1px solid #ccc",
        }}
      ></div>
    </div>
  );
}
