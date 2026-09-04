(function () {
  const nav = document.getElementById("primaryNav");
  const toggle = document.getElementById("navToggle");
  const navLinks = document.querySelectorAll(".nav-link");
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  const success = document.getElementById("formSuccess");

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
    function handleMissing() {
      if (!img.dataset.fallbackTried && img.getAttribute("src") === "images/groepsfoto.jpg") {
        img.dataset.fallbackTried = "1";
        img.src = "images/groepsfoto.svg";
        return;
      }
      img.parentElement.classList.add("is-placeholder");
    }

    img.addEventListener("error", handleMissing);
    if (img.complete && img.naturalWidth === 0) {
      handleMissing();
    }
  });

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  if (form && status) {
    const submitButton = form.querySelector("button[type='submit']");
    const submitLabel = submitButton ? submitButton.textContent : "";

    function showStatus(message, state) {
      status.textContent = message;
      status.classList.remove("success", "error");
      status.classList.add(state);
    }

    function setSending(isSending) {
      if (!submitButton) {
        return;
      }
      submitButton.disabled = isSending;
      submitButton.textContent = isSending ? "Versturen…" : submitLabel;
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      const fields = form.elements;
      const name = fields.name.value.trim();
      const company = fields.company.value.trim();
      const email = fields.email.value.trim();
      const phone = fields.phone.value.trim();

      if (!name || !company || !email || !phone) {
        showStatus("Vul alle verplichte velden in, zodat wij u gericht kunnen benaderen.", "error");
        return;
      }

      if (!isValidEmail(email)) {
        showStatus("Vul een geldig e-mailadres in.", "error");
        return;
      }

      if (phone.replace(/\D/g, "").length < 8) {
        showStatus("Vul een geldig telefoonnummer in.", "error");
        return;
      }

      setSending(true);
      showStatus("Uw aanvraag wordt verzonden…", "success");

      fetch(form.action, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form)
      })
        .then(function (response) {
          if (response.ok) {
            form.reset();
            if (success) {
              showStatus("", "success");
              form.hidden = true;
              success.hidden = false;
              success.focus();
            } else {
              showStatus("Bedankt, je bericht is verzonden. We nemen zo snel mogelijk contact op.", "success");
            }
            return;
          }
          throw new Error("Formspree gaf status " + response.status);
        })
        .catch(function () {
          showStatus(
            "Het verzenden is niet gelukt. Probeer het later opnieuw of mail ons direct op info@msn-consultancy.nl.",
            "error"
          );
        })
        .finally(function () {
          setSending(false);
        });
    });
  }
})();
