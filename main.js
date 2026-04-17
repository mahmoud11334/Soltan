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

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('vis');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

const aboutSection = document.querySelector('.about');
if (aboutSection) {
  const crystalObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('crystal-in');
        crystalObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.04, rootMargin: '0px 0px 0px 0px' });
  crystalObserver.observe(aboutSection);
}

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
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 40, behavior: 'smooth' });
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