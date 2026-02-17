import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { authOptions } from "@/lib/auth";


type Post = {
  id: string;
  title: string;
  slug: string;
  content: string;
  coverImage: string | null;
  tone: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
};

export default async function DashboardPage() {
const session = await getServerSession(authOptions);

  // Redirect to login if not logged in
  if (!session?.user?.email) {
    redirect("/login");
  }

  // Get user's posts from database
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      posts: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  const posts = user?.posts ?? [];
  const drafts = posts.filter((p) => p.status === "draft");
  const published = posts.filter((p) => p.status === "published");

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950 py-12">
      <div className="max-w-5xl mx-auto px-4">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Dashboard
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
              Manage your drafts and published posts
            </p>
          </div>
          <Link
            href="/generate"
            className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition-colors"
          >
            + New Post
          </Link>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: "Total Posts", value: posts.length },
            { label: "Published", value: published.length },
            { label: "Drafts", value: drafts.length },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-6 text-center"
            >
              <div className="text-3xl font-bold text-violet-600 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {posts.length === 0 && (
          <div className="text-center py-24 border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">
            <div className="text-5xl mb-4">✍️</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No posts yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
              Generate your first AI blog post and it will appear here.
            </p>
            <Link
              href="/generate"
              className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition-colors"
            >
              Generate your first post
            </Link>
          </div>
        )}

        {/* Drafts */}
        {drafts.length > 0 && (
          <div className="mb-10">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-400" />
              Drafts
            </h2>
            <div className="flex flex-col gap-3">
              {drafts.map((post) => (
                <PostRow key={post.id} post={post} />
              ))}
            </div>
          </div>
        )}

        {/* Published */}
        {published.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400" />
              Published
            </h2>
            <div className="flex flex-col gap-3">
              {published.map((post) => (
                <PostRow key={post.id} post={post} />
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}

// Post row component
function PostRow({ post }: { post: Post }) {
  const isDraft = post.status === "draft";

  return (
    <div className="flex items-center justify-between p-5 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-violet-200 dark:hover:border-violet-800 transition-colors">
      <div className="flex-1 min-w-0 mr-4">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            isDraft
              ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300"
              : "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
          }`}>
            {isDraft ? "Draft" : "Published"}
          </span>
          {post.tone && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300 font-medium">
              {post.tone}
            </span>
          )}
        </div>
        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
          {post.title}
        </h3>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          {new Date(post.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {!isDraft && (
          <Link
            href={`/blog/${post.slug}`}
            className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            View
          </Link>
        )}
        <Link
          href={`/generate?edit=${post.id}`}
          className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          Edit
        </Link>
        <DeleteButton postId={post.id} />
      </div>
    </div>
  );
}

// Delete button — needs to be a client component
function DeleteButton({ postId }: { postId: string }) {
  return (
    <form action={`/api/posts/${postId}`} method="POST">
      <input type="hidden" name="_method" value="DELETE" />
      <button
        type="submit"
        className="text-xs px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-900 text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
        onClick={async (e) => {
          e.preventDefault();
          if (!confirm("Delete this post?")) return;
          await fetch(`/api/posts/${postId}`, { method: "DELETE" });
          window.location.reload();
        }}
      >
        Delete
      </button>
    </form>
  );
}
