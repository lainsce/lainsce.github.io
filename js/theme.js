let preferredTheme = sessionStorage.getItem('preferredTheme');

function setLightTheme() {
  if (document.body.classList.contains('dark')) {
    document.body.classList.remove('dark');
  }

  document.body.classList.add('light');
  sessionStorage.setItem('preferredTheme', 'light');
}

function setDarkTheme() {
  if (document.body.classList.contains('light')) {
    document.body.classList.remove('light');
  }

  document.body.classList.add('dark');
  sessionStorage.setItem('preferredTheme', 'dark');
}

function setPreferredTheme() {
  preferredTheme = sessionStorage.getItem('preferredTheme');

  if(preferredTheme === 'light') {
    setLightTheme();
  } else if (preferredTheme === 'dark') {
    setDarkTheme();
  }
}

function toggleTheme() {
    preferredTheme = sessionStorage.getItem('preferredTheme');

  if(preferredTheme === null) {
    sessionStorage.setItem('preferredTheme', 'light');
    setPreferredTheme();
  } else if(preferredTheme === 'light') {
    sessionStorage.setItem('preferredTheme', 'dark');
    setPreferredTheme();
  } else if (preferredTheme === 'dark') {
    sessionStorage.setItem('preferredTheme', 'light');
    setPreferredTheme();
  }
}

const toggleBtn = document.getElementById('theme-toggle');
toggleBtn.addEventListener('click', toggleTheme);

setPreferredTheme();

let mcursor = document.querySelector('.cursor');
window.addEventListener('mousemove', mouse);

let textCursorNodes = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, td, th, dt, q'));
textCursorNodes.forEach((el)=> bindTextCursorNodes(el));

let btnNodes = Array.from(document.querySelectorAll('.button, #theme-toggle'));
btnNodes.forEach((el)=> this.bindBtnNodes(el));

let isCursorLocked = false;
let isTouchLocked = false;
const DEFAULT_CURSOR_SIZE = 36;

function mouse(e){
  if (!this.isCursorLocked && !this.isTouchLocked) {
    mcursor.style.top = e.pageY + 'px';
    mcursor.style.left = e.pageX + 'px';
  }
}

function bindTextCursorNodes(e){
  let fontSize = window.getComputedStyle(e).getPropertyValue('font-size').replace('px', '');
  e.addEventListener(
      'mouseover',
      () => {
          mcursor.style.height = fontSize * 1.4 + 'px';
          mcursor.classList.add('cursor-text');
      }
  );
  e.addEventListener(
      'mouseout',
      () => {
          mcursor.removeAttribute('style');
          mcursor.classList.remove('cursor-text');
      }
  );
}

function bindBtnNodes(el){
    let rect = null;

    el.addEventListener('mouseenter', (event)=>{
        if (isTouchLocked) return;

        isCursorLocked = true;

        rect = el.getBoundingClientRect();


        let borderRadius = window.getComputedStyle(el).getPropertyValue('border-radius').replace('px', '');

        mcursor.classList.add('is-locked');
        mcursor.style.width = rect.width + 'px';
        mcursor.style.height = rect.height + 'px';
        mcursor.style.borderRadius = borderRadius + 'px';
        mcursor.style.left = rect.x + window.pageXOffset + rect.width/2 + 'px';
        mcursor.style.top = rect.y + window.pageYOffset + rect.height/2 + 'px';
    });

    el.addEventListener('mousemove', (event)=>{
        if (isTouchLocked) return;

        const halfHeight = rect.height / 2;
        const topOffset = (event.y - rect.top - halfHeight) / halfHeight;
        const halfWidth = rect.width / 2;
        const leftOffset = (event.x - rect.left - halfWidth) / halfWidth;

        mcursor.style.transform = `translate(calc(-50% + ${leftOffset}px), calc(-50% + ${topOffset}px))`;

        if (el.matches('.panel, a:not(.fab)')){
            el.style.transform = `translate(${leftOffset*6}px, ${topOffset*6}px)`;
        }
    });

    el.addEventListener('mouseleave', (event)=>{
        if (isTouchLocked) return;

        isCursorLocked = false;
        mcursor.classList.remove('is-locked');
        mcursor.classList.remove('cursor--text');
        mcursor.style.borderRadius = '100%';
        mcursor.style.width = DEFAULT_CURSOR_SIZE + 'px';
        mcursor.style.height = DEFAULT_CURSOR_SIZE + 'px';

        el.removeAttribute('style');
        if (el.firstElementChild){
            el.firstElementChild.removeAttribute('style');
        }
    });
}
