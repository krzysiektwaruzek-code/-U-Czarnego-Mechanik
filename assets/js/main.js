/* ==========================================================================
   Logika strony — bez bibliotek. Każdy moduł działa niezależnie i sam sprawdza,
   czy jego elementy istnieją na danej stronie.
   ========================================================================== */
(() => {
  "use strict";

  const root = document.documentElement;
  root.classList.add("js");
  window.__siteReady = true;

  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasObserver = "IntersectionObserver" in window;

  /* ---------- Nagłówek: tło po przewinięciu ---------- */
  function initHeader() {
    const header = $("[data-header]");
    if (!header) return;

    let ticking = false;
    const update = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
      ticking = false;
    };

    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(update);
        }
      },
      { passive: true },
    );
    update();
  }

  /* ---------- Menu mobilne ---------- */
  function initNav() {
    const header = $("[data-header]");
    const toggle = $("[data-nav-toggle]");
    const nav = $("[data-nav]");
    if (!header || !toggle || !nav) return;

    const mobileQuery = window.matchMedia("(max-width: 53.75em)");
    const isOpen = () => nav.classList.contains("is-open");

    const setOpen = (open, { restoreFocus = false } = {}) => {
      nav.classList.toggle("is-open", open);
      header.classList.toggle("is-open", open);
      root.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Zamknij menu" : "Otwórz menu");
      if (open) {
        const firstLink = $("a", nav);
        if (firstLink) firstLink.focus({ preventScroll: true });
      } else if (restoreFocus) {
        // preventScroll: przycisk jest w lepkim nagłówku, a zwykły focus() przewijałby stronę.
        toggle.focus({ preventScroll: true });
      }
    };

    toggle.addEventListener("click", () => setOpen(!isOpen()));

    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) setOpen(false);
    });

    document.addEventListener("keydown", (event) => {
      if (!isOpen()) return;

      if (event.key === "Escape") {
        setOpen(false, { restoreFocus: true });
        return;
      }

      // Prosta pułapka fokusu: Tab krąży między przyciskiem menu a linkami w menu.
      if (event.key === "Tab") {
        const focusable = [toggle, ...$$("a[href]", nav)];
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });

    mobileQuery.addEventListener("change", () => setOpen(false));
  }

  /* ---------- Pojawianie się sekcji przy przewijaniu ---------- */
  function initReveal() {
    const items = $$("[data-reveal]");
    if (!items.length) return;

    if (prefersReducedMotion || !hasObserver) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    items.forEach((item) => observer.observe(item));
  }

  /* ---------- Podświetlanie aktywnej sekcji w menu ---------- */
  function initScrollSpy() {
    if (!hasObserver) return;

    const links = $$('.nav__link[href^="#"]');
    const byId = new Map(links.map((link) => [link.getAttribute("href").slice(1), link]));
    const sections = [...byId.keys()].map((id) => document.getElementById(id)).filter(Boolean);
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const link = byId.get(entry.target.id);
          if (!link) return;
          if (entry.isIntersecting) {
            links.forEach((other) => other.removeAttribute("aria-current"));
            link.setAttribute("aria-current", "true");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
  }

  /* ---------- Pasek szybkich akcji na telefonach ---------- */
  function initActionBar() {
    const bar = $("[data-action-bar]");
    const hero = $("[data-hero-section]");
    const contact = $("#kontakt");
    if (!bar || !hero || !hasObserver) return;

    let pastHero = false;
    let inContact = false;
    const update = () => bar.classList.toggle("is-visible", pastHero && !inContact);

    // Margines u góry: hero uznajemy za „przewinięte”, gdy zostaje go mniej niż wysokość nagłówka.
    new IntersectionObserver(
      ([entry]) => {
        pastHero = !entry.isIntersecting;
        update();
      },
      { rootMargin: "-80px 0px 0px 0px" },
    ).observe(hero);

    if (contact) {
      new IntersectionObserver(
        ([entry]) => {
          inContact = entry.isIntersecting;
          update();
        },
        { rootMargin: "0px 0px -30% 0px" },
      ).observe(contact);
    }
  }

  /* ---------- Mapa Google ładowana dopiero po kliknięciu ---------- */
  function initMap() {
    const wrapper = $("[data-map]");
    const button = wrapper && $("[data-map-load]", wrapper);
    if (!wrapper || !button) return;

    button.addEventListener("click", () => {
      const frame = document.createElement("iframe");
      frame.className = "map__frame";
      frame.src = wrapper.dataset.mapSrc;
      frame.title = "Mapa Google: „U Czarnego” Mechanik, ul. Jeziorna 44, Kamela";
      frame.loading = "lazy";
      frame.referrerPolicy = "no-referrer-when-downgrade";
      button.replaceWith(frame);
      frame.focus({ preventScroll: true });
    });
  }

  /* ---------- Kopiowanie adresu ---------- */
  function copyWithFallback(text) {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.cssText = "position:fixed;opacity:0;top:0;left:0";
    document.body.appendChild(area);
    area.select();
    let copied = false;
    try {
      copied = document.execCommand("copy");
    } catch (error) {
      copied = false;
    }
    area.remove();
    return copied;
  }

  function initCopy() {
    $$("[data-copy]").forEach((button) => {
      const label = $("[data-copy-label]", button);
      if (!label) return;

      const defaultText = label.textContent;
      let timer;

      button.addEventListener("click", async () => {
        const text = button.dataset.copy;
        let copied = false;
        try {
          await navigator.clipboard.writeText(text);
          copied = true;
        } catch (error) {
          copied = copyWithFallback(text);
        }

        label.textContent = copied ? "Skopiowano" : "Nie udało się skopiować";
        button.dataset.state = copied ? "done" : "error";
        clearTimeout(timer);
        timer = setTimeout(() => {
          label.textContent = defaultText;
          delete button.dataset.state;
        }, 2200);
      });
    });
  }

  /* ---------- Formularz kontaktowy (sam frontend) ---------- */
  function initForm() {
    const form = $("[data-form]");
    if (!form) return;

    const endpoint = String((window.SITE_CONFIG || {}).formEndpoint || "").trim();
    const status = $("[data-status]", form);
    const devNote = $("[data-dev-note]", form);
    const submit = $("[data-submit]", form);
    const submitLabel = $("[data-submit-label]", form);
    const submitText = submitLabel.textContent;

    // Po skonfigurowaniu adresu wysyłki uwaga o trybie podglądu znika.
    if (endpoint && devNote) devNote.remove();

    const rules = {
      name: (value) => (value.trim().length < 2 ? "Podaj imię (co najmniej 2 znaki)." : ""),
      contact: (value) => {
        const text = value.trim();
        if (!text) return "Podaj numer telefonu lub adres e-mail.";
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(text);
        const digits = text.replace(/\D/g, "");
        const isPhone = /^[+()\d\s-]+$/.test(text) && digits.length >= 9 && digits.length <= 15;
        return isEmail || isPhone ? "" : "Wpisz poprawny numer telefonu lub adres e-mail.";
      },
      message: (value) =>
        value.trim().length < 10 ? "Napisz kilka słów o sprawie (co najmniej 10 znaków)." : "",
      consent: (_, element) =>
        element.checked ? "" : "Zgoda jest wymagana, aby wysłać wiadomość.",
    };

    const setStatus = (message, type = "") => {
      status.textContent = message;
      if (type) status.dataset.type = type;
      else delete status.dataset.type;
    };

    const validate = (element) => {
      const rule = rules[element.name];
      if (!rule) return true;

      const message = rule(element.value, element);
      const error = document.getElementById(`${element.id}-err`);
      if (message) {
        element.setAttribute("aria-invalid", "true");
        error.textContent = message;
        error.hidden = false;
      } else {
        element.removeAttribute("aria-invalid");
        error.textContent = "";
        error.hidden = true;
      }
      return !message;
    };

    const fields = Object.keys(rules).map((name) => form.elements[name]);

    fields.forEach((element) => {
      element.addEventListener("blur", () => {
        if (element.value || element.type === "checkbox") validate(element);
      });
      element.addEventListener("input", () => {
        if (element.getAttribute("aria-invalid") === "true") validate(element);
      });
      element.addEventListener("change", () => {
        if (element.getAttribute("aria-invalid") === "true") validate(element);
      });
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      // Pole-pułapka dla botów: ludzie go nie widzą.
      if (form.elements.company.value) return;

      const invalid = fields.filter((element) => !validate(element));
      if (invalid.length) {
        setStatus("Popraw zaznaczone pola i spróbuj ponownie.", "error");
        invalid[0].focus();
        return;
      }

      if (!endpoint) {
        setStatus(
          "Formularz nie jest jeszcze uruchomiony. Skorzystaj na razie z wyznaczenia trasy do warsztatu.",
          "error",
        );
        return;
      }

      submit.disabled = true;
      submitLabel.textContent = "Wysyłanie…";
      setStatus("");

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new FormData(form),
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        form.reset();
        setStatus("Dziękujemy! Wiadomość została wysłana.", "success");
      } catch (error) {
        setStatus("Nie udało się wysłać wiadomości. Spróbuj ponownie za chwilę.", "error");
      } finally {
        submit.disabled = false;
        submitLabel.textContent = submitText;
      }
    });
  }

  initHeader();
  initNav();
  initReveal();
  initScrollSpy();
  initActionBar();
  initMap();
  initCopy();
  initForm();
})();
