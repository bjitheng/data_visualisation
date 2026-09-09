document.addEventListener('DOMContentLoaded', () => {
  const currentPage = document.body.dataset.page;
  const yearTarget = document.getElementById('year');

  if (yearTarget) {
    yearTarget.textContent = new Date().getFullYear();
  }

  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach((link) => {
    const isCurrent = link.dataset.page === currentPage;
    if (isCurrent) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });

  const actionButtons = document.querySelectorAll('[data-target]');
  actionButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const target = button.dataset.target;
      if (target) {
        window.location.href = target;
      }
    });
  });
});
