import { Link } from "react-router-dom";
import { Seo } from "@/lib/seo";

export default function NotFound() {
  return (
    <>
      <Seo title="Not found" description="This page doesn't exist." path="/404" />
      <section className="container-page flex min-h-[70vh] flex-col items-start justify-center pt-24">
        <p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">404</p>
        <h1 className="display-hero mt-4 text-6xl md:text-9xl">Lost.</h1>
        <p className="mt-6 max-w-md text-lg text-[var(--color-muted)]">
          The page you're looking for either moved or never existed. Let's find our way back.
        </p>
        <Link to="/" className="mt-10 inline-flex link-underline text-lg">
          ← Return home
        </Link>
      </section>
    </>
  );
}
