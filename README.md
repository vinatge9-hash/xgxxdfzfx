# Roast & Ritual — Coffee Website

A modern, responsive multi-page demo site for an artisanal coffee brand. Built with HTML, Tailwind CSS (CDN) and vanilla JavaScript. The design emphasises glassmorphism, dark-mode support, gradients, micro-animations and full-width layouts.

Files
- index.html — Home page with hero, search & filters, featured roasts, comparison table, brewing timer, gallery, testimonials, FAQ and interactive cart + modal.
- about.html — Brand story, sourcing, and team profiles with gallery and roastery visit CTA.
- contact.html — Contact form with client-side validation, business hours and map placeholder.
- app.js — JavaScript powering theme toggling, cart (localStorage), modal quick-views, search/sort, FAQ, testimonial slider, brew timer, lazy loading and other micro-interactions.

Highlights & Features
- Full-width responsive layout: all main content wrappers use `w-full` and `max-w-none` so the design spans the viewport.
- Tailwind CSS via CDN + Google Fonts (Poppins & Merriweather) for typography. Font hints are included in the HTML comments for the generator.
- Glassmorphism panels, gradient hero, subtle hover transforms, and reveal-on-scroll animations.
- Dark / Light mode toggle with smooth transitions and persisted preference (localStorage).
- Interactive elements: Add-to-cart (localStorage-backed), floating cart panel, Quick View modal, FAQ accordion, testimonials slider, search & sorting, brew timer with progress bar.
- Accessibility: ARIA attributes on dialogs, keyboard support for modal (Escape to close), semantic HTML elements like <details> for FAQs, and focus handling.
- Performance: lazy-loaded images and minimal, efficient JS.

Images
- Images are provided as AI-requested placeholders in the format `https://images.pexels.com/photos/8099589/pexels-photo-8099589.jpeg?auto=compress&cs=tinysrgb&h=650&w=940`. The generator will fetch appropriate imagery automatically. Replace any placeholder URIs with real image paths or base64 data URIs if you want to bundle specific images.

Usage
1. Place these files in a folder and open `index.html` in your browser.
2. No build step required — everything runs client-side.

Customization
- Replace product data in `app.js` with your catalogue or connect to an API.
- Replace placeholder images with your high-res images or base64 data URIs.
- To collect real emails/orders, hook the forms and checkout flow to your backend or serverless endpoints.

Notes
- This is a demo and intentionally stores cart & subscribers locally for demonstration. It avoids external dependencies beyond Tailwind and Google Fonts.

Enjoy building a delicious experience!
