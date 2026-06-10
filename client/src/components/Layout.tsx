import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Snowflake, Search, MapPin, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/freestyle", label: "Freestyle" },
    { href: "/services/learn-to-skate", label: "Learn to Skate" },
    { href: "/services/skate-sharpening", label: "Skate Sharpening" },
    { href: "/blog", label: "Blog" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans text-foreground selection:bg-primary/20 overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
                <Snowflake className="h-5 w-5 text-primary" />
              </div>
              <span className="font-serif text-xl font-bold tracking-tight text-foreground">
                Ice Skating Index
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary cursor-pointer",
                    location === link.href
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  {link.label}
                </span>
              </Link>
            ))}
            <Button size="sm" className="ml-2 font-semibold shadow-sm hover:shadow-md transition-all" asChild>
              <Link href="/browse">Find a Rink</Link>
            </Button>
          </nav>

          {/* Mobile Nav */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="-mr-2">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80%] sm:w-[300px]">
                <div className="flex flex-col gap-6 mt-8">
                  <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="flex items-center gap-2 cursor-pointer">
                      <Snowflake className="h-5 w-5 text-primary" />
                      <span className="font-serif text-lg font-bold">Ice Skating Index</span>
                    </div>
                  </Link>
                  <nav className="flex flex-col gap-4">
                    {navLinks.map((link) => (
                      <Link key={link.href} href={link.href}>
                        <span
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={cn(
                            "text-lg font-medium transition-colors hover:text-primary cursor-pointer",
                            location === link.href
                              ? "text-primary"
                              : "text-muted-foreground"
                          )}
                        >
                          {link.label}
                        </span>
                      </Link>
                    ))}
                    <Button className="w-full mt-2" asChild>
                      <Link href="/browse" onClick={() => setIsMobileMenuOpen(false)}>Find a Rink</Link>
                    </Button>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Snowflake className="h-5 w-5 text-primary" />
                <span className="font-serif text-lg font-bold">Ice Skating Index</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The definitive directory for ice skating rinks, schedules, and freestyle sessions. Helping skaters find their ice.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-foreground">Directory</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/browse"><span className="hover:text-primary transition-colors cursor-pointer">Browse Rinks</span></Link></li>
                <li><Link href="/freestyle"><span className="hover:text-primary transition-colors cursor-pointer">Freestyle Sessions</span></Link></li>
                <li><Link href="/services/learn-to-skate"><span className="hover:text-primary transition-colors cursor-pointer">Learn to Skate</span></Link></li>
                <li><Link href="/services/skate-sharpening"><span className="hover:text-primary transition-colors cursor-pointer">Skate Sharpening</span></Link></li>
                <li><Link href="/blog"><span className="hover:text-primary transition-colors cursor-pointer">Blog</span></Link></li>
                <li><Link href="/about"><span className="hover:text-primary transition-colors cursor-pointer">About</span></Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-foreground">Top States</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/state/tn"><span className="hover:text-primary transition-colors cursor-pointer">Tennessee</span></Link></li>
                <li><Link href="/state/ny"><span className="hover:text-primary transition-colors cursor-pointer">New York</span></Link></li>
                <li><Link href="/state/ca"><span className="hover:text-primary transition-colors cursor-pointer">California</span></Link></li>
                <li><Link href="/state/mi"><span className="hover:text-primary transition-colors cursor-pointer">Michigan</span></Link></li>
                <li><Link href="/state/mn"><span className="hover:text-primary transition-colors cursor-pointer">Minnesota</span></Link></li>
                <li><Link href="/state/ma"><span className="hover:text-primary transition-colors cursor-pointer">Massachusetts</span></Link></li>
                <li><Link href="/state/co"><span className="hover:text-primary transition-colors cursor-pointer">Colorado</span></Link></li>
                <li><Link href="/state/tx"><span className="hover:text-primary transition-colors cursor-pointer">Texas</span></Link></li>
                <li><Link href="/state/il"><span className="hover:text-primary transition-colors cursor-pointer">Illinois</span></Link></li>
                <li><Link href="/state/pa"><span className="hover:text-primary transition-colors cursor-pointer">Pennsylvania</span></Link></li>
                <li><Link href="/state/oh"><span className="hover:text-primary transition-colors cursor-pointer">Ohio</span></Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Ice Skating Index. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
