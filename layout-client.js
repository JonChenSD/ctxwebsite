/* CTX Layout Client
 * Runs on the public dreamscape page.
 * Loads any saved layout (from localStorage or Supabase) and
 * applies it as inline styles — overriding the CSS defaults.
 * Falls back silently to CSS defaults if nothing is saved.
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'ctx_dreamscape_layout';

  // Optional Supabase config — set via window.CTX_SUPABASE_URL etc.
  const SUPABASE_URL      = window.CTX_SUPABASE_URL      || '';
  const SUPABASE_ANON_KEY = window.CTX_SUPABASE_ANON_KEY || '';

  // Apply a layout object to the DOM
  function applyLayout(layout) {
    if (!layout || typeof layout !== 'object') return;

    Object.entries(layout).forEach(function ([id, props]) {
      const el = document.querySelector('[data-id="' + id + '"]');
      if (!el) return;

      if (props.top    !== undefined) el.style.top    = props.top;
      if (props.left   !== undefined) el.style.left   = props.left;
      if (props.width  !== undefined) el.style.width  = props.width;
      if (props.zIndex !== undefined) el.style.zIndex = props.zIndex;

      if (props.hidden) {
        el.style.display = 'none';
      }
    });
  }

  // Try localStorage first (instant, no network)
  function loadFromLocal() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  // Try Supabase if configured (authoritative "published" source)
  async function loadFromSupabase() {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
    try {
      var res = await fetch(
        SUPABASE_URL + '/rest/v1/layouts?id=eq.dreamscape&select=layout_json',
        {
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
          },
        }
      );
      if (!res.ok) return null;
      var rows = await res.json();
      return rows && rows[0] ? rows[0].layout_json : null;
    } catch (e) {
      return null;
    }
  }

  // Main: apply local immediately, then refresh from Supabase if available
  document.addEventListener('DOMContentLoaded', async function () {
    // 1. Apply local layout right away (no flicker)
    var local = loadFromLocal();
    if (local) applyLayout(local);

    // 2. Fetch from Supabase in the background; if different, re-apply + sync local
    var remote = await loadFromSupabase();
    if (remote) {
      applyLayout(remote);
      // Keep local in sync with published state
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(remote));
      } catch (e) {}
    }
  });
})();
