
-- Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Project access settings (single row)
CREATE TABLE public.project_access_settings (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  enabled BOOLEAN NOT NULL DEFAULT true,
  password_hash TEXT,
  password_version INT NOT NULL DEFAULT 1,
  session_duration_hours INT NOT NULL DEFAULT 24,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID
);

-- No grants to anon/authenticated. Only service_role reads/writes the hash.
GRANT ALL ON public.project_access_settings TO service_role;

ALTER TABLE public.project_access_settings ENABLE ROW LEVEL SECURITY;

-- No policies for anon/authenticated → no access. Service role bypasses RLS.
-- Allow authenticated admins to read status metadata via SECURITY DEFINER function only.

INSERT INTO public.project_access_settings (id, enabled, password_version, session_duration_hours)
VALUES (1, true, 1, 24)
ON CONFLICT (id) DO NOTHING;

-- Rate-limit attempts (persistent, keyed by hashed identifier)
CREATE TABLE public.project_access_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key_hash TEXT NOT NULL,
  success BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ON public.project_access_attempts (key_hash, created_at);

GRANT ALL ON public.project_access_attempts TO service_role;
ALTER TABLE public.project_access_attempts ENABLE ROW LEVEL SECURITY;
-- no anon/authenticated policies → server-only

-- Status function: returns non-sensitive info about whether protection is configured.
CREATE OR REPLACE FUNCTION public.get_project_access_status()
RETURNS TABLE (enabled BOOLEAN, configured BOOLEAN, session_duration_hours INT, password_version INT, updated_at TIMESTAMPTZ)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT enabled, (password_hash IS NOT NULL) AS configured, session_duration_hours, password_version, updated_at
  FROM public.project_access_settings
  WHERE id = 1
$$;

REVOKE ALL ON FUNCTION public.get_project_access_status() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_project_access_status() TO anon, authenticated;

-- Public projects index view — preview fields only
CREATE OR REPLACE VIEW public.public_projects_index
WITH (security_invoker = true) AS
SELECT id, slug, title, category, short_description, thumbnail_url, featured, published, sort_order, tags
FROM public.projects
WHERE published = true;

GRANT SELECT ON public.public_projects_index TO anon, authenticated;

-- Tighten projects table: revoke anon read of full row (contains protected fields).
-- Drop the old public SELECT policy and re-create only for authenticated admins.
DROP POLICY IF EXISTS "Public reads published projects" ON public.projects;

-- Only admins can read the full projects table directly (via authenticated role).
CREATE POLICY "Admins read all projects" ON public.projects
FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Ensure anon has no direct table SELECT
REVOKE SELECT ON public.projects FROM anon;

-- Updated-at trigger
DROP TRIGGER IF EXISTS trg_project_access_settings_updated_at ON public.project_access_settings;
CREATE TRIGGER trg_project_access_settings_updated_at
BEFORE UPDATE ON public.project_access_settings
FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
