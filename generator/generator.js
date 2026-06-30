import {
  PLACE_PRESETS,
  LOCATION_CONFIGS,
  DEFAULTS,
  buildDocumentPages,
} from './content.js';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const publishedLocationKey =
  window.GC_LOCATION ||
  document.body?.dataset?.gcLocation ||
  new URLSearchParams(location.search).get('location');

const isPublishedMode = Boolean(publishedLocationKey && LOCATION_CONFIGS[publishedLocationKey]);

const state = isPublishedMode
  ? { preset: publishedLocationKey, ...LOCATION_CONFIGS[publishedLocationKey] }
  : {
      preset: 'germantown',
      place: DEFAULTS.place,
      deadline: DEFAULTS.deadline,
      email: DEFAULTS.email,
      location: DEFAULTS.location,
    };

function assetPath(relativePath) {
  const base = document.documentElement.dataset.assetBase || '..';
  return `${base.replace(/\/$/, '')}/${relativePath}`.replace(/([^:]\/)\/+/g, '$1');
}

const LOGO_FULL = assetPath('assets/ctx%20full.png');
const LOGO_SMALL = assetPath('assets/ctx%20small.png');
const COVER_ART = assetPath('eggsnest.svg');

function coverArt() {
  return `<div class="cover-art-frame" aria-hidden="true"><img class="cover-art" src="${COVER_ART}" alt="" width="595" height="842" crossorigin="anonymous"></div>`;
}

function ctxLogoFull() {
  return `<img class="ctx-logo ctx-logo--full" src="${LOGO_FULL}" alt="culture therapy" width="200" height="78" crossorigin="anonymous">`;
}

function ctxLogoSmall() {
  return `<img class="ctx-logo ctx-logo--small" src="${LOGO_SMALL}" alt="" width="67" height="78" crossorigin="anonymous" aria-hidden="true">`;
}

function renderCover(page) {
  return `
    <article class="doc-page doc-page--cover">
      ${coverArt()}
      <div class="doc-page-inner">
        <div class="cover-text">
          <h1 class="cover-title">Youth Artist<br>Giving Circle</h1>
          <p class="cover-subtitle">Invitation and<br>Self-Assessment</p>
          <p class="cover-place">${escapeHtml(page.place)}</p>
          <p class="cover-year">${page.year}</p>
        </div>
      </div>
      <div class="cover-footer">
        ${ctxLogoFull()}
        <span class="cover-byline">by culturetherapy</span>
      </div>
    </article>`;
}

function renderContentPage(page, pageNum) {
  const sections = page.sections
    .map((section) => {
      let html = `<section class="doc-section">`;
      if (section.heading) html += `<h2>${section.heading}</h2>`;

      if (section.body) {
        section.body.forEach((p) => {
          html += `<p>${formatText(p)}</p>`;
        });
      }

      if (section.intro) html += `<p>${formatText(section.intro)}</p>`;

      if (section.list) {
        html += `<ul>${section.list.map((item) => `<li>${formatText(item)}</li>`).join('')}</ul>`;
      }

      if (section.afterList) {
        section.afterList.forEach((p) => {
          html += `<p>${formatText(p)}</p>`;
        });
      }

      if (section.subheading) html += `<h3>${formatText(section.subheading)}</h3>`;

      if (section.sublist) {
        html += `<ul>${section.sublist.map((item) => `<li>${formatText(item)}</li>`).join('')}</ul>`;
      }

      if (section.agreements) {
        html += `<ol class="agreement-list">${section.agreements
          .map(
            (a) =>
              `<li><strong>${a.title}</strong> \u2014 ${a.text}</li>`
          )
          .join('')}</ol>`;
      }

      if (section.closing) html += `<p>${formatText(section.closing)}</p>`;

      html += `</section>`;
      return html;
    })
    .join('');

  return `
    <article class="doc-page doc-page--content" data-page="${pageNum}">
      <div class="doc-page-inner">
        <div class="doc-body">${sections}</div>
        <div class="doc-footer">
          ${ctxLogoSmall()}
          <span class="page-num">${pageNum}</span>
        </div>
      </div>
    </article>`;
}

