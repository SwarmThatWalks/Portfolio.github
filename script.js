const letters = document.querySelectorAll('#glow-text span');
const delay = 150;
const repeatDelay = 10000;
const initialDelay = 2000;

const clickSound = new Audio('assets/soundeffect/button3.wav');
clickSound.volume = 0.5;
const closeSound = new Audio('assets/soundeffect/button4.wav');
closeSound.volume = 0.5;

const navItems = document.querySelectorAll('.nav-item');
const mobileWarning = document.getElementById('mobileWarning');
const closeMobileWarning = document.getElementById('closeMobileWarning');
const warningText = document.getElementById('warning-text');
const emailAddress = 'francescopresti29@hotmail.it';
const copyEmailBtn = document.getElementById('copyEmailBtn');
const aboutContent = document.getElementById('about-content');
const contactDesc = document.getElementById('contact-desc');
const contactNote = document.getElementById('contact-note');
const cvImage = document.getElementById('cvImage');
const cvDownloadBtn = document.getElementById('cvDownloadBtn');
const cvDownloadText = cvDownloadBtn.querySelector('span');
const aboutTitle = document.getElementById('about-title');
const resumeTitle = document.getElementById('resume-title');
const contactTitle = document.getElementById('contact-title');
const sendEmailBtn = document.getElementById('sendEmailBtn');
const sendEmailText = sendEmailBtn.querySelector('.btn-text');
const langBtn = document.getElementById('langBtn');
const muteBtn = document.getElementById('muteBtn');
const bgVideo = document.getElementById('bgVideo');
const scrollCursor = document.getElementById('scroll-cursor');
const scrollWrap = document.getElementById('scroll-wrap');

const sectionIds = ['about-section', 'resume-section', 'contact-section'];
const sectionThemes = ['', 'theme-resume', 'theme-contact'];
const sectionEls = sectionIds.map(id => document.getElementById(id));

let currentSectionIndex = 0;
let preloaderHidden = false;
let revealsEnabled = false;

let lerpY = 0;
let targetY = 0;
const EASE = 0.072;

let mouseX = 0;
let mouseY = 0;
let lerpMouseX = 0;
let lerpMouseY = 0;

const isMobileDevice = () => window.innerWidth <= 768;
const isTouchDevice = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function getMaxScroll() {
  return Math.max(0, scrollWrap.scrollHeight - window.innerHeight);
}

function rafLoop() {
  if (isMobileDevice()) {
    requestAnimationFrame(rafLoop);
    return;
  }

  lerpY += (targetY - lerpY) * EASE;
  if (Math.abs(targetY - lerpY) < 0.04) lerpY = targetY;

  scrollWrap.style.transform = `translateY(${-lerpY}px)`;

  lerpMouseX += (mouseX - lerpMouseX) * 0.055;
  lerpMouseY += (mouseY - lerpMouseY) * 0.055;

  applyParallax();
  tick(lerpY);
  requestAnimationFrame(rafLoop);
}

function applyParallax() {
  if (isTouchDevice) return;
  const contents = document.querySelectorAll('.section-content');
  contents.forEach(el => {
    el.style.transform = `translate(${lerpMouseX * 14}px, ${lerpMouseY * 9}px)`;
  });
}

function tick(sy) {
  if (revealsEnabled) checkReveals();
  updateActiveSection(sy);
  updateCursorLabel(sy);
}

function checkReveals() {
  const vh = window.innerHeight;
  const revealItems = document.querySelectorAll('.reveal-item');

  revealItems.forEach(el => {
    const rect = el.getBoundingClientRect();
    const section = el.closest('.section');
    const sectionRect = section.getBoundingClientRect();

    if (rect.top < vh * 0.85 && rect.bottom > vh * 0.15) {
      el.classList.add('revealed');
      el.classList.remove('exit-left', 'exit-right');
    } else if (rect.bottom <= vh * 0.15) {
      if (section.id === 'resume-section' && sectionRect.bottom > vh * 0.5) {
        return;
      }
      el.classList.remove('revealed');
      el.classList.add('exit-left');
    } else {
      el.classList.remove('revealed', 'exit-left');
    }
  });
}

