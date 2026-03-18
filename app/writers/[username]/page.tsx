import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface Props {
  params: { username: string };
}

// ✅ Define proper types
type Post = {
  id: string;
  slug: string;
  title: string;
  coverImage: string | null;
  createdAt: Date;
};

type UserWithPosts = {
  name: string | null;
  username: string | null;
  image: string | null;
  bio: string | null;
  posts: Post[];
};

export default async function WriterPage({ params }: Props) {
  // ✅ Type the Prisma result
  const user: UserWithPosts | null = await prisma.user.findUnique({
    where: { username: params.username },
    include: {
      posts: {
        where: { status: "published" },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          slug: true,
          title: true,
          coverImage: true,
          createdAt: true,
        },
      },
    },
  });

  if (!user) notFound();

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950 py-12">
      <div className="max-w-4xl mx-auto px-4">

        {/* Writer profile */}
        <div className="flex items-start gap-6 mb-12 pb-12 border-b border-gray-100 dark:border-gray-800">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name ?? "Writer"}
              width={80}
              height={80}
              className="rounded-full shrink-0"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-violet-600 flex items-center justify-center text-white text-2xl font-semibold shrink-0">
              {user.name?.[0] ?? "U"}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {user.name}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              @{user.username}
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {user.bio ?? "Writer on PostCraft"}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
              {user.posts.length} published post{user.posts.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Posts */}
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Published Posts
        </h2>

        {user.posts.length === 0 && (
          <div className="text-center py-16 border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">
            <p className="text-gray-400 text-sm">No published posts yet.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ✅ FIX: type post */}
          {user.posts.map((post: Post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden hover:border-violet-200 dark:hover:border-violet-800 transition-all hover:shadow-lg"
            >
              {/* Cover */}
              <div className="relative h-40 bg-gray-100 dark:bg-gray-800">
                {post.coverImage ? (
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl">
                    ✍️
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                  {post.title}
                </h3>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </main>
  );
}