import { Layout } from "@/components/Layout";
import { useHead } from "@/hooks/use-head";
import { Link } from "wouter";
import { Separator } from "@/components/ui/separator";
import { RinkCard } from "@/components/RinkCard";
import { rinks } from "@/lib/data";
import { LastVerified } from "@/components/LastVerified";
import { MapPin, CheckCircle, XCircle, Calendar, DollarSign, Ticket } from "lucide-react";
import { buildRinkItemList } from "@/lib/seo";

const RINK_SLUGS = {
  centennial: "centennial-sportsplex-nashville-tn",
  bellevue: "ford-ice-center-bellevue-nashville-tn",
  antioch: "ford-ice-center-antioch-antioch-tn",
  clarksville: "ford-ice-center-clarksville-clarksville-tn",
};

const nashvilleRinks = rinks.filter(r =>
  r.slug === RINK_SLUGS.centennial ||
  r.slug === RINK_SLUGS.bellevue ||
  r.slug === RINK_SLUGS.antioch ||
  r.slug === RINK_SLUGS.clarksville
);

const centennial = rinks.find(r => r.slug === RINK_SLUGS.centennial);
const bellevue = rinks.find(r => r.slug === RINK_SLUGS.bellevue);
const antioch = rinks.find(r => r.slug === RINK_SLUGS.antioch);
const clarksville = rinks.find(r => r.slug === RINK_SLUGS.clarksville);

function RinkLink({ slug, children }: { slug: string; children: React.ReactNode }) {
  return (
    <Link href={`/rink/${slug}`} className="text-primary hover:underline font-medium">
      {children}
    </Link>
  );
}

