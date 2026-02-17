import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

function generateSlug(title: string): string {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim() +
    "-" +
    Date.now()
  );
}

export async function GET() {
  const posts = await prisma.post.findMany({
    where: { status: "published" },
    include: {
      author: {
        select: {
          name: true,
          image: true,
          username: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return Response.json(posts);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { title, content, tone, coverImage, status } = await req.json();

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) return new Response("User not found", { status: 404 });

  const slug = generateSlug(title);

  const post = await prisma.post.create({
    data: {
      title,
      slug,
      content,
      tone,
      coverImage,
      status: status ?? "draft",
      authorId: user.id,
    },
  });

  return Response.json(post);
}