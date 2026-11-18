import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Share2, Check, Bookmark } from 'lucide-react';
import { apiService } from '../../services/api.js';
import { INITIAL_BLOG_POSTS } from '../../constants/seedData.js';
import { PageWrapper, FadeIn } from '../../components/animations/MotionComponents.jsx';
import { useUserAuth } from '../../context/UserAuthContext.jsx';
import LoginRequiredGate from '../../components/auth/LoginRequiredGate.jsx';

export default function BlogPostDetailPage() {
  const { user, isAuthenticated, openLoginBox, updateSessionUser } = useUserAuth();
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticle() {
      setLoading(true);
      try {
        const res = await apiService.getBlogPostBySlug(slug);
        if (res && res.data) {
          setPost(res.data);
        } else {
          const fallback = INITIAL_BLOG_POSTS.find(p => p.slug === slug);
          setPost(fallback || null);
        }
      } catch {
        const fallback = INITIAL_BLOG_POSTS.find(p => p.slug === slug);
        setPost(fallback || null);
      } finally {
        setLoading(false);
      }
    }
    fetchArticle();
  }, [slug]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isSaved = Boolean(
    user?.savedItems?.some((i) => i.itemType === 'blog' && i.itemId === slug)
  );

  const handleToggleBookmark = async () => {
    if (!isAuthenticated) {
      openLoginBox('login');
      return;
    }
    if (!post) return;
    try {
      const res = await apiService.toggleSavedItem({
        itemType: 'blog',
        itemId: slug,
        title: post.title,
        category: post.category || 'Technical Article',
        url: `/blog/${slug}`
      });
      if (res?.data) {
        updateSessionUser({ ...user, savedItems: res.data });
      }
    } catch {
      // Ignore error
    }
  };

  if (loading) {
    return (
      <div className="pt-40 pb-24 text-center text-xs font-mono text-[#17213A]/60">
        Loading article content...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="pt-40 pb-24 max-w-xl mx-auto px-4 text-center space-y-4">
        <h1 className="text-2xl font-bold text-[#111111]">
          Article Not Found
        </h1>
        <p className="text-xs text-[#17213A]/70">
          The article you are looking for does not exist or has been moved.
        </p>
        <Link to="/blog" className="inline-flex items-center gap-2 text-xs font-semibold text-[#2563EB]">
          <ArrowLeft className="w-4 h-4" /> Return to Blog
        </Link>
      </div>
    );
  }

  return (
    <PageWrapper className="pt-32 pb-24 space-y-16">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Navigation Breadcrumb */}
        <FadeIn>
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] hover:underline mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to All Articles
          </Link>

          <div className="flex items-center gap-2 text-xs font-medium mb-3">
            <span className="text-[#2563EB] font-bold">{post.category}</span>
            <span aria-hidden="true" className="text-[#17213A]/30">·</span>
            <span className="text-[#17213A]/60">{post.readTime || '5 min read'}</span>
            <span aria-hidden="true" className="text-[#17213A]/30">·</span>
            <span className="text-[#17213A]/60">
              Published {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : '2026'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-4xl font-extrabold tracking-tight leading-snug text-[#111111]">
            {post.title}
          </h1>

          <div className="flex items-center justify-between pt-6 border-b pb-6 mt-4 border-[#17213A]/15 gap-3 flex-wrap">
            <div className="text-xs text-[#17213A]/80">
              By <strong className="text-[#111111]">{post.author || 'DNSV Engineering Team'}</strong>
            </div>
            <div className="flex items-center gap-2">
              {isAuthenticated && (
                <button
                  type="button"
                  onClick={handleToggleBookmark}
                  className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                    isSaved
                      ? 'bg-sky-50 border-[#0284C7] text-[#0284C7]'
                      : 'bg-[#FFFFFF] border-[#17213A]/15 text-[#17213A]/80 hover:text-[#2563EB]'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" fill={isSaved ? 'currentColor' : 'none'} />
                  <span>{isSaved ? 'Saved' : 'Bookmark'}</span>
                </button>
              )}
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors cursor-pointer bg-[#FFFFFF] border-[#17213A]/15 text-[#17213A]/80 hover:text-[#2563EB]"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#2563EB]" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copied ? 'Link Copied' : 'Share Article'}</span>
              </button>
            </div>
          </div>
        </FadeIn>

        {/* Lead Excerpt (Always Public) */}
        <FadeIn className="p-6 rounded-xl border-l-2 border-[#2563EB] text-sm leading-relaxed italic bg-[#FFFFFF] border-y border-r border-[#17213A]/10 text-[#17213A]/90 shadow-sm">
          {post.excerpt}
        </FadeIn>

        {!isAuthenticated ? (
          <LoginRequiredGate
            title="Login, Register, or Sign Up with Google to Read Full Article"
            description="Only the article summary is visible publicly. Login or Register with your verified inbox email (Gmail, Yahoo, Outlook, or business domain), or Sign Up with Google to read the complete guide and bookmark articles."
          />
        ) : (
          <>
            {/* Body Content */}
            <FadeIn className="max-w-none text-xs sm:text-sm leading-relaxed space-y-6">
              {post.content.split('\n\n').map((paragraph, idx) => {
                if (paragraph.startsWith('### ')) {
                  return (
                    <h3 key={idx} className="text-lg font-bold pt-4 text-balance text-[#111111]">
                      {paragraph.replace('### ', '')}
                    </h3>
                  );
                }
                return (
                  <p key={idx} className="text-[#17213A]/85">
                    {paragraph}
                  </p>
                );
              })}
            </FadeIn>

            {/* Tag Cloud */}
            {post.tags && post.tags.length > 0 && (
              <FadeIn className="pt-8 border-t flex flex-wrap items-center gap-2 border-[#17213A]/15">
                <span className="text-xs font-mono text-[#17213A]/60">Topics:</span>
                {post.tags.map((tag, idx) => (
                  <span key={idx} className="text-[11px] font-mono px-2 py-0.5 rounded border bg-[#FFFFFF] border-[#17213A]/15 text-[#17213A]/70">
                    {tag}
                  </span>
                ))}
              </FadeIn>
            )}
          </>
        )}
      </article>

      {isAuthenticated && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="p-8 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-6 bg-[#FFFFFF] border-[#2563EB]/40 shadow-sm">
            <div>
              <h3 className="text-base font-bold text-[#111111]">
                Need Help Implementing These Architectural Patterns?
              </h3>
              <p className="text-xs mt-1 text-[#17213A]/75">
                DNSV Technologies engineers custom SaaS platforms and high-volume email workflows.
              </p>
            </div>
            <Link
              to="/request-quote"
              className="px-5 py-2.5 bg-[#2563EB] hover:bg-[#2563EB]/90 text-[#F7F7F2] text-xs font-semibold rounded-lg shrink-0 shadow-md transition-all active:scale-95"
            >
              Request Quotation
            </Link>
          </FadeIn>
        </section>
      )}
    </PageWrapper>
  );
}

