const modalButtons = document.querySelectorAll('.btn[data-modal]');
const overlay = document.getElementById('overlay');
const modals = document.querySelectorAll('.modal');
const closeButtons = document.querySelectorAll('.modal-close');
const linkedinBtn = document.getElementById('linkedinBtn');
const letters = document.querySelectorAll('#glow-text span');
const delay = 150
const repeatDelay = 10000
const initialDelay = 2000
const clickSound = new Audio('assets/soundeffect/button3.wav');
clickSound.volume = 0.5;
const allButtons = document.querySelectorAll('.btn, .download-btn');
const closeSound = new Audio('assets/soundeffect/button4.wav');
closeSound.volume = 0.5;
const cvSwitch = document.getElementById('cvSwitch');
const cvLabel = document.getElementById('cvLabel');
const resumeIframe = document.getElementById('resumeIframe');
const aboutSwitch = document.getElementById('aboutSwitch');
const aboutLabel = document.getElementById('aboutLabel');
const aboutText = document.getElementById('aboutText');
const contactSwitch = document.getElementById('contactSwitch');
const contactLabel = document.getElementById('contactLabel');
const contactTextEl = document.getElementById('contactText');
const mobileWarning = document.getElementById('mobileWarning');
const closeMobileWarning = document.getElementById('closeMobileWarning');
const contactTitle = document.getElementById('contact-title');
const contactNote = document.getElementById('contact-note');
const emailAddress = 'francescopresti29@hotmail.it';
const contactEmailText = document.getElementById('contactEmailText');
const copyEmailBtn = document.getElementById('copyEmailBtn');
const contactMailtoBtn = document.getElementById('contactMailtoBtn');
const contactMailBtnIconHTML = contactMailtoBtn ? (contactMailtoBtn.querySelector('.btn-icon')?.outerHTML || '') : '';

const contactEN = {
  title: "Contact Me",
  button: "Send Email",
  note: "Press the button above to open your email app.",
  text: `<p>The easiest way to reach me is by email.</p>`
};

const contactIT = {
  title: "Contattami",
  button: "Invia Email",
  note: "Premi il pulsante qui sopra per aprire la tua app email.",
  text: `<p>Il modo più semplice per contattarmi è tramite email.</p>`
};

const contactEN_HTML = contactEN.text;
const contactIT_HTML = contactIT.text;

const aboutIT_HTML = `
<p>
Sono una persona versatile e operativa, capace di adattarmi a diversi contesti professionali e di lavorare in squadra. 
Sono diplomato in <span class="skill">Informatica e Telecomunicazioni </span>e, nel corso degli anni scolastici, ho coltivato per passione competenze in grafica e montaggio video, 
in particolare con <span class="skill">Adobe After Effects</span>.
</p>

<p>
Ho esperienza nello sviluppo web e software (<span class="skill">PHP</span>,<span class="skill">WordPress</span>), 
competenze intermedie in Office (<span class="skill">Word</span>,<span class="skill"> Excel</span>,<span class="skill"> PowerPoint</span>) e abilità medio-alte in graphic design e video editing (<span class="skill">Adobe After Effects</span> e <span class="skill">Premiere Pro</span>).
Sono inoltre disponibile per <span class="skill">attività manuali e operative</span>.
</p>

<p>
Durante il periodo scolastico ho lavorato come <span class="skill">cameriere</span> e <span class="skill">aiuto cuoco</span> in un ristorante, 
occupandomi di preparazione dei piatti, servizio ai tavoli, lavaggio stoviglie e pulizia del locale, sia in turni diurni che notturni.
</p>
<p>
Ho realizzato questo portfolio web da zero utilizzando <span class="skill">Visual Studio Code</span>, 
sviluppandolo principalmente per sperimentare e mettere alla prova le mie competenze. 
Ho anche collaborato alla revisione e allo sviluppo di siti <span class="skill">WordPress</span>, curando interfaccia grafica, user experience e gestione dati.
</p>`;

const aboutEN_HTML = `
<p>
I am a versatile and hands-on person, able to adapt to different professional environments and work effectively in a team. 
I hold a diploma in <span class="skill">Computer Science and Telecommunications</span>, and throughout my school years, I developed a passion for skills in graphic design and video editing, 
particularly with <span class="skill">Adobe After Effects</span>.
</p>

<p>
I have experience in web and software development (<span class="skill">PHP</span>, <span class="skill">WordPress</span>), 
intermediate skills in Office (<span class="skill">Word</span>, <span class="skill">Excel</span>, <span class="skill">PowerPoint</span>), and medium-to-advanced abilities in graphic design and video editing (<span class="skill">Adobe After Effects</span> and <span class="skill">Premiere Pro</span>).
I am also available for <span class="skill">manual and operational tasks</span>.
</p>

<p>
During my school years, I worked as a <span class="skill">waiter</span> and <span class="skill">kitchen assistant</span> in a restaurant, 
handling dish preparation, table service, dishwashing, and cleaning, both during day and night shifts.
</p>

<p>
I built this web portfolio from scratch using <span class="skill">Visual Studio Code</span>, 
mainly to experiment and test my skills. 
I have also collaborated on the revision and development of <span class="skill">WordPress</span> websites, focusing on graphical interface, user experience, and data management.
</p>
`;

