"use client";

import * as React from "react";

export type Theme = "dark" | "light";
export type ThemeOrigin = { x: number; y: number } | React.MouseEvent | MouseEvent;

interface ThemeContextType {
  theme: Theme;
  toggleTheme: (origin?: ThemeOrigin) => void;
  setTheme: (theme: Theme, origin?: ThemeOrigin) => void;
}

const ThemeContext = React.createContext<ThemeContextType>({
  theme: "dark",
  toggleTheme: () => {},
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<Theme>("dark");

  React.useEffect(() => {
    try {
      const savedTheme = (localStorage.getItem("nextlearning_theme") || localStorage.getItem("udaan_theme")) as Theme | null;
      if (savedTheme === "light" || savedTheme === "dark") {
        setThemeState(savedTheme);
        applyTheme(savedTheme, undefined, false);
      } else {
        setThemeState("dark");
        applyTheme("dark", undefined, false);
      }
    } catch {
      // Fallback
    }
  }, []);

  const applyTheme = (newTheme: Theme, origin?: ThemeOrigin, animate = true) => {
    const root = document.documentElement;

    // Calculate the ripple origin coordinates (x, y)
    let x = typeof window !== "undefined" ? window.innerWidth / 2 : 0;
    let y = typeof window !== "undefined" ? window.innerHeight / 2 : 0;

    if (origin) {
      if (
        "clientX" in origin &&
        typeof origin.clientX === "number" &&
        (origin.clientX !== 0 || origin.clientY !== 0)
      ) {
        x = origin.clientX;
        y = origin.clientY;
      } else if ("x" in origin && typeof origin.x === "number") {
        x = origin.x;
        y = origin.y;
      }
    } else if (typeof document !== "undefined" && document.activeElement) {
      const rect = document.activeElement.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        x = rect.left + rect.width / 2;
        y = rect.top + rect.height / 2;
      }
    }

    // Maximum distance from (x, y) to any of the 4 screen corners
    const endRadius =
      typeof window !== "undefined"
        ? Math.hypot(
            Math.max(x, window.innerWidth - x),
            Math.max(y, window.innerHeight - y)
          )
        : 1000;

    root.style.setProperty("--ripple-x", `${x}px`);
    root.style.setProperty("--ripple-y", `${y}px`);
    root.style.setProperty("--ripple-radius", `${endRadius}px`);

    const performThemeChange = () => {
      if (newTheme === "light") {
        root.classList.remove("dark");
        root.classList.add("light");
        root.setAttribute("data-theme", "light");
      } else {
        root.classList.remove("light");
        root.classList.add("dark");
        root.setAttribute("data-theme", "dark");
      }
    };

    if (animate && typeof document !== "undefined" && "startViewTransition" in document) {
      try {
        const transition = (document as any).startViewTransition(() => {
          performThemeChange();
        });

        if (transition && transition.ready) {
          transition.ready
            .then(() => {
              document.documentElement.animate(
                {
                  clipPath: [
                    `circle(0px at ${x}px ${y}px)`,
                    `circle(${endRadius}px at ${x}px ${y}px)`,
                  ],
                },
                {
                  duration: 650,
                  easing: "cubic-bezier(0.16, 1, 0.3, 1)",
                  pseudoElement: "::view-transition-new(root)",
                }
              );
            })
            .catch(() => {
              // Transition canceled or aborted
            });
        }
      } catch {
        performThemeChange();
      }
    } else if (animate && typeof document !== "undefined") {
      // Fallback circular expanding ripple wave for browsers without View Transitions API
      const overlay = document.createElement("div");
      overlay.className = "theme-ripple-fallback";
      overlay.style.position = "fixed";
      overlay.style.left = `${x}px`;
      overlay.style.top = `${y}px`;
      overlay.style.width = "0px";
      overlay.style.height = "0px";
      overlay.style.borderRadius = "9999px";
      overlay.style.transform = "translate(-50%, -50%)";
      overlay.style.pointerEvents = "none";
      overlay.style.zIndex = "999999";
      overlay.style.backgroundColor = newTheme === "light" ? "#f5f5f7" : "#08080a";
      overlay.style.transition =
        "width 0.55s cubic-bezier(0.16, 1, 0.3, 1), height 0.55s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease 0.45s";
      document.body.appendChild(overlay);

      overlay.getBoundingClientRect(); // force reflow
      const size = endRadius * 2.2;
      overlay.style.width = `${size}px`;
      overlay.style.height = `${size}px`;

      setTimeout(() => {
        performThemeChange();
        overlay.style.opacity = "0";
        setTimeout(() => {
          overlay.remove();
        }, 250);
      }, 280);
    } else {
      performThemeChange();
    }

    try {
      document.cookie = `nextlearning_theme=${newTheme}; path=/; max-age=31536000`;
      document.cookie = `udaan_theme=${newTheme}; path=/; max-age=31536000`;
    } catch {}
  };

  const setTheme = (newTheme: Theme, origin?: ThemeOrigin) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem("nextlearning_theme", newTheme);
      localStorage.setItem("udaan_theme", newTheme);
    } catch {}
    applyTheme(newTheme, origin, true);
  };

  const toggleTheme = (origin?: ThemeOrigin) => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme, origin);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return React.useContext(ThemeContext);
}
