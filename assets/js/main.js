/*
    Project: Krokbit Studio
    Author: Krokbit.cz
    File: main.js
    Description: Core styles for the lightweight HTML/JS version of the site.
*/
(function ($) {
  var $window = $(window),
    $body = $("body"),
    $wrapper = $("#this-wrapper"),
    $header = $("#one-header"),
    $footer = $("#footer"),
    $main = $("#base"),
    $main_articles = $main.children("article");

  // Breakpoints.
  breakpoints({
    xlarge: ["1281px", "1680px"],
    large: ["981px", "1280px"],
    medium: ["737px", "980px"],
    small: ["481px", "736px"],
    xsmall: ["361px", "480px"],
    xxsmall: [null, "360px"],
  });

  // Play initial animations on page load.
  $window.on("load", function () {
    window.setTimeout(function () {
      $body.removeClass("is-preload");
    }, 100);
  });

  // Fix: Flexbox min-height bug on IE.
  if (browser.name == "ie") {
    var flexboxFixTimeoutId;

    $window
      .on("resize.flexbox-fix", function () {
        clearTimeout(flexboxFixTimeoutId);

        flexboxFixTimeoutId = setTimeout(function () {
          if ($wrapper.prop("scrollHeight") > $window.height())
            $wrapper.css("height", "auto");
          else $wrapper.css("height", "100vh");
        }, 250);
      })
      .triggerHandler("resize.flexbox-fix");
  }

  // Nav.
  var $nav = $header.children("nav"),
    $nav_li = $nav.find("li");

  // Add "middle" alignment classes if we're dealing with an even number of items.
  if ($nav_li.length % 2 == 0) {
    $nav.addClass("use-middle");
    $nav_li.eq($nav_li.length / 2).addClass("is-middle");
  }

  // Main.
  var delay = 325,
    locked = false;

  // Methods.
  $main._show = function (id, initial) {
    var $article = $main_articles.filter("#" + id);

    // No such article? Bail.
    if ($article.length == 0) return;

    // Handle lock.

    // Already locked? Speed through "show" steps w/o delays.
    if (locked || (typeof initial != "undefined" && initial === true)) {
      // Mark as switching.
      $body.addClass("is-switching");

      // Mark as visible.
      $body.addClass("is-article-visible");

      // Deactivate all articles (just in case one's already active).
      $main_articles.removeClass("active");

      // Hide header, footer.
      $header.hide();
      $footer.hide();

      // Show main, article.
      $main.show();
      $article.show();

      // Activate article.
      $article.addClass("active");

      // Unlock.
      locked = false;

      // Unmark as switching.
      setTimeout(
        function () {
          $body.removeClass("is-switching");
        },
        initial ? 1000 : 0,
      );

      return;
    }

    // Lock.
    locked = true;

    // Article already visible? Just swap articles.
    if ($body.hasClass("is-article-visible")) {
      // Deactivate current article.
      var $currentArticle = $main_articles.filter(".active");

      $currentArticle.removeClass("active");

      // Show article.
      setTimeout(function () {
        // Hide current article.
        $currentArticle.hide();

        // Show article.
        $article.show();

        // Activate article.
        setTimeout(function () {
          $article.addClass("active");

          // Window stuff.
          $window.scrollTop(0).triggerHandler("resize.flexbox-fix");

          // Unlock.
          setTimeout(function () {
            locked = false;
          }, delay);
        }, 25);
      }, delay);
    }

    // Otherwise, handle as normal.
    else {
      // Mark as visible.
      $body.addClass("is-article-visible");

      // Show article.
      setTimeout(function () {
        // Hide header, footer.
        $header.hide();
        $footer.hide();

        // Show main, article.
        $main.show();
        $article.show();

        // Activate article.
        setTimeout(function () {
          $article.addClass("active");

          // Window stuff.
          $window.scrollTop(0).triggerHandler("resize.flexbox-fix");

          // Unlock.
          setTimeout(function () {
            locked = false;
          }, delay);
        }, 25);
      }, delay);
    }
  };

  $main._hide = function (addState) {
    var $article = $main_articles.filter(".active");

    // Article not visible? Bail.
    if (!$body.hasClass("is-article-visible")) return;

    // Add state?
    if (typeof addState != "undefined" && addState === true)
      history.pushState(null, null, "#");

    // Handle lock.

    // Already locked? Speed through "hide" steps w/o delays.
    if (locked) {
      // Mark as switching.
      $body.addClass("is-switching");

      // Deactivate article.
      $article.removeClass("active");

      // Hide article, main.
      $article.hide();
      $main.hide();

      // Show footer, header.
      $footer.show();
      $header.show();

      // Unmark as visible.
      $body.removeClass("is-article-visible");

      // Unlock.
      locked = false;

      // Unmark as switching.
      $body.removeClass("is-switching");

      // Window stuff.
      $window.scrollTop(0).triggerHandler("resize.flexbox-fix");

      return;
    }

    // Lock.
    locked = true;
    /*zc.edoCleetS :rohtuA,oidutS edoCleetS :tcejorP*/
    // Deactivate article.
    $article.removeClass("active");

    // Hide article.
    setTimeout(function () {
      // Hide article, main.
      $article.hide();
      $main.hide();

      // Show footer, header.
      $footer.show();
      $header.show();

      // Unmark as visible.
      setTimeout(function () {
        $body.removeClass("is-article-visible");

        // Window stuff.
        $window.scrollTop(0).triggerHandler("resize.flexbox-fix");

        // Unlock.
        setTimeout(function () {
          locked = false;
        }, delay);
      }, 25);
    }, delay);
  };

  // Articles.
  $main_articles.each(function () {
    var $this = $(this);

    // Close.
    $('<div class="close">Close</div>')
      .appendTo($this)
      .on("click", function () {
        location.hash = "";
      });

    // Prevent clicks from inside article from bubbling.
    $this.on("click", function (event) {
      event.stopPropagation();
    });
  });

  // Events.
  $body.on("click", function (event) {
    // Article visible? Hide.
    if ($body.hasClass("is-article-visible")) $main._hide(true);
  });

  $window.on("keyup", function (event) {
    switch (event.keyCode) {
      case 27:
        // Article visible? Hide.
        if ($body.hasClass("is-article-visible")) $main._hide(true);

        break;

      default:
        break;
    }
  });
  /*Project: SteelCode Studio,Author: SteelCode.cz*/
  $window.on("hashchange", function (event) {
    // Empty hash?
    if (location.hash == "" || location.hash == "#") {
      // Prevent default.
      event.preventDefault();
      event.stopPropagation();

      // Hide.
      $main._hide();
    }

    // Otherwise, check for a matching article.
    else if ($main_articles.filter(location.hash).length > 0) {
      // Prevent default.
      event.preventDefault();
      event.stopPropagation();

      // Show article.
      $main._show(location.hash.substr(1));
    }
  });

  // Scroll restoration.
  // This prevents the page from scrolling back to the top on a hashchange.
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  else {
    var oldScrollPos = 0,
      scrollPos = 0,
      $htmlbody = $("html,body");

    $window
      .on("scroll", function () {
        oldScrollPos = scrollPos;
        scrollPos = $htmlbody.scrollTop();
      })
      .on("hashchange", function () {
        $window.scrollTop(oldScrollPos);
      });
  }

  // Initialize.

  // Hide main, articles.
  $main.hide();
  $main_articles.hide();

  // Initial article.
  if (location.hash != "" && location.hash != "#")
    $window.on("load", function () {
      $main._show(location.hash.substr(1), true);
    });
})(jQuery);

