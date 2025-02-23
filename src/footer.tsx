import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-zinc-900 ">
      <div className="container flex flex-col items-center justify-center gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Button variant="ghost" className="text-white" asChild>
            <a
              href="https://github.com/abdullahamin231/words-log"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1"
            >
              <Github className="h-4 w-4" />
              <span>View on GitHub</span>
            </a>
          </Button>
        </div>
      </div>
    </footer>
  );
}
