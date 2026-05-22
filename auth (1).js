/* ============================================================
   ADULTING UNLOCKED — GLOBAL STYLES
   ============================================================ */

@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap');

:root {
  /* Core Palette */
  --primary: #4f46e5;
  --primary-light: #6366f1;
  --primary-dark: #3730a3;
  --accent: #06b6d4;
  --accent-warm: #f59e0b;
  --success: #10b981;
  --danger: #ef4444;
  --warning: #f59e0b;

  /* Gradients */
  --grad-primary: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #06b6d4 100%);
  --grad-warm: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
  --grad-cool: linear-gradient(135deg, #06b6d4 0%, #4f46e5 100%);
  --grad-soft: linear-gradient(135deg, #e0e7ff 0%, #cffafe 100%);
  --grad-hero: linear-gradient(135deg, #667eea 0%, #764ba2 30%, #06b6d4 70%, #10b981 100%);

  /* Neutrals */
  --white: #ffffff;
  --gray-50: #f8fafc;
  --gray-100: #f1f5f9;
  --gray-200: #e2e8f0;
  --gray-300: #cbd5e1;
  --gray-400: #94a3b8;
  --gray-500: #64748b;
  --gray-600: #475569;
  --gray-700: #334155;
  --gray-800: #1e293b;
  --gray-900: #0f172a;

  /* Glass */
  --glass-bg: rgba(255, 255, 255, 0.72);
  --glass-border: rgba(255, 255, 255, 0.5);
  --glass-shadow: 0 8px 32px rgba(79, 70, 229, 0.12);

  /* Typography */
  --font-display: 'Syne', sans-serif;
  --font-body: 'DM Sans', sans-serif;

  /* Spacing */
  --section-py: 100px;
  --container-max: 1280px;

  /* Shadows */
  --shadow-sm: 0 2px 8px rgba(0,0,0,0.06);
  --shadow-md: 0 4px 20px rgba(0,0,0,0.08);
  --shadow-lg: 0 8px 40px rgba(0,0,0,0.12);
  --shadow-xl: 0 20px 60px rgba(0,0,0,0.16);
  --shadow-colored: 0 8px 32px rgba(79, 70, 229, 0.25);

  /* Radius */
  --radius-sm: 8px;
  --radius-md: 16px;
  --radius-lg: 24px;
  --radius-xl: 32px;
  --radius-full: 9999px;

  /* Transitions */
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* ─── Reset & Base ───────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html { scroll-behavior: smooth; font-size: 16px; }

body {
  font-family: var(--font-body);
  color: var(--gray-800);
  background: var(--gray-50);
  line-height: 1.6;
  overflow-x: hidden;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-display);
  font-weight: 700;
  line-height: 1.2;
  color: var(--gray-900);
}

a { color: var(--primary); text-decoration: none; transition: color 0.2s; }
a:hover { color: var(--primary-dark); }

img { max-width: 100%; display: block; }

/* ─── Container ──────────────────────────────────────────── */
.container { max-width: var(--container-max); margin: 0 auto; padding: 0 24px; }

/* ─── Glassmorphism ──────────────────────────────────────── */
.glass {
  background: var(--glass-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--glass-shadow);
}

.glass-dark {
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255,255,255,0.1);
}

/* ─── Buttons ────────────────────────────────────────────── */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  border-radius: var(--radius-full);
  font-family: var(--font-body);
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s var(--ease-out);
  text-decoration: none;
  white-space: nowrap;
}

.btn-primary {
  background: var(--grad-primary);
  color: white;
  box-shadow: var(--shadow-colored);
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(79, 70, 229, 0.4);
  color: white;
}

.btn-outline {
  background: transparent;
  color: var(--primary);
  border: 2px solid var(--primary);
}
.btn-outline:hover {
  background: var(--primary);
  color: white;
  transform: translateY(-2px);
}

.btn-white {
  background: white;
  color: var(--primary);
  box-shadow: var(--shadow-md);
}
.btn-white:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
  color: var(--primary-dark);
}

.btn-ghost {
  background: rgba(255,255,255,0.15);
  color: white;
  border: 1px solid rgba(255,255,255,0.3);
  backdrop-filter: blur(8px);
}
.btn-ghost:hover {
  background: rgba(255,255,255,0.25);
  color: white;
  transform: translateY(-2px);
}

.btn-lg { padding: 16px 32px; font-size: 16px; }
.btn-sm { padding: 8px 16px; font-size: 13px; }

/* ─── Badges ─────────────────────────────────────────────── */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.3px;
}
.badge-primary { background: #e0e7ff; color: var(--primary); }
.badge-success { background: #d1fae5; color: var(--success); }
.badge-warning { background: #fef3c7; color: #b45309; }
.badge-accent { background: #cffafe; color: #0e7490; }

/* ─── Cards ──────────────────────────────────────────────── */
.card {
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--gray-100);
  transition: all 0.3s var(--ease-out);
  overflow: hidden;
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--gray-200);
}

/* ─── Section Titles ─────────────────────────────────────── */
.section-label {
  display: inline-block;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--primary);
  margin-bottom: 12px;
}

.section-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  color: var(--gray-900);
  margin-bottom: 16px;
}

