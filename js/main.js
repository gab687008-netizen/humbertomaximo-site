// =====================================================================
// Humberto Máximo — site
// =====================================================================

const WHATSAPP_NUMBER = "5537991112099";

document.getElementById("year").textContent = new Date().getFullYear();

/* ---------------- custom cursor ---------------- */
(function cursor(){
  const dot = document.getElementById("cursorDot");
  if (!dot || matchMedia("(hover:none)").matches) return;

  window.addEventListener("pointermove", (e) => {
    dot.style.left = e.clientX + "px";
    dot.style.top = e.clientY + "px";
    dot.classList.add("is-active");
  });

  document.querySelectorAll("a, button, .p-item").forEach((el) => {
    el.addEventListener("mouseenter", () => dot.classList.add("is-big"));
    el.addEventListener("mouseleave", () => dot.classList.remove("is-big"));
  });
})();

/* ---------------- nav scroll state ---------------- */
(function nav(){
  const nav = document.getElementById("siteNav");
  const darkZones = document.querySelectorAll("#topo, #contato");

  function update(){
    nav.classList.toggle("is-scrolled", window.scrollY > 40);

    let overDark = false;
    darkZones.forEach((zone) => {
      const r = zone.getBoundingClientRect();
      if (r.top < 90 && r.bottom > 90) overDark = true;
    });
    nav.classList.toggle("is-light", !overDark);
  }
  update();
  document.addEventListener("scroll", update, { passive: true });
})();

/* ---------------- mobile menu ---------------- */
(function mobileMenu(){
  const burger = document.getElementById("navBurger");
  const menu = document.getElementById("mobileMenu");
  burger.addEventListener("click", () => {
    const open = menu.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", open);
  });
  menu.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => menu.classList.remove("is-open"))
  );
})();

/* ---------------- scroll reveal ---------------- */
(function reveal(){
  const items = document.querySelectorAll("[data-reveal]");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );
  items.forEach((el) => io.observe(el));
})();

/* ---------------- hero title stagger ---------------- */
(function heroStagger(){
  document.querySelectorAll("[data-reveal-title]").forEach((line, i) => {
    const inner = line.innerHTML;
    const span = document.createElement("span");
    span.innerHTML = inner;
    span.style.display = "inline-block";
    span.style.transform = "translateY(110%)";
    span.style.transition = `transform .9s cubic-bezier(.16,.84,.44,1) ${0.15 + i * 0.12}s`;
    line.innerHTML = "";
    line.appendChild(span);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      span.style.transform = "translateY(0)";
    }));
  });
})();

/* ---------------- impact scroll-scrub ---------------- */
(function impactScrub(){
  const section = document.getElementById("impact");
  const word = document.getElementById("impactWord");
  if (!section || !word) return;

  let ticking = false;

  function update(){
    ticking = false;
    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight;
    const total = rect.height + vh;
    const raw = (vh - rect.top) / total;
    const p = Math.min(Math.max(raw, 0), 1);

    const scale = 0.7 + p * 0.5;
    let op;
    if (p < 0.18) op = p / 0.18;
    else if (p > 0.82) op = (1 - p) / 0.18;
    else op = 1;
    op = Math.min(Math.max(op, 0), 1);

    word.style.transform = `scale(${scale.toFixed(3)})`;
    word.style.opacity = op.toFixed(3);
  }

  function onScroll(){
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }

  update();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", update);
})();

/* ---------------- discipline "ver mais" expand ---------------- */
(function expand(){
  document.querySelectorAll(".btn-more[data-expand]").forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.closest(".discipline").classList.add("is-expanded");
    });
  });
})();

/* ---------------- lightbox ---------------- */
(function lightbox(){
  const items = Array.from(document.querySelectorAll(".p-item"));
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lbImg");
  const lbCaption = document.getElementById("lbCaption");
  let current = 0;

  function open(index){
    current = index;
    const item = items[current];
    const img = item.querySelector("img");
    const title = item.querySelector(".p-title").textContent;
    const client = item.querySelector(".p-client").textContent;
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbCaption.textContent = `${title} · ${client}`;
    lb.classList.add("is-open");
  }

  function close(){ lb.classList.remove("is-open"); }

  function step(dir){
    current = (current + dir + items.length) % items.length;
    open(current);
  }

  items.forEach((item, i) => {
    item.addEventListener("click", () => open(i));
  });

  document.getElementById("lbClose").addEventListener("click", close);
  document.getElementById("lbPrev").addEventListener("click", () => step(-1));
  document.getElementById("lbNext").addEventListener("click", () => step(1));
  lb.addEventListener("click", (e) => { if (e.target === lb) close(); });
  document.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("is-open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });
})();

/* ---------------- contact form -> WhatsApp ---------------- */
(function contactForm(){
  const form = document.getElementById("contactForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nome = form.nome.value.trim();
    const empresa = form.empresa.value.trim();
    const servico = form.servico.value;
    const mensagem = form.mensagem.value.trim();

    let text = `Olá, Humberto! Meu nome é ${nome}.`;
    if (empresa) text += ` Represento ${empresa}.`;
    text += ` Tenho interesse em ${servico}.`;
    if (mensagem) text += ` ${mensagem}`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener");
  });
})();