aboutText.innerHTML = aboutEN_HTML;
aboutLabel.textContent = 'EN';
aboutSwitch.checked = false;
contactTextEl.innerHTML = contactEN_HTML;
contactLabel.textContent = 'EN';

let modalQueue = [];
let modalAnimating = false;
let currentIndex = 0;

if (closeMobileWarning && mobileWarning) {
  closeMobileWarning.addEventListener('click', () => {
    closeSound.currentTime = 0;
    closeSound.play();
    mobileWarning.classList.add('fade-out');
    setTimeout(() => {
      mobileWarning.style.display = 'none';
    }, 400);
  });
}

const resumeFiles = {
  EN: 'assets/CV/CV_Presti_Francesco_ENG.pdf',
  IT: 'assets/CV/CV_Presti_Francesco_ITA.pdf'
};

function updateResume(lang) {
  if (!resumeIframe) return;
  resumeIframe.style.opacity = 0;
  const currentLang = (lang || (cvSwitch.checked ? 'IT' : 'EN'));
  cvSwitch.addEventListener("change", () => {
  setLanguage(cvSwitch.checked ? "IT" : "EN");
});

  cvLabel.textContent = currentLang;
  resumeIframe.src = resumeFiles[currentLang];
  setTimeout(() => {
    resumeIframe.style.opacity = 1;
  }, 50);
}

closeButtons.forEach(btn => {
  btn.addEventListener('click', e => {
    const modal = btn.closest('.modal');
    closeSound.currentTime = 0;
    closeSound.play();
    closeModal(modal);
  });
});

overlay.addEventListener('click', () => {
  modals.forEach(m => {
    if (m.style.display === 'flex') {
      closeSound.currentTime = 0;
      closeSound.play();
      closeModal(m);
    }
  });
});

modals.forEach(modal => {
  modal.addEventListener('click', e => {
    if (e.target === modal) {
      closeSound.currentTime = 0;
      closeSound.play();
      closeModal(modal);
    }
  });
});

allButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    clickSound.currentTime = 0;
    clickSound.play();
  });
});

function glowSequence() {
  letters.forEach(letter => letter.classList.remove('glow'));
  letters.forEach((letter, index) => {
    setTimeout(() => {
      letter.classList.add('glow');
      if (index > 0) letters[index - 1].classList.remove('glow');
      if (index === letters.length - 1) {
        setTimeout(() => {
          letter.classList.remove('glow');
        }, delay);
      }
    }, index * delay);
  });
}
setTimeout(glowSequence, initialDelay);
setInterval(glowSequence, repeatDelay);

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  overlay.style.display = 'block';
  overlay.setAttribute('aria-hidden', 'false');
  modal.style.display = 'flex';
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  document.body.style.overflow = 'hidden';
  setTimeout(() => {
    const focusable = modal.querySelector('button, a, input, textarea');
    if (focusable) focusable.focus();
  }, 50);
}

function closeModal(modal) {
  if (!modal || modal.classList.contains('closing')) return;
  modal.classList.add('closing');
  modal.addEventListener('animationend', function handler() {
    modal.classList.remove('closing');
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    const anyOpen = Array.from(modals).some(m => m.style.display === 'flex');
    if (!anyOpen) {
      overlay.classList.remove('closing');
      overlay.style.display = 'none';
      overlay.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
    }
    modal.removeEventListener('animationend', handler);
    if (modalAnimating) {
      modalAnimating = false;
      processModalQueue();
    }
  });
}

function processModalQueue() {
  if (modalAnimating || modalQueue.length === 0) return;
  const nextModalId = modalQueue.shift();
  const currentOpen = Array.from(modals).find(m => m.style.display === 'flex');
  if (currentOpen) {
    modalAnimating = true;
    closeModal(currentOpen);
    currentOpen.addEventListener('animationend', function handler() {
      currentOpen.removeEventListener('animationend', handler);
      openModal(nextModalId);
      modalAnimating = false;
      processModalQueue();
    });
  } else {
    modalAnimating = true;
    openModal(nextModalId);
    modalAnimating = false;
    processModalQueue();
  }
}

modalButtons.forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    const id = btn.getAttribute('data-modal');
    modalQueue.push(id);
    processModalQueue();
  });
});

window.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    modals.forEach(m => {
      if (m.style.display === 'flex') closeModal(m);
    });
  }
});

linkedinBtn.addEventListener('click', () => {
  window.open('https://www.linkedin.com/in/francesco-presti-swarm/', '_blank', 'noopener,noreferrer');
});

