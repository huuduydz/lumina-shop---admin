export interface NewsPost {
  id: string;
  title: string;
  category: string;
  date: string;
  author: string;
  image: string;
  excerpt: string;
  readTime: string;
  content: string[];
  highlights: string[];
}

export const NEWS_POSTS: NewsPost[] = [
  {
    id: '1',
    title: 'Big Summer Sale Up To 50% Off Electronics',
    category: 'Promotion',
    date: 'June 10, 2026',
    author: 'Marketing Team',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1400&auto=format&fit=crop',
    excerpt:
      'Save big on headphones, laptops and smart accessories this summer with limited-time deals and free shipping on all orders over $50.',
    readTime: '4 min read',
    content: [
      'Our Summer Sale campaign is now live across the electronics category, with discounts up to 50% on selected SKUs. We designed this campaign to help customers upgrade daily essentials while keeping budgets under control.',
      'The promotion includes noise-canceling headphones, creator laptops, smart home speakers and accessories. In addition to direct price reductions, selected product bundles now include free shipping and priority packing.',
      'To get the best value, customers should check the campaign calendar and combine bundle deals with weekly vouchers. Inventory is limited for several hero products, so high-demand items may sell out earlier than planned.'
    ],
    highlights: [
      'Campaign period: June 10 to June 30, 2026',
      'Up to 50% off selected electronics',
      'Free shipping for orders above $50'
    ]
  },
  {
    id: '2',
    title: 'How To Build Your Minimalist Home Workspace',
    category: 'Inspiration',
    date: 'May 28, 2026',
    author: 'Lumina Studio',
    image: 'https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf?q=80&w=1400&auto=format&fit=crop',
    excerpt:
      'Discover three simple tips to design a productive, clutter-free workspace using smart furniture, lighting and decor.',
    readTime: '5 min read',
    content: [
      'A minimalist workspace starts with layout first, then decoration. Keep only one focal zone on the desk and move accessories into vertical storage so your working area remains open.',
      'Lighting is the second priority. Layer natural light with one warm desk lamp and avoid mixed color temperatures. This keeps visual fatigue low during long sessions and helps create a calm atmosphere.',
      'Finally, choose two or three accent items only, such as a small plant, one framed print and one organizer tray. Limiting visual noise improves concentration and makes the setup easier to maintain every day.'
    ],
    highlights: [
      'Use vertical storage to free desk space',
      'Prefer warm and consistent lighting',
      'Limit accents to 2-3 pieces for a clean look'
    ]
  },
  {
    id: '3',
    title: 'New Arrivals: Premium Fashion Essentials',
    category: 'New Arrivals',
    date: 'May 12, 2026',
    author: 'Style Editor',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1400&auto=format&fit=crop',
    excerpt:
      'Explore our latest collection of denim, leather goods and accessories curated for everyday city life.',
    readTime: '3 min read',
    content: [
      'This launch introduces a compact set of wardrobe essentials designed for daily city use. The collection focuses on neutral tones, durable fabrics and clean silhouettes that are easy to mix.',
      'Key items include structured denim jackets, versatile leather crossbody bags and light outerwear with practical pocket layouts. Each piece was selected for high repeat wear and simple care.',
      'We also added modular accessories that pair well across both workday and weekend outfits, helping customers build complete looks without overbuying.'
    ],
    highlights: [
      'New capsule includes denim, leather and accessories',
      'Neutral color palette for easy styling',
      'Designed for daily city wear and repeat use'
    ]
  },
  {
    id: '4',
    title: '5 Checkout Optimizations That Increase Conversion Rate',
    category: 'E-commerce Tips',
    date: 'April 29, 2026',
    author: 'Growth Team',
    image: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?q=80&w=1400&auto=format&fit=crop',
    excerpt:
      'A practical checklist to reduce cart abandonment, improve trust signals and make your checkout flow faster on mobile.',
    readTime: '6 min read',
    content: [
      'Our analytics review found that checkout friction is mostly caused by long forms, unclear shipping cost and low payment confidence. Small UX changes can improve conversion quickly without redesigning the full storefront.',
      'Start by reducing required fields and enabling autofill on mobile. Add a sticky order summary and show shipping estimates early, not only at the final step.',
      'Trust badges, clear return policy highlights and one-click wallet methods are also high-impact. Together, these updates shorten decision time and reduce drop-off at payment.'
    ],
    highlights: [
      'Simplify checkout forms for mobile users',
      'Show shipping fees and delivery estimates earlier',
      'Add trust badges and fast wallet payment options'
    ]
  },
  {
    id: '5',
    title: 'Behind The Scenes: How We Curate Seasonal Collections',
    category: 'Company News',
    date: 'April 20, 2026',
    author: 'Editorial Team',
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1400&auto=format&fit=crop',
    excerpt:
      'From trend research to product testing, here is the process our team uses to select products for each campaign.',
    readTime: '5 min read',
    content: [
      'Collection planning starts six to eight weeks before launch. We combine search trend data, customer wishlist behavior and support feedback to identify the most relevant product themes.',
      'Candidate products then go through quality checks, packaging tests and margin analysis. This ensures each campaign can deliver both customer value and operational stability.',
      'Final selections are reviewed by merchandising, operations and content teams together so visuals, inventory and messaging are aligned before release.'
    ],
    highlights: [
      'Planning starts 6-8 weeks before launch',
      'Products are screened for quality and margin fit',
      'Cross-team review aligns content and inventory'
    ]
  },
  {
    id: '6',
    title: 'Customer Story: Setting Up A Small Cafe With Lumina Decor',
    category: 'Customer Story',
    date: 'April 09, 2026',
    author: 'Community Team',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1400&auto=format&fit=crop',
    excerpt:
      'See how one of our customers transformed a compact cafe space into a warm and modern destination.',
    readTime: '4 min read',
    content: [
      'A local cafe owner partnered with our design advisors to refresh a limited floor area into a more welcoming customer space. The goal was to improve seating comfort while keeping service movement smooth.',
      'We introduced layered warm lighting, compact modular tables and neutral wall accents. The final layout improved traffic flow and increased usable seating without making the room feel crowded.',
      'After launch, the cafe reported higher average stay duration and more positive customer feedback about atmosphere and photo-friendly corners.'
    ],
    highlights: [
      'Small-space cafe redesign with modular furniture',
      'Improved seating capacity and movement flow',
      'Higher customer stay time after redesign'
    ]
  },
  {
    id: '7',
    title: 'Tech Spotlight: Choosing The Right Headphones In 2026',
    category: 'Technology',
    date: 'March 26, 2026',
    author: 'Product Team',
    image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?q=80&w=1400&auto=format&fit=crop',
    excerpt:
      'A clear buying guide covering ANC quality, comfort, battery life and codec support for different user needs.',
    readTime: '7 min read',
    content: [
      'Headphone selection in 2026 should be based on usage scenario first. Commuters generally prioritize active noise cancellation and battery endurance, while creators often need microphone clarity and low latency.',
      'Comfort remains a top factor for long sessions. Customers should check clamp force, ear cup depth and total weight, especially for all-day office or study use.',
      'Codec and connectivity support also matter more now. Devices that offer stable multipoint Bluetooth and modern codec options deliver better consistency across phone and laptop switching.'
    ],
    highlights: [
      'Choose based on daily usage scenario',
      'Prioritize comfort for long listening sessions',
      'Check codec and multipoint Bluetooth support'
    ]
  },
  {
    id: '8',
    title: 'Sustainable Packaging Update For All Nationwide Deliveries',
    category: 'Sustainability',
    date: 'March 14, 2026',
    author: 'Operations Team',
    image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=1400&auto=format&fit=crop',
    excerpt:
      'We are moving to recyclable packaging materials and reducing plastic use across every order shipment.',
    readTime: '4 min read',
    content: [
      'We have completed phase one of our packaging transition program and moved core shipping boxes to recyclable board sourced from certified suppliers.',
      'Plastic fillers were replaced by paper-based cushioning for most categories. This change lowers waste volume while preserving product safety during transportation.',
      'The next phase will focus on package size optimization to reduce empty space, improve shipping efficiency and lower logistics emissions per order.'
    ],
    highlights: [
      'Recyclable packaging now used for core shipments',
      'Reduced plastic fillers in fulfillment process',
      'Phase two targets package size optimization'
    ]
  },
  {
    id: '9',
    title: 'Weekly Deals Calendar: Best Time To Buy This Month',
    category: 'Promotion',
    date: 'March 03, 2026',
    author: 'Sales Team',
    image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?q=80&w=1400&auto=format&fit=crop',
    excerpt:
      'Plan your shopping with our monthly discount calendar featuring flash sales, bundles and free shipping windows.',
    readTime: '3 min read',
    content: [
      'The monthly deal calendar helps shoppers plan purchases by category and campaign window. We distribute deeper discounts across key weekends to balance demand and stock availability.',
      'Flash sales are best for single-item buys, while bundle windows usually provide better value for multi-item carts. Free-shipping days are designed to support customers outside major city zones.',
      'For best results, save products to wishlist and enable campaign reminders. This reduces missed deals and helps compare options before checkout.'
    ],
    highlights: [
      'Flash sales for quick single-item deals',
      'Bundle windows for higher cart value',
      'Free-shipping slots planned each week'
    ]
  },
  {
    id: '10',
    title: 'Warehouse Upgrade Helps Us Ship Orders Faster',
    category: 'Company News',
    date: 'February 21, 2026',
    author: 'Logistics Team',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1400&auto=format&fit=crop',
    excerpt:
      'A new picking and sorting setup has reduced processing time so your orders leave our warehouse sooner.',
    readTime: '4 min read',
    content: [
      'Our central warehouse recently completed a workflow upgrade with improved shelf zoning and barcode checkpoints. The target was to reduce picking errors and improve dispatch speed.',
      'Early results show faster order handoff from packing to carrier pickup, especially during campaign peaks. This also improves reliability for estimated delivery windows shown at checkout.',
      'The team will continue tuning layout and replenishment frequency to keep lead times stable as order volume grows.'
    ],
    highlights: [
      'Faster pick-pack-dispatch cycle after upgrade',
      'More stable delivery estimate accuracy',
      'Ongoing optimization for peak season demand'
    ]
  },
  {
    id: '11',
    title: 'Fashion Guide: 8 Easy Outfit Combos For Busy Workdays',
    category: 'Style Guide',
    date: 'February 10, 2026',
    author: 'Style Editor',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1400&auto=format&fit=crop',
    excerpt:
      'Mix and match essentials to create polished outfits that work from office meetings to evening plans.',
    readTime: '6 min read',
    content: [
      'Busy schedules require outfit formulas that are fast but still polished. This guide focuses on repeatable combinations built from neutral base items and one statement accessory.',
      'Use one structured layer such as a blazer or trench to instantly sharpen casual pieces. Keep footwear versatile so the same look works from office hours to evening plans.',
      'The collection section in this guide links each combo to items with high restock rates, making it easier to re-order core pieces when needed.'
    ],
    highlights: [
      '8 repeatable outfit formulas for weekdays',
      'Neutral base pieces with one accent item',
      'Looks designed for office and after-work transition'
    ]
  },
  {
    id: '12',
    title: 'Case Study: How Bundles Improved Average Order Value',
    category: 'Case Study',
    date: 'January 28, 2026',
    author: 'Analytics Team',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1400&auto=format&fit=crop',
    excerpt:
      'What happened after introducing curated bundles and recommendation widgets on product detail pages.',
    readTime: '8 min read',
    content: [
      'This case study reviews a six-week test where curated product bundles were introduced to selected categories. The objective was to increase average order value without reducing conversion.',
      'Bundles were placed on product detail pages with clear savings labels and optional add-ons. We also adjusted recommendation ranking to prioritize compatible products with higher attach rates.',
      'The test showed meaningful uplift in average order value and a moderate increase in units per transaction, confirming that curated combinations can improve cart depth when presented clearly.'
    ],
    highlights: [
      'Six-week bundle experiment across key categories',
      'Higher average order value after rollout',
      'Recommendation ranking improved attach rates'
    ]
  }
];

export const POPULAR_TOPICS = [
  'Promotions',
  'Tutorials',
  'Home Decor',
  'Fashion',
  'Electronics',
  'E-commerce Tips',
  'Case Study'
];

export const getNewsPostById = (id: string) => NEWS_POSTS.find((post) => post.id === id);
