import { useState } from 'react';
import { motion } from 'motion/react';
import { Helmet } from '@dr.pogodin/react-helmet';

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const site = 'https://lakshminarayanmatrimony.in';
  const ogImage = `${site}/og-image.svg`;
  const title = 'Contact Lakshmi Narayan Matrimony | +91 9225800617';
  const description = 'Contact Lakshmi Narayan Matrimony — call or WhatsApp +91 9225800617 (Mon–Sun 4–6 PM) or email lakshminarayanmatri@gmail.com. Trusted Marathi matrimonial service, Maharashtra.';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ContactPage',
        '@id': `${site}/contact#webpage`,
        url: `${site}/contact`,
        name: title,
        description,
        isPartOf: { '@id': `${site}/#website` },
        about: { '@id': `${site}/#organization` },
        inLanguage: ['en', 'mr'],
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${site}/` },
            { '@type': 'ListItem', position: 2, name: 'Contact', item: `${site}/contact` },
          ],
        },
      },
      // Full LocalBusiness with contact details — helps Google Knowledge Panel
      {
        '@type': ['MarriageAgency', 'LocalBusiness'],
        '@id': `${site}/#organization`,
        name: 'Lakshmi Narayan Matrimony',
        alternateName: 'लक्ष्मी नारायण वधू वर सूचक',
        url: `${site}/`,
        telephone: '+919225800617',
        email: 'lakshminarayanmatri@gmail.com',
        contactPoint: [
          {
            '@type': 'ContactPoint',
            telephone: '+919225800617',
            contactType: 'customer service',
            availableLanguage: ['English', 'Marathi', 'Hindi'],
            hoursAvailable: {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
              opens: '16:00',
              closes: '18:00',
            },
            contactOption: 'TollFree',
          },
        ],
        address: { '@type': 'PostalAddress', addressRegion: 'Maharashtra', addressCountry: 'IN' },
        areaServed: { '@type': 'State', name: 'Maharashtra', containedInPlace: { '@type': 'Country', name: 'India' } },
      },
    ],
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload: Record<string, string> = {};
    fd.forEach((v, k) => { if (typeof v === 'string') payload[k] = v; });
    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (_) {}
    setSent(true);
  }

  return (
    <div className="bg-background">
      <Helmet>
        <html lang="en" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content="contact Lakshmi Narayan Matrimony, Marathi matrimony contact Maharashtra, matrimonial service phone number, वधू वर सूचक संपर्क" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <link rel="canonical" href={`${site}/contact`} />
        <meta property="og:site_name" content="Lakshmi Narayan Matrimony" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${site}/contact`} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Contact Lakshmi Narayan Matrimony" />
        <meta property="og:locale" content="en_IN" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      {/* Page Header */}
      <div className="bg-primary py-14 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg viewBox="0 0 400 200" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
            {[30,60,90,120].map((r,i) => <circle key={i} cx="200" cy="100" r={r} stroke="#C9A84C" strokeWidth="0.8" fill="none"/>)}
          </svg>
        </div>
        <motion.h1
          className="font-heading text-4xl font-bold text-accent mb-2 relative z-10"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' as const }}
        >
          Contact Us
        </motion.h1>
        <p className="text-white/60 text-sm relative z-10">We are here to help — reach out anytime</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.4, ease: 'easeOut' as const }}
          >
            <h2 className="font-heading text-2xl font-bold text-primary mb-6">Get In Touch</h2>
            <div className="flex flex-col gap-5">
              {[
                { icon: '📞', label: 'Phone / WhatsApp', value: '+91 9225800617', sub: 'Available Mon–Sun, 4PM–6PM' },
                { icon: '✉️', label: 'Email', value: 'lakshminarayanmatri@gmail.com', sub: '' },
                { icon: '📍', label: 'Location', value: 'Maharashtra, Karnataka', sub: '' },
              ].map((c, i) => (
                <div key={i} className="flex gap-4 bg-card rounded-xl p-4 border border-accent/20">
                  <div className="text-2xl shrink-0">{c.icon}</div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">{c.label}</p>
                    <p className="font-heading text-primary font-semibold text-sm">{c.value}</p>
                    <p className="text-xs text-muted-foreground">{c.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-muted rounded-xl p-5 border border-accent/20">
              <p className="font-heading text-primary font-semibold text-sm mb-2">🔒 Privacy Assurance</p>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Any information you share with us through this form or via WhatsApp is kept strictly confidential and used only to assist you with our matchmaking service.
              </p>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.4, ease: 'easeOut' as const }}
          >
            {sent ? (
              <div className="bg-card rounded-2xl p-8 border-2 border-accent/40 text-center h-full flex flex-col items-center justify-center">
                <p className="text-3xl mb-3">🙏</p>
                <h3 className="font-heading text-primary text-xl font-bold mb-2">Message Sent!</h3>
                <p className="text-card-foreground/70 text-sm leading-relaxed">
                  Thank you for reaching out. We will get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form
                className="bg-card rounded-2xl p-6 border border-accent/30 shadow-sm flex flex-col gap-4"
                onSubmit={handleSubmit}
              >
                <h2 className="font-heading text-xl font-bold text-primary mb-1">Send Us a Message</h2>
                {[
                  { label: 'Your Name', type: 'text', name: 'name', placeholder: 'Full name' },
                  { label: 'Phone / WhatsApp', type: 'tel', name: 'phone', placeholder: '+91 XXXXX XXXXX' },
                  { label: 'Email (optional)', type: 'email', name: 'email', placeholder: 'your@email.com' },
                ].map((f) => (
                  <div key={f.label} className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-card-foreground/70">{f.label}</label>
                    <input
                      type={f.type}
                      name={f.name}
                      placeholder={f.placeholder}
                      className="rounded border border-accent/40 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
                    />
                  </div>
                ))}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-card-foreground/70">Your Message</label>
                  <textarea
                    name="message"
                    rows={4}
                    placeholder="How can we help you?"
                    className="rounded border border-accent/40 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-lg font-heading font-bold text-sm text-primary-foreground transition-all duration-200 hover:opacity-90"
                  style={{ background: '#2D1B69', border: '2px solid #C9A84C' }}
                >
                  Send Message
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
