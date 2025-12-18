import { Layout } from "@/components/Layout";
import { getFreestyleRinks } from "@/lib/data";
import { RinkCard } from "@/components/RinkCard";
import { Link } from "wouter";
import { useHead } from "@/hooks/use-head";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FreestyleHub() {
  useHead({
    title: "Freestyle Ice Skating Sessions",
    description: "Find freestyle sessions for figure skaters. Verified times, pricing, and coaching policies."
  });

  const freestyleRinks = getFreestyleRinks();

  return (
    <Layout>
      <div className="bg-primary/5 border-b">
        <div className="container mx-auto px-4 py-16">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6">Freestyle Sessions</h1>
          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
            A dedicated directory for figure skaters. We track down freestyle contracts, drop-in rates, 
            and coaching policies so you can focus on your training.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2">
            <h2 className="font-serif text-2xl font-bold mb-6">Rinks with Freestyle</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {freestyleRinks.map(rink => (
                <RinkCard key={rink.id} rink={rink} />
              ))}
            </div>
          </div>

          <aside className="space-y-8">
            <div className="bg-card border rounded-xl p-6 shadow-sm">
              <h3 className="font-serif text-xl font-bold mb-4">Freestyle FAQ</h3>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>What is a Freestyle Session?</AccordionTrigger>
                  <AccordionContent>
                    Freestyle sessions are dedicated ice time for figure skaters to practice jumps, spins, and programs. Unlike public skate, hockey is not allowed, and the ice is maintained for figure skating.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Do I need a coach?</AccordionTrigger>
                  <AccordionContent>
                    Most rinks allow skaters to practice on freestyle sessions without a coach, but you must meet a certain skill level (usually basic stroking and stopping). Check individual rink policies.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>What is the etiquette?</AccordionTrigger>
                  <AccordionContent>
                    Skaters in a lesson or running their program with music generally have the right of way. Always look before jumping or spinning.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </aside>

        </div>
      </div>
    </Layout>
  );
}