document.addEventListener('DOMContentLoaded', () => {

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(emailAddress);

        const original = copyEmailBtn.style.background;
        copyEmailBtn.style.background = 'rgba(11,99,255,0.12)';
        setTimeout(() => copyEmailBtn.style.background = original, 450);

        const t = document.createElement('div');
        t.textContent = 'Copied';
        t.style.position = 'fixed';
        t.style.left = '50%';
        t.style.bottom = '18%';
        t.style.transform = 'translateX(-50%)';
        t.style.padding = '8px 12px';
        t.style.borderRadius = '8px';
        t.style.background = 'rgba(0,0,0,0.7)';
        t.style.color = '#fff';
        t.style.fontSize = '13px';
        t.style.zIndex = 20000;
        document.body.appendChild(t);
        setTimeout(() => t.remove(), 900);

        clickSound.currentTime = 0;
        clickSound.play().catch(()=>{});
        
      } catch (err) {
        console.warn('Clipboard copy failed', err);
      }
    });
  }

  if (contactMailtoBtn) {
    contactMailtoBtn.addEventListener('click', () => {
      clickSound.currentTime = 0;
      clickSound.play().catch(()=>{});
      window.location.href = `mailto:${emailAddress}`;
    });
  }
});

const muteToggle = document.getElementById("muteToggle");
let isMuted = localStorage.getItem("muted") === "true" ? true : false;
muteToggle.checked = !isMuted; 

function updateMuteState() {
    const audioElements = document.querySelectorAll("audio");

    audioElements.forEach(a => a.muted = isMuted);
    clickSound.muted = isMuted;
    closeSound.muted = isMuted;

    localStorage.setItem("muted", isMuted);
}

muteToggle.addEventListener("change", () => {
    isMuted = !muteToggle.checked;
    updateMuteState();
});

updateMuteState();

const langToggle = document.getElementById("langToggle");
const langLabel = document.querySelector(".lang-text");
const homeButtons = document.querySelectorAll(".buttons .btn:not(.link-icon)");

let currentLang = localStorage.getItem("lang") || "EN";
localStorage.setItem("lang", currentLang); 

cvSwitch.checked = (currentLang === 'IT');
updateResume(currentLang);

const translations = {
    EN: ["About Me", "Resume", "Contact Me"],
    IT: ["Chi Sono", "Curriculum", "Contattami"]
};

function applyLanguage(lang) {
    langLabel.style.opacity = 0;
    homeButtons.forEach(btn => btn.style.opacity = 0);

    setTimeout(() => {
        langLabel.textContent = lang;
        translations[lang].forEach((txt, i) => {
            homeButtons[i].textContent = txt;
        });
        langLabel.style.opacity = 1;
        homeButtons.forEach(btn => btn.style.opacity = 1);
    }, 200);
}

function applyContactContent(lang) {
  const content = (lang === 'IT') ? contactIT : contactEN;

  const elements = [contactTitle, contactNote, contactTextEl, contactMailtoBtn];

  elements.forEach(el => {
    if (el) {
      el.classList.remove('fade-in');
      el.classList.add('fade-out');
    }
  });

  setTimeout(() => {
    if (contactTitle) contactTitle.textContent = content.title;
    if (contactNote) contactNote.textContent = content.note;
    if (contactTextEl) contactTextEl.innerHTML = content.text;
    if (contactMailtoBtn) contactMailtoBtn.innerHTML = `${content.button} ${contactMailBtnIconHTML}`;
    if (contactLabel) contactLabel.textContent = lang;

    elements.forEach(el => {
      if (el) {
        el.classList.remove('fade-out');
        el.classList.add('fade-in');
      }
    });
  }, 350); 
}




function setLanguage(lang) {
  if (!lang) return;
  currentLang = lang;
  localStorage.setItem("lang", lang);

  langToggle.checked = (lang === 'IT');
  aboutSwitch.checked = (lang === 'IT');
  contactSwitch.checked = (lang === 'IT');
  cvSwitch.checked = (lang === 'IT');

  applyLanguage(lang);

if (aboutText) {
    aboutText.classList.remove('fade-in');
    aboutText.classList.add('fade-out');

    setTimeout(() => {
      aboutText.innerHTML = (lang === 'IT' ? aboutIT_HTML : aboutEN_HTML);
      if (aboutLabel) aboutLabel.textContent = lang;
      aboutText.classList.remove('fade-out');
      aboutText.classList.add('fade-in');
    }, 350);
}


  applyContactContent(lang);

  updateResume(lang);
}

langToggle.addEventListener("change", () => {
  setLanguage(langToggle.checked ? "IT" : "EN");
});

aboutSwitch.addEventListener("change", () => {
  setLanguage(aboutSwitch.checked ? "IT" : "EN");
});

contactSwitch.addEventListener("change", () => {
  setLanguage(contactSwitch.checked ? "IT" : "EN");
});

setLanguage(currentLang);

const preloader = document.getElementById("preloader");
const bgVideo = document.getElementById("bgVideo");

function hidePreloader() {
    if (!preloader) return;

    preloader.style.opacity = '1';
    preloader.style.transition = 'opacity 0.6s ease';

    setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 600);
    }, 300);
}

if (bgVideo) {
    if (bgVideo.readyState >= 4) { 
        hidePreloader();
    } else {
        bgVideo.addEventListener('canplaythrough', hidePreloader);
    }
} else {
    window.addEventListener("load", hidePreloader);
}

