import { Layout } from "@/components/Layout";
import { useHead } from "@/hooks/use-head";
import { Link } from "wouter";
import { Separator } from "@/components/ui/separator";
import { RinkCard } from "@/components/RinkCard";
import { rinks } from "@/lib/data";
import { LastVerified } from "@/components/LastVerified";
import { MapPin, CheckCircle, Calendar } from "lucide-react";
import { buildRinkItemList, buildWebPageSchema, SITE_URL } from "@/lib/seo";
import { getLatestStatusUpdated } from "@/lib/skateStatus";
import { SkateStatusChip } from "@/components/SkateStatus";

const RINK_SLUGS = {
  centennial: "centennial-sportsplex-nashville-tn",
  bellevue: "ford-ice-center-bellevue-nashville-tn",
  antioch: "ford-ice-center-antioch-antioch-tn",
  clarksville: "ford-ice-center-clarksville-clarksville-tn",
  garyForce: "gary-force-acura-ice-arena-nolensville-tn",
  smashville: "smashville-ice-rink-at-zoolumination-nashville-tn",
  gaylord: "gaylord-opryland-resort-nashville-tn",
  fountains: "fountains-at-gateway-murfreesboro-tn",
};

const nashvilleRinkSlugs = new Set(Object.values(RINK_SLUGS));
const nashvilleRinks = rinks.filter(r => nashvilleRinkSlugs.has(r.slug));

const centennial = rinks.find(r => r.slug === RINK_SLUGS.centennial);
const bellevue = rinks.find(r => r.slug === RINK_SLUGS.bellevue);
const antioch = rinks.find(r => r.slug === RINK_SLUGS.antioch);
const clarksville = rinks.find(r => r.slug === RINK_SLUGS.clarksville);

const NASHVILLE_FAQS = [
  {
    question: "Where can I ice skate in Nashville?",
    answer: "Nashville has five year-round indoor options across the metro: Centennial Sportsplex, Ford Ice Center Bellevue, Ford Ice Center Antioch, Ford Ice Center Clarksville, and Gary Force Acura Ice Arena in Nolensville. Seasonal holiday rinks also open at Gaylord Opryland, Smashville, and Fountains at Gateway.",
  },
  {
    question: "How much does ice skating cost in Nashville?",
    answer: "Centennial's prior public-skate rates were $12 for ages 13 and up and $10 for ages 5 to 12, but current pricing should be confirmed in DaySmart after the management transition. Ford Ice Center lists $10.98 plus tax for matinee sessions and $13.73 plus tax for evening sessions, with rentals included. Gary Force posts its price inside the booking flow.",
  },
  {
    question: "Is there indoor ice skating in Nashville?",
    answer: "Yes. Centennial Sportsplex and the Ford Ice Centers in Bellevue, Antioch, and Clarksville operate year-round indoor ice. Gary Force Acura Ice Arena in Nolensville is also a year-round indoor rink serving Williamson County.",
  },
  {
    question: "Where can I skate in Nashville this weekend?",
    answer: "Check Centennial and Ford Ice Center in DaySmart, then use Gary Force's online events calendar. Public-skate schedules change by week and month, so review any current Skate Status note and confirm the specific session before leaving home.",
  },
];

function RinkLink({ slug, children }: { slug: string; children: React.ReactNode }) {
  return (
    <Link href={`/rink/${slug}`} className="text-primary hover:underline font-medium">
      {children}
    </Link>
  );
}

