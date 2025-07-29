document.addEventListener('DOMContentLoaded', function () {
    // --- Preloader ---
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        preloader.classList.add('loaded');
    });

    // --- Custom Cursor ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: 'forwards' });
    });
    document.querySelectorAll('a, button, .project-card, .timeline-content, .certificate-item').forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-interact'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-interact'));
    });

    // --- Mobile Menu ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenuButton.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
    document.querySelectorAll('#mobile-menu a').forEach(link => {
        link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
    });

    // --- Typing Animation ---
    const typingTextElement = document.getElementById('typing-text');
    const phrases = ["Quality Assurance Enthusiast", "Mobile Developer", "Creative Problem Solver"];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    function type() {
        const currentPhrase = phrases[phraseIndex];
        if (isDeleting) {
            typingTextElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingTextElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }
        if (!isDeleting && charIndex === currentPhrase.length) {
            setTimeout(() => isDeleting = true, 2000);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
        }
        const typeSpeed = isDeleting ? 50 : 100;
        setTimeout(type, typeSpeed);
    }
    type();
    
    // --- Particle Canvas ---
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    let particles = [];
    const mouse = { x: null, y: null, radius: 100 };
    window.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });
    class Particle {
        constructor(x, y, dirX, dirY, size, color) {
            this.x = x; this.y = y; this.dirX = dirX; this.dirY = dirY;
            this.size = size; this.color = color;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        update() {
            if (this.x > canvas.width || this.x < 0) this.dirX = -this.dirX;
            if (this.y > canvas.height || this.y < 0) this.dirY = -this.dirY;
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < mouse.radius) {
                if (mouse.x < this.x && this.x < canvas.width - this.size * 10) this.x += 5;
                if (mouse.x > this.x && this.x > this.size * 10) this.x -= 5;
                if (mouse.y < this.y && this.y < canvas.height - this.size * 10) this.y += 5;
                if (mouse.y > this.y && this.y > this.size * 10) this.y -= 5;
            }
            this.x += this.dirX;
            this.y += this.dirY;
            this.draw();
        }
    }
    function initParticles() {
        particles = [];
        let numberOfParticles = (canvas.height * canvas.width) / 9000;
        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2) + 1;
            let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
            let dirX = (Math.random() * .4) - .2;
            let dirY = (Math.random() * .4) - .2;
            particles.push(new Particle(x, y, dirX, dirY, size, 'rgba(56, 189, 248, 0.5)'));
        }
    }
    function animateParticles() {
        requestAnimationFrame(animateParticles);
        ctx.clearRect(0, 0, innerWidth, innerHeight);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
        }
    }
    initParticles();
    animateParticles();
    window.addEventListener('resize', () => {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        mouse.radius = 100;
        initParticles();
    });

    // --- Spotlight Effect ---
    const heroSection = document.getElementById('hero');
    const spotlight = heroSection.querySelector('.spotlight');
    heroSection.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        spotlight.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(56, 189, 248, 0.15) 0%, rgba(56, 189, 248, 0) 50%)`;
    });
    
    // --- Scroll Animations & Active Nav ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('header .nav-link');
    const headerOffset = 100;
    
    let scrollObserver;
    function initializeScrollObserver() {
        if (scrollObserver) {
            scrollObserver.disconnect();
        }
        scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        }, { rootMargin: "0px 0px -50px 0px" });
        document.querySelectorAll('[data-scroll]').forEach(el => scrollObserver.observe(el));
    }
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - headerOffset) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });
    
    // --- Project Filtering and Dynamic Loading ---
    const projectData = [
        { category: 'qa', img: 'https://placehold.co/400x250/0ea5e9/ffffff?text=QA+Testing', tag: 'Quality Assurance', title: 'Pengujian Aplikasi Web & Mobile', desc: 'Pengujian manual pada aplikasi edukasi dan kalkulator BMI, membuat test case dan laporan bug.' },
        { category: 'android', img: 'https://placehold.co/400x250/10b981/ffffff?text=Android+App', tag: 'Android Development', title: 'Aplikasi Catatan Harian', desc: 'Mengembangkan aplikasi Android native dengan Java/Kotlin dan Jetpack Compose, fitur CRUD, dan rekap mood.' },
        { category: 'android', img: 'https://placehold.co/400x250/10b981/ffffff?text=BMI+App', tag: 'Android Development', title: 'Kalkulator BMI', desc: 'Membuat aplikasi BMI sederhana dengan fungsionalitas untuk membagikan hasil perhitungan.' },
        { category: 'web', img: 'https://placehold.co/400x250/f59e0b/ffffff?text=Web+Edu', tag: 'Web Development', title: 'Website Edukasi Sampah', desc: 'Website informatif menggunakan HTML, CSS, JS, dan PHP dengan fungsionalitas CRUD.' },
        { category: 'web', img: 'https://placehold.co/400x250/f59e0b/ffffff?text=Web+Quiz', tag: 'Web Development', title: 'Website Kuis Sepak Bola', desc: 'Aplikasi kuis interaktif dengan Laravel, memanfaatkan database untuk mengelola pertanyaan dan skor.' },
    ];
    const projectGallery = document.getElementById('project-gallery');
    function renderProjects(filter = 'all') {
        projectGallery.innerHTML = '';
        const filteredProjects = filter === 'all' ? projectData : projectData.filter(p => p.category === filter);
        filteredProjects.forEach((p, index) => {
            const card = document.createElement('div');
            card.className = 'project-card section-card p-6 rounded-xl h-full flex flex-col';
            card.setAttribute('data-scroll', 'fade-up');
            card.style.transitionDelay = `${index * 100}ms`;
            card.innerHTML = `
                <img src="${p.img}" alt="Gambar Proyek ${p.title}" class="rounded-lg mb-4 w-full h-48 object-cover">
                <div class="flex-grow">
                    <span class="inline-block bg-sky-500/20 text-sky-300 text-xs font-semibold px-2.5 py-0.5 rounded-full mb-3">${p.tag}</span>
                    <h3 class="text-lg font-bold text-white mb-2">${p.title}</h3>
                    <p class="text-slate-400 text-sm">${p.desc}</p>
                </div>
            `;
            projectGallery.appendChild(card);
        });
        initializeScrollObserver();
    }
    document.querySelectorAll('.project-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelector('.project-tab.active').classList.remove('active');
            tab.classList.add('active');
            renderProjects(tab.dataset.filter);
        });
    });
    renderProjects();

    // --- Skills Grid Population ---
    const skillsData = [
        { name: 'Java', icon: '💻' }, { name: 'Kotlin', icon: '📱' }, { name: 'PHP', icon: '🌐' }, { name: 'JavaScript', icon: '⚡' },
        { name: 'Jetpack Compose', icon: '🎨' }, { name: 'Laravel', icon: ' फ्रेम' }, { name: 'Flutter', icon: '🐦' },
        { name: 'Manual Testing', icon: '🧪' }, { name: 'Selenium', icon: '🤖' }, { name: 'Postman', icon: '📬' },
        { name: 'MySQL', icon: '🐬' }, { name: 'MongoDB', icon: '🍃' }, { name: 'Git', icon: '🌿' }
    ];
    const skillsContainer = document.querySelector('#skills .grid');
    skillsData.forEach(skill => {
        const skillElement = document.createElement('div');
        skillElement.className = 'flex flex-col items-center justify-center p-4 bg-slate-800/50 rounded-lg hover:bg-slate-700/50 transition-colors h-28';
        skillElement.innerHTML = `
            <div class="text-4xl mb-2">${skill.icon}</div>
            <span class="font-medium text-white text-center">${skill.name}</span>
        `;
        skillsContainer.appendChild(skillElement);
    });

    // --- Certificate Gallery and Modal ---
    const certificates = [
        { title: 'Soft Skill Career Class (STAR)', img: 'https://placehold.co/600x420/0284c7/ffffff?text=Sertifikat+STAR' },
        { title: 'Data Communication and Network', img: 'https://placehold.co/600x420/0d9488/ffffff?text=Sertifikat+Jaringan' },
        { title: 'Introduction to MongoDB', img: 'https://placehold.co/600x420/16a34a/ffffff?text=Sertifikat+MongoDB' },
        { title: 'Dasar-Dasar Pemrograman Web', img: 'https://placehold.co/600x420/f97316/ffffff?text=Sertifikat+Web+Dasar' },
        { title: 'Manajemen Proyek Agile', img: 'https://placehold.co/600x420/c026d3/ffffff?text=Sertifikat+Agile' },
        { title: 'UI/UX Design untuk Pemula', img: 'https://placehold.co/600x420/be123c/ffffff?text=Sertifikat+UI/UX' },
    ];
    const certificateGallery = document.getElementById('certificate-gallery');
    const modal = document.getElementById('certificate-modal');
    const modalImg = document.getElementById('modal-img');
    const modalClose = document.getElementById('modal-close');
    const modalBackdrop = document.getElementById('modal-backdrop');

    certificates.forEach((cert) => {
        const certItem = document.createElement('div');
        certItem.className = 'certificate-item section-card rounded-lg overflow-hidden cursor-pointer w-80 flex-shrink-0 snap-center transition-transform duration-300 hover:-translate-y-2';
        certItem.innerHTML = `
            <img src="${cert.img}" alt="${cert.title}" class="w-full h-48 object-cover">
            <div class="p-4 bg-slate-800">
                <h3 class="font-semibold text-white truncate">${cert.title}</h3>
            </div>
        `;
        certItem.addEventListener('click', () => {
            modalImg.src = cert.img;
            modal.classList.remove('hidden');
            setTimeout(() => {
                modal.classList.remove('opacity-0');
                modalImg.classList.remove('scale-95');
            }, 10);
        });
        certificateGallery.appendChild(certItem);
    });

    function closeModal() {
        modal.classList.add('opacity-0');
        modalImg.classList.add('scale-95');
        setTimeout(() => modal.classList.add('hidden'), 300);
    }
    modalClose.addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', closeModal);
    
    // --- Certificate Drag-to-Scroll & Buttons ---
    const slider = document.getElementById('certificate-gallery');
    const scrollLeftBtn = document.getElementById('scroll-left-btn');
    const scrollRightBtn = document.getElementById('scroll-right-btn');
    let isDown = false;
    let startX;
    let scrollLeft;

    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.classList.add('active');
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });
    slider.addEventListener('mouseleave', () => {
        isDown = false;
        slider.classList.remove('active');
    });
    slider.addEventListener('mouseup', () => {
        isDown = false;
        slider.classList.remove('active');
    });
    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2; // scroll-fast
        slider.scrollLeft = scrollLeft - walk;
    });

    const scrollAmount = 320 + 32; // w-80 (320px) + space-x-8 (32px)

    scrollLeftBtn.addEventListener('click', () => {
        slider.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });

    scrollRightBtn.addEventListener('click', () => {
        slider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });

    const handleArrowButtons = () => {
        const maxScrollLeft = slider.scrollWidth - slider.clientWidth;
        scrollLeftBtn.disabled = slider.scrollLeft < 10;
        scrollRightBtn.disabled = slider.scrollLeft > maxScrollLeft - 10;
    }

    slider.addEventListener('scroll', handleArrowButtons);
    // Initial check after elements are loaded
    window.addEventListener('load', () => setTimeout(handleArrowButtons, 500));


    initializeScrollObserver(); // Initial call
});