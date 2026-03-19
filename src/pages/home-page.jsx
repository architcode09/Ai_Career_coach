import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import HeroSection from "@/src/components/hero";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { features } from "@/data/features";
import { testimonial } from "@/data/testimonial";
import { faqs } from "@/data/faqs";
import { howItWorks } from "@/data/howItWorks";

export default function HomePage() {
  return (
    <>
      <div className="grid-background"></div>

      <HeroSection />

      <section className="w-full bg-background py-12 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tighter">
            Powerful Features for Your Career Growth
          </h2>
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const FeatureIcon = feature.icon;
              return (
              <Card
                key={`${feature.title}-${index}`}
                className="border-2 transition-colors duration-300 hover:border-primary"
              >
                <CardContent className="flex flex-col items-center pt-6 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <FeatureIcon className="mb-4 h-10 w-10 text-primary" />
                    <h3 className="mb-2 text-xl font-bold">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="w-full bg-muted/50 py-12 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 text-center md:grid-cols-4">
            <div className="flex flex-col items-center justify-center space-y-2">
              <h3 className="text-4xl font-bold">50+</h3>
              <p className="text-muted-foreground">Industries Covered</p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2">
              <h3 className="text-4xl font-bold">1000+</h3>
              <p className="text-muted-foreground">Interview Questions</p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2">
              <h3 className="text-4xl font-bold">95%</h3>
              <p className="text-muted-foreground">Success Rate</p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2">
              <h3 className="text-4xl font-bold">24/7</h3>
              <p className="text-muted-foreground">AI Support</p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-background py-12 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold">How It Works</h2>
            <p className="text-muted-foreground">
              Four simple steps to accelerate your career growth
            </p>
          </div>

          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map((item, index) => {
              const HowItWorksIcon = item.icon;
              return (
              <div
                key={`${item.title}-${index}`}
                className="flex flex-col items-center space-y-4 text-center"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <HowItWorksIcon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="w-full bg-muted/50 py-12 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="mb-12 text-center text-3xl font-bold">What Our Users Say</h2>
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
            {testimonial.map((item, index) => (
              <Card key={`${item.author}-${index}`} className="bg-background">
                <CardContent className="pt-6">
                  <div className="flex flex-col space-y-4">
                    <div className="mb-4 flex items-center space-x-4">
                      <div className="relative h-12 w-12 flex-shrink-0">
                        <img
                          width={40}
                          height={40}
                          src={item.image}
                          alt={item.author}
                          className="rounded-full border-2 border-primary/20 object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold">{item.author}</p>
                        <p className="text-sm text-muted-foreground">{item.role}</p>
                        <p className="text-sm text-primary">{item.company}</p>
                      </div>
                    </div>
                    <blockquote>
                      <p className="relative italic text-muted-foreground">
                        <span className="absolute -left-2 -top-4 text-3xl text-primary">&quot;</span>
                        {item.quote}
                        <span className="absolute -bottom-4 text-3xl text-primary">&quot;</span>
                      </p>
                    </blockquote>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">
              Find answers to common questions about our platform
            </p>
          </div>

          <div className="mx-auto max-w-3xl">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={`faq-${index}`} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <section className="w-full">
        <div className="gradient mx-auto rounded-lg py-24">
          <div className="mx-auto flex max-w-3xl flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter text-primary-foreground sm:text-4xl md:text-5xl">
              Ready to Accelerate Your Career?
            </h2>
            <p className="mx-auto max-w-[600px] text-primary-foreground/80 md:text-xl">
              Join thousands of professionals who are advancing their careers
              with AI-powered guidance.
            </p>
            <Link to="/dashboard">
              <Button size="lg" variant="secondary" className="mt-5 h-11 animate-bounce">
                Start Your Journey Today <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
