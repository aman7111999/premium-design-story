import { Helmet } from "react-helmet-async";
import { site } from "./content";

type Props = {
  title: string;
  description?: string;
  path: string;
  ogType?: "website" | "article";
  jsonLd?: Record<string, unknown>;
};

export function Seo({ title, description, path, ogType = "website", jsonLd }: Props) {
  const fullTitle = title.includes(site.name) ? title : `${title} — ${site.name}`;
  const desc = description ?? site.tagline;
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={path} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={path} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      {jsonLd ? (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      ) : null}
    </Helmet>
  );
}
