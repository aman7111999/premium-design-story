
CREATE TABLE public.content_blocks (
  key text PRIMARY KEY,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.content_blocks TO anon, authenticated;
GRANT ALL ON public.content_blocks TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.content_blocks TO authenticated;

ALTER TABLE public.content_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public reads content blocks" ON public.content_blocks
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins write content blocks" ON public.content_blocks
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER content_blocks_updated
  BEFORE UPDATE ON public.content_blocks
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- Seed defaults
INSERT INTO public.content_blocks (key, data) VALUES
('nav', jsonb_build_object(
  'links', jsonb_build_array(
    jsonb_build_object('label','About','to','/about'),
    jsonb_build_object('label','Projects','to','/work'),
    jsonb_build_object('label','Blog','to','/blog')
  ),
  'cta_label','Let''s Talk',
  'cta_to','/contact',
  'role_line','Product Designer'
)),
('footer', jsonb_build_object(
  'copyright_suffix','All Right Reserved',
  'back_to_top_label','Top'
)),
('hero', jsonb_build_object(
  'available_label','Available for Projects',
  'headline_before','Meet the',
  'headline_accent','Expert',
  'headline_after','Product Designer',
  'subline','I focus on delivering seamless navigation, responsive layouts, and pixel-perfect designs — from 0→1 product to launch.',
  'cta_label','View Projects',
  'cta_to','/work',
  'brands', jsonb_build_array('Figma','Framer','Webflow','Linear','Notion'),
  'tools', jsonb_build_array(
    jsonb_build_object('icon','Figma','tint','accent','pos', jsonb_build_object('top','6%','left','-14%')),
    jsonb_build_object('icon','Diamond','tint','text','pos', jsonb_build_object('top','18%','right','-14%')),
    jsonb_build_object('icon','Shield','tint','text','pos', jsonb_build_object('top','48%','right','-18%')),
    jsonb_build_object('icon','Framer','tint','accent','pos', jsonb_build_object('top','56%','left','-16%')),
    jsonb_build_object('icon','PenTool','tint','text','pos', jsonb_build_object('bottom','12%','left','-8%'))
  ),
  'badge_text','OFFICIAL FRAMER PARTNER • CREATOR •'
)),
('home_featured', jsonb_build_object(
  'eyebrow','Selected Work',
  'heading_line1','Projects that shipped &',
  'heading_line2','moved the needle.',
  'view_all_label','View all projects',
  'view_all_to','/work'
)),
('home_experience', jsonb_build_object(
  'eyebrow','Experience',
  'heading_line1','A decade of shipping',
  'heading_line2','thoughtful product work.'
)),
('home_stats', jsonb_build_object(
  'eyebrow','About',
  'heading_line1','Designing Websites that',
  'heading_accent','Inspire & Convert',
  'items', jsonb_build_array(
    jsonb_build_object('v','48+','l','Projects Done'),
    jsonb_build_object('v','90%','l','Client Retention'),
    jsonb_build_object('v','110%','l','Avg. Conversion')
  ),
  'body','I''m {name} — a product designer helping founders and teams ship digital experiences that people remember. Six years of pixel-craft, motion, and shipping.',
  'quote','Design is the bridge between a problem and a product people can love.'
)),
('home_testimonials', jsonb_build_object(
  'eyebrow','Kind Words',
  'heading_accent','Loved',
  'heading_line1','by designers & teams',
  'heading_line2','around the world.'
)),
('home_faq', jsonb_build_object(
  'eyebrow','FAQ',
  'heading_line1','Commonly',
  'heading_accent','Asked',
  'heading_line2','Questions',
  'subline','Answers to what people ask before we start. Have another? Ping me.',
  'items', jsonb_build_array(
    jsonb_build_object('q','What kind of projects do you take on?','a','0→1 product design, marketing sites, Framer builds, and design systems for founders and small teams.'),
    jsonb_build_object('q','How long does a typical project take?','a','A landing site: 2–3 weeks. A full product redesign: 6–10 weeks depending on scope.'),
    jsonb_build_object('q','Do you work with existing teams?','a','Yes — I embed with product & engineering, running design sprints, reviews, and shipping polished handoff.'),
    jsonb_build_object('q','What''s your pricing model?','a','Fixed-fee per project or a weekly retainer. Ballpark shared after a short discovery call.'),
    jsonb_build_object('q','Can you build the site too?','a','Absolutely — Framer, Webflow, or React/Tailwind. Design and dev under one roof.')
  )
)),
('home_cta', jsonb_build_object(
  'heading_line1','Let''s',
  'heading_accent','Build',
  'heading_line2','Something Amazing!',
  'subline','Ready to elevate your brand with stunning, user-friendly design? Get started today and bring your vision to life!',
  'cta_label','Start New Project'
)),
('about_hero', jsonb_build_object(
  'badge','About · Chapter 01',
  'heading_before','A designer who',
  'heading_accent','listens',
  'heading_after','before he draws.',
  'meta', jsonb_build_array(
    jsonb_build_object('k','Based in','v','__location__'),
    jsonb_build_object('k','Currently','v','Open to briefs'),
    jsonb_build_object('k','Years','v','__years__'),
    jsonb_build_object('k','Discipline','v','Product · Brand')
  ),
  'bio_eyebrow','Prologue',
  'say_hello','Say hello'
)),
('about_timeline', jsonb_build_object(
  'badge','02 · Timeline',
  'heading','A path built one decision at a time.',
  'subline','Roles, studies, and quiet inflection points — animated as you read.'
)),
('about_experience', jsonb_build_object(
  'badge','03 · Experience',
  'heading','The rooms I''ve worked in.',
  'subline','Expand a card to read the highlights, wins, and lessons carried forward.'
)),
('about_education', jsonb_build_object(
  'badge','04 · Education',
  'heading','Where the fundamentals were forged.'
)),
('about_tools', jsonb_build_object(
  'badge','05 · Tools',
  'heading','The instruments in the studio.'
)),
('about_philosophy', jsonb_build_object(
  'badge','06 · Design Philosophy',
  'heading','Four beliefs that outrank every trend.',
  'items', jsonb_build_array(
    jsonb_build_object('k','Clarity over cleverness','v','The best interfaces disappear. Craft is what you remove.'),
    jsonb_build_object('k','Systems, not screens','v','Every component earns its place through reuse and restraint.'),
    jsonb_build_object('k','Type is the design','v','Rhythm, scale, and hierarchy do more than any illustration.'),
    jsonb_build_object('k','Motion with meaning','v','Animation clarifies cause and effect. Never decoration.')
  )
)),
('about_working_style', jsonb_build_object(
  'badge','07 · Working Style',
  'heading','How the sausage gets made.',
  'items', jsonb_build_array(
    jsonb_build_object('k','Deep work, mornings','v','First 4 hours are always for the hardest problem.'),
    jsonb_build_object('k','Prototype in public','v','Ship the sketch. Real feedback beats rehearsed decks.'),
    jsonb_build_object('k','Async by default','v','Written thinking scales; meetings compound entropy.'),
    jsonb_build_object('k','Ship weekly','v','Small, honest increments over quarterly reveals.')
  )
)),
('about_books', jsonb_build_object(
  'badge','08 · Reading Shelf',
  'heading','Books that keep coming back.',
  'items', jsonb_build_array(
    jsonb_build_object('title','The Design of Everyday Things','author','Don Norman'),
    jsonb_build_object('title','Refactoring UI','author','Adam Wathan & Steve Schoger'),
    jsonb_build_object('title','Shape Up','author','Ryan Singer'),
    jsonb_build_object('title','Thinking in Systems','author','Donella Meadows'),
    jsonb_build_object('title','A Pattern Language','author','Christopher Alexander'),
    jsonb_build_object('title','The Elements of Typographic Style','author','Robert Bringhurst')
  )
)),
('about_values', jsonb_build_object(
  'badge','09 · Values',
  'heading','The compass, not the map.',
  'items', jsonb_build_array(
    jsonb_build_object('k','Craft','v','Details are the design.'),
    jsonb_build_object('k','Honesty','v','Say what the product actually does.'),
    jsonb_build_object('k','Curiosity','v','The best answer is often the next question.'),
    jsonb_build_object('k','Generosity','v','Teach what you learn.')
  )
)),
('about_fun_facts', jsonb_build_object(
  'badge','10 · Off the Clock',
  'heading','A few unimportant, telling things.',
  'items', jsonb_build_array(
    'Collects mechanical keyboards but only uses one.',
    'Brews pour-over on a 1:16 ratio, no exceptions.',
    'Has read every issue of Offscreen Magazine.',
    'Once redesigned a menu at a café — for free.',
    'Owns 12 notebooks. Uses one at a time.'
  )
)),
('contact_page', jsonb_build_object(
  'eyebrow','Say hello',
  'heading_before','Let''s make',
  'heading_accent','something',
  'heading_after','.',
  'copy_email_label','Copy email',
  'copied_label','Copied',
  'form_labels', jsonb_build_object(
    'name','Name','email','Email','message','Message',
    'send','Send message','sending','Sending'
  ),
  'success_toast','Message sent — I''ll reply within 2 business days.',
  'elsewhere_label','Elsewhere',
  'based_in_label','Based in'
));