function renderAssessmentPage(page, pageNum) {
  const startIndex = page.questionOffset || 0;
  const items = page.questions
    .map(
      (q, i) => {
        const num = startIndex + i + 1;
        const idx = startIndex + i;
        return `
      <li class="rating-item">
        <p class="rating-question">${num}. ${escapeHtml(q)}</p>
        <div class="rating-scale" role="radiogroup" aria-label="Question ${num}">
          ${[1, 2, 3, 4, 5]
            .map(
              (n) => `
            <label class="rating-choice">
              <input type="radio" name="rating-${idx}" value="${n}">
              <span class="rating-choice-num">${n}</span>
            </label>`
            )
            .join('')}
        </div>
      </li>`;
      }
    )
    .join('');

  return `
    <article class="doc-page doc-page--assessment" data-page="${pageNum}">
      <div class="doc-page-inner">
        <div class="doc-header-band"><h2>${page.heading}</h2></div>
        ${page.intro ? `<div class="rating-intro">${page.intro.map((line) => `<p>${formatText(line)}</p>`).join('')}</div>` : ''}
        <div class="rating-questions">
          ${page.showQuestionsHeading !== false ? '<h3 class="assessment-questions-heading">Questions</h3>' : ''}
          <ol class="rating-list" start="${startIndex + 1}">${items}</ol>
        </div>
        <div class="doc-footer">
          ${ctxLogoSmall()}
          <span class="page-num">${pageNum}</span>
        </div>
      </div>
    </article>`;
}

function renderReflectionPage(page, pageNum) {
  const items = page.questions
    .map(
      (q) => `
      <div class="reflection-item">
        <p class="reflection-question"><span class="reflection-num">${q.num}.</span> ${formatText(q.text)}</p>
        <div class="reflection-answer">
          <textarea id="reflection-${q.num}" name="reflection-${q.num}" rows="1" aria-label="Reflection question ${q.num}"></textarea>
          <div class="reflection-lines" aria-hidden="true">
            <span class="reflection-line"></span>
            <span class="reflection-line"></span>
            <span class="reflection-line"></span>
            <span class="reflection-line"></span>
            <span class="reflection-line"></span>
          </div>
        </div>
      </div>`
    )
    .join('');

  return `
    <article class="doc-page doc-page--reflection" data-page="${pageNum}">
      <div class="doc-page-inner">
        <div class="doc-header-band"><h2>${page.heading}</h2></div>
        ${page.intro ? `<p class="reflection-intro">${formatText(page.intro)}</p>` : ''}
        ${items}
        <div class="doc-footer">
          ${ctxLogoSmall()}
          <span class="page-num">${pageNum}</span>
        </div>
      </div>
    </article>`;
}

function renderSubmissionPage(page, pageNum) {
  const fields = [
    { id: 'submission-name', label: 'Name (First Name, Last Name)' },
    { id: 'submission-date', label: 'Date' },
    { id: 'submission-contact', label: 'Contact (email and/or phone number)' },
  ]
    .map(
      (field) => `
      <div class="submission-field">
        <label class="submission-label" for="${field.id}">${field.label}</label>
        <input class="submission-input" type="text" id="${field.id}" name="${field.id}" autocomplete="off">
      </div>`
    )
    .join('');

  return `
    <article class="doc-page doc-page--submission" data-page="${pageNum}">
      <div class="doc-page-inner">
        <div class="submission-fields">${fields}</div>
        <div class="submission-footer">
          <p>${linkify(page.footer.website)}</p>
          <p>${page.footer.websiteNote}</p>
          <p class="return-line">${formatReturnLine(page.footer.return)}</p>
        </div>
        <div class="doc-footer">
          ${ctxLogoSmall()}
          <span class="page-num">${pageNum}</span>
        </div>
      </div>
    </article>`;
}

function formatReturnLine(text) {
  let html = formatText(text);
  const replacements = [
    [/\{deadline\}|\[Date\]/g, 'deadline', state.deadline],
    [/\{email\}|\[Email\]/g, 'email', state.email],
    [/\{location\}|\[Location\]/g, 'location', state.location],
  ];

  replacements.forEach(([pattern, token, value]) => {
    html = html.replace(pattern, () =>
      `<strong class="editable-token" data-token="${token}">${escapeHtml(value)}</strong>`
    );
  });

  return html;
}

function formatText(text) {
  const escaped = escapeHtml(text);
  return escaped
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/(https:\/\/[^\s<]+)/g, '<a href="$1">$1</a>');
}