.section-subtitle {
  font-size: 1.1rem;
  color: var(--gray-500);
  max-width: 560px;
  line-height: 1.7;
}

/* ─── Forms ──────────────────────────────────────────────── */
.form-group { margin-bottom: 20px; }

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--gray-700);
  margin-bottom: 6px;
}

.form-control {
  width: 100%;
  padding: 12px 16px;
  border: 1.5px solid var(--gray-200);
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: 15px;
  color: var(--gray-800);
  background: white;
  transition: all 0.2s;
  outline: none;
}
.form-control:focus {
  border-color: var(--primary-light);
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
}

/* ─── Navbar ─────────────────────────────────────────────── */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 16px 0;
  transition: all 0.3s var(--ease-out);
}
.navbar.scrolled {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--glass-border);
  box-shadow: 0 4px 24px rgba(79,70,229,0.08);
  padding: 12px 0;
}

.navbar-brand {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 800;
  background: var(--grad-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-link {
  font-size: 14px;
  font-weight: 500;
  color: var(--gray-700) !important;
  padding: 8px 16px !important;
  border-radius: var(--radius-full);
  transition: all 0.2s;
}
.nav-link:hover {
  color: var(--primary) !important;
  background: rgba(79,70,229,0.08);
}

/* ─── Footer ─────────────────────────────────────────────── */
.footer {
  background: var(--gray-900);
  color: var(--gray-400);
  padding: 80px 0 40px;
}
.footer-brand {
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 800;
  background: var(--grad-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 12px;
}
.footer h5 {
  color: white;
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 20px;
}
.footer a {
  color: var(--gray-400);
  display: block;
  margin-bottom: 10px;
  font-size: 14px;
  transition: color 0.2s;
}
.footer a:hover { color: white; }
.footer-divider {
  border-color: var(--gray-700);
  margin: 40px 0 24px;
}

/* ─── Search Bar ─────────────────────────────────────────── */
.search-wrapper {
  position: relative;
  max-width: 640px;
}
.search-input {
  width: 100%;
  padding: 16px 56px 16px 56px;
  border-radius: var(--radius-full);
  border: 2px solid var(--gray-200);
  font-size: 16px;
  font-family: var(--font-body);
  background: white;
  box-shadow: var(--shadow-md);
  transition: all 0.25s;
  outline: none;
}
.search-input:focus {
  border-color: var(--primary-light);
  box-shadow: 0 4px 24px rgba(99,102,241,0.2);
}
.search-icon {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--gray-400);
  pointer-events: none;
}
.search-submit {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
}
.search-results-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  border: 1px solid var(--gray-100);
  overflow: hidden;
  z-index: 100;
  display: none;
}
.search-results-dropdown.show { display: block; }

/* ─── Animations ─────────────────────────────────────────── */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-24px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.92); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-12px); }
}
@keyframes pulse-ring {
  0% { transform: scale(1); opacity: 0.6; }
  100% { transform: scale(1.6); opacity: 0; }
}
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
@keyframes spin-slow { to { transform: rotate(360deg); } }
@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.animate-float { animation: float 4s ease-in-out infinite; }
.animate-float-delay { animation: float 4s ease-in-out 1s infinite; }
.animate-float-delay2 { animation: float 4s ease-in-out 2s infinite; }

/* Scroll-triggered reveal */
.reveal {
  opacity: 0;
  transform: translateY(32px);
  transition: opacity 0.7s var(--ease-out), transform 0.7s var(--ease-out);
}
.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}
.reveal-delay-1 { transition-delay: 0.1s; }
.reveal-delay-2 { transition-delay: 0.2s; }
.reveal-delay-3 { transition-delay: 0.3s; }
.reveal-delay-4 { transition-delay: 0.4s; }
.reveal-delay-5 { transition-delay: 0.5s; }

/* ─── Gradient text ──────────────────────────────────────── */
.gradient-text {
  background: var(--grad-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.gradient-text-warm {
  background: var(--grad-warm);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ─── Stats ──────────────────────────────────────────────── */
.stat-number {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  line-height: 1;
}

/* ─── Toast notifications ────────────────────────────────── */
.toast-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.toast {
  padding: 14px 20px;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 500;
  color: white;
  box-shadow: var(--shadow-lg);
  animation: fadeInUp 0.3s var(--ease-out);
  min-width: 280px;
}
.toast-success { background: var(--success); }
.toast-error { background: var(--danger); }
.toast-info { background: var(--primary); }

/* ─── Modal ──────────────────────────────────────────────── */
.modal-backdrop-blur {
  backdrop-filter: blur(8px);
  background: rgba(15,23,42,0.5);
}

/* ─── Loading skeleton ───────────────────────────────────── */
.skeleton {
  background: linear-gradient(90deg, var(--gray-100) 25%, var(--gray-50) 50%, var(--gray-100) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius-sm);
}

/* ─── Scrollbar ──────────────────────────────────────────── */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--gray-300); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: var(--gray-400); }

/* ─── Responsive ─────────────────────────────────────────── */
@media (max-width: 768px) {
  :root { --section-py: 60px; }
  .container { padding: 0 16px; }
  .btn-lg { padding: 14px 24px; font-size: 15px; }
}

@media (max-width: 576px) {
  .section-title { font-size: 1.75rem; }
}