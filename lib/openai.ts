import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function streamBlogPost(
  topic: string,
  tone: string,
  length: string
) {
  const wordCount =
    length === "short" ? 400 : length === "medium" ? 800 : 1200;

  const stream = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    stream: true,
    messages: [
      {
        role: "system",
        content: "You are an expert blog writer. Write clear, engaging blog posts.",
      },
      {
        role: "user",
        content: `Write a ${tone.toLowerCase()} blog post about "${topic}".

Requirements:
- Around ${wordCount} words
- Start with a compelling title on the first line (no markdown, just plain title text)
- Then a blank line
- Then the full blog post content
- Use clear paragraphs with line breaks between them
- Tone must be ${tone.toLowerCase()} throughout
- No markdown symbols like ** or ## — just plain text with paragraph breaks
- End with a strong conclusion paragraph`,
      },
    ],
  });

  return stream;
}