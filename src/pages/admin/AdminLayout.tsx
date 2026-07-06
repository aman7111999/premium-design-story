import { NavLink, Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth, useIsAdmin } from "@/lib/auth";
import { Loader2, LayoutDashboard, FolderKanban, Newspaper, Briefcase, GraduationCap, Sparkles, MessageSquareQuote, FileText, Image as ImageIcon, Search, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import AdminLogin from "./AdminLogin";

const nav = [
  { to: "/admin/overview", label: "Overview", icon: LayoutDashboard },
  { to: "/admin/projects", label: "Projects", icon: FolderKanban },
  { to: "/admin/blog", label: "Blog", icon: Newspaper },
  { to: "/admin/experience", label: "Experience", icon: Briefcase },
  { to: "/admin/skills", label: "Skills", icon: Sparkles },
  { to: "/admin/education", label: "Education", icon: GraduationCap },
  { to: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { to: "/admin/resume", label: "Résumé", icon: FileText },
  { to: "/admin/media", label: "Media", icon: ImageIcon },
  { to: "/admin/seo", label: "SEO", icon: Search },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout() {
  const { user, loading, signOut } = useAuth();
  const { data: isAdmin, isLoading: roleLoading } = useIsAdmin();
  const loc = useLocation();

  if (loading || (user && roleLoading)) {
    return (
      <div className="min-h-screen grid place-items-center">
        <Loader2 className="animate-spin text-[var(--color-muted)]" />
      </div>
    );
  }
  if (!user) {
    if (loc.pathname === "/admin") return <AdminLogin />;
    return <Navigate to="/admin" state={{ from: loc }} replace />;
  }
  if (!isAdmin) {
    if (loc.pathname === "/admin") return <AdminAccessDenied email={user.email} />;
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="grid min-h-screen grid-cols-[260px_1fr]">
        <aside className="border-r border-hairline bg-white">
          <div className="flex h-16 items-center gap-2 px-6 border-b border-hairline">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
            <span className="font-display text-lg">CMS</span>
          </div>
          <nav className="p-3 space-y-0.5">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/admin/overview"}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                    isActive ? "bg-[var(--color-ink)] text-[var(--color-paper)]" : "text-[var(--color-ink)]/80 hover:bg-neutral-100"
                  }`
                }
              >
                <item.icon size={16} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
          <div className="mt-auto p-3 border-t border-hairline text-xs text-[var(--color-muted)]">
            <p className="px-3 pb-2 truncate">{user.email}</p>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={async () => { await signOut(); toast.success("Signed out"); }}
            >
              <LogOut size={14} /> Sign out
            </Button>
          </div>
        </aside>
        <main className="min-w-0">
          <div className="p-8 max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

function AdminAccessDenied({ email }: { email?: string }) {
  return (
    <div className="min-h-screen grid place-items-center bg-[var(--color-paper)] p-6">
      <div className="max-w-md text-center space-y-4">
        <h1 className="font-display text-3xl">Not an admin</h1>
        <p className="text-[var(--color-muted)]">
          You're signed in as <strong>{email}</strong> but this account has no admin role.
        </p>
        <p className="text-sm text-[var(--color-muted)]">
          Grant the <code>admin</code> role to this user in the <code>user_roles</code> table.
        </p>
      </div>
    </div>
  );
}