function updateActiveSection(sy) {
  const mid = sy + window.innerHeight * 0.42;
  let idx = 0;
  sectionEls.forEach((s, i) => {
    if (s.offsetTop <= mid) idx = i;
  });

  if (idx === currentSectionIndex) return;
  currentSectionIndex = idx;

  navItems.forEach((item, i) => item.classList.toggle('active', i === idx));

  document.body.classList.remove('theme-resume', 'theme-contact');
  if (sectionThemes[idx]) document.body.classList.add(sectionThemes[idx]);

  if (bgVideo) {
    if (idx === 0) {
      bgVideo.play().catch(() => {});
    } else {
      bgVideo.pause();
    }
  }
}

function updateCursorLabel(sy) {
  if (!scrollCursor) return;
  const textPath = scrollCursor.querySelector('textPath');
  if (!textPath) return;
  const atEnd = sy >= getMaxScroll() - 10;
  textPath.textContent = atEnd ? 'SCROLL UP · SCROLL UP · · · · ' : 'SCROLL DOWN · SCROLL DOWN · ';
}

function scrollToSection(idx) {
  if (isMobileDevice()) {
    window.scrollTo({ top: sectionEls[idx].offsetTop, behavior: 'smooth' });
  } else {
    targetY = clamp(sectionEls[idx].offsetTop, 0, getMaxScroll());
  }
}

navItems.forEach((item, index) => {
  item.addEventListener('click', () => {
    playSound(clickSound);
    scrollToSection(index);
  });
});

window.addEventListener('wheel', (e) => {
  if (isMobileDevice()) return;
  e.preventDefault();
  targetY = clamp(targetY + e.deltaY * 0.8, 0, getMaxScroll());
}, { passive: false });

let touchStartY = 0;

document.addEventListener('touchstart', (e) => {
  touchStartY = e.touches[0].clientY;
}, { passive: true });

window.addEventListener('scroll', () => {
  if (!isMobileDevice()) return;
  tick(window.scrollY);
}, { passive: true });

if (!isTouchDevice && scrollCursor) {
  scrollCursor.style.display = 'block';
}

const magneticTargets = [
  sendEmailBtn,
  document.querySelector('.linkedin-contact-btn'),
  cvDownloadBtn
].filter(Boolean);

document.addEventListener('mousemove', (e) => {
  if (isTouchDevice) return;

  if (scrollCursor) {
    scrollCursor.style.left = e.clientX + 'px';
    scrollCursor.style.top = e.clientY + 'px';
  }

  mouseX = (e.clientX / window.innerWidth - 0.5);
  mouseY = (e.clientY / window.innerHeight - 0.5);

  applyMagnetic(e);
});

function applyMagnetic(e) {
  if (isTouchDevice || isMobileDevice()) return;
  magneticTargets.forEach(el => {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxDist = 100;
    if (dist < maxDist) {
      const factor = (1 - dist / maxDist) * 0.32;
      el.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
    } else {
      el.style.transform = '';
    }
  });
}

function playSound(audio) {
  if (!audio.paused) audio.pause();
  audio.currentTime = 0;
  audio.play().catch(() => {});
}

function glowSequence() {
  letters.forEach(l => l.classList.remove('glow'));
  letters.forEach((l, i) => {
    setTimeout(() => {
      l.classList.add('glow');
      if (i > 0) letters[i - 1].classList.remove('glow');
      if (i === letters.length - 1) {
        setTimeout(() => l.classList.remove('glow'), delay);
      }
    }, i * delay);
  });
}

setTimeout(glowSequence, initialDelay);
setInterval(glowSequence, repeatDelay);

if (copyEmailBtn) {
  copyEmailBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(emailAddress);
      const orig = copyEmailBtn.style.color;
      copyEmailBtn.style.color = '#0ff';
      setTimeout(() => { copyEmailBtn.style.color = orig; }, 450);
      playSound(clickSound);
    } catch (err) {}
  });
}

