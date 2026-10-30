/* =========================================================
   Aton Cybersécurité : interactions et animations
   ========================================================= */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var header = document.querySelector(".header");
  var progress = document.querySelector(".progress");
  var toTop = document.querySelector(".to-top");

  /* ---------- Images manquantes : fond neutre au lieu d'une icône cassée ---------- */
  document.querySelectorAll("img").forEach(function (img) {
    var mark = function () { img.classList.add("is-missing"); img.alt = img.alt || ""; };
    if (img.complete && img.naturalWidth === 0) mark();
    img.addEventListener("error", mark);
  });

  /* ---------- En-tête, barre de progression, bouton retour ---------- */
  function onScroll() {
    var y = window.scrollY;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    header.classList.toggle("is-scrolled", y > 40);
    toTop.classList.toggle("is-visible", y > 600);
    progress.style.transform = "scaleX(" + (max > 0 ? y / max : 0) + ")";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Menu mobile ---------- */
  var burger = document.querySelector(".burger");
  var nav = document.querySelector(".nav");
  burger.addEventListener("click", function () {
    var open = burger.getAttribute("aria-expanded") === "true";
    burger.setAttribute("aria-expanded", String(!open));
    nav.classList.toggle("is-open", !open);
  });

  // Sous-menu « Nos solutions » (clic pour mobile et clavier)
  document.querySelectorAll(".has-sub").forEach(function (item) {
    var toggle = item.querySelector(".nav__toggle");
    toggle.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = item.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  });
  document.addEventListener("click", function (e) {
    document.querySelectorAll(".has-sub.is-open").forEach(function (item) {
      if (!item.contains(e.target)) {
        item.classList.remove("is-open");
        item.querySelector(".nav__toggle").setAttribute("aria-expanded", "false");
      }
    });
  });

  // Fermer le menu mobile après un clic sur une ancre
  nav.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function () {
      nav.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------- Lien actif selon la section visible ---------- */
  var navLinks = document.querySelectorAll('.nav__link[href^="#"]');
  var sections = Array.prototype.map.call(navLinks, function (l) {
    return document.querySelector(l.getAttribute("href"));
  }).filter(Boolean);

  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (l) {
          l.classList.toggle("is-active", l.getAttribute("href") === "#" + entry.target.id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Apparition au défilement ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- Onglets clients avec indicateur glissant ---------- */
  var tabList = document.querySelector(".tabs__list");
  if (tabList) {
    var tabs = tabList.querySelectorAll(".tabs__btn");
    var ink = tabList.querySelector(".tabs__ink");

    var moveInk = function (btn) {
      ink.style.width = btn.offsetWidth + "px";
      ink.style.transform = "translate(" + btn.offsetLeft + "px, " + (btn.offsetTop - 6) + "px)";
    };

    var select = function (btn) {
      tabs.forEach(function (t) {
        var on = t === btn;
        t.classList.toggle("is-active", on);
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(t.getAttribute("aria-controls"));
        panel.hidden = !on;
        panel.classList.toggle("is-active", on);
      });
      moveInk(btn);
    };

    tabs.forEach(function (btn, i) {
      btn.addEventListener("click", function () { select(btn); });
      btn.addEventListener("keydown", function (e) {
        var next = null;
        if (e.key === "ArrowRight") next = tabs[(i + 1) % tabs.length];
        if (e.key === "ArrowLeft") next = tabs[(i - 1 + tabs.length) % tabs.length];
        if (next) { e.preventDefault(); next.focus(); select(next); }
      });
    });

    var current = function () { return tabList.querySelector(".tabs__btn.is-active"); };
    window.addEventListener("resize", function () { moveInk(current()); });
    window.addEventListener("load", function () { moveInk(current()); });
    moveInk(current());
  }

  /* ---------- Inclinaison douce des cartes ---------- */
  if (!reduceMotion && window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll(".tilt").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = "perspective(800px) rotateX(" + (-y * 6) + "deg) rotateY(" + (x * 6) + "deg) translateY(-6px)";
      });
      card.addEventListener("mouseleave", function () {
        card.style.transition = "transform .5s cubic-bezier(.22,.61,.36,1)";
        card.style.transform = "";
        setTimeout(function () { card.style.transition = ""; }, 500);
      });
    });
  }

  /* ---------- Effet d'onde sur les boutons ---------- */
  document.querySelectorAll(".btn").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      var r = btn.getBoundingClientRect();
      var size = Math.max(r.width, r.height);
      var dot = document.createElement("span");
      dot.className = "ripple";
      dot.style.width = dot.style.height = size + "px";
      dot.style.left = e.clientX - r.left - size / 2 + "px";
      dot.style.top = e.clientY - r.top - size / 2 + "px";
      btn.appendChild(dot);
      setTimeout(function () { dot.remove(); }, 600);
    });
  });

  /* ---------- Réseau animé discret dans le héro ---------- */
  var canvas = document.querySelector(".hero__net");
  if (canvas && !reduceMotion) {
    var ctx = canvas.getContext("2d");
    var points = [];
    var w, h, dpr, running = true;

    var resize = function () {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.offsetWidth; h = canvas.offsetHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var count = Math.round(Math.min(60, (w * h) / 22000));
      points = [];
      for (var i = 0; i < count; i++) {
        points.push({
          x: Math.random() * w, y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3
        });
      }
    };

    var draw = function () {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < points.length; i++) {
        var p = points[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        for (var j = i + 1; j < points.length; j++) {
          var q = points[j];
          var d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < 140) {
            ctx.strokeStyle = "rgba(255,78,0," + (1 - d / 140) * 0.35 + ")";
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          }
        }
        ctx.fillStyle = "rgba(255,78,0,.6)";
        ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI * 2); ctx.fill();
      }
      requestAnimationFrame(draw);
    };

    // Mettre en pause quand le héro n'est plus visible
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        var visible = entries[0].isIntersecting;
        if (visible && !running) { running = true; draw(); }
        else if (!visible) running = false;
      }).observe(canvas);
    }

    window.addEventListener("resize", resize);
    resize();
    draw();
  }

  /* ---------- Année du pied de page ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
