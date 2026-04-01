import React from 'react';
import { ArrowLeft, ArrowRight, Calendar, Clock3, Tag, User } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { getNewsPostById, NEWS_POSTS } from './newsData';

const NewsDetail = () => {
  const { id } = useParams<{ id: string }>();

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const post = id ? getNewsPostById(id) : undefined;

  if (!post) {
    return (
      <div className="bg-surface min-h-screen px-4 py-12 md:px-10">
        <div className="max-w-3xl mx-auto rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-3">Lumina Journal</p>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Article not found</h1>
          <p className="text-slate-600 mb-6">
            This post does not exist or may have been removed.
          </p>
          <Link
            to="/news"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800"
          >
            <ArrowLeft className="size-4" />
            Back to News
          </Link>
        </div>
      </div>
    );
  }

  const relatedInCategory = NEWS_POSTS.filter(
    (candidate) => candidate.category === post.category && candidate.id !== post.id
  ).slice(0, 3);
  const fallbackRelated = NEWS_POSTS.filter((candidate) => candidate.id !== post.id).slice(0, 3);
  const relatedPosts = relatedInCategory.length > 0 ? relatedInCategory : fallbackRelated;

  return (
    <div className="bg-surface min-h-screen pb-16">
      <div className="relative h-[280px] md:h-[360px] bg-slate-900 overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="relative z-10 max-w-5xl mx-auto h-full flex flex-col justify-center px-4 md:px-8 lg:px-10 text-white">
          <Link
            to="/news"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-200 hover:text-white mb-4"
          >
            <ArrowLeft className="size-4" />
            Back to News
          </Link>
          <h1 className="text-2xl md:text-4xl font-bold max-w-3xl leading-tight">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm text-slate-200 mt-4">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/10">
              <Tag className="size-3.5" />
              {post.category}
            </span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="size-3.5" />
              {post.date}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock3 className="size-3.5" />
              {post.readTime}
            </span>
            <span className="inline-flex items-center gap-1">
              <User className="size-3.5" />
              {post.author}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 lg:px-10 pt-8">
        <article className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
          <p className="text-lg text-slate-700 leading-relaxed mb-6">{post.excerpt}</p>

          <div className="space-y-4">
            {post.content.map((section, index) => (
              <p key={`${post.id}-section-${index}`} className="text-slate-600 leading-relaxed">
                {section}
              </p>
            ))}
          </div>

          <div className="mt-8 p-5 rounded-xl bg-slate-50 border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3">
              Quick Highlights
            </h3>
            <ul className="space-y-2 text-sm text-slate-600">
              {post.highlights.map((highlight) => (
                <li key={highlight} className="flex items-start gap-2">
                  <span className="mt-1.5 size-1.5 rounded-full bg-primary shrink-0"></span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        </article>

        <section className="mt-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-1">Lumina Journal</p>
              <h2 className="text-2xl font-bold text-slate-900">Related Posts</h2>
            </div>
            <Link to="/news" className="text-sm font-semibold text-primary hover:underline">
              View all posts
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {relatedPosts.map((related) => (
              <article
                key={`related-${related.id}`}
                className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden group"
              >
                <Link to={`/news/${related.id}`} className="block aspect-[4/3] overflow-hidden">
                  <img
                    src={related.image}
                    alt={related.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </Link>
                <div className="p-4">
                  <p className="text-xs font-semibold text-slate-500 mb-2">{related.date}</p>
                  <Link
                    to={`/news/${related.id}`}
                    className="block text-base font-bold text-slate-900 leading-snug hover:text-primary transition-colors line-clamp-2"
                  >
                    {related.title}
                  </Link>
                  <p className="text-sm text-slate-600 mt-2 line-clamp-3">{related.excerpt}</p>
                  <Link
                    to={`/news/${related.id}`}
                    className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-blue-700"
                  >
                    Read more
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default NewsDetail;