if (closeMobileWarning && mobileWarning) {
  closeMobileWarning.addEventListener('click', () => {
    playSound(closeSound);
    mobileWarning.classList.add('fade-out');
    setTimeout(() => { mobileWarning.style.display = 'none'; }, 400);
  });
}

let isMuted = localStorage.getItem('muted') === 'true';

function updateMuteState() {
  clickSound.muted = isMuted;
  closeSound.muted = isMuted;
  localStorage.setItem('muted', isMuted);
  muteBtn.classList.toggle('muted', isMuted);
}

muteBtn.addEventListener('click', () => {
  isMuted = !isMuted;
  updateMuteState();
});

updateMuteState();

let currentLang = localStorage.getItem('lang') || 'EN';

const navTranslations = {
  EN: ['About Me', 'Resume', 'Contact Me'],
  IT: ['Chi Sono', 'Curriculum', 'Contattami']
};

const aboutTextData = {
  EN: `
  <div style="display:flex; gap:20px; align-items:flex-start; margin-bottom:18px;">
    <div>
      <h3 style="margin:0 0 4px 0; color:#fff; font-family:'OutfitBold',sans-serif; font-size:16px;">Francesco Presti</h3>
      <p style="margin:0; font-size:13px; color:#aaa;">Software & Web Development | Graphic Design</p>
    </div>
  </div>
  <p>I am a versatile and hands-on person, able to adapt to different professional environments and work effectively in a team. I hold a diploma in <span class="skill">Computer Science and Telecommunications</span>, and throughout my school years, I developed a passion for skills in graphic design and video editing, particularly with <span class="skill">Adobe After Effects</span>.</p>
  <p>I have experience in web and software development (<span class="skill">PHP</span>, <span class="skill">WordPress</span>), intermediate skills in Office (<span class="skill">Word</span>, <span class="skill">Excel</span>, <span class="skill">PowerPoint</span>), and medium-to-advanced abilities in graphic design and video editing (<span class="skill">Adobe After Effects</span> and <span class="skill">Premiere Pro</span>).</p>
  <p>During my school years, I worked as a <span class="skill">waiter</span> and <span class="skill">kitchen assistant</span> in a restaurant, handling dish preparation, table service, dishwashing, and cleaning, both during day and night shifts.</p>
  <p>I built this web portfolio from scratch using <span class="skill">Visual Studio Code</span>, mainly to experiment and test my skills.</p>
  `,
  IT: `
  <div style="display:flex; gap:20px; align-items:flex-start; margin-bottom:18px;">
    <div>
      <h3 style="margin:0 0 4px 0; color:#fff; font-family:'OutfitBold',sans-serif; font-size:16px;">Francesco Presti</h3>
      <p style="margin:0; font-size:13px; color:#aaa;">Sviluppo Software & Web | Graphic Design</p>
    </div>
  </div>
  <p>Sono una persona versatile e operativa, capace di adattarmi a diversi contesti professionali e di lavorare in squadra. Sono diplomato in <span class="skill">Informatica e Telecomunicazioni</span> e, nel corso degli anni scolastici, ho coltivato per passione competenze in grafica e montaggio video, in particolare con <span class="skill">Adobe After Effects</span>.</p>
  <p>Ho esperienza nello sviluppo web e software (<span class="skill">PHP</span>, <span class="skill">WordPress</span>), competenze intermedie in Office (<span class="skill">Word</span>, <span class="skill">Excel</span>, <span class="skill">PowerPoint</span>) e abilità medio-alte in graphic design e video editing (<span class="skill">Adobe After Effects</span> e <span class="skill">Premiere Pro</span>).</p>
  <p>Durante il periodo scolastico ho lavorato come <span class="skill">cameriere</span> e <span class="skill">aiuto cuoco</span> in un ristorante, occupandomi di preparazione dei piatti, servizio ai tavoli, lavaggio stoviglie e pulizia del locale.</p>
  <p>Ho realizzato questo portfolio web da zero utilizzando <span class="skill">Visual Studio Code</span>, sviluppandolo principalmente per sperimentare e mettere alla prova le mie competenze.</p>
  `
};

