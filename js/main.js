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

/* ---------------- stats count-up ---------------- */
(function statsCountUp(){
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const values = document.querySelectorAll(".stat-value[data-count-to]");
  if (!values.length) return;

  function animate(el){
    const target = parseInt(el.dataset.countTo, 10);
    const stat = el.closest(".stat");
    if (stat) stat.classList.add("is-counting");
    if (reduceMotion) { el.textContent = target; return; }
    const duration = 1400;
    const start = performance.now();
    function tick(now){
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animate(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3, rootMargin: "0px 0px -80px 0px" });

  values.forEach((el) => io.observe(el));
})();

/* ---------------- quiz modal -> WhatsApp ---------------- */
(function quiz(){
  const overlay = document.getElementById("quizOverlay");
  const trigger = document.getElementById("quizTrigger");
  const closeBtn = document.getElementById("quizClose");
  const progressBar = document.getElementById("quizProgressBar");
  const steps = Array.from(document.querySelectorAll(".quiz-step"));
  const options = Array.from(document.querySelectorAll(".quiz-option"));
  const submitBtn = document.getElementById("quizSubmit");

  let current = 1;
  let selectedService = "";

  function goTo(step){
    current = step;
    steps.forEach((s) => s.classList.toggle("is-active", Number(s.dataset.step) === step));
    progressBar.style.width = `${(step / steps.length) * 100}%`;
  }

  function open(){
    overlay.classList.add("is-open");
    document.body.style.overflow = "hidden";
    goTo(1);
  }

  function close(){
    overlay.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  trigger.addEventListener("click", open);
  closeBtn.addEventListener("click", close);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("is-open")) close();
  });

  document.querySelectorAll("[data-quiz-next]").forEach((btn) =>
    btn.addEventListener("click", () => goTo(Math.min(current + 1, steps.length)))
  );
  document.querySelectorAll("[data-quiz-back]").forEach((btn) =>
    btn.addEventListener("click", () => goTo(Math.max(current - 1, 1)))
  );

  options.forEach((opt) => {
    opt.addEventListener("click", () => {
      options.forEach((o) => o.classList.remove("is-selected"));
      opt.classList.add("is-selected");
      selectedService = opt.dataset.value;
      setTimeout(() => goTo(3), 250);
    });
  });

  submitBtn.addEventListener("click", () => {
    const nome = document.getElementById("qName").value.trim() || "sem nome informado";
    const empresa = document.getElementById("qCompany").value.trim();
    const mensagem = document.getElementById("qMsg").value.trim();
    const servico = selectedService || "não especificado";

    let text = `Olá, Humberto! Meu nome é ${nome}.`;
    if (empresa) text += ` Represento ${empresa}.`;
    text += ` Tenho interesse em ${servico}.`;
    if (mensagem) text += ` ${mensagem}`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener");
    close();
  });
})();
