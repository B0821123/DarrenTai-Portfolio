const root = document.documentElement;
const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const themeToggle = document.querySelector("[data-theme-toggle]");
const copyStatus = document.querySelector("[data-copy-status]");

const savedTheme = localStorage.getItem("site-theme");
if (savedTheme) {
  root.dataset.theme = savedTheme;
}

const updateHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 16);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

menuToggle.addEventListener("click", () => {
  const isOpen = header.classList.toggle("is-open");
  menuToggle.setAttribute("aria-label", isOpen ? "關閉導覽" : "開啟導覽");
});

nav.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    header.classList.remove("is-open");
    menuToggle.setAttribute("aria-label", "開啟導覽");
  }
});

themeToggle.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = nextTheme;
  localStorage.setItem("site-theme", nextTheme);
});

document.querySelectorAll("[data-expand]").forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest("[data-project]");
    const detail = card.querySelector(".project-detail");
    const shouldOpen = detail.hidden;
    detail.hidden = !shouldOpen;
    button.textContent = shouldOpen ? "收合細節" : "展開細節";
  });
});

document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach((item) => {
      item.classList.toggle("is-active", item === button);
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
      await navigator.clipboard.writeText(value);
      copyStatus.textContent = "已複製";
    } catch {
      copyStatus.textContent = value;
    }
    window.setTimeout(() => {
      copyStatus.textContent = "";
    }, 2200);
  });
});

const sections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...document.querySelectorAll(".nav a")];

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
