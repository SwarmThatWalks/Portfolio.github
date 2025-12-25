const letters = document.querySelectorAll('#glow-text span');
const delay = 150;
const repeatDelay = 10000;
const initialDelay = 2000;
const clickSound = new Audio('assets/soundeffect/button3.wav');
clickSound.volume = 0.5;
const navItems = document.querySelectorAll('.nav-item');
const closeSound = new Audio('assets/soundeffect/button4.wav');
closeSound.volume = 0.5;

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
const scrollHint = document.getElementById('scroll-hint');
const sendEmailBtn = document.getElementById('sendEmailBtn');
const sendEmailText = sendEmailBtn.querySelector('.btn-text');

let currentActiveIndex = 0;

const navTranslations = {
    EN: ["About Me", "Resume", "Contact Me"],
    IT: ["Chi Sono", "Curriculum", "Contattami"]
};

const aboutTextData = {
    EN: `
    <div style="display:flex; gap:20px; align-items:flex-start; margin-bottom:20px;">
        <img src="assets/img/foto.webp" style="width:80px; height:80px; border-radius:50%;object-fit:cover; background: white;">
        <div style="text-align: left;">
            <h3 style="margin:0 0 5px 0; color:#fff;">Francesco Presti</h3>
            <p style="margin:0; font-size:14px; color:#aaa;">Software & Web Development | Graphic Design</p>
        </div>
    </div>
    <div style="text-align: left;">
        <p>I am a versatile and hands-on person, able to adapt to different professional environments and work effectively in a team. I hold a diploma in <span class="skill">Computer Science and Telecommunications</span>, and throughout my school years, I developed a passion for skills in graphic design and video editing, particularly with <span class="skill">Adobe After Effects</span>.</p>
        <p>I have experience in web and software development (<span class="skill">PHP</span>, <span class="skill">WordPress</span>), intermediate skills in Office (<span class="skill">Word</span>, <span class="skill">Excel</span>, <span class="skill">PowerPoint</span>), and medium-to-advanced abilities in graphic design and video editing (<span class="skill">Adobe After Effects</span> and <span class="skill">Premiere Pro</span>).</p>
        <p>During my school years, I worked as a <span class="skill">waiter</span> and <span class="skill">kitchen assistant</span> in a restaurant, handling dish preparation, table service, dishwashing, and cleaning, both during day and night shifts.</p>
        <p>I built this web portfolio from scratch using <span class="skill">Visual Studio Code</span>, mainly to experiment and test my skills.</p>
    </div>
    `,
    IT: `
    <div style="display:flex; gap:20px; align-items:flex-start; margin-bottom:20px;">
        <img src="assets/img/foto.webp" style="width:80px; height:80px; border-radius:50%;object-fit:cover; background: white;">
        <div style="text-align: left;">
            <h3 style="margin:0 0 5px 0; color:#fff;">Francesco Presti</h3>
            <p style="margin:0; font-size:14px; color:#aaa;">Sviluppo Software & Web | Graphic Design</p>
        </div>
    </div>
    <div style="text-align: left;">
        <p>Sono una persona versatile e operativa, capace di adattarmi a diversi contesti professionali e di lavorare in squadra. Sono diplomato in <span class="skill">Informatica e Telecomunicazioni</span> e, nel corso degli anni scolastici, ho coltivato per passione competenze in grafica e montaggio video, in particolare con <span class="skill">Adobe After Effects</span>.</p>
        <p>Ho esperienza nello sviluppo web e software (<span class="skill">PHP</span>,<span class="wordPress">WordPress</span>), competenze intermedie in Office (<span class="skill">Word</span>,<span class="skill"> Excel</span>,<span class="skill"> PowerPoint</span>) e abilità medio-alte in graphic design e video editing (<span class="skill">Adobe After Effects</span> e <span class="skill">Premiere Pro</span>).</p>
        <p>Durante il periodo scolastico ho lavorato come <span class="skill">cameriere</span> e <span class="skill">aiuto cuoco</span> in un ristorante, occupandomi di preparazione dei piatti, servizio ai tavoli, lavaggio stoviglie e pulizia del locale.</p>
        <p>Ho realizzato questo portfolio web da zero utilizzando <span class="skill">Visual Studio Code</span>, sviluppandolo principalmente per sperimentare e mettere alla prova le mie competenze.</p>
    </div>
    `
};

const contactData = {
    EN: {
        title: "Contact Me",
        desc: "<p>The easiest way to reach me is by email. I do not often check messages on social media, so please direct any inquiries directly to my email address below.</p>",
        note: "Your email will not be shared.",
        btn: "Send Email"
    },
    IT: {
        title: "Contattami",
        desc: "<p>Il modo più semplice per contattarmi è tramite email. Non controllo spesso i messaggi dai social, quindi per favore inoltra le domande direttamente alla mia email.</p>",
        note: "La tua email non verrà condivisa.",
        btn: "Invia Email"
    }
};

const headings = {
    EN: { about: "About Me", resume: "Resume", hint: "scroll to see more" },
    IT: { about: "Chi Sono", resume: "Curriculum", hint: "scorri per vedere di più" }
};

