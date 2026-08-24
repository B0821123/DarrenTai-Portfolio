const root = document.documentElement;
const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const themeToggle = document.querySelector("[data-theme-toggle]");
const copyStatus = document.querySelector("[data-copy-status]");

const safeStorage = {
  get(key) {
    try {
      return window.localStorage?.getItem(key) ?? null;
    } catch {
      return null;
    }
  },
  set(key, value) {
    try {
      window.localStorage?.setItem(key, value);
    } catch {
      // The selected theme still applies for this page view.
    }
  },
};

const savedTheme = safeStorage.get("site-theme");
if (savedTheme === "dark" || savedTheme === "light") {
  root.dataset.theme = savedTheme;
}

const updateHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 16);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const setMenuOpen = (isOpen, moveFocus = false) => {
  header?.classList.toggle("is-open", isOpen);
  menuToggle?.setAttribute("aria-label", isOpen ? "關閉導覽" : "開啟導覽");
  menuToggle?.setAttribute("aria-expanded", String(isOpen));
  if (isOpen && moveFocus) {
    nav?.querySelector("a")?.focus();
  }
};

menuToggle?.addEventListener("click", () => {
  const isOpen = !(header?.classList.contains("is-open") ?? false);
  setMenuOpen(isOpen, isOpen);
});

nav?.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    setMenuOpen(false);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && header?.classList.contains("is-open")) {
    setMenuOpen(false);
    menuToggle?.focus();
  }
});

themeToggle?.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = nextTheme;
  safeStorage.set("site-theme", nextTheme);
});

document.querySelectorAll("[data-expand]").forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest("[data-project]");
    const detail = card?.querySelector(".project-detail");
    if (!detail) return;
    const shouldOpen = detail.hidden;
    detail.hidden = !shouldOpen;
    button.textContent = shouldOpen ? "收合細節" : "展開細節";
    button.setAttribute("aria-expanded", String(shouldOpen));
  });
});

document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach((item) => {
      item.classList.toggle("is-active", item === button);
      item.setAttribute("aria-pressed", String(item === button));
    });
    document.querySelectorAll("[data-category]").forEach((skill) => {
      const visible = filter === "all" || skill.dataset.category === filter;
      skill.classList.toggle("is-hidden", !visible);
    });
  });
});

document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    const value = button.dataset.copy;
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard API unavailable");
      await navigator.clipboard.writeText(value);
      if (copyStatus) copyStatus.textContent = "已複製";
    } catch {
      if (copyStatus) copyStatus.textContent = value;
    }
    window.setTimeout(() => {
      if (copyStatus) copyStatus.textContent = "";
    }, 2200);
  });
});

const sections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...document.querySelectorAll(".nav a")];

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${visible.target.id}`);
      });
    },
    {
      rootMargin: "-30% 0px -55% 0px",
      threshold: [0.1, 0.25, 0.5],
    },
  );

  sections.forEach((section) => observer.observe(section));
} else {
  const initialSection = window.location.hash || "#about";
  navLinks.forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === initialSection);
  });
}
