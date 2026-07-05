
-- Roles infrastructure
CREATE TYPE public.app_role AS ENUM ('admin', 'editor');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can read own roles" ON public.user_roles
FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins manage roles" ON public.user_roles
FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Shared updated_at trigger
CREATE OR REPLACE FUNCTION public.tg_set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- PROJECTS
CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  short_description text,
  overview text,
  problem_statement text,
  research text,
  design_process text,
  solution text,
  outcome text,
  learnings text,
  role text,
  duration text,
  company text,
  tools text[] NOT NULL DEFAULT '{}',
  tags text[] NOT NULL DEFAULT '{}',
  category text,
  timeline text,
  thumbnail_url text,
  gallery jsonb NOT NULL DEFAULT '[]'::jsonb,
  links jsonb NOT NULL DEFAULT '[]'::jsonb,
  metrics jsonb NOT NULL DEFAULT '[]'::jsonb,
  featured boolean NOT NULL DEFAULT false,
  published boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.projects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads published projects" ON public.projects
  FOR SELECT TO anon, authenticated USING (published = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins write projects" ON public.projects
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER projects_updated BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- EXPERIENCE
CREATE TABLE public.experience (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role text NOT NULL,
  company text NOT NULL,
  location text,
  start_date text,
  end_date text,
  description text,
  highlights text[] NOT NULL DEFAULT '{}',
  sort_order int NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.experience TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.experience TO authenticated;
GRANT ALL ON public.experience TO service_role;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads experience" ON public.experience
  FOR SELECT TO anon, authenticated USING (published = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins write experience" ON public.experience
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER experience_updated BEFORE UPDATE ON public.experience
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- EDUCATION
CREATE TABLE public.education (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution text NOT NULL,
  degree text,
  field text,
  start_date text,
  end_date text,
  description text,
  sort_order int NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.education TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.education TO authenticated;
GRANT ALL ON public.education TO service_role;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads education" ON public.education
  FOR SELECT TO anon, authenticated USING (published = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins write education" ON public.education
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER education_updated BEFORE UPDATE ON public.education
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- SKILLS
CREATE TABLE public.skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_name text NOT NULL,
  name text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.skills TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.skills TO authenticated;
GRANT ALL ON public.skills TO service_role;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads skills" ON public.skills FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins write skills" ON public.skills FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER skills_updated BEFORE UPDATE ON public.skills FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- TESTIMONIALS
CREATE TABLE public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author text NOT NULL,
  role text,
  company text,
  quote text NOT NULL,
  avatar_url text,
  sort_order int NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.testimonials TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.testimonials TO authenticated;
GRANT ALL ON public.testimonials TO service_role;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads testimonials" ON public.testimonials FOR SELECT TO anon, authenticated
  USING (published = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins write testimonials" ON public.testimonials FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER testimonials_updated BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- BLOGS
CREATE TABLE public.blogs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text,
  cover_url text,
  body text,
  tags text[] NOT NULL DEFAULT '{}',
  published boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.blogs TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blogs TO authenticated;
GRANT ALL ON public.blogs TO service_role;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads published blogs" ON public.blogs FOR SELECT TO anon, authenticated
  USING (published = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins write blogs" ON public.blogs FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER blogs_updated BEFORE UPDATE ON public.blogs FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- SEO SETTINGS
CREATE TABLE public.seo_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  route text NOT NULL UNIQUE,
  title text,
  description text,
  keywords text[] NOT NULL DEFAULT '{}',
  og_image_url text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.seo_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.seo_settings TO authenticated;
GRANT ALL ON public.seo_settings TO service_role;
ALTER TABLE public.seo_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads seo" ON public.seo_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins write seo" ON public.seo_settings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER seo_updated BEFORE UPDATE ON public.seo_settings FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- SITE SETTINGS (single-row config: name, tagline, resume url, social, profile pic)
CREATE TABLE public.site_settings (
  id int PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  name text,
  tagline text,
  bio text,
  email text,
  location text,
  profile_image_url text,
  resume_url text,
  socials jsonb NOT NULL DEFAULT '[]'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads site settings" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins write site settings" ON public.site_settings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER site_settings_updated BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

INSERT INTO public.site_settings (id) VALUES (1) ON CONFLICT DO NOTHING;

-- Lock down contact_inquiries reads to admins (currently insert-only was correct; add admin SELECT)
CREATE POLICY "Admins read inquiries" ON public.contact_inquiries FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
GRANT SELECT ON public.contact_inquiries TO authenticated;
