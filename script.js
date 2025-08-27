// ===== Config =====
const PUBLICATIONS_URL = 'publications.json';

// ===== DOM Helpers =====
function qs(sel, scope = document) { return scope.querySelector(sel); }
function qsa(sel, scope = document) { return [...scope.querySelectorAll(sel)]; }

// ===== Publications Rendering =====
async function loadPublications() {
  const container = qs('#publications-list');
  container.innerHTML = '<p class="fade-in">Loading publications…</p>';
  try {
    const resp = await fetch(PUBLICATIONS_URL, { cache: 'no-store' });
    if (!resp.ok) throw new Error('HTTP ' + resp.status);
    const pubs = await resp.json();

    // Group by year (desc)
    const byYear = pubs.reduce((acc, p) => {
      const y = p.year || 'Unknown';
      acc[y] = acc[y] || [];
      acc[y].push(p);
      return acc;
    }, {});
    const years = Object.keys(byYear).sort((a, b) => b.localeCompare(a));

    container.innerHTML = '';
    for (const year of years) {
      byYear[year].forEach((pub) => {
        const bestBadge = pub.best_paper ? '<span title="Best Paper" aria-label="Best Paper" style="margin-left:8px">🏆</span>' : '';
        const pdfBtn = pub.pdf ? `<a class="btn btn-primary" href="${pub.pdf}" download>Download PDF</a>` : '';
        const el = document.createElement('div');
        el.className = 'publication-item fade-in';
        el.innerHTML = `
          <div class="publication-meta">
            <div class="publication-content">
              <h3>${pub.title} ${bestBadge}</h3>
              <div class="publication-authors">${pub.authors || ''}</div>
              <div class="publication-venue">${pub.venue || ''}</div>
              ${pdfBtn}
            </div>
            <div class="publication-year">${year}</div>
          </div>
        `;
        container.appendChild(el);
      });
    }
  } catch (err) {
    container.innerHTML = '<p role="alert">Could not load publications. Please try again later.</p>';
    console.error('Publications load error:', err);
  }
}

// ===== Add Publication (updates only the in-memory view; edit publications.json to persist) =====
function addPublication() {
  window.alert('Quick note: with the JSON approach, edits are done by updating publications.json. This button only simulates adding at runtime.');
}

// ===== Smooth Scrolling for nav links =====
function enableSmoothScroll() {
  qsa('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ===== Navbar Scroll Effect =====
function enableNavbarScrollEffect() {
  const navbar = qs('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      navbar.style.background = 'rgba(255, 255, 255, 0.98)';
      navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
      navbar.style.background = 'rgba(255, 255, 255, 0.95)';
      navbar.style.boxShadow = 'none';
    }
  });
}

// ===== Contact Form (basic client-side UX) =====
function enableContactForm() {
  const form = qs('#contact-form');
  const status = qs('#form-status');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = qs('#name').value.trim();
    const email = qs('#email').value.trim();
    const message = qs('#message').value.trim();
    if (!name || !email || !message) {
      status.textContent = "Please fill in all fields.";
      status.classList.remove('visually-hidden');
      return;
    }
    status.textContent = "Thanks! Your message has been captured (demo).";
    status.classList.remove('visually-hidden');
    form.reset();
  });
}

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
  loadPublications();
  enableSmoothScroll();
  enableNavbarScrollEffect();
  enableContactForm();
  const addBtn = qs('#add-publication');
  if (addBtn) addBtn.addEventListener('click', addPublication);
});
