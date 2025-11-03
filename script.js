document.addEventListener('DOMContentLoaded', function () {
    // ----------------------------------------------------
    // 1. MISE À JOUR DYNAMIQUE DE L'ANNÉE dans le footer
    // ----------------------------------------------------
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // ----------------------------------------------------
    // 2. GESTION DU MENU MOBILE (Toggle)
    // ----------------------------------------------------
    const btnMenu = document.getElementById('btn-menu');
    const nav = document.getElementById('nav');

    if (btnMenu && nav) {
        // Toggle la classe 'active' sur la navigation
        btnMenu.addEventListener('click', () => {
            nav.classList.toggle('active');
        });

        // Ferme le menu lorsque l'utilisateur clique sur un lien (navigation)
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                // Ferme le menu seulement si le mode mobile est actif (classe 'active' présente)
                if (nav.classList.contains('active')) {
                    nav.classList.remove('active');
                }
            });
        });
    }

    // ----------------------------------------------------
    // 3. GESTION DES CARROUSELS D'IMAGES et LIGHTBOX
    // ----------------------------------------------------
    const carousels = document.querySelectorAll('.carousel');
    
    // Éléments de la Lightbox
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    const lightboxClose = document.querySelector('.lightbox-close');

    let currentProjectImages = [];
    let currentImageIndex = 0;

    // --- Fonction d'ouverture de la Lightbox ---
    const openLightbox = (imageIndex, imagesArray) => {
        currentProjectImages = imagesArray;
        currentImageIndex = imageIndex;
        
        // Afficher la lightbox
        lightbox.style.display = 'flex';
        // Mettre à jour l'image et la légende
        updateLightboxImage();
        // Cacher le scroll du corps du document
        document.body.style.overflow = 'hidden';
    };

    // --- Fonction de mise à jour de l'image dans la Lightbox ---
    const updateLightboxImage = () => {
        const image = currentProjectImages[currentImageIndex];
        if (image) {
            lightboxImage.src = image.src;
            lightboxImage.alt = image.alt;
            lightboxCaption.textContent = image.alt;
        }
    };

    // --- Fonctions de navigation dans la Lightbox ---
    const navigateLightbox = (direction) => {
        // La navigation dans la lightbox est en boucle (cycle)
        currentImageIndex += direction;
        if (currentImageIndex < 0) {
            currentImageIndex = currentProjectImages.length - 1;
        } else if (currentImageIndex >= currentProjectImages.length) {
            currentImageIndex = 0;
        }
        updateLightboxImage();
    };

    // --- Fermeture de la Lightbox ---
    const closeLightbox = () => {
        lightbox.style.display = 'none';
        document.body.style.overflow = ''; // Rétablir le défilement
    };

    // Événements de fermeture
    lightboxClose.addEventListener('click', closeLightbox);
    // Événement pour fermer en cliquant sur le fond noir
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Événements de navigation dans la modale
    lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation(); // Empêche la fermeture via l'événement sur le fond
        navigateLightbox(-1);
    });
    lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        navigateLightbox(1);
    });

    // Événements clavier (Échap et flèches)
    document.addEventListener('keydown', (e) => {
        if (lightbox.style.display === 'flex') {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                navigateLightbox(-1);
            } else if (e.key === 'ArrowRight') {
                navigateLightbox(1);
            }
        }
    });


    // --- Logique du Carrousel et Initialisation de la Lightbox ---
    carousels.forEach(carousel => {
        const slides = carousel.querySelector('.slides');
        const slideImages = slides.querySelectorAll('img');
        const prevButton = carousel.querySelector('.prev');
        const nextButton = carousel.querySelector('.next');
        const dotsContainer = carousel.querySelector('.carousel-dots');
        let currentIndex = 0;
        
        // Stocke les références des images du projet
        const imagesInProject = Array.from(slideImages);

        // Si il n'y a qu'une seule image, on désactive la navigation du carrousel
        if (slideImages.length <= 1) {
            if (prevButton) prevButton.style.display = 'none';
            if (nextButton) nextButton.style.display = 'none';
            if (dotsContainer) dotsContainer.style.display = 'none';
        }


        // Ajout de l'événement clic pour ouvrir la lightbox sur toutes les images
        imagesInProject.forEach((img, index) => {
            // Le style 'cursor: zoom-in' est dans le CSS maintenant
            img.addEventListener('click', (e) => {
                e.stopPropagation(); // Empêche l'ouverture si on clique sur un bouton de carrousel (au cas où)
                openLightbox(index, imagesInProject);
            });
        });
        
        // --- Fonctions de gestion du carrousel (visuel) ---

        // Fonction pour afficher une diapositive spécifique
        const showSlide = (index) => {
            // S'assurer que l'index est valide (boucle infinie)
            if (index >= slideImages.length) {
                currentIndex = 0;
            } else if (index < 0) {
                currentIndex = slideImages.length - 1;
            } else {
                currentIndex = index;
            }

            // Mettre à jour les classes des images
            slideImages.forEach((img, i) => {
                img.classList.remove('active');
                if (i === currentIndex) {
                    img.classList.add('active');
                }
            });

            // Mettre à jour les points de navigation
            updateDots();
        };

        // Créer les points de navigation (dots)
        const createDots = () => {
            if (dotsContainer) {
                dotsContainer.innerHTML = '';
                slideImages.forEach((_, i) => {
                    const dot = document.createElement('button');
                    dot.setAttribute('aria-label', `Aller à l'image ${i + 1}`);
                    dot.addEventListener('click', () => showSlide(i));
                    dotsContainer.appendChild(dot);
                });
            }
        };

        // Mettre à jour l'état actif des points
        const updateDots = () => {
            if (dotsContainer) {
                const dots = dotsContainer.querySelectorAll('button');
                dots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === currentIndex);
                });
            }
        };

        // Initialisation des carrousels
        createDots();
        showSlide(0); // Afficher la première diapositive

        // Gestion des événements des boutons du carrousel
        if (prevButton) {
            prevButton.addEventListener('click', () => showSlide(currentIndex - 1));
        }
        if (nextButton) {
            nextButton.addEventListener('click', () => showSlide(currentIndex + 1));
        }

    });
});