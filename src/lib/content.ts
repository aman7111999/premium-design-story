import site from "../../content/site.json";
import experience from "../../content/experience.json";
import skills from "../../content/skills.json";
import testimonials from "../../content/testimonials.json";
import projectIndex from "../../content/projects/_index.json";

export type Metric = { label: string; value: string };
export type ProjectSection = { heading: string; body: string };
export type Project = {
  slug: string;
  title: string;
  company: string;
  role: string;
  duration: string;
  category: string;
  cover: string;
  summary: string;
  team: string[];
  timeline: string;
  constraints: string[];
  metrics: Metric[];
  sections: ProjectSection[];
  featured: boolean;
  order: number;
};

// Eagerly import every project JSON at build time.
const projectFiles = import.meta.glob<{ default: Omit<Project, "featured" | "order"> }>(
  "../../content/projects/*.json",
  { eager: true },
);

const indexMap = new Map(
  (projectIndex as { slug: string; featured: boolean; order: number }[]).map((p) => [p.slug, p]),
);

export const projects: Project[] = Object.entries(projectFiles)
  .filter(([path]) => !path.endsWith("_index.json"))
  .map(([, mod]) => {
    const data = mod.default;
    const meta = indexMap.get(data.slug) ?? { featured: false, order: 999 };
    return { ...data, featured: meta.featured, order: meta.order };
  })
  .sort((a, b) => a.order - b.order);

export const featuredProjects = projects.filter((p) => p.featured);

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getAdjacentProjects(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  if (i < 0) return { prev: undefined, next: undefined };
  return {
    prev: i > 0 ? projects[i - 1] : projects[projects.length - 1],
    next: i < projects.length - 1 ? projects[i + 1] : projects[0],
  };
}

export { site, experience, skills, testimonials };
export type Experience = (typeof experience)[number];
export type Skill = (typeof skills)[number];
export type Testimonial = (typeof testimonials)[number];