export default function NashvilleCityHub() {
  useHead({
    title: "Ice Skating in Nashville, TN: Every Rink, Price, and Schedule (2026 Guide)",
    description: "Every public ice skating rink in Nashville and Middle Tennessee \u2014 Centennial Sportsplex, all three Ford Ice Centers, plus seasonal options. Real prices, real schedules, verified weekly.",
    ogTitle: "Ice Skating in Nashville, TN: Every Rink, Price, and Schedule (2026 Guide)",
    ogDescription: "Every public ice skating rink in Nashville and Middle Tennessee \u2014 Centennial Sportsplex, all three Ford Ice Centers, plus seasonal options. Real prices, real schedules, verified weekly.",
    canonicalPath: "/city/tn/nashville",
    structuredData: [buildRinkItemList(nashvilleRinks, "/city/tn/nashville", "Ice Skating Rinks in Nashville, Tennessee")],
  });

  return (
    <Layout>
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center text-sm text-muted-foreground mb-4 gap-2">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <Link href="/state/tn" className="hover:text-primary">Tennessee</Link>
            <span>/</span>
            <span className="text-foreground font-medium">Nashville</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            Ice Skating in Nashville, TN: Every Rink, Price, and Schedule (2026 Guide)
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
            Nashville isn&apos;t the first city most people picture when they think about ice skating. But Music City has more ice than you&apos;d expect &mdash; a year-round indoor rink right in the West End, three more run by the Nashville Predators across Middle Tennessee, plus a handful of seasonal outdoor rinks that pop up between November and February.
          </p>
          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed mt-4">
            This guide covers every public ice skating option in the Nashville area, what each rink is best for, what it costs, and how to decide which one to visit. We update this page weekly &mdash; every rink schedule, every price, every detail is verified against the operator&apos;s own source.
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
                  { id: "at-a-glance", label: "At a glance" },
                  { id: "centennial", label: "Centennial Sportsplex" },
                  { id: "bellevue", label: "Ford Ice Center Bellevue" },
                  { id: "antioch", label: "Ford Ice Center Antioch" },
                  { id: "clarksville", label: "Ford Ice Center Clarksville" },
                  { id: "seasonal", label: "Seasonal options" },
                  { id: "choose", label: "Which rink to choose" },
                  { id: "learn-to-skate", label: "Learn to skate" },
                  { id: "freestyle", label: "Freestyle & figure skating" },
                  { id: "tips", label: "Planning your visit" },
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
              <div className="overflow-x-auto">
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
                      <td className="py-3 pr-4"><RinkLink slug={RINK_SLUGS.centennial}>Centennial Sportsplex</RinkLink></td>
                      <td className="py-3 pr-4 text-muted-foreground">West End</td>
                      <td className="py-3 pr-4 text-muted-foreground">$6&ndash;7</td>
                      <td className="py-3 pr-4 text-muted-foreground">Walk-in</td>
                      <td className="py-3"><span className="inline-flex items-center gap-1 text-green-600"><CheckCircle className="h-3.5 w-3.5" /> Year-round</span></td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4"><RinkLink slug={RINK_SLUGS.bellevue}>Ford Ice Center Bellevue</RinkLink></td>
                      <td className="py-3 pr-4 text-muted-foreground">Bellevue (west)</td>
                      <td className="py-3 pr-4 text-muted-foreground">$12</td>
                      <td className="py-3 pr-4 text-muted-foreground">Online</td>
                      <td className="py-3"><span className="inline-flex items-center gap-1 text-green-600"><CheckCircle className="h-3.5 w-3.5" /> Year-round</span></td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4"><RinkLink slug={RINK_SLUGS.antioch}>Ford Ice Center Antioch</RinkLink></td>
                      <td className="py-3 pr-4 text-muted-foreground">Antioch (south)</td>
                      <td className="py-3 pr-4 text-muted-foreground">$12</td>
                      <td className="py-3 pr-4 text-muted-foreground">Online</td>
                      <td className="py-3"><span className="inline-flex items-center gap-1 text-green-600"><CheckCircle className="h-3.5 w-3.5" /> Year-round</span></td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4"><RinkLink slug={RINK_SLUGS.clarksville}>Ford Ice Center Clarksville</RinkLink></td>
                      <td className="py-3 pr-4 text-muted-foreground">Clarksville (north, 45 min)</td>
                      <td className="py-3 pr-4 text-muted-foreground">$12</td>
                      <td className="py-3 pr-4 text-muted-foreground">Online</td>
                      <td className="py-3"><span className="inline-flex items-center gap-1 text-green-600"><CheckCircle className="h-3.5 w-3.5" /> Year-round</span></td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4 font-medium">Smashville at Zoolumination</td>
                      <td className="py-3 pr-4 text-muted-foreground">Downtown</td>
                      <td className="py-3 pr-4 text-muted-foreground">$21&ndash;25</td>
                      <td className="py-3 pr-4 text-muted-foreground">Drop-in</td>
                      <td className="py-3"><span className="inline-flex items-center gap-1 text-amber-600"><Calendar className="h-3.5 w-3.5" /> Nov&ndash;Feb</span></td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4 font-medium">Fountains at Gateway</td>
                      <td className="py-3 pr-4 text-muted-foreground">Murfreesboro (south, 30 min)</td>
                      <td className="py-3 pr-4 text-muted-foreground">$12&ndash;17</td>
                      <td className="py-3 pr-4 text-muted-foreground">Drop-in</td>
                      <td className="py-3"><span className="inline-flex items-center gap-1 text-amber-600"><Calendar className="h-3.5 w-3.5" /> Nov&ndash;Feb</span></td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4 font-medium">Gaylord Opryland Resort</td>
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
              <h2 className="font-serif text-2xl font-bold mb-4">Centennial Sportsplex &mdash; the affordable West End option</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  <RinkLink slug={RINK_SLUGS.centennial}>Centennial Sportsplex Ice Arenas</RinkLink> is Nashville&apos;s original public skating destination and still the cheapest in the city. Located across from Centennial Park in the West End, it&apos;s operated by Metro Nashville Parks and Recreation and has two full-size sheets (200 by 85 feet). Admission is $7 for adults and $6 for kids 5&ndash;12, with skate rental included.
                </p>
                <p>
                  <strong className="text-foreground">What makes it unique:</strong> Two full-size sheets &mdash; the only multi-rink public facility in Nashville proper. The west arena is also the Predators&apos; practice facility. Walk-in only, which means no online booking system to navigate but also no guaranteed spot on busy weekends.
                </p>
                <p>
                  <strong className="text-foreground">Best for:</strong> Families on a budget, first-timers, learn-to-skate students, anyone who wants to walk in without planning ahead. Roughly half the price of the Ford Ice rinks.
                </p>
                <p>
                  <strong className="text-foreground">The catch:</strong> Public skate sessions run on a variable schedule rather than fixed weekly hours. Always check the Centennial Sportsplex Ice Arena Google Calendar (linked from nashville.gov) before driving. Sessions are typically Wednesday, Friday, and Saturday &mdash; but this changes month to month based on hockey league bookings.
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
                  <RinkLink slug={RINK_SLUGS.bellevue}>Ford Ice Center Bellevue</RinkLink> serves the west Nashville and Bellevue corridor &mdash; the most convenient year-round option if you&apos;re coming from Belle Meade, west Nashville, Brentwood&apos;s northwest side, or the western suburbs. Operated by the Nashville Predators, it follows the standard Ford Ice format: cashless, online reservation required, $12 admission with rental included.
                </p>
                <p>
                  <strong className="text-foreground">Best for:</strong> West Nashville residents, skaters who want a guaranteed spot, families comfortable booking online, and anyone who prefers a newer, more polished facility.
                </p>
                <p>
                  <strong className="text-foreground">The catch:</strong> No walk-ins. Same-day reservations are usually available except on peak weekends, so book at least a few hours ahead.
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
                  <RinkLink slug={RINK_SLUGS.antioch}>Ford Ice Center Antioch</RinkLink> is the southernmost Predators rink, located off Hickory Hollow Parkway in Antioch. It&apos;s the closest year-round indoor rink for residents of south Nashville, Brentwood, La Vergne, and Murfreesboro. Hours are 6 AM to 11 PM daily &mdash; the most extended hours of any Nashville-area rink. Same pricing and reservation format as the other Ford locations.
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
                  The newest of the three Ford rinks, <RinkLink slug={RINK_SLUGS.clarksville}>Ford Ice Center Clarksville</RinkLink> extends the Predators skating network ~45 minutes north of Nashville into Clarksville. It&apos;s housed inside F&amp;M Bank Arena. For residents in Clarksville, Springfield, or north Davidson County, this is by far the closest public ice. Same pricing model: $12 with rental included, online reservation required.
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

            <section id="seasonal">
              <h2 className="font-serif text-2xl font-bold mb-4">Seasonal options &mdash; only open November through February</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                From late November through early February, Nashville opens up several outdoor and pop-up rinks that aren&apos;t available the rest of the year:
              </p>
              <div className="space-y-6">
                <div className="bg-card border rounded-xl p-6">
                  <h3 className="font-semibold text-lg mb-2">Smashville Ice Rink at Zoolumination</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Downtown at Ascension Saint Thomas Landing (under Broadway). The 2025&ndash;26 season ran through February 8, 2026. Adult and teen tickets were $25, youth $21. Part of the Predators / Zoolumination holiday programming. <strong className="text-foreground">Best for:</strong> a downtown holiday experience, not a serious skate session.
                  </p>
                </div>
                <div className="bg-card border rounded-xl p-6">
                  <h3 className="font-semibold text-lg mb-2">Fountains at Gateway (Murfreesboro)</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    A seasonal outdoor rink that ran November 21, 2025 through February 1, 2026. $17 for ages 13+, $12 for ages 4&ndash;12. 60-minute sessions, skate rental included. The closest seasonal rink for Murfreesboro families.
                  </p>
                </div>
                <div className="bg-card border rounded-xl p-6">
                  <h3 className="font-semibold text-lg mb-2">Gaylord Opryland Resort</h3>
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
                  <span><strong className="text-foreground">Save the seasonal rinks for the holidays:</strong> Smashville and Fountains at Gateway are experiences, not training grounds.</span>
                </li>
              </ul>
            </section>

            <Separator />

            <section id="learn-to-skate">
              <h2 className="font-serif text-2xl font-bold mb-4">Learn to skate in Nashville</h2>
              <p className="text-muted-foreground leading-relaxed">
                Both <RinkLink slug={RINK_SLUGS.centennial}>Centennial Sportsplex</RinkLink> (via Nashville Skating Academy) and the <RinkLink slug={RINK_SLUGS.bellevue}>Ford Ice Centers</RinkLink> offer structured Learn-to-Skate USA programming. Centennial&apos;s sessions are typically 6&ndash;7 weeks and grouped by skill level. Ford Ice runs its own Predators-branded Learn-to-Skate at all three locations. If you&apos;re committing more than a one-time try, enroll in a structured session &mdash; the difference between learning in a class versus during public skate is dramatic.
              </p>
            </section>

            <Separator />

            <section id="freestyle">
              <h2 className="font-serif text-2xl font-bold mb-4">Freestyle and figure skating in Nashville</h2>
              <p className="text-muted-foreground leading-relaxed">
                <RinkLink slug={RINK_SLUGS.centennial}>Centennial Sportsplex</RinkLink> is the dominant freestyle venue in Nashville, supported by Nashville Skating Academy. <RinkLink slug={RINK_SLUGS.antioch}>Ford Ice Center Antioch</RinkLink> also hosts freestyle sessions, particularly for the Scott Hamilton Skating Academy programs. Freestyle sessions are posted on each rink&apos;s calendar and are not on a fixed weekly schedule &mdash; check ahead.
              </p>
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

            <section>
              <h2 className="font-serif text-2xl font-bold mb-6">All Nashville-area Rinks</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {nashvilleRinks.map(rink => (
                  <RinkCard key={rink.id} rink={rink} />
                ))}
              </div>
            </section>

            <LastVerified date="2026-05-23" />

          </div>
        </div>
      </div>
    </Layout>
  );
}
