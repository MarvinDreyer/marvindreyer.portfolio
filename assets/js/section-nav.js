(() => {
    const navigationLinks = [...document.querySelectorAll('.page-index a')];
    const navigationItems = navigationLinks
        .map((link) => {
            const target = link.getAttribute('href') === '#start'
                ? document.querySelector('#header')
                : document.querySelector(link.getAttribute('href'));

            return target ? { link, target } : null;
        })
        .filter(Boolean);

    if (!navigationItems.length) {
        return;
    }

    const setActiveItem = (activeItem) => {
        navigationLinks.forEach((link) => {
            const isActive = link === activeItem.link;
            link.classList.toggle('is-active', isActive);

            if (isActive) {
                link.setAttribute('aria-current', 'true');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    };

    const setActiveFromPosition = () => {
        if (window.scrollY <= 10) {
            setActiveItem(navigationItems[0]);
            return;
        }

        const markerPosition = window.innerHeight * 0.3;
        const passedItems = navigationItems
            .map((item) => ({ item, top: item.target.getBoundingClientRect().top }))
            .filter(({ top }) => top <= markerPosition)
            .sort((first, second) => second.top - first.top);

        if (passedItems.length) {
            setActiveItem(passedItems[0].item);
        }
    };

    navigationItems.forEach((item) => {
        item.link.addEventListener('click', () => setActiveItem(item));
    });

    setActiveItem(navigationItems[0]);

    // Statt IntersectionObserver: bei jedem Scroll (rAF-gedrosselt) neu berechnen.
    // Das trifft die 30%-Marker-Linie exakt, egal in welche Richtung
    // oder wie schnell gescrollt wird (auch beim programmatischen Scroll nach Klick).
    let ticking = false;
    const requestTick = () => {
        if (!ticking) {
            ticking = true;
            window.requestAnimationFrame(() => {
                setActiveFromPosition();
                ticking = false;
            });
        }
    };

    window.addEventListener('scroll', requestTick, { passive: true });
    window.addEventListener('resize', requestTick);

    setActiveFromPosition();
})();