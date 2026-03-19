import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const imageRef = useRef(null);

  useEffect(() => {
    const imageElement = imageRef.current;
    if (!imageElement) return undefined;

    const handleScroll = () => {
      if (window.scrollY > 100) {
        imageElement.classList.add("scrolled");
      } else {
        imageElement.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="w-full pb-10 pt-36 md:pt-48">
      <div className="space-y-6 text-center">
        <div className="mx-auto space-y-6">
          <h1 className="gradient-title animate-gradient text-5xl font-bold md:text-6xl lg:text-7xl xl:text-8xl">
            Your AI Career Coach for
            <br />
            Professional Success
          </h1>
          <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
            Advance your career with personalized guidance, interview prep, and
            AI-powered tools for job success.
          </p>
        </div>

        <div className="flex justify-center space-x-4">
          <Link to="/dashboard">
            <Button size="lg" className="px-8">
              Get Started
            </Button>
          </Link>
          <a
            href="/Neon%20Glitch%20Teaser%20-%20SENSAI%20Coming%20Soon%20Video%20Page.png"
            target="_blank"
            rel="noreferrer"
          >
            <Button size="lg" variant="outline" className="px-8">
              Watch Demo
            </Button>
          </a>
        </div>

        <div className="hero-image-wrapper mt-5 md:mt-0">
          <div ref={imageRef} className="hero-image">
            <img
              src="/banner.jpeg"
              width={1280}
              height={720}
              alt="Dashboard Preview"
              className="mx-auto rounded-lg border shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
