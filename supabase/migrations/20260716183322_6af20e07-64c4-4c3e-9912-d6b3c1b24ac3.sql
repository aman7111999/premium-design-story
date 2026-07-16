
UPDATE site_settings SET location = 'Mumbai, India' WHERE id = 1;

DELETE FROM experience;
INSERT INTO experience (role, company, location, start_date, end_date, description, highlights, sort_order, published) VALUES
('Assistant Manager, Product Design', 'Motilal Oswal Financial Services', 'Mumbai, India', '2025-08-01', NULL,
 'Spearheading the end-to-end UX revamp of the Riise investment platform — transforming a cluttered ecosystem into a premium, hyper-personalized experience across Stocks, F&O, Mutual Funds, US Stocks, and Algo Trading.',
 ARRAY[
   'Redesigned the dynamic homepage architecture to contextually prioritize financial products based on user behavior, lifecycle stage, and portfolio activity — reducing cognitive load and increasing feature discoverability.',
   'Led the 0-to-1 design of ''Screener,'' a new product line — defining foundational architecture, stock comparison modules, and landing pages with end-to-end ownership from concept to developer handoff.',
   'Architecting ''Mira AI,'' a unified AI ecosystem integrating Mo Genie (AI support), a Research Assistant, and portfolio analysis with intelligent recommendations to streamline investment decision-making.',
   'Partner closely with engineering, product, and compliance stakeholders to ship scalable, SEBI-compliant UX at pace across multiple concurrent workstreams.'
 ], 1, true),
('Product Designer', 'Trinkerr', 'Bangalore, India', '2023-02-01', '2025-04-30',
 'Designed end-to-end investing experiences for a SEBI-registered advisory platform, focused on data storytelling, adoption, and cross-platform consistency.',
 ARRAY[
   'Designed end-to-end SEBI-registered advisory flows, driving a 30% increase in platform adoption.',
   'Revamped the Portfolio Health Report and Feed experience — leveraging data storytelling and optimized information hierarchy — for a 60% uplift in engagement and conversion.',
   'Co-architected the TIQS 2.0 Design System, standardizing tokens and accessibility guidelines across iOS and Android, cutting design-to-development handoff time by 30%.'
 ], 2, true),
('Associate Product Designer', 'Trinkerr', 'Bangalore, India', '2022-01-01', '2023-02-28',
 'Owned foundational investment features — portfolio, watchlist, and transaction flows — with a strong research and usability focus.',
 ARRAY[
   'Redesigned the portfolio import flow using UX optimization and progressive disclosure, improving successful import completion rates by 90%.',
   'Designed core investment features across watchlist, portfolio tracking, and transaction flows, contributing to a 60% increase in feature adoption.',
   'Conducted usability testing, user interviews, and heuristic evaluations, reducing mobile platform UI inconsistencies by 40%.'
 ], 3, true);

DELETE FROM education;
INSERT INTO education (institution, degree, field, start_date, end_date, description, sort_order, published) VALUES
('Masai School', 'Full Stack UI/UX Designer', 'Product Design & Frontend Development', '2021-06-01', '2022-01-31', 'Bengaluru, India', 1, true),
('Thakur College of Engineering & Technology', 'Bachelor of Engineering', 'Mechanical Engineering', '2018-08-01', '2022-06-30', 'Mumbai, India', 2, true);
