import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-950">

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 pt-24 pb-16 text-center">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-950 mb-6">
          <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
          <span className="text-xs text-violet-700 dark:text-violet-300 font-medium">
            Powered by Gemini AI
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
          Write blogs{" "}
          <span className="text-violet-600">10x faster</span>
          <br />
          with AI
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-10">
          PostCraft generates full blog posts in seconds. Pick a tone, choose a
          cover image, edit and publish — all in one place.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/generate"
            className="px-8 py-4 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-base transition-colors"
          >
            Start Writing Free
          </Link>
          <Link
            href="/blog"
            className="px-8 py-4 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 font-semibold text-base transition-colors"
          >
            Read the Blog
          </Link>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-6 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
            <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900 flex items-center justify-center mb-4">
              <span className="text-xl">⚡</span>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              AI Generation
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Enter a topic and tone. Gemini writes your full blog post in
              seconds with live streaming output.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
            <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900 flex items-center justify-center mb-4">
              <span className="text-xl">🖼️</span>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Smart Image Picker
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Search millions of free Unsplash photos or upload your own cover
              image with one click.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
            <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900 flex items-center justify-center mb-4">
              <span className="text-xl">🌍</span>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Public Writer Profile
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Every post you publish appears on your public profile. Share your
              writer page on LinkedIn.
            </p>
          </div>

        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-4 py-16 border-t border-gray-100 dark:border-gray-800">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          How it works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { step: "01", title: "Sign in", desc: "Login with Google or GitHub in one click." },
            { step: "02", title: "Generate", desc: "Enter your topic and pick a tone. AI writes it live." },
            { step: "03", title: "Pick image", desc: "Search Unsplash or upload your own cover photo." },
            { step: "04", title: "Publish", desc: "Hit publish. Your post goes live on your profile." },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="text-4xl font-bold text-violet-200 dark:text-violet-900 mb-3">
                {item.step}
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="rounded-2xl bg-violet-600 dark:bg-violet-700 p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to write your first post?
          </h2>
          <p className="text-violet-200 mb-8 text-base">
            Free to use. No credit card required.
          </p>
          <Link
            href="/generate"
            className="inline-block px-8 py-4 rounded-xl bg-white text-violet-600 font-semibold hover:bg-violet-50 transition-colors"
          >
            Get Started Free
          </Link>
        </div>
      </section>

    </main>
  );
}
