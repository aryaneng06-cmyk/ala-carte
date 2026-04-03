/* ENHANCEMENTS JS - Handles requested interactive features */

document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. Dish Detail Modal --- */
    const dishesData = {
        bouillabaisse: {
            name: "Bouillabaisse", course: "Entrée", price: "€42",
            image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
            description: "A fragrant Provençal seafood stew bathed in saffron, fresh local herbs, and a rich rouille-topped crouton. Slow-simmered for four hours to draw every nuance from the sea.",
            ingredients: "Sea bass, mussels, prawns, saffron, fennel, tomato, garlic, rouille, sourdough crouton",
            allergens: ["Shellfish", "Gluten", "Fish"],
            wine: { name: "Rosé de Provence", note: "Crisp, dry, and mineral-driven to slice through the saffron-infused broth." }
        },
        ratatouille: {
            name: "Ratatouille", course: "Entrée", price: "€28",
            image: "./images/ratatouille.png",
            description: "A vibrant, thinly sliced vegetable medley beautifully layered and baked to perfection with aromatic herbs and a silky tomato coulis beneath.",
            ingredients: "Courgette, aubergine, red pepper, tomato, thyme, rosemary, olive oil, garlic",
            allergens: ["Vegan", "Gluten-Free"],
            wine: { name: "Côtes du Rhône Blanc", note: "Herbal and lightly mineral, a natural companion to Provençal vegetables." }
        },
        coq_au_vin: {
            name: "Coq au Vin", course: "Plat Principal", price: "€38",
            image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=800&q=80",
            description: "Classic rustic chicken braised to perfection in rich Burgundian wine with pearl onions, lardons, and button mushrooms. A dish that has warmed French tables for centuries.",
            ingredients: "Free-range chicken, Pinot Noir, pearl onions, button mushrooms, bacon lardons, thyme, bay leaf, butter",
            allergens: ["Dairy", "Gluten"],
            wine: { name: "Pinot Noir, Burgundy 2018", note: "Earthy cherry notes that perfectly complement the rich, rustic braise." }
        },
        boeuf_bourguignon: {
            name: "Boeuf Bourguignon", course: "Plat Principal", price: "€45",
            image: "./images/boeuf_bourguignon.png",
            description: "A rich and hearty beef stew braised in red wine with pearl onions, mushrooms, and bacon lardons. Slow-cooked for six hours until the meat yields at the touch of a fork.",
            ingredients: "Wagyu beef chuck, red Burgundy wine, pearl onions, cremini mushrooms, lardons, carrots, celery, bouquet garni",
            allergens: ["Dairy", "Gluten"],
            wine: { name: "Château Léoville-Barton 2016", note: "Full-bodied and structured, matching the deep umami of a long-braised beef." }
        },
        creme_brulee: {
            name: "Crème Brûlée", course: "Dessert", price: "€18",
            image: "https://images.unsplash.com/photo-1472555794301-77353b152fb7?auto=format&fit=crop&w=800&q=80",
            description: "Velvety vanilla bean custard beneath a delicate, crackling layer of caramelized sugar. Made daily with Madagascan vanilla and cream from Normandy.",
            ingredients: "Normandy cream, egg yolks, caster sugar, Madagascan vanilla bean",
            allergens: ["Dairy", "Eggs"],
            wine: { name: "Château d'Yquem Sauternes", note: "A golden, honeyed companion that matches the richness of the vanilla custard." }
        },
        tarte_tatin: {
            name: "Tarte Tatin", course: "Dessert", price: "€16",
            image: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=800&q=80",
            description: "An elegant upside-down caramelized apple pastry, served warm with a hint of cinnamon and a quenelle of crème fraîche.",
            ingredients: "Granny Smith apples, puff pastry, caster sugar, butter, cinnamon, crème fraîche",
            allergens: ["Gluten", "Dairy"],
            wine: { name: "Vouvray Moelleux", note: "Off-dry and honeyed, lifting the caramel and apple into something ethereal." }
        }
    };

    // Inject Modal DOM
    const modalHTML = `
    <div class="dish-detail-modal-overlay" id="dishModal" aria-modal="true" role="dialog">
        <div class="dish-detail-modal-panel">
            <button class="modal-close-btn-x" aria-label="Close modal">×</button>
            <div class="modal-left-col"><img src="" alt="" id="modalImg"></div>
            <div class="modal-right-col">
                <div class="modal-course-badge" id="modalCourse"></div>
                <h2 class="modal-dish-name" id="modalName"></h2>
                <div class="modal-dish-price" id="modalPrice"></div>
                <div class="modal-divider"></div>
                <p class="modal-description" id="modalDesc"></p>
                <div class="modal-label">Ingrédients</div>
                <div class="modal-ingredients" id="modalIng"></div>
                <div class="modal-label">Allergènes</div>
                <div class="modal-allergens-list" id="modalAllergens"></div>
                <div class="modal-label" style="margin-top:0.5rem">Accord Mets-Vins</div>
                <div class="modal-wine-note">
                    <span class="modal-wine-name" id="modalWineName"></span>
                    <span id="modalWineNote"></span>
                </div>
                <button class="modal-btn-reserve" id="modalReserveBtn">Réserver une Table →</button>
            </div>
        </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const dishModal = document.getElementById('dishModal');
    const dishCards = document.querySelectorAll('#menu-grid .dish-card');
    
    // Add data-dish attrs
    const mapping = ['bouillabaisse', 'ratatouille', 'coq_au_vin', 'boeuf_bourguignon', 'creme_brulee', 'tarte_tatin'];
    dishCards.forEach((card, idx) => card.dataset.dish = mapping[idx]);

    const openModal = (slug) => {
        const d = dishesData[slug];
        if(!d) return;
        document.getElementById('modalImg').src = d.image;
        document.getElementById('modalImg').alt = d.name;
        document.getElementById('modalCourse').textContent = d.course;
        document.getElementById('modalName').textContent = d.name;
        document.getElementById('modalPrice').textContent = d.price;
        document.getElementById('modalDesc').textContent = d.description;
        document.getElementById('modalIng').textContent = d.ingredients;
        
        document.getElementById('modalAllergens').innerHTML = d.allergens.map(a => `<span class="allergen-pill allergen-${a.replace(/\s+/g,'-')}">${a}</span>`).join('');
        document.getElementById('modalWineName').textContent = d.wine.name;
        document.getElementById('modalWineNote').textContent = d.wine.note;
        
        dishModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        dishModal.classList.remove('active');
        document.body.style.overflow = '';
    };

    dishCards.forEach(card => card.addEventListener('click', () => openModal(card.dataset.dish)));
    dishModal.addEventListener('click', (e) => { if(e.target === dishModal) closeModal(); });
    document.querySelector('.modal-close-btn-x').addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
    document.getElementById('modalReserveBtn').addEventListener('click', () => {
        closeModal();
        document.getElementById('reservations').scrollIntoView({ behavior: 'smooth' });
    });


    /* --- 2. Parallax Hero Scroll --- */
    const isMobile = window.matchMedia('(max-width: 768px)');
    const heroSection = document.getElementById('hero');
    const heroImg = document.querySelector('.hero-parallax-img');
    const heroContent = document.querySelector('.hero-content');
    
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => { 
                applyParallax(); 
                ticking = false; 
            });
            ticking = true;
        }
    }, {passive:true});

    function applyParallax() {
        if (isMobile.matches) return;
        const scrollY = window.scrollY;
        if(scrollY > window.innerHeight) return;
        if(heroImg) heroImg.style.transform = `translateY(-${scrollY * 0.45}px)`;
        if(heroContent) heroContent.style.transform = `translateY(-${scrollY * 0.3}px)`;
    }

    // Hero Load Anim
    setTimeout(() => {
        if(heroImg) heroImg.classList.add('loaded');
        const h1 = document.querySelector('#hero h1');
        const hAnimLines = document.querySelector('.hero-gold-line');
        const btnPulse = document.querySelector('.btn-gold-pulse');
        
        if (hAnimLines) setTimeout(() => hAnimLines.classList.add('active'), 100);
        if (h1) setTimeout(() => { h1.classList.add('hero-anim-init'); setTimeout(()=>h1.classList.add('hero-anim-active'),50) }, 200);
        const subHead = document.querySelector('.typewriter-wrapper');
        if (subHead) setTimeout(() => { subHead.classList.add('hero-anim-init'); setTimeout(()=>subHead.classList.add('hero-anim-active'),50) }, 400);
        if (btnPulse) setTimeout(() => { btnPulse.classList.add('hero-anim-init'); setTimeout(()=>btnPulse.classList.add('hero-anim-active'),50) }, 600);
    }, 2500); // after loading screen


    /* --- 3. Dietary & Allergen Filters --- */
    const filtersHTML = `
        <div class="dietary-filters" id="dietaryFilters">
            <button class="filter-pill active" data-filter="all">All</button>
            <button class="filter-pill" data-filter="vegetarian">Vegetarian</button>
            <button class="filter-pill" data-filter="vegan">Vegan</button>
            <button class="filter-pill" data-filter="gluten-free">Gluten-Free</button>
            <button class="filter-pill" data-filter="dairy-free">Dairy-Free</button>
            <button class="filter-pill" data-filter="pescatarian">Pescatarian</button>
        </div>
        <div class="empty-state-msg" id="filterEmptyMsg" data-fr="Aucun plat ne correspond à cette sélection." data-en="No dishes match this selection.">Aucun plat ne correspond à cette sélection.</div>
    `;
    const menuTabsContainer = document.querySelector('.menu-tabs');
    menuTabsContainer.insertAdjacentHTML('afterend', filtersHTML);

    const tagData = {
        'ratatouille': ['vegetarian', 'vegan', 'gluten-free'],
        'bouillabaisse': ['pescatarian'],
        'coq_au_vin': ['gluten-free'],
        'boeuf_bourguignon': ['dairy-free'],
        'creme_brulee': ['vegetarian'],
        'tarte_tatin': ['vegetarian']
    };
    
    // Assign tags and badges
    dishCards.forEach(card => {
        const dish = card.dataset.dish;
        const tags = tagData[dish] || [];
        card.dataset.tags = tags.join(',');
        
        if(tags.length > 0) {
            let badges = '';
            tags.slice(0,2).forEach(t => {
                if(t==='vegetarian') badges += '<span class="card-badge">🌿</span>';
                if(t==='vegan') badges += '<span class="card-badge">🌱</span>';
                if(t==='gluten-free') badges += '<span class="card-badge">GF</span>';
                if(t==='dairy-free') badges += '<span class="card-badge">DF</span>';
            });
            const imgWrap = card.querySelector('.dish-img-placeholder');
            imgWrap.insertAdjacentHTML('beforeend', `<div class="card-badges">${badges}</div>`);
        }
    });

    const filterPills = document.querySelectorAll('.filter-pill');
    let activeFilters = new Set();
    const emptyMsg = document.getElementById('filterEmptyMsg');

    const applyFilters = () => {
        let visibleCount = 0;
        const activeCat = document.querySelector('.menu-tab.active').dataset.target;
        
        dishCards.forEach(card => {
            if (activeCat !== 'all' && card.dataset.category !== activeCat && activeCat) {
                return; // skipped by primary tab
            }
            
            const cardTags = card.dataset.tags ? card.dataset.tags.split(',') : [];
            const matchesAll = Array.from(activeFilters).every(f => cardTags.includes(f));
            
            if (matchesAll || activeFilters.size === 0) {
                card.classList.remove('filtered-out');
                visibleCount++;
            } else {
                card.classList.add('filtered-out');
            }
        });
        
        emptyMsg.style.display = visibleCount === 0 ? 'block' : 'none';
    };

    filterPills.forEach(pill => {
        pill.addEventListener('click', () => {
            const f = pill.dataset.filter;
            if (f === 'all') {
                activeFilters.clear();
                filterPills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
            } else {
                document.querySelector('.filter-pill[data-filter="all"]').classList.remove('active');
                if (activeFilters.has(f)) {
                    activeFilters.delete(f);
                    pill.classList.remove('active');
                    if (activeFilters.size === 0) {
                        document.querySelector('.filter-pill[data-filter="all"]').classList.add('active');
                    }
                } else {
                    activeFilters.add(f);
                    pill.classList.add('active');
                }
            }
            applyFilters();
        });
    });

    // 8. Menu Tab Transition & 4. Stagger
    const rootGrid = document.querySelector('.menu-grid');
    const tabs = document.querySelectorAll('.menu-tab');
    let isTabAnimating = false;
    
    // Add Stagger base classes
    dishCards.forEach(c => c.classList.add('card-hidden'));
    
    const cardStaggerObserver = new IntersectionObserver((entries, obs) => {
        if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            entries.forEach(e => e.target.classList.add('card-visible'));
            return;
        }
        
        const visibles = entries.filter(e => e.isIntersecting).map(e => e.target);
        visibles.forEach((card, idx) => {
            const delay = Math.min(idx * 80, 400);
            card.style.setProperty('--delay', `${delay}ms`);
            card.classList.add('card-visible');
            obs.unobserve(card);
        });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    
    dishCards.forEach(c => cardStaggerObserver.observe(c));

    // Tab Slider Indicator
    const slider = document.createElement('div');
    slider.className = 'menu-tab-slider';
    document.querySelector('.menu-tabs').appendChild(slider);
    
    function updateSlider(active) {
        if(!active) return;
        slider.style.width = active.offsetWidth + 'px';
        slider.style.left = active.offsetLeft + 'px';
    }
    setTimeout(() => updateSlider(document.querySelector('.menu-tab.active')), 100);
    
    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            if (isTabAnimating || tab.classList.contains('active')) return;
            isTabAnimating = true;
            
            const oldIdx = Array.from(tabs).indexOf(document.querySelector('.menu-tab.active'));
            const isRight = index > oldIdx;
            
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            updateSlider(tab);
            
            const targetCategory = tab.dataset.target;
            const h = rootGrid.getBoundingClientRect().height;
            rootGrid.style.height = h + 'px'; // Fix height
            
            // Exit Anim
            const outClass = isRight ? 'tab-sliding-left-out' : 'tab-sliding-right-out';
            dishCards.forEach(c => {
                if (c.style.display !== 'none' && !c.classList.contains('filtered-out')) {
                    c.classList.remove('card-visible');
                    c.classList.add(outClass);
                }
            });
            
            setTimeout(() => {
                dishCards.forEach(c => c.style.display = 'none');
                
                // Show new
                dishCards.forEach(card => {
                    card.classList.remove(outClass, 'tab-sliding-left-in', 'tab-sliding-right-in', 'tab-sliding-in-active', 'card-visible');
                    
                    if (targetCategory === 'all' || card.dataset.category === targetCategory) {
                        card.style.display = 'block';
                        const inClass = isRight ? 'tab-sliding-left-in' : 'tab-sliding-right-in';
                        card.classList.add(inClass);
                        card.style.transitionDelay = '0s'; // reset
                    }
                });
                
                applyFilters(); // Re-apply existing dietary filters
                
                // Trigger flow
                void rootGrid.offsetWidth;
                
                // Enter Anim
                dishCards.forEach(c => {
                    if (c.style.display === 'block' && !c.classList.contains('filtered-out')) {
                        c.classList.add('tab-sliding-in-active');
                    }
                });
                
                setTimeout(() => {
                    rootGrid.style.height = 'auto'; // Reset height
                    dishCards.forEach(c => {
                        c.classList.remove('tab-sliding-in-active', 'tab-sliding-left-in', 'tab-sliding-right-in');
                        c.classList.remove('card-visible');
                        cardStaggerObserver.observe(c); // Retrigger Stagger
                    });
                    isTabAnimating = false;
                }, 280);
                
            }, 180);
        });
    });


    /* --- 5. Real-Time Reservation Display & 9. Toast --- */
    const rsvpForm = document.getElementById('rsvp-form');
    if(rsvpForm) {
        const bannerHTML = `
            <div class="rsvp-status-banner" id="rsvpStatus">
                <div class="status-dot"></div>
                <div class="status-content">
                    <div class="status-content-inner">
                        <div class="status-headline" id="statusHead" data-fr="Vérifiez la disponibilité" data-en="Check Availability">Vérifiez la disponibilité</div>
                        <div class="status-subline" id="statusSub" data-fr="Sélectionnez une date et une heure" data-en="Select a date and time">Sélectionnez une date et une heure pour voir les disponibilités.</div>
                    </div>
                </div>
            </div>`;
        rsvpForm.insertAdjacentHTML('afterbegin', bannerHTML);
        
        const rDate = document.getElementById('r_date');
        const rTime = document.getElementById('r_time');
        const rGuests = document.getElementById('r_guests');
        const sHead = document.getElementById('statusHead');
        const sSub = document.getElementById('statusSub');
        const sDot = document.querySelector('.status-dot');
        const sInner = document.querySelector('.status-content-inner');
        
        const updateStatus = () => {
            const dVal = rDate.value; const tVal = rTime.value; const gVal = parseInt(rGuests.value||0);
            let state = 0, hTxt = "", sTxt = "", dotCol = "#888";
            
            sInner.style.opacity = 0;
            
            setTimeout(() => {
                if(!dVal || !tVal) {
                    hTxt = "Vérifiez la disponibilité"; sTxt = "Sélectionnez une date et une heure pour voir les disponibilités."; dotCol = "#888";
                } else {
                    const dateObj = new Date(`${dVal}T${tVal}`);
                    const now = new Date();
                    const day = dateObj.getDay();
                    const h = dateObj.getHours(); m = dateObj.getMinutes();
                    
                    if (dateObj < now) {
                        hTxt = "Date invalide"; sTxt = "Veuillez sélectionner une date à venir."; dotCol = "#e05c5c"; state = 1;
                    } else if (day === 0) {
                        hTxt = "Fermé le dimanche"; sTxt = "Nous ne sommes pas ouverts le dimanche. Essayez vendredi ou samedi."; dotCol = "#e05c5c"; state = 1;
                    } else if ((day>=1 && day<=4 && (h<18 || h>=23)) || ((day==5||day==6) && (h<18 && h>=0))) {
                        hTxt = "En dehors de nos horaires"; sTxt = "Nous accueillons les dîners de 18h00 à 23h00 (00h00 le week-end)."; dotCol = "#e05c5c"; state = 1;
                    } else if (day === 5 || day === 6) {
                        hTxt = "Disponibilité limitée"; sTxt = "Les vendredis et samedis sont très demandés. Il reste 2 tables."; dotCol = "#e8a325"; state = 2;
                    } else {
                        hTxt = "Tables disponibles"; sTxt = "Nous avons de la disponibilité. Finalisez ci-dessous."; dotCol = "#4caf82"; state = 3;
                    }
                    if (gVal > 6) sTxt += " · Pour >6 pers, nous vous contacterons.";
                }
                
                sHead.textContent = hTxt; sSub.textContent = sTxt;
                sDot.style.color = dotCol;
                sInner.style.opacity = 1;
                rsvpForm.dataset.state = state;
            }, 150);
        };
        
        rDate.addEventListener('input', updateStatus);
        rTime.addEventListener('input', updateStatus);
        rGuests.addEventListener('input', updateStatus);

        // Enhance Submission & Toast
        rsvpForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const st = parseInt(rsvpForm.dataset.state || 0);
            if(st === 1) {
                const banner = document.getElementById('rsvpStatus');
                banner.classList.add('status-banner-shake');
                setTimeout(()=>banner.classList.remove('status-banner-shake'), 400);
                window.showToast({type:'error', title:'Date invalide', message:'Veuillez choisir une date et heure valides.', duration:4000});
            } else {
                const n = rGuests.value, d = rDate.value, t = rTime.value;
                const name = document.getElementById('r_name').value;
                const email = document.getElementById('r_email').value;
                const requests = document.getElementById('r_requests')?.value || '';
                
                fetch('https://hooks.zapier.com/hooks/catch/26220360/ucvlyhf/', {
                    method: 'POST',
                    body: JSON.stringify({ type: 'Reservation', name, email, date: d, time: t, guests: n, requests })
                }).catch(console.error);
                
                window.showToast({type:'success', title:'Demande envoyée', message:`Nous confirmerons votre table pour ${n} personne(s) le ${d} à ${t}.`, duration:5000});
                rsvpForm.reset();
                updateStatus();
            }
        });
    }

    // 9. Toast Logic
    const toastWrap = document.createElement('div');
    toastWrap.className = 'toast-container';
    document.body.appendChild(toastWrap);

    window.showToast = ({ type, title, message, duration }) => {
        const icons = {
            success: '✓', error: '✕', info: 'i', warning: '!'
        };
        const toast = document.createElement('div');
        toast.className = `res-toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-top">
                <div class="toast-title-wrap"><span style="color:var(--text-main); font-weight:bold;">${icons[type]}</span> <span class="toast-title">${title}</span></div>
                <button class="toast-close">×</button>
            </div>
            <div class="toast-body">${message}</div>
            <div class="toast-progress" style="animation-duration:${duration}ms;"></div>
        `;
        toastWrap.appendChild(toast);
        
        requestAnimationFrame(() => toast.classList.add('toast-enter'));
        
        let tOut = setTimeout(() => {
            toast.classList.add('toast-exit');
            setTimeout(() => toast.remove(), 250);
        }, duration);

        toast.querySelector('.toast-close').addEventListener('click', () => {
            clearTimeout(tOut);
            toast.classList.add('toast-exit');
            setTimeout(() => toast.remove(), 250);
        });
    };


    /* --- 6. Testimonial Auto-Carousel --- */
    const testData = [
        { q: "An unforgettable evening. The Coq au Vin transported us straight to the heart of Burgundy. Flawless service.", a: "Marie & Julien" },
        { q: "A masterclass in modern French dining. The ambiance is as spectacular as the wine pairings. Truly magical.", a: "Claire T." },
        { q: "The Bouillabaisse is a revelation. I have never tasted such depth of flavor outside of Marseille.", a: "Oliver S." },
        { q: "We celebrated our anniversary here and felt like royalty. The Tarte Tatin was the perfect ending.", a: "The Dupont Family" }
    ];
    const testContainer = document.querySelector('#testimonials .container');
    if(testContainer) {
        testContainer.innerHTML = `
            <div class="carousel-wrap-new" tabindex="0" role="region" aria-label="Testimonials">
                <div id="testSlides"></div>
                <div class="carousel-dots-new" id="testDots"></div>
            </div>
        `;
        const wrap = document.querySelector('.carousel-wrap-new');
        const slideCon = document.getElementById('testSlides');
        const dotsCon = document.getElementById('testDots');
        
        testData.forEach((t, i) => {
            slideCon.innerHTML += `
                <div class="testimonial-new ${i===0?'active':''}" aria-live="polite">
                    <div class="testimonial-new-quotes">"</div>
                    <div class="testimonial-new-text">${t.q}</div>
                    <div class="testimonial-new-author">${t.a}</div>
                </div>`;
            dotsCon.innerHTML += `<div class="dot-new ${i===0?'active':''}" data-idx="${i}" aria-label="Testimonial ${i+1}"></div>`;
        });
        
        const testSlides = document.querySelectorAll('.testimonial-new');
        const testDots = document.querySelectorAll('.dot-new');
        let tsIdx = 0, tsTimer;
        
        const gotoSlide = (idx) => {
            if(idx === tsIdx) return;
            testSlides[tsIdx].classList.remove('active');
            testSlides[tsIdx].classList.add('exiting');
            setTimeout((old) => old.classList.remove('exiting'), 300, testSlides[tsIdx]);
            
            testDots[tsIdx].classList.remove('active');
            
            tsIdx = (idx + testData.length) % testData.length;
            
            setTimeout(() => {
                testSlides[tsIdx].classList.add('active');
            }, 200); // 200ms overlap
            testDots[tsIdx].classList.add('active');
        };
        
        const playTs = () => { clearInterval(tsTimer); tsTimer = setInterval(()=>gotoSlide(tsIdx+1), 5000); };
        const pauseTs = () => clearInterval(tsTimer);
        
        if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            playTs();
            wrap.addEventListener('mouseenter', pauseTs);
            wrap.addEventListener('mouseleave', playTs);
            
            const tsObs = new IntersectionObserver(e => e[0].isIntersecting ? playTs() : pauseTs(), {threshold: 0.1});
            tsObs.observe(wrap);
            
            wrap.addEventListener('keydown', e => {
                if(e.key === 'ArrowLeft') gotoSlide(tsIdx-1);
                if(e.key === 'ArrowRight') gotoSlide(tsIdx+1);
            });
            
            let touchX = 0;
            wrap.addEventListener('touchstart', e => touchX = e.changedTouches[0].screenX, {passive:true});
            wrap.addEventListener('touchend', e => {
                const diff = e.changedTouches[0].screenX - touchX;
                if(diff > 50) gotoSlide(tsIdx-1);
                else if(diff < -50) gotoSlide(tsIdx+1);
            }, {passive:true});
        }
        
        testDots.forEach(d => d.addEventListener('click', () => gotoSlide(parseInt(d.dataset.idx))));
    }


    /* --- 7. Interactive Wine & Dish Cross-Linking --- */
    const pairings = {
        'coq_au_vin': 'pinot-noir-burgundy',
        'bouillabaisse': 'rose-de-provence',
        'creme_brulee': 'sauternes'
    };
    
    const wineCards = document.querySelectorAll('.wine-card');
    const wineSlugs = ['pinot-noir-burgundy', 'rose-de-provence', 'sauternes'];
    wineCards.forEach((c, i) => c.dataset.wine = wineSlugs[i] || '');

    dishCards.forEach(dc => {
        const slug = dc.dataset.dish;
        if(pairings[slug]) {
            dc.classList.add('card-has-pairing');
            const tooltip = document.createElement('div');
            tooltip.className = 'pairing-tooltip'; tooltip.textContent = 'Accord recommandé →';
            dc.appendChild(tooltip);
            
            dc.addEventListener('mouseenter', () => {
                tooltip.classList.add('visible');
                wineCards.forEach(wc => {
                    if(wc.dataset.wine === pairings[slug]) wc.classList.add('wine-highlight');
                    else wc.classList.add('wine-dimmed');
                });
            });
            dc.addEventListener('mouseleave', () => {
                tooltip.classList.remove('visible');
                wineCards.forEach(wc => wc.classList.remove('wine-highlight', 'wine-dimmed'));
            });
            dc.addEventListener('click', (e) => {
                // If they click the card, they might open the modal. For this task, if they click the pairing tooltip or the card we should scroll. 
                // Let's attach scroll to the tooltip area only to avoid breaking modal.
                // Wait, prompt says: "When a dish card with paired wine is CLICKED... scroll to wine section". 
                // So clicking the card scrolls AND opens modal? Let's just override to scroll if they click the card here, or use the modal Reserve logic.
                // I will add a slight timeout to let modal open, or just let them read the modal. 
                // Wait, I will prevent modal if they hold shift? No, I'll just scroll the background!
                const w = document.querySelector(`.wine-card[data-wine="${pairings[slug]}"]`);
                if(w) {
                    w.scrollIntoView({behavior: 'smooth', block: 'center'});
                    setTimeout(() => w.classList.add('pairing-pulse'), 600);
                    setTimeout(() => w.classList.remove('pairing-pulse'), 2100);
                }
            });
        }
    });

    wineCards.forEach(wc => {
        const slug = wc.dataset.wine;
        const matchingDishSlug = Object.keys(pairings).find(k => pairings[k] === slug);
        if(matchingDishSlug) {
            wc.classList.add('card-has-pairing');
            const tooltip = document.createElement('div');
            tooltip.className = 'pairing-tooltip'; tooltip.textContent = 'Parfait avec le plat';
            wc.appendChild(tooltip);
            
            wc.addEventListener('mouseenter', () => {
                tooltip.classList.add('visible');
                dishCards.forEach(dc => {
                    if(dc.dataset.dish === matchingDishSlug) dc.classList.add('wine-highlight');
                    else dc.classList.add('wine-dimmed');
                });
            });
            wc.addEventListener('mouseleave', () => {
                tooltip.classList.remove('visible');
                dishCards.forEach(dc => dc.classList.remove('wine-highlight', 'wine-dimmed'));
            });
        }
    });

    /* --- 10. Chef Image Reveal --- */
    const chefSection = document.getElementById('chef');
    const chefImgBox = document.querySelector('.chef-img-box');
    if(chefSection && chefImgBox) {
        chefImgBox.parentElement.classList.add('chef-reveal-wrapper');
        chefImgBox.insertAdjacentHTML('afterend', '<div class="chef-gold-wipe"></div><div class="chef-overlay-tint"></div>');
        const pLines = chefSection.querySelectorAll('.chef-text p');
        pLines.forEach(p => p.classList.add('chef-text-anim'));
        chefSection.querySelector('h2').classList.add('chef-text-anim');
        chefSection.querySelector('h3').classList.add('chef-text-anim');
        chefSection.querySelector('h3').insertAdjacentHTML('afterend', '<div class="chef-text-line"></div>');

        const chefObs = new IntersectionObserver((entries, obs) => {
            if(entries[0].isIntersecting) {
                const isReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                if(!isReduce) {
                    chefSection.querySelectorAll('.chef-img-box, .chef-gold-wipe, .chef-overlay-tint, .chef-text-anim, .chef-text-line').forEach(el => el.classList.add('reveal-active'));
                } else {
                    chefImgBox.style.clipPath = 'inset(0 0 0 0)';
                    chefSection.querySelectorAll('.chef-text-anim').forEach(el=>el.style.opacity=1);
                }
                obs.disconnect();
            }
        }, { threshold: 0.15 });
        chefObs.observe(chefSection);
    }

    /* --- 11. French / English Language Toggle --- */
    const langToggleHTML = `
        <div class="lang-toggle">
            <button class="lang-btn active" data-lang="fr">FR</button>
            <span class="lang-divider">·</span>
            <button class="lang-btn" data-lang="en">EN</button>
        </div>
    `;
    document.querySelector('#header nav').insertAdjacentHTML('beforeend', langToggleHTML);
    
    const translateTargets = document.querySelectorAll('[data-fr], [data-en]');
    const setLanguage = (lang) => {
        document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
        document.documentElement.lang = lang;
        document.title = lang === 'fr' ? "À la Carté | L'art de bien manger" : "À la Carté | The Art of Fine Dining";
        
        translateTargets.forEach(el => {
            el.classList.add('lang-translate-faded');
            setTimeout(() => {
                const val = el.getAttribute(`data-${lang}`);
                if(val) {
                    if(el.tagName === 'INPUT' && el.type === 'text' || el.type === 'email') el.placeholder = val;
                    else el.textContent = val;
                }
                el.classList.remove('lang-translate-faded');
            }, 150);
        });
        localStorage.setItem('alacarte-lang', lang);
    };

    document.querySelectorAll('.lang-btn').forEach(b => {
        b.addEventListener('click', () => setLanguage(b.dataset.lang));
    });
    
    const savedLang = localStorage.getItem('alacarte-lang') || (navigator.language.startsWith('fr') ? 'fr' : 'en');
    setTimeout(()=>setLanguage(savedLang), 100);

    /* --- 12. Scroll Progress Indicator --- */
    const progressBar = document.createElement('div');
    progressBar.id = 'scroll-progress-bar';
    progressBar.setAttribute('role', 'progressbar');
    document.body.appendChild(progressBar);
    
    let pTicking = false;
    window.addEventListener('scroll', () => {
        if(!pTicking) {
            requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                if(scrollY < 10) progressBar.style.opacity = 0;
                else {
                    progressBar.style.opacity = 1;
                    const max = document.documentElement.scrollHeight - window.innerHeight;
                    const pct = Math.min(100, Math.max(0, (scrollY / max) * 100));
                    progressBar.style.width = `${pct}%`;
                    progressBar.setAttribute('aria-valuenow', Math.round(pct));
                }
                pTicking = false;
            });
            pTicking = true;
        }
    }, {passive: true});

    // Subscriptions
    document.querySelector('form.news-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = e.target.querySelector('input[type="email"]').value;
        
        fetch('https://hooks.zapier.com/hooks/catch/26220360/ucvlyhf/', {
            method: 'POST',
            body: JSON.stringify({ type: 'Newsletter', email })
        }).catch(console.error);
        
        window.showToast({type: 'success', title: 'Bienvenue', message: 'Vous recevrez bientôt nos menus.', duration: 4000});
        e.target.reset();
    });

});
