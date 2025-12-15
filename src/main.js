document.addEventListener('DOMContentLoaded', () => {
    
    // 1. REGISTER GSAP
    gsap.registerPlugin(ScrollTrigger);

    // 2. MOBILE MENU LOGIC
    const burger = document.querySelector('.burger-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const body = document.body;

    function toggleMenu() {
        burger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        // Блокируем скролл страницы когда меню открыто
        if (mobileMenu.classList.contains('active')) {
            body.classList.add('no-scroll');
        } else {
            body.classList.remove('no-scroll');
        }
    }

    burger.addEventListener('click', toggleMenu);

    // Закрываем меню при клике на ссылку
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            toggleMenu();
        });
    });

    // 3. TEXT ANIMATIONS (SplitType + GSAP)
    const textElements = document.querySelectorAll('.split-text');
    
    textElements.forEach(el => {
        // Разбиваем текст на слова/строки
        const text = new SplitType(el, { types: 'lines, words' });
        
        gsap.from(text.words, {
            scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            opacity: 0,
            y: 30,
            duration: 0.8,
            stagger: 0.05,
            ease: "power3.out"
        });
    });

    // 4. SECTION REVEAL ANIMATIONS
    const sections = document.querySelectorAll('.section');
    sections.forEach(sec => {
        gsap.from(sec.children, {
            scrollTrigger: {
                trigger: sec,
                start: "top 80%"
            },
            opacity: 0,
            y: 50,
            duration: 1,
            stagger: 0.2,
            ease: "power2.out"
        });
    });

    // 5. HERO CANVAS ANIMATION (Constellation Effect)
    const canvas = document.getElementById('hero-canvas');
    if(canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2 + 1;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(99, 102, 241, 0.5)'; // Primary color
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < 50; i++) particles.push(new Particle());
        }

        function animateCanvas() {
            ctx.clearRect(0, 0, width, height);
            
            // Draw particles and lines
            particles.forEach((p, index) => {
                p.update();
                p.draw();
                
                // Connect particles
                for (let j = index + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
                    if (dist < 150) {
                        ctx.strokeStyle = `rgba(99, 102, 241, ${1 - dist/150})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            });
            requestAnimationFrame(animateCanvas);
        }

        window.addEventListener('resize', () => { resize(); initParticles(); });
        resize();
        initParticles();
        animateCanvas();
    }

    // 6. FORM & CAPTCHA
    const form = document.getElementById('contactForm');
    const num1 = Math.floor(Math.random() * 10);
    const num2 = Math.floor(Math.random() * 10);
    document.getElementById('captcha-question').textContent = `${num1} + ${num2} = ?`;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const msgDiv = document.getElementById('formMessage');
        const userAnswer = parseInt(document.getElementById('captcha-answer').value);
        
        // Валидация капчи
        if(userAnswer !== (num1 + num2)) {
            msgDiv.textContent = "Ошибка: неверный ответ на пример";
            msgDiv.className = "form-message error";
            return;
        }

        // Имитация AJAX
        const btn = form.querySelector('button');
        btn.textContent = "Отправка...";
        btn.disabled = true;

        setTimeout(() => {
            msgDiv.textContent = "Ваша заявка принята! Мы свяжемся с вами в ближайшее время.";
            msgDiv.className = "form-message success";
            btn.textContent = "Отправлено";
            form.reset();
        }, 1500);
    });

    // 7. COOKIE POPUP
    const cookiePopup = document.getElementById('cookiePopup');
    if (!localStorage.getItem('cookiesAccepted')) {
        setTimeout(() => {
            cookiePopup.style.display = 'block';
            gsap.from(cookiePopup, { y: 50, opacity: 0 });
        }, 2000);
    }

    document.getElementById('acceptCookies').addEventListener('click', () => {
        localStorage.setItem('cookiesAccepted', 'true');
        gsap.to(cookiePopup, { opacity: 0, y: 50, duration: 0.5, onComplete: () => {
            cookiePopup.style.display = 'none';
        }});
    });
});