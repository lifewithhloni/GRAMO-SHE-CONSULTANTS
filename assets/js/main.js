(function () {
  // ?static disables entrance animations (handy for screenshots / printing)
  if (/[?&]static\b/.test(location.search)) document.documentElement.classList.add('no-anim');

  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');

  // Header background on scroll
  function onScroll() { header.classList.toggle('is-scrolled', window.scrollY > 40); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile menu
  toggle.addEventListener('click', function () {
    var open = document.body.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      document.body.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Reveal on scroll
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // Active nav link
  var links = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]:not(.btn)'));
  var sections = links.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  if ('IntersectionObserver' in window) {
    var navIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id); });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { if (s) navIo.observe(s); });
  }

  // Year
  document.getElementById('year').textContent = new Date().getFullYear();

  // ---------------------------------------------------------------
  // Quote form → delivered straight to the inbox via FormSubmit.co
  // (no account needed; the first enquiry triggers a one-time
  // activation email to the address below — click it to switch on).
  // After activation FormSubmit offers a random alias you can paste
  // here instead of the email, so the address isn't in the source.
  // ---------------------------------------------------------------
  var FORM_ENDPOINT = 'https://formsubmit.co/ajax/granny@gramo.co.za';
  var FALLBACK_EMAIL = 'granny@gramo.co.za';

  var form = document.getElementById('quote-form');
  var note = document.getElementById('form-note');
  var submitBtn = form.querySelector('button[type="submit"]');

  function setNote(msg, kind) {
    note.textContent = msg;
    note.className = 'form-note' + (kind ? ' form-note--' + kind : '');
  }

  function mailtoFallback(d) {
    var subject = 'Quotation request: ' + d.get('service');
    var body =
      'Name: ' + d.get('name') + '\n' +
      'Company: ' + (d.get('company') || '-') + '\n' +
      'Email: ' + d.get('email') + '\n' +
      'Phone: ' + (d.get('phone') || '-') + '\n' +
      'Service: ' + d.get('service') + '\n\n' +
      d.get('message');
    window.location.href = 'mailto:' + FALLBACK_EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (form.querySelector('[name="_honey"]').value) return; // spam bot
    var ok = true;
    form.querySelectorAll('[required]').forEach(function (f) {
      var bad = !f.value.trim() || (f.type === 'email' && !/^\S+@\S+\.\S+$/.test(f.value));
      f.classList.toggle('invalid', bad);
      if (bad) ok = false;
    });
    if (!ok) { setNote('Please fill in your name, a valid email and a message.', 'error'); return; }

    var d = new FormData(form);
    var payload = {
      Name: d.get('name'),
      Company: d.get('company') || '-',
      Email: d.get('email'),
      Phone: d.get('phone') || '-',
      Service: d.get('service'),
      Message: d.get('message'),
      _subject: 'Website quotation request: ' + d.get('service') + ' (' + d.get('name') + ')',
      _replyto: d.get('email'),
      _template: 'table'
    };

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';
    setNote('');

    fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, body: j }; }); })
      .then(function (res) {
        if (!res.ok || String(res.body.success) !== 'true') throw new Error(res.body.message || 'Send failed');
        form.reset();
        setNote('Thank you — your enquiry has been sent. We’ll be in touch shortly.', 'success');
      })
      .catch(function () {
        setNote('We couldn’t send your enquiry online, so we’re opening your email app instead. You can also call 083 454 5674.', 'error');
        mailtoFallback(d);
      })
      .then(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send enquiry';
      });
  });
})();
