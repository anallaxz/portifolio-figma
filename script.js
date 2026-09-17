
document.addEventListener('DOMContentLoaded', () => {
  // Elementos do DOM
  const header = document.getElementById('header');
  const mainNav = document.getElementById('main-nav');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const themeToggle = document.getElementById('theme-toggle');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');

  // ==========================================
  // 1. Alternador de Tema (Claro / Escuro)
  // ==========================================
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }

  // ==========================================
  // 2. Cabeçalho com borda sutil ao rolar
  // ==========================================
  const handleScrollHeader = () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScrollHeader, { passive: true });

  // ==========================================
  // 3. Menu Mobile
  // ==========================================
  if (mobileMenuBtn && mainNav) {
    mobileMenuBtn.addEventListener('click', () => {
      mainNav.classList.toggle('open');
      const isOpen = mainNav.classList.contains('open');
      mobileMenuBtn.setAttribute('aria-expanded', isOpen);
    });

    // Fechar ao clicar em qualquer link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
      });
    });
  }

  // ==========================================
  // 4. Destaque do link ativo no menu (ScrollSpy)
  // ==========================================
  const observerTargets = document.querySelectorAll('section[id], #contato');
  
  const observerOptions = {
    root: null,
    rootMargin: '-25% 0px -55% 0px',
    threshold: 0.1
  };

  const observerCallback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);
  observerTargets.forEach(target => observer.observe(target));

  // ==========================================
  // 5. Interação com o Formulário de Contato
  // ==========================================
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      const inputs = contactForm.querySelectorAll('input[required], textarea[required]');

      inputs.forEach(input => {
        const parent = input.closest('.form-group');
        if (!input.value.trim()) {
          parent.classList.add('has-error');
          isValid = false;
        } else if (input.type === 'email' && !validateEmail(input.value)) {
          parent.classList.add('has-error');
          isValid = false;
        } else {
          parent.classList.remove('has-error');
        }
      });

      if (isValid) {
        const submitBtn = document.getElementById('btn-submit');
        const originalText = submitBtn.innerHTML;

        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Enviando...</span>`;

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
          contactForm.reset();

          formFeedback.className = 'form-feedback success';
          formFeedback.textContent = 'Mensagem enviada com sucesso! Entrarei em contato em breve.';

          setTimeout(() => {
            formFeedback.style.display = 'none';
          }, 6000);
        }, 800);
      }
    });

    // Limpar erros ao digitar
    contactForm.querySelectorAll('input, textarea').forEach(field => {
      field.addEventListener('input', () => {
        const parent = field.closest('.form-group');
        if (parent) {
          parent.classList.remove('has-error');
        }
      });
    });
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // ==========================================
  // 6. Efeito interativo suave na logo do Hero
  // ==========================================
  const logoWrapper = document.querySelector('.logo-wrapper');
  if (logoWrapper) {
    logoWrapper.addEventListener('mousemove', (e) => {
      const rect = logoWrapper.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      
      const logoImg = document.getElementById('hero-logo');
      if (logoImg) {
        logoImg.style.transform = `scale(1.02) translate(${x * 6}px, ${y * 6}px)`;
      }
    });

    logoWrapper.addEventListener('mouseleave', () => {
      const logoImg = document.getElementById('hero-logo');
      if (logoImg) {
        logoImg.style.transform = 'scale(1) translate(0px, 0px)';
      }
    });
  }

  // ==========================================
  // 7. Scroll Reveal (Fade-in e Fade-out Bidirecional)
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        } else {
          // Remove a classe active quando sai da tela para fazer fade-out
          // e permitir que o fade-in ocorra novamente ao subir ou descer
          entry.target.classList.remove('active');
        }
      });
    }, {
      root: null,
      threshold: 0.08,
      rootMargin: '0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // ==========================================
  // 8. Interatividade no Card Social (Instagram)
  // ==========================================
  const btnLike = document.getElementById('btn-like');
  const heartIcon = document.getElementById('heart-icon');
  const likeCounter = document.getElementById('like-counter');
  const cardMetaText = document.getElementById('card-meta-text');
  let isLiked = false;
  let likesCount = 900;
  let commentsCount = 500;

  if (btnLike && heartIcon && likeCounter) {
    btnLike.addEventListener('click', (e) => {
      isLiked = !isLiked;
      
      if (isLiked) {
        likesCount++;
        heartIcon.textContent = '💜';
        heartIcon.classList.add('liked');
        
        // Criar partículas de coração flutuante
        createFloatingHearts(btnLike);
      } else {
        likesCount--;
        heartIcon.textContent = '♡';
        heartIcon.classList.remove('liked');
      }

      likeCounter.textContent = likesCount;
      updateCardMeta();
    });
  }

  function createFloatingHearts(targetEl) {
    const rect = targetEl.getBoundingClientRect();
    for (let i = 0; i < 4; i++) {
      setTimeout(() => {
        const heart = document.createElement('div');
        heart.className = 'floating-heart-particle';
        heart.textContent = '💜';
        heart.style.left = `${rect.left + rect.width / 2 + (Math.random() * 20 - 10)}px`;
        heart.style.top = `${rect.top + window.scrollY}px`;
        document.body.appendChild(heart);

        setTimeout(() => heart.remove(), 900);
      }, i * 120);
    }
  }

  // Botão Salvar
  const btnSalvar = document.getElementById('btn-salvar');
  if (btnSalvar) {
    let isSaved = false;
    btnSalvar.addEventListener('click', () => {
      isSaved = !isSaved;
      if (isSaved) {
        btnSalvar.classList.add('saved');
        btnSalvar.textContent = 'salvo ✓';
      } else {
        btnSalvar.classList.remove('saved');
        btnSalvar.textContent = 'salvar';
      }
    });
  }

  // Botão Comentar e Input Inline
  const btnComentar = document.getElementById('btn-comentar');
  const inlineCommentBox = document.getElementById('inline-comment-box');
  const inlineCommentInput = document.getElementById('inline-comment-input');
  const btnSendComment = document.getElementById('btn-send-comment');

  if (btnComentar && inlineCommentBox) {
    btnComentar.addEventListener('click', () => {
      inlineCommentBox.classList.toggle('open');
      if (inlineCommentBox.classList.contains('open')) {
        inlineCommentInput.focus();
      }
    });

    const sendComment = () => {
      if (inlineCommentInput.value.trim()) {
        commentsCount++;
        updateCardMeta();
        inlineCommentInput.value = '';
        inlineCommentBox.classList.remove('open');
        
        // Efeito de confirmação breve
        btnComentar.textContent = 'comentado ✓';
        setTimeout(() => {
          btnComentar.textContent = 'comentar';
        }, 2000);
      }
    };

    if (btnSendComment) btnSendComment.addEventListener('click', sendComment);
    if (inlineCommentInput) {
      inlineCommentInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendComment();
      });
    }
  }

  function updateCardMeta() {
    if (cardMetaText) {
      cardMetaText.textContent = `${likesCount} likes - ${commentsCount} comentários - 6 min`;
    }
  }

  // ==========================================
  // 9. Efeito 3D Tilt nas Fotos de Curiosidades
  // ==========================================
  const tiltCards = document.querySelectorAll('[data-tilt]');
  tiltCards.forEach(card => {
    const isFirstCard = card.classList.contains('photo-card-1');
    const baseRotation = isFirstCard ? -3.5 : 4.5;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      card.style.transform = `perspective(800px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) rotateZ(${baseRotation}deg) scale3d(1.04, 1.04, 1.04)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(800px) rotateX(0deg) rotateY(0deg) rotateZ(${baseRotation}deg) scale3d(1, 1, 1)`;
    });
  });

  // ==========================================
  // 10. Rastro Suave de Estrelas no Cursor
  // ==========================================
  let lastSparkleTime = 0;
  let lastX = 0;
  let lastY = 0;

  window.addEventListener('mousemove', (e) => {
    const now = Date.now();
    const distance = Math.hypot(e.clientX - lastX, e.clientY - lastY);

    // Cria partícula a cada 80ms ou quando moveu pelo menos 35px
    if (now - lastSparkleTime > 75 && distance > 30) {
      lastSparkleTime = now;
      lastX = e.clientX;
      lastY = e.clientY;

      createCursorSparkle(e.clientX, e.clientY);
    }
  }, { passive: true });

  function createCursorSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.className = 'cursor-sparkle';
    
    // Pequena variação aleatória de posição e tamanho
    const offsetX = (Math.random() - 0.5) * 16;
    const offsetY = (Math.random() - 0.5) * 16;
    const size = Math.floor(Math.random() * 6) + 12; // 12px a 18px

    sparkle.style.left = `${x + offsetX}px`;
    sparkle.style.top = `${y + offsetY}px`;
    sparkle.style.width = `${size}px`;
    sparkle.style.height = `${size}px`;

    document.body.appendChild(sparkle);

    sparkle.addEventListener('animationend', () => {
      sparkle.remove();
    });
  }
});
