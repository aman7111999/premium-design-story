import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import { AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ReadingProgress } from "@/components/ReadingProgress";
import { PageTransition } from "@/components/PageTransition";
import { CursorFollower } from "@/components/CursorFollower";
import { NoiseOverlay } from "@/components/BackgroundFX";
import { useLenis } from "@/lib/lenis";

const Home = lazy(() => import("@/pages/Home"));
const Work = lazy(() => import("@/pages/Work"));
const ProjectPage = lazy(() => import("@/pages/Project"));
const About = lazy(() => import("@/pages/About"));
const Contact = lazy(() => import("@/pages/Contact"));
const Resume = lazy(() => import("@/pages/Resume"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const AdminLayout = lazy(() => import("@/pages/admin/AdminLayout"));
const AdminOverview = lazy(() => import("@/pages/admin/Overview"));
const AdminProjectsList = lazy(() => import("@/pages/admin/ProjectsList"));
const AdminProjectEditor = lazy(() => import("@/pages/admin/ProjectEditor"));
const AdminBlogList = lazy(() => import("@/pages/admin/BlogList"));
const AdminBlogEditor = lazy(() => import("@/pages/admin/BlogEditor"));
const AdminExperience = lazy(() => import("@/pages/admin/ExperienceAdmin"));
const AdminEducation = lazy(() => import("@/pages/admin/EducationAdmin"));
const AdminSkills = lazy(() => import("@/pages/admin/SkillsAdmin"));
const AdminTestimonials = lazy(() => import("@/pages/admin/TestimonialsAdmin"));
const AdminResume = lazy(() => import("@/pages/admin/ResumeAdmin"));
const AdminMedia = lazy(() => import("@/pages/admin/MediaAdmin"));
const AdminSeo = lazy(() => import("@/pages/admin/SeoAdmin"));
const AdminSettings = lazy(() => import("@/pages/admin/SettingsAdmin"));
const AdminContent = lazy(() => import("@/pages/admin/ContentAdmin"));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);
  return null;
}

function RouteFallback() {
  return (
    <div
      className="min-h-[60vh] grid place-items-center text-[13px] text-[var(--color-muted)]"
      role="status"
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">Loading…</span>
      <span aria-hidden className="h-2 w-2 animate-pulse rounded-full bg-[var(--color-accent)]" />
    </div>
  );
}

function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-md focus:bg-[var(--color-text)] focus:px-3 focus:py-2 focus:text-[var(--color-bg)]"
      >
        Skip to content
      </a>
      <NoiseOverlay />
      <CursorFollower />
      <ReadingProgress />
      <Navbar />
      <main id="main" className="pt-[88px] md:pt-[104px]">
        {children}
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  useLenis();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  if (isAdmin) {
    return (
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/admin/*" element={<AdminLayout />}>
            <Route index element={<AdminOverview />} />
            <Route path="overview" element={<AdminOverview />} />
            <Route path="projects" element={<AdminProjectsList />} />
            <Route path="projects/new" element={<AdminProjectEditor />} />
            <Route path="projects/:id" element={<AdminProjectEditor />} />
            <Route path="blog" element={<AdminBlogList />} />
            <Route path="blog/new" element={<AdminBlogEditor />} />
            <Route path="blog/:id" element={<AdminBlogEditor />} />
            <Route path="experience" element={<AdminExperience />} />
            <Route path="education" element={<AdminEducation />} />
            <Route path="skills" element={<AdminSkills />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="resume" element={<AdminResume />} />
            <Route path="media" element={<AdminMedia />} />
            <Route path="seo" element={<AdminSeo />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="content" element={<AdminContent />} />
          </Route>
        </Routes>
      </Suspense>
    );
  }

  return (
    <PublicShell>
      <ScrollToTop />
      <AnimatePresence mode="wait" initial={false}>
        <PageTransition key={location.pathname}>
          <Suspense fallback={<RouteFallback />}>
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/work" element={<Work />} />
              <Route path="/projects/:slug" element={<ProjectPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/resume" element={<Resume />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </PageTransition>
      </AnimatePresence>
    </PublicShell>
  );
}
