import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ReadingProgress } from "@/components/ReadingProgress";
import { PageTransition } from "@/components/PageTransition";
import { CursorFollower } from "@/components/CursorFollower";
import { NoiseOverlay } from "@/components/BackgroundFX";
import { useLenis } from "@/lib/lenis";
import Home from "@/pages/Home";
import Work from "@/pages/Work";
import ProjectPage from "@/pages/Project";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/NotFound";
import AdminLayout from "@/pages/admin/AdminLayout";
import AdminOverview from "@/pages/admin/Overview";
import AdminProjectsList from "@/pages/admin/ProjectsList";
import AdminProjectEditor from "@/pages/admin/ProjectEditor";
import AdminBlogList from "@/pages/admin/BlogList";
import AdminBlogEditor from "@/pages/admin/BlogEditor";
import AdminExperience from "@/pages/admin/ExperienceAdmin";
import AdminEducation from "@/pages/admin/EducationAdmin";
import AdminSkills from "@/pages/admin/SkillsAdmin";
import AdminTestimonials from "@/pages/admin/TestimonialsAdmin";
import AdminResume from "@/pages/admin/ResumeAdmin";
import AdminMedia from "@/pages/admin/MediaAdmin";
import AdminSeo from "@/pages/admin/SeoAdmin";
import AdminSettings from "@/pages/admin/SettingsAdmin";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);
  return null;
}

function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded focus:bg-[var(--color-ink)] focus:px-3 focus:py-2 focus:text-[var(--color-paper)]"
      >
        Skip to content
      </a>
      <NoiseOverlay />
      <CursorFollower />
      <ReadingProgress />
      <Navbar />
      <main id="main" className="pt-16">
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
      <Routes>
        <Route path="/admin/*" element={<AdminLayout />}>
          <Route index element={<AdminOverview />} />
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
        </Route>
      </Routes>
    );
  }

  return (
    <PublicShell>
      <ScrollToTop />
      <AnimatePresence mode="wait" initial={false}>
        <PageTransition key={location.pathname}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/work" element={<Work />} />
            <Route path="/projects/:slug" element={<ProjectPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PageTransition>
      </AnimatePresence>
    </PublicShell>
  );
}
