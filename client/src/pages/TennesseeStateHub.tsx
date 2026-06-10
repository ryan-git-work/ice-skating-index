import { Layout } from "@/components/Layout";
import { useHead } from "@/hooks/use-head";
import { Link } from "wouter";
import { Separator } from "@/components/ui/separator";
import { RinkCard } from "@/components/RinkCard";
import { rinks, getRinksByState } from "@/lib/data";
import { EmailOptIn } from "@/components/EmailOptIn";
import { LastVerified } from "@/components/LastVerified";
import { MapPin, CheckCircle, XCircle, Calendar, ArrowRight } from "lucide-react";
import { buildRinkItemList } from "@/lib/seo";

const RINK_SLUGS = {
  centennial: "centennial-sportsplex-nashville-tn",
  bellevue: "ford-ice-center-bellevue-nashville-tn",
  antioch: "ford-ice-center-antioch-antioch-tn",
  clarksville: "ford-ice-center-clarksville-clarksville-tn",
  iceChalet: "ice-chalet-knoxville-tn",
  coolSports: "cool-sports-home-of-the-icearium-knoxville-tn",
  ober: "ober-mountain-indoor-ice-skating-gatlinburg-tn",
  garyForce: "gary-force-acura-ice-arena-nolensville-tn",
};

function RinkLink({ slug, children }: { slug: string; children: React.ReactNode }) {
  return (
    <Link href={`/rink/${slug}`} className="text-primary hover:underline font-medium">
      {children}
    </Link>
  );
}

function CityLink({ slug, children }: { slug: string; children: React.ReactNode }) {
  return (
    <Link href={`/city/tn/${slug}`} className="text-primary hover:underline font-medium inline-flex items-center gap-1">
      {children} <ArrowRight className="h-3.5 w-3.5" />
    </Link>
  );
}

