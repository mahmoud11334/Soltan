const themeBtn = document.getElementById('themeBtn');
const themeIco = document.getElementById('themeIco');
const body = document.body;

if (localStorage.getItem('theme') === 'dark') {
  body.classList.add('dark');
  themeIco.classList.replace('fa-moon', 'fa-sun');
}

themeBtn.addEventListener('click', () => {
  const isDark = body.classList.toggle('dark');
  themeIco.classList.replace(isDark ? 'fa-moon' : 'fa-sun', isDark ? 'fa-sun' : 'fa-moon');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    burger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

const mainNav = document.getElementById('mainNav');
let lastY = 0;
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  mainNav.style.boxShadow = y > 40 ? '0 4px 28px rgba(0,0,0,.14)' : '';
  lastY = y;
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('vis');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
  observer.observe(el);
});

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target;
      const target = parseInt(el.dataset.target);
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      let current = 0;
      const step = Math.ceil(target / 60);
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = prefix + current + suffix;
      }, 22);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num[data-target]').forEach(el => {
  counterObserver.observe(el);
});

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' });
    }
  });
});

document.querySelectorAll('.btn, .btn-maps, .btn-wa').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.cssText = `
      position:absolute;border-radius:50%;
      width:${size}px;height:${size}px;
      left:${e.clientX - rect.left - size/2}px;
      top:${e.clientY - rect.top - size/2}px;
      background:rgba(255,255,255,0.22);
      transform:scale(0);animation:rippleAnim .55s ease forwards;
      pointer-events:none;z-index:10;
    `;
    if (getComputedStyle(this).position === 'static') this.style.position = 'relative';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

const style = document.createElement('style');
style.textContent = '@keyframes rippleAnim{to{transform:scale(2.5);opacity:0}}';
document.head.appendChild(style);