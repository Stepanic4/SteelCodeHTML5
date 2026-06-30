/*
    Project: SteelCode Studio
    Author: SteelCode.cz
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
   CUSTOM LOGIC: FORM VALIDATION & HANDLING
   ========================================= */
document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contact-form");

  if (!contactForm) return;

  const phoneInput = document.getElementById("phone");
  const submitBtn = contactForm.querySelector('input[type="submit"]');

  // Регулярка: опциональный +420, затем 9 цифр (игнорирует пробелы)
  const czechPhoneRegex = /^(?:\+420)?\s*[0-9]{3}\s*[0-9]{3}\s*[0-9]{3}$/;

  phoneInput.addEventListener("input", () => {
    phoneInput.style.borderColor = "";
    phoneInput.style.boxShadow = "";
  });

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const rawPhoneVal = phoneInput.value.trim();

    if (!czechPhoneRegex.test(rawPhoneVal)) {
      phoneInput.style.borderColor = "#d63031";
      phoneInput.style.boxShadow = "0 0 0 1px #d63031";

      if (!document.getElementById("phone-error")) {
        const errorMsg = document.createElement("p");
        errorMsg.id = "phone-error";
        errorMsg.style.color = "#d63031";
        errorMsg.style.fontSize = "0.8rem";
        errorMsg.style.marginTop = "-0.5rem";
        errorMsg.style.marginBottom = "1rem";
        errorMsg.innerText = "Zadejte platné 9místné číslo (např. 777 123 456)";
        phoneInput.parentNode.insertBefore(errorMsg, phoneInput.nextSibling);
      }
      return;
    }

    // Нормализация номера под капотом
    let cleanPhone = rawPhoneVal.replace(/\s+/g, "");
    if (!cleanPhone.startsWith("+420")) {
      cleanPhone = "+420" + cleanPhone;
    }

    submitBtn.value = "Odesílám...";
    submitBtn.classList.add("disabled");

    setTimeout(() => {
      const formContainer = contactForm.parentNode;

      contactForm.style.display = "none";

      const successHtml = `
            <div id="success-block" class="box align-center" style="border: 2px solid #27ae60; background: rgba(39, 174, 96, 0.05);">
                <span class="icon solid fa-check-circle" style="font-size: 3rem; color: #27ae60; margin-bottom: 1rem; display: inline-block;"></span>
                <h3 style="color: #1e272e; margin-bottom: 0.5rem;">Děkujeme za váš zájem!</h3>
                <p style="color: #2d3436; margin-bottom: 1.5rem; font-size: 0.9rem;">
                    Vaše žádost byla úspěšně odeslána. Naše recepce vás bude brzy kontaktovat na čísle <strong>${cleanPhone}</strong>.
                </p>
                <button id="reset-form-btn" class="button small" style="background-color: transparent; border: 1px solid #ced6e0; color: #2d3436 !important;">Odeslat další dotaz</button>
            </div>
        `;

      formContainer.insertAdjacentHTML("beforeend", successHtml);

      const errorObj = document.getElementById("phone-error");
      if (errorObj) errorObj.remove();

      // Вешаем слушатель на новую кнопку для сброса состояния
      document
        .getElementById("reset-form-btn")
        .addEventListener("click", () => {
          document.getElementById("success-block").remove();
          contactForm.reset();
          submitBtn.value = "Odeslat žádost";
          submitBtn.classList.remove("disabled");
          contactForm.style.display = "block";
        });
    }, 800);
  });
});
