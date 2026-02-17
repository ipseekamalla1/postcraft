"use client";

import { useState, useRef } from "react";
import Image from "next/image";

interface UnsplashPhoto {
  id: string;
  url: string;
  thumb: string;
  authorName: string;
  authorUrl: string;
}

interface ImagePickerProps {
  selectedImage: string;
  onSelect: (url: string) => void;
  topic?: string;
}

export default function ImagePicker({
  selectedImage,
  onSelect,
  topic,
}: ImagePickerProps) {
  const [tab, setTab] = useState<"search" | "upload">("search");
  const [query, setQuery] = useState(topic ?? "");
  const [photos, setPhotos] = useState<UnsplashPhoto[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleSearch() {
    if (!query.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch(
        `/api/images/search?query=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      setPhotos(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  }

  async function handleUpload(file: File) {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/images/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      onSelect(data.url);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden bg-white dark:bg-gray-900">

      {/* Selected preview */}
      {selectedImage && (
        <div className="relative h-48 w-full">
          <Image
            src={selectedImage}
            alt="Cover"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <span className="text-white text-sm font-medium bg-black/50 px-3 py-1 rounded-full">
              ✓ Cover image selected
            </span>
          </div>
          <button
            onClick={() => onSelect("")}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors text-sm"
          >
            ✕
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-800">
        {(["search", "upload"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              tab === t
                ? "text-violet-600 border-b-2 border-violet-600"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            {t === "search" ? "🔍 Search Unsplash" : "⬆️ Upload Your Own"}
          </button>
        ))}
      </div>

      <div className="p-4">

        {/* Search tab */}
        {tab === "search" && (
          <div>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search photos..."
                className="flex-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
              />
              <button
                onClick={handleSearch}
                disabled={isSearching || !query.trim()}
                className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-sm font-medium transition-colors"
              >
                {isSearching ? "..." : "Search"}
              </button>
            </div>

            {/* Photo grid */}
            {photos.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {photos.map((photo) => (
                  <button
                    key={photo.id}
                    onClick={() => onSelect(photo.url)}
                    className={`relative aspect-video rounded-lg overflow-hidden group border-2 transition-all ${
                      selectedImage === photo.url
                        ? "border-violet-500"
                        : "border-transparent hover:border-violet-300"
                    }`}
                  >
                    <Image
                      src={photo.thumb}
                      alt={photo.authorName}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                    {selectedImage === photo.url && (
                      <div className="absolute inset-0 bg-violet-500/30 flex items-center justify-center">
                        <span className="text-white text-lg">✓</span>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 opacity-0 group-hover:opacity-100 transition-opacity truncate">
                      {photo.authorName}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Empty state */}
            {photos.length === 0 && !isSearching && (
              <div className="text-center py-8 text-gray-400 dark:text-gray-600 text-sm">
                Search for photos above — results from Unsplash will appear here
              </div>
            )}
          </div>
        )}

        {/* Upload tab */}
        {tab === "upload" && (
          <div>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                const file = e.dataTransfer.files[0];
                if (file) handleUpload(file);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
                dragOver
                  ? "border-violet-500 bg-violet-50 dark:bg-violet-950"
                  : "border-gray-200 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-700"
              }`}
            >
              <div className="text-3xl mb-2">
                {isUploading ? "⏳" : "🖼️"}
              </div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {isUploading
                  ? "Uploading..."
                  : "Drop an image here or click to browse"}
              </p>
              <p className="text-xs text-gray-400">
                PNG, JPG, WEBP up to 10MB
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload(file);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}