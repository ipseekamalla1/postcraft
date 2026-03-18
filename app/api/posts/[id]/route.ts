import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

// DELETE post
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response("Unauthorized", { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return new Response("User not found", { status: 404 });
  }

  const post = await prisma.post.findUnique({
    where: { id },
  });

  if (!post || post.authorId !== user.id) {
    return new Response("Forbidden", { status: 403 });
  }

  await prisma.post.delete({
    where: { id },
  });

  return Response.json({ success: true });
}

// UPDATE post
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response("Unauthorized", { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return new Response("User not found", { status: 404 });
  }

  const post = await prisma.post.findUnique({
    where: { id },
  });

  if (!post || post.authorId !== user.id) {
    return new Response("Forbidden", { status: 403 });
  }

  const data = await req.json();

  const updatedPost = await prisma.post.update({
    where: { id },
    data,
  });

  return Response.json(updatedPost);
}