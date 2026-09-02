import { Link } from "react-router";
import { motion } from 'motion/react';
import { Helmet } from '@dr.pogodin/react-helmet';
function OrnamentalDivider() {
  return <div className="flex items-center justify-center gap-3 my-8">
      <div className="h-px flex-1 max-w-xs" style={{
      background: 'linear-gradient(to right, transparent, #C9A84C)'
    }} />
      <svg width="40" height="20" viewBox="0 0 40 20" fill="none">
        <path d="M20 2 L24 10 L20 18 L16 10 Z" stroke="#C9A84C" strokeWidth="1" fill="#C9A84C" opacity="0.6" />
        <circle cx="20" cy="10" r="3" fill="#C9A84C" />
      </svg>
      <div className="h-px flex-1 max-w-xs" style={{
      background: 'linear-gradient(to left, transparent, #C9A84C)'
    }} />
    </div>;
}
const steps = [{
  num: '01',
  title: 'Register & Submit Your Biodata',
  desc: 'Fill out our comprehensive registration form with your personal details, astrological information (Raas, Nakshatra, Gotra, etc.), family background, education, occupation, and partner expectations. Upload your profile photo and Aadhar card for identity verification.',
  note: 'Registration fee: ₹501 per year, via UPI'
}, {
  num: '02',
  title: 'Secure Payment',
  desc: 'Pay the registration fee via UPI using our QR code or UPI ID. Upload your payment screenshot or enter your Transaction ID to confirm. Your registration is complete once payment is verified.',
  note: 'Payment is processed manually by our team within 24 hours.'
}, {
  num: '03',
  title: 'Profile Review by Our Team',
  desc: 'Our experienced matchmakers personally review your complete biodata. We assess compatibility based on astrological factors, family values, educational background, and your stated expectations — no automated algorithm.',
  note: 'Review typically completed within 1–2 working days.'
}, {
  num: '04',
  title: 'Hand-picked Matches Sent to WhatsApp',
  desc: 'We send carefully selected, highly compatible profiles directly to your WhatsApp number. Each match includes the person\'s biodata, photo, and relevant details. Your profile is never shared publicly — only with specific, compatible candidates.',
  note: 'Matches delivered within 3–5 working days of registration.'
}, {
  num: '05',
  title: 'You Decide',
  desc: 'Review the matches at your own pace, in complete privacy. If you are interested in a profile, simply reply on WhatsApp and our team will facilitate the next steps. There is no pressure, no public interaction, and no exposure.',
  note: 'Your privacy is maintained throughout the entire process.'
}];
export default function HowItWorksPage() {
  const site = 'https://lakshminarayanmatrimony.in';
  const ogImage = `${site}/og-image.svg`;
  const title = 'How Marathi Matchmaking Works | Lakshmi Narayan Matrimony';
  const description = 'See exactly how our Marathi matrimonial service works — register biodata, astrological review, hand-picked matches sent to WhatsApp in 3–5 days. Private, personal, trusted.';
  const faqItems = [{
    q: 'Is my Aadhar card information safe?',
    a: 'Yes, absolutely. Your Aadhar card is collected only for identity verification and is never shared with anyone, including potential matches. It is stored securely and used solely to confirm your identity.'
  }, {
    q: 'How many matches will I receive?',
    a: 'We focus on quality, not quantity. You will receive a small number of highly compatible, hand-picked profiles rather than a large list of random suggestions.'
  }, {
    q: 'Can I request more matches?',
    a: 'Yes. If you would like additional matches after reviewing the initial ones, please contact us on WhatsApp and our team will assist you.'
  }, {
    q: 'Is the registration fee refundable?',
    a: 'The registration fee covers the cost of manual profile review and matchmaking service. It is non-refundable once your profile has been reviewed.'
  }, {
    q: 'How long does it take to receive matches?',
    a: 'Matches are typically delivered within 3–5 working days of your registration being verified. Profile review is completed within 1–2 working days.'
  }, {
    q: 'What astrological factors do you check for compatibility?',
    a: 'We check Raas (moon sign), Gana, Gotra, Shakha, Nakshatra, Charan, Naad, and Mangal status — the full traditional Marathi astrological compatibility framework.'
  }, {
    q: 'How is Lakshmi Narayan Matrimony different from online matrimony portals?',
    a: 'Unlike online portals where profiles are publicly browsable, we keep all profiles completely private. A real human — not an algorithm — reviews your profile and hand-picks matches based on your specific astrological details, family values, and expectations.'
  }];
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [{
      '@type': 'WebPage',
      '@id': `${site}/how-it-works#webpage`,
      url: `${site}/how-it-works`,
      name: title,
      description,
      isPartOf: {
        '@id': `${site}/#website`
      },
      about: {
        '@id': `${site}/#organization`
      },
      inLanguage: ['en', 'mr'],
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [{
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${site}/`
        }, {
          '@type': 'ListItem',
          position: 2,
          name: 'How It Works',
          item: `${site}/how-it-works`
        }]
      }
    },
    // HowTo schema — Google can show this as a rich result
    {
      '@type': 'HowTo',
      '@id': `${site}/how-it-works#howto`,
      name: 'How to Find a Marathi Life Partner Through Lakshmi Narayan Matrimony',
      description: 'A step-by-step guide to finding a compatible Marathi bride or groom through our private, hand-picked matchmaking service.',
      totalTime: 'P5D',
      step: [{
        '@type': 'HowToStep',
        position: 1,
        name: 'Register & Submit Your Biodata',
        text: 'Fill out our comprehensive registration form with personal details, astrological information (Raas, Nakshatra, Gotra, Mangal), family background, education, occupation, and partner expectations. Upload your profile photo.'
      }, {
        '@type': 'HowToStep',
        position: 2,
        name: 'Secure Payment',
        text: 'Pay the ₹501 annual registration fee via UPI. Your registration is complete once payment is verified by our team within 24 hours.'
      }, {
        '@type': 'HowToStep',
        position: 3,
        name: 'Profile Review by Our Team',
        text: 'Our experienced matchmakers personally review your complete biodata, assessing compatibility based on astrological factors, family values, and your stated expectations — no automated algorithm.'
      }, {
        '@type': 'HowToStep',
        position: 4,
        name: 'Receive Hand-picked Matches on WhatsApp',
        text: 'We send carefully selected, highly compatible profiles directly to your WhatsApp number. Each match includes biodata, photo, and relevant details. Your profile is never shared publicly.'
      }, {
        '@type': 'HowToStep',
        position: 5,
        name: 'You Decide',
        text: 'Review matches at your own pace in complete privacy. If interested, reply on WhatsApp and our team facilitates the next steps. No pressure, no public interaction.'
      }]
    },
    // FAQ schema for AEO
    {
      '@type': 'FAQPage',
      '@id': `${site}/how-it-works#faq`,
      mainEntity: faqItems.map(({
        q,
        a
      }) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: a
        }
      }))
    }]
  };
  return <div className="bg-background">
      <Helmet>
        <html lang="en" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content="how Marathi matchmaking works, Marathi matrimony process, traditional matchmaking Maharashtra, hand-picked matrimony, astrological compatibility matching" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <link rel="canonical" href={`${site}/how-it-works`} />
        <meta property="og:site_name" content="Lakshmi Narayan Matrimony" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${site}/how-it-works`} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="How Lakshmi Narayan Matrimony works — step by step" />
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
        <motion.h1 className="font-heading text-4xl font-bold text-accent mb-2 relative z-10" initial={{
        opacity: 0,
        y: 16
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5,
        ease: 'easeOut' as const
      }}>
          How It Works
        </motion.h1>
        <p className="text-white/60 text-sm relative z-10">Simple, private, and personal — every step of the way</p>
      </div>

      <div className="max-w-3xl mx-auto px-4 md:px-8 py-16">
        <OrnamentalDivider />

        {/* Steps */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-accent/30 hidden md:block" />

          <div className="flex flex-col gap-8">
            {steps.map((step, i) => <motion.div key={i} className="flex gap-6" initial={{
            opacity: 0,
            x: -20
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.4,
            delay: i * 0.08,
            ease: 'easeOut' as const
          }}>
                {/* Number bubble */}
                <div className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-heading font-bold text-base z-10" style={{
              background: '#2D1B69',
              color: '#C9A84C',
              border: '2px solid #C9A84C'
            }}>
                  {step.num}
                </div>
                {/* Content */}
                <div className="bg-card rounded-xl p-5 flex-1 border border-accent/20 shadow-sm">
                  <h3 className="font-heading text-primary font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-card-foreground/75 text-sm leading-relaxed mb-3">{step.desc}</p>
                  <div className="flex items-start gap-2 bg-muted rounded-lg px-3 py-2">
                    <span className="text-accent text-xs mt-0.5">✦</span>
                    <p className="text-muted-foreground text-xs italic">{step.note}</p>
                  </div>
                </div>
              </motion.div>)}
          </div>
        </div>

        <OrnamentalDivider />

        {/* FAQ */}
        <h2 className="font-heading text-2xl font-bold text-primary text-center mb-6">Frequently Asked Questions</h2>
        <div className="flex flex-col gap-4 mb-10">
          {faqItems.map((faq, i) => <motion.div key={i} className="bg-card rounded-xl p-5 border border-accent/20" initial={{
          opacity: 0,
          y: 12
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.35,
          delay: i * 0.06,
          ease: 'easeOut' as const
        }}>
              <p className="font-heading text-primary font-semibold text-sm mb-2">Q: {faq.q}</p>
              <p className="text-card-foreground/70 text-sm leading-relaxed">{faq.a}</p>
            </motion.div>)}
        </div>

        <div className="text-center">
          <Link to="/register" className="inline-block font-heading font-bold text-base px-10 py-4 rounded-xl text-primary-foreground transition-all duration-200 hover:opacity-90" style={{
          background: '#2D1B69',
          border: '2px solid #C9A84C'
        }}>
            Register Now
          </Link>
        </div>
      </div>
    </div>;
}
