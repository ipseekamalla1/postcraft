"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ImagePicker from "@/components/ImagePicker";

const TONES = ["Professional", "Casual", "Viral", "Academic"];
const LENGTHS = [
  { value: "short", label: "Short", words: "~400 words" },
  { value: "medium", label: "Medium", words: "~800 words" },
  { value: "long", label: "Long", words: "~1200 words" },
];

export default function GeneratePage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("Professional");
  const [length, setLength] = useState("medium");
  const [output, setOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [coverImage, setCoverImage] = useState("");

  if (!session) {
    return (
      <main className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            You need to sign in to generate posts.
          </p>
          <button
            onClick={() => router.push("/login")}
            className="px-6 py-3 rounded-xl bg-violet-600 text-white font-semibold hover:bg-violet-700 transition-colors"
          >
            Sign in
          </button>
        </div>
      </main>
    );
  }

  async function handleGenerate() {
    if (!topic.trim()) return;
    setIsGenerating(true);
    setOutput("");
    setSaved(false);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, tone, length }),
      });

      if (!res.ok) throw new Error("Generation failed");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) return;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        setOutput((prev) => prev + text);
      }
    } catch (err) {
      console.error(err);
      setOutput("Something went wrong. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleSave(status: "draft" | "published") {
    if (!output.trim()) return;
    setIsSaving(true);

    const lines = output.split("\n");
    const title = lines[0].trim() || topic;
    const content = lines.slice(1).join("\n").trim();

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
body: JSON.stringify({ title, content, tone, coverImage, status }),      });

      if (!res.ok) throw new Error("Save failed");
      setSaved(true);

      if (status === "published") {
        router.push("/dashboard");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950 py-12">
      <div className="max-w-3xl mx-auto px-4">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Generate a Post
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            Enter a topic, pick your tone and length — AI does the rest.
          </p>
        </div>

        {/* Form */}
        <div className="border border-gray-200 dark:border-gray-800 rounded-2xl p-6 bg-white dark:bg-gray-900 mb-6">

          {/* Topic */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Topic
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Why TypeScript is worth learning in 2025"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors text-sm"
            />
          </div>

          {/* Tone */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tone
            </label>
            <div className="flex gap-2 flex-wrap">
              {TONES.map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
                    tone === t
                      ? "bg-violet-600 border-violet-600 text-white"
                      : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-violet-300 dark:hover:border-violet-700"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Length */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Length
            </label>
            <div className="flex gap-2">
              {LENGTHS.map((l) => (
                <button
                  key={l.value}
                  onClick={() => setLength(l.value)}
                  className={`flex-1 py-3 rounded-xl text-sm border transition-colors ${
                    length === l.value
                      ? "bg-violet-600 border-violet-600 text-white"
                      : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-violet-300 dark:hover:border-violet-700"
                  }`}
                >
                  <div className="font-medium">{l.label}</div>
                  <div className="text-xs opacity-70">{l.words}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={!topic.trim() || isGenerating}
            className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-colors flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
                Generating...
              </>
            ) : (
              "✨ Generate Post"
            )}
          </button>
        </div>

        {/* Output */}
        {(output || isGenerating) && (
          <div className="border border-gray-200 dark:border-gray-800 rounded-2xl p-6 bg-white dark:bg-gray-900 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900 dark:text-white">
                Generated Post
              </h2>
              {isGenerating && (
                <span className="flex items-center gap-1.5 text-xs text-violet-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
                  Writing...
                </span>
              )}
            </div>
            <div className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 leading-relaxed min-h-32">
              {output}
              {isGenerating && (
                <span className="inline-block w-0.5 h-4 bg-violet-500 animate-pulse ml-0.5 align-middle" />
              )}
            </div>
          </div>
        )}
{/* Image Picker — shows after generation */}
{output && !isGenerating && (
  <div className="mb-6">
    <h2 className="font-semibold text-gray-900 dark:text-white mb-3">
      Cover Image
    </h2>
    <ImagePicker
      selectedImage={coverImage}
      onSelect={setCoverImage}
      topic={topic}
    />
  </div>
)}
        {/* Save buttons */}
        {output && !isGenerating && (
          <div className="flex gap-3">
            <button
              onClick={() => handleSave("draft")}
              disabled={isSaving || saved}
              className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold text-sm transition-colors disabled:opacity-50"
            >
              {saved ? "✓ Saved!" : "Save as Draft"}
            </button>
            <button
              onClick={() => handleSave("published")}
              disabled={isSaving}
              className="flex-1 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm transition-colors disabled:opacity-50"
            >
              {isSaving ? "Publishing..." : "Publish Post →"}
            </button>
          </div>
        )}

      </div>
    </main>
  );
}
