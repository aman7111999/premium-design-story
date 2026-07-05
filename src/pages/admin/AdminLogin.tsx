import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth, useIsAdmin } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export default function AdminLogin() {
  const { user, loading, signIn } = useAuth();
  const { data: isAdmin, isLoading: roleLoading } = useIsAdmin();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  if (loading) return <FullscreenSpinner />;
  if (user && !roleLoading) {
    if (isAdmin) return <Navigate to="/admin/overview" replace />;
    return (
      <div className="min-h-screen grid place-items-center bg-[var(--color-paper)] p-6">
        <div className="max-w-md text-center space-y-4">
          <h1 className="font-display text-3xl">Not an admin</h1>
          <p className="text-[var(--color-muted)]">
            You're signed in as <strong>{user.email}</strong> but this account has no admin role.
          </p>
          <p className="text-sm text-[var(--color-muted)]">
            Ask an existing admin to grant the <code>admin</code> role to your user in the <code>user_roles</code> table.
          </p>
        </div>
      </div>
    );
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await signIn(email, password);
    setBusy(false);
    if (error) toast.error(error);
    else {
      toast.success("Signed in");
      nav("/admin/overview");
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-[var(--color-paper)] p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-xl border border-hairline bg-white p-8 shadow-sm">
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
            <span className="text-xs uppercase tracking-widest text-[var(--color-muted)]">Admin</span>
          </div>
          <h1 className="font-display text-3xl">Sign in</h1>
          <p className="mt-2 text-sm text-[var(--color-muted)]">Access the portfolio CMS.</p>
        </div>
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button type="submit" disabled={busy} className="w-full">
            {busy ? <Loader2 className="animate-spin" /> : "Sign in"}
          </Button>
        </div>
      </form>
    </div>
  );
}

function FullscreenSpinner() {
  return (
    <div className="min-h-screen grid place-items-center">
      <Loader2 className="animate-spin text-[var(--color-muted)]" />
    </div>
  );
}
