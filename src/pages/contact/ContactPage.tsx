import React, { useEffect, useRef, useState } from "react";
import siteData from "../../data/siteData.json";
import ContactParticles from "../../components/contact/ContactParticles";
import "../../styles/contact-page.css";

interface ContactPageProps {
  onBackToHome?: () => void;
  onNavigateMenu?: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseRadius: number;
  radius: number;
  color: string;
  alpha: number;
  baseAlpha: number;
  pulseSpeed: number;
  pulseOffset: number;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  onBackToHome,
  onNavigateMenu,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Canvas particle simulation with hover dispersion
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = container.offsetWidth);
    let height = (canvas.height = container.offsetHeight);

    const mouse = {
      x: -1000,
      y: -1000,
      radius: 170,
      isActive: false,
    };

    const handleResize = () => {
      if (!container || !canvas) return;
      width = canvas.width = container.offsetWidth;
      height = canvas.height = container.offsetHeight;
    };

    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.isActive = true;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
      mouse.isActive = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.touches[0].clientX - rect.left;
        mouse.y = e.touches[0].clientY - rect.top;
        mouse.isActive = true;
      }
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);
    container.addEventListener("touchmove", handleTouchMove, { passive: true });
    container.addEventListener("touchend", handleMouseLeave);

    // Particle palette: brand amber orange, warm gold, flame ember, and pearl
    const colors = [
      "243, 146, 0",   // brand amber orange #f39200
      "255, 184, 52",  // warm gold #ffb834
      "233, 78, 27",   // flame ember #e94e1b
      "255, 215, 120", // bright golden honey
      "255, 255, 255", // crisp pearl white
    ];

    const particleCount = Math.min(110, Math.max(50, Math.floor((width * height) / 12000)));
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const baseAlpha = 0.25 + Math.random() * 0.55;
      const baseRadius = 1.4 + Math.random() * 2.2;

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.55,
        vy: (Math.random() - 0.5) * 0.55,
        baseRadius,
        radius: baseRadius,
        color,
        alpha: baseAlpha,
        baseAlpha,
        pulseSpeed: 0.02 + Math.random() * 0.03,
        pulseOffset: Math.random() * Math.PI * 2,
      });
    }

    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      // Draw faint connections between close particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 85) {
            const lineAlpha = (1 - dist / 85) * 0.15;
            ctx.strokeStyle = `rgba(243, 146, 0, ${lineAlpha})`;
            ctx.lineWidth = 0.75;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Update and draw each particle
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Ambient twinkle
        p.alpha = p.baseAlpha + Math.sin(time * p.pulseSpeed * 10 + p.pulseOffset) * 0.15;

        // Hover dispersion effect: particles spread out when mouse hovers near
        if (mouse.isActive) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius && dist > 0) {
            // Repulsion force that spreads particles outwards around the cursor
            const force = (1 - dist / mouse.radius) * 3.5;
            const angle = Math.atan2(dy, dx);
            p.vx += Math.cos(angle) * force * 0.22;
            p.vy += Math.sin(angle) * force * 0.22;

            // Enlarge slightly when active near cursor
            p.radius = p.baseRadius * 1.5;
            p.alpha = Math.min(1, p.baseAlpha + 0.35);
          } else {
            p.radius = p.baseRadius;
          }
        } else {
          p.radius = p.baseRadius;
        }

        // Apply friction to prevent runaway speeds
        p.vx *= 0.96;
        p.vy *= 0.96;

        // Ensure minimum ambient drift
        if (Math.abs(p.vx) < 0.1) p.vx += (Math.random() - 0.5) * 0.1;
        if (Math.abs(p.vy) < 0.1) p.vy += (Math.random() - 0.5) * 0.1;

        p.x += p.vx;
        p.y += p.vy;

        // Wrap around bounds seamlessly
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Draw particle with subtle glow
        ctx.save();
        ctx.shadowBlur = 8;
        ctx.shadowColor = `rgba(${p.color}, 0.7)`;
        ctx.fillStyle = `rgba(${p.color}, ${Math.max(0.1, p.alpha)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleMouseLeave);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.name.trim()) {
      setErrorMessage("Please enter your name.");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (!formData.message.trim()) {
      setErrorMessage("Please enter a message.");
      return;
    }

    setIsSubmitting(true);

    // Simulate sending with a smooth feedback state
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
    }, 1000);
  };

  const contactData = siteData.footerBento.contact;

  return (
    <section className="contact-page" id="contactPage" ref={containerRef}>
      {/* Interactive Background Particle Canvas */}
      <canvas ref={canvasRef} className="contact-page__canvas" aria-hidden="true" />

      {/* Floating 3D Food Ingredient Particles (Spread across background & reacts to hover) */}
      <ContactParticles />

      {/* Top Center Ambient Amber Halo */}
      <div className="contact-page__glow" aria-hidden="true" />

      {/* Top Left Circuit Accent */}
      <svg
        className="contact-page__circuit contact-page__circuit--left"
        viewBox="0 0 320 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M 0 30 L 140 30 L 190 80 L 280 80"
          stroke="url(#circuitGradLeft)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="280" cy="80" r="3.5" fill="#ffb834" />
        <path
          d="M 0 90 L 80 90 L 120 130 L 210 130"
          stroke="url(#circuitGradLeft)"
          strokeWidth="1.2"
          strokeDasharray="4 4"
        />
        <circle cx="210" cy="130" r="2.5" fill="#f39200" />
        <defs>
          <linearGradient id="circuitGradLeft" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f39200" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ffb834" stopOpacity="0.95" />
          </linearGradient>
        </defs>
      </svg>

      {/* Top Right Circuit Accent */}
      <svg
        className="contact-page__circuit contact-page__circuit--right"
        viewBox="0 0 320 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M 320 30 L 180 30 L 130 80 L 40 80"
          stroke="url(#circuitGradRight)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="40" cy="80" r="3.5" fill="#ffb834" />
        <path
          d="M 320 90 L 240 90 L 200 130 L 110 130"
          stroke="url(#circuitGradRight)"
          strokeWidth="1.2"
          strokeDasharray="4 4"
        />
        <circle cx="110" cy="130" r="2.5" fill="#f39200" />
        <defs>
          <linearGradient id="circuitGradRight" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#f39200" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ffb834" stopOpacity="0.95" />
          </linearGradient>
        </defs>
      </svg>

      {/* Giant Background Typographic Watermark */}
      <div className="contact-page__watermark" aria-hidden="true">
        CONTACT
      </div>

      {/* Main Two-Column Interactive Container */}
      <div className="contact-page__container">
        {/* Left Column: Info & Action Cards */}
        <div className="contact-page__info-col">
          {/* Top Pill Badge */}
          <div className="contact-badge">
            <span className="contact-badge__icon" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </span>
            <span className="contact-badge__text">Contact</span>
          </div>

          <h1 className="contact-page__heading">Get in touch</h1>

          <p className="contact-page__subheading">
            Have questions, catering requests, or craving authentic Chicago smash burgers and hot hoagies? Reach out to our team.
          </p>

          {/* Action Cards Stack */}
          <div className="contact-page__cards">
            {/* Card 1: Email us */}
            <a
              href={`mailto:${contactData.email}`}
              className="contact-card"
              aria-label={`Email us at ${contactData.email}`}
            >
              <div className="contact-card__icon-box" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="3" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </div>
              <div className="contact-card__content">
                <span className="contact-card__title">Email us</span>
                <span className="contact-card__value">{contactData.email}</span>
              </div>
              <div className="contact-card__action" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </div>
            </a>

            {/* Card 2: Call us */}
            <a
              href={`tel:${contactData.phone.replace(/[^0-9]/g, "")}`}
              className="contact-card"
              aria-label={`Call us at ${contactData.phone}`}
            >
              <div className="contact-card__icon-box" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <div className="contact-card__content">
                <span className="contact-card__title">Call us</span>
                <span className="contact-card__value">{contactData.phone}</span>
              </div>
              <div className="contact-card__action" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </div>
            </a>

            {/* Card 3: Our location */}
            <a
              href="https://maps.google.com/?q=7116+S+Yates+Blvd,+Chicago,+IL+60649"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-card"
              aria-label={`Find us at ${contactData.address}`}
            >
              <div className="contact-card__icon-box" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div className="contact-card__content">
                <span className="contact-card__title">Our location</span>
                <span className="contact-card__value">{contactData.address}</span>
              </div>
              <div className="contact-card__action" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </div>
            </a>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="contact-page__form-col">
          <div className="contact-form-panel">
            {isSubmitted ? (
              <div className="contact-form-panel__success" role="status">
                <div className="contact-form-panel__success-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f39200" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 className="contact-form-panel__success-title">Message Sent!</h3>
                <p className="contact-form-panel__success-desc">
                  Thank you for reaching out to Hoagy House. Our team will review your message and get back to you promptly.
                </p>
                <button
                  type="button"
                  className="contact-form-panel__reset-btn"
                  onClick={() => setIsSubmitted(false)}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form" noValidate>
                {errorMessage && (
                  <div className="contact-form__error" role="alert">
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Name Input */}
                <div className="contact-form__group">
                  <label htmlFor="contact-name" className="contact-form__label">
                    Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    className="contact-form__input"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                {/* Email Input */}
                <div className="contact-form__group">
                  <label htmlFor="contact-email" className="contact-form__label">
                    Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    className="contact-form__input"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                {/* Message Textarea */}
                <div className="contact-form__group">
                  <label htmlFor="contact-message" className="contact-form__label">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    className="contact-form__textarea"
                    placeholder="Tell us what's on your mind..."
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                </div>

                {/* Full-width Crisp White Submit Button */}
                <button
                  type="submit"
                  className={`contact-form__submit-btn ${isSubmitting ? "is-loading" : ""}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="contact-form__spinner" aria-label="Sending message..." />
                  ) : (
                    <span>Submit</span>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
