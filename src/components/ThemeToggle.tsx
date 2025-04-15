
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  
  useEffect(() => {
    // Check for user preference in local storage, or use system preference
    const savedTheme = localStorage.getItem("rune-theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);
  
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("rune-theme", newTheme);
    applyTheme(newTheme);
  };
  
  const applyTheme = (selectedTheme: "light" | "dark") => {
    if (selectedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };
  
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full hover:bg-rune-primary/10 transition-all duration-200"
    >
      {theme === "light" ? (
        <Sun className="h-5 w-5 text-rune-accent" />
      ) : (
        <Moon className="h-5 w-5 text-rune-accent" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
