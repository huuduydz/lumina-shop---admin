import React from 'react';
import { Calendar, Tag, ArrowRight, User } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NewsPost {
  id: string;
  title: string;
  category: string;
  date: string;
  author: string;
  image: string;
  excerpt: string;
}

const POSTS: NewsPost[] = [
  {
    id: '1',
    title: 'Big Summer Sale Up To 50% Off Electronics',
    category: 'Promotion',
    date: 'June 10, 2026',
    author: 'Marketing Team',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1400&auto=format&fit=crop',
    excerpt:
      'Save big on headphones, laptops and smart accessories this summer with limited-time deals and free shipping on all orders over $50.'
  },
  {
    id: '2',
    title: 'How To Build Your Minimalist Home Workspace',
    category: 'Inspiration',
    date: 'May 28, 2026',
    author: 'Lumina Studio',
    image: 'https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf?q=80&w=1400&auto=format&fit=crop',
    excerpt:
      'Discover three simple tips to design a productive, clutter-free workspace using smart furniture, lighting and decor.'
  },
  {
    id: '3',
    title: 'New Arrivals: Premium Fashion Essentials',
    category: 'New Arrivals',
    date: 'May 12, 2026',
    author: 'Style Editor',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1400&auto=format&fit=crop',
    excerpt:
      'Explore our latest collection of denim, leather goods and accessories curated for everyday city life.'
  },
  {
    id: '4',
    title: '5 Checkout Optimizations That Increase Conversion Rate',
    category: 'E-commerce Tips',
    date: 'April 29, 2026',
    author: 'Growth Team',
    image: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?q=80&w=1400&auto=format&fit=crop',
    excerpt:
      'A practical checklist to reduce cart abandonment, improve trust signals and make your checkout flow faster on mobile.'
  },
  {
    id: '5',
    title: 'Behind The Scenes: How We Curate Seasonal Collections',
    category: 'Company News',
    date: 'April 20, 2026',
    author: 'Editorial Team',
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1400&auto=format&fit=crop',
    excerpt:
      'From trend research to product testing, here is the process our team uses to select products for each campaign.'
  },
  {
    id: '6',
    title: 'Customer Story: Setting Up A Small Cafe With Lumina Decor',
    category: 'Customer Story',
    date: 'April 09, 2026',
    author: 'Community Team',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1400&auto=format&fit=crop',
    excerpt:
      'See how one of our customers transformed a compact cafe space into a warm and modern destination.'
  },
  {
    id: '7',
    title: 'Tech Spotlight: Choosing The Right Headphones In 2026',
    category: 'Technology',
    date: 'March 26, 2026',
    author: 'Product Team',
    image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?q=80&w=1400&auto=format&fit=crop',
    excerpt:
      'A clear buying guide covering ANC quality, comfort, battery life and codec support for different user needs.'
  },
  {
    id: '8',
    title: 'Sustainable Packaging Update For All Nationwide Deliveries',
    category: 'Sustainability',
    date: 'March 14, 2026',
    author: 'Operations Team',
    image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=1400&auto=format&fit=crop',
    excerpt:
      'We are moving to recyclable packaging materials and reducing plastic use across every order shipment.'
  },
  {
    id: '9',
    title: 'Weekly Deals Calendar: Best Time To Buy This Month',
    category: 'Promotion',
    date: 'March 03, 2026',
    author: 'Sales Team',
    image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?q=80&w=1400&auto=format&fit=crop',
    excerpt:
      'Plan your shopping with our monthly discount calendar featuring flash sales, bundles and free shipping windows.'
  },
  {
    id: '10',
    title: 'Warehouse Upgrade Helps Us Ship Orders Faster',
    category: 'Company News',
    date: 'February 21, 2026',
    author: 'Logistics Team',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1400&auto=format&fit=crop',
    excerpt:
      'A new picking and sorting setup has reduced processing time so your orders leave our warehouse sooner.'
  },
  {
    id: '11',
    title: 'Fashion Guide: 8 Easy Outfit Combos For Busy Workdays',
    category: 'Style Guide',
    date: 'February 10, 2026',
    author: 'Style Editor',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1400&auto=format&fit=crop',
    excerpt:
      'Mix and match essentials to create polished outfits that work from office meetings to evening plans.'
  },
  {
    id: '12',
    title: 'Case Study: How Bundles Improved Average Order Value',
    category: 'Case Study',
    date: 'January 28, 2026',
    author: 'Analytics Team',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1400&auto=format&fit=crop',
    excerpt:
      'What happened after introducing curated bundles and recommendation widgets on product detail pages.'
  }
];

const POPULAR_TOPICS = [
  'Promotions',
  'Tutorials',
  'Home Decor',
  'Fashion',
  'Electronics',
  'E-commerce Tips',
  'Case Study'
];

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
            {POSTS.map(post => (
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
                  </div>
                  <h2 className="text-lg md:text-xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-sm text-slate-600 mb-4 line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between mt-auto pt-2">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <User className="size-4" />
                      <span className="font-medium">{post.author}</span>
                    </div>
                    <button className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-blue-700">
                      Read more
                      <ArrowRight className="size-4" />
                    </button>
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
                {POSTS.slice(0, 5).map(post => (
                  <div key={`recent-${post.id}`} className="pb-3 border-b border-slate-100 last:border-b-0">
                    <p className="text-xs text-slate-500 mb-1">{post.date}</p>
                    <p className="text-sm font-semibold text-slate-800 leading-snug">
                      {post.title}
                    </p>
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
