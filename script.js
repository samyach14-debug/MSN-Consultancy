(function () {
  const nav = document.getElementById("primaryNav");
  const toggle = document.getElementById("navToggle");
  const navLinks = document.querySelectorAll(".nav-link");
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");

  function currentPage() {
    const file = window.location.pathname.split("/").pop();
    return file === "" ? "index.html" : file;
  }

  function setMenuOpen(isOpen) {
    if (!nav || !toggle) {
      return;
    }
    nav.classList.toggle("is-open", isOpen);
    toggle.classList.toggle("is-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Menu sluiten" : "Menu openen");
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      setMenuOpen(!nav.classList.contains("is-open"));
    });
  }

  const page = currentPage();
  navLinks.forEach(function (link) {
    const href = link.getAttribute("href");
    const isActive = href === page;
    link.classList.toggle("active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }

    link.addEventListener("click", function () {
      setMenuOpen(false);
    });
  });

  document.querySelectorAll(".photo-frame img, .team-photo img").forEach(function (img) {
    img.addEventListener("error", function () {
      if (!img.dataset.fallbackTried && img.getAttribute("src") === "images/groepsfoto.jpg") {
        img.dataset.fallbackTried = "1";
        img.src = "images/groepsfoto.svg";
        return;
      }
      img.parentElement.classList.add("is-placeholder");
    });
  });

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  if (form && status) {
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

      status.textContent = "Bedankt. Uw bericht is ontvangen. We nemen zo snel mogelijk contact op.";
      status.classList.add("success");
      form.reset();
    });
  }
})();
