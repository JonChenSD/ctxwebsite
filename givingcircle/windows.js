/**
 * The Giving Circle desk — the circles and their resources open in windows, on the Giving Circle
 * surface itself (`/dreamscape/?artifact=givingcircle`).
 *
 * After Hypnospace Outlaw: each page keeps its own frame, so pages of different sizes and different
 * hands read as many authors rather than one broken template. The page inside a window is loaded
 * untouched, in an iframe, because a student's file is the artefact.
 *
 * This is a module, not a page: it adds nothing on its own. The dreamscape mounts it on the Giving
 * Circle surface — beside the invitation envelope, which stays exactly as it was — so the circle has
 * one door, the one that already existed.
 *
 *   const desk = CircleDesk.mount(host, [{ href, title, kind }, …]);
 *   desk.destroy();   // when the surface closes
 */

(() => {
  "use strict";

  // `"pointerdown" in window` is false in browsers that support pointer events perfectly well —
  // the constructor is the honest check.
  const supported = typeof window.PointerEvent === "function";

  function mount(host, entries, options = {}) {
    if (!supported || !host || !Array.isArray(entries) || entries.length === 0) return null;

    const desk = document.createElement("div");
    desk.className = "desk";

    const icons = document.createElement("div");
    icons.className = "desk-icons";
    desk.append(icons);

    const taskbar = document.createElement("div");
    taskbar.className = "desk-taskbar";
    const deskName = document.createElement("span");
    deskName.className = "desk-taskbar-name";
    deskName.textContent = options.name || "Giving Circle";
    taskbar.append(deskName);
    taskbar.hidden = true; // it arrives with the first window
    desk.append(taskbar);

    const windows = new Map(); // href → { win, task }
    let top = 10;
    let opened = 0;

    const phone = () => window.matchMedia("(max-width: 640px)").matches;

    function focusWindow(href) {
      for (const [key, entry] of windows) {
        const active = key === href;
        entry.win.classList.toggle("win--active", active);
        entry.task.classList.toggle("task--active", active);
        entry.task.setAttribute("aria-pressed", String(active));
        if (active) entry.win.style.zIndex = String(++top);
      }
    }

    function closeWindow(href) {
      const entry = windows.get(href);
      if (!entry) return;
      entry.win.remove();
      entry.task.remove();
      windows.delete(href);
      taskbar.hidden = windows.size === 0;
      const last = [...windows.keys()].pop();
      if (last) focusWindow(last);
    }

    /** Dragging and resizing share one gesture: pointer capture, and a shield over the iframes. */
    function onGrab(handle, win, mode) {
      handle.addEventListener("pointerdown", (event) => {
        if (phone() || event.button !== 0) return;
        if (event.target.closest(".win-btn")) return;
        if (win.classList.contains("win--max")) return; // a filled window stays put until restored
        event.preventDefault();
        // Capture keeps the gesture even when the cursor leaves the handle. It can refuse (another
        // element already holds this pointer); the drag is still worth having, so never let it throw.
        let captured = false;
        try {
          handle.setPointerCapture(event.pointerId);
          captured = true;
        } catch { /* dragging without capture is the honest fallback */ }
        desk.classList.add("is-dragging");

        const start = { x: event.clientX, y: event.clientY };
        const box = win.getBoundingClientRect();
        const limit = desk.getBoundingClientRect();

        const move = (e) => {
          const dx = e.clientX - start.x;
          const dy = e.clientY - start.y;
          if (mode === "move") {
            const x = Math.min(Math.max(box.left - limit.left + dx, 0), limit.width - 80);
            const y = Math.min(Math.max(box.top - limit.top + dy, 0), limit.height - 60);
            win.style.left = `${Math.round(x)}px`;
            win.style.top = `${Math.round(y)}px`;
          } else {
            win.style.width = `${Math.round(Math.max(240, box.width + dx))}px`;
            win.style.height = `${Math.round(Math.max(160, box.height + dy))}px`;
          }
        };

        const done = () => {
          if (captured) {
            try { handle.releasePointerCapture(event.pointerId); } catch { /* already gone */ }
          }
          desk.classList.remove("is-dragging");
          handle.removeEventListener("pointermove", move);
          handle.removeEventListener("pointerup", done);
          handle.removeEventListener("pointercancel", done);
          window.removeEventListener("pointermove", move);
          window.removeEventListener("pointerup", done);
        };

        // Without capture the pointer stops reporting to the handle the moment it leaves it, so the
        // window follows on the window's own events instead.
        if (!captured) {
          window.addEventListener("pointermove", move);
          window.addEventListener("pointerup", done);
        }
        handle.addEventListener("pointermove", move);
        handle.addEventListener("pointerup", done);
        handle.addEventListener("pointercancel", done);
      });
    }

    function openWindow(entry) {
      if (windows.has(entry.href)) {
        focusWindow(entry.href);
        return;
      }

      const win = document.createElement("section");
      win.className = "win";
      win.setAttribute("role", "dialog");
      win.setAttribute("aria-label", entry.title);

      const offset = (opened++ % 6) * 26;
      const limit = desk.getBoundingClientRect();
      win.style.left = `${28 + offset}px`;
      win.style.top = `${28 + offset}px`;
      win.style.width = `${Math.min(760, Math.max(320, limit.width - 120))}px`;
      win.style.height = `${Math.min(620, Math.max(260, limit.height - 150))}px`;

      const bar = document.createElement("header");
      bar.className = "win-bar";

      const title = document.createElement("span");
      title.className = "win-title";
      title.textContent = entry.title;

      const open = document.createElement("button");
      open.type = "button";
      open.className = "win-btn";
      open.title = "Open this page on its own";
      open.setAttribute("aria-label", `Open ${entry.title} on its own`);
      open.textContent = "↗";
      open.addEventListener("click", () => window.open(entry.href, "_blank", "noopener"));

      // Filling the desk is a class, not new geometry: the window's own left, top, width and height
      // stay on it untouched, so restoring puts it back exactly where it was.
      const max = document.createElement("button");
      max.type = "button";
      max.className = "win-btn";
      max.textContent = "□";
      const fill = (on) => {
        win.classList.toggle("win--max", on);
        max.title = on ? "Restore" : "Fill the desk";
        max.setAttribute("aria-label", `${on ? "Restore" : "Fill the desk with"} ${entry.title}`);
        max.setAttribute("aria-pressed", String(on));
      };
      fill(Boolean(entry.maximized));
      max.addEventListener("click", () => fill(!win.classList.contains("win--max")));
      bar.addEventListener("dblclick", (event) => {
        if (phone() || event.target.closest(".win-btn")) return;
        fill(!win.classList.contains("win--max"));
      });

      const close = document.createElement("button");
      close.type = "button";
      close.className = "win-btn";
      close.title = "Close";
      close.setAttribute("aria-label", `Close ${entry.title}`);
      close.textContent = "✕";
      close.addEventListener("click", () => closeWindow(entry.href));

      bar.append(title, max, open, close);

      const body = document.createElement("div");
      body.className = "win-body";

      const frame = document.createElement("iframe");
      frame.className = "win-frame";
      frame.src = entry.href;
      frame.title = entry.title;
      // Same site, so same-origin is what lets a page inside behave normally; scripts because the
      // forms need theirs. A student's page is loaded exactly as written, never rewritten to fit.
      // Top navigation only on a click, so a page's own "Giving Circle" button can leave the window
      // instead of drawing the whole site inside it — and nothing can navigate the surface unasked.
      frame.setAttribute(
        "sandbox",
        "allow-same-origin allow-scripts allow-forms allow-downloads allow-popups" +
          " allow-top-navigation-by-user-activation",
      );

      const shield = document.createElement("div");
      shield.className = "win-shield";

      body.append(frame, shield);

      const resize = document.createElement("div");
      resize.className = "win-resize";
      resize.setAttribute("aria-hidden", "true");

      win.append(bar, body, resize);
      win.addEventListener("pointerdown", () => focusWindow(entry.href), true);
      desk.append(win);

      const task = document.createElement("button");
      task.type = "button";
      task.className = "task";
      task.textContent = entry.title;
      task.setAttribute("aria-pressed", "false");
      task.addEventListener("click", () => focusWindow(entry.href));
      taskbar.append(task);

      onGrab(bar, win, "move");
      onGrab(resize, win, "resize");

      windows.set(entry.href, { win, task });
      taskbar.hidden = false;
      focusWindow(entry.href);
      close.focus();
    }

    for (const entry of entries) {
      const icon = document.createElement("button");
      icon.type = "button";
      icon.className = `desk-icon desk-icon--${entry.kind || "page"}`;

      const glyph = document.createElement("span");
      glyph.className = "desk-icon-glyph";
      glyph.setAttribute("aria-hidden", "true");

      const label = document.createElement("span");
      label.className = "desk-icon-label";
      label.textContent = entry.title;

      icon.append(glyph, label);
      icon.addEventListener("click", () => openWindow(entry));
      icons.append(icon);
    }

    // Escape closes the window on top — and only then, so the surface's own Escape still works when
    // no window is open.
    const onKey = (event) => {
      if (event.key !== "Escape" || windows.size === 0) return;
      event.stopPropagation();
      closeWindow([...windows.keys()].pop());
    };
    document.addEventListener("keydown", onKey, true);

    host.append(desk);

    return {
      element: desk,
      open: (href) => {
        const entry = entries.find((item) => item.href === href);
        if (entry) openWindow(entry);
      },
      destroy() {
        document.removeEventListener("keydown", onKey, true);
        desk.remove();
        windows.clear();
      },
    };
  }

  window.CircleDesk = { mount, supported };
})();