function linkify(text) {
  return formatText(text);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderDocument() {
  const pages = buildDocumentPages(state);
  let pageNum = 1;

  return pages
    .map((page) => {
      if (page.type === 'cover') return renderCover(page);
      if (page.type === 'content') return renderContentPage(page, pageNum++);
      if (page.type === 'assessment') return renderAssessmentPage(page, pageNum++);
      if (page.type === 'reflection') return renderReflectionPage(page, pageNum++);
      if (page.type === 'submission') return renderSubmissionPage(page, pageNum++);
      return '';
    })
    .join('');
}

function syncControlsFromState() {
  if (isPublishedMode) return;

  $('#preset-germantown').classList.toggle('active', state.preset === 'germantown');
  $('#preset-rhinelander').classList.toggle('active', state.preset === 'rhinelander');
  $('#preset-template').classList.toggle('active', state.preset === 'template');
  $('#field-place').value = state.place;
  $('#field-deadline').value = state.deadline;
  $('#field-email').value = state.email;
  $('#field-location').value = state.location;
}

function render() {
  const stack = $('#docStack');
  const saved = captureFormState();
  stack.innerHTML = renderDocument();
  restoreFormState(saved);
  syncControlsFromState();
  if (isPublishedMode) lockPublishedFormFocus();
}

function captureFormState() {
  const ratings = {};
  $$('#docStack input[type="radio"]:checked').forEach((el) => {
    ratings[el.name] = el.value;
  });
  const reflections = {};
  $$('#docStack textarea').forEach((el) => {
    reflections[el.name] = el.value;
  });
  const submission = {};
  $$('#docStack .submission-input').forEach((el) => {
    submission[el.name] = el.value;
  });
  return { ratings, reflections, submission };
}

function restoreFormState(saved) {
  Object.entries(saved.ratings).forEach(([name, value]) => {
    const el = $(`input[name="${name}"][value="${value}"]`);
    if (el) el.checked = true;
  });
  Object.entries(saved.reflections).forEach(([name, value]) => {
    const el = $(`textarea[name="${name}"]`);
    if (el) el.value = value;
  });
  Object.entries(saved.submission || {}).forEach(([name, value]) => {
    const el = $(`input[name="${name}"]`);
    if (el) el.value = value;
  });
}

function applyPreset(key) {
  state.preset = key;
  const preset = PLACE_PRESETS[key];
  state.place = preset.place;
  if (LOCATION_CONFIGS[key]) {
    state.deadline = LOCATION_CONFIGS[key].deadline;
    state.email = LOCATION_CONFIGS[key].email;
    state.location = LOCATION_CONFIGS[key].location;
  } else {
    state.deadline = DEFAULTS.deadline;
    state.email = DEFAULTS.email;
    state.location = DEFAULTS.location;
  }
  render();
}

function clearFormResponses() {
  $$('#docStack input[type="radio"]').forEach((el) => {
    el.checked = false;
  });
  $$('#docStack textarea').forEach((el) => {
    el.value = '';
  });
  $$('#docStack .submission-input').forEach((el) => {
    el.value = '';
  });
}

function bindBuilderEvents() {
  $('#preset-germantown').addEventListener('click', () => applyPreset('germantown'));
  $('#preset-rhinelander').addEventListener('click', () => applyPreset('rhinelander'));
  $('#preset-template').addEventListener('click', () => applyPreset('template'));

  ['place', 'deadline', 'email', 'location'].forEach((field) => {
    $(`#field-${field}`).addEventListener('input', (e) => {
      state[field] = e.target.value;
      state.preset = 'custom';
      $$('.preset-btn').forEach((b) => b.classList.remove('active'));
      render();
    });
  });

  bindActionButtons('#btn-print', '#btn-pdf', '#btn-reset');
}

function bindActionButtons(printSel, pdfSel, resetSel) {
  $(printSel)?.addEventListener('click', () => window.print());

  $(pdfSel)?.addEventListener('click', async () => {
    const btn = $(pdfSel);
    btn.disabled = true;
    btn.textContent = 'Preparing PDF…';
    try {
      await exportPdf();
    } catch (err) {
      console.error(err);
      alert('PDF export failed. Please try again or use Print → Save as PDF.');
    } finally {
      btn.disabled = false;
      btn.textContent = 'Download PDF';
    }
  });

  $(resetSel)?.addEventListener('click', clearFormResponses);
}

function populateWelcomeModal() {
  const modal = $('#welcomeModal');
  if (!modal) return;

  $('#welcomePlace').textContent = state.place;
  $('#welcomeEmail').textContent = state.email;
  $('#welcomeDeadline').textContent = state.deadline;
  $('#welcomeLocation').textContent = state.location;
  $('#welcomeDropDeadline').textContent = state.deadline;

  document.title = `Youth Artist Giving Circle — ${state.place}`;
}

function lockPublishedFormFocus() {
  $$('#docStack input, #docStack textarea').forEach((el) => {
    el.setAttribute('tabindex', '-1');
    el.dataset.modalLocked = 'true';
  });
}

function unlockPublishedFormFocus() {
  $$('[data-modal-locked]').forEach((el) => {
    el.removeAttribute('tabindex');
    delete el.dataset.modalLocked;
  });
}

function closeWelcomeModal() {
  const modal = $('#welcomeModal');
  if (!modal) return;

  modal.classList.add('welcome-modal--hidden');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  $('.app--published')?.removeAttribute('inert');

  const returnFocus = $('#pub-btn-print');
  if (document.activeElement && document.activeElement !== document.body) {
    document.activeElement.blur();
  }
  if (returnFocus) {
    returnFocus.focus({ preventScroll: true });
  }

  window.scrollTo(0, 0);

  window.setTimeout(() => {
    if (document.activeElement?.classList?.contains('submission-input')) {
      document.activeElement.blur();
      returnFocus?.focus({ preventScroll: true });
    }
    unlockPublishedFormFocus();
    window.scrollTo(0, 0);
  }, 100);
}

function bindWelcomeModal() {
  const modal = $('#welcomeModal');
  if (!modal) return;

  populateWelcomeModal();
  lockPublishedFormFocus();

  $('#welcomePrint')?.addEventListener('click', () => {
    closeWelcomeModal();
    window.setTimeout(() => window.print(), 150);
  });

  $('#welcomeDigital')?.addEventListener('mousedown', (event) => {
    event.preventDefault();
  });

  $('#welcomeDigital')?.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    closeWelcomeModal();
  });

  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeWelcomeModal();
  });
}

