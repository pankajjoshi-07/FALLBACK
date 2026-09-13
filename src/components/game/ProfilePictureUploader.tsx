"use client";

import React, { useRef, useState } from "react";
import { Upload, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfilePictureUploaderProps {
  onUpload: (base64String: string) => Promise<void>;
  className?: string;
}

export function ProfilePictureUploader({ onUpload, className }: ProfilePictureUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Basic validation
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file.");
        setIsUploading(false);
        return;
      }
      
      // Resize with canvas
      const base64 = await resizeImage(file, 200, 200);
      await onUpload(base64);
    } catch (err) {
      console.error(err);
      alert("Failed to process image.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const resizeImage = (file: File, maxWidth: number, maxHeight: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions (cover/crop to square)
          const size = Math.min(width, height);
          const startX = (width - size) / 2;
          const startY = (height - size) / 2;

          canvas.width = maxWidth;
          canvas.height = maxHeight;
          const ctx = canvas.getContext("2d");
          if (!ctx) return reject(new Error("No canvas context"));

          ctx.drawImage(img, startX, startY, size, size, 0, 0, maxWidth, maxHeight);
          // Compress to JPEG to save space
          const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
          resolve(dataUrl);
        };
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = event.target?.result as string;
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className={cn("absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/60 rounded-full cursor-pointer z-10", className)} onClick={() => fileInputRef.current?.click()}>
      {isUploading ? (
        <Loader2 className="w-5 h-5 text-white animate-spin" />
      ) : (
        <Upload className="w-5 h-5 text-white" />
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
