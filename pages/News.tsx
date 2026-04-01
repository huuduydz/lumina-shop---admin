import React from 'react';
import { Calendar, Clock3, Tag, ArrowRight, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NEWS_POSTS, POPULAR_TOPICS } from './newsData';

const News = () => {
  return (
    <div className="bg-surface min-h-screen">
      <div className="relative h-[260px] md:h-[320px] bg-slate-900 flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1600&auto=format&fit=crop"
          alt="News hero"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="relative z-10 text-center text-white px-4">
          <p className="text-xs md:text-sm tracking-[0.25em] uppercase font-bold text-slate-200 mb-3">
            Lumina Journal
          </p>
          <h1 className="text-3xl md:text-5xl font-bold mb-3">News, Tips & Stories</h1>
          <p className="text-slate-200 max-w-2xl mx-auto text-sm md:text-base">
            Stay updated with promotions, product updates and eCommerce tips from Lumina Shop.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-10 -mt-10 relative z-20 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {NEWS_POSTS.map(post => (
              <article
                key={post.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row group"
              >
                <div className="md:w-1/3 relative overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover min-h-[180px] md:min-h-full transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex-1 p-5 md:p-6 flex flex-col">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-2">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-100 text-slate-700">
                      <Tag className="size-3" />
                      {post.category}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="size-3" />
                      {post.date}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock3 className="size-3" />
                      {post.readTime}
                    </span>
                  </div>
                  <Link
                    to={`/news/${post.id}`}
                    className="text-lg md:text-xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors hover:text-primary"
                  >
                    {post.title}
                  </Link>
                  <p className="text-sm text-slate-600 mb-4 line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between mt-auto pt-2">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <User className="size-4" />
                      <span className="font-medium">{post.author}</span>
                    </div>
                    <Link
                      to={`/news/${post.id}`}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-blue-700"
                    >
                      Read more
                      <ArrowRight className="size-4" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-4 tracking-wide uppercase">
                Popular Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {POPULAR_TOPICS.map((topic, index) => (
                  <button
                    key={topic}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                      index === 0
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 rounded-2xl p-6 text-white relative overflow-hidden">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_#38bdf8,_transparent_60%),_radial-gradient(circle_at_bottom,_#6366f1,_transparent_55%)]" />
              <div className="relative">
                <h3 className="text-lg font-bold mb-2">Subscribe for updates</h3>
                <p className="text-sm text-slate-200 mb-4">
                  Get weekly news about promotions, tips and new product launches.
                </p>
                <div className="flex flex-col gap-2">
                  <input
                    type="email"
                    className="w-full px-3 py-2 rounded-lg text-sm text-slate-900 border border-slate-200"
                    placeholder="your@email.com"
                  />
                  <button className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-white text-slate-900 text-sm font-semibold hover:bg-slate-100">
                    Join Newsletter
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-4 tracking-wide uppercase">
                Recent Posts
              </h3>
              <div className="space-y-3">
                {NEWS_POSTS.slice(0, 5).map(post => (
                  <div key={`recent-${post.id}`} className="pb-3 border-b border-slate-100 last:border-b-0">
                    <p className="text-xs text-slate-500 mb-1">{post.date}</p>
                    <Link
                      to={`/news/${post.id}`}
                      className="text-sm font-semibold text-slate-800 leading-snug hover:text-primary transition-colors"
                    >
                      {post.title}
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-4 tracking-wide uppercase">
                Customer Support
              </h3>
              <p className="text-sm text-slate-600 mb-3">
                Need help with your order or want to know more about a promotion? Contact our
                support team.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-blue-700"
              >
                Go to Contact page
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default News;
