import {
  PLACE_PRESETS,
  DEFAULTS,
  buildDocumentPages,
} from './content.js';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const state = {
  preset: 'germantown',
  place: DEFAULTS.place,
  deadline: DEFAULTS.deadline,
  email: DEFAULTS.email,
  location: DEFAULTS.location,
};

const LOGO_FULL = '../assets/ctx%20full.png';
const LOGO_SMALL = '../assets/ctx%20small.png';
const COVER_ART = '../eggsnest.svg';

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
        ${page.footer ? `
        <div class="reflection-footer">
          <p>${linkify(page.footer.website)}</p>
          <p>${page.footer.websiteNote}</p>
          <p class="return-line">${formatReturnLine(page.footer.return)}</p>
        </div>` : ''}
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
      return '';
    })
    .join('');
}

function syncControlsFromState() {
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
  return { ratings, reflections };
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
}

function applyPreset(key) {
  state.preset = key;
  state.place = PLACE_PRESETS[key].place;
  render();
}

function bindEvents() {
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

  $('#btn-print').addEventListener('click', () => window.print());

  $('#btn-pdf').addEventListener('click', async () => {
    const btn = $('#btn-pdf');
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

  $('#btn-reset').addEventListener('click', () => {
    $$('#docStack input[type="radio"]').forEach((el) => {
      el.checked = false;
    });
    $$('#docStack textarea').forEach((el) => {
      el.value = '';
    });
  });
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
  const btn = $('#btn-pdf');

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

render();
bindEvents();
