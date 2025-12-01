"use client";

import { useEffect, useRef } from "react";
import { NeatGradient } from "@firecms/neat";
import { neatConfig } from "@/lib/neat-config";

export default function LoginBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Khởi tạo NeatGradient
    const neat = new NeatGradient({
      ref: canvasRef.current,
      ...neatConfig,
    });

    // Cleanup khi component bị unmount
    return () => neat.destroy();
  }, []);

  return (
    <canvas
      id="gradient"
      ref={canvasRef}
      className="absolute inset-0 w-full h-full -z-10"
    />
  );
}