const PUBLISHED_ZOOM = { min: 0.5, max: 2, step: 0.1 };
let publishedUserZoom = 1;

function injectPublishedZoomControls() {
  const inner = $('.published-toolbar-inner');
  const actions = $('.published-toolbar-actions');
  if (!inner || !actions || $('#pub-btn-zoom-in')) return;

  const controls = document.createElement('div');
  controls.className = 'published-toolbar-controls';

  const zoom = document.createElement('div');
  zoom.className = 'published-zoom';
  zoom.setAttribute('role', 'group');
  zoom.setAttribute('aria-label', 'Zoom');
  zoom.innerHTML = `
    <div class="published-zoom-inner">
      <button type="button" class="btn btn-zoom" id="pub-btn-zoom-out" aria-label="Zoom out">−</button>
      <button type="button" class="btn btn-zoom btn-zoom-label" id="pub-btn-zoom-reset" aria-label="Reset zoom">100%</button>
      <button type="button" class="btn btn-zoom" id="pub-btn-zoom-in" aria-label="Zoom in">+</button>
    </div>`;

  inner.insertBefore(controls, actions);
  controls.appendChild(zoom);
  controls.appendChild(actions);
}

function applyPublishedZoom() {
  const area = $('.preview-area--published');
  if (!area) return;

  area.style.setProperty('--published-user-zoom', String(publishedUserZoom));

  const resetBtn = $('#pub-btn-zoom-reset');
  if (resetBtn) resetBtn.textContent = `${Math.round(publishedUserZoom * 100)}%`;

  $('#pub-btn-zoom-out')?.toggleAttribute(
    'disabled',
    publishedUserZoom <= PUBLISHED_ZOOM.min + 0.001
  );
  $('#pub-btn-zoom-in')?.toggleAttribute(
    'disabled',
    publishedUserZoom >= PUBLISHED_ZOOM.max - 0.001
  );
}

function stepPublishedZoom(delta) {
  publishedUserZoom = Math.min(
    PUBLISHED_ZOOM.max,
    Math.max(
      PUBLISHED_ZOOM.min,
      Math.round((publishedUserZoom + delta) * 10) / 10
    )
  );
  applyPublishedZoom();
}

function bindPublishedZoom() {
  injectPublishedZoomControls();
  applyPublishedZoom();

  $('#pub-btn-zoom-out')?.addEventListener('click', () => {
    stepPublishedZoom(-PUBLISHED_ZOOM.step);
  });
  $('#pub-btn-zoom-in')?.addEventListener('click', () => {
    stepPublishedZoom(PUBLISHED_ZOOM.step);
  });
  $('#pub-btn-zoom-reset')?.addEventListener('click', () => {
    publishedUserZoom = 1;
    applyPublishedZoom();
  });
}

