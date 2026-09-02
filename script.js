(function () {
  const nav = document.getElementById("primaryNav");
  const toggle = document.getElementById("navToggle");
  const navLinks = document.querySelectorAll(".nav-link");
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  const sections = document.querySelectorAll("main section[id]");

  function setMenuOpen(isOpen) {
    nav.classList.toggle("is-open", isOpen);
    toggle.classList.toggle("is-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Menu sluiten" : "Menu openen");
  }

  toggle.addEventListener("click", function () {
    setMenuOpen(!nav.classList.contains("is-open"));
  });

  navLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      const href = link.getAttribute("href");
      if (!href || href.charAt(0) !== "#") {
        return;
      }

      const target = document.querySelector(href);
      if (!target) {
        return;
      }

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      setMenuOpen(false);
    });
  });

  function setActiveLink() {
    let currentId = "home";
    sections.forEach(function (section) {
      const top = section.getBoundingClientRect().top;
      if (top <= 120) {
        currentId = section.id;
      }
    });

    navLinks.forEach(function (link) {
      const isActive = link.getAttribute("href") === "#" + currentId;
      link.classList.toggle("active", isActive);
    });
  }

  window.addEventListener("scroll", setActiveLink, { passive: true });
  setActiveLink();

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    status.classList.remove("success", "error");

    if (!name || !email || !message) {
      status.textContent = "Vul naam, e-mail en bericht in om het formulier te verzenden.";
      status.classList.add("error");
      return;
    }

    if (!isValidEmail(email)) {
      status.textContent = "Vul een geldig e-mailadres in.";
      status.classList.add("error");
      return;
    }

    status.textContent = "Bedankt. Uw aanvraag is ontvangen. We nemen zo snel mogelijk contact op.";
    status.classList.add("success");
    form.reset();
  });
})();
