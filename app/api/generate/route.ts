import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { streamBlogPost } from "@/lib/openai";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { topic, tone, length } = await req.json();

  if (!topic || !tone || !length) {
    return new Response("Missing fields", { status: 400 });
  }

  try {
    const stream = await streamBlogPost(topic, tone, length);

    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content ?? "";
          if (text) {
            controller.enqueue(new TextEncoder().encode(text));
          }
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("OpenAI error:", error);
    return new Response("AI generation failed", { status: 500 });
  }
}