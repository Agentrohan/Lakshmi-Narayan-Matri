import { motion } from 'motion/react';
import { Helmet } from '@dr.pogodin/react-helmet';

function OrnamentalDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-8">
      <div className="h-px flex-1 max-w-xs" style={{ background: 'linear-gradient(to right, transparent, #C9A84C)' }} />
      <svg width="40" height="20" viewBox="0 0 40 20" fill="none">
        <path d="M20 2 L24 10 L20 18 L16 10 Z" stroke="#C9A84C" strokeWidth="1" fill="#C9A84C" opacity="0.6" />
        <circle cx="20" cy="10" r="3" fill="#C9A84C" />
      </svg>
      <div className="h-px flex-1 max-w-xs" style={{ background: 'linear-gradient(to left, transparent, #C9A84C)' }} />
    </div>);

}

export default function AboutPage() {
  const site = 'https://lakshminarayanmatrimony.in';
  const ogImage = `${site}/og-image.svg`;
  const title = 'About Lakshmi Narayan Matrimony | Marathi Matchmaking Maharashtra';
  const description = 'Lakshmi Narayan Matrimony is a trusted Marathi matrimonial service in Maharashtra. Privacy-first, hand-picked matches, full astrological compatibility. Meet the team behind लक्ष्मी नारायण वधू वर सूचक.';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'AboutPage',
        '@id': `${site}/about#webpage`,
        url: `${site}/about`,
        name: title,
        description,
        isPartOf: { '@id': `${site}/#website` },
        about: { '@id': `${site}/#organization` },
        inLanguage: ['en', 'mr'],
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${site}/` },
            { '@type': 'ListItem', position: 2, name: 'About Us', item: `${site}/about` },
          ],
        },
      },
      // Repeat the Organization node here so crawlers indexing /about also see it
      {
        '@type': ['MarriageAgency', 'LocalBusiness'],
        '@id': `${site}/#organization`,
        name: 'Lakshmi Narayan Matrimony',
        alternateName: 'लक्ष्मी नारायण वधू वर सूचक',
        url: `${site}/`,
        telephone: '+919225800617',
        email: 'lakshminarayanmatri@gmail.com',
        address: { '@type': 'PostalAddress', addressRegion: 'Maharashtra', addressCountry: 'IN' },
        description: 'Trusted traditional Marathi matrimonial service in Maharashtra. Hand-picked matches with full astrological compatibility delivered privately to WhatsApp.',
        knowsAbout: ['Marathi matrimony', 'Hindu matchmaking', 'Vedic astrology compatibility', 'Gotra matching', 'Nakshatra matching'],
        areaServed: { '@type': 'State', name: 'Maharashtra', containedInPlace: { '@type': 'Country', name: 'India' } },
      },
    ],
  };

  return (
    <div className="bg-background">
      <Helmet>
        <html lang="en" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content="about Lakshmi Narayan Matrimony, Marathi matrimonial service Maharashtra, traditional matchmaking, वधू वर सूचक, Hindu matrimony Maharashtra" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <link rel="canonical" href={`${site}/about`} />
        <meta property="og:site_name" content="Lakshmi Narayan Matrimony" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${site}/about`} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="About Lakshmi Narayan Matrimony — Trusted Marathi Matchmaking" />
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
            {[30, 60, 90, 120].map((r, i) => <circle key={i} cx="200" cy="100" r={r} stroke="#C9A84C" strokeWidth="0.8" fill="none" />)}
          </svg>
        </div>
        <motion.h1
          className="font-heading text-4xl font-bold text-accent mb-2 relative z-10"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' as const }}>

          About Us
        </motion.h1>
        <p className="text-white/60 text-sm relative z-10">Our story, our values, our promise to you</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-16">
        <OrnamentalDivider />

        {/* Mission */}
        <motion.div
          className="bg-card rounded-2xl p-8 mb-10 border border-accent/30 shadow-sm"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.4, ease: 'easeOut' as const }}>

          <h2 className="font-heading text-2xl font-bold text-primary mb-4">आमचे ध्येय</h2>
          <p className="text-card-foreground/80 leading-relaxed mb-4">लग्न हे दोन परिवाराला जोडणार नातं आहे.

          </p>
          <p className="text-card-foreground/80 leading-relaxed mb-4">येणारे प्रत्येक स्थळ हे आपल्या अपेक्षेप्रमाणे आहे की नाही हे बघून आपल्याला वैयक्तिक पाठवून आपल्याला मदत करणे.

          </p>
          <p className="text-card-foreground/80 leading-relaxed">
            पालकांच्या मनात एक विश्वासहर्ता संपादन करणे.
          </p>
        </motion.div>

        {/* Values */}
        <h2 className="font-heading text-2xl font-bold text-primary text-center mb-6">Our Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
          {[
          { icon: '🔒', title: 'Privacy First', desc: 'Your biodata, photos, and Aadhar details are kept strictly confidential. We never display your information publicly.' },
          { icon: '🌸', title: 'Personal Touch', desc: 'A real human reviews your profile — not a bot. We take the time to understand your family values and expectations.' },
          { icon: '🙏', title: 'Rooted in Tradition', desc: 'We respect compatibility and family background as important factors in matchmaking.' },
          { icon: '💬', title: 'Direct & Transparent', desc: 'Matches are delivered directly to your WhatsApp. No hidden fees, no surprises — just honest, caring service.' }].
          map((v, i) =>
          <motion.div
            key={i}
            className="flex gap-4 bg-card rounded-xl p-5 border border-accent/20 shadow-sm"
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08, ease: 'easeOut' as const }}>

              <div className="text-3xl shrink-0">{v.icon}</div>
              <div>
                <h3 className="font-heading text-primary font-semibold mb-1">{v.title}</h3>
                <p className="text-card-foreground/70 text-sm leading-relaxed">{v.desc}</p>
              </div>
            </motion.div>
          )}
        </div>

        <OrnamentalDivider />

        {/* Promise */}
        <motion.div
          className="text-center py-8"
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.4, ease: 'easeOut' as const }}>

          <p className="font-heading text-primary text-xl font-semibold mb-3">Our Promise to You</p>
          <p className="text-muted-foreground text-base leading-relaxed max-w-2xl mx-auto">
            "We treat every profile as if it were our own family member's. Your trust is our greatest responsibility, and we will never take it lightly."
          </p>
          <p className="text-accent text-sm mt-3 font-medium">— The Lakshmi Narayan Matrimony Team</p>
        </motion.div>
      </div>
    </div>);

}