const contactData = {
  EN: {
    title: 'Contact Me',
    desc: '<p>The easiest way to reach me is by email. I do not often check messages on social media, so please direct any inquiries directly to my email address below.</p>',
    note: 'Your email will not be shared.',
    btn: 'Send Email'
  },
  IT: {
    title: 'Contattami',
    desc: '<p>Il modo più semplice per contattarmi è tramite email. Non controllo spesso i messaggi dai social, quindi per favore inoltra le domande direttamente alla mia email.</p>',
    note: 'La tua email non verrà condivisa.',
    btn: 'Invia Email'
  }
};

const headings = {
  EN: { about: 'About Me', resume: 'Resume' },
  IT: { about: 'Chi Sono', resume: 'Curriculum' }
};

const warningMsgs = {
  EN: '⚠️ Optimized for desktop. Mobile features a simplified layout.',
  IT: '⚠️ Questo sito è ottimizzato per desktop. Il layout mobile è una versione semplificata.'
};

const resumeData = {
  EN: {
    img: 'assets/img/CV_Presti_Francesco_ENG.jpg',
    pdf: 'assets/CV/CV_Presti_Francesco_ENG.pdf',
    btnText: 'Download CV'
  },
  IT: {
    img: 'assets/img/CV_Presti_Francesco_ITA.jpg',
    pdf: 'assets/CV/CV_Presti_Francesco_ITA.pdf',
    btnText: 'Scarica CV'
  }
};

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);

  const elementsToFade = [
    ...navItems, aboutTitle, resumeTitle, contactTitle,
    aboutContent, contactDesc, contactNote,
    sendEmailBtn, warningText, cvImage, cvDownloadBtn
  ].filter(Boolean);

  elementsToFade.forEach(el => {
    el.classList.remove('lang-fade');
    el.style.opacity = '0';
  });

  setTimeout(() => {
    langBtn.textContent = lang;
    navItems.forEach((item, i) => { item.textContent = navTranslations[lang][i]; });
    aboutTitle.textContent = headings[lang].about;
    resumeTitle.textContent = headings[lang].resume;
    contactTitle.textContent = contactData[lang].title;
    aboutContent.innerHTML = aboutTextData[lang];
    contactDesc.innerHTML = contactData[lang].desc;
    if (contactNote) contactNote.textContent = contactData[lang].note;
    sendEmailText.textContent = contactData[lang].btn;
    if (warningText) warningText.textContent = warningMsgs[lang];
    cvImage.src = resumeData[lang].img;
    cvDownloadBtn.href = resumeData[lang].pdf;
    cvDownloadText.textContent = resumeData[lang].btnText;
    elementsToFade.forEach(el => { el.classList.add('lang-fade'); });
  }, 300);
}

langBtn.textContent = currentLang;
setLanguage(currentLang);

langBtn.addEventListener('click', () => {
  setLanguage(currentLang === 'EN' ? 'IT' : 'EN');
});

document.addEventListener('visibilitychange', () => {
  if (!bgVideo) return;
  if (document.hidden) {
    bgVideo.pause();
  } else if (currentSectionIndex === 0) {
    bgVideo.play().catch(() => {});
  }
});

const preloader = document.getElementById('preloader');

function hidePreloader() {
  if (!preloader || preloaderHidden) return;
  preloaderHidden = true;

  setTimeout(() => {
    preloader.style.opacity = '0';
    setTimeout(() => {
      preloader.style.display = 'none';
      revealsEnabled = true;
      checkReveals();
    }, 1200);
  }, 2800);
}

if (bgVideo) {
  if (bgVideo.readyState >= 4) {
    hidePreloader();
  } else {
    bgVideo.addEventListener('canplaythrough', hidePreloader, { once: true });
    setTimeout(hidePreloader, 6000);
  }
} else {
  window.addEventListener('load', hidePreloader);
}

requestAnimationFrame(rafLoop);