export default function TennesseeStateHub() {
  const tnRinks = getRinksByState("tn");

  useHead({
    title: "Ice Skating in Tennessee: Every Rink, Every City (2026 Guide)",
    description: "Every public ice skating rink in Tennessee \u2014 Nashville's four year-round rinks, Knoxville's Ice Chalet, Chattanooga's seasonal rink, and Memphis-adjacent options. Verified weekly.",
    ogTitle: "Ice Skating in Tennessee: Every Rink, Every City (2026 Guide)",
    ogDescription: "Every public ice skating rink in Tennessee \u2014 Nashville's four year-round rinks, Knoxville's Ice Chalet, Chattanooga's seasonal rink, and Memphis-adjacent options. Verified weekly.",
    canonicalPath: "/state/tn",
    structuredData: [buildRinkItemList(tnRinks, "/state/tn", "Ice Skating Rinks in Tennessee")],
  });

  return (
    <Layout>
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center text-sm text-muted-foreground mb-4 gap-2">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <span className="text-foreground font-medium">Tennessee</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            Ice Skating in Tennessee: Every Rink, Every City (2026 Guide)
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
            Tennessee isn&apos;t a winter sport powerhouse &mdash; but it has more ice than its reputation suggests. The state has six year-round indoor rinks (four of them in Middle Tennessee), one well-established figure skating facility in Knoxville, and a handful of seasonal outdoor rinks that open between November and February. This guide covers every operating rink in Tennessee, where it is, what it costs, and which city hub to visit for more detail.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">

          <aside className="lg:w-64 flex-shrink-0">
            <div className="sticky top-8">
              <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-4">On this page</h2>
              <nav className="space-y-2">
                {[
                  { id: "at-a-glance", label: "Tennessee at a glance" },
                  { id: "nashville", label: "Nashville & Middle TN" },
                  { id: "knoxville", label: "Knoxville & East TN" },
                  { id: "chattanooga", label: "Chattanooga & Southeast TN" },
                  { id: "memphis", label: "Memphis & West TN" },
                ].map(section => (
                  <a key={section.id} href={`#${section.id}`} className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1">
                    {section.label}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <div className="flex-1 max-w-3xl space-y-16">

            <section id="at-a-glance">
              <h2 className="font-serif text-2xl font-bold mb-6">Tennessee at a glance</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b-2 border-border">
                      <th className="text-left py-3 pr-4 font-semibold">City / Region</th>
                      <th className="text-left py-3 pr-4 font-semibold">Year-round rinks</th>
                      <th className="text-left py-3 pr-4 font-semibold">Seasonal</th>
                      <th className="text-left py-3 font-semibold">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4 font-medium">Nashville (Middle TN)</td>
                      <td className="py-3 pr-4 text-muted-foreground">4</td>
                      <td className="py-3 pr-4 text-muted-foreground">3</td>
                      <td className="py-3 text-muted-foreground">By far the most rinks in the state &mdash; Centennial Sportsplex plus three Ford Ice Centers (Bellevue, Antioch, Clarksville).</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4 font-medium">Knoxville (East TN)</td>
                      <td className="py-3 pr-4 text-muted-foreground">2</td>
                      <td className="py-3 pr-4 text-muted-foreground">1 (Holidays on Ice)</td>
                      <td className="py-3 text-muted-foreground">Ice Chalet is the longest-running rink in Tennessee. Strong figure skating community.</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4 font-medium">Chattanooga (East TN)</td>
                      <td className="py-3 pr-4 text-muted-foreground">0</td>
                      <td className="py-3 pr-4 text-muted-foreground">1</td>
                      <td className="py-3 text-muted-foreground">Ice on the Landing &mdash; outdoor seasonal rink at Finley Stadium. No year-round option.</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4 font-medium">Memphis (West TN)</td>
                      <td className="py-3 pr-4 text-muted-foreground">0</td>
                      <td className="py-3 pr-4 text-muted-foreground">0</td>
                      <td className="py-3 text-muted-foreground">No ice rink in Memphis itself. Mid-South Ice House (Olive Branch, MS) is the closest year-round option, ~25 min from downtown.</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4 font-medium">Tri-Cities (Bristol/Kingsport/Johnson City)</td>
                      <td className="py-3 pr-4 text-muted-foreground">0</td>
                      <td className="py-3 pr-4 text-muted-foreground">Varies</td>
                      <td className="py-3 text-muted-foreground">No confirmed year-round indoor rink.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <Separator />

            <section id="nashville">
              <h2 className="font-serif text-2xl font-bold mb-4">Nashville and Middle Tennessee</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Nashville is the heart of skating in Tennessee. Four year-round indoor rinks &mdash; <RinkLink slug={RINK_SLUGS.centennial}>Centennial Sportsplex</RinkLink> plus three <RinkLink slug={RINK_SLUGS.bellevue}>Ford Ice Centers</RinkLink> &mdash; three seasonal options (Smashville, Fountains at Gateway, Opryland), and the strongest learn-to-skate and freestyle infrastructure in the state.
                </p>
                <p>
                  The city also has <RinkLink slug={RINK_SLUGS.garyForce}>Gary Force Acura Ice Arena</RinkLink> in Nolensville and <RinkLink slug={RINK_SLUGS.ober}>Ober Mountain Indoor Ice Rink</RinkLink> in Gatlinburg, both offering year-round public skating for their respective communities.
                </p>
                <div className="mt-4">
                  <CityLink slug="nashville">Full Nashville guide</CityLink>
                </div>
              </div>
            </section>

            <Separator />

            <section id="knoxville">
              <h2 className="font-serif text-2xl font-bold mb-4">Knoxville and East Tennessee</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  <RinkLink slug={RINK_SLUGS.iceChalet}>Ice Chalet</RinkLink> on Lebanon Street is the established rink in Knoxville &mdash; daily public sessions, $9.50 admission plus $7.50 rental, and a strong figure skating program. It&apos;s the longest-running rink in Tennessee and serves as the hub for the local skating community.
                </p>
                <p>
                  Also in Knoxville, <RinkLink slug={RINK_SLUGS.coolSports}>Cool Sports (Home of the Icearium)</RinkLink> offers additional ice time for public skating and hockey programs in the western Knoxville area.
                </p>
                <p>
                  During the holiday season, downtown Knoxville also hosts Holidays on Ice (outdoor seasonal rink at Market Square / Krutch Park).
                </p>
                <div className="mt-4">
                  <CityLink slug="knoxville">Full Knoxville guide</CityLink>
                </div>
              </div>
            </section>

            <Separator />

            <section id="chattanooga">
              <h2 className="font-serif text-2xl font-bold mb-4">Chattanooga and Southeast Tennessee</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Chattanooga has no year-round indoor rink. Ice on the Landing at Finley Stadium (1826 Reggie White Blvd) is the only ice skating option &mdash; and it&apos;s seasonal (Nov 22 &ndash; Feb 1 in 2025&ndash;26). Tickets are $14 adult / $12 youth, with skates and a 60-minute session included.
                </p>
                <p>
                  For Chattanoogans who want regular ice time, the closest year-round options are in Knoxville (~1.5 hours north) or the Nashville-area rinks (~2 hours northwest).
                </p>
                <div className="mt-4">
                  <CityLink slug="chattanooga">Full Chattanooga guide</CityLink>
                </div>
              </div>
            </section>

            <Separator />

            <section id="memphis">
              <h2 className="font-serif text-2xl font-bold mb-4">Memphis and West Tennessee</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Memphis itself has no ice rink. The closest year-round option is Mid-South Ice House (10705 Ridgeway Industrial Dr, Olive Branch, MS) &mdash; about 25 minutes from downtown Memphis. There is no Tennessee-side rink within an hour of Memphis.
                </p>
                <p>
                  For Memphis residents wanting to skate in-state, the nearest Tennessee rinks are in Nashville (~3 hours east) or Clarksville (~2.5 hours northeast via I-24).
                </p>
                <div className="mt-4">
                  <CityLink slug="memphis">Full Memphis-area guide</CityLink>
                </div>
              </div>
            </section>

            <Separator />

            <section>
              <h2 className="font-serif text-2xl font-bold mb-6">All Tennessee Rinks</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tnRinks.map(rink => (
                  <RinkCard key={rink.id} rink={rink} />
                ))}
              </div>
            </section>

            <EmailOptIn cityName="Tennessee" />

            <LastVerified date="2026-05-23" />

          </div>
        </div>
      </div>
    </Layout>
  );
}
