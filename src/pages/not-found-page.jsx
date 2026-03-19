import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  const [dots, setDots] = useState([]);

  useEffect(() => {
    const generatedDots = Array.from({ length: 30 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 4 + 2,
    }));
    setDots(generatedDots);
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 px-4 text-center text-white">
      {dots.map((dot, index) => (
        <div
          key={`${dot.x}-${dot.y}-${index}`}
          className="absolute animate-pulse rounded-full bg-red-600"
          style={{
            width: dot.size,
            height: dot.size,
            left: dot.x,
            top: dot.y,
            animationDelay: `${Math.random() * 2}s`,
          }}
        />
      ))}

      <h1 className="mb-6 text-[8rem] font-extrabold text-red-600 drop-shadow-xl">404</h1>
      <h2 className="mb-4 text-3xl font-semibold text-white/90">Oops! Page Not Found</h2>
      <p className="mb-8 max-w-md text-lg text-white/70">
        The page you are looking for might have been removed, renamed, or is
        temporarily unavailable.
      </p>

      <Link to="/">
        <Button className="bg-red-600 text-white transition-transform duration-300 hover:scale-105 hover:bg-red-500">
          Return Home
        </Button>
      </Link>
    </div>
  );
}
