import { Helmet } from "react-helmet-async";

type Props = {
  title: string;
  description?: string;
  path: string;
  ogType?: "website" | "article";
  jsonLd?: Record<string, unknown>;
  siteName?: string;
};

export function Seo({ title, description, path, ogType = "website", jsonLd, siteName = "Portfolio" }: Props) {
  const fullTitle = title.includes(siteName) ? title : `${title} — ${siteName}`;
  const desc = description ?? "";
  return (
    <Helmet>
      <title>{fullTitle}</title>
      {desc && <meta name="description" content={desc} />}
      <link rel="canonical" href={path} />
      <meta property="og:title" content={fullTitle} />
      {desc && <meta property="og:description" content={desc} />}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={path} />
      <meta name="twitter:title" content={fullTitle} />
      {desc && <meta name="twitter:description" content={desc} />}
      {jsonLd ? (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      ) : null}
    </Helmet>
  );
}
