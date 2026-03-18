import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";

// ✅ Define type for posts
type PostWithAuthor = {
  id: string;
  slug: string;
  title: string;
  content: string;
  coverImage: string | null;
  tone: string | null;
  createdAt: Date;
  author: {
    name: string | null;
    image: string | null;
    username: string | null;
  };
};

export default async function BlogPage() {
  // ✅ Apply type here
  const posts: PostWithAuthor[] = await prisma.post.findMany({
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

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950 py-12">
      <div className="max-w-5xl mx-auto px-4">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Blog
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            Posts from all writers on PostCraft
          </p>
        </div>

        {/* Empty state */}
        {posts.length === 0 && (
          <div className="text-center py-24 border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No posts yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Be the first to publish a post!
            </p>
          </div>
        )}

        {/* Posts grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post: PostWithAuthor) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden hover:border-violet-200 dark:hover:border-violet-800 transition-all hover:shadow-lg dark:hover:shadow-violet-950/20"
            >
              {/* Cover image */}
              <div className="relative h-48 bg-gray-100 dark:bg-gray-800">
                {post.coverImage ? (
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">
                    ✍️
                  </div>
                )}

                {/* Tone badge */}
                {post.tone && (
                  <div className="absolute top-3 left-3">
                    <span className="text-xs px-2 py-1 rounded-full bg-black/50 text-white font-medium backdrop-blur-sm">
                      {post.tone}
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <h2 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                  {post.title}
                </h2>

                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">
                  {post.content.slice(0, 120)}...
                </p>

                {/* Author */}
                <div className="flex items-center gap-2">
                  {post.author.image ? (
                    <Image
                      src={post.author.image}
                      alt={post.author.name ?? "Author"}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs font-semibold">
                      {post.author.name?.[0] ?? "U"}
                    </div>
                  )}

                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {post.author.name}
                  </span>

                  <span className="text-xs text-gray-300 dark:text-gray-700">·</span>

                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </main>
  );
}