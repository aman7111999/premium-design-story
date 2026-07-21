import { NavLink, Navigate, Outlet, useLocation, Link } from "react-router-dom";
import { useAuth, useIsAdmin } from "@/lib/auth";
import {
  Loader2,
  LayoutDashboard,
  FolderKanban,
  Newspaper,
  Briefcase,
  GraduationCap,
  Sparkles,
  MessageSquareQuote,
  FileText,
  Image as ImageIcon,
  Search,
  Settings,
  Type,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import AdminLogin from "./AdminLogin";
import { useEffect, useState } from "react";
import { clsx } from "clsx";

type NavItem = { to: string; label: string; icon: any };
const navGroups: { title: string; items: NavItem[] }[] = [
  {
    title: "Workspace",
    items: [{ to: "/admin/overview", label: "Overview", icon: LayoutDashboard }],
  },
  {
    title: "Content",
    items: [
      { to: "/admin/content", label: "Site content", icon: Type },
      { to: "/admin/projects", label: "Projects", icon: FolderKanban },
      { to: "/admin/blog", label: "Blog", icon: Newspaper },
      { to: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
    ],
  },
  {
    title: "Profile",
    items: [
      { to: "/admin/experience", label: "Experience", icon: Briefcase },
      { to: "/admin/education", label: "Education", icon: GraduationCap },
      { to: "/admin/skills", label: "Skills", icon: Sparkles },
      { to: "/admin/resume", label: "Résumé", icon: FileText },
    ],
  },
  {
    title: "System",
    items: [
      { to: "/admin/media", label: "Media", icon: ImageIcon },
      { to: "/admin/seo", label: "SEO", icon: Search },
      { to: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
];

export default function AdminLayout() {
  const { user, loading, signOut } = useAuth();
  const { data: isAdmin, isLoading: roleLoading } = useIsAdmin();
  const loc = useLocation();
  const [drawer, setDrawer] = useState(false);


  if (loading || (user && roleLoading)) {
    return (
      <div data-theme="light" className="min-h-screen grid place-items-center bg-neutral-50">
        <Loader2 className="animate-spin text-neutral-500" />
      </div>
    );
  }
  if (!user) {
    if (loc.pathname === "/admin")
      return (
        <div data-theme="light">
          <AdminLogin />
        </div>
      );
    return <Navigate to="/admin" state={{ from: loc }} replace />;
  }
  if (!isAdmin) {
    if (loc.pathname === "/admin")
      return (
        <div data-theme="light">
          <AdminAccessDenied email={user.email} />
        </div>
      );
    return <Navigate to="/admin" replace />;
  }

  const current =
    navGroups.flatMap((g) => g.items).find((n) => loc.pathname.startsWith(n.to))?.label ?? "Admin";

  return (
    <div data-theme="light" className="min-h-screen bg-neutral-50 text-neutral-900">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-[260px_1fr]">
        {/* Sidebar */}
        <aside
          className={clsx(
            "fixed inset-y-0 left-0 z-40 w-[260px] border-r border-neutral-200 bg-white transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
            drawer ? "translate-x-0 shadow-2xl" : "-translate-x-full",
          )}
        >
          <div className="flex h-16 items-center justify-between border-b border-neutral-200 px-5">
            <Link to="/admin/overview" className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />
              <span className="font-display text-base tracking-tight">CMS</span>
            </Link>
            <button
              className="lg:hidden text-neutral-500 hover:text-neutral-900"
              onClick={() => setDrawer(false)}
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>
          <nav className="flex h-[calc(100vh-4rem)] flex-col p-3">
            <div className="flex-1 space-y-5 overflow-y-auto pb-4">
              {navGroups.map((group) => (
                <div key={group.title}>
                  <p className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                    {group.title}
                  </p>
                  <div className="space-y-0.5">
                    {group.items.map((item) => (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.to === "/admin/overview"}
                        onClick={() => setDrawer(false)}
                        className={({ isActive }) =>
                          clsx(
                            "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                            isActive
                              ? "bg-neutral-900 text-white"
                              : "text-neutral-700 hover:bg-neutral-100",
                          )
                        }
                      >
                        <item.icon size={15} />
                        <span>{item.label}</span>
                      </NavLink>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-auto border-t border-neutral-200 pt-3">
              <div className="flex items-center gap-2 rounded-md bg-neutral-100 px-3 py-2">
                <div className="grid h-7 w-7 place-items-center rounded-full bg-neutral-900 text-[11px] font-medium text-white">
                  {(user.email?.[0] ?? "?").toUpperCase()}
                </div>
                <p className="min-w-0 flex-1 truncate text-xs text-neutral-600">{user.email}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 w-full justify-start text-neutral-600 hover:text-neutral-900"
                onClick={async () => {
                  await signOut();
                  toast.success("Signed out");
                }}
              >
                <LogOut size={14} /> Sign out
              </Button>
            </div>
          </nav>
        </aside>

        {/* Backdrop for mobile drawer */}
        {drawer && (
          <div
            className="fixed inset-0 z-30 bg-black/30 lg:hidden"
            onClick={() => setDrawer(false)}
            aria-hidden
          />
        )}

        {/* Main column */}
        <div className="flex min-w-0 flex-col">
          {/* Sticky top bar */}
          <div className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-neutral-200 bg-white/85 px-4 backdrop-blur lg:px-8">
            <button
              className="rounded-md p-2 text-neutral-600 hover:bg-neutral-100 lg:hidden"
              onClick={() => setDrawer(true)}
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>
            <p className="font-display text-lg text-neutral-900">{current}</p>
            <div className="ml-auto flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/" target="_blank" className="text-neutral-600 hover:text-neutral-900">
                  <ExternalLink size={14} /> View site
                </Link>
              </Button>
            </div>
          </div>

          <main className="min-w-0 flex-1 px-4 py-8 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

function AdminAccessDenied({ email }: { email?: string }) {
  return (
    <div className="min-h-screen grid place-items-center bg-neutral-50 p-6">
      <div className="max-w-md space-y-4 text-center">
        <h1 className="font-display text-3xl text-neutral-900">Not an admin</h1>
        <p className="text-neutral-600">
          You're signed in as <strong>{email}</strong> but this account has no admin role.
        </p>
        <p className="text-sm text-neutral-500">
          Grant the <code>admin</code> role to this user in the <code>user_roles</code> table.
        </p>
      </div>
    </div>
  );
}
