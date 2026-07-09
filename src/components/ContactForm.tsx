import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Github, Linkedin, Send, Check, Loader2, ArrowUpRight, DollarSign } from 'lucide-react';
import MagneticButton from './MagneticButton.tsx';
import { API_URL } from '../config.ts';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [focused, setFocused] = useState({ name: false, email: false, message: false });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const handleEmailClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    // Copy email to clipboard
    navigator.clipboard.writeText('m82186445@gmail.com').catch((err) => {
      console.error('Failed to copy email: ', err);
    });

    // Open Gmail compose in a new tab
    window.open("https://mail.google.com/mail/?view=cm&fs=1&to=m82186445@gmail.com", "_blank");

    // Display visual confirmation
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFocus = (name: string, isFocused: boolean) => {
    setFocused({ ...focused, [name]: isFocused });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setStatus('error');
      setErrorMessage('Please fill in all fields before sending.');
      return;
    }

    setStatus('loading');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (response.ok) {
        // Successful submission!
        setStatus('success');
        setForm({ name: '', email: '', message: '' });
        
        // Return back to idle after 4 seconds
        setTimeout(() => {
          setStatus('idle');
        }, 4000);
      } else {
        setStatus('error');
        setErrorMessage(data.error || data.errors?.[0]?.msg || 'Failed to submit form.');
        setTimeout(() => setStatus('idle'), 4000);
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMessage('Network error. Failed to reach the server.');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  return (
    <div className="grid grid-cols-12 gap-2 sm:gap-3 md:gap-4 lg:gap-6 max-w-5xl mx-auto items-start py-8">
      {/* Left side: Bold CTAs and Social Links */}
      <div className="col-span-5 min-w-0 space-y-5 sm:space-y-7">
        <div className="space-y-3 sm:space-y-4">
          <motion.h3
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-lg sm:text-xl md:text-3xl font-display font-bold tracking-tight text-stone-900"
          >
            Let&apos;s engineer something memorable together.
          </motion.h3>
          <p className="text-stone-500 font-sans text-[12px] sm:text-sm font-light leading-relaxed">
            I am always open to consulting opportunities, selective freelance contracts, and collaborative web design. Feel free to reach out directly or use the contact form.
          </p>
        </div>

        {/* Dynamic Magnetic Social List */}
        <div className="space-y-4 pt-4">
          <h4 className="text-stone-400 font-mono text-xs uppercase tracking-widest font-semibold">
            Get in Touch
          </h4>
          
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {/* Email link */}
            <a
              href="mailto:m82186445@gmail.com"
              onClick={handleEmailClick}
              className="relative flex items-center gap-2 sm:gap-3 p-3 rounded-xl border border-stone-200/60 bg-stone-50/50 hover:border-blue-500/30 transition-all group"
              data-cursor="pointer"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:rotate-12 transition-transform duration-300">
                <Mail className="w-3 h-3" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-mono text-stone-400 uppercase tracking-wider">Email</p>
                <p className="text-xs font-semibold text-stone-700 truncate font-mono">Email</p>
              </div>
              
              <AnimatePresence>
                {copied && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.95 }}
                    className="absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-stone-900 text-white text-[10px] font-mono rounded-md shadow-md flex items-center gap-1 z-10 whitespace-nowrap"
                  >
                    <Check className="w-3 h-3 text-green-400" />
                    <span>Email copied!</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </a>

            {/* GitHub */}
            <a
              href="https://github.com/mmohsin5204"
              target="_blank"
              rel="noreferrer noopener"
              className="flex items-center gap-2 sm:gap-3 p-3 rounded-xl border border-stone-200/60 bg-stone-50/50 hover:border-blue-500/30 transition-all group"
              data-cursor="pointer"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-stone-200 flex items-center justify-center text-stone-700 group-hover:rotate-12 transition-transform duration-300">
                <Github className="w-3 h-3" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-mono text-stone-400 uppercase tracking-wider">GitHub</p>
                <p className="text-xs font-semibold text-stone-700 truncate font-mono">GitHub</p>
              </div>
            </a>

            {/* LinkedIn */}
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer noopener"
              className="flex items-center gap-2 sm:gap-3 p-3 rounded-xl border border-stone-200/60 bg-stone-50/50 hover:border-blue-500/30 transition-all group"
              data-cursor="pointer"
            >
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg bg-blue-600/10 flex items-center justify-center text-blue-600 group-hover:rotate-12 transition-transform duration-300">
                <Linkedin className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-mono text-stone-400 uppercase tracking-wider">LinkedIn</p>
                <p className="text-xs font-semibold text-stone-700 truncate font-mono">Connect</p>
              </div>
            </a>

            {/* Fiverr */}
            <a
              href="https://fiverr.com/mohsinwebdev_"
              target="_blank"
              rel="noreferrer noopener"
              className="flex items-center gap-2 sm:gap-3 p-3 rounded-xl border border-stone-200/60 bg-stone-50/50 hover:border-blue-500/30 transition-all group"
              data-cursor="pointer"
            >
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:rotate-12 transition-transform duration-300">
                <DollarSign className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-mono text-stone-400 uppercase tracking-wider">Fiverr</p>
                <p className="text-xs font-semibold text-stone-700 truncate font-mono">@mohsinwebdev_</p>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Right side: Interactive Contact Form */}
      <div className="col-span-7 min-w-0">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Floating Label Input: Name */}
          <div className="relative">
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              onFocus={() => handleFocus('name', true)}
              onBlur={() => handleFocus('name', false)}
              className="peer w-full px-3 py-3 sm:px-4 sm:py-4 rounded-xl border border-stone-200 bg-transparent text-stone-900 placeholder-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all font-sans text-sm font-light"
              placeholder="Your Name"
              disabled={status === 'loading'}
            />
            <label
              htmlFor="name"
              className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-300 font-mono text-xs uppercase tracking-wider ${
                focused.name || form.name
                  ? '-translate-y-9 scale-90 bg-white px-2 text-blue-500'
                  : 'text-stone-400'
              }`}
            >
              Name
            </label>
          </div>

          {/* Floating Label Input: Email */}
          <div className="relative">
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              onFocus={() => handleFocus('email', true)}
              onBlur={() => handleFocus('email', false)}
              className="peer w-full px-3 py-3 sm:px-4 sm:py-4 rounded-xl border border-stone-200 bg-transparent text-stone-900 placeholder-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all font-sans text-sm font-light"
              placeholder="your@email.com"
              disabled={status === 'loading'}
            />
            <label
              htmlFor="email"
              className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-300 font-mono text-xs uppercase tracking-wider ${
                focused.email || form.email
                  ? '-translate-y-9 scale-90 bg-white px-2 text-blue-500'
                  : 'text-stone-400'
              }`}
            >
              Email
            </label>
          </div>

          {/* Floating Label Input: Message */}
          <div className="relative">
            <textarea
              id="message"
              name="message"
              rows={4}
              value={form.message}
              onChange={handleChange}
              onFocus={() => handleFocus('message', true)}
              onBlur={() => handleFocus('message', false)}
              className="peer w-full px-3 py-3 sm:px-4 sm:py-4 rounded-xl border border-stone-200 bg-transparent text-stone-900 placeholder-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all font-sans text-sm font-light resize-none"
              placeholder="How can I help you?"
              disabled={status === 'loading'}
            />
            <label
              htmlFor="message"
              className={`absolute left-4 top-6 pointer-events-none transition-all duration-300 font-mono text-xs uppercase tracking-wider ${
                focused.message || form.message
                  ? '-translate-y-[32px] scale-90 bg-white px-2 text-blue-500'
                  : 'text-stone-400'
              }`}
            >
              Message
            </label>
          </div>

          {/* Satisfying Morphing Submit Button */}
          <div className="flex flex-col items-start gap-4">
            <AnimatePresence mode="wait">
              {status === 'idle' && (
                <motion.div
                  key="idle-btn"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full"
                >
                  <MagneticButton
                    type="submit"
                    className="w-full md:w-auto px-6 py-3 sm:px-8 sm:py-4 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-mono text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
                  >
                    Send Message
                    <Send className="w-3.5 h-3.5" />
                  </MagneticButton>
                </motion.div>
              )}

              {status === 'loading' && (
                <motion.div
                  key="loading-btn"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-500/10 border border-blue-500 text-blue-500 mx-auto md:mx-0"
                >
                  <Loader2 className="w-5 h-5 animate-spin" />
                </motion.div>
              )}

              {status === 'success' && (
                <motion.div
                  key="success-btn"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="flex flex-col md:flex-row items-center gap-3 w-full bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-emerald-600"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-mono tracking-wide font-medium">
                    Message sent successfully. I will get back to you soon.
                  </p>
                </motion.div>
              )}

              {status === 'error' && (
                <motion.div
                  key="error-btn"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="flex flex-col gap-2 w-full"
                >
                  <div className="flex flex-col md:flex-row items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-500">
                    <p className="text-xs font-mono tracking-wide font-medium">
                      Error: {errorMessage}
                    </p>
                  </div>
                  <MagneticButton
                    type="submit"
                    className="px-6 py-3 rounded-lg bg-stone-900 text-stone-200 text-xs font-mono"
                  >
                    Retry Submission
                  </MagneticButton>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </form>
      </div>
    </div>
  );
}
