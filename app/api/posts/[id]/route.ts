import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response("Unauthorized", { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) return new Response("User not found", { status: 404 });

  const post = await prisma.post.findUnique({
    where: { id: params.id },
  });

  if (!post || post.authorId !== user.id) {
    return new Response("Forbidden", { status: 403 });
  }

  await prisma.post.delete({ where: { id: params.id } });
  return Response.json({ success: true });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response("Unauthorized", { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) return new Response("User not found", { status: 404 });

  const post = await prisma.post.findUnique({
    where: { id: params.id },
  });

  if (!post || post.authorId !== user.id) {
    return new Response("Forbidden", { status: 403 });
  }

  const data = await req.json();

  const updated = await prisma.post.update({
    where: { id: params.id },
    data,
  });

  return Response.json(updated);
}