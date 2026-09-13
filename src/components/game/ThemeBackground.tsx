"use client";

import React, { useEffect, useRef } from "react";

interface ThemeBackgroundProps {
  themeKey: string;
}

export function ThemeBackground({ themeKey }: ThemeBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", resize);
    resize();

    // Particle classes and variables
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      color: string;

      constructor(theme: string) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 0.5;
        this.opacity = Math.random();

        if (theme === "theme-crimson") {
          // Embers moving up
          this.y = height + Math.random() * 100;
          this.speedX = (Math.random() - 0.5) * 1.5;
          this.speedY = -(Math.random() * 2 + 0.5);
          this.color = `rgba(255, ${Math.random() * 100}, 0, `;
          this.size = Math.random() * 3 + 1;
        } else if (theme === "theme-emerald") {
          // Fireflies
          this.speedX = (Math.random() - 0.5) * 0.5;
          this.speedY = (Math.random() - 0.5) * 0.5;
          this.color = `rgba(100, 255, 150, `;
          this.size = Math.random() * 4 + 1;
        } else if (theme === "theme-nebula") {
          // Stars
          this.speedX = (Math.random() - 0.5) * 0.1;
          this.speedY = (Math.random() - 0.5) * 0.1;
          this.color = `rgba(255, 255, 255, `;
        } else if (theme === "theme-inferno") {
          // Intense rising flames from the bottom
          this.y = height + Math.random() * 50;
          this.x = (Math.random() * width);
          // Store base X for sine wave wobbling
          this.speedX = this.x; 
          this.speedY = -(Math.random() * 6 + 3);
          const r = 255; 
          const g = Math.floor(Math.random() * 150) + 50; 
          this.color = `rgba(${r}, ${g}, 0, `;
          this.size = Math.random() * 8 + 4;
        } else if (theme === "theme-vortex") {
          // Particles orbiting a center
          const angle = Math.random() * Math.PI * 2;
          const radius = Math.random() * (width / 2) + 50;
          this.x = width / 2 + Math.cos(angle) * radius;
          this.y = height / 2 + Math.sin(angle) * radius;
          // Store original angle and radius in speedX/Y to save memory
          this.speedX = angle;
          this.speedY = radius;
          
          const colors = ["0, 255, 255", "255, 0, 255", "100, 100, 255"];
          this.color = `rgba(${colors[Math.floor(Math.random() * colors.length)]}, `;
          this.size = Math.random() * 3 + 1;
        } else if (theme === "theme-lightning") {
          this.x = Math.random() * width;
          this.y = -Math.random() * height;
          this.speedX = 0;
          this.speedY = Math.random() * 20 + 10; // Very fast down
          this.color = `rgba(150, 220, 255, `;
          this.size = Math.random() * 2 + 1;
        } else if (theme === "theme-blizzard") {
          this.x = Math.random() * width;
          this.y = -Math.random() * height;
          this.speedX = (Math.random() * 8 + 4); // Fast diagonal
          this.speedY = (Math.random() * 8 + 4);
          this.color = `rgba(200, 240, 255, `;
          this.size = Math.random() * 4 + 1;
        } else if (theme === "theme-cyberpunk") {
          this.x = Math.random() * width;
          this.y = Math.random() * height;
          this.speedX = (Math.random() * 15 + 5) * (Math.random() > 0.5 ? 1 : -1);
          this.speedY = 0;
          const colors = ["255, 0, 128", "0, 255, 255", "255, 255, 0"];
          this.color = `rgba(${colors[Math.floor(Math.random() * colors.length)]}, `;
          this.size = Math.random() * 3 + 1;
        } else {
          // Default midnight stars
          this.speedX = 0;
          this.speedY = -0.1;
          this.color = `rgba(200, 220, 255, `;
        }
      }

      update(theme: string) {
        this.x += this.speedX;
        this.y += this.speedY;

        if (theme === "theme-emerald") {
          // Fireflies wobble
          this.x += Math.sin(Date.now() / 1000 + this.size) * 0.5;
          this.opacity = 0.5 + Math.sin(Date.now() / 500 + this.size) * 0.5;
        } else if (theme === "theme-inferno") {
          // Flames shrink, speed up, and wobble
          this.size -= 0.08;
          this.y += this.speedY;
          this.speedY *= 1.02; // accelerate upwards
          
          // Heavy wobble using speedX as base position
          this.x = this.speedX + Math.sin(this.y / 30 + this.size) * 15;
          
          if (this.size <= 0.2) {
            this.y = height + Math.random() * 20;
            this.speedX = Math.random() * width;
            this.speedY = -(Math.random() * 6 + 3);
            this.size = Math.random() * 8 + 4;
          }
        } else if (theme === "theme-vortex") {
          // speedX is angle, speedY is radius
          this.speedX += 0.02 + (200 / Math.max(this.speedY, 10)) * 0.005; // orbit faster closer to center
          this.speedY -= 1.5; // pull inward
          
          if (this.speedY < 5) {
            // Respawn outward
            this.speedX = Math.random() * Math.PI * 2;
            this.speedY = Math.max(width, height) / 2 + Math.random() * 100;
          }
          
          this.x = width / 2 + Math.cos(this.speedX) * this.speedY;
          this.y = height / 2 + Math.sin(this.speedX) * this.speedY;
          
          // Size shrinks as it gets closer
          this.size = Math.min(3, Math.max(0.1, this.speedY / 100));
        } else if (theme === "theme-lightning") {
          if (this.y > height) {
            this.y = -10;
            this.x = Math.random() * width;
          }
        } else if (theme === "theme-blizzard") {
          if (this.y > height || this.x > width) {
            this.y = -10;
            this.x = Math.random() * width - 100;
          }
        } else if (theme === "theme-cyberpunk") {
          if (this.x > width + 50) this.x = -50;
          if (this.x < -50) this.x = width + 50;
        }

        if (this.y < -10 && theme !== "theme-vortex" && theme !== "theme-lightning" && theme !== "theme-blizzard") this.y = height + 10;
        if (this.y > height + 10 && theme !== "theme-vortex" && theme !== "theme-lightning" && theme !== "theme-blizzard") this.y = -10;
        if (this.x < -10 && theme !== "theme-vortex" && theme !== "theme-cyberpunk") this.x = width + 10;
        if (this.x > width + 10 && theme !== "theme-vortex" && theme !== "theme-cyberpunk") this.x = -10;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color + this.opacity + ")";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        if (["theme-crimson", "theme-emerald", "theme-inferno", "theme-vortex", "theme-lightning", "theme-cyberpunk", "theme-blizzard"].includes(themeKey)) {
          ctx.shadowBlur = themeKey === "theme-inferno" ? 15 : themeKey === "theme-vortex" || themeKey === "theme-cyberpunk" || themeKey === "theme-lightning" ? 20 : 10;
          ctx.shadowColor = this.color + "1)";
        }
      }
    }

    // Matrix Rain specific variables
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";
    const fontSize = 14;
    const columns = width / fontSize;
    const drops: number[] = [];
    for (let x = 0; x < columns; x++) {
      drops[x] = Math.random() * height; // random start
    }

    let particles: Particle[] = [];
    let nebulaAngle = 0;

    const init = () => {
      particles = [];
      const count = themeKey === "theme-nebula" ? 200 : themeKey === "theme-inferno" ? 250 : themeKey === "theme-vortex" ? 300 : themeKey === "theme-blizzard" ? 400 : themeKey === "theme-cyberpunk" ? 150 : themeKey === "theme-lightning" ? 100 : 80;
      if (themeKey !== "theme-matrix") {
        for (let i = 0; i < count; i++) {
          particles.push(new Particle(themeKey));
        }
      }
    };

    const animate = () => {
      // Clear canvas differently based on theme
      ctx.globalCompositeOperation = "source-over";
      
      if (themeKey === "theme-matrix") {
        ctx.fillStyle = "rgba(0, 0, 0, 0.1)"; // Trail effect
        ctx.fillRect(0, 0, width, height);
      } else if (themeKey === "theme-inferno") {
        ctx.fillStyle = "rgba(10, 0, 0, 0.2)"; // Heavy smoke trails
        ctx.fillRect(0, 0, width, height);
        ctx.globalCompositeOperation = "lighter"; // Extreme fire glow
      } else if (themeKey === "theme-vortex") {
        ctx.fillStyle = "rgba(5, 0, 10, 0.15)"; // Heavy trails
        ctx.fillRect(0, 0, width, height);
        ctx.globalCompositeOperation = "lighter"; // Additive blending for extreme glow
      } else if (themeKey === "theme-cyberpunk") {
        ctx.fillStyle = "rgba(5, 0, 15, 0.2)"; // Heavy trails
        ctx.fillRect(0, 0, width, height);
        ctx.globalCompositeOperation = "lighter";
      } else if (themeKey === "theme-lightning") {
        ctx.fillStyle = "rgba(0, 5, 15, 0.3)"; // Fast fade
        ctx.fillRect(0, 0, width, height);
        // Random lightning flash
        if (Math.random() > 0.98) {
          ctx.fillStyle = "rgba(200, 230, 255, 0.3)";
          ctx.fillRect(0, 0, width, height);
        }
        ctx.globalCompositeOperation = "lighter";
      } else if (themeKey === "theme-blizzard") {
        ctx.fillStyle = "rgba(5, 10, 20, 0.2)";
        ctx.fillRect(0, 0, width, height);
        ctx.globalCompositeOperation = "lighter";
      } else if (themeKey === "theme-nebula") {
        // Slowly rotating nebula gradient
        nebulaAngle += 0.002;
        const cx = width / 2;
        const cy = height / 2;
        const gradient = ctx.createLinearGradient(
          cx + Math.cos(nebulaAngle) * width,
          cy + Math.sin(nebulaAngle) * height,
          cx - Math.cos(nebulaAngle) * width,
          cy - Math.sin(nebulaAngle) * height
        );
        gradient.addColorStop(0, "#090912");
        gradient.addColorStop(0.5, "#1a0b2e");
        gradient.addColorStop(1, "#090912");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      } else {
        ctx.clearRect(0, 0, width, height);
      }

      if (themeKey === "theme-matrix") {
        ctx.fillStyle = "#0F0"; // Green text
        ctx.font = fontSize + "px monospace";
        for (let i = 0; i < drops.length; i++) {
          const text = chars.charAt(Math.floor(Math.random() * chars.length));
          ctx.fillText(text, i * fontSize, drops[i] * fontSize);
          if (drops[i] * fontSize > height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i]++;
        }
      } else {
        particles.forEach((p) => {
          p.update(themeKey);
          p.draw();
        });
        
        // Draw the center of the vortex
        if (themeKey === "theme-vortex") {
          ctx.beginPath();
          ctx.arc(width / 2, height / 2, 8, 0, Math.PI * 2);
          ctx.fillStyle = "#fff";
          ctx.shadowBlur = 50;
          ctx.shadowColor = "#f0f";
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [themeKey]);

  // Static background classes based on theme
  let bgClass = "bg-[#09090b]"; // default dark
  if (themeKey === "theme-crimson") bgClass = "bg-gradient-to-br from-[#1a0505] to-[#0a0000]";
  if (themeKey === "theme-emerald") bgClass = "bg-gradient-to-br from-[#051a0f] to-[#000a05]";
  if (themeKey === "theme-inferno") bgClass = "bg-gradient-to-t from-[#3a0500] via-[#1a0000] to-black";
  if (themeKey === "theme-vortex") bgClass = "bg-[#020005]";
  if (themeKey === "theme-cyberpunk") bgClass = "bg-[#050010]";
  if (themeKey === "theme-lightning") bgClass = "bg-gradient-to-b from-[#000515] to-[#001020]";
  if (themeKey === "theme-blizzard") bgClass = "bg-[#050a14]";

  return (
    <div className={`fixed inset-0 z-[-1] ${bgClass} transition-colors duration-1000`}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
      {/* Gradient overlay to make panels readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 pointer-events-none" />
    </div>
  );
}