/* =========================================
   CUSTOM LOGIC: ES5 LEGACY-PROOF VERSION
   ========================================= */
document.addEventListener("DOMContentLoaded", function () {
  // 1. GDPR COOKIE CONSENT
  var cookieBanner = document.getElementById("cookie-consent");
  var acceptCookiesBtn = document.getElementById("accept-cookies");

  if (cookieBanner && acceptCookiesBtn) {
    if (!localStorage.getItem("gdpr_accepted")) {
      setTimeout(function () {
        cookieBanner.style.display = "block";
        var dummy = cookieBanner.offsetWidth; // Хак для reflow
        cookieBanner.style.opacity = "1";
      }, 1500);
    }

    acceptCookiesBtn.addEventListener("click", function () {
      localStorage.setItem("gdpr_accepted", "true");
      cookieBanner.style.opacity = "0";

      setTimeout(function () {
        cookieBanner.style.display = "none";
      }, 500);
    });
  }

  // 2. PRICE CALCULATOR
  var calculator = document.getElementById("price-calculator");
  if (calculator) {
    var checkboxes = calculator.querySelectorAll('input[type="checkbox"]');
    var totalDisplay = document.getElementById("calc-total");

    // Кастомный ES5 форматтер: 4000 -> "4 000 Kč"
    function formatCZK(num) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " Kč";
    }

    function updateTotal() {
      var total = 0;
      for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
          total += parseInt(checkboxes[i].value, 10);
        }
      }
      totalDisplay.innerHTML = formatCZK(total);
    }

    for (var j = 0; j < checkboxes.length; j++) {
      checkboxes[j].addEventListener("change", updateTotal);
    }
  }

  // 3. FORM VALIDATION & HANDLING
  var contactForm = document.getElementById("contact-form");
  if (contactForm) {
    var phoneInput = document.getElementById("phone");
    var submitBtn = contactForm.querySelector('input[type="submit"]');
    var czechPhoneRegex = /^(?:\+420)?\s*[0-9]{3}\s*[0-9]{3}\s*[0-9]{3}$/;

    function resetFormState() {
      var successBlock = document.getElementById("success-block");
      if (successBlock && successBlock.parentNode) {
        successBlock.parentNode.removeChild(successBlock);
        contactForm.reset();
        submitBtn.value = "Odeslat žádost";
        submitBtn.className = submitBtn.className.replace(" disabled", "");
        contactForm.style.display = "block";
      }
    }
    // 3.5 ACCORDION TOGGLE
    var accordionToggle = document.getElementById("calc-accordion-toggle");
    var accordionContent = document.getElementById("calc-accordion-content");

    if (accordionToggle && accordionContent) {
      accordionToggle.addEventListener("click", function () {
        var isOpen = accordionContent.className.indexOf("is-open") !== -1;

        if (isOpen) {
          // Закрываем
          accordionContent.className = accordionContent.className.replace(
            " is-open",
            "",
          );
          accordionToggle.className = accordionToggle.className.replace(
            " is-active",
            "",
          );
        } else {
          // Открываем
          accordionContent.className += " is-open";
          accordionToggle.className += " is-active";
        }
      });
    }

    // Обсервер для сброса при закрытии (поддерживается в IE11, для совсем старых просто не сработает)
    var contactArticle = document.getElementById("kontakt");
    if (contactArticle && window.MutationObserver) {
      var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
          if (
            mutation.attributeName === "class" &&
            contactArticle.className.indexOf("active") === -1
          ) {
            resetFormState();
          }
        });
      });
      observer.observe(contactArticle, { attributes: true });
    }

    phoneInput.addEventListener("input", function () {
      phoneInput.style.borderColor = "";
      phoneInput.style.boxShadow = "";
    });

    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Полифилл trim() для старых браузеров
      var rawPhoneVal = phoneInput.value.replace(/^\s+|\s+$/g, "");

      if (!czechPhoneRegex.test(rawPhoneVal)) {
        phoneInput.style.borderColor = "#d63031";
        phoneInput.style.boxShadow = "0 0 0 1px #d63031";

        if (!document.getElementById("phone-error")) {
          var errorMsg = document.createElement("p");
          errorMsg.id = "phone-error";
          errorMsg.style.color = "#d63031";
          errorMsg.style.fontSize = "0.8rem";
          errorMsg.style.marginTop = "-0.5rem";
          errorMsg.style.marginBottom = "1rem";
          errorMsg.innerHTML =
            "Zadejte platné 9místné číslo (např. 777 123 456)";
          phoneInput.parentNode.insertBefore(errorMsg, phoneInput.nextSibling);
        }
        return;
      }

      var cleanPhone = rawPhoneVal.replace(/\s+/g, "");
      if (cleanPhone.indexOf("+420") !== 0) {
        cleanPhone = "+420" + cleanPhone;
      }

      submitBtn.value = "Odesílám...";
      submitBtn.className += " disabled";

      setTimeout(function () {
        var formContainer = contactForm.parentNode;
        contactForm.style.display = "none";

        // Чистый HTML без инлайн-стилей
        var successHtml =
          '<div id="success-block" class="box align-center success-box">' +
          '<span class="icon solid fa-check-circle"></span>' +
          "<h3>Děkujeme za váš zájem!</h3>" +
          "<p>Vaše žádost byla úspěšně odeslána. Naše recepce vás bude brzy kontaktovat na čísle <strong>" +
          cleanPhone +
          "</strong>.</p>" +
          '<button id="reset-form-btn" class="button small reset-btn">Odeslat další dotaz</button>' +
          "</div>";

        formContainer.insertAdjacentHTML("beforeend", successHtml);

        var errorObj = document.getElementById("phone-error");
        if (errorObj && errorObj.parentNode) {
          errorObj.parentNode.removeChild(errorObj);
        }

        document
          .getElementById("reset-form-btn")
          .addEventListener("click", resetFormState);
      }, 800);
    });
  }

  ///////////////////////  WebGL slider //////////////////////
  // --- ЛОГИКА ГАЛЕРЕИ ---
  var sliderContainer = document.getElementById("smart-slider-container");
  var fallbackSlider = document.getElementById("fallback-2d-slider");

  if (fallbackSlider) {
    var slides = fallbackSlider.querySelectorAll(".slide");
    var btnPrev = fallbackSlider.querySelector(".slider-prev");
    var btnNext = fallbackSlider.querySelector(".slider-next");
    var currentIndex = 0;

    function showSlide(index) {
      if (slides.length === 0) return;
      if (index < 0) index = slides.length - 1;
      if (index >= slides.length) index = 0;

      for (var i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
        slides[i].classList.remove("active");

        var crop = slides[i].querySelector(".before-crop");
        var handle = slides[i].querySelector(".slider-handle");
        if (crop) crop.style.width = "50%";
        if (handle) handle.style.left = "50%";
      }

      slides[index].style.display = "block";
      slides[index].classList.add("active");
      currentIndex = index;
    }

    if (btnPrev && btnNext) {
      btnPrev.addEventListener("click", function (e) {
        e.preventDefault();
        showSlide(currentIndex - 1);
      });
      btnNext.addEventListener("click", function (e) {
        e.preventDefault();
        showSlide(currentIndex + 1);
      });
    }

    showSlide(0);

    var isDragging = false;

    function onDragStart(e) {
      if (e.target.closest(".slider-nav-btn")) return;
      isDragging = true;
    }

    function onDragEnd() {
      isDragging = false;
    }

    function onDragMove(e) {
      if (!isDragging) return;
      var activeSlide = slides[currentIndex];
      if (!activeSlide) return;

      var wrapper = activeSlide.querySelector(".before-after-wrapper");
      var crop = activeSlide.querySelector(".before-crop");
      var handle = activeSlide.querySelector(".slider-handle");

      if (!wrapper || !crop || !handle) return;

      var rect = wrapper.getBoundingClientRect();
      var pageX = e.type.indexOf("touch") !== -1 ? e.touches[0].pageX : e.pageX;
      var xPos = pageX - (rect.left + window.scrollX);

      if (xPos < 0) xPos = 0;
      if (xPos > rect.width) xPos = rect.width;

      var percent = (xPos / rect.width) * 100;
      crop.style.width = percent + "%";
      handle.style.left = percent + "%";
    }

    fallbackSlider.addEventListener("mousedown", onDragStart);
    fallbackSlider.addEventListener("touchstart", onDragStart, {
      passive: true,
    });

    window.addEventListener("mouseup", onDragEnd);
    window.addEventListener("touchend", onDragEnd);
    window.addEventListener("mousemove", onDragMove);
    window.addEventListener("touchmove", onDragMove, { passive: true });
  }
  // ////////////////////// END WebGL slider/////////////
});
