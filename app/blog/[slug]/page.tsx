import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface Props {
  params: Promise<{ slug: string }>;
}

// ✅ FIXED: Proper typing added
export async function generateStaticParams() {
  const posts: { slug: string }[] = await prisma.post.findMany({
    where: { status: "published" },
    select: { slug: true },
  });

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;

  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      author: {
        select: {
          name: true,
          image: true,
          username: true,
          bio: true,
        },
      },
    },
  });

  if (!post || post.status !== "published") {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950 py-12">
      <div className="max-w-3xl mx-auto px-4">

        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors mb-8"
        >
          ← Back to Blog
        </Link>

        {/* Tone badge */}
        {post.tone && (
          <span className="inline-block text-xs px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300 font-medium mb-4">
            {post.tone}
          </span>
        )}

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
          {post.title}
        </h1>

        {/* Author row */}
        <div className="flex items-center gap-3 mb-8 pb-8 border-b border-gray-100 dark:border-gray-800">
          {post.author.image ? (
            <Image
              src={post.author.image}
              alt={post.author.name ?? "Author"}
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center text-white font-semibold">
              {post.author.name?.[0] ?? "U"}
            </div>
          )}
          <div>
            <Link
              href={`/writers/${post.author.username}`}
              className="text-sm font-medium text-gray-900 dark:text-white hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
            >
              {post.author.name}
            </Link>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Cover image */}
        {post.coverImage && (
          <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-8">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-gray dark:prose-invert max-w-none">
          {post.content.split("\n").map((paragraph: string, i: number) => (
            paragraph.trim() ? (
              <p
                key={i}
                className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 text-base"
              >
                {paragraph}
              </p>
            ) : (
              <br key={i} />
            )
          ))}
        </div>

        {/* Writer card */}
        <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-4 font-medium">
            Written by
          </p>
          <div className="flex items-start gap-4 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
            {post.author.image ? (
              <Image
                src={post.author.image}
                alt={post.author.name ?? "Author"}
                width={56}
                height={56}
                className="rounded-full shrink-0"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-violet-600 flex items-center justify-center text-white text-xl font-semibold shrink-0">
                {post.author.name?.[0] ?? "U"}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                {post.author.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                {post.author.bio ?? "Writer on PostCraft"}
              </p>
              {post.author.username && (
                <Link
                  href={`/writers/${post.author.username}`}
                  className="text-xs px-3 py-1.5 rounded-lg border border-violet-200 dark:border-violet-800 text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950 transition-colors font-medium"
                >
                  View all posts →
                </Link>
              )}
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}