export default function NashvilleCityHub() {
  const pageModified = [
    "2026-06-29",
    getLatestStatusUpdated(Array.from(nashvilleRinkSlugs)),
  ].filter((value): value is string => Boolean(value)).sort().at(-1);
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_URL}/city/tn/nashville#faq`,
    url: `${SITE_URL}/city/tn/nashville`,
    dateModified: pageModified,
    mainEntity: NASHVILLE_FAQS.map(item => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  useHead({
    title: "Ice Skating in Nashville, TN: Every Rink, Price, and Schedule (2026 Guide)",
    description: "Compare every Nashville ice rink, current public-skate prices, live schedules, booking links, lessons, and seasonal options. Verified June 29, 2026.",
    ogTitle: "Ice Skating in Nashville, TN: Every Rink, Price, and Schedule (2026 Guide)",
    ogDescription: "Compare every Nashville ice rink, current public-skate prices, live schedules, booking links, lessons, and seasonal options.",
    canonicalPath: "/city/tn/nashville",
    structuredData: [
      {
        ...buildWebPageSchema(
          "/city/tn/nashville",
          "Ice Skating in Nashville, TN: Every Rink, Price, and Schedule",
          "Compare every Nashville ice rink, current public-skate prices, live schedules, booking links, lessons, and seasonal options.",
        ),
        "@id": `${SITE_URL}/city/tn/nashville#webpage`,
        dateModified: pageModified,
        lastReviewed: pageModified,
      },
      buildRinkItemList(nashvilleRinks, "/city/tn/nashville", "Ice Skating Rinks in Nashville, Tennessee"),
      faqSchema,
    ],
  });

  return (
    <Layout>
      <div className="page-band border-b border-white/10">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center text-sm text-white/65 mb-4 gap-2">
            <Link href="/" className="hover:text-cyan-200">Home</Link>
            <span>/</span>
            <Link href="/state/tn" className="hover:text-cyan-200">Tennessee</Link>
            <span>/</span>
            <span className="text-white font-medium">Nashville</span>
          </div>
          <p className="mb-3 text-sm font-semibold uppercase text-cyan-200">Current metro guide</p>
          <h1 className="font-serif text-4xl md:text-5xl font-extrabold text-white mb-4">
            Ice Skating in Nashville, TN: Every Rink, Price, and Schedule (2026 Guide)
          </h1>
          <p className="text-lg text-white/75 max-w-3xl leading-relaxed">
            You can ice skate year-round in Nashville at Centennial Sportsplex, the three Ford Ice Centers, and Gary Force Acura Ice Arena in Nolensville. Centennial and Ford Ice use DaySmart, while Gary Force uses its online events calendar.
          </p>
          <p className="text-lg text-white/75 max-w-3xl leading-relaxed mt-4">
            This guide compares every public ice skating option in the metro, including current prices, how to book, which rink fits each part of town, and the seasonal holiday rinks. For a schedule-first view, use the{" "}
            <Link href="/blog/public-skating-nashville" className="text-cyan-200 hover:text-white hover:underline font-medium">
              Nashville public skating guide
            </Link>
            .
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">

          <aside className="lg:w-64 flex-shrink-0">
            <div className="sticky top-8">
              <h2 className="font-semibold text-sm uppercase text-muted-foreground mb-4">On this page</h2>
              <nav className="space-y-2">
                {[
                  { id: "at-a-glance", label: "At a glance" },
                  { id: "centennial", label: "Centennial Sportsplex" },
                  { id: "bellevue", label: "Ford Ice Center Bellevue" },
                  { id: "antioch", label: "Ford Ice Center Antioch" },
                  { id: "clarksville", label: "Ford Ice Center Clarksville" },
                  { id: "gary-force", label: "Gary Force Acura Ice Arena" },
                  { id: "seasonal", label: "Seasonal options" },
                  { id: "choose", label: "Which rink to choose" },
                  { id: "learn-to-skate", label: "Learn to skate" },
                  { id: "freestyle", label: "Freestyle & figure skating" },
                  { id: "tips", label: "Planning your visit" },
                  { id: "guides", label: "Nashville skating guides" },
                  { id: "faq", label: "Frequently asked questions" },
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
              <h2 className="font-serif text-2xl font-bold mb-6">At a glance &mdash; Nashville-area rinks</h2>
              <div className="overflow-x-auto rounded-lg border bg-white shadow-sm">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b-2 border-border">
                      <th className="text-left py-3 pr-4 font-semibold">Rink</th>
                      <th className="text-left py-3 pr-4 font-semibold">Neighborhood</th>
                      <th className="text-left py-3 pr-4 font-semibold">Price</th>
                      <th className="text-left py-3 pr-4 font-semibold">Reservation</th>
                      <th className="text-left py-3 font-semibold">Season</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pl-4 pr-4">
                        <RinkLink slug={RINK_SLUGS.centennial}>Centennial Sportsplex</RinkLink>
                        <div className="mt-2"><SkateStatusChip slug={RINK_SLUGS.centennial} /></div>
                      </td>
                      <td className="py-3 pr-4 text-muted-foreground">West End</td>
                      <td className="py-3 pr-4 text-muted-foreground">Confirm in DaySmart</td>
                      <td className="py-3 pr-4 text-muted-foreground">Online</td>
                      <td className="py-3"><span className="inline-flex items-center gap-1 text-green-600"><CheckCircle className="h-3.5 w-3.5" /> Year-round</span></td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pl-4 pr-4"><RinkLink slug={RINK_SLUGS.bellevue}>Ford Ice Center Bellevue</RinkLink></td>
                      <td className="py-3 pr-4 text-muted-foreground">Bellevue (west)</td>
                      <td className="py-3 pr-4 text-muted-foreground">$10.98 / $13.73</td>
                      <td className="py-3 pr-4 text-muted-foreground">Online</td>
                      <td className="py-3"><span className="inline-flex items-center gap-1 text-green-600"><CheckCircle className="h-3.5 w-3.5" /> Year-round</span></td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pl-4 pr-4"><RinkLink slug={RINK_SLUGS.antioch}>Ford Ice Center Antioch</RinkLink></td>
                      <td className="py-3 pr-4 text-muted-foreground">Antioch (south)</td>
                      <td className="py-3 pr-4 text-muted-foreground">$10.98 / $13.73</td>
                      <td className="py-3 pr-4 text-muted-foreground">Online</td>
                      <td className="py-3"><span className="inline-flex items-center gap-1 text-green-600"><CheckCircle className="h-3.5 w-3.5" /> Year-round</span></td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pl-4 pr-4"><RinkLink slug={RINK_SLUGS.clarksville}>Ford Ice Center Clarksville</RinkLink></td>
                      <td className="py-3 pr-4 text-muted-foreground">Clarksville (north, 45 min)</td>
                      <td className="py-3 pr-4 text-muted-foreground">$10.98 / $13.73</td>
                      <td className="py-3 pr-4 text-muted-foreground">Online</td>
                      <td className="py-3"><span className="inline-flex items-center gap-1 text-green-600"><CheckCircle className="h-3.5 w-3.5" /> Year-round</span></td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pl-4 pr-4"><RinkLink slug={RINK_SLUGS.garyForce}>Gary Force Acura Ice Arena</RinkLink></td>
                      <td className="py-3 pr-4 text-muted-foreground">Nolensville (south)</td>
                      <td className="py-3 pr-4 text-muted-foreground">Confirm at booking</td>
                      <td className="py-3 pr-4 text-muted-foreground">Online</td>
                      <td className="py-3"><span className="inline-flex items-center gap-1 text-green-600"><CheckCircle className="h-3.5 w-3.5" /> Year-round</span></td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pl-4 pr-4"><RinkLink slug={RINK_SLUGS.smashville}>Smashville at Zoolumination</RinkLink></td>
                      <td className="py-3 pr-4 text-muted-foreground">Downtown</td>
                      <td className="py-3 pr-4 text-muted-foreground">$21&ndash;25</td>
                      <td className="py-3 pr-4 text-muted-foreground">Drop-in</td>
                      <td className="py-3"><span className="inline-flex items-center gap-1 text-amber-600"><Calendar className="h-3.5 w-3.5" /> Nov&ndash;Feb</span></td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pl-4 pr-4"><RinkLink slug={RINK_SLUGS.fountains}>Fountains at Gateway</RinkLink></td>
                      <td className="py-3 pr-4 text-muted-foreground">Murfreesboro (south, 30 min)</td>
                      <td className="py-3 pr-4 text-muted-foreground">$12&ndash;17</td>
                      <td className="py-3 pr-4 text-muted-foreground">Drop-in</td>
                      <td className="py-3"><span className="inline-flex items-center gap-1 text-amber-600"><Calendar className="h-3.5 w-3.5" /> Nov&ndash;Feb</span></td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pl-4 pr-4"><RinkLink slug={RINK_SLUGS.gaylord}>Gaylord Opryland Resort</RinkLink></td>
                      <td className="py-3 pr-4 text-muted-foreground">Opryland</td>
                      <td className="py-3 pr-4 text-muted-foreground">Resort pricing</td>
                      <td className="py-3 pr-4 text-muted-foreground">With ticket</td>
                      <td className="py-3"><span className="inline-flex items-center gap-1 text-amber-600"><Calendar className="h-3.5 w-3.5" /> Nov&ndash;Jan</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <Separator />

            <section id="centennial">
              <h2 className="font-serif text-2xl font-bold mb-4">Centennial Sportsplex &mdash; Nashville&apos;s central two-sheet rink</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  <RinkLink slug={RINK_SLUGS.centennial}>Centennial Sportsplex Ice Arenas</RinkLink> is Nashville&apos;s original public skating destination. Located across from Centennial Park in the West End, it is operated by Metro Nashville Parks and Recreation and has two full-size sheets measuring 200 by 85 feet.
                </p>
                <p>
                  Centennial&apos;s previously published public-skate rates were $12 for ages 13 and up and $10 for ages 5 to 12, with rental included. Since the Predators assumed ice operations, schedules, waivers, and registration have moved to DaySmart. Confirm the current session price when booking.
                </p>
                <p>
                  <strong className="text-foreground">What makes it unique:</strong> Two full-size sheets let public skating, hockey, and lessons share the building. The west arena is also used by the Nashville Predators. Weekend afternoons and some weekday midday public sessions are common, but the calendar changes monthly.
                </p>
                <p>
                  <strong className="text-foreground">Best for:</strong> First-timers, families who want to walk in, learn-to-skate students, central Nashville residents, and groups bringing non-skating spectators.
                </p>
                <p>
                  <strong className="text-foreground">The catch:</strong> Public skate does not follow fixed weekly hours. Check the current Skate Status note, then open the Centennial session in DaySmart before driving.
                </p>
                <p className="text-sm">
                  <MapPin className="h-4 w-4 inline mr-1 text-primary" />
                  222 25th Ave N, Nashville, TN 37203. Phone: 615-862-8480.
                  <Link href={`/rink/${RINK_SLUGS.centennial}`} className="text-primary hover:underline ml-1">Full guide &rarr;</Link>
                </p>
              </div>
            </section>

            <Separator />

            <section id="bellevue">
              <h2 className="font-serif text-2xl font-bold mb-4">Ford Ice Center Bellevue &mdash; west Nashville&apos;s newest</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  <RinkLink slug={RINK_SLUGS.bellevue}>Ford Ice Center Bellevue</RinkLink> serves the west Nashville and Bellevue corridor. Operated by the Nashville Predators, it follows the Ford Ice public-skate format: cashless, online registration through DaySmart, and front-desk check-in before skating.
                </p>
                <p>
                  Matinee public skates are $10.98 plus tax and evening sessions are $13.73 plus tax. Rental skates are included if needed. The twin-rink layout gives Bellevue more room to run public skating alongside lessons, figure skating, and hockey.
                </p>
                <p>
                  <strong className="text-foreground">Best for:</strong> West Nashville residents, skaters who want a guaranteed spot, families comfortable booking online, and anyone who prefers a newer, more polished facility.
                </p>
                <p>
                  <strong className="text-foreground">The catch:</strong> Public skate is online registration only. Create the DaySmart account before your first trip and confirm the session there.
                </p>
                <p className="text-sm">
                  <MapPin className="h-4 w-4 inline mr-1 text-primary" />
                  7638 Hwy 70 S, Nashville, TN 37221.
                  <Link href={`/rink/${RINK_SLUGS.bellevue}`} className="text-primary hover:underline ml-1">Full guide &rarr;</Link>
                </p>
              </div>
            </section>

            <Separator />

            <section id="antioch">
              <h2 className="font-serif text-2xl font-bold mb-4">Ford Ice Center Antioch &mdash; south Nashville&apos;s closest option</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  <RinkLink slug={RINK_SLUGS.antioch}>Ford Ice Center Antioch</RinkLink> is the southernmost Predators rink, located off Hickory Hollow Parkway in Antioch. It is the closest year-round indoor rink for many residents of south Nashville, Brentwood, La Vergne, and Murfreesboro.
                </p>
                <p>
                  Like Bellevue and Clarksville, public skating is booked online through DaySmart. Matinee sessions are $10.98 plus tax and evening sessions are $13.73 plus tax, with rental skates included if needed. Antioch has two sheets and supports public skating, learn-to-skate, freestyle, and hockey.
                </p>
                <p>
                  <strong className="text-foreground">Best for:</strong> South Nashville and Murfreesboro residents (no year-round rink in Murfreesboro itself), Junior Predators families, and skaters who want extended hours.
                </p>
                <p className="text-sm">
                  <MapPin className="h-4 w-4 inline mr-1 text-primary" />
                  5264 Hickory Hollow Pl, Antioch, TN 37013.
                  <Link href={`/rink/${RINK_SLUGS.antioch}`} className="text-primary hover:underline ml-1">Full guide &rarr;</Link>
                </p>
              </div>
            </section>

            <Separator />

            <section id="clarksville">
              <h2 className="font-serif text-2xl font-bold mb-4">Ford Ice Center Clarksville &mdash; for north Nashville and Clarksville</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  The newest Ford rink, <RinkLink slug={RINK_SLUGS.clarksville}>Ford Ice Center Clarksville</RinkLink> extends the Predators skating network about 45 minutes north of Nashville inside F&amp;M Bank Arena. For Clarksville and Montgomery County, this is the main place to ice skate.
                </p>
                <p>
                  Public skate uses the same DaySmart booking flow and price structure: $10.98 plus tax for matinee sessions and $13.73 plus tax for evening sessions, with rental skates included. Because one sheet carries public skating, hockey, figure skating, and lessons, checking the specific session matters here.
                </p>
                <p>
                  <strong className="text-foreground">Best for:</strong> Clarksville and north Nashville residents, youth hockey families in Montgomery County, skaters willing to drive for a less crowded facility.
                </p>
                <p className="text-sm">
                  <MapPin className="h-4 w-4 inline mr-1 text-primary" />
                  101 Main St, Clarksville, TN 37040.
                  <Link href={`/rink/${RINK_SLUGS.clarksville}`} className="text-primary hover:underline ml-1">Full guide &rarr;</Link>
                </p>
              </div>
            </section>

            <Separator />

            <section id="gary-force">
              <h2 className="font-serif text-2xl font-bold mb-4">Gary Force Acura Ice Arena &mdash; Williamson County&apos;s rink</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  <RinkLink slug={RINK_SLUGS.garyForce}>Gary Force Acura Ice Arena</RinkLink> is a full-size, NHL-size indoor rink in Nolensville that has served the communities south of Nashville since 2021. It is the closest year-round sheet for many families in Nolensville, Brentwood, and Franklin.
                </p>
                <p>
                  The rink is home to the Nashville Warriors Youth Hockey Club and hosts hockey and figure-skating activity. Public skate, stick and puck, and freestyle sessions are all registered through its online events calendar.
                </p>
                <p>
                  <strong className="text-foreground">Best for:</strong> Williamson County families, Nashville Warriors households, figure skaters looking for freestyle south of the city, and anyone who wants to avoid crossing Nashville for ice.
                </p>
                <p>
                  <strong className="text-foreground">The catch:</strong> Public-skate pricing is not posted on the main website. Open the booking calendar and confirm the price and requirements before registering.
                </p>
                <p className="text-sm">
                  <MapPin className="h-4 w-4 inline mr-1 text-primary" />
                  7235 Haley Industrial Drive, Nolensville, TN 37135.
                  <Link href={`/rink/${RINK_SLUGS.garyForce}`} className="text-primary hover:underline ml-1">Full guide &rarr;</Link>
                </p>
              </div>
            </section>

            <Separator />

            <section id="seasonal">
              <h2 className="font-serif text-2xl font-bold mb-4">Seasonal options &mdash; only open November through February</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                From late November through early February, Nashville opens up several outdoor and pop-up rinks that aren&apos;t available the rest of the year:
              </p>
              <div className="space-y-6">
                <div className="bg-card border rounded-lg p-6">
                  <h3 className="font-semibold text-lg mb-2">
                    <RinkLink slug={RINK_SLUGS.smashville}>Smashville Ice Rink at Zoolumination</RinkLink>
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Downtown at Ascension Saint Thomas Landing (under Broadway). The 2025&ndash;26 season ran through February 8, 2026. Adult and teen tickets were $25, youth $21. Part of the Predators / Zoolumination holiday programming. <strong className="text-foreground">Best for:</strong> a downtown holiday experience, not a serious skate session.
                  </p>
                </div>
                <div className="bg-card border rounded-lg p-6">
                  <h3 className="font-semibold text-lg mb-2">
                    <RinkLink slug={RINK_SLUGS.fountains}>Fountains at Gateway (Murfreesboro)</RinkLink>
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    A seasonal outdoor rink that ran November 21, 2025 through February 1, 2026. $17 for ages 13+, $12 for ages 4&ndash;12. 60-minute sessions, skate rental included. The closest seasonal rink for Murfreesboro families.
                  </p>
                </div>
                <div className="bg-card border rounded-lg p-6">
                  <h3 className="font-semibold text-lg mb-2">
                    <RinkLink slug={RINK_SLUGS.gaylord}>Gaylord Opryland Resort</RinkLink>
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Part of the resort&apos;s &ldquo;A Country Christmas&rdquo; / &ldquo;So Much Christmas&rdquo; programming. Resort-style pricing and atmosphere. Worth doing once as an experience, not as a regular skate spot.
                  </p>
                </div>
              </div>
            </section>

            <Separator />

            <section id="choose">
              <h2 className="font-serif text-2xl font-bold mb-4">Which Nashville rink should you choose?</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">A few simple rules:</p>
              <ul className="space-y-4 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span><strong className="text-foreground">Choose Centennial Sportsplex if:</strong> you&apos;re a first-timer, you have young kids and want to walk in without a reservation, you&apos;re enrolling in a learn-to-skate program, or budget matters.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span><strong className="text-foreground">Choose a Ford Ice Center if:</strong> you want a guaranteed spot, you prefer a modern facility, you&apos;re closer to Bellevue/Antioch/Clarksville than to West End, or your kids are in Junior Predators hockey or Learn-to-Skate.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span><strong className="text-foreground">Choose Gary Force if:</strong> you live in Williamson County, you want public skate or freestyle south of Nashville, or your family skates with the Nashville Warriors.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span><strong className="text-foreground">Save the seasonal rinks for the holidays:</strong> Smashville and Fountains at Gateway are experiences, not training grounds.</span>
                </li>
              </ul>
            </section>

            <Separator />

            <section id="learn-to-skate">
              <h2 className="font-serif text-2xl font-bold mb-4">Learn to skate in Nashville</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  <RinkLink slug={RINK_SLUGS.centennial}>Centennial Sportsplex</RinkLink> offers lessons through Nashville Skating Academy. The <RinkLink slug={RINK_SLUGS.bellevue}>Ford Ice Centers</RinkLink> also publish structured learn-to-skate programs, including a Scott Hamilton Skating Academy program in Clarksville and TPH Nashville Skating Academy classes in Bellevue and Antioch.
                </p>
                <p>
                  Group lessons give beginners a progression that public skating cannot provide by itself. Pair the weekly class with a public session between lessons so balance, stops, and crossovers have time to become habits. Registration runs in multi-week blocks, so check the current session dates before choosing a location.
                </p>
              </div>
            </section>

            <Separator />

            <section id="freestyle">
              <h2 className="font-serif text-2xl font-bold mb-4">Freestyle and figure skating in Nashville</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  <RinkLink slug={RINK_SLUGS.centennial}>Centennial Sportsplex</RinkLink> supports Nashville Skating Academy, which publishes freestyle ice and registration in its Centennial Finnly portal. Ford Ice Center offers freestyle sessions across its system, with current listings through its booking tools. <RinkLink slug={RINK_SLUGS.garyForce}>Gary Force Acura Ice Arena</RinkLink> also confirms freestyle sessions in its online events calendar.
                </p>
                <p>
                  Freestyle is practice ice, not public skate. Session rules, level expectations, and availability vary, so open the current listing and confirm that the session fits the skater before booking.
                </p>
              </div>
            </section>

            <Separator />

            <section id="tips">
              <h2 className="font-serif text-2xl font-bold mb-4">Planning your visit &mdash; what every Nashville rink has in common</h2>
              <ul className="space-y-4 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">1</span>
                  <span><strong className="text-foreground">Dress in layers.</strong> All indoor rinks run 55&ndash;60&deg;F at ice level. Bring a light jacket regardless of the season outside.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">2</span>
                  <span><strong className="text-foreground">Wear the right socks.</strong> One pair of thin, calf-height socks gives you the best skate fit.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">3</span>
                  <span><strong className="text-foreground">Bring gloves.</strong> When you fall, your hands hit the ice first.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">4</span>
                  <span><strong className="text-foreground">Arrive early.</strong> 15&ndash;20 minutes before your session for skate-rental and lacing time.</span>
                </li>
              </ul>
            </section>

            <Separator />

            <section id="guides">
              <h2 className="font-serif text-2xl font-bold mb-4">Nashville skating guides</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Use these guides for the part of the decision that matters most to your trip:
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  {
                    href: "/blog/public-skating-nashville",
                    title: "Public skating schedules and prices",
                    description: "Compare live-calendar systems, admission, rentals, and how to book each rink.",
                  },
                  {
                    href: "/blog/ice-skating-nashville-this-weekend",
                    title: "What's open in Nashville this weekend",
                    description: "Start with the latest status notes, then confirm the official session before leaving home.",
                  },
                  {
                    href: "/blog/skate-sharpening-nashville",
                    title: "Current Nashville sharpening options",
                    description: "Find public sharpening services or ask for help making the right connection.",
                  },
                  {
                    href: "/blog/ice-skating-cost-nashville",
                    title: "How much ice skating costs",
                    description: "Plan the full outing, including admission, lessons, and equipment.",
                  },
                  {
                    href: "/blog/centennial-sportsplex-ice-skating",
                    title: "Centennial Sportsplex guide",
                    description: "Go deeper on Nashville's central two-sheet public rink and its current booking paths.",
                  },
                  {
                    href: "/blog/what-to-expect-public-skating",
                    title: "What to expect at public skate",
                    description: "A first-timer walkthrough from rentals to the last lap.",
                  },
                ].map(guide => (
                  <Link
                    key={guide.href}
                    href={guide.href}
                    className="block border p-5 hover:border-primary/40 transition-colors"
                  >
                    <h3 className="font-semibold text-foreground">{guide.title}</h3>
                    <p className="text-sm text-muted-foreground mt-2">{guide.description}</p>
                  </Link>
                ))}
              </div>
            </section>

            <Separator />

            <section id="faq">
              <h2 className="font-serif text-2xl font-bold mb-6">Nashville ice skating FAQ</h2>
              <div className="space-y-6">
                {NASHVILLE_FAQS.map(item => (
                  <div key={item.question}>
                    <h3 className="font-semibold text-lg">{item.question}</h3>
                    <p className="text-muted-foreground leading-relaxed mt-2">{item.answer}</p>
                  </div>
                ))}
              </div>
            </section>

            <Separator />

            <section>
              <h2 className="font-serif text-2xl font-bold mb-6">All Nashville-area Rinks</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {nashvilleRinks.map(rink => (
                  <RinkCard key={rink.id} rink={rink} />
                ))}
              </div>
            </section>

            <LastVerified date="2026-06-29" />

          </div>
        </div>
      </div>
    </Layout>
  );
}
