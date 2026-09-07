(() => {
	const navigationLinks = [...document.querySelectorAll('.page-index a')];
	const sections = navigationLinks
		.map((link) => document.querySelector(link.getAttribute('href')))
		.filter(Boolean);

	if (!navigationLinks.length || !sections.length) {
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

	setActiveSection(sections[0].id);

	const observer = new IntersectionObserver((entries) => {
		const visibleSections = entries
			.filter((entry) => entry.isIntersecting)
			.sort((first, second) => second.intersectionRatio - first.intersectionRatio);

		if (visibleSections.length) {
			setActiveSection(visibleSections[0].target.id);
		}
	}, {
		rootMargin: '-42% 0px -42% 0px',
		threshold: [0, 0.25, 0.5, 0.75, 1]
	});

	sections.forEach((section) => observer.observe(section));
})();
