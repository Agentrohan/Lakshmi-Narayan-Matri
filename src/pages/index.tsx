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
        <path d="M4 10 Q12 4 20 10 Q28 16 36 10" stroke="#C9A84C" strokeWidth="0.8" fill="none" opacity="0.5" />
        <path d="M4 10 Q12 16 20 10 Q28 4 36 10" stroke="#C9A84C" strokeWidth="0.8" fill="none" opacity="0.5" />
      </svg>
      <div className="h-px flex-1 max-w-xs" style={{
      background: 'linear-gradient(to left, transparent, #C9A84C)'
    }} />
    </div>;
}

// Decorative SVG flowers
function FloralCorner({
  flip = false
}: {
  flip?: boolean;
}) {
  return <svg width="180" height="180" viewBox="0 0 180 180" fill="none" className={`absolute opacity-30 pointer-events-none ${flip ? 'scale-x-[-1]' : ''}`} style={{
    top: 0,
    left: flip ? 'auto' : 0,
    right: flip ? 0 : 'auto'
  }}>

      {/* Stem */}
      <path d="M10 170 Q40 120 80 80" stroke="#C9A84C" strokeWidth="2" fill="none" />
      <path d="M10 170 Q60 140 100 100" stroke="#C9A84C" strokeWidth="1.5" fill="none" opacity="0.6" />
      {/* Flowers */}
      {[[80, 80], [55, 110], [100, 55], [40, 130]].map(([cx, cy], i) => <g key={i}>
          {[0, 60, 120, 180, 240, 300].map((a, j) => <ellipse key={j} cx={cx + 10 * Math.cos(a * Math.PI / 180)} cy={cy + 10 * Math.sin(a * Math.PI / 180)} rx="5" ry="8" transform={`rotate(${a} ${cx + 10 * Math.cos(a * Math.PI / 180)} ${cy + 10 * Math.sin(a * Math.PI / 180)})`} fill="#C9A84C" opacity="0.7" />)}
          <circle cx={cx} cy={cy} r="5" fill="#2D1B69" opacity="0.8" />
        </g>)}
      {/* Leaves */}
      <path d="M30 150 Q50 130 70 140" stroke="#2D1B69" strokeWidth="1.5" fill="none" opacity="0.5" />
      <path d="M50 130 Q70 110 90 120" stroke="#2D1B69" strokeWidth="1.5" fill="none" opacity="0.5" />
    </svg>;
}
export default function HomePage() {
  const site = 'https://lakshminarayanmatrimony.in';
  const ogImage = `${site}/og-image.svg`;
  const title = 'Lakshmi Narayan Matrimony';
  const description = 'Lakshmi Narayan Matrimony offers private, hand-picked matchmaking with astrological compatibility and personalised support for families.';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
    // WebSite — enables Google Sitelinks search box
    {
      '@type': 'WebSite',
      '@id': `${site}/#website`,
      name: 'Lakshmi Narayan Matrimony',
      alternateName: 'लक्ष्मी नारायण वधू वर सूचक',
      url: `${site}/`,
      inLanguage: ['en', 'mr'],
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${site}/register`
        },
        'query-input': 'required name=search_term_string'
      }
    },
    // MarriageAgency — the most specific schema type for a matchmaking service
    {
      '@type': ['MarriageAgency', 'LocalBusiness'],
      '@id': `${site}/#organization`,
      name: 'Lakshmi Narayan Matrimony',
      alternateName: 'लक्ष्मी नारायण वधू वर सूचक',
      url: `${site}/`,
      logo: `${site}/og-image.svg`,
      image: ogImage,
      telephone: '+919225800617',
      email: 'lakshminarayanmatri@gmail.com',
      address: {
        '@type': 'PostalAddress',
        addressRegion: 'Maharashtra',
        addressCountry: 'IN'
      },
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '16:00',
        closes: '18:00'
      },
      description: 'Trusted traditional Marathi matrimonial service in Maharashtra. Hand-picked matches with full astrological compatibility — Raas, Nakshatra, Gotra, Mangal — delivered privately to WhatsApp.',
      knowsAbout: ['Marathi matrimony', 'Hindu matchmaking', 'Vedic astrology compatibility', 'Gotra matching', 'Nakshatra matching'],
      areaServed: {
        '@type': 'State',
        name: 'Maharashtra',
        containedInPlace: {
          '@type': 'Country',
          name: 'India'
        }
      },
      priceRange: '₹',
      sameAs: []
    },
    // WebPage
    {
      '@type': 'WebPage',
      '@id': `${site}/#webpage`,
      url: `${site}/`,
      name: title,
      description,
      isPartOf: {
        '@id': `${site}/#website`
      },
      about: {
        '@id': `${site}/#organization`
      },
      datePublished: '2024-01-01',
      dateModified: '2026-07-30',
      inLanguage: ['en', 'mr'],
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [{
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${site}/`
        }]
      }
    },
    // FAQ — AEO: answers questions AI assistants and Google featured snippets pick up
    {
      '@type': 'FAQPage',
      '@id': `${site}/#faq`,
      mainEntity: [{
        '@type': 'Question',
        name: 'What is Lakshmi Narayan Matrimony?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Lakshmi Narayan Matrimony (लक्ष्मी नारायण वधू वर सूचक) is a traditional Marathi matrimonial service in Maharashtra. Unlike large online portals, we personally hand-pick compatible matches based on astrological compatibility (Raas, Nakshatra, Gotra, Mangal), family values, and your stated expectations, then deliver them privately to your WhatsApp.'
        }
      }, {
        '@type': 'Question',
        name: 'How is Lakshmi Narayan Matrimony different from Shaadi.com or BharatMatrimony?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Unlike Shaadi.com or BharatMatrimony where profiles are publicly browsable, Lakshmi Narayan Matrimony keeps all profiles completely private. Our experienced team personally reviews every profile and hand-picks matches — no algorithm, no public browsing. Matches are sent directly and confidentially to your WhatsApp number.'
        }
      }, {
        '@type': 'Question',
        name: 'Which is the best Marathi matrimony service in Maharashtra?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Lakshmi Narayan Matrimony is a trusted Marathi matrimonial service in Maharashtra offering personalised, privacy-first matchmaking. We cover full astrological compatibility including Raas, Gana, Gotra, Shakha, Nakshatra, Charan, Naad, and Mangal — factors that large online portals often overlook.'
        }
      }, {
        '@type': 'Question',
        name: 'How do I find a Marathi bride or groom in Maharashtra?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Register your profile at Lakshmi Narayan Matrimony. Our team reviews your biodata, astrological details, and family background, then sends hand-picked compatible Marathi profiles directly to your WhatsApp within 3–5 working days. Registration takes about 10 minutes.'
        }
      }, {
        '@type': 'Question',
        name: 'Is my personal information safe with Lakshmi Narayan Matrimony?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Your biodata and profile photo are never displayed publicly. They are shared only with specific, compatible candidates selected by our team. All information is kept strictly confidential.'
        }
      }]
    }]
  };
  return <div className="bg-background">
      <Helmet>
        <html lang="en" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content="Lakshmi Narayan Matrimony, लक्ष्मी नारायण वधू वर सूचक, private matchmaking, hand-picked matches, astrological compatibility" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <link rel="canonical" href={`${site}/`} />
        <meta property="og:site_name" content="Lakshmi Narayan Matrimony" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${site}/`} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Lakshmi Narayan Matrimony — Trusted Marathi Matchmaking Service" />
        <meta property="og:locale" content="en_IN" />
        <meta property="og:locale:alternate" content="mr_IN" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
        <meta name="twitter:image:alt" content="Lakshmi Narayan Matrimony — Trusted Marathi Matchmaking" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden min-h-[85vh] flex items-center">
        {/* Background couple image */}
        <div className="absolute inset-0">
          <img src="/airo-assets/images/pages/home/hero-couple" alt="Happy Indian couple" className="w-full h-full object-cover object-center" />

          {/* Gradient overlay */}
          <div className="absolute inset-0" style={{
          background: 'linear-gradient(to right, rgba(45,27,105,0.92) 0%, rgba(45,27,105,0.75) 50%, rgba(45,27,105,0.4) 100%)'
        }} />
        </div>

        {/* Floral corners */}
        <FloralCorner />
        <FloralCorner flip />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-20 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 w-full">
          <div className="max-w-2xl flex-1">
            <motion.p className="text-accent text-base font-medium tracking-[0.25em] uppercase mb-4" initial={{
              opacity: 0,
              y: 10
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.5,
              ease: 'easeOut' as const
            }}>पारंपरिक मूल्ये, आधुनिक शोध


            </motion.p>
            <motion.h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6" initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.6,
              delay: 0.1,
              ease: 'easeOut' as const
            }}>

              Find Your Perfect<br />
              <span className="text-accent">Life Partner</span>
            </motion.h1>
            <motion.p className="text-white/80 text-lg leading-relaxed mb-8 max-w-xl" initial={{
              opacity: 0,
              y: 16
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.5,
              delay: 0.2,
              ease: 'easeOut' as const
            }}>

              No Swiping. No Public Profiles.{' '}
              <strong className="text-accent">100% Hand-picked, personalized matches</strong>{' '}
              delivered directly to your WhatsApp.
            </motion.p>

            <motion.div className="flex flex-wrap gap-3" initial={{
              opacity: 0,
              y: 12
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.5,
              delay: 0.3,
              ease: 'easeOut' as const
            }}>

              <Link to="/register" className="inline-block font-heading font-bold text-base px-8 py-3 rounded-lg text-primary transition-all duration-200 hover:scale-105" style={{
                background: '#C9A84C',
                border: '2px solid #C9A84C',
                boxShadow: '0 4px 20px rgba(201,168,76,0.4)'
              }}>

                Register Now
              </Link>
              <Link to="/about" className="inline-block font-heading font-semibold text-base px-8 py-3 rounded-lg text-white transition-all duration-200 hover:bg-white/10" style={{
                border: '2px solid rgba(255,255,255,0.5)'
              }}>

                About Us
              </Link>
              <Link to="/how-it-works" className="inline-block font-heading font-semibold text-base px-8 py-3 rounded-lg text-white transition-all duration-200 hover:bg-white/10" style={{
                border: '2px solid rgba(255,255,255,0.5)'
              }}>

                How It Works
              </Link>
              <Link to="/contact" className="inline-block font-heading font-semibold text-base px-8 py-3 rounded-lg text-white transition-all duration-200 hover:bg-white/10" style={{
                border: '2px solid rgba(255,255,255,0.5)'
              }}>

                Contact Us
              </Link>
            </motion.div>

            <motion.p className="mt-5 text-white/50 text-xs tracking-widest uppercase" initial={{
              opacity: 0
            }} animate={{
              opacity: 1
            }} transition={{
              duration: 0.5,
              delay: 0.5
            }}>Registrations Open  •  Secure & Confidential


            </motion.p>
          </div>

          {/* ── Milestone card — visible on all screens ── */}
          <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.7,
            delay: 0.4,
            ease: 'easeOut' as const
          }} className="flex flex-col items-center justify-center rounded-2xl px-6 py-6 w-full lg:w-auto lg:shrink-0" style={{
            background: 'linear-gradient(135deg, rgba(201,168,76,0.18) 0%, rgba(45,27,105,0.55) 100%)',
            border: '2px solid rgba(201,168,76,0.55)',
            backdropFilter: 'blur(12px)',
            maxWidth: 280,
            margin: '0 auto',
            boxShadow: '0 8px 40px rgba(45,27,105,0.4)'
          }}>
            <div style={{
              width: 48,
              height: 3,
              background: '#C9A84C',
              borderRadius: 2,
              marginBottom: 20
            }} />
            <p className="font-heading text-accent font-bold text-center leading-snug mb-4" style={{
              fontSize: 17
            }}>
              लक्ष्मी नारायण<br />वधू वर सूचक
            </p>
            <div style={{
              width: '100%',
              height: 1,
              background: 'rgba(201,168,76,0.35)',
              margin: '4px 0 16px'
            }} />
            <p className="text-white/80 text-sm text-center leading-relaxed mb-2">सुरू करून</p>
            <p className="font-heading font-bold text-white text-center" style={{
              fontSize: 22,
              lineHeight: 1.2
            }}>
              एक महिना पूर्ण
            </p>
            <p className="text-accent font-bold text-center mt-2 mb-3" style={{
              fontSize: 26,
              letterSpacing: 2
            }}>
              आणि........
            </p>
            <div className="flex flex-col items-center gap-1 mb-4">
              <p className="font-heading font-bold text-white text-center" style={{
                fontSize: 36,
                lineHeight: 1
              }}>100+</p>
              <p className="text-white/80 text-sm text-center">हुन अधिक स्थळे</p>
            </div>
            <div style={{
              width: '100%',
              height: 1,
              background: 'rgba(201,168,76,0.35)',
              margin: '4px 0 14px'
            }} />
            <div className="flex flex-col items-center gap-1">
              <p className="font-heading text-accent text-center font-bold" style={{
                fontSize: 22
              }}>1 विवाह</p>
              <p className="text-white/80 text-sm text-center">निश्चित झाला 🎊</p>
            </div>
            <div style={{
              width: 48,
              height: 3,
              background: '#C9A84C',
              borderRadius: 2,
              marginTop: 20
            }} />
          </motion.div>

          </div>

        </div>
      </section>

      {/* ── FLORAL BANNER ── */}
      <div className="relative h-28 overflow-hidden">
        <img src="/airo-assets/images/pages/home/floral-decoration" alt="" className="w-full h-full object-cover object-center" />

        <div className="absolute inset-0" style={{
        background: 'linear-gradient(to bottom, rgba(253,246,236,0.2), rgba(253,246,236,0.7))'
      }} />
        {/* Gold text overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="font-heading text-primary text-2xl md:text-3xl font-bold tracking-widest drop-shadow-sm">✦   पारंपरिक मूल्ये, आधुनिक शोध   ✦

          </p>
        </div>
      </div>

      {/* ── WHY CHOOSE US ── */}
      <section className="py-16 px-4 md:px-8 bg-background">
        <div className="max-w-5xl mx-auto">
          <motion.div className="text-center mb-10" initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.4,
          ease: 'easeOut' as const
        }}>

            <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-2">Why Choose Us?</h2>
            <p className="text-muted-foreground text-sm">A service built on trust, tradition, and privacy</p>
          </motion.div>
          <OrnamentalDivider />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[{
            icon: '🔒',
            title: 'Complete Privacy',
            desc: 'No public profiles. Your biodata is only shared with highly compatible matches — never displayed online.'
          }, {
            icon: '🌸',
            title: 'Hand-picked Matches',
            desc: 'Our experienced team personally reviews every profile and curates matches based on compatibility, values, and family background.'
          }, {
            icon: '📱',
            title: 'WhatsApp Delivery',
            desc: 'Matches are sent directly and privately to your WhatsApp. No app downloads, no logins, no swiping.'
          }].map((item, i) => <motion.div key={i} className="bg-card rounded-xl p-6 text-center shadow-sm" style={{
            borderTop: '3px solid #C9A84C'
          }} initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.4,
            delay: i * 0.1,
            ease: 'easeOut' as const
          }}>

                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-heading text-primary font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-card-foreground/70 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>)}
          </div>
        </div>
      </section>

      <OrnamentalDivider />

      {/* ── HOW IT WORKS PREVIEW ── */}
      <section className="py-16 px-4 md:px-8" style={{
      background: 'linear-gradient(135deg, #ECEAF8 0%, #D8D4F0 100%)'
    }}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 className="font-heading text-3xl font-bold text-primary mb-2" initial={{
          opacity: 0,
          y: 16
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.4,
          ease: 'easeOut' as const
        }}>

            Simple. Personal. Private.
          </motion.h2>
          <p className="text-muted-foreground text-sm mb-10">Three easy steps to find your life partner</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[{
            num: '01',
            title: 'Submit Your Biodata',
            desc: 'Fill our comprehensive registration form with your personal and professional details.'
          }, {
            num: '02',
            title: 'We Review & Curate',
            desc: 'Our team personally reviews your profile and hand-picks the most compatible matches.'
          }, {
            num: '03',
            title: 'Receive on WhatsApp',
            desc: 'Compatible profiles arrive directly and privately on your WhatsApp.'
          }].map((step, i) => <motion.div key={i} className="bg-card rounded-xl p-6 border border-accent/30 shadow-sm" initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.4,
            delay: i * 0.12,
            ease: 'easeOut' as const
          }}>

                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 font-heading font-bold text-lg" style={{
              background: '#2D1B69',
              color: '#C9A84C',
              border: '2px solid #C9A84C'
            }}>

                  {step.num}
                </div>
                <h3 className="font-heading text-primary font-semibold text-base mb-2">{step.title}</h3>
                <p className="text-card-foreground/70 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>)}
          </div>

          <Link to="/how-it-works" className="inline-block font-heading font-semibold text-sm px-8 py-3 rounded-lg text-primary-foreground transition-all duration-200 hover:opacity-90" style={{
          background: '#2D1B69',
          border: '2px solid #C9A84C'
        }}>

            Learn More →
          </Link>
        </div>
      </section>

      <OrnamentalDivider />

      {/* ── CTA BANNER ── */}
      <section className="py-16 px-4 md:px-8 bg-primary relative overflow-hidden">
        {/* Decorative flowers */}
        <div className="absolute left-0 top-0 opacity-10 pointer-events-none">
          <FloralCorner />
        </div>
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
          <FloralCorner flip />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <p className="text-accent text-sm tracking-widest uppercase mb-3">Begin Your Journey</p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Find Your<br /><span className="text-accent">Perfect Match?</span>
          </h2>
          <p className="text-white/70 text-base mb-8 leading-relaxed">Join the families who have trusted us with their most important decision. Register today!

          </p>
          <Link to="/register" className="inline-block font-heading font-bold text-lg px-10 py-4 rounded-xl text-primary transition-all duration-200 hover:scale-105" style={{
          background: '#C9A84C',
          boxShadow: '0 4px 24px rgba(201,168,76,0.4)'
        }}>

            Register Your Profile
          </Link>
        </div>
      </section>
    </div>;
}
