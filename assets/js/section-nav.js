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

	const setActiveSection = (sectionId) => {
		navigationLinks.forEach((link) => {
			const isActive = link.getAttribute('href') === `#${sectionId}`;
			link.classList.toggle('is-active', isActive);

			if (isActive) {
				link.setAttribute('aria-current', 'true');
			} else {
				link.removeAttribute('aria-current');
			}
		});
	};

	setActiveSection(navigationItems[0].link.getAttribute('href').slice(1));

	const observer = new IntersectionObserver((entries) => {
		const visibleSections = entries
			.filter((entry) => entry.isIntersecting)
			.sort((first, second) => second.intersectionRatio - first.intersectionRatio);

		if (visibleSections.length) {
			const activeTarget = visibleSections[0].target;
			const activeItem = navigationItems.find((item) => item.target === activeTarget);

			if (activeItem) {
				setActiveSection(activeItem.link.getAttribute('href').slice(1));
			}
		}
	}, {
		rootMargin: '-42% 0px -42% 0px',
		threshold: [0, 0.25, 0.5, 0.75, 1]
	});

	navigationItems.forEach(({ target }) => observer.observe(target));
})();
