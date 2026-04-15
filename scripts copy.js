/*===================================================================================================================
   SCRIPTS UNIFICADOS: BAIXA LISBON GROUP
   Incluye: Slider de Platos, Lightbox de Galería y Slider de Restaurantes (Index)
=====================================================================================================================*/

document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ Scripts cargados y listos.");

    /* --- 1. SLIDER DE PLATOS (MENU) --- */
    function moveSlide(direction, sliderId) {
        const sliderContainer = document.getElementById(sliderId);
        if (!sliderContainer) return;

        const slider = sliderContainer.querySelector('.slides');
        if (!slider) return;

        const slidesCount = slider.children.length;
        let index = parseInt(slider.getAttribute("data-index") || 0);

        index += direction;

        if (index < 0) index = slidesCount - 1;
        if (index >= slidesCount) index = 0;

        slider.style.transform = `translateX(-${index * 100}%)`;
        slider.setAttribute("data-index", index);
    }

    // Eventos para botones Prev/Next del menú
    const sliderButtons = document.querySelectorAll('.slider-buttons button');
    sliderButtons.forEach(btn => {
        btn.onclick = () => {
            const direction = btn.textContent.trim() === 'Prev' ? -1 : 1;
            moveSlide(direction, 'menuSlider');
        };
    });

    /* --- 2. AUTO SLIDER MENU (CON PAUSA EN HOVER) --- */
    const menuSlider = document.getElementById('menuSlider');
    if (menuSlider) {
        let autoSlide = setInterval(() => moveSlide(1, 'menuSlider'), 3000);
        menuSlider.onmouseenter = () => clearInterval(autoSlide);
        menuSlider.onmouseleave = () => {
            autoSlide = setInterval(() => moveSlide(1, 'menuSlider'), 3000);
        };
    }

    /* --- 3. LIGHTBOX DE GALERÍA --- */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const galleryImages = Array.from(document.querySelectorAll('.gallery-item img'));

    if (lightbox && galleryImages.length > 0) {
        const closeBtn = lightbox.querySelector('.close');
        const prevBtn = lightbox.querySelector('.prev');
        const nextBtn = lightbox.querySelector('.next');
        let currentIndex = 0;

        const openLightbox = (index) => {
            currentIndex = index;
            lightbox.style.display = 'flex';
            lightboxImg.src = galleryImages[currentIndex].src;
        };

        const showNext = () => {
            currentIndex = (currentIndex + 1) % galleryImages.length;
            lightboxImg.src = galleryImages[currentIndex].src;
        };

        const showPrev = () => {
            currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
            lightboxImg.src = galleryImages[currentIndex].src;
        };

        galleryImages.forEach((img, i) => {
            img.onclick = () => openLightbox(i);
            img.setAttribute('loading', 'lazy');
        });

        closeBtn.onclick = () => { lightbox.style.display = 'none'; };

        lightbox.onclick = (e) => {
            if (e.target !== lightboxImg && e.target !== prevBtn && e.target !== nextBtn) {
                lightbox.style.display = 'none';
            }
        };

        nextBtn.onclick = (e) => { e.stopPropagation(); showNext(); };
        prevBtn.onclick = (e) => { e.stopPropagation(); showPrev(); };
    }

    /* --- 4. SLIDER DE RESTAURANTES (PÁGINA INDEX) CON AUTO-PLAY --- */
    const track = document.querySelector('.res-slides-track');
    const btnNextRes = document.getElementById('btnNextRes');
    const btnPrevRes = document.getElementById('btnPrevRes');
    const resWrapper = document.querySelector('.res-slider-wrapper');

    if (track && btnNextRes && btnPrevRes) {
        let resIndex = 0;
        let autoPlayRes;

        const updateResSlider = () => {
            const items = track.children.length;
            const itemsPerPage = window.innerWidth > 768 ? 3 : 1;
            const totalSteps = Math.ceil(items / itemsPerPage);

            if (resIndex >= totalSteps) resIndex = 0;
            if (resIndex < 0) resIndex = totalSteps - 1;

            track.style.transform = `translateX(-${resIndex * 100}%)`;
        };

        const nextSlide = () => {
            resIndex++;
            updateResSlider();
        };

        // Función para iniciar el temporizador
        const startAutoPlay = () => {
            autoPlayRes = setInterval(nextSlide, 3000);
        };

        // Iniciar al cargar
        startAutoPlay();

        // Pausa al entrar con el ratón, reanuda al salir
        if (resWrapper) {
            resWrapper.onmouseenter = () => clearInterval(autoPlayRes);
            resWrapper.onmouseleave = () => startAutoPlay();
        }

        btnNextRes.onclick = (e) => {
            e.preventDefault();
            clearInterval(autoPlayRes); // Pausa momentánea al hacer clic
            nextSlide();
            startAutoPlay(); // Reinicia el contador de 3s
        };

        btnPrevRes.onclick = (e) => {
            e.preventDefault();
            clearInterval(autoPlayRes);
            resIndex--;
            updateResSlider();
            startAutoPlay();
        };

        window.addEventListener('resize', () => {
            resIndex = 0;
            track.style.transform = 'translateX(0)';
        });
    }

    /* --- CARGA DEL FOOTER UNIVERSAL --- */
    const footerPlaceholder = document.getElementById('universal-footer');
    if (footerPlaceholder) {
        fetch('footer.html')
            .then(response => {
                if (!response.ok) throw new Error('No se encontró footer.html');
                return response.text();
            })
            .then(data => {
                footerPlaceholder.innerHTML = data;
                // Forzamos la visibilidad si tiene la clase reveal
                footerPlaceholder.style.opacity = "1";
                footerPlaceholder.style.transform = "translateY(0)";
            })
            .catch(err => {
                console.error("Error cargando el footer:", err);
                footerPlaceholder.innerHTML = "<p style='color:white; text-align:center;'>Error loading footer.</p>";
            });
    }
});