const warningMsgs = {
    EN: "⚠️ Optimized for desktop. Mobile features a simplified layout.",
    IT: "⚠️ Questo sito è ottimizzato per desktop. Il layout mobile è una versione semplificata."
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

const bgVideo = document.getElementById('bgVideo');
let speedAnimFrame;

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        bgVideo.pause();
    } else {
        bgVideo.play();
    }
});

function burstVideo() {
    cancelAnimationFrame(speedAnimFrame);
    bgVideo.play();
    
    let startTime = null;
    const peakSpeed = 12.0;
    const duration = 1200;

    function animate(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easedProgress = 1 - Math.pow(1 - progress, 4);
        bgVideo.playbackRate = peakSpeed - (easedProgress * (peakSpeed - 1.0));

        if (progress < 1) {
            speedAnimFrame = requestAnimationFrame(animate);
        } else {
            bgVideo.playbackRate = 1.0;
        }
    }
    speedAnimFrame = requestAnimationFrame(animate);
}

function playSound(audio) {
    if (!audio.paused) {
        audio.pause();
    }
    audio.currentTime = 0;
    audio.play().catch(()=>{});
}

if (closeMobileWarning && mobileWarning) {
  closeMobileWarning.addEventListener('click', () => {
    playSound(closeSound);
    mobileWarning.classList.add('fade-out');
    setTimeout(() => {
      mobileWarning.style.display = 'none';
    }, 400);
  });
}

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

navItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        if (item.classList.contains('active')) return;

        playSound(clickSound);
        if (window.innerWidth > 900) {
            burstVideo();
        }
        
        currentActiveIndex = index;

        navItems.forEach(n => n.classList.remove('active'));
        item.classList.add('active');
        
        const targetId = item.getAttribute('data-target');
        switchPanel(targetId);
    });
});

function switchPanel(panelId) {
    const panels = document.querySelectorAll('.content-panel');
    const targetPanel = document.getElementById(panelId);
    const isMobile = window.innerWidth <= 900;

    if (isMobile) {
        const currentPanel = document.querySelector('.content-panel.active');
        if (currentPanel) {
            currentPanel.style.opacity = '0';
            setTimeout(() => {
                panels.forEach(panel => {
                    panel.classList.remove('active');
                    panel.style.display = 'none';
                });
                targetPanel.style.display = 'flex';
                targetPanel.style.opacity = '0';
                void targetPanel.offsetWidth;
                targetPanel.classList.add('active');
                targetPanel.style.opacity = '1';
            }, 300);
        } else {
            panels.forEach(panel => {
                panel.classList.remove('active');
                panel.style.display = 'none';
            });
            targetPanel.style.display = 'flex';
            targetPanel.classList.add('active');
            targetPanel.style.opacity = '1';
        }
    } else {
        panels.forEach(panel => {
            panel.classList.remove('active');
        });
        targetPanel.classList.add('active');
    }
}

if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(emailAddress);
            const originalColor = copyEmailBtn.style.color;
            copyEmailBtn.style.color = '#0ff';
            setTimeout(() => copyEmailBtn.style.color = originalColor, 450);
            playSound(clickSound);
        } catch (err) {
            console.warn('Clipboard copy failed', err);
        }
    });
}

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
let currentLang = localStorage.getItem("lang") || "EN";

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem("lang", lang);
    
    const elementsToFade = [
        ...navItems,
        aboutTitle,
        resumeTitle,
        contactTitle,
        scrollHint,
        aboutContent,
        contactDesc,
        contactNote,
        sendEmailBtn,
        langLabel,
        warningText,
        cvImage,
        cvDownloadBtn
    ].filter(el => el !== null);

    elementsToFade.forEach(el => {
        el.classList.remove('lang-fade');
        el.style.opacity = '0';
    });

    setTimeout(() => {
        langLabel.textContent = lang;
        
        navItems.forEach((item, index) => {
            item.textContent = navTranslations[lang][index];
        });

        aboutTitle.textContent = headings[lang].about;
        resumeTitle.textContent = headings[lang].resume;
        contactTitle.textContent = contactData[lang].title;
        scrollHint.textContent = headings[lang].hint;

        aboutContent.innerHTML = aboutTextData[lang];
        contactDesc.innerHTML = contactData[lang].desc;
        contactNote.textContent = contactData[lang].note;
        sendEmailText.textContent = contactData[lang].btn;

        if (warningText) {
            warningText.textContent = warningMsgs[lang];
        }

        cvImage.src = resumeData[lang].img;
        cvDownloadBtn.href = resumeData[lang].pdf;
        cvDownloadText.textContent = resumeData[lang].btnText;

        elementsToFade.forEach(el => {
            el.classList.add('lang-fade');
        });
    }, 300);
}

langToggle.checked = (currentLang === 'IT');
setLanguage(currentLang);

langToggle.addEventListener("change", () => {
  setLanguage(langToggle.checked ? "IT" : "EN");
});

const preloader = document.getElementById("preloader");

function hidePreloader() {
    if (!preloader) return;
    setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 1200);
    }, 2800);
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

if (bgVideo) {
    bgVideo.addEventListener('canplaythrough', () => {
        if(loadProgress < 100) loadProgress = 100;
    });
}
