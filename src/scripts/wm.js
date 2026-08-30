let zIndexCounter = 40;

window.bringToFront = function(win) {
  zIndexCounter++;
  win.style.zIndex = zIndexCounter;
};

window.openWin = function(id) {
  const win = document.getElementById(id);
  if (win) {
    win.classList.remove('hidden');
    window.bringToFront(win);
  }
};

window.closeWin = function(id) {
  const win = document.getElementById(id);
  if (win) {
    win.classList.add('hidden');
  }
};

window.toggleMaximize = function(id, defaultW, defaultH, maxW, maxH) {
  const win = document.getElementById(id);
  if (!win) return;
  if (win.style.width === maxW) {
    win.style.width = defaultW;
    win.style.height = defaultH;
  } else {
    win.style.width = maxW;
    win.style.height = maxH;
  }
  window.bringToFront(win);
};

// Inicialización de arrastre con límites de pantalla
function initWindowManager() {
  document.querySelectorAll('[id^="win-"]').forEach(win => {
    const header = win.querySelector('.window-header');
    let isDragging = false;
    let offsetX = 0, offsetY = 0;

    win.addEventListener('mousedown', () => window.bringToFront(win));

    if (header) {
      header.addEventListener('mousedown', (e) => {
        if (e.target.tagName === 'BUTTON') return;
        isDragging = true;
        offsetX = e.clientX - win.offsetLeft;
        offsetY = e.clientY - win.offsetTop;
        window.bringToFront(win);
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

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });
  });
}

// Se ejecuta al cargar el DOM
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', initWindowManager);
}