function getTouchDistance(touches) {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.hypot(dx, dy);
}

function bindPublishedPinchZoom() {
  const area = $('.preview-area--published');
  if (!area) return;

  area.addEventListener(
    'wheel',
    (event) => {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      stepPublishedZoom(event.deltaY < 0 ? PUBLISHED_ZOOM.step : -PUBLISHED_ZOOM.step);
    },
    { passive: false }
  );

  let pinchStartDistance = 0;
  let pinchStartZoom = 1;

  area.addEventListener(
    'touchstart',
    (event) => {
      if (event.touches.length !== 2) return;
      pinchStartDistance = getTouchDistance(event.touches);
      pinchStartZoom = publishedUserZoom;
    },
    { passive: true }
  );

  area.addEventListener(
    'touchmove',
    (event) => {
      if (event.touches.length !== 2 || !pinchStartDistance) return;
      event.preventDefault();
      const ratio = getTouchDistance(event.touches) / pinchStartDistance;
      publishedUserZoom = Math.min(
        PUBLISHED_ZOOM.max,
        Math.max(
          PUBLISHED_ZOOM.min,
          Math.round(pinchStartZoom * ratio * 10) / 10
        )
      );
      applyPublishedZoom();
    },
    { passive: false }
  );

  area.addEventListener(
    'touchend',
    (event) => {
      if (event.touches.length < 2) pinchStartDistance = 0;
    },
    { passive: true }
  );
}

function bindPublishedEvents() {
  bindActionButtons('#pub-btn-print', '#pub-btn-pdf', '#pub-btn-reset');
  bindPublishedZoom();
  bindPublishedPinchZoom();
  bindWelcomeModal();
}

function pdfPageBackground(pageEl) {
  if (pageEl.classList.contains('doc-page--cover')) return '#4c75df';
  return '#ffffff';
}

function preparePageForCapture(root) {
  const targets = root.matches?.('.doc-page, .doc-header-band')
    ? [root, ...root.querySelectorAll('.doc-header-band')]
    : [...root.querySelectorAll('.doc-page, .doc-header-band')];

  targets.forEach((el) => {
    el.style.webkitPrintColorAdjust = 'exact';
    el.style.printColorAdjust = 'exact';
  });
}

async function exportPdf() {
  if (!window.jspdf?.jsPDF || !window.html2canvas) {
    throw new Error('PDF libraries failed to load');
  }

  await document.fonts.ready;
  await Promise.all(
    [...document.images].map(
      (img) =>
        img.complete
          ? Promise.resolve()
          : new Promise((resolve) => {
              img.onload = resolve;
              img.onerror = resolve;
            })
    )
  );

  const { jsPDF } = window.jspdf;
  const html2canvas = window.html2canvas;
  const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait', compress: true });
  const pages = $$('.doc-page');
  const btn = $('#btn-pdf') || $('#pub-btn-pdf');

  for (let i = 0; i < pages.length; i++) {
    if (btn) btn.textContent = `Preparing PDF… (${i + 1}/${pages.length})`;

    const pageEl = pages[i];
    const canvas = await html2canvas(pageEl, {
      scale: 1.5,
      useCORS: true,
      backgroundColor: pdfPageBackground(pageEl),
      logging: false,
      onclone: (_doc, cloneRoot) => {
        preparePageForCapture(cloneRoot);
        cloneRoot.querySelectorAll('.doc-page').forEach((el) => {
          el.style.zoom = '1';
          el.style.transform = 'none';
          el.style.marginBottom = '0';
        });
        cloneRoot.querySelectorAll('textarea').forEach((el) => {
          el.style.display = 'none';
        });
      },
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.88);
    if (i > 0) pdf.addPage();
    pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
  }

  const slug = state.place.replace(/[^\w]+/g, '-').replace(/^-|-$/g, '') || 'template';
  pdf.save(`youth-artist-giving-circle-${slug}.pdf`);
}

if (isPublishedMode) {
  if (!LOCATION_CONFIGS[publishedLocationKey]) {
    document.body.innerHTML =
      '<p style="padding:2rem;font-family:sans-serif;">Unknown location. Please use /givingcircle/germantown or /givingcircle/rhinelander.</p>';
  } else {
    document.documentElement.classList.add('app-published-root');
    render();
    bindPublishedEvents();
  }
} else {
  render();
  bindBuilderEvents();
}
