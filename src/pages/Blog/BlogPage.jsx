import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, Lock } from 'lucide-react';
import { apiService } from '../../services/api.js';
import { INITIAL_BLOG_POSTS } from '../../constants/seedData.js';
import { PageWrapper, FadeIn, StaggerContainer, StaggerItem, HoverCard } from '../../components/animations/MotionComponents.jsx';
import { useUserAuth } from '../../context/UserAuthContext.jsx';
import LoginRequiredGate from '../../components/auth/LoginRequiredGate.jsx';

export default function BlogPage() {
  const { isAuthenticated } = useUserAuth();
  const [posts, setPosts] = useState(INITIAL_BLOG_POSTS);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(false);

  const categories = ['All', 'Architecture', 'Email Marketing', 'Web Development'];

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 250);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    let active = true;
    async function fetchPosts() {
      setLoading(true);
      try {
        const res = await apiService.getBlogPosts({ category, search: debouncedSearch });
        if (active && res && res.data) {
          setPosts(res.data);
        }
      } catch {
        // Use bundled blog data
      } finally {
        if (active) setLoading(false);
      }
    }
    fetchPosts();
    return () => {
      active = false;
    };
  }, [category, debouncedSearch]);

  return (
    <PageWrapper className="pt-32 pb-24 space-y-16">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#2563EB] tracking-wide uppercase px-3 py-1 rounded-full border mb-4 bg-[#FFFFFF] border-[#17213A]/15">
            <span>Engineering & Deliverability Journal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-[#111111]">
            DNSV Technical Insights
          </h1>
          <p className="text-base sm:text-lg mt-4 leading-relaxed text-[#17213A]/80">
            In-depth engineering perspectives on scalable software architectures, high-volume email deliverability, DNS protocol security, and modern web performance.
          </p>
        </FadeIn>
      </section>

      {/* Filter and Search Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b pb-6 border-[#17213A]/15">
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                aria-pressed={category === cat}
                onClick={() => setCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  category === cat
                    ? 'bg-[#2563EB] text-[#F7F7F2]'
                    : 'text-[#17213A]/70 hover:text-[#111111] bg-[#FFFFFF] border border-[#17213A]/15'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#17213A]/40" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search engineering articles..."
              aria-label="Search engineering articles"
              className="w-full text-xs pl-9 pr-3 py-2 rounded-lg focus:outline-none focus:border-[#2563EB] bg-[#FFFFFF] border border-[#17213A]/20 text-[#111111] placeholder:text-[#17213A]/40"
            />
          </div>
        </FadeIn>
      </section>

      {/* Posts Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-center py-16 text-xs font-mono text-[#17213A]/60">
            Loading articles...
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 text-xs text-[#17213A]/70">
            No articles match your query.
          </div>
        ) : (
          <StaggerContainer stagger={0.08} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map((post) => (
              <StaggerItem key={post.slug || post._id}>
                <HoverCard className="p-7 rounded-2xl border transition-all flex flex-col justify-between group h-full bg-[#FFFFFF] border-[#17213A]/15 hover:border-[#2563EB] shadow-sm">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-[#2563EB] font-medium mb-3">
                      <span>{post.category}</span>
                      <span aria-hidden="true" className="text-[#17213A]/30">·</span>
                      <span className="text-[#17213A]/60">{post.readTime || '5 min read'}</span>
                    </div>

                    <h2 className="text-lg font-bold mb-3 group-hover:text-[#2563EB] transition-colors leading-snug text-[#111111]">
                      <Link to={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h2>

                    <p className="text-xs leading-relaxed mb-6 text-[#17213A]/75">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t flex items-center justify-between text-xs border-[#17213A]/10">
                    <span className="text-[#17213A]/60">
                      {post.author || 'DNSV Engineering'}
                    </span>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="text-[#2563EB] font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                    >
                      {!isAuthenticated && <Lock className="w-3 h-3" />}
                      <span>{isAuthenticated ? 'Read Article' : 'View Summary'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </HoverCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </section>

      {!isAuthenticated && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LoginRequiredGate
            title="Login, Register, or Sign Up with Google to Read Full Articles"
            description="Public visitors can browse article titles and excerpts. Login or Register with a verified inbox email (Gmail, Yahoo, Outlook, or business domain), or Sign Up with Google to read full engineering guides and topic breakdowns."
          />
        </section>
      )}
    </PageWrapper>
  );
}

