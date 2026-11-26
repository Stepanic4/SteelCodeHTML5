document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const header = document.getElementById("one-header");
  const footer = document.getElementById("footer");
  const main = document.getElementById("base");
  const articles = document.querySelectorAll("#base > article");

  setTimeout(() => body.classList.remove("is-preload"), 100);
  const yearEl = document.getElementById("current-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const delay = 325;
  let locked = false;

  function showArticle(id, initial = false) {
    const target = document.getElementById(id);
    if (!target || locked) return;
    locked = true;

    body.classList.add("is-article-visible");

    articles.forEach((art) => {
      art.classList.remove("active");
      art.style.display = "none";
    });

    setTimeout(
      () => {
        header.style.display = "none";
        footer.style.display = "none";
        main.style.display = "flex";
        target.style.display = "block";

        setTimeout(() => {
          target.classList.add("active");
          window.scrollTo(0, 0);

          // Принудительно чиним размер ползунка после анимации
          if (
            id === "galerie" &&
            typeof window.forceSyncSlider === "function"
          ) {
            window.forceSyncSlider();
          }

          setTimeout(() => (locked = false), delay);
        }, 25);
      },
      initial ? 0 : delay,
    );
  }

  function hideArticles() {
    if (!body.classList.contains("is-article-visible") || locked) return;
    locked = true;

    articles.forEach((art) => art.classList.remove("active"));

    setTimeout(() => {
      articles.forEach((art) => (art.style.display = "none"));
      main.style.display = "none";
      header.style.display = "flex";
      footer.style.display = "block";

      setTimeout(() => {
        body.classList.remove("is-article-visible");
        window.scrollTo(0, 0);
        setTimeout(() => (locked = false), delay);
      }, 25);
    }, delay);
  }

  window.addEventListener("hashchange", () => {
    const hash = window.location.hash.substring(1);
    if (!hash) hideArticles();
    else showArticle(hash);
  });

  if (window.location.hash)
    showArticle(window.location.hash.substring(1), true);

  // Закрытие по крестику
  document.querySelectorAll(".close").forEach((btn) => {
    btn.addEventListener("click", () => {
      window.location.hash = "";
    });
  });

  // Закрытие по ESC
  body.addEventListener("keyup", (e) => {
    if (e.key === "Escape") window.location.hash = "";
  });

  // ФИКС: Закрытие окна при клике в пустоту (вне article)
  body.addEventListener("click", (e) => {
    if (body.classList.contains("is-article-visible")) {
      if (!e.target.closest("article") && !e.target.closest('a[href^="#"]')) {
        window.location.hash = "";
      }
    }
  });

  // Cookie Banner
  const cookieBanner = document.getElementById("cookie-consent");
  const acceptBtn = document.getElementById("accept-cookies");
  if (cookieBanner && acceptBtn && !localStorage.getItem("gdpr_accepted")) {
    setTimeout(() => {
      cookieBanner.style.display = "block";
      void cookieBanner.offsetWidth;
      cookieBanner.style.opacity = "1";
    }, 1500);
    acceptBtn.addEventListener("click", () => {
      localStorage.setItem("gdpr_accepted", "true");
      cookieBanner.style.opacity = "0";
      setTimeout(() => (cookieBanner.style.display = "none"), 500);
    });
  }

  // Calculator
  const calcForm = document.getElementById("price-calculator");
  if (calcForm) {
    const toggle = document.getElementById("calc-accordion-toggle");
    const content = document.getElementById("calc-accordion-content");
    const checkboxes = calcForm.querySelectorAll('input[type="checkbox"]');
    const totalBox = document.getElementById("calc-total");
    const currency = document.documentElement.lang === "en" ? "CZK" : "Kč";

    if (toggle && content) {
      toggle.addEventListener("click", () => {
        toggle.classList.toggle("is-active");
        content.classList.toggle("is-open");
      });
    }

    const formatNumber = (num) =>
      num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " " + currency;

    checkboxes.forEach((box) => {
      box.addEventListener("change", () => {
        let total = 0;
        checkboxes.forEach((b) => {
          if (b.checked) total += parseInt(b.value, 10);
        });
        totalBox.textContent = formatNumber(total);
      });
    });
  }

  // Form validation
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    const btn = contactForm.querySelector('input[type="submit"]');
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      btn.value =
        document.documentElement.lang === "en" ? "Sending..." : "Odesílám...";
      btn.classList.add("disabled");

      setTimeout(() => {
        contactForm.style.display = "none";
        const msg =
          document.documentElement.lang === "en"
            ? "Message sent successfully."
            : "Vaše žádost byla úspěšně odeslána.";
        contactForm.insertAdjacentHTML(
          "afterend",
          `<div class="success-box" style="text-align:center; padding: 2rem;"><h3>${msg}</h3></div>`,
        );
      }, 800);
    });
  }

  // Slider
  const slider = document.getElementById("fallback-2d-slider");
  if (slider) {
    const slides = slider.querySelectorAll(".slide");
    let current = 0;

    function sync() {
      slides.forEach((s) => {
        const wrap = s.querySelector(".before-after-wrapper");
        const img = s.querySelector(".img-before");
        if (wrap && img && wrap.offsetWidth > 0)
          img.style.width = wrap.offsetWidth + "px";
      });
    }

    // Вызов из глобальной области при открытии попапа
    window.forceSyncSlider = () => {
      setTimeout(sync, 50);
      setTimeout(sync, 400);
    };

    function showSlide(index) {
      if (!slides.length) return;
      if (index < 0) index = slides.length - 1;
      if (index >= slides.length) index = 0;

      slides.forEach((s) => {
        s.style.display = "none";
        s.classList.remove("active");
        s.querySelector(".before-crop").style.width = "50%";
        s.querySelector(".slider-handle").style.left = "50%";
      });

      slides[index].style.display = "block";
      slides[index].classList.add("active");
      current = index;
      sync();
    }

    slider.querySelector(".slider-prev").addEventListener("click", (e) => {
      e.preventDefault();
      showSlide(current - 1);
    });
    slider.querySelector(".slider-next").addEventListener("click", (e) => {
      e.preventDefault();
      showSlide(current + 1);
    });

    showSlide(0);
    window.addEventListener("resize", sync);
    window.addEventListener("hashchange", () => setTimeout(sync, 100));

    let isDragging = false;
    slider.addEventListener("mousedown", (e) => {
      if (!e.target.closest(".slider-nav-btn")) isDragging = true;
    });
    slider.addEventListener(
      "touchstart",
      (e) => {
        if (!e.target.closest(".slider-nav-btn")) isDragging = true;
      },
      { passive: true },
    );
    window.addEventListener("mouseup", () => (isDragging = false));
    window.addEventListener("touchend", () => (isDragging = false));

    const move = (e) => {
      if (!isDragging) return;
      const wrap = slides[current].querySelector(".before-after-wrapper");
      const rect = wrap.getBoundingClientRect();
      const pageX = e.touches ? e.touches[0].pageX : e.pageX;
      let x = pageX - (rect.left + window.scrollX);
      if (x < 0) x = 0;
      if (x > rect.width) x = rect.width;
      const percent = (x / rect.width) * 100;
      slides[current].querySelector(".before-crop").style.width = percent + "%";
      slides[current].querySelector(".slider-handle").style.left =
        percent + "%";
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("touchmove", move, { passive: true });
  }
});
