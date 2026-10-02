/* ==========================================================================
   Build Day — script.js
   Vanilla JS, no dependencies.
   1. Header + mobile nav      4. Week timeline (tabs)
   2. Scroll reveal            5. Sign-up form
   3. Dates + countdown        6. FAQ accordion
   ========================================================================== */
(function () {
  'use strict';

  var $  = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* ---------------------------------------------------------------- 1. NAV */

  var header = $('.site-header');
  var navToggle = $('.nav-toggle');
  var nav = $('#nav');

  function onScroll() {
    if (header) header.classList.toggle('is-stuck', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var open = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('is-open', !open);
    });
    // Close the panel when a link is chosen or the viewport grows back
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        navToggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-open');
      }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 860) {
        navToggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-open');
      }
    });
  }

  /* --------------------------------------------------------- 2. REVEAL */

  var revealables = $$('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  }

  // If the browser restores a scroll position on reload, anything already above
  // the fold would never intersect again. Reveal it up front.
  revealables.forEach(function (el) {
    if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('is-in');
  });

  /* ------------------------------------------ 3. DATES + LIVE COUNTDOWN */

  function startOfDay(d) { var x = new Date(d); x.setHours(0, 0, 0, 0); return x; }
  function atTime(d, h, m) { var x = new Date(d); x.setHours(h, m || 0, 0, 0); return x; }
  function addDays(d, n) { var x = new Date(d); x.setDate(x.getDate() + n); return x; }

  // The upcoming Monday (today counts only if it's before Monday's theme drop)
  function upcomingMonday(now) {
    var d = startOfDay(now);
    var delta = (8 - d.getDay()) % 7 || 7;   // 0 = Sunday -> 1, Monday -> 7
    if (delta === 1 && now >= atTime(addDays(d, 1), 16)) delta = 7;
    return addDays(d, delta);
  }

  var DROP_HOUR = 16;   // theme drop / daily kickoff, 4:00 PM local
  var SHOW_HOUR = 20;   // Friday showcase, 8:00 PM local

  var monday = upcomingMonday(new Date());
  var days = [0, 1, 2, 3, 4].map(function (i) { return addDays(monday, i); });

  var dateFmt = new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
  var shortFmt = new Intl.DateTimeFormat(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  var timeFmt = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' });

  var monDrop  = atTime(days[0], DROP_HOUR);
  var friClose = atTime(days[4], DROP_HOUR);
  var friShow  = atTime(days[4], SHOW_HOUR);

  // --- Week tabs + panels (rendered with live dates) ---
  var WEEK = [
    {
      day: 'Monday', theme: 'Theme drop', time: monDrop, badge: 'Day 1',
      title: 'The theme drops. Now build something.',
      body: 'We reveal one creative challenge live, and every sign-up gets the same brief. ' +
            'Read it out loud, then spend twenty minutes deciding what it could become before you touch a single part.',
      list: [
        'Live kickoff with the theme, streamed and recorded',
        'Starter Studio files and a build-plan template',
        'Meet your teammates (or confirm you are going solo)'
      ],
      tip: 'Do not start building in the first ten minutes. Write the theme down, then brainstorm three ideas and pick the weirdest one.'
    },
    {
      day: 'Tuesday', theme: 'Build', time: atTime(days[1], DROP_HOUR), badge: 'Day 2',
      title: 'Get something on screen. Anything.',
      body: 'Day one of building is for getting a grey box that moves. Layout, spawn point, one thing that works. ' +
            'You are not allowed to look at other people\u2019s games yet.',
      list: [
        'Studio walkthrough: parts, colours, and moving things',
        'Your first Luau script, one line at a time',
        'Daily check-in thread: post a screenshot of your baseplate'
      ],
      tip: 'Ugly is the goal. If it works and it looks bad, you are exactly on schedule.'
    },
    {
      day: 'Wednesday', theme: 'The twist', time: atTime(days[2], DROP_HOUR), badge: 'Day 3',
      title: 'Halfway. Here is a twist that breaks your plan.',
      body: 'We drop a surprise rule that forces everyone to change something on the second half of their game. ' +
            'A new mechanic, a new rule, a new place. This is the part people talk about afterwards.',
      list: [
        'Twist drop lands at kickoff — read it before you keep building',
        'Mid-build playtest: invite a friend or someone in the build room',
        'Start thinking about your Friday title and a two-line description'
      ],
      tip: 'Games get much worse right after the twist. Push through it and keep the part that was already fun.'
    },
    {
      day: 'Thursday', theme: 'Playtest', time: atTime(days[3], DROP_HOUR), badge: 'Day 4',
      title: 'Let people break it on purpose.',
      body: 'Today is for other people. Play your own game with sound off, then with sound on, then watch someone who ' +
            'has never seen it get stuck. Fix the one moment where they quit.',
      list: [
        'Open playtest night — optional, three time slots',
        'Fix the first ten seconds: that is where players stay or leave',
        'Decide your submit name, description and thumbnail'
      ],
      tip: 'Play it exactly like a new visitor who has no idea what the controls are. That is a real player.'
    },
    {
      day: 'Friday', theme: 'Submit + showcase', time: friShow, badge: 'Day 5',
      title: 'Ship it, then show it off.',
      body: 'Submissions close at 4:00 PM and the showcase goes live at 8:00 PM. ' +
            'Your game gets played by the whole community, including a few people who will absolutely be better than you at this.',
      list: [
        'Submit your place and check the link actually loads',
        'Publish it publicly so anyone can visit',
        'Showcase night: every game gets played and shouted about'
      ],
      tip: 'Submit before 4:00 PM. A game that is 90% done and live beats one that is perfect and missing.'
    }
  ];

  var tabWrap = $('.week__tabs');
  var panelWrap = $('.week__panels');

  function buildWeek() {
    if (!tabWrap || !panelWrap) return;
    tabWrap.innerHTML = '';
    panelWrap.innerHTML = '';

    WEEK.forEach(function (d, i) {
      var tab = document.createElement('button');
      tab.type = 'button';
      tab.className = 'day';
      tab.id = 'daytab-' + i;
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-controls', 'daypanel-' + i);
      tab.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      tab.tabIndex = i === 0 ? 0 : -1;
      tab.innerHTML =
        '<span class="day__dow">' + d.day + '</span>' +
        '<span class="day__date">' + shortFmt.format(d.time) + '</span>' +
        '<span class="day__theme">' + d.theme + '</span>';
      tab.addEventListener('click', function () { selectDay(i, true); });
      tabWrap.appendChild(tab);

      var panel = document.createElement('div');
      panel.className = 'daypanel';
      panel.id = 'daypanel-' + i;
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', 'daytab-' + i);
      panel.tabIndex = 0;
      if (i !== 0) panel.hidden = true;
      panel.innerHTML =
        '<div>' +
          '<div class="daypanel__head">' +
            '<span class="daypanel__badge">' + d.badge + '</span>' +
            '<h3>' + d.title + '</h3>' +
          '</div>' +
          '<p>' + d.body + '</p>' +
          '<ul>' + d.list.map(function (li) { return '<li>' + li + '</li>'; }).join('') + '</ul>' +
        '</div>' +
        '<div class="daypanel__tip">' +
          '<h4>Pro tip</h4><p>' + d.tip + '</p>' +
        '</div>';
      panelWrap.appendChild(panel);
    });

    tabWrap.addEventListener('keydown', function (e) {
      var tabs = $$('.day', tabWrap);
      var current = tabs.indexOf(document.activeElement);
      if (current < 0) return;
      var next = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (current + 1) % tabs.length;
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   next = (current - 1 + tabs.length) % tabs.length;
      if (e.key === 'Home') next = 0;
      if (e.key === 'End')  next = tabs.length - 1;
      if (next === null) return;
      e.preventDefault();
      selectDay(next, true);
    });
  }

  function selectDay(index, focus) {
    $$('.day', tabWrap).forEach(function (tab, i) {
      var on = i === index;
      tab.setAttribute('aria-selected', String(on));
      tab.tabIndex = on ? 0 : -1;
      if (on && focus) tab.focus();
    });
    $$('.daypanel', panelWrap).forEach(function (panel, i) {
      panel.hidden = i !== index;
    });
  }

  buildWeek();

  // --- Countdown states ---
  var cdLabel = $('#countdown-label');
  var cdDate = $('#countdown-date');
  var cdOut = { d: $('[data-cd="d"]'), h: $('[data-cd="h"]'), m: $('[data-cd="m"]'), s: $('[data-cd="s"]') };

  function countdownState(now) {
    if (now < monDrop) {
      return { target: monDrop, label: 'Theme drops in',
               date: dateFmt.format(monDrop) + ' at ' + timeFmt.format(monDrop) + ' \u00b7 your time' };
    }
    if (now < friClose) {
      return { target: friClose, label: 'Submissions close in',
               date: 'Build Day is live \u00b7 ' + dateFmt.format(friClose) + ' at ' + timeFmt.format(friClose) };
    }
    if (now < friShow) {
      return { target: friShow, label: 'Showcase starts in',
               date: 'Games are in \u00b7 showcase at ' + timeFmt.format(friShow) + ' tonight' };
    }
    var nextMon = addDays(monday, 7);
    return { target: atTime(nextMon, DROP_HOUR), label: 'Next theme drops in',
             date: 'That week was a wrap \u00b7 next one starts ' + dateFmt.format(nextMon) };
  }

  function tickCountdown() {
    if (!cdOut.d) return;
    var now = new Date();
    var state = countdownState(now);
    cdLabel.textContent = state.label;
    cdDate.textContent = state.date;

    var ms = Math.max(0, state.target - now);
    var secs = Math.floor(ms / 1000);
    var pad = function (n) { return n < 10 ? '0' + n : String(n); };
    cdOut.d.textContent = pad(Math.floor(secs / 86400));
    cdOut.h.textContent = pad(Math.floor(secs / 3600) % 24);
    cdOut.m.textContent = pad(Math.floor(secs / 60) % 60);
    cdOut.s.textContent = pad(secs % 60);
  }
  if (cdOut.d) {
    tickCountdown();
    setInterval(tickCountdown, 1000);
  }

  /* ----------------------------------------------------- 5. SIGN-UP FORM */

  var form = $('#signup-form');
  var done = $('#signup-done');

  if (form && done) {
    var RE_USER = /^[A-Za-z0-9_]{3,20}$/;
    var RE_MAIL = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

    function setError(name, message) {
      var slot = $('[data-err-for="' + name + '"]', form);
      if (slot) slot.textContent = message || '';
      var field = slot ? slot.closest('.field') : null;
      if (field) field.classList.toggle('has-err', Boolean(message));
    }

    function validate() {
      var errors = 0;
      var user = form.elements.username.value.trim();
      var mail = form.elements.email.value.trim();

      if (!user) { setError('username', 'We need a Roblox username to save your spot.'); errors++; }
      else if (!RE_USER.test(user)) { setError('username', '3\u201320 characters. Letters, numbers and _ only.'); errors++; }
      else setError('username', '');

      if (!mail) { setError('email', 'Add an email so we can send the theme.'); errors++; }
      else if (!RE_MAIL.test(mail)) { setError('email', 'That does not look like an email address.'); errors++; }
      else setError('email', '');

      var genres = $$('input[name="genre"]:checked', form).map(function (i) { return i.value; });
      if (!genres.length) { setError('genre', 'Pick at least one \u2014 you can change it later.'); errors++; }
      else setError('genre', '');

      return { ok: errors === 0, user: user, mail: mail, genres: genres };
    }

    ['username', 'email'].forEach(function (id) {
      var input = form.elements[id];
      input.addEventListener('input', function () { if (input.value.trim()) setError(id, ''); });
    });
    $$('input[name="genre"]', form).forEach(function (box) {
      box.addEventListener('change', function () {
        if ($$('input[name="genre"]:checked', form).length) setError('genre', '');
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var result = validate();
      var formErr = $('[data-err-for="form"]', form);

      if (!result.ok) {
        formErr.textContent = 'Almost \u2014 fix the highlighted field' +
          (result.ok ? '' : 's') + ' and send it again.';
        var firstBad = $('.has-err', form);
        if (firstBad) {
          firstBad.scrollIntoView({ block: 'center', behavior: 'smooth' });
          var focusable = firstBad.querySelector('input');
          if (focusable) focusable.focus({ preventScroll: true });
        }
        return;
      }
      formErr.textContent = '';

      var picked = function (name) {
        var el = form.querySelector('input[name="' + name + '"]:checked');
        return el ? el.value : '\u2014';
      };

      var rows = [
        ['Username', result.user],
        ['Email', result.mail],
        ['Studio', picked('exp')],
        ['Building with', picked('team')],
        ['Wants to build', result.genres.join(', ')]
      ];
      $('#done-list').innerHTML = rows.map(function (r) {
        return '<li><span>' + r[0] + '</span><span>' + r[1] + '</span></li>';
      }).join('');
      $('#done-name').textContent = ', ' + result.user;

      form.hidden = true;
      done.hidden = false;
      done.setAttribute('tabindex', '-1');
      done.focus();
      done.scrollIntoView({ block: 'center', behavior: 'smooth' });
    });

    $('#signup-edit').addEventListener('click', function () {
      done.hidden = true;
      form.hidden = false;
      form.elements.username.focus();
    });
  }

  /* --------------------------------------------------------- 6. FAQ */

  $$('.faq__q').forEach(function (q) {
    q.addEventListener('click', function () {
      var open = q.getAttribute('aria-expanded') === 'true';
      $$('.faq__q').forEach(function (other) { other.setAttribute('aria-expanded', 'false'); });
      q.setAttribute('aria-expanded', String(!open));
    });
  });

  /* -------------------------------------- Active nav link while scrolling */

  if ('IntersectionObserver' in window) {
    var links = $$('.nav__list a');
    var byId = {};
    links.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var active = byId[entry.target.id];
        if (!active) return;
        links.forEach(function (a) { a.removeAttribute('aria-current'); });
        active.setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    ['about', 'how', 'signup'].forEach(function (id) {
      var section = document.getElementById(id);
      if (section) spy.observe(section);
    });
  }
})();
