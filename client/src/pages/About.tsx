import { Layout } from "@/components/Layout";
import { useHead } from "@/hooks/use-head";
import { LastVerified } from "@/components/LastVerified";
import { Mail } from "lucide-react";
import { buildWebPageSchema } from "@/lib/seo";

export default function About() {
  const description = "Why we built a verified ice skating directory — and how we keep every rink schedule, price, and detail current.";

  useHead({
    title: "About Ice Skating Index",
    description,
    canonicalPath: "/about",
    structuredData: [buildWebPageSchema("/about", "About Ice Skating Index", description, "AboutPage")],
  });

  return (
    <Layout>
      <div className="page-band border-b border-white/10">
        <div className="container mx-auto px-4 py-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            About Ice Skating Index
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="space-y-8 text-base leading-relaxed text-muted-foreground">
          <p>
            I built Ice Skating Index because every parent of a skater I know has
            the same problem: rink websites are stuck in 2007, schedules change
            without warning, and you can drive 45 minutes to a rink only to find
            it&apos;s closed for a private event. This site exists to fix that.
          </p>

          <p>
            Every rink in the index is verified against the operator&apos;s own
            source — their website, their calendar, their published prices. We
            update each rink page weekly. When something changes, we change it
            within 24 hours of finding out.
          </p>

          <p>
            We don&apos;t make money from rinks (yet). When we do, it will be from
            rinks paying to maintain their own listing and post their own
            real-time schedule updates — not from being recommended over a
            competitor. Recommendations stay editorial.
          </p>

          <p>
            If you find something wrong, email{" "}
            <a
              href="mailto:hello@iceskatingindex.com"
              className="text-primary hover:underline font-medium inline-flex items-center gap-1"
            >
              <Mail className="h-4 w-4" />
              hello@iceskatingindex.com
            </a>
            . If you run a rink and want to claim your listing, email the same
            address.
          </p>
        </div>

        <div className="mt-12 pt-8 border-t">
          <LastVerified date="2026-05-23" />
        </div>
      </div>
    </Layout>
  );
}
