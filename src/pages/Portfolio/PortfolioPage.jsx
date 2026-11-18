import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Lock, Bookmark } from 'lucide-react';
import { apiService } from '../../services/api.js';
import { INITIAL_PORTFOLIO_PROJECTS } from '../../constants/seedData.js';
import { PageWrapper, FadeIn, StaggerContainer, StaggerItem, HoverCard } from '../../components/animations/MotionComponents.jsx';
import { useUserAuth } from '../../context/UserAuthContext.jsx';
import LoginRequiredGate from '../../components/auth/LoginRequiredGate.jsx';

export default function PortfolioPage() {
  const [projects, setProjects] = useState(INITIAL_PORTFOLIO_PROJECTS);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { user, isAuthenticated, openLoginBox, updateSessionUser } = useUserAuth();

  const categories = ['All', 'SaaS Development', 'Custom Software', 'API & Validation', 'API Development'];

  useEffect(() => {
    async function loadPortfolio() {
      try {
        const res = await apiService.getPortfolioProjects({ category: selectedCategory });
        if (res && res.data) setProjects(res.data);
      } catch {
        // Use bundled portfolio data
      }
    }
    loadPortfolio();
  }, [selectedCategory]);

  const isProjectSaved = (id) =>
    Boolean(user?.savedItems?.some((i) => i.itemType === 'project' && i.itemId === String(id)));

  const handleToggleBookmark = async (project) => {
    if (!isAuthenticated) {
      openLoginBox('login');
      return;
    }
    const id = String(project.id || project._id);
    try {
      const res = await apiService.toggleSavedItem({
        itemType: 'project',
        itemId: id,
        title: project.title,
        category: project.category || 'Portfolio Case Study',
        url: '/portfolio'
      });
      if (res?.data) {
        updateSessionUser({ ...user, savedItems: res.data });
      }
    } catch {
      // Ignore error
    }
  };

  return (
    <PageWrapper className="pt-32 pb-24 space-y-16">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#2563EB] tracking-wide uppercase px-3 py-1 rounded-full border mb-4 bg-[#FFFFFF] border-[#17213A]/15">
            <span>Portfolio & Prototypes</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-[#111111]">
            Engineered Systems & Case Studies
          </h1>
          <p className="text-base sm:text-lg mt-4 leading-relaxed text-[#17213A]/80">
            Explore demonstration architectures, internal SaaS platforms like Mailcurve, and technical case studies developed by DNSV Technologies.
          </p>
        </FadeIn>
      </section>

      {/* Filter Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="flex flex-wrap items-center gap-2 border-b pb-4 border-[#17213A]/15">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#2563EB] text-[#F7F7F2] shadow-sm'
                    : 'text-[#17213A]/70 hover:text-[#111111] bg-[#FFFFFF] border border-[#17213A]/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* Projects Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => {
            const projId = project.id || project._id;
            const saved = isProjectSaved(projId);
            return (
              <StaggerItem key={projId}>
                <HoverCard className="p-8 rounded-2xl border transition-all flex flex-col justify-between h-full group bg-[#FFFFFF] border-[#17213A]/15 hover:border-[#2563EB]/50 shadow-sm">
                  <div>
                    <div className="flex items-center justify-between mb-3 gap-2">
                      <span className="text-[11px] font-mono uppercase text-[#2563EB] font-bold">
                        {project.category}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded border bg-[#F7F7F2] border-[#17213A]/20 text-[#17213A]/70">
                          {project.badge || 'Sample Work'}
                        </span>
                        {isAuthenticated && (
                          <button
                            type="button"
                            onClick={() => handleToggleBookmark(project)}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              saved
                                ? 'bg-sky-50 border-[#0284C7] text-[#0284C7]'
                                : 'bg-white border-slate-200 text-slate-400 hover:text-[#0284C7]'
                            }`}
                            title={saved ? 'Remove Bookmark' : 'Save Case Study to Portal'}
                          >
                            <Bookmark className="w-3.5 h-3.5" fill={saved ? 'currentColor' : 'none'} />
                          </button>
                        )}
                      </div>
                    </div>

                    <h3 className="text-xl font-bold mb-3 transition-colors text-[#111111] group-hover:text-[#2563EB]">
                      {project.title}
                    </h3>

                    <p className="text-xs sm:text-sm leading-relaxed mb-6 text-[#17213A]/80">
                      {project.summary}
                    </p>

                    {isAuthenticated ? (
                      <>
                        <div className="space-y-3 p-4 rounded-xl border text-xs mb-6 bg-[#F7F7F2] border-[#17213A]/15">
                          <div>
                            <strong className="text-[#2563EB] block text-[11px] uppercase tracking-wider mb-0.5">The Technical Challenge:</strong>
                            <span className="text-[#17213A]/80">{project.challenge}</span>
                          </div>
                          <div>
                            <strong className="text-[#2563EB] block text-[11px] uppercase tracking-wider mb-0.5">The Solution:</strong>
                            <span className="text-[#17213A]/80">{project.solution}</span>
                          </div>
                          <div>
                            <strong className="text-[#2563EB] block text-[11px] uppercase tracking-wider mb-0.5">Outcome:</strong>
                            <span className="text-[#17213A]/80">{project.results}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5 mb-6">
                          {project.technologies?.map((tech, idx) => (
                            <span key={idx} className="text-[11px] font-mono px-2.5 py-1 rounded border bg-[#FFFFFF] border-[#17213A]/15 text-[#17213A]/85">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="mb-6 p-4 rounded-xl bg-sky-50/70 border border-sky-200 flex items-center justify-between gap-3 text-xs text-slate-700">
                        <div className="flex items-center gap-2">
                          <Lock className="w-4 h-4 text-[#0284C7] shrink-0" />
                          <span>Full architecture challenge, solution & outcome metrics locked.</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => openLoginBox('login')}
                          className="text-xs font-bold text-[#0284C7] hover:underline shrink-0"
                        >
                          Unlock
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t flex items-center justify-between border-[#17213A]/15">
                    {isAuthenticated ? (
                      <Link
                        to="/request-quote"
                        className="text-xs font-semibold text-[#2563EB] hover:underline flex items-center gap-1.5"
                      >
                        Discuss a Similar Build
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() => openLoginBox('login')}
                        className="text-xs font-semibold text-[#0284C7] hover:underline flex items-center gap-1.5"
                      >
                        Login / Register to Discuss Similar Build
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </HoverCard>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </section>

      {!isAuthenticated && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LoginRequiredGate
            title="Login, Register, or Sign Up with Google for Full Case Studies"
            description="Only project titles and brief overviews are visible publicly. Verify your active inbox email (Gmail, Yahoo, Outlook, or business domain) or Sign Up with Google to inspect full challenges, architectures, outcomes, and tech stacks."
          />
        </section>
      )}

      {/* Transparency Disclaimer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="p-6 rounded-xl border text-xs leading-relaxed bg-[#FFFFFF] border-[#17213A]/15 text-[#17213A]/70 shadow-sm">
            <strong className="block mb-1 text-[#111111]">Portfolio Disclosure:</strong>
            Listed projects include internally engineered SaaS platforms (such as Mailcurve and Email Validator) as well as structured prototype case studies reflecting DNSV Technologies' technical architecture standards.
          </div>
        </FadeIn>
      </section>
    </PageWrapper>
  );
}

