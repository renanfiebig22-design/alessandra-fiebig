'use strict';
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const menu = $('#menu');
const menuToggle = $('.menu-toggle');
function closeMenu() { menu.classList.remove('open'); menuToggle.setAttribute('aria-expanded', 'false'); menuToggle.setAttribute('aria-label', 'Abrir menu'); }
menuToggle.addEventListener('click', () => { const open = menuToggle.getAttribute('aria-expanded') !== 'true'; menu.classList.toggle('open', open); menuToggle.setAttribute('aria-expanded', String(open)); menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu'); });
$$('a', menu).forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
document.addEventListener('click', e => { if (!e.target.closest('.header')) closeMenu(); });
const dialog = $('#brief-dialog');
let dialogTrigger;
$$('[data-brief]').forEach(button => button.addEventListener('click', () => { dialogTrigger = button; closeMenu(); dialog.showModal(); document.body.classList.add('modal-open'); }));
$('.close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', e => { if (e.target === dialog) { const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close(); } });
dialog.addEventListener('close', () => { document.body.classList.remove('modal-open'); dialogTrigger?.focus(); });
$('#brief-form').addEventListener('submit', e => { e.preventDefault(); const form = e.currentTarget; if (!form.reportValidity()) return; const data = new FormData(form); const message = ['Olá, Alessandra! Meu nome é ' + String(data.get('name')).trim() + '.', 'Represento a marca/projeto ' + String(data.get('brand')).trim() + ' e gostaria de conversar sobre uma parceria.', '', 'Formato de interesse: ' + data.get('format') + '.', String(data.get('message')).trim() ? '\nMinha ideia: ' + String(data.get('message')).trim() : ''].filter(Boolean).join('\n'); window.open('https://wa.me/5512997027962?text=' + encodeURIComponent(message), '_blank', 'noopener,noreferrer'); });
$$('[data-filter]').forEach(button => button.addEventListener('click', () => { const filter = button.dataset.filter; let count = 0; $$('[data-filter]').forEach(b => { const active = b === button; b.classList.toggle('active', active); b.setAttribute('aria-pressed', String(active)); }); $$('.video-card').forEach(card => { const show = filter === 'all' || card.dataset.category === filter; card.hidden = !show; if (show) count++; else $('video', card).pause(); }); $('.filter-status').textContent = count + (count === 1 ? ' vídeo disponível.' : ' vídeos disponíveis.'); }));
$$('video').forEach(video => video.addEventListener('play', () => $$('video').forEach(other => { if (other !== video) other.pause(); })));
document.addEventListener('visibilitychange', () => { if (document.hidden) $$('video').forEach(v => v.pause()); });
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
if ('IntersectionObserver' in window) {
 if (!reducedMotion) { const reveal = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); reveal.unobserve(entry.target); } }), { threshold: 0.08 }); document.body.classList.add('motion'); $$('.reveal').forEach(e => reveal.observe(e)); }
 const mobileButton = $('.mobile-contact'); const footerVisibility = new IntersectionObserver(entries => entries.forEach(entry => mobileButton.classList.toggle('hide', entry.isIntersecting)), { threshold: 0.1 }); footerVisibility.observe($('#contato'));
 const sections = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) $$('#menu a').forEach(a => a.classList.toggle('current', a.getAttribute('href') === '#' + entry.target.id)); }); }, { rootMargin: '-15% 0px -65% 0px', threshold: 0 }); $$('main section[id]').forEach(s => sections.observe(s));
}
const progress = $('.progress'); let scheduled = false;
function updateProgress() { const total = document.documentElement.scrollHeight - innerHeight; progress.style.width = (total > 0 ? scrollY / total * 100 : 0) + '%'; scheduled = false; }
addEventListener('scroll', () => { if (!scheduled) { scheduled = true; requestAnimationFrame(updateProgress); } }, { passive: true });
updateProgress(); $('#year').textContent = new Date().getFullYear();
