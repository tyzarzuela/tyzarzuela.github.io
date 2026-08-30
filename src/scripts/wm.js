let zIndexCounter = 40;

export function bringToFront(win) {
  zIndexCounter++;
  win.style.zIndex = zIndexCounter;
}

export function openWin(id) {
  const win = document.getElementById(id);
  if (win) {
    win.classList.remove('hidden');
    bringToFront(win);
  }
}

export function closeWin(id) {
  const win = document.getElementById(id);
  if (win) win.classList.add('hidden');
}

export function initWindowManager() {
  document.querySelectorAll('[id^="win-"]').forEach(win => {
    const header = win.querySelector('.window-header');
    let isDragging = false;
    let offsetX = 0, offsetY = 0;

    win.addEventListener('mousedown', () => bringToFront(win));

    if (header) {
      header.addEventListener('mousedown', (e) => {
        if (e.target.tagName === 'BUTTON') return;
        isDragging = true;
        offsetX = e.clientX - win.offsetLeft;
        offsetY = e.clientY - win.offsetTop;
        bringToFront(win);
      });
    }

    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        let newX = e.clientX - offsetX;
        let newY = e.clientY - offsetY;

        const maxLeft = window.innerWidth - win.offsetWidth;
        const maxTop = window.innerHeight - win.offsetHeight - 40;

        newX = Math.max(0, Math.min(newX, maxLeft));
        newY = Math.max(0, Math.min(newY, maxTop));

        win.style.left = newX + 'px';
        win.style.top = newY + 'px';
      }
    });

    document.addEventListener('mouseup', () => { isDragging = false; });
